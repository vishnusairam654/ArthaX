export type RarityTier = 'normal' | 'rare' | 'epic' | 'gold';

export type ShopCategory = 'all' | 'pets' | 'avatars' | 'frames' | 'banners' | 'inventory';

export interface ShopItem {
  id: string;
  name: string;
  category: 'pet' | 'avatar' | 'frame' | 'banner';
  rarity: RarityTier;
  price: number;
  image: string;
  secondaryImage?: string;
  rank?: string;
  role?: string;
  gender?: 'female' | 'male';
  powerTitle?: string;
  powerDescription?: string;
  attireSpec?: string;
  accreditation?: string;
  dimensions?: string;
  covenantSection?: string;
  perks?: string[];
  isEquipped?: boolean;
  isOwned?: boolean;
}

export interface EquippedLoadout {
  frameId: string;
  avatarId: string;
  bannerId: string;
  petId: string;
}

// 8 Official Sovereign Financial Companions
export const FINANCIAL_PETS: ShopItem[] = [
  {
    id: 'pet-gaja',
    name: 'Wealth Elephant ("Gaja")',
    category: 'pet',
    rarity: 'gold',
    price: 9200,
    image: '/assets/shop/pets/Wealth Elephant/main_image.png',
    secondaryImage: '/assets/shop/pets/Wealth Elephant/icon.png',
    rank: 'Rank #01',
    role: 'Term Yield Protector',
    powerTitle: '+1.25% Sovereign Term Deposit Yield Booster',
    powerDescription: 'Continuous mathematical APY amplifier automatically credited across all connected commercial bank Fixed Deposits.',
    covenantSection: 'Section 18-G (Gold Sovereign Spotlight)',
    perks: ['+1.25% FD Yield Booster', 'SETU Auto-Sweep Daemon', 'Sovereign Board Voting Rights']
  },
  {
    id: 'pet-vrishabha',
    name: 'Market Bull ("Vrishabha")',
    category: 'pet',
    rarity: 'gold',
    price: 8500,
    image: '/assets/shop/pets/Market Bull/main_image.png',
    secondaryImage: '/assets/shop/pets/Market Bull/icon.png',
    rank: 'Rank #02',
    role: 'Equities Accelerator',
    powerTitle: '-50% Equities Brokerage & Instant Depth Queue',
    powerDescription: 'Bypasses standard clearing queue latency and halves institutional order execution fees across the sovereign equities continuous auction.',
    covenantSection: 'Section 18-G (Equities Protocol)',
    perks: ['-50% Brokerage Commission', 'Instant Depth Queueing', 'Priority Order Blotter Matching']
  },
  {
    id: 'pet-lopamudra',
    name: 'Saver Fox ("Lopamudra")',
    category: 'pet',
    rarity: 'epic',
    price: 4200,
    image: '/assets/shop/pets/Saver Fox/main_image.png',
    secondaryImage: '/assets/shop/pets/Saver Fox/icon.png',
    rank: 'Rank #03',
    role: 'Cashflow Vault Guardian',
    powerTitle: '+15% Cashback on All Inter-Bank DvP Transfers',
    powerDescription: 'Automated settlement fee rebate instantly returned to sovereign reserve payroll on every bilateral clearing transaction.',
    covenantSection: 'Section 18-G (Cashflow Protocol)',
    perks: ['+15% DvP Transfer Cashback', 'Bilateral Escrow Rebates', 'Daily Micro-Reward Accumulation']
  },
  {
    id: 'pet-vidya',
    name: 'Ledger Owl ("Vidya")',
    category: 'pet',
    rarity: 'epic',
    price: 3400,
    image: '/assets/shop/pets/Ledger Owl/main_image.png',
    secondaryImage: '/assets/shop/pets/Ledger Owl/icon.png',
    rank: 'Rank #04',
    role: 'Knowledge & Analytics Oracle',
    powerTitle: '+0.25% FD Yield Booster & Real-Time Stock Analytics Feed',
    powerDescription: 'Streams level-2 financial telemetry directly into personal cockpit while applying continuous interest yield multipliers.',
    covenantSection: 'Section 18-G (Analytics Feeds)',
    perks: ['+0.25% FD Yield Booster', 'Level-2 Trading Telemetry', 'Zero-Latency Audit Inscriptions']
  },
  {
    id: 'pet-baka',
    name: 'Settlement Crane ("Baka")',
    category: 'pet',
    rarity: 'rare',
    price: 3800,
    image: '/assets/shop/pets/Settlement Crane/main_image.png',
    secondaryImage: '/assets/shop/pets/Settlement Crane/icon.png',
    rank: 'Rank #05',
    role: 'High-Velocity DvP Arbiter',
    powerTitle: 'Sub-200ms Priority CLS Finality & 0% Cross-Bank Wire Stamp',
    powerDescription: 'Enforces sub-second bilateral clearing finality and waives all statutory state stamp duties on multi-bank transfers.',
    covenantSection: 'Section 18-G (Settlement Velocity)',
    perks: ['Sub-200ms Finality', '0% Cross-Bank Wire Stamp', 'SETU Depository Fast-Path']
  },
  {
    id: 'pet-jala',
    name: 'Flow Otter ("Jala")',
    category: 'pet',
    rarity: 'rare',
    price: 2800,
    image: '/assets/shop/pets/Flow Otter/main_image.png',
    secondaryImage: '/assets/shop/pets/Flow Otter/icon.png',
    rank: 'Rank #06',
    role: 'Real-Time Liquidity Custodian',
    powerTitle: 'Zero Gas on Real-Time CLS Inter-Bank Clears',
    powerDescription: 'Eliminates all underlying ledger execution fees across interconnected commercial banking nodes during peak volume windows.',
    covenantSection: 'Section 18-G (Gasless Liquidity)',
    perks: ['Zero Gas Clearing', 'Automatic Reserve Rebalancing', 'Liquidity Sweep Protection']
  },
  {
    id: 'pet-kurma',
    name: 'Tax Tortoise ("Kurma")',
    category: 'pet',
    rarity: 'normal',
    price: 2400,
    image: '/assets/shop/pets/Tax Tortoise/main_image.png',
    secondaryImage: '/assets/shop/pets/Tax Tortoise/icon.png',
    rank: 'Rank #07',
    role: 'Liquidity & Prudence Shield',
    powerTitle: 'Zero Penalty on Early FD Liquidation (Up to 50k ARTH)',
    powerDescription: 'Shields accrued certificate interest against premature liquidation penalties for emergencies and high-yield reinvestment.',
    covenantSection: 'Section 18-G (Prudence Protocol)',
    perks: ['Zero Penalty Early Break', 'Accrued Interest Retention', 'Emergency Liquidity Window']
  },
  {
    id: 'pet-marjara',
    name: 'Archive Cat ("Marjara")',
    category: 'pet',
    rarity: 'normal',
    price: 1900,
    image: '/assets/shop/pets/Archive Cat/main_image.png',
    secondaryImage: '/assets/shop/pets/Archive Cat/icon.png',
    rank: 'Rank #08',
    role: 'Communication & Audit Enclave',
    powerTitle: 'Zero-Latency Central Bank Notices & Daily +5 ARTH Civic Bounty',
    powerDescription: 'Instant priority dispatch for Central Bank institutional circulars, regulatory advisories, and daily active citizen rewards.',
    covenantSection: 'Section 18-G (Civic Bounty)',
    perks: ['Daily +5 ARTH Bounty', 'Zero-Latency Notices', 'Automated Mailbox Archiving']
  }
];

