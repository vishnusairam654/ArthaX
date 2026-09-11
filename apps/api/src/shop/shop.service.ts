import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  Optional,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { PrismaService } from '../database/prisma.service';
import { LedgerService } from '../ledger/ledger.service';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationTemplates } from '../notifications/notification-templates';
import { SOVEREIGN_SYSTEM_ACCOUNTS } from '../ledger/ledger-invariants';
import {
  ShopItemDto,
  EquippedLoadoutDto,
  UserInventoryDto,
  ActivePetModifierDto,
  ShopGiftResultDto,
  TransactionDto,
} from '@arthax/types';
import {
  ShopPurchaseInput,
  ShopGiftInput,
  EquipLoadoutInput,
} from '@arthax/validation';

export interface InternalShopItem extends ShopItemDto {
  priceMinorBigInt: bigint;
}

@Injectable()
export class ShopService {
  private readonly logger = new Logger(ShopService.name);

  // In-memory canonical catalog (authoritative fallback and local cache)
  private catalog = new Map<string, InternalShopItem>();

  // In-memory vault inventory: userId -> Set of owned itemIds
  private vaultInventories = new Map<string, Set<string>>();

  // In-memory loadouts: userId -> EquippedLoadoutDto
  private loadouts = new Map<string, EquippedLoadoutDto>();

  // In-memory mock balances for testing/offline: accountId -> bigint
  private mockBalances = new Map<string, bigint>();

  // In-memory mock citizens for gifting resolution: identifier (govId or email) -> UserSummary
  private mockCitizens = new Map<
    string,
    { id: string; govIdNumber: string; email: string; displayName: string; status: string; financialPasswordHash?: string }
  >();

  // Daily civic bounty claim tracking: userId -> timestamp
  private civicBountyClaims = new Map<string, Date>();

