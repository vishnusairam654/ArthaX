import { PrismaClient } from '../client/index.js';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting ARTHAX deterministic database seeding...');

  // Password hashes (deterministic using Argon2id)
  const defaultGovPasswordHash = await argon2.hash('GovSovereign@2026!', {
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  const defaultFinancialPasswordHash = await argon2.hash('FinSecret#2026', {
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  // ===========================================================================
  // 1. Core Financial Entities: 5 Canonical Commercial Banks + Central Bank
  // ===========================================================================
  console.log('🏦 Seeding Canonical Banks: NAVA, SAMAYA, SETU, STHIRA, VAYU...');

  const banks = [
    {
      id: 'nava',
      name: 'NAVA Sovereign Commercial Bank',
      shortName: 'NAVA',
      tagline: 'The Primary Sovereign Clearing Node',
      logoPath: '/assets/banks/nava.png',
      licenseNumber: 'SCB-2024-001-NV',
      establishedDate: new Date('2024-01-15'),
      accentColor: '#1E3A5F',
      status: 'ACTIVE',
      ownership: '100% Sovereign State Charter',
      governingDirector: 'Dr. Devendra Sen',
    },
    {
      id: 'samaya',
      name: 'SAMAYA Term Deposit Depository',
      shortName: 'SAMAYA',
      tagline: 'High-Yield Sovereign Term Vaults',
      logoPath: '/assets/banks/samaya.png',
      licenseNumber: 'SCB-2024-002-SM',
      establishedDate: new Date('2024-02-01'),
      accentColor: '#A8742A',
      status: 'ACTIVE',
      ownership: 'Cooperative Sovereign Trust',
      governingDirector: 'Meera Nambiar',
    },
    {
      id: 'setu',
      name: 'SETU Clearing & Depository Bank',
      shortName: 'SETU',
      tagline: 'Sub-Second Real-Time Rail & Depository Gateway',
      logoPath: '/assets/banks/setu.png',
      licenseNumber: 'SCB-2024-003-STU',
      establishedDate: new Date('2024-03-10'),
      accentColor: '#287A55',
      status: 'ACTIVE',
      ownership: 'Central Depository & Retail Rail Federation',
      governingDirector: 'Vikramaditya Joshi',
    },
    {
      id: 'sthira',
      name: 'STHIRA Prudential Custody Bank',
      shortName: 'STHIRA',
      tagline: 'Institutional Reserve Custodian',
      logoPath: '/assets/banks/sthira.png',
      licenseNumber: 'SCB-2024-004-ST',
      establishedDate: new Date('2024-04-18'),
      accentColor: '#7C3AED',
      status: 'ACTIVE',
      ownership: 'Inter-Bank Reserve Consortium',
      governingDirector: 'Sunita Rao',
    },
    {
      id: 'vayu',
      name: 'VAYU Digital Liquidity Bank',
      shortName: 'VAYU',
      tagline: 'Algorithmic Liquidity Routing',
      logoPath: '/assets/banks/vayu.png',
      licenseNumber: 'SCB-2024-005-VY',
      establishedDate: new Date('2024-05-22'),
      accentColor: '#0EA5E9',
      status: 'ACTIVE',
      ownership: 'Sovereign FinTech Guild',
      governingDirector: 'Kavita Menon',
    },
  ];

  for (const b of banks) {
    await prisma.bank.upsert({
      where: { id: b.id },
      update: b,
      create: b,
    });
  }

  // Central Bank Config
  await prisma.centralBankConfig.upsert({
    where: { charterId: 'SOV-CHARTER-AUTH-2024-001' },
    update: {},
    create: {
      institutionName: 'Central Monetary Authority of ARTHAX',
      charterId: 'SOV-CHARTER-AUTH-2024-001',
      sovereignSeat: 'Capital Central Reserve Complex, Sector 01',
      currentGovernor: 'Dr. Alistair Vance, Governor of the Central Bank',
      deputyGovernor: 'Amira Patel, Deputy Governor of Prudential Oversight',
      auditQuorumCount: 5,
      sessionTimeoutMinutes: 15,
      dualPasswordEnforced: true,
      ipWhitelistEnforced: true,
    },
  });

  // ===========================================================================
  // 2. Named Bank Admins (Decision 5) & Central Bank Officials
  // ===========================================================================
  console.log('👤 Seeding Named Bank Admins & Central Bank Council...');

  const namedAdmins = [
    {
      govIdNumber: 'GOV-0001-0001',
      email: 'governor.vance@arthax.gov',
      displayName: 'Gov. Alistair Vance',
      role: 'CENTRAL_BANK_ADMIN' as const,
    },
    {
      govIdNumber: 'GOV-0001-0002',
      email: 'auditor.kaur@arthax.gov',
      displayName: 'Chief Auditor Harpreet Kaur',
      role: 'CENTRAL_BANK_ADMIN' as const,
    },
    {
      govIdNumber: 'GOV-1001-0001',
      email: 'admin.nava@arthax.gov',
      displayName: 'NAVA Administrator Devendra Sen',
      role: 'BANK_ADMIN' as const,
    },
    {
      govIdNumber: 'GOV-1002-0001',
      email: 'admin.samaya@arthax.gov',
      displayName: 'SAMAYA Administrator Meera Nambiar',
      role: 'BANK_ADMIN' as const,
    },
    {
      govIdNumber: 'GOV-1003-0001',
      email: 'admin.setu@arthax.gov',
      displayName: 'SETU Administrator Vikramaditya Joshi',
      role: 'BANK_ADMIN' as const,
    },
    {
      govIdNumber: 'GOV-1004-0001',
      email: 'admin.sthira@arthax.gov',
      displayName: 'STHIRA Administrator Sunita Rao',
      role: 'BANK_ADMIN' as const,
    },
    {
      govIdNumber: 'GOV-1005-0001',
      email: 'admin.vayu@arthax.gov',
      displayName: 'VAYU Administrator Kavita Menon',
      role: 'BANK_ADMIN' as const,
    },
  ];

  for (const adm of namedAdmins) {
    const gov = await prisma.govId.upsert({
      where: { email: adm.email },
      update: {},
      create: {
        govIdNumber: adm.govIdNumber,
        email: adm.email,
        passwordHash: defaultGovPasswordHash,
        emailVerified: true,
        status: 'ACTIVE',
      },
    });

    await prisma.user.upsert({
      where: { govId: gov.id },
      update: {},
      create: {
        govId: gov.id,
        displayName: adm.displayName,
        role: adm.role,
        financialPasswordHash: defaultFinancialPasswordHash,
        status: 'ACTIVE',
      },
    });
  }

  // ===========================================================================
  // 3. Primary Citizen Demo User
  // ===========================================================================
  console.log('👤 Seeding Primary Citizen: citizen@arthax.gov...');

  const citizenGov = await prisma.govId.upsert({
    where: { email: 'citizen@arthax.gov' },
    update: {},
    create: {
      govIdNumber: 'GOV-8419-2041',
      email: 'citizen@arthax.gov',
      passwordHash: defaultGovPasswordHash,
      emailVerified: true,
      status: 'ACTIVE',
    },
  });

  const citizenUser = await prisma.user.upsert({
    where: { govId: citizenGov.id },
    update: {},
    create: {
      govId: citizenGov.id,
      displayName: 'Aarav Vance',
      role: 'USER',
      financialPasswordHash: defaultFinancialPasswordHash,
      status: 'ACTIVE',
    },
  });

  // Customer relationships across all 5 banks
  for (const b of banks) {
    const cust = await prisma.bankCustomer.upsert({
      where: {
        userId_bankId: {
          userId: citizenUser.id,
          bankId: b.id,
        },
      },
      update: {},
      create: {
        userId: citizenUser.id,
        bankId: b.id,
        customerNumber: `CUST-${b.id.toUpperCase()}-8419`,
        status: 'ACTIVE',
        tier: 'Tier-1 Sovereign Citizen',
      },
    });

    // Bank Accounts with initial minor unit balances
    const initialBalances: Record<string, bigint> = {
      nava: 5000000n,   // 50,000.00 ARTH
      samaya: 12000000n, // 120,000.00 ARTH
      setu: 1500000n,   // 15,000.00 ARTH
      sthira: 8500000n,  // 85,000.00 ARTH
      vayu: 2500000n,   // 25,000.00 ARTH
    };

    const acctNum = `ARTH-${b.id.toUpperCase()}-001`;
    const balance = initialBalances[b.id] || 1000000n;

    const bankAcct = await prisma.bankAccount.upsert({
      where: { accountNumber: acctNum },
      update: {},
      create: {
        accountNumber: acctNum,
        customerId: cust.id,
        bankId: b.id,
        userId: citizenUser.id,
        type: 'SAVINGS',
        purpose: `${b.shortName} Sovereign Treasury Account`,
        status: 'ACTIVE',
      },
    });

    // Matching LedgerAccount
    await prisma.ledgerAccount.upsert({
      where: { bankAccountId: bankAcct.id },
      update: { balanceSnapshot: balance },
      create: {
        accountType: 'BANK_ACCOUNT',
        ownerEntityId: bankAcct.id,
        ownerEntityType: 'BANK_ACCOUNT',
        balanceSnapshot: balance,
        bankAccountId: bankAcct.id,
      },
    });
  }

  // System Ledger Accounts (Pools & Treasuries)
  const systemAccounts = [
    { type: 'CENTRAL_TREASURY' as const, id: 'sys_central_treasury', bal: 5000000000000n },
    { type: 'FEE_POOL' as const, id: 'sys_fee_pool', bal: 100000000n },
    { type: 'TAX_AUTHORITY' as const, id: 'sys_tax_authority', bal: 250000000n },
    { type: 'SHOP_REVENUE' as const, id: 'sys_shop_revenue', bal: 50000000n },
    { type: 'REWARD_POOL' as const, id: 'sys_reward_pool', bal: 500000000n },
    { type: 'CLS_CLEARING' as const, id: 'sys_cls_clearing', bal: 0n },
  ];

  for (const sa of systemAccounts) {
    const existing = await prisma.ledgerAccount.findFirst({
      where: { ownerEntityId: sa.id },
    });
    if (!existing) {
      await prisma.ledgerAccount.create({
        data: {
          accountType: sa.type,
          ownerEntityId: sa.id,
          ownerEntityType: 'SYSTEM',
          balanceSnapshot: sa.bal,
        },
      });
    }
  }

  // ===========================================================================
  // 4. Stock Market: 10 Canonical Listed Companies (Minor Units)
  // ===========================================================================
  console.log('📈 Seeding 10 Listed Companies (Minor Units: Decision 2)...');

  const companies = [
    {
      symbol: 'ANVIK',
      name: 'Anvik Advanced Industrial Forge',
      sector: 'Heavy Industry & Robotics',
      price: 14250n, // 142.50 ARTH
      open: 14100n,
      high: 14520n,
      low: 13980n,
      prevClose: 14000n,
      changePercent: 1.79,
      volume: 842000,
      cap: 2850000000n,
      pe: 18.4,
      limitLow: 12800n,
      limitHigh: 15400n,
      shares: 20000000,
      freeFloat: 42.5,
      divYield: 2.1,
      desc: 'Advanced sovereign manufacturing and precision industrial robotics components.',
    },
    {
      symbol: 'ARKA',
      name: 'Arka Clean Energy Grid',
      sector: 'Renewable Power & Energy Storage',
      price: 21800n, // 218.00 ARTH
      open: 21500n,
      high: 22150n,
      low: 21400n,
      prevClose: 21450n,
      changePercent: 1.63,
      volume: 1205000,
      cap: 5450000000n,
      pe: 24.2,
      limitLow: 19600n,
      limitHigh: 23500n,
      shares: 25000000,
      freeFloat: 55.0,
      divYield: 1.8,
      desc: 'Sovereign solar, hydro, and next-generation utility battery storage grids.',
    },
    {
      symbol: 'NILA',
      name: 'Nila Digital Rail & Infrastructure',
      sector: 'Telecommunications & Computing',
      price: 18500n,
      open: 18200n,
      high: 18750n,
      low: 18100n,
      prevClose: 18250n,
      changePercent: 1.37,
      volume: 950000,
      cap: 3700000000n,
      pe: 21.0,
      limitLow: 16600n,
      limitHigh: 20000n,
      shares: 20000000,
      freeFloat: 48.0,
      divYield: 2.4,
      desc: 'National optical backbone and secure cloud infrastructure operator.',
    },
    {
      symbol: 'TRNG',
      name: 'Tarang Velocity Maritime Transport',
      sector: 'Logistics & Global Trade',
      price: 7850n,
      open: 7900n,
      high: 8020n,
      low: 7780n,
      prevClose: 7900n,
      changePercent: -0.63,
      volume: 640000,
      cap: 1570000000n,
      pe: 14.5,
      limitLow: 7000n,
      limitHigh: 8500n,
      shares: 20000000,
      freeFloat: 60.0,
      divYield: 3.5,
      desc: 'Sovereign container shipping, coastal maritime routes, and automated ports.',
    },
    {
      symbol: 'VEDA',
      name: 'Veda Sovereign BioPharm',
      sector: 'Healthcare & Life Sciences',
      price: 34000n,
      open: 33500n,
      high: 34500n,
      low: 33200n,
      prevClose: 33400n,
      changePercent: 1.80,
      volume: 480000,
      cap: 6800000000n,
      pe: 28.5,
      limitLow: 30600n,
      limitHigh: 36700n,
      shares: 20000000,
      freeFloat: 38.0,
      divYield: 1.2,
      desc: 'Indigenous biotechnology, genome therapeutics, and pharmaceutical research.',
    },
    {
      symbol: 'MERU',
      name: 'Meru Sovereign Minerals & Metallurgy',
      sector: 'Strategic Metals & Mining',
      price: 51000n,
      open: 50200n,
      high: 51800n,
      low: 49800n,
      prevClose: 50000n,
      changePercent: 2.00,
      volume: 320000,
      cap: 10200000000n,
      pe: 16.8,
      limitLow: 45900n,
      limitHigh: 55000n,
      shares: 20000000,
      freeFloat: 35.0,
      divYield: 2.8,
      desc: 'Extraction, refining, and alloy creation of sovereign rare earth materials.',
    },
    {
      symbol: 'KSHT',
      name: 'Kshiti Agritech Systems',
      sector: 'Precision Agriculture',
      price: 9200n,
      open: 9100n,
      high: 9350n,
      low: 9050n,
      prevClose: 9100n,
      changePercent: 1.10,
      volume: 720000,
      cap: 1840000000n,
      pe: 19.2,
      limitLow: 8200n,
      limitHigh: 9900n,
      shares: 20000000,
      freeFloat: 50.0,
      divYield: 3.1,
      desc: 'Automated irrigation, sensor-guided farming, and grain reserve logistics.',
    },
    {
      symbol: 'AROHA',
      name: 'Aroha Aerospace & Defense Rails',
      sector: 'Defense & Avionics',
      price: 16400n,
      open: 16200n,
      high: 16650n,
      low: 16100n,
      prevClose: 16150n,
      changePercent: 1.55,
      volume: 810000,
      cap: 3280000000n,
      pe: 22.4,
      limitLow: 14700n,
      limitHigh: 17700n,
      shares: 20000000,
      freeFloat: 40.0,
      divYield: 1.5,
      desc: 'Avionics, radar telemetry, and satellite communications hardware.',
    },
    {
      symbol: 'JALA',
      name: 'Jala HydroTech Utilities',
      sector: 'Water Treatment & Desalination',
      price: 12800n,
      open: 12700n,
      high: 13000n,
      low: 12600n,
      prevClose: 12700n,
      changePercent: 0.79,
      volume: 530000,
      cap: 2560000000n,
      pe: 17.5,
      limitLow: 11500n,
      limitHigh: 13800n,
      shares: 20000000,
      freeFloat: 52.0,
      divYield: 2.9,
      desc: 'Desalination facilities, urban water filtration networks, and river reservoirs.',
    },
    {
      symbol: 'PRAVA',
      name: 'Prava Microelectronics & Silicon',
      sector: 'Semiconductors & Foundry',
      price: 29500n,
      open: 29000n,
      high: 30100n,
      low: 28800n,
      prevClose: 29100n,
      changePercent: 1.37,
      volume: 1150000,
      cap: 5900000000n,
      pe: 31.2,
      limitLow: 26500n,
      limitHigh: 31800n,
      shares: 20000000,
      freeFloat: 45.0,
      divYield: 0.8,
      desc: 'National silicon fabrication foundry producing sovereign secure microchips.',
    },
  ];

  for (const c of companies) {
    await prisma.stockCompany.upsert({
      where: { symbol: c.symbol },
      update: {
        currentPriceMinor: c.price,
        openingPriceMinor: c.open,
        dayHighMinor: c.high,
        dayLowMinor: c.low,
        previousCloseMinor: c.prevClose,
        changePercent: c.changePercent,
        volume: c.volume,
        marketCapMinor: c.cap,
      },
      create: {
        symbol: c.symbol,
        name: c.name,
        sector: c.sector,
        currentPriceMinor: c.price,
        openingPriceMinor: c.open,
        dayHighMinor: c.high,
        dayLowMinor: c.low,
        previousCloseMinor: c.prevClose,
        changePercent: c.changePercent,
        volume: c.volume,
        marketCapMinor: c.cap,
        peRatio: c.pe,
        circuitLimitLowMinor: c.limitLow,
        circuitLimitHighMinor: c.limitHigh,
        circuitBreakerActive: false,
        sharesOutstanding: c.shares,
        freeFloatPercent: c.freeFloat,
        dividendYield: c.divYield,
        description: c.desc,
        listedDate: new Date('2024-01-01'),
        status: 'ACTIVE',
      },
    });
  }

  // ===========================================================================
  // 5. Shop & Customization: 45 Items with Modest Perks (Decision 3)
  // ===========================================================================
  console.log('🛍️ Seeding Shop Items with Modest Perks (Decision 3)...');

  // 8 Official Pets
  const pets = [
    {
      id: 'pet-gaja',
      name: 'Wealth Elephant ("Gaja")',
      category: 'pets' as const,
      rarity: 'gold' as const,
      price: 920000n,
      image: '/assets/shop/pets/Wealth Elephant/main_image.png',
      rank: 'Rank #01',
      role: 'Term Yield Protector',
      powerTitle: '+0.25% Sovereign Term Deposit Yield Booster',
      powerDesc: 'Modest mathematical APY amplifier applied to connected Fixed Deposits.',
    },
    {
      id: 'pet-vrishabha',
      name: 'Market Bull ("Vrishabha")',
      category: 'pets' as const,
      rarity: 'gold' as const,
      price: 850000n,
      image: '/assets/shop/pets/Market Bull/main_image.png',
      rank: 'Rank #02',
      role: 'Equities Accelerator',
      powerTitle: '-10% Equities Brokerage',
      powerDesc: 'Modest discount on institutional order execution fees.',
    },
    {
      id: 'pet-lopamudra',
      name: 'Saver Fox ("Lopamudra")',
      category: 'pets' as const,
      rarity: 'epic' as const,
      price: 420000n,
      image: '/assets/shop/pets/Saver Fox/main_image.png',
      rank: 'Rank #03',
      role: 'Cashflow Vault Guardian',
      powerTitle: '+2% Cashback on Inter-Bank DvP Transfers',
      powerDesc: 'Modest settlement rebate on bilateral clearing transactions.',
    },
    {
      id: 'pet-vidya',
      name: 'Ledger Owl ("Vidya")',
      category: 'pets' as const,
      rarity: 'epic' as const,
      price: 340000n,
      image: '/assets/shop/pets/Ledger Owl/main_image.png',
      rank: 'Rank #04',
      role: 'Knowledge & Analytics Oracle',
      powerTitle: '+0.10% FD Yield Booster & Priority Telemetry',
      powerDesc: 'Modest interest yield multiplier with priority audit stream access.',
    },
    {
      id: 'pet-baka',
      name: 'Settlement Crane ("Baka")',
      category: 'pets' as const,
      rarity: 'rare' as const,
      price: 380000n,
      image: '/assets/shop/pets/Settlement Crane/main_image.png',
      rank: 'Rank #05',
      role: 'DvP Velocity Arbiter',
      powerTitle: 'Priority CLS Settlement Queue Entry',
      powerDesc: 'Prioritizes bilateral clearing queue finality.',
    },
    {
      id: 'pet-jala',
      name: 'Flow Otter ("Jala")',
      category: 'pets' as const,
      rarity: 'rare' as const,
      price: 280000n,
      image: '/assets/shop/pets/Flow Otter/main_image.png',
      rank: 'Rank #06',
      role: 'Liquidity Custodian',
      powerTitle: 'Zero Fee on Real-Time Retail Clears',
      powerDesc: 'Waives retail transfer fees across commercial banking nodes.',
    },
    {
      id: 'pet-kurma',
      name: 'Tax Tortoise ("Kurma")',
      category: 'pets' as const,
      rarity: 'normal' as const,
      price: 240000n,
      image: '/assets/shop/pets/Tax Tortoise/main_image.png',
      rank: 'Rank #07',
      role: 'Prudence Shield',
      powerTitle: 'Reduced Penalty on Early FD Liquidation',
      powerDesc: 'Reduces early liquidation penalty fee by 25%.',
    },
    {
      id: 'pet-marjara',
      name: 'Archive Cat ("Marjara")',
      category: 'pets' as const,
      rarity: 'normal' as const,
      price: 190000n,
      image: '/assets/shop/pets/Archive Cat/main_image.png',
      rank: 'Rank #08',
      role: 'Audit Enclave',
      powerTitle: 'Priority Institutional Circulars Dispatch',
      powerDesc: 'Immediate notification dispatch for Central Bank circulars.',
    },
  ];

  for (const p of pets) {
    await prisma.shopItem.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        name: p.name,
        category: p.category,
        rarity: p.rarity,
        priceMinor: p.price,
        image: p.image,
        rank: p.rank,
        role: p.role,
        powerTitle: p.powerTitle,
        powerDescription: p.powerDesc,
        active: true,
      },
    });
  }

  // 7 Official Enclave Frames strictly mapped per AGENTS.md resolved decisions
  const frames = [
    { id: 'frm-gold', name: 'Sovereign Gold Filigree Rim', rarity: 'gold' as const, price: 480000n, img: '/assets/shop/frames/gold.png' },
    { id: 'frm-aurora', name: 'Aurora Intaglio Shimmer Frame', rarity: 'epic' as const, price: 320000n, img: '/assets/shop/frames/Aurora.png' },
    { id: 'frm-nova', name: 'Nova Stellar Horizon Border', rarity: 'epic' as const, price: 340000n, img: '/assets/shop/frames/Nova.png' },
    { id: 'frm-orbit', name: 'Orbital Planetary Wire Rim', rarity: 'rare' as const, price: 180000n, img: '/assets/shop/frames/orbit.png' },
    { id: 'frm-pulse', name: 'DvP Pulse Frequency Bezel', rarity: 'rare' as const, price: 200000n, img: '/assets/shop/frames/pluse.png' },
    { id: 'frm-leaf', name: 'Botanical Archival Foliage Frame', rarity: 'normal' as const, price: 95000n, img: '/assets/shop/frames/leaf.png' },
    { id: 'frm-vertex', name: 'Geometric Consensus Vertex Edge', rarity: 'normal' as const, price: 110000n, img: '/assets/shop/frames/vertex.png' },
  ];

  for (const f of frames) {
    await prisma.shopItem.upsert({
      where: { id: f.id },
      update: {},
      create: {
        id: f.id,
        name: f.name,
        category: 'frames',
        rarity: f.rarity,
        priceMinor: f.price,
        image: f.img,
        active: true,
      },
    });
  }

  // User Default Loadout & Inventory
  const initialOwnedItemIds = ['frm-gold', 'frm-aurora', 'pet-vidya', 'pet-kurma'];

  for (const itemId of initialOwnedItemIds) {
    await prisma.userInventory.upsert({
      where: {
        userId_itemId: {
          userId: citizenUser.id,
          itemId,
        },
      },
      update: {},
      create: {
        userId: citizenUser.id,
        itemId,
      },
    });
  }

  await prisma.userLoadout.upsert({
    where: { userId: citizenUser.id },
    update: {},
    create: {
      userId: citizenUser.id,
      frameId: 'frm-gold',
      avatarId: 'avt-f-business',
      bannerId: 'bnr-gold-1',
      petId: 'pet-vidya',
    },
  });

  // ===========================================================================
  // 6. Central Bank Versioned Financial & Tax Rules
  // ===========================================================================
  console.log('📜 Seeding Central Bank Rules...');

  const financialRules = [
    {
      id: 'pol-001',
      key: 'POL-BASE-RATE',
      title: 'Base Central Policy Interest Benchmark (CRR-Linked)',
      currentValue: 4.25,
      unit: '% APY',
      category: 'Monetary Policy',
      description: 'Benchmark overnight repurchase rate setting the policy corridor for commercial banks.',
      version: 'v2.4.0',
      modifiedBy: 'Gov. Alistair Vance',
      effectiveDate: new Date('2026-09-01'),
      statutoryBasis: 'Monetary Authority Act §14(b)',
    },
    {
      id: 'pol-002',
      key: 'POL-CRR-REQ',
      title: 'Cash Reserve Ratio (Tier-1 Apex Obligation)',
      currentValue: 12.0,
      unit: '% of Deposits',
      category: 'Prudential Requirements',
      description: 'Mandatory unencumbered reserve balance commercial banks must maintain at the Central Vault.',
      version: 'v3.1.0',
      modifiedBy: 'Board of Governors',
      effectiveDate: new Date('2026-08-01'),
      statutoryBasis: 'Prudential Reserve Directive §4',
    },
  ];

  for (const r of financialRules) {
    await prisma.financialRule.upsert({
      where: { key: r.key },
      update: {},
      create: r,
    });
  }

  const taxRules = [
    {
      id: 'tax-001',
      code: 'TAX-EQUITY-PROFIT',
      name: 'Realized Equities Net Capital Gains Tax',
      category: 'Equities',
      ratePercent: 15.0,
      thresholdMinor: 0n,
      description: 'Levied strictly on net realized capital gains. Zero tax on unrealized gains.',
      version: 'v2.1.0',
      effectiveFrom: new Date('2026-01-01'),
    },
    {
      id: 'tax-002',
      code: 'TAX-TRANSFER-STAMP',
      name: 'Inter-Bank Settlement Statutory Stamp Levy',
      category: 'Transactions',
      ratePercent: 0.05,
      thresholdMinor: 100000n, // Above 1,000.00 ARTH
      description: 'Statutory fiscal levy on cross-bank DvP transactions routed through the CLS.',
      version: 'v1.4.0',
      effectiveFrom: new Date('2026-01-01'),
    },
  ];

  for (const tr of taxRules) {
    await prisma.taxRule.upsert({
      where: { code: tr.code },
      update: {},
      create: tr,
    });
  }

  console.log('✅ ARTHAX deterministic database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