// 16 Official Citizen Personas (8 Female, 8 Male)
export const CITIZEN_AVATARS: ShopItem[] = [
  // Female Personas
  {
    id: 'avt-f-business',
    name: 'Executive Director Sovereign',
    category: 'avatar',
    rarity: 'gold',
    price: 3500,
    image: '/assets/shop/avatars/Female/BussinesWomen.png',
    gender: 'female',
    role: 'Corporate Chairman & Escrow Signatory',
    attireSpec: 'Bespoke navy tailored blazer with ARTHAX gold lapel pin & platinum chronograph.',
    accreditation: 'Accredited for Sovereign Syndicate Pools & Board Escrow Signing.',
    perks: ['Sovereign Board Vote Access', 'Tier-1 Enclave Status', '+5% Syndicate Bonus']
  },
  {
    id: 'avt-f-investor',
    name: 'Senior Trustee Legacy Custodian',
    category: 'avatar',
    rarity: 'epic',
    price: 2600,
    image: '/assets/shop/avatars/Female/Retired Investor.png',
    gender: 'female',
    role: 'Family Wealth Office Trustee',
    attireSpec: 'Archival woven silk saree with antique gold thread borders and wealth balance registry ledger.',
    accreditation: 'Accredited for Sovereign Multi-Bank Reserves & Inter-Generational Trusts.',
    perks: ['Multi-Bank Trust Access', 'Guaranteed Liquidity Line', 'Estate Vault Authorization']
  },
  {
    id: 'avt-f-entrepreneur',
    name: 'FinTech Syndicate Founder',
    category: 'avatar',
    rarity: 'epic',
    price: 2800,
    image: '/assets/shop/avatars/Female/Entrepreneur.png',
    gender: 'female',
    role: 'Autonomous Rails Founder',
    attireSpec: 'Contemporary charcoal power suit with gilded pocket square and biometric authentication ring.',
    accreditation: 'Chartered for Venture Liquidity Pools and DvP Commercial Merchant Invoicing.',
    perks: ['Merchant Rails Discount', 'Instant Venture Drawdown', 'Commercial Settlement Key']
  },
  {
    id: 'avt-f-builder',
    name: 'Smart-Contract Architect',
    category: 'avatar',
    rarity: 'rare',
    price: 2200,
    image: '/assets/shop/avatars/Female/Builder.png',
    gender: 'female',
    role: 'Consensus Engine Developer',
    attireSpec: 'Structured industrial technical jacket with glowing SETU hardware token lanyard.',
    accreditation: 'Certified Smart-Contract Auditor for Sovereign Autonomous Protocols.',
    perks: ['Gas Optimization Buffer', 'Developer Sandbox Access', 'Early Protocol Canary Mint']
  },
  {
    id: 'avt-f-creator',
    name: 'Communications Custodian',
    category: 'avatar',
    rarity: 'rare',
    price: 1800,
    image: '/assets/shop/avatars/Female/Creator.png',
    gender: 'female',
    role: 'Media & Public Narrative Lead',
    attireSpec: 'Modern cobalt designer attire with holographic digital portfolio projector.',
    accreditation: 'Verified Creator for Institutional Educational Broadcasts & Public Covenants.',
    perks: ['Civic Reach Booster', 'Public Notice Badge', 'Royal Mailbox Priority']
  },
  {
    id: 'avt-f-analyst',
    name: 'Macro Risk Specialist',
    category: 'avatar',
    rarity: 'normal',
    price: 1500,
    image: '/assets/shop/avatars/Female/Analyst.png',
    gender: 'female',
    role: 'Central Bank Data Analyst',
    attireSpec: 'Crisp ivory executive formal attire with digital dual-screen tabular slate.',
    accreditation: 'Regulatory Compliance Officer for ISO 20022 Inter-bank Audit Trails.',
    perks: ['Audit Proof Fast-Export', 'Real-Time Reserve Telemetry', 'Prudential Ratio Alerts']
  },
  {
    id: 'avt-f-accredited',
    name: 'Institutional Capital Allocator',
    category: 'avatar',
    rarity: 'rare',
    price: 2400,
    image: '/assets/shop/avatars/Female/Investor.png',
    gender: 'female',
    role: 'Sovereign Debt Manager',
    attireSpec: 'Refined emerald formal coat with sovereign bond certificate folio.',
    accreditation: 'Accredited Institutional Investor for Primary Gilt Issuance Auctions.',
    perks: ['Primary Gilt Access', 'Wholesale Margin Rates', 'Bilateral DvP Escrow']
  },
  {
    id: 'avt-f-student',
    name: 'Monetary Fellow Apprentice',
    category: 'avatar',
    rarity: 'normal',
    price: 800,
    image: '/assets/shop/avatars/Female/Student.png',
    gender: 'female',
    role: 'Cryptographic Economics Fellow',
    attireSpec: 'Academic navy blazer with Central Monetary Academy embroidered emblem.',
    accreditation: 'Junior Scholar Tier under National Fiscal Literacy Initiative.',
    perks: ['Tuition Settlement Rebates', 'Micro-Staking Multiplier', 'Academic Library Pass']
  },

  // Male Personas
  {
    id: 'avt-m-business',
    name: 'Sovereign Banking Chairman',
    category: 'avatar',
    rarity: 'gold',
    price: 3500,
    image: '/assets/shop/avatars/Male/Bussinessman.png',
    gender: 'male',
    role: 'Apex Bank Governor & Monetary Signatory',
    attireSpec: 'Hand-tailored charcoal wool three-piece suit with golden sovereign pocket chain and signet ring.',
    accreditation: 'Authorized Signatory for Inter-Bank Liquidity Facilities & Apex Emergency Windows.',
    perks: ['Apex Liquidity Facility', 'Zero-Reserve Fee Waiver', 'Sovereign Treaty Signatory']
  },
  {
    id: 'avt-m-investor',
    name: 'Emeritus Central Bank Board Member',
    category: 'avatar',
    rarity: 'epic',
    price: 2600,
    image: '/assets/shop/avatars/Male/Retired Investor.png',
    gender: 'male',
    role: 'Senior Monetary Policy Advisor',
    attireSpec: 'Traditional imperial Bandhgala with gold bullion buttons and velvet lapel trimming.',
    accreditation: 'Emeritus Status with Sovereign Depository Oversight Advisory Clearance.',
    perks: ['Advisory Council Badge', 'Private Reserve Access', 'Direct Central Bank Hotline']
  },
  {
    id: 'avt-m-entrepreneur',
    name: 'Decentralized Reserve Founder',
    category: 'avatar',
    rarity: 'epic',
    price: 2800,
    image: '/assets/shop/avatars/Male/Entrepreneur.png',
    gender: 'male',
    role: 'Multi-Bank Infrastructure Founder',
    attireSpec: 'Sharp modern midnight-blue suit with open collar and titanium enclave identity pendant.',
    accreditation: 'Chartered Founder for Core Real-Time Gross Settlement (RTGS) Protocols.',
    perks: ['High-Throughput Clearing', 'Corporate Vault Integration', 'Automated Treasury Sweeps']
  },
  {
    id: 'avt-m-builder',
    name: 'Infrastructure Systems Engineer',
    category: 'avatar',
    rarity: 'rare',
    price: 2200,
    image: '/assets/shop/avatars/Male/Builder.png',
    gender: 'male',
    role: 'Core Ledger Protocol Engineer',
    attireSpec: 'Durable composite technical field jacket with biometric safety credentials and multi-tool stylus.',
    accreditation: 'Certified Site Reliability Engineer for Central Settlement Layer (CLS).',
    perks: ['Node Validator Telemetry', 'Failover Priority Routing', 'Sub-second Sync Assurance']
  },
  {
    id: 'avt-m-creator',
    name: 'Sovereign Digital Asset Designer',
    category: 'avatar',
    rarity: 'rare',
    price: 1800,
    image: '/assets/shop/avatars/Male/Creator.png',
    gender: 'male',
    role: 'Numismatic & UI Visual Architect',
    attireSpec: 'Minimalist designer overshirt in slate blue with optical stylus and canvas sketchbook.',
    accreditation: 'Approved Designer for National Commemorative Mints and Citizen Badges.',
    perks: ['Custom Frame Preview', 'Early Asset Access', 'Exhibition Vault Hall']
  },
  {
    id: 'avt-m-analyst',
    name: 'Continuous Auction Floor Analyst',
    category: 'avatar',
    rarity: 'normal',
    price: 1500,
    image: '/assets/shop/avatars/Male/Analyst.png',
    gender: 'male',
    role: 'Equities Blotter & Order Specialist',
    attireSpec: 'Crisp trading floor formal attire with synchronized high-precision stock watch.',
    accreditation: 'Certified Stock Exchange Floor Specialist under SETU Depository Rails.',
    perks: ['Level-2 Order Blotter', 'Real-Time Price Alerts', 'Algorithmic Execution Queue']
  },
  {
    id: 'avt-m-accredited',
    name: 'Principal Capital Markets Partner',
    category: 'avatar',
    rarity: 'rare',
    price: 2400,
    image: '/assets/shop/avatars/Male/Investor.png',
    gender: 'male',
    role: 'Sovereign Equity Syndicate Lead',
    attireSpec: 'Double-breasted navy blazer with mother-of-pearl buttons and portfolio dossier.',
    accreditation: 'Chartered Asset Manager for Sovereign Wealth & Pension Allocations.',
    perks: ['Syndicate Bidding Priority', 'Discounted Block Trades', 'Quarterly Dividend Sweep']
  },
  {
    id: 'avt-m-student',
    name: 'Cryptographic Economics Cadet',
    category: 'avatar',
    rarity: 'normal',
    price: 800,
    image: '/assets/shop/avatars/Male/Student.png',
    gender: 'male',
    role: 'National Monetary Fellow Trainee',
    attireSpec: 'Formal scholar pullover with Central Banking Academy collegiate crest.',
    accreditation: 'Registered Scholar under National Sovereign Financial Fellowship.',
    perks: ['Zero-Fee Education Transfers', 'Civic Training Grants', 'Apprentice Ledger Access']
  }
];