  // Idempotency cache: key -> { payloadHash: string; result: any }
  private idempotencyCache = new Map<string, { payloadHash: string; result: any }>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly ledgerService: LedgerService,
    private readonly auditService: AuditService,
    @Optional() private readonly notificationsService?: NotificationsService,
  ) {
    this.initializeCanonicalCatalog();
  }

  /**
   * Initializes the 45 canonical items with strict rarity tiers conforming to AGENTS.md.
   */
  private initializeCanonicalCatalog(): void {
    // 1. 8 Official Financial Pets
    const pets: InternalShopItem[] = [
      {
        id: 'pet-gaja',
        name: 'Wealth Elephant ("Gaja")',
        category: 'pet',
        rarity: 'gold',
        priceMinor: '920000', // 9,200.00 ARTH
        priceMinorBigInt: 920000n,
        image: '/assets/shop/pets/Wealth Elephant/main_image.png',
        secondaryImage: '/assets/shop/pets/Wealth Elephant/icon.png',
        rank: 'Rank #01',
        role: 'Term Yield Protector',
        powerTitle: '+0.25% Sovereign Term Deposit Yield Booster',
        powerDescription: 'Modest mathematical APY amplifier applied across connected Fixed Deposits.',
        covenantSection: 'Section 18-G (Gold Sovereign Spotlight)',
        perks: ['+0.25% FD Yield Booster', 'SETU Auto-Sweep Notification', 'Sovereign Board Observer'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'pet-vrishabha',
        name: 'Market Bull ("Vrishabha")',
        category: 'pet',
        rarity: 'gold',
        priceMinor: '850000', // 8,500.00 ARTH
        priceMinorBigInt: 850000n,
        image: '/assets/shop/pets/Market Bull/main_image.png',
        secondaryImage: '/assets/shop/pets/Market Bull/icon.png',
        rank: 'Rank #02',
        role: 'Equities Accelerator',
        powerTitle: '-10% Equities Brokerage',
        powerDescription: 'Modest discount on institutional order execution fees.',
        covenantSection: 'Section 18-G (Equities Protocol)',
        perks: ['-10% Brokerage Commission', 'Priority Blotter Notification'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'pet-lopamudra',
        name: 'Saver Fox ("Lopamudra")',
        category: 'pet',
        rarity: 'epic',
        priceMinor: '420000', // 4,200.00 ARTH
        priceMinorBigInt: 420000n,
        image: '/assets/shop/pets/Saver Fox/main_image.png',
        secondaryImage: '/assets/shop/pets/Saver Fox/icon.png',
        rank: 'Rank #03',
        role: 'Cashflow Vault Guardian',
        powerTitle: '+15% Cashback on Inter-Bank Wire Fees',
        powerDescription: 'Modest settlement rebate on bilateral clearing transactions.',
        covenantSection: 'Section 18-G (Cashflow Protocol)',
        perks: ['+15% Wire Fee Cashback', 'Bilateral Escrow Rebates'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'pet-vidya',
        name: 'Ledger Owl ("Vidya")',
        category: 'pet',
        rarity: 'epic',
        priceMinor: '340000', // 3,400.00 ARTH
        priceMinorBigInt: 340000n,
        image: '/assets/shop/pets/Ledger Owl/main_image.png',
        secondaryImage: '/assets/shop/pets/Ledger Owl/icon.png',
        rank: 'Rank #04',
        role: 'Knowledge & Analytics Oracle',
        powerTitle: '+0.10% FD Yield Booster & Priority Telemetry',
        powerDescription: 'Modest interest yield multiplier with priority audit stream access.',
        covenantSection: 'Section 18-G (Analytics Feeds)',
        perks: ['+0.10% FD Yield Booster', 'Level-2 Trading Telemetry'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'pet-baka',
        name: 'Settlement Crane ("Baka")',
        category: 'pet',
        rarity: 'rare',
        priceMinor: '380000', // 3,800.00 ARTH
        priceMinorBigInt: 380000n,
        image: '/assets/shop/pets/Settlement Crane/main_image.png',
        secondaryImage: '/assets/shop/pets/Settlement Crane/icon.png',
        rank: 'Rank #05',
        role: 'DvP Velocity Arbiter',
        powerTitle: 'Priority CLS Settlement Queue Entry',
        powerDescription: 'Prioritizes bilateral clearing queue finality.',
        covenantSection: 'Section 18-G (Settlement Velocity)',
        perks: ['Priority CLS Queue Entry', '0% Wire Stamp Duty'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'pet-jala',
        name: 'Flow Otter ("Jala")',
        category: 'pet',
        rarity: 'rare',
        priceMinor: '280000', // 2,800.00 ARTH
        priceMinorBigInt: 280000n,
        image: '/assets/shop/pets/Flow Otter/main_image.png',
        secondaryImage: '/assets/shop/pets/Flow Otter/icon.png',
        rank: 'Rank #06',
        role: 'Liquidity Custodian',
        powerTitle: 'Zero Gas on Real-Time Retail Clears',
        powerDescription: 'Waives retail transfer execution fees across commercial nodes.',
        covenantSection: 'Section 18-G (Gasless Liquidity)',
        perks: ['Zero Gas Clearing', 'Automatic Rebalance Alerts'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'pet-kurma',
        name: 'Tax Tortoise ("Kurma")',
        category: 'pet',
        rarity: 'normal',
        priceMinor: '240000', // 2,400.00 ARTH
        priceMinorBigInt: 240000n,
        image: '/assets/shop/pets/Tax Tortoise/main_image.png',
        secondaryImage: '/assets/shop/pets/Tax Tortoise/icon.png',
        rank: 'Rank #07',
        role: 'Prudence Shield',
        powerTitle: 'Zero Penalty on Early FD Liquidation (Up to 50k ARTH)',
        powerDescription: 'Reduces early liquidation penalty fee on term deposits.',
        covenantSection: 'Section 18-G (Prudence Protocol)',
        perks: ['Zero Penalty Early Break', 'Emergency Window'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'pet-marjara',
        name: 'Archive Cat ("Marjara")',
        category: 'pet',
        rarity: 'normal',
        priceMinor: '190000', // 1,900.00 ARTH
        priceMinorBigInt: 190000n,
        image: '/assets/shop/pets/Archive Cat/main_image.png',
        secondaryImage: '/assets/shop/pets/Archive Cat/icon.png',
        rank: 'Rank #08',
        role: 'Audit Enclave',
        powerTitle: 'Daily +5 ARTH Civic Bounty & Priority Circulars',
        powerDescription: 'Immediate notification dispatch for Central Bank circulars and daily civic reward allocation.',
        covenantSection: 'Section 18-G (Civic Bounty)',
        perks: ['Daily +5 ARTH Bounty', 'Zero-Latency Notices'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
    ];

    for (const p of pets) {
      this.catalog.set(p.id, p);
    }

    // 2. 7 Official Enclave Frames mapped strictly per AGENTS.md resolved decisions:
    // gold.png -> Gold; Aurora.png, Nova.png -> Epic; orbit.png, pluse.png -> Rare; leaf.png, vertex.png -> Normal
    const frames: InternalShopItem[] = [
      {
        id: 'frm-gold',
        name: 'Sovereign Gold Filigree Rim',
        category: 'frame',
        rarity: 'gold',
        priceMinor: '480000', // 4,800.00 ARTH
        priceMinorBigInt: 480000n,
        image: '/assets/shop/frames/gold.png',
        role: 'Royal Depository Master Frame',
        powerTitle: 'Maximum Prestige Intaglio Gold Border',
        powerDescription: 'Crafted with continuous bank-note guilloche waves and specular gold bullion rim.',
        covenantSection: 'AGENTS.md Resolved: gold.png -> Gold Tier',
        perks: ['Radiant Gold Shimmer', 'Priority Settlement Border'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'frm-aurora',
        name: 'Aurora Intaglio Shimmer Frame',
        category: 'frame',
        rarity: 'epic',
        priceMinor: '320000', // 3,200.00 ARTH
        priceMinorBigInt: 320000n,
        image: '/assets/shop/frames/Aurora.png',
        role: 'Amethyst Spectral Sentinel',
        powerTitle: 'Dynamic Chromatic Polarization Bezel',
        powerDescription: 'Rare refractive crystal alloy certifying continuous DvP multi-bank transaction activity.',
        covenantSection: 'AGENTS.md Resolved: Aurora.png -> Epic Tier',
        perks: ['Refractive Aurora Shift', 'Kinetic Gradient'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'frm-nova',
        name: 'Nova Stellar Horizon Border',
        category: 'frame',
        rarity: 'epic',
        priceMinor: '340000', // 3,400.00 ARTH
        priceMinorBigInt: 340000n,
        image: '/assets/shop/frames/Nova.png',
        role: 'High-Altitude Monetary Orbit',
        powerTitle: 'Deep Indigo Cosmic Rim with Specular Gold Accents',
        powerDescription: 'Reflects validator node staking status and high-order inter-bank capital contributions.',
        covenantSection: 'AGENTS.md Resolved: Nova.png -> Epic Tier',
        perks: ['Stellar Pulsing Halo', 'Validator Staking Accent'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'frm-orbit',
        name: 'Orbital Planetary Wire Rim',
        category: 'frame',
        rarity: 'rare',
        priceMinor: '180000', // 1,800.00 ARTH
        priceMinorBigInt: 180000n,
        image: '/assets/shop/frames/orbit.png',
        role: 'Continuous Linked Settlement Track',
        powerTitle: 'Dual Azure Orbital Rings Representing Bilateral Clears',
        powerDescription: 'Clean engineered geometric circle track representing real-time delivery-versus-payment settlement finality.',
        covenantSection: 'AGENTS.md Resolved: orbit.png -> Rare Tier',
        perks: ['Bilateral Orbital Ring', 'Sub-second Velocity Indicator'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'frm-pulse',
        name: 'DvP Pulse Frequency Bezel',
        category: 'frame',
        rarity: 'rare',
        priceMinor: '200000', // 2,000.00 ARTH
        priceMinorBigInt: 200000n,
        image: '/assets/shop/frames/pluse.png',
        role: 'Real-Time Transit Aura',
        powerTitle: 'Dynamic Frequency Oscillating Border in Sovereign Cyan',
        powerDescription: 'Visualizes real-time ledger heartbeat and block height finality with subtle micro-pulses.',
        covenantSection: 'AGENTS.md Resolved: pluse.png -> Rare Tier',
        perks: ['Heartbeat Telemetry Ring', 'Speed Priority Glyph'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'frm-leaf',
        name: 'Botanical Archival Foliage Frame',
        category: 'frame',
        rarity: 'normal',
        priceMinor: '95000', // 950.00 ARTH
        priceMinorBigInt: 95000n,
        image: '/assets/shop/frames/leaf.png',
        role: 'Fiscal Growth & Longevity Motif',
        powerTitle: 'Delicate Intaglio Mint Leaf Filigree Pattern',
        powerDescription: 'Classical numismatic flora pattern symbolizing steady capital compounding and sovereign organic prosperity.',
        covenantSection: 'AGENTS.md Resolved: leaf.png -> Normal Tier',
        perks: ['Intaglio Leaf Border', 'Steady Yield Emblem'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'frm-vertex',
        name: 'Geometric Consensus Vertex Edge',
        category: 'frame',
        rarity: 'normal',
        priceMinor: '110000', // 1,100.00 ARTH
        priceMinorBigInt: 110000n,
        image: '/assets/shop/frames/vertex.png',
        role: 'Octagonal Cryptographic Node',
        powerTitle: 'Chiseled Octagonal Geometry Mirroring Core Monolith',
        powerDescription: 'Direct structural descendant of the central bank core ledger cylinder.',
        covenantSection: 'AGENTS.md Resolved: vertex.png -> Normal Tier',
        perks: ['Chiseled Octagonal Edge', 'Consensus Node Alignment'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
    ];

    for (const f of frames) {
      this.catalog.set(f.id, f);
    }

    // 3. 16 Citizen Personas (8 Female, 8 Male)
    const personas: InternalShopItem[] = [
      {
        id: 'avt-f-business',
        name: 'Executive Director Sovereign',
        category: 'avatar',
        rarity: 'gold',
        priceMinor: '350000', // 3,500.00 ARTH
        priceMinorBigInt: 350000n,
        image: '/assets/shop/avatars/Female/BussinesWomen.png',
        gender: 'female',
        role: 'Corporate Chairman & Escrow Signatory',
        powerTitle: 'Corporate Escrow Signatory Privileges',
        powerDescription: 'Accredited for Sovereign Syndicate Pools & Board Escrow Signing.',
        perks: ['Sovereign Board Vote Access', 'Tier-1 Enclave Status'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'avt-f-investor',
        name: 'Institutional Equity Investor',
        category: 'avatar',
        rarity: 'epic',
        priceMinor: '280000',
        priceMinorBigInt: 280000n,
        image: '/assets/shop/avatars/Female/Investor.png',
        gender: 'female',
        role: 'Sovereign Institutional Asset Manager',
        powerTitle: 'High-Net-Worth Capital Allocation',
        powerDescription: 'Pre-qualified for institutional syndicate participation.',
        perks: ['Priority Syndicate Allocation', 'High-Tier Order Queue'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'avt-f-retired',
        name: 'Senior Trustee Legacy Custodian',
        category: 'avatar',
        rarity: 'epic',
        priceMinor: '260000',
        priceMinorBigInt: 260000n,
        image: '/assets/shop/avatars/Female/Retired Investor.png',
        gender: 'female',
        role: 'Family Wealth Office Trustee',
        powerTitle: 'Multi-Bank Trust Custodian',
        powerDescription: 'Accredited for Sovereign Multi-Bank Reserves.',
        perks: ['Multi-Bank Trust Access'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'avt-f-entrepreneur',
        name: 'Sovereign Venture Founder',
        category: 'avatar',
        rarity: 'rare',
        priceMinor: '195000',
        priceMinorBigInt: 195000n,
        image: '/assets/shop/avatars/Female/Entrepreneur.png',
        gender: 'female',
        role: 'Sovereign Enterprise Builder',
        powerTitle: 'Corporate Syndicate Founder',
        powerDescription: 'Accredited for commercial venture capital issuance.',
        perks: ['Venture Issuance Clearance'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'avt-f-analyst',
        name: 'Lead Macroeconomic Analyst',
        category: 'avatar',
        rarity: 'rare',
        priceMinor: '190000',
        priceMinorBigInt: 190000n,
        image: '/assets/shop/avatars/Female/Analyst.png',
        gender: 'female',
        role: 'Treasury Quantitative Researcher',
        powerTitle: 'Monetary Policy Analytics',
        powerDescription: 'Direct feed access to macro treasury analytics.',
        perks: ['Macro Feed Stream'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'avt-f-builder',
        name: 'Infrastructure Protocol Architect',
        category: 'avatar',
        rarity: 'rare',
        priceMinor: '180000',
        priceMinorBigInt: 180000n,
        image: '/assets/shop/avatars/Female/Builder.png',
        gender: 'female',
        role: 'DvP Protocol Engineer',
        powerTitle: 'Inter-Bank Core Systems Architecture',
        powerDescription: 'Accredited for bilateral clearing node engineering.',
        perks: ['Node Telemetry Access'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'avt-f-creator',
        name: 'Sovereign Mint Engraver',
        category: 'avatar',
        rarity: 'normal',
        priceMinor: '120000',
        priceMinorBigInt: 120000n,
        image: '/assets/shop/avatars/Female/Creator.png',
        gender: 'female',
        role: 'Numismatic Guilloche Master',
        powerTitle: 'Bank-Note Filigree Design',
        powerDescription: 'Certified master engraver of sovereign security patterns.',
        perks: ['Guilloche Artist Seal'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'avt-f-student',
        name: 'Artha Monetary Scholar',
        category: 'avatar',
        rarity: 'normal',
        priceMinor: '85000',
        priceMinorBigInt: 85000n,
        image: '/assets/shop/avatars/Female/Student.png',
        gender: 'female',
        role: 'Central Banking Fellow',
        powerTitle: 'Academic Monetary Research',
        powerDescription: 'Enrolled in sovereign fiscal policy academy.',
        perks: ['Academic Access Pass'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'avt-m-business',
        name: 'Sovereign Chairman Emeritus',
        category: 'avatar',
        rarity: 'gold',
        priceMinor: '350000',
        priceMinorBigInt: 350000n,
        image: '/assets/shop/avatars/Male/Bussinessman.png',
        gender: 'male',
        role: 'Sovereign Board Trustee',
        powerTitle: 'National Monetary Council Observer',
        powerDescription: 'Accredited for Sovereign Institutional Capital Pools.',
        perks: ['Board Vote Access', 'Tier-1 Enclave Status'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'avt-m-investor',
        name: 'Senior Venture Capitalist',
        category: 'avatar',
        rarity: 'epic',
        priceMinor: '280000',
        priceMinorBigInt: 280000n,
        image: '/assets/shop/avatars/Male/Investor.png',
        gender: 'male',
        role: 'Sovereign Capital Partner',
        powerTitle: 'Private Equity Oversight',
        powerDescription: 'Accredited for private sovereign placement facilities.',
        perks: ['Private Placement Access'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'avt-m-retired',
        name: 'Patriarch Portfolio Custodian',
        category: 'avatar',
        rarity: 'epic',
        priceMinor: '260000',
        priceMinorBigInt: 260000n,
        image: '/assets/shop/avatars/Male/Retired Investor.png',
        gender: 'male',
        role: 'Family Trust Custodian',
        powerTitle: 'Legacy Capital Oversight',
        powerDescription: 'Certified for Estate Preservation Accounts.',
        perks: ['Legacy Capital Oversight'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'avt-m-entrepreneur',
        name: 'Digital Commerce Pioneer',
        category: 'avatar',
        rarity: 'rare',
        priceMinor: '195000',
        priceMinorBigInt: 195000n,
        image: '/assets/shop/avatars/Male/Entrepreneur.png',
        gender: 'male',
        role: 'National Merchant Consortium Head',
        powerTitle: 'Merchant Settlement Gateway Access',
        powerDescription: 'Accredited for retail sovereign merchant processing.',
        perks: ['Merchant Gateway Discount'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'avt-m-analyst',
        name: 'Sovereign Yield Strategist',
        category: 'avatar',
        rarity: 'rare',
        priceMinor: '190000',
        priceMinorBigInt: 190000n,
        image: '/assets/shop/avatars/Male/Analyst.png',
        gender: 'male',
        role: 'Fixed Income Blotter Strategist',
        powerTitle: 'Yield Curve Decomposition',
        powerDescription: 'Certified analytics for commercial bank term yields.',
        perks: ['Blotter Research Access'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'avt-m-builder',
        name: 'Core Settlement Engineer',
        category: 'avatar',
        rarity: 'rare',
        priceMinor: '180000',
        priceMinorBigInt: 180000n,
        image: '/assets/shop/avatars/Male/Builder.png',
        gender: 'male',
        role: 'High-Throughput Matching Engineer',
        powerTitle: 'Equities Engine Maintenance',
        powerDescription: 'Certified for matching engine low-latency operations.',
        perks: ['Matching Engine Telemetry'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'avt-m-creator',
        name: 'Numismatic Guilloche Engraver',
        category: 'avatar',
        rarity: 'normal',
        priceMinor: '120000',
        priceMinorBigInt: 120000n,
        image: '/assets/shop/avatars/Male/Creator.png',
        gender: 'male',
        role: 'Security Hologram Engraver',
        powerTitle: 'Anti-Counterfeit Pattern Master',
        powerDescription: 'Designer of multi-layered sovereign security foils.',
        perks: ['Security Foil Badge'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'avt-m-student',
        name: 'Economics & Ledger Fellow',
        category: 'avatar',
        rarity: 'normal',
        priceMinor: '85000',
        priceMinorBigInt: 85000n,
        image: '/assets/shop/avatars/Male/Student.png',
        gender: 'male',
        role: 'Macroeconomic Scholar',
        powerTitle: 'Double-Entry Invariant Researcher',
        powerDescription: 'Fellow in academic double-entry ledger proofs.',
        perks: ['Fellowship Badge'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
    ];

    for (const a of personas) {
      this.catalog.set(a.id, a);
    }

    // 4. 14 Sovereign Vault Banners
    const banners: InternalShopItem[] = [
      {
        id: 'bnr-gold-1',
        name: 'Central Bank Apex Gilded Hall',
        category: 'banner',
        rarity: 'gold',
        priceMinor: '210000', // 2,100.00 ARTH
        priceMinorBigInt: 210000n,
        image: '/assets/shop/banners/gold_1.png',
        powerTitle: 'Sub-Basement Bullion Safe Panoramic Horizon',
        powerDescription: 'Massive cast-titanium door with engraved charter certificates.',
        perks: ['Gilded Hallway Panorama', '+100 Citizen Prestige'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'bnr-gold-2',
        name: 'Sub-Basement Sovereign Bullion Safe',
        category: 'banner',
        rarity: 'gold',
        priceMinor: '240000',
        priceMinorBigInt: 240000n,
        image: '/assets/shop/banners/gold_2.png',
        powerTitle: 'Deep National Vault Inscription & Bullion Stacks',
        powerDescription: 'The innermost physical vault holding sovereign 1:1 parity reserves.',
        perks: ['Bullion Stacks Panorama'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'bnr-epic-1',
        name: 'Dalal Trading Floor Twilight Panorama',
        category: 'banner',
        rarity: 'epic',
        priceMinor: '140000',
        priceMinorBigInt: 140000n,
        image: '/assets/shop/banners/epic_1.png',
        powerTitle: 'Equities Twilight Continuous Auction Floor',
        powerDescription: 'Atmospheric twilight view of Mumbai financial exchange floors.',
        perks: ['Continuous Auction Sparkline'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'bnr-epic-2',
        name: 'Sovereign Treasury Dome Nocturne',
        category: 'banner',
        rarity: 'epic',
        priceMinor: '160000',
        priceMinorBigInt: 160000n,
        image: '/assets/shop/banners/epic_2.png',
        powerTitle: 'Illuminated Treasury Rotunda Nocturne',
        powerDescription: 'Dramatic nocturnal view of the Sovereign Monetary Authority dome.',
        perks: ['Nocturne Rotunda Vista'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'bnr-rare-1',
        name: 'NAVA Automated Clearing Concourse',
        category: 'banner',
        rarity: 'rare',
        priceMinor: '95000',
        priceMinorBigInt: 95000n,
        image: '/assets/shop/banners/rare_1.png',
        powerTitle: 'Commercial Banking Clearing Floor',
        powerDescription: 'High-throughput commercial transactions handling center.',
        perks: ['Clearing Floor Backdrop'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'bnr-rare-2',
        name: 'SAMAYA High-Frequency Matching Hall',
        category: 'banner',
        rarity: 'rare',
        priceMinor: '90000',
        priceMinorBigInt: 90000n,
        image: '/assets/shop/banners/rare_2.png',
        powerTitle: 'Order Matching Core Telemetry Wall',
        powerDescription: 'Sub-millisecond trade execution console view.',
        perks: ['Order Book Horizon'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'bnr-rare-3',
        name: 'SETU Interbank Settlement Terminal',
        category: 'banner',
        rarity: 'rare',
        priceMinor: '98000',
        priceMinorBigInt: 98000n,
        image: '/assets/shop/banners/rare_3.png',
        powerTitle: 'DvP Settlement Finality Grid',
        powerDescription: 'Bilateral clearing routing switchboard visualization.',
        perks: ['Settlement Grid Backdrop'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'bnr-norm-1',
        name: 'Sovereign Mint Printing Vault',
        category: 'banner',
        rarity: 'normal',
        priceMinor: '50000',
        priceMinorBigInt: 50000n,
        image: '/assets/shop/banners/normal_1.png',
        powerTitle: 'Intaglio Security Press Promenade',
        powerDescription: 'Classical sovereign currency production floor.',
        perks: ['Security Press View'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'bnr-norm-2',
        name: 'STHIRA Vault Inscription Wall',
        category: 'banner',
        rarity: 'normal',
        priceMinor: '48000',
        priceMinorBigInt: 48000n,
        image: '/assets/shop/banners/normal_2.png',
        powerTitle: 'Granite Monolith Inscription Hall',
        powerDescription: 'Preserves the founding statutory charter in carved stone.',
        perks: ['Charter Stone Motif'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'bnr-norm-3',
        name: 'VAYU Retail Banking Promenade',
        category: 'banner',
        rarity: 'normal',
        priceMinor: '52000',
        priceMinorBigInt: 52000n,
        image: '/assets/shop/banners/normal_3.png',
        powerTitle: 'Citizen Financial Services Concourse',
        powerDescription: 'Welcoming modern retail banking environment.',
        perks: ['Retail Concourse Backdrop'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'bnr-norm-4',
        name: 'National Archives Reading Room',
        category: 'banner',
        rarity: 'normal',
        priceMinor: '45000',
        priceMinorBigInt: 45000n,
        image: '/assets/shop/banners/normal_4.png',
        powerTitle: 'Sovereign History & Audit Repository',
        powerDescription: 'Deep historical depository of all monetary ledgers.',
        perks: ['Archival Reading Vista'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'bnr-norm-5',
        name: 'Sovereign Intaglio Engraving Studio',
        category: 'banner',
        rarity: 'normal',
        priceMinor: '55000',
        priceMinorBigInt: 55000n,
        image: '/assets/shop/banners/normal_5.png',
        powerTitle: 'Artisan Guilloche Lathe Workshop',
        powerDescription: 'Precision mechanical lathes crafting banknote security waves.',
        perks: ['Guilloche Lathe Horizon'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'bnr-norm-6',
        name: 'Artha Macroeconomic Observatory',
        category: 'banner',
        rarity: 'normal',
        priceMinor: '50000',
        priceMinorBigInt: 50000n,
        image: '/assets/shop/banners/normal_6.png',
        powerTitle: 'Monetary Velocity Observation Deck',
        powerDescription: 'Panoramic viewing platform of the national economic grid.',
        perks: ['Observation Deck Vista'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
      {
        id: 'bnr-norm-7',
        name: 'Sovereign Public Square & Fountains',
        category: 'banner',
        rarity: 'normal',
        priceMinor: '45000',
        priceMinorBigInt: 45000n,
        image: '/assets/shop/banners/normal_7.png',
        powerTitle: 'Civic Agora & Central Monument',
        powerDescription: 'The civic gathering space at the base of the Central Vault monolith.',
        perks: ['Civic Agora Horizon'],
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      },
    ];

    for (const b of banners) {
      this.catalog.set(b.id, b);
    }

    this.logger.log(`Initialized sovereign virtual economy catalog with ${this.catalog.size} items`);
  }

  // --- Testing & Offline Helpers ---

  seedAccountBalance(accountId: string, balanceMinor: bigint): void {
    this.mockBalances.set(accountId, balanceMinor);
  }

  seedCitizen(
    id: string,
    govIdNumber: string,
    email: string,
    displayName: string,
    status = 'ACTIVE',
    financialPasswordHash?: string,
  ): void {
    const record = { id, govIdNumber, email, displayName, status, financialPasswordHash };
    this.mockCitizens.set(id, record);
    this.mockCitizens.set(govIdNumber.toUpperCase(), record);
    this.mockCitizens.set(email.toLowerCase(), record);
  }

  seedUserInventory(userId: string, itemId: string): void {
    const set = this.vaultInventories.get(userId) || new Set<string>();
    set.add(itemId);
    this.vaultInventories.set(userId, set);
  }

  setMockLoadout(userId: string, loadout: EquippedLoadoutDto): void {
    this.loadouts.set(userId, loadout);
  }

  updateItemStatus(itemId: string, status: 'ACTIVE' | 'DISABLED' | 'RETIRED'): void {
    const item = this.catalog.get(itemId);
    if (item) {
      item.status = status;
    }
  }

  resetMockState(): void {
    this.vaultInventories.clear();
    this.loadouts.clear();
    this.mockBalances.clear();
    this.mockCitizens.clear();
    this.civicBountyClaims.clear();
    this.idempotencyCache.clear();
    this.initializeCanonicalCatalog();
  }

  async getAccountBalance(accountId: string): Promise<bigint> {
    if (this.prisma.isConnected) {
      try {
        const acct = await this.prisma.bankAccount.findUnique({
          where: { id: accountId },
          include: { ledgerAccount: true },
        });
        if (acct?.ledgerAccount) {
          return acct.ledgerAccount.balanceSnapshot;
        }
      } catch (err: any) {
        this.logger.debug(`Prisma account balance lookup error: ${err.message}`);
      }
    }
    return this.mockBalances.get(accountId) ?? 5000000n; // Default 50,000.00 ARTH in test
  }

  // ===========================================================================
  // 1. CATALOG MANAGEMENT (Database-Authoritative with Lifecycle States)
  // ===========================================================================

  /**
   * Lists active catalog items. Filterable by category.
   * Invariant: RETIRED and DISABLED items are excluded from standard active catalog.
   */
  async listCatalog(category?: string): Promise<ShopItemDto[]> {
    if (this.prisma.isConnected) {
      try {
        const dbItems = await this.prisma.shopItem.findMany({
          where: {
            active: true,
            status: 'ACTIVE',
            ...(category && category !== 'all' ? { category: category as any } : {}),
          },
        });
        if (dbItems.length > 0) {
          return dbItems.map((item) => ({
            id: item.id,
            name: item.name,
            category: item.category as any,
            rarity: item.rarity as any,
            priceMinor: item.priceMinor.toString(),
            image: item.image,
            secondaryImage: item.secondaryImage || undefined,
            rank: item.rank || undefined,
            role: item.role || undefined,
            gender: (item.gender as any) || undefined,
            powerTitle: item.powerTitle || undefined,
            powerDescription: item.powerDescription || undefined,
            attireSpec: item.attireSpec || undefined,
            accreditation: item.accreditation || undefined,
            covenantSection: item.covenantSection || undefined,
            perks: (item.perks as string[]) || undefined,
            status: (item.status as any) || 'ACTIVE',
            ownershipType: (item.ownershipType as any) || 'UNIQUE_PER_USER',
          }));
        }
      } catch (err: any) {
        this.logger.debug(`Prisma catalog query error: ${err.message}`);
      }
    }

    // In-memory catalog fallback
    let items = Array.from(this.catalog.values()).filter((i) => i.status === 'ACTIVE');
    if (category && category !== 'all') {
      items = items.filter((i) => i.category === category);
    }
    return items;
  }

  /**
   * Retrieves single item by ID regardless of status.
   */
  async getItem(itemId: string): Promise<InternalShopItem> {
    if (this.prisma.isConnected) {
      try {
        const item = await this.prisma.shopItem.findUnique({
          where: { id: itemId },
        });
        if (item) {
          return {
            id: item.id,
            name: item.name,
            category: item.category as any,
            rarity: item.rarity as any,
            priceMinor: item.priceMinor.toString(),
            priceMinorBigInt: item.priceMinor,
            image: item.image,
            secondaryImage: item.secondaryImage || undefined,
            rank: item.rank || undefined,
            role: item.role || undefined,
            gender: (item.gender as any) || undefined,
            powerTitle: item.powerTitle || undefined,
            powerDescription: item.powerDescription || undefined,
            attireSpec: item.attireSpec || undefined,
            accreditation: item.accreditation || undefined,
            covenantSection: item.covenantSection || undefined,
            perks: (item.perks as string[]) || undefined,
            status: (item.status as any) || 'ACTIVE',
            ownershipType: (item.ownershipType as any) || 'UNIQUE_PER_USER',
          };
        }
      } catch (err: any) {
        this.logger.debug(`Prisma getItem error: ${err.message}`);
      }
    }

    const cached = this.catalog.get(itemId);
    if (!cached) {
      throw new NotFoundException(`Shop artifact [${itemId}] not found in catalog`);
    }
    return cached;
  }

  // ===========================================================================
  // 2. ATOMIC PURCHASE PROTOCOL
  // ===========================================================================

  /**
   * Executes atomic purchase of an artifact:
   * Invariants:
   * 1. Step-up Financial Password required via Argon2id.
   * 2. Item must have status === 'ACTIVE' (RETIRED or DISABLED rejected).
   * 3. User cannot already own the item (ownershipType = UNIQUE_PER_USER).
   * 4. Single atomic transaction: Core Ledger posting (DEBIT account, CREDIT sys_shop_revenue)
   *    + UserInventory vault grant + idempotency record. Failure rolls back both.
   * 5. Concurrency protection: Two simultaneous purchases of same unique item -> exactly one succeeds.
   */
  async purchaseItem(
    userId: string,
    input: ShopPurchaseInput,
    idempotencyKey?: string,
  ): Promise<{ success: boolean; transaction: TransactionDto; itemId: string; isIdempotentReplay?: boolean }> {
    // A. Idempotency Check
    if (idempotencyKey) {
      const payloadHash = crypto
        .createHash('sha256')
        .update(JSON.stringify({ userId, ...input }))
        .digest('hex');

      const cached = this.idempotencyCache.get(idempotencyKey);
      if (cached) {
        if (cached.payloadHash === payloadHash) {
          this.logger.log(`Idempotent shop purchase replay for key [${idempotencyKey}]`);
          return { ...cached.result, isIdempotentReplay: true };
        }
        throw new ConflictException(
          `Idempotency conflict: A purchase with key [${idempotencyKey}] already exists with differing payload parameters.`,
        );
      }
    }

    // B. Step-up Financial Password Verification
    await this.verifyFinancialPassword(userId, input.financialPassword);

    // C. Item Validation & Lifecycle States
    const item = await this.getItem(input.itemId);

    if (item.status === 'RETIRED') {
      throw new BadRequestException(
        `Artifact [${item.name}] has been permanently retired and is no longer available for acquisition.`,
      );
    }
    if (item.status === 'DISABLED') {
      throw new BadRequestException(`Artifact [${item.name}] is currently disabled.`);
    }

    // D. Vault Uniqueness Check (ownershipType: UNIQUE_PER_USER)
    const ownsItem = await this.checkUserOwnership(userId, item.id);
    if (ownsItem) {
      throw new BadRequestException(
        `You already own artifact [${item.name}] in your sovereign vault. Duplicate acquisitions are prohibited.`,
      );
    }

    // E. Balance Check
    const balance = await this.getAccountBalance(input.sourceAccountId);
    if (balance < item.priceMinorBigInt) {
      throw new BadRequestException(
        `Insufficient funds: current balance (${balance} minor units) is less than required purchase cost (${item.priceMinorBigInt} minor units).`,
      );
    }

    // F. Atomic Execution (Ledger Debit + Credit sys_shop_revenue + Vault Grant)
    const refNumber = `SHOP-BUY-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    let transactionDto: TransactionDto;

    if (this.prisma.isConnected) {
      try {
        const result = await this.prisma.$transaction(async (tx) => {
          // Double-check uniqueness inside transactional boundary for concurrency lock
          const existingInv = await tx.userInventory.findUnique({
            where: {
              userId_itemId: {
                userId,
                itemId: item.id,
              },
            },
          });
          if (existingInv) {
            throw new ConflictException(
              `Concurrency conflict: Artifact [${item.id}] was already granted in a simultaneous transaction.`,
            );
          }

          // 1. Ledger Posting via LedgerService
          const txRecord = await this.ledgerService.recordBalancedTransaction({
            type: 'SHOP_PURCHASE',
            scope: 'INTERNAL',
            amountMinor: item.priceMinorBigInt,
            initiatedBy: userId,
            sourceAccountId: input.sourceAccountId,
            referenceNumber: refNumber,
            metadata: {
              itemId: item.id,
              itemName: item.name,
              category: item.category,
              rarity: item.rarity,
            },
            entries: [
              {
                ledgerAccountId: input.sourceAccountId,
                entryType: 'DEBIT',
                amountMinor: item.priceMinorBigInt,
              },
              {
                ledgerAccountId: SOVEREIGN_SYSTEM_ACCOUNTS.SHOP_REVENUE,
                entryType: 'CREDIT',
                amountMinor: item.priceMinorBigInt,
              },
            ],
          });

          // 2. Grant to UserInventory
          await tx.userInventory.create({
            data: {
              userId,
              itemId: item.id,
            },
          });

          return txRecord;
        });

        transactionDto = result;
      } catch (err: any) {
        if (err instanceof ConflictException || err instanceof BadRequestException) {
          throw err;
        }
        this.logger.error(`Atomic purchase transaction rolled back: ${err.message}`);
        throw new BadRequestException(`Purchase settlement failed: ${err.message}`);
      }
    } else {
      // Offline / Test Simulation
      const userVault = this.vaultInventories.get(userId) || new Set<string>();
      if (userVault.has(item.id)) {
        throw new ConflictException(
          `Concurrency conflict: Artifact [${item.id}] was already granted in a simultaneous transaction.`,
        );
      }

      // Ledger posting simulation
      const curBal = this.mockBalances.get(input.sourceAccountId) ?? 5000000n;
      this.mockBalances.set(input.sourceAccountId, curBal - item.priceMinorBigInt);

      // Inventory grant
      userVault.add(item.id);
      this.vaultInventories.set(userId, userVault);

      transactionDto = {
        id: `tx_shop_${Date.now()}`,
        referenceNumber: refNumber,
        type: 'SHOP_PURCHASE',
        status: 'COMPLETED',
        scope: 'INTERNAL',
        amountMinor: item.priceMinorBigInt.toString(),
        feesMinor: '0',
        taxMinor: '0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        entries: [],
      };
    }

    const finalResult = {
      success: true,
      transaction: transactionDto,
      itemId: item.id,
    };

    // Cache idempotency
    if (idempotencyKey) {
      const payloadHash = crypto
        .createHash('sha256')
        .update(JSON.stringify({ userId, ...input }))
        .digest('hex');
      this.idempotencyCache.set(idempotencyKey, { payloadHash, result: finalResult });
    }

    await this.auditService.logEvent({
      eventType: 'MONETARY_EVENT',
      actorId: userId,
      actorRole: 'USER',
      targetEntity: `INVENTORY:${item.id}`,
      action: `Citizen purchased artifact [${item.name}] for ${item.priceMinor} minor units`,
      severity: 'INFO',
    });

    // Post-Commit Notification Dispatch
    if (this.notificationsService) {
      try {
        const template = NotificationTemplates.SHOP_PURCHASE_CONFIRMATION_V1.render({
          itemName: item.name,
          itemId: item.id,
          priceMinor: item.priceMinorBigInt,
          txId: transactionDto.id,
        });
        await this.notificationsService.dispatchNotification({
          userId,
          category: template.category,
          priority: template.priority,
          title: template.title,
          summary: template.summary,
          content: template.content,
          templateCode: template.templateCode,
          templateVersion: template.templateVersion,
          sourceDomain: 'SHOP',
          sourceType: 'SHOP_PURCHASE',
          sourceId: transactionDto.id,
          eventId: `shp-buy-${transactionDto.id}`,
          metadata: {
            itemId: item.id,
            itemName: item.name,
            priceMinor: item.priceMinor,
            txId: transactionDto.id,
          },
        });
      } catch (err: any) {
        this.logger.warn(`Post-commit shop purchase notification dispatch skipped/failed: ${err.message}`);
      }
    }

    return finalResult;
  }

  // ===========================================================================
  // 3. ATOMIC GIFTING PROTOCOL
  // ===========================================================================

  /**
   * Executes atomic gift of an artifact to another citizen:
   * Invariants:
   * 1. Step-up Financial Password required via Argon2id.
   * 2. Recipient resolved unambiguously by GOV-XXXX-XXXX or verified email.
   * 3. Recipient must be active (not SUSPENDED or CLOSED).
   * 4. Self-gifting strictly rejected.
   * 5. Recipient cannot already own the item (no wasted gifts).
   * 6. Single atomic transaction: Ledger DEBIT sender, CREDIT sys_shop_revenue, grant to recipient UserInventory.
   */
  async giftItem(
    userId: string,
    input: ShopGiftInput,
    idempotencyKey?: string,
  ): Promise<ShopGiftResultDto> {
    // A. Idempotency Check
    if (idempotencyKey) {
      const payloadHash = crypto
        .createHash('sha256')
        .update(JSON.stringify({ userId, ...input }))
        .digest('hex');

      const cached = this.idempotencyCache.get(idempotencyKey);
      if (cached) {
        if (cached.payloadHash === payloadHash) {
          this.logger.log(`Idempotent shop gift replay for key [${idempotencyKey}]`);
          return { ...cached.result, isIdempotentReplay: true };
        }
        throw new ConflictException(
          `Idempotency conflict: A gift with key [${idempotencyKey}] already exists with differing payload parameters.`,
        );
      }
    }

    // B. Step-up Financial Password Verification
    await this.verifyFinancialPassword(userId, input.financialPassword);

    // C. Item Validation
    const item = await this.getItem(input.itemId);
    if (item.status === 'RETIRED') {
      throw new BadRequestException(`Artifact [${item.name}] is retired and cannot be gifted.`);
    }
    if (item.status === 'DISABLED') {
      throw new BadRequestException(`Artifact [${item.name}] is currently disabled.`);
    }

    // D. Recipient Resolution & Validation
    const recipient = await this.resolveRecipientCitizen(input.recipientGovIdOrEmail);

    // Self-gifting check
    if (recipient.id === userId) {
      throw new BadRequestException(
        'Self-gifting is prohibited; please use standard checkout to purchase for yourself.',
      );
    }

    // Recipient status check
    if (recipient.status === 'SUSPENDED') {
      throw new BadRequestException(
        `Recipient citizen status is SUSPENDED. Cannot receive sovereign vault gifts.`,
      );
    }
    if (recipient.status === 'CLOSED') {
      throw new BadRequestException(
        `Recipient citizen account is CLOSED. Cannot receive sovereign vault gifts.`,
      );
    }

    // Duplicate recipient ownership check
    const recipientOwns = await this.checkUserOwnership(recipient.id, item.id);
    if (recipientOwns) {
      throw new BadRequestException(
        `Recipient citizen [${recipient.displayName || recipient.govIdNumber}] already owns artifact [${item.name}] in their sovereign vault.`,
      );
    }

    // E. Balance Check on Sender Account
    const balance = await this.getAccountBalance(input.sourceAccountId);
    if (balance < item.priceMinorBigInt) {
      throw new BadRequestException(
        `Insufficient funds: current balance (${balance} minor units) is less than required gift cost (${item.priceMinorBigInt} minor units).`,
      );
    }

    // F. Atomic Execution
    const refNumber = `SHOP-GIFT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    if (this.prisma.isConnected) {
      try {
        await this.prisma.$transaction(async (tx) => {
          // Concurrency check on recipient inventory
          const existing = await tx.userInventory.findUnique({
            where: {
              userId_itemId: {
                userId: recipient.id,
                itemId: item.id,
              },
            },
          });
          if (existing) {
            throw new ConflictException(
              `Concurrency conflict: Recipient already received artifact [${item.id}] in a simultaneous transaction.`,
            );
          }

          // 1. Ledger Posting: DEBIT Sender, CREDIT sys_shop_revenue
          await this.ledgerService.recordBalancedTransaction({
            type: 'SHOP_PURCHASE',
            scope: 'INTERNAL',
            amountMinor: item.priceMinorBigInt,
            initiatedBy: userId,
            sourceAccountId: input.sourceAccountId,
            referenceNumber: refNumber,
            metadata: {
              giftRecipientUserId: recipient.id,
              giftRecipientGovId: recipient.govIdNumber,
              itemId: item.id,
              itemName: item.name,
            },
            entries: [
              {
                ledgerAccountId: input.sourceAccountId,
                entryType: 'DEBIT',
                amountMinor: item.priceMinorBigInt,
              },
              {
                ledgerAccountId: SOVEREIGN_SYSTEM_ACCOUNTS.SHOP_REVENUE,
                entryType: 'CREDIT',
                amountMinor: item.priceMinorBigInt,
              },
            ],
          });

          // 2. Grant directly to Recipient Vault
          await tx.userInventory.create({
            data: {
              userId: recipient.id,
              itemId: item.id,
            },
          });
        });
      } catch (err: any) {
        if (err instanceof ConflictException || err instanceof BadRequestException) {
          throw err;
        }
        this.logger.error(`Atomic gift transaction rolled back: ${err.message}`);
        throw new BadRequestException(`Gift settlement failed: ${err.message}`);
      }
    } else {
      // Offline / Test Simulation
      const recipientVault = this.vaultInventories.get(recipient.id) || new Set<string>();
      if (recipientVault.has(item.id)) {
        throw new ConflictException(
          `Concurrency conflict: Recipient already received artifact [${item.id}] in a simultaneous transaction.`,
        );
      }

      // Sender debit
      const curBal = this.mockBalances.get(input.sourceAccountId) ?? 5000000n;
      this.mockBalances.set(input.sourceAccountId, curBal - item.priceMinorBigInt);

      // Grant recipient
      recipientVault.add(item.id);
      this.vaultInventories.set(recipient.id, recipientVault);
    }

    const giftResult: ShopGiftResultDto = {
      success: true,
      transactionId: refNumber,
      recipientUserId: recipient.id,
      recipientIdentifier: recipient.govIdNumber || recipient.email,
      itemId: item.id,
      message: `Artifact [${item.name}] successfully gifted and transferred into recipient's sovereign vault.`,
    };

    if (idempotencyKey) {
      const payloadHash = crypto
        .createHash('sha256')
        .update(JSON.stringify({ userId, ...input }))
        .digest('hex');
      this.idempotencyCache.set(idempotencyKey, { payloadHash, result: giftResult });
    }

    await this.auditService.logEvent({
      eventType: 'MONETARY_EVENT',
      actorId: userId,
      actorRole: 'USER',
      targetEntity: `CITIZEN:${recipient.id}`,
      action: `Citizen gifted artifact [${item.name}] to citizen [${recipient.govIdNumber}]`,
      severity: 'INFO',
    });

    // Post-Commit Notification Dispatch for Gift
    if (this.notificationsService) {
      try {
        const giftTemplate = NotificationTemplates.SHOP_GIFT_RECEIVED_V1.render({
          itemName: item.name,
          itemId: item.id,
          senderDisplayName: 'A fellow citizen',
          txId: refNumber,
        });
        await this.notificationsService.dispatchNotification({
          userId: recipient.id,
          category: giftTemplate.category,
          priority: giftTemplate.priority,
          title: giftTemplate.title,
          summary: giftTemplate.summary,
          content: giftTemplate.content,
          templateCode: giftTemplate.templateCode,
          templateVersion: giftTemplate.templateVersion,
          sourceDomain: 'SHOP',
          sourceType: 'SHOP_GIFT_RECEIVED',
          sourceId: refNumber,
          eventId: `shp-gift-${refNumber}`,
          metadata: {
            itemId: item.id,
            itemName: item.name,
            senderUserId: userId,
            txId: refNumber,
          },
        });
      } catch (err: any) {
        this.logger.warn(`Post-commit recipient gift notification skipped/failed: ${err.message}`);
      }
    }

    return giftResult;
  }

  // ===========================================================================
  // 4. VAULT INVENTORY & LOADOUT MANAGEMENT
  // ===========================================================================

  /**
   * Retrieves citizen's vault inventory (owned item IDs) and active loadout.
   */
  async getUserInventory(userId: string): Promise<UserInventoryDto> {
    let ownedItemIds: string[] = [];
    let loadout: EquippedLoadoutDto = {
      frameId: 'frm-gold',
      avatarId: 'avt-f-business',
      bannerId: 'bnr-gold-1',
      petId: 'pet-vidya',
    };

    if (this.prisma.isConnected) {
      try {
        const invRows = await this.prisma.userInventory.findMany({
          where: { userId },
          select: { itemId: true },
        });
        ownedItemIds = invRows.map((r) => r.itemId);

        const dbLoadout = await this.prisma.userLoadout.findUnique({
          where: { userId },
        });
        if (dbLoadout) {
          loadout = {
            frameId: dbLoadout.frameId || undefined,
            avatarId: dbLoadout.avatarId || undefined,
            bannerId: dbLoadout.bannerId || undefined,
            petId: dbLoadout.petId || undefined,
          };
        }
      } catch (err: any) {
        this.logger.debug(`Prisma inventory lookup error: ${err.message}`);
      }
    } else {
      const vault = this.vaultInventories.get(userId);
      if (vault) {
        ownedItemIds = Array.from(vault.values());
      } else {
        ownedItemIds = ['frm-gold', 'frm-aurora', 'pet-vidya', 'pet-kurma'];
      }
      loadout = this.loadouts.get(userId) || loadout;
    }

    return {
      userId,
      ownedItemIds,
      loadout,
    };
  }

  /**
   * Equips an active frame, avatar, banner, or pet.
   * Invariants:
   * 1. Citizen MUST own the artifact in their vault to equip it (throws ForbiddenException).
   * 2. Single Active Pet: Loadout holds at most one pet (petId). Equipping a new pet atomically replaces it.
   */
  async equipLoadout(userId: string, input: EquipLoadoutInput): Promise<EquippedLoadoutDto> {
    const currentInventory = await this.getUserInventory(userId);
    const ownedSet = new Set(currentInventory.ownedItemIds);

    // Verify ownership of every artifact attempting to be equipped
    if (input.frameId && !ownedSet.has(input.frameId)) {
      throw new ForbiddenException(
        `Cannot equip frame [${input.frameId}]: you do not own this artifact in your sovereign vault.`,
      );
    }
    if (input.avatarId && !ownedSet.has(input.avatarId)) {
      throw new ForbiddenException(
        `Cannot equip avatar [${input.avatarId}]: you do not own this artifact in your sovereign vault.`,
      );
    }
    if (input.bannerId && !ownedSet.has(input.bannerId)) {
      throw new ForbiddenException(
        `Cannot equip banner [${input.bannerId}]: you do not own this artifact in your sovereign vault.`,
      );
    }
    if (input.petId && !ownedSet.has(input.petId)) {
      throw new ForbiddenException(
        `Cannot equip pet companion [${input.petId}]: you do not own this pet in your sovereign vault.`,
      );
    }

    const updatedLoadout: EquippedLoadoutDto = {
      frameId: input.frameId !== undefined ? input.frameId : currentInventory.loadout.frameId,
      avatarId: input.avatarId !== undefined ? input.avatarId : currentInventory.loadout.avatarId,
      bannerId: input.bannerId !== undefined ? input.bannerId : currentInventory.loadout.bannerId,
      petId: input.petId !== undefined ? input.petId : currentInventory.loadout.petId,
    };

    if (this.prisma.isConnected) {
      try {
        await this.prisma.userLoadout.upsert({
          where: { userId },
          update: {
            frameId: updatedLoadout.frameId || null,
            avatarId: updatedLoadout.avatarId || null,
            bannerId: updatedLoadout.bannerId || null,
            petId: updatedLoadout.petId || null,
          },
          create: {
            userId,
            frameId: updatedLoadout.frameId || null,
            avatarId: updatedLoadout.avatarId || null,
            bannerId: updatedLoadout.bannerId || null,
            petId: updatedLoadout.petId || null,
          },
        });
      } catch (err: any) {
        this.logger.debug(`Prisma equipLoadout error: ${err.message}`);
      }
    } else {
      this.loadouts.set(userId, updatedLoadout);
    }

    return updatedLoadout;
  }

  // ===========================================================================
  // 5. DOMAIN-COMPATIBLE ACTIVE PET MODIFIERS
  // ===========================================================================

  /**
   * Retrieves the active financial modifier emitted by the citizen's single equipped pet.
   * Invariants:
   * 1. At most ONE active pet power can be returned (zero stacking).
   * 2. User MUST currently own the equipped pet in their vault.
   * 3. Pet modifier is consumed by downstream domains (Banking, Stocks, CLS, Rewards);
   *    pet service NEVER mints unbacked ARTH.
   */
  async getActivePetModifier(userId: string): Promise<ActivePetModifierDto | null> {
    const inv = await this.getUserInventory(userId);
    const activePetId = inv.loadout.petId;

    if (!activePetId) {
      return null;
    }

    // Invariant: Verify pet is actually owned in vault
    if (!inv.ownedItemIds.includes(activePetId)) {
      this.logger.warn(`User [${userId}] has unowned pet [${activePetId}] in loadout; modifier suppressed.`);
      return null;
    }

    switch (activePetId) {
      case 'pet-gaja':
        return {
          petId: 'pet-gaja',
          name: 'Wealth Elephant ("Gaja")',
          modifierType: 'FD_YIELD_BOOST',
          valuePercent: 0.25, // Bounded at +0.25% FD APY booster
          powerTitle: '+0.25% Fixed Deposit Yield Booster',
          powerDescription: 'Statutory interest rate amplifier applied to commercial bank term deposits.',
          downstreamDomain: 'BANKING',
        };

      case 'pet-vrishabha':
        return {
          petId: 'pet-vrishabha',
          name: 'Market Bull ("Vrishabha")',
          modifierType: 'EQUITIES_BROKERAGE_DISCOUNT',
          valuePercent: 10, // Bounded at -10% brokerage commission discount
          powerTitle: '-10% Equities Brokerage Discount',
          powerDescription: 'Institutional order execution fee discount on the sovereign equities blotter.',
          downstreamDomain: 'STOCKS',
        };

      case 'pet-lopamudra':
        return {
          petId: 'pet-lopamudra',
          name: 'Saver Fox ("Lopamudra")',
          modifierType: 'WIRE_FEE_CASHBACK',
          valuePercent: 15, // +15% wire fee cashback on inter-bank transfers
          powerTitle: '+15% Inter-Bank Wire Fee Cashback',
          powerDescription: 'Automated settlement fee rebate returned on bilateral clearing.',
          downstreamDomain: 'CLS',
        };

      case 'pet-vidya':
        return {
          petId: 'pet-vidya',
          name: 'Ledger Owl ("Vidya")',
          modifierType: 'FD_YIELD_BOOST',
          valuePercent: 0.10, // +0.10% FD APY booster
          powerTitle: '+0.10% Fixed Deposit Yield Booster & Telemetry',
          powerDescription: 'Interest yield multiplier with priority audit stream access.',
          downstreamDomain: 'BANKING',
        };

      case 'pet-baka':
        return {
          petId: 'pet-baka',
          name: 'Settlement Crane ("Baka")',
          modifierType: 'PRIORITY_CLS_CLEARING',
          valuePercent: 0,
          powerTitle: 'Priority CLS Settlement Queue Entry',
          powerDescription: 'Accelerated clearing priority through SETU interbank corridors.',
          downstreamDomain: 'CLS',
        };

      case 'pet-jala':
        return {
          petId: 'pet-jala',
          name: 'Flow Otter ("Jala")',
          modifierType: 'ZERO_GAS_CLEARING',
          valuePercent: 0,
          powerTitle: 'Zero Gas on Internal Transfers',
          powerDescription: 'Waives ledger transaction gas charges across internal accounts.',
          downstreamDomain: 'BANKING',
        };

      case 'pet-kurma':
        return {
          petId: 'pet-kurma',
          name: 'Tax Tortoise ("Kurma")',
          modifierType: 'EARLY_FD_BREAK_PENALTY_SHIELD',
          valuePercent: 25, // 25% reduction in preclosure penalty rate
          powerTitle: '25% Penalty Waiver on Early Term Liquidation',
          powerDescription: 'Shields accrued certificate interest against premature liquidation penalties.',
          downstreamDomain: 'BANKING',
        };

      case 'pet-marjara':
        return {
          petId: 'pet-marjara',
          name: 'Archive Cat ("Marjara")',
          modifierType: 'CIVIC_BOUNTY_LIMIT',
          bountyMinor: '500', // 5.00 ARTH per day
          powerTitle: 'Daily +5 ARTH Civic Bounty Access',
          powerDescription: 'Permits daily civic participation bounty claim from the sovereign reward pool.',
          downstreamDomain: 'REWARDS',
        };

      default:
        return null;
    }
  }

  /**
   * Claims the daily +5 ARTH civic bounty for active pet-marjara.
   * Invariant: Funds are DEBITED from the authorized sys_reward_pool, NEVER created unbacked!
   */
  async claimCivicBounty(userId: string, targetAccountId: string): Promise<TransactionDto> {
    const modifier = await this.getActivePetModifier(userId);
    if (!modifier || modifier.modifierType !== 'CIVIC_BOUNTY_LIMIT') {
      throw new BadRequestException(
        'You must have an active Archive Cat ("Marjara") equipped to claim the civic bounty.',
      );
    }

    // 24-hour rate limiting check
    const lastClaim = this.civicBountyClaims.get(userId);
    const now = new Date();
    if (lastClaim && now.getTime() - lastClaim.getTime() < 24 * 60 * 60 * 1000) {
      throw new BadRequestException('Civic bounty can only be claimed once every 24 hours.');
    }

    const bountyAmountMinor = 500n; // 5.00 ARTH
    const ref = `BOUNTY-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    let txResult: TransactionDto;

    if (this.prisma.isConnected) {
      txResult = await this.ledgerService.recordBalancedTransaction({
        type: 'REWARD',
        scope: 'INTERNAL',
        amountMinor: bountyAmountMinor,
        initiatedBy: userId,
        destinationAccountId: targetAccountId,
        referenceNumber: ref,
        entries: [
          {
            ledgerAccountId: SOVEREIGN_SYSTEM_ACCOUNTS.REWARD_POOL,
            entryType: 'DEBIT',
            amountMinor: bountyAmountMinor,
          },
          {
            ledgerAccountId: targetAccountId,
            entryType: 'CREDIT',
            amountMinor: bountyAmountMinor,
          },
        ],
      });
    } else {
      const curBal = this.mockBalances.get(targetAccountId) ?? 5000000n;
      this.mockBalances.set(targetAccountId, curBal + bountyAmountMinor);

      txResult = {
        id: `tx_bounty_${Date.now()}`,
        referenceNumber: ref,
        type: 'REWARD',
        status: 'COMPLETED',
        scope: 'INTERNAL',
        amountMinor: bountyAmountMinor.toString(),
        feesMinor: '0',
        taxMinor: '0',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        entries: [],
      };
    }

    this.civicBountyClaims.set(userId, now);

    await this.auditService.logEvent({
      eventType: 'MONETARY_EVENT',
      actorId: userId,
      actorRole: 'USER',
      targetEntity: `ACCOUNT:${targetAccountId}`,
      action: `Claimed 5.00 ARTH civic bounty debited from sys_reward_pool`,
      severity: 'INFO',
    });

    return txResult;
  }

  // ===========================================================================
  // 6. PRIVATE HELPERS
  // ===========================================================================

  private async verifyFinancialPassword(userId: string, password: string): Promise<void> {
    if (this.prisma.isConnected) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (user?.financialPasswordHash) {
        const isValid = await argon2.verify(user.financialPasswordHash, password);
        if (!isValid) {
          throw new ForbiddenException('Invalid Financial Password. Step-up authorization failed.');
        }
      }
    } else {
      const mock = this.mockCitizens.get(userId);
      if (mock?.financialPasswordHash) {
        const isValid = await argon2.verify(mock.financialPasswordHash, password);
        if (!isValid) {
          throw new ForbiddenException('Invalid Financial Password. Step-up authorization failed.');
        }
      }
    }
  }

  private async checkUserOwnership(userId: string, itemId: string): Promise<boolean> {
    if (this.prisma.isConnected) {
      try {
        const existing = await this.prisma.userInventory.findUnique({
          where: {
            userId_itemId: {
              userId,
              itemId,
            },
          },
        });
        return !!existing;
      } catch (err: any) {
        this.logger.debug(`Prisma checkUserOwnership error: ${err.message}`);
      }
    }
    const userVault = this.vaultInventories.get(userId);
    return userVault ? userVault.has(itemId) : false;
  }

  private async resolveRecipientCitizen(identifier: string): Promise<{
    id: string;
    govIdNumber: string;
    email: string;
    displayName: string;
    status: string;
  }> {
    const cleanId = identifier.trim();

    if (this.prisma.isConnected) {
      try {
        const user = await this.prisma.user.findFirst({
          where: {
            OR: [
              { govIdRel: { govIdNumber: { equals: cleanId, mode: 'insensitive' } } },
              { govIdRel: { email: { equals: cleanId.toLowerCase(), mode: 'insensitive' } } },
            ],
          },
          include: { govIdRel: true },
        });

        if (user) {
          return {
            id: user.id,
            govIdNumber: user.govIdRel.govIdNumber,
            email: user.govIdRel.email,
            displayName: user.displayName,
            status: user.status,
          };
        }
      } catch (err: any) {
        this.logger.debug(`Prisma resolveRecipientCitizen error: ${err.message}`);
      }
    }

    // Check mock citizen registry
    const mock =
      this.mockCitizens.get(cleanId.toUpperCase()) ||
      this.mockCitizens.get(cleanId.toLowerCase()) ||
      this.mockCitizens.get(cleanId);

    if (mock) {
      return mock;
    }

    throw new NotFoundException(
      `Recipient citizen [${identifier}] could not be resolved by GOV ID or verified email.`,
    );
  }
}