// 7 Official Enclave Frames mapped strictly per AGENTS.md rules
export const ENCLAVE_FRAMES: ShopItem[] = [
  {
    id: 'frm-gold',
    name: 'Sovereign Gold Filigree Rim',
    category: 'frame',
    rarity: 'gold',
    price: 4800,
    image: '/assets/shop/frames/gold.png',
    role: 'Royal Depository Master Frame',
    powerTitle: 'Maximum Prestige Intaglio Gold Border with Anti-Forgery Shimmer',
    powerDescription: 'Crafted with continuous bank-note guilloche waves and specular gold bullion rim reflecting Tier-1 citizen authority.',
    covenantSection: 'AGENTS.md Resolved: gold.png -> Gold Tier',
    perks: ['Radiant Gold Shimmer Aura', 'Priority Settlement Border Highlight', 'Permanent Profile Gold Foil']
  },
  {
    id: 'frm-aurora',
    name: 'Aurora Intaglio Shimmer Frame',
    category: 'frame',
    rarity: 'epic',
    price: 3200,
    image: '/assets/shop/frames/Aurora.png',
    role: 'Amethyst Spectral Sentinel',
    powerTitle: 'Dynamic Chromatic Polarization Bezel with Kinetic Flare',
    powerDescription: 'Rare refractive crystal alloy reflecting ambient lighting and certifying continuous DvP multi-bank transaction activity.',
    covenantSection: 'AGENTS.md Resolved: Aurora.png -> Epic Tier',
    perks: ['Refractive Aurora Shift', 'Kinetic Shimmer Gradient', '-15% DvP Wire Stamp']
  },
  {
    id: 'frm-nova',
    name: 'Nova Stellar Horizon Border',
    category: 'frame',
    rarity: 'epic',
    price: 3400,
    image: '/assets/shop/frames/Nova.png',
    role: 'High-Altitude Monetary Orbit',
    powerTitle: 'Deep Indigo Cosmic Rim with Specular Gold Accents',
    powerDescription: 'Reflects validator node staking status and high-order inter-bank capital contributions.',
    covenantSection: 'AGENTS.md Resolved: Nova.png -> Epic Tier',
    perks: ['Stellar Pulsing Halo', 'Validator Staking Accent', 'Dual-Color Concentric Ring']
  },
  {
    id: 'frm-orbit',
    name: 'Orbital Planetary Wire Rim',
    category: 'frame',
    rarity: 'rare',
    price: 1800,
    image: '/assets/shop/frames/orbit.png',
    role: 'Continuous Linked Settlement Track',
    powerTitle: 'Dual Azure Orbital Rings Representing Bilateral Clears',
    powerDescription: 'Clean engineered geometric circle track representing real-time delivery-versus-payment settlement finality.',
    covenantSection: 'AGENTS.md Resolved: orbit.png -> Rare Tier',
    perks: ['Bilateral Orbital Ring', 'Sub-second Velocity Indicator', 'Azure Shimmer']
  },
  {
    id: 'frm-pulse',
    name: 'DvP Pulse Frequency Bezel',
    category: 'frame',
    rarity: 'rare',
    price: 2000,
    image: '/assets/shop/frames/pluse.png',
    role: 'Real-Time Transit Aura',
    powerTitle: 'Dynamic Frequency Oscillating Border in Sovereign Cyan',
    powerDescription: 'Visualizes real-time ledger heartbeat and block height finality with subtle micro-pulses.',
    covenantSection: 'AGENTS.md Resolved: pluse.png -> Rare Tier',
    perks: ['Heartbeat Telemetry Ring', 'Speed Priority Glyph', 'Cyan Luminous Edge']
  },
  {
    id: 'frm-leaf',
    name: 'Botanical Archival Foliage Frame',
    category: 'frame',
    rarity: 'normal',
    price: 950,
    image: '/assets/shop/frames/leaf.png',
    role: 'Fiscal Growth & Longevity Motif',
    powerTitle: 'Delicate Intaglio Mint Leaf Filigree Pattern',
    powerDescription: 'Classical numismatic flora pattern symbolizing steady capital compounding and sovereign organic prosperity.',
    covenantSection: 'AGENTS.md Resolved: leaf.png -> Normal Tier',
    perks: ['Intaglio Leaf Border', 'Steady Yield Emblem', 'Classical Parchment Texture']
  },
  {
    id: 'frm-vertex',
    name: 'Geometric Consensus Vertex Edge',
    category: 'frame',
    rarity: 'normal',
    price: 1100,
    image: '/assets/shop/frames/vertex.png',
    role: 'Octagonal Cryptographic Node',
    powerTitle: 'Chiseled Octagonal Geometry Mirroring the Core Monolith',
    powerDescription: 'Direct structural descendant of the central bank core ledger cylinder, providing crisp architectural presence.',
    covenantSection: 'AGENTS.md Resolved: vertex.png -> Normal Tier',
    perks: ['Chiseled Octagonal Edge', 'Consensus Node Alignment', 'Precision Hairline Border']
  }
];

// 14 Official Royal Banners
export const ROYAL_BANNERS: ShopItem[] = [
  {
    id: 'bnr-gold-1',
    name: 'Central Bank Apex Gilded Hall',
    category: 'banner',
    rarity: 'gold',
    price: 2100,
    image: '/assets/shop/banners/gold_1.png',
    powerTitle: 'Sub-Basement Bullion Safe Panoramic Horizon',
    powerDescription: 'Massive cast-titanium door with engraved charter certificates and ambient gold radiance.',
    perks: ['Gilded Hallway Panorama', 'Bullion Vault Hologram', '+100 Citizen Prestige Score']
  },
  {
    id: 'bnr-gold-2',
    name: 'Sub-Basement Sovereign Bullion Safe',
    category: 'banner',
    rarity: 'gold',
    price: 2400,
    image: '/assets/shop/banners/gold_2.png',
    powerTitle: 'Deep National Vault Inscription & Bullion Stacks',
    powerDescription: 'The innermost physical vault of the Reserve Bank of Bharat holding sovereign 1:1 parity reserves.',
    perks: ['Bullion Stacks Panorama', 'Direct Reserve Camera Feed', 'National Seal Watermark']
  },
  {
    id: 'bnr-epic-1',
    name: 'Dalal Trading Floor Twilight Panorama',
    category: 'banner',
    rarity: 'epic',
    price: 1400,
    image: '/assets/shop/banners/epic_1.png',
    powerTitle: 'Equities Twilight Continuous Auction Floor',
    powerDescription: 'Atmospheric twilight view of Mumbai financial exchange floors with real-time ticker sparklines.',
    perks: ['Twilight Trading Floor Vista', 'Sparkline Overlay', 'Stock Portfolio Background']
  },
  {
    id: 'bnr-epic-2',
    name: 'Continuous Linked Settlement Cyber-Atrium',
    category: 'banner',
    rarity: 'epic',
    price: 1500,
    image: '/assets/shop/banners/epic_2.png',
    powerTitle: 'SETU Real-Time DvP Clearing Room with Fiber Grid',
    powerDescription: 'High-frequency telemetry center resolving thousands of inter-bank pacs.008 messages per second.',
    perks: ['Cyber-Atrium Panorama', 'CLS Fiber Optic Streams', 'Live Transaction Beam']
  },
  {
    id: 'bnr-rare-1',
    name: 'Mumbai Monetary Exchange Dawn',
    category: 'banner',
    rarity: 'rare',
    price: 900,
    image: '/assets/shop/banners/rare_1.png',
    powerTitle: 'Golden Hour Architectural Silhouette of Commercial Banks',
    powerDescription: 'The historical banking district bathed in sunrise reflecting multi-bank cooperative sovereignty.',
    perks: ['Historic District Dawn', 'Soft Gold Gradient', 'Architectural Watermark']
  },
  {
    id: 'bnr-rare-2',
    name: 'Pacific DvP Maritime Clearing Wire',
    category: 'banner',
    rarity: 'rare',
    price: 950,
    image: '/assets/shop/banners/rare_2.png',
    powerTitle: 'Subsea Financial Data Conduit Vista',
    powerDescription: 'Cross-border deep ocean fiber lines linking sovereign national clearing to global ISO institutional nodes.',
    perks: ['Subsea Data Conduit', 'Bilateral Gateway Aura', 'Oceanic Azure Theme']
  },
  {
    id: 'bnr-rare-3',
    name: 'Himalayan Cold-Storage Vault Vista',
    category: 'banner',
    rarity: 'rare',
    price: 1000,
    image: '/assets/shop/banners/rare_3.png',
    powerTitle: 'High-Altitude Cryptographic Key Custody Facility',
    powerDescription: 'Hardened mountain enclave preserving national root cryptographic certificates under permafrost isolation.',
    perks: ['Cold-Storage Mountain Peak', 'HSM Enclave Schematic', 'Deep Ice Palette']
  },
  // Normal Banners (Institutional Facades)
  {
    id: 'bnr-norm-1',
    name: 'NAVA Bank Primary Atrium',
    category: 'banner',
    rarity: 'normal',
    price: 500,
    image: '/assets/shop/banners/normal_1.png',
    powerTitle: 'Grand Marble Columns & Public Customer Service Hall',
    powerDescription: 'Clean neoclassical hall of NAVA Sovereign Commercial Bank.',
    perks: ['NAVA Commercial Hall', 'High-Ceiling Architecture']
  },
  {
    id: 'bnr-norm-2',
    name: 'SAMAYA Time-Deposit Vault Arch',
    category: 'banner',
    rarity: 'normal',
    price: 520,
    image: '/assets/shop/banners/normal_2.png',
    powerTitle: 'Clockwork Escrow Timelock Vault Interior',
    powerDescription: 'Brass and glass timelock clockwork controlling Fixed Deposit maturation cycles.',
    perks: ['Timelock Gears Motif', 'Chronometric Escrow Backdrop']
  },
  {
    id: 'bnr-norm-3',
    name: 'TARANG Velocity Clearing Wing',
    category: 'banner',
    rarity: 'normal',
    price: 480,
    image: '/assets/shop/banners/normal_3.png',
    powerTitle: 'Aerodynamic Modern Bank Headquarters Glass Wall',
    powerDescription: 'Light-flooded glass and steel structure specialized in sub-second retail micropayments.',
    perks: ['Aerodynamic Glass Facade', 'Modern Streamline Styling']
  },
  {
    id: 'bnr-norm-4',
    name: 'SETU Depository Gateway Facade',
    category: 'banner',
    rarity: 'normal',
    price: 550,
    image: '/assets/shop/banners/normal_4.png',
    powerTitle: 'Monumental Granite Archway of Central Settlement',
    powerDescription: 'National clearing gateway where all commercial bank balances reconcile to zero divergence.',
    perks: ['Granite Archway View', 'Consensus Registry Inscription']
  },
  {
    id: 'bnr-norm-5',
    name: 'STHIRA Prudential Reserve Strongroom',
    category: 'banner',
    rarity: 'normal',
    price: 500,
    image: '/assets/shop/banners/normal_5.png',
    powerTitle: 'Reinforced Steel Safe Grid for Senior Citizens',
    powerDescription: 'Heavily insured conservative depository for pension and sovereign senior reserves.',
    perks: ['Steel Grid Strongroom', 'Prudential Guarantee Seal']
  },
  {
    id: 'bnr-norm-6',
    name: 'VAYU Aerial Settlement Hub',
    category: 'banner',
    rarity: 'normal',
    price: 460,
    image: '/assets/shop/banners/normal_6.png',
    powerTitle: 'Skyline View of Automated Electronic Clearing Towers',
    powerDescription: 'Modern data microwave arrays synchronizing multi-bank liquidity every 100 milliseconds.',
    perks: ['Microwave Array Towers', 'Skyline Horizon']
  },
  {
    id: 'bnr-norm-7',
    name: 'National Numismatic Archives Hall',
    category: 'banner',
    rarity: 'normal',
    price: 600,
    image: '/assets/shop/banners/normal_7.png',
    powerTitle: 'Historical Currency Treaty Gallery and Mint Museum',
    powerDescription: 'Exhibition of centuries of sovereign numismatic heritage and gold-backed currency treaties.',
    perks: ['Historic Treaty Exhibition', 'Archival Showcase Cabinets']
  }
];

export const SOVEREIGN_FRAMES: ShopItem[] = ENCLAVE_FRAMES;
export const SOVEREIGN_BANNERS: ShopItem[] = ROYAL_BANNERS;

export const INITIAL_EQUIPPED_LOADOUT: EquippedLoadout = {
  frameId: 'frm-gold',
  avatarId: 'avt-f-business',
  bannerId: 'bnr-gold-1',
  petId: 'pet-vidya'
};

export const INITIAL_OWNED_ITEM_IDS = [
  'frm-gold',
  'frm-aurora',
  'avt-f-business',
  'avt-f-analyst',
  'bnr-gold-1',
  'bnr-epic-1',
  'pet-vidya',
  'pet-kurma'
];

export const RARITY_CONFIG = {
  normal: {
    name: 'Normal',
    label: 'Slate Foundation',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    color: '#64748B',
    accentColor: '#475569',
    description: 'Foundational styling and clean architectural geometry. Zero baseline boost; standard 1x network rewards.'
  },
  rare: {
    name: 'Rare',
    label: 'Azure Blue',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    color: '#2563EB',
    accentColor: '#1D4ED8',
    description: 'Advanced aesthetics and single tier-1 minor perks (+2% rewards or priority queue entry, zero-gas clears).'
  },
  epic: {
    name: 'Epic',
    label: 'Amethyst Violet',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    color: '#7C3AED',
    accentColor: '#6D28D9',
    description: 'Bespoke animation flair, Guilloche highlights, and dual active financial modifiers (+15% cashback, -25% commissions).'
  },
  gold: {
    name: 'Gold',
    label: 'Radiant Gold',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
    color: '#A8742A',
    accentColor: '#8C5E1F',
    description: 'Specular shimmer aura, maximum sovereign utility (+1.25% FD booster, zero trade fees, instant priority settlement).'
  }
};
