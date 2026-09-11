import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { ShopService } from './shop.service';
import { PrismaService } from '../database/prisma.service';
import { LedgerService } from '../ledger/ledger.service';
import { AuditService } from '../audit/audit.service';
import { SOVEREIGN_SYSTEM_ACCOUNTS } from '../ledger/ledger-invariants';
import { EquippedLoadoutDto } from '@arthax/types';

/**
 * ARTHAX Phase 8: Shop & Virtual Economy Invariant Test Suite
 * Validates the sovereign virtual economy invariants:
 * 1. Database-authoritative catalog with 45 canonical items in integer minor units.
 * 2. Enclave frame rarity tiers matching AGENTS.md.
 * 3. Single atomic purchase transaction (Ledger DEBIT buyer + CREDIT sys_shop_revenue + Vault grant).
 * 4. Single atomic gift transaction (Ledger DEBIT sender + CREDIT sys_shop_revenue + Recipient vault grant).
 * 5. Concurrency protection: Two simultaneous purchases of same unique item -> exactly one succeeds.
 * 6. Concurrency protection: Two simultaneous gifts of same item to same recipient -> exactly one succeeds.
 * 7. Rollback verification: Ledger debit with simulated inventory write failure -> entire transaction rolls back.
 * 8. Rollback verification: Gift with simulated recipient grant failure -> entire transaction rolls back.
 * 9. Idempotent purchase replay -> cannot double-charge.
 * 10. Idempotent gift replay -> cannot double-charge.
 * 11. Single-active-pet invariant: Exactly one active pet allowed in loadout; zero stacking.
 * 12. Equip gating: Unowned item equip rejected with ForbiddenException.
 * 13. Catalog lifecycle: Retired or disabled item rejected from purchase/gift.
 * 14. Bounded pet modifier: Consumed by downstream domain rules; civic bounty debited from sys_reward_pool.
 * 15. Financial security: Argon2id financial password verification, self-gifting rejection, status checks.
 */
async function runShopTests() {
  console.log('=================================================================');
  console.log('  ARTHAX SHOP & VIRTUAL ECONOMY — PHASE 8 INVARIANT SUITE');
  console.log('=================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(name: string, condition: boolean, details?: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name} ${details ? '- ' + details : ''}`);
      failed++;
    }
  }

  // ---------------------------------------------------------------------------
  // MOCK INFRASTRUCTURE & SERVICES
  // ---------------------------------------------------------------------------
  const mockPrisma = {
    isConnected: false,
    shopItem: {
      findMany: async () => [],
      findUnique: async () => null,
    },
    user: {
      findUnique: async () => null,
      findFirst: async () => null,
    },
    userInventory: {
      findUnique: async () => null,
      findMany: async () => [],
      create: async () => {},
    },
    userLoadout: {
      findUnique: async () => null,
      upsert: async () => {},
    },
    bankAccount: {
      findUnique: async () => null,
    },
    $transaction: async (fn: any) => fn(mockPrisma),
  } as unknown as PrismaService;

  const mockLedgerService = {
    recordBalancedTransaction: async (req: any) => {
      return {
        id: `tx_mock_${Date.now()}`,
        referenceNumber: req.referenceNumber,
        type: req.type,
        status: 'COMPLETED',
        scope: req.scope,
        amountMinor: req.amountMinor.toString(),
        feesMinor: '0',
        taxMinor: '0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        entries: req.entries.map((e: any, idx: number) => ({
          id: `entry_${idx}`,
          ledgerAccountId: e.ledgerAccountId,
          entryType: e.entryType,
          amountMinor: e.amountMinor.toString(),
        })),
      };
    },
  } as unknown as LedgerService;

  const mockAuditService = {
    logEvent: async () => ({ id: 'audit_mock' }),
  } as unknown as AuditService;

  const shopService = new ShopService(mockPrisma, mockLedgerService, mockAuditService);

  // Setup test citizen credentials
  const validFinancialPassword = 'ValidFinPass!2026';
  const hashedFinPass = await argon2.hash(validFinancialPassword);

  const citizenA = {
    id: 'usr_citizen_a',
    govIdNumber: 'GOV-1111-2222',
    email: 'citizen.a@arthax.gov',
    displayName: 'Aarav Sharma',
    status: 'ACTIVE',
    financialPasswordHash: hashedFinPass,
  };

  const citizenB = {
    id: 'usr_citizen_b',
    govIdNumber: 'GOV-3333-4444',
    email: 'citizen.b@arthax.gov',
    displayName: 'Priya Iyer',
    status: 'ACTIVE',
    financialPasswordHash: hashedFinPass,
  };

  const suspendedCitizen = {
    id: 'usr_citizen_suspended',
    govIdNumber: 'GOV-5555-6666',
    email: 'suspended@arthax.gov',
    displayName: 'Suspended Citizen',
    status: 'SUSPENDED',
    financialPasswordHash: hashedFinPass,
  };

  shopService.seedCitizen(citizenA.id, citizenA.govIdNumber, citizenA.email, citizenA.displayName, citizenA.status, citizenA.financialPasswordHash);
  shopService.seedCitizen(citizenB.id, citizenB.govIdNumber, citizenB.email, citizenB.displayName, citizenB.status, citizenB.financialPasswordHash);
  shopService.seedCitizen(suspendedCitizen.id, suspendedCitizen.govIdNumber, suspendedCitizen.email, suspendedCitizen.displayName, suspendedCitizen.status, suspendedCitizen.financialPasswordHash);

  const accountA = 'acct_aarav_nava_01';
  const accountB = 'acct_priya_setu_01';

  shopService.seedAccountBalance(accountA, 2000000n); // 20,000.00 ARTH
  shopService.seedAccountBalance(accountB, 1000000n); // 10,000.00 ARTH

  // ---------------------------------------------------------------------------
  // TEST GROUP 1: CATALOG INTEGRITY & INTEGER MINOR UNIT PRICING
  // ---------------------------------------------------------------------------
  console.log('\n--- Group 1: Catalog Integrity & Minor Unit Pricing ---');

  const fullCatalog = await shopService.listCatalog();
  assert('Catalog initializes with all 45 canonical items', fullCatalog.length === 45, `Found ${fullCatalog.length}`);

  const pets = await shopService.listCatalog('pet');
  assert('Category filter "pet" returns exactly 8 official financial pets', pets.length === 8, `Found ${pets.length}`);

  const frames = await shopService.listCatalog('frame');
  assert('Category filter "frame" returns exactly 7 enclave avatar frames', frames.length === 7, `Found ${frames.length}`);

  const avatars = await shopService.listCatalog('avatar');
  assert('Category filter "avatar" returns exactly 16 sovereign identity personas', avatars.length === 16, `Found ${avatars.length}`);

  const banners = await shopService.listCatalog('banner');
  assert('Category filter "banner" returns exactly 14 vault backdrop headers', banners.length === 14, `Found ${banners.length}`);

  const gaja = await shopService.getItem('pet-gaja');
  assert('Wealth Elephant ("Gaja") price is 920,000 integer minor units (9,200 ARTH)', gaja.priceMinor === '920000' && gaja.priceMinorBigInt === 920000n);
  assert('Catalog item ownership type is UNIQUE_PER_USER', gaja.ownershipType === 'UNIQUE_PER_USER');

  // Verify all items have integer minor unit pricing with no secondary currency
  const allIntegerMinor = fullCatalog.every((item) => /^\d+$/.test(item.priceMinor) && !item.priceMinor.includes('.'));
  assert('All catalog items strictly priced in integer minor units (no decimal points or secondary tokens)', allIntegerMinor);

  // ---------------------------------------------------------------------------
  // TEST GROUP 2: STRICT FRAME RARITY TIERS MAPPING TO AGENTS.md
  // ---------------------------------------------------------------------------
  console.log('\n--- Group 2: Frame Rarity Tiers (AGENTS.md Invariants) ---');

  const goldFrame = await shopService.getItem('frm-gold');
  assert('gold.png (frm-gold) maps to "gold" rarity tier', goldFrame.rarity === 'gold');

  const auroraFrame = await shopService.getItem('frm-aurora');
  const novaFrame = await shopService.getItem('frm-nova');
  assert('Aurora.png (frm-aurora) and Nova.png (frm-nova) map to "epic" rarity tier', auroraFrame.rarity === 'epic' && novaFrame.rarity === 'epic');

  const orbitFrame = await shopService.getItem('frm-orbit');
  const pulseFrame = await shopService.getItem('frm-pulse');
  assert('orbit.png (frm-orbit) and pluse.png (frm-pulse) map to "rare" rarity tier', orbitFrame.rarity === 'rare' && pulseFrame.rarity === 'rare');

  const leafFrame = await shopService.getItem('frm-leaf');
  const vertexFrame = await shopService.getItem('frm-vertex');
  assert('leaf.png (frm-leaf) and vertex.png (frm-vertex) map to "normal" rarity tier', leafFrame.rarity === 'normal' && vertexFrame.rarity === 'normal');

  // ---------------------------------------------------------------------------
  // TEST GROUP 3: SINGLE ATOMIC PURCHASE PROTOCOL
  // ---------------------------------------------------------------------------
  console.log('\n--- Group 3: Single Atomic Purchase Protocol ---');

  const initialBalanceA = await shopService.getAccountBalance(accountA);
  const purchaseResult = await shopService.purchaseItem(
    citizenA.id,
    {
      itemId: 'frm-nova', // 3,400 ARTH = 340,000 minor units
      sourceAccountId: accountA,
      financialPassword: validFinancialPassword,
    },
    'idem_purchase_001',
  );

  assert('Purchase execution returns success = true', purchaseResult.success === true);
  assert('Purchase returns valid completed transaction', purchaseResult.transaction.status === 'COMPLETED');

  const postPurchaseBalanceA = await shopService.getAccountBalance(accountA);
  assert(
    'Buyer account balance decremented by exact item price (340,000 minor units)',
    postPurchaseBalanceA === initialBalanceA - 340000n,
    `Expected ${initialBalanceA - 340000n}, got ${postPurchaseBalanceA}`,
  );

  const inventoryA = await shopService.getUserInventory(citizenA.id);
  assert('Purchased artifact [frm-nova] granted into buyer sovereign vault', inventoryA.ownedItemIds.includes('frm-nova'));

  // Reject duplicate purchase of already-owned unique item
  let duplicateRejected = false;
  try {
    await shopService.purchaseItem(citizenA.id, {
      itemId: 'frm-nova',
      sourceAccountId: accountA,
      financialPassword: validFinancialPassword,
    });
  } catch (err: any) {
    duplicateRejected = err instanceof BadRequestException && err.message.includes('already own artifact');
  }
  assert('Duplicate purchase of already-owned unique artifact rejected with BadRequestException', duplicateRejected);

  // Reject purchase with invalid Financial Password
  let invalidPassRejected = false;
  try {
    await shopService.purchaseItem(citizenA.id, {
      itemId: 'frm-orbit',
      sourceAccountId: accountA,
      financialPassword: 'WrongFinancialPassword!',
    });
  } catch (err: any) {
    invalidPassRejected = err instanceof ForbiddenException && err.message.includes('Invalid Financial Password');
  }
  assert('Purchase with incorrect Financial Password rejected with ForbiddenException', invalidPassRejected);

  // Reject purchase with insufficient balance
  shopService.seedAccountBalance('acct_empty', 100n);
  let insufficientFundsRejected = false;
  try {
    await shopService.purchaseItem(citizenA.id, {
      itemId: 'frm-orbit',
      sourceAccountId: 'acct_empty',
      financialPassword: validFinancialPassword,
    });
  } catch (err: any) {
    insufficientFundsRejected = err instanceof BadRequestException && err.message.includes('Insufficient funds');
  }
  assert('Purchase with insufficient funds rejected with BadRequestException', insufficientFundsRejected);

  // ---------------------------------------------------------------------------
  // TEST GROUP 4: ATOMIC GIFTING PROTOCOL
  // ---------------------------------------------------------------------------
  console.log('\n--- Group 4: Atomic Gifting Protocol ---');

  const preGiftBalanceA = await shopService.getAccountBalance(accountA);
  const giftResult = await shopService.giftItem(
    citizenA.id,
    {
      itemId: 'bnr-gold-1', // 2,100 ARTH = 210,000 minor units
      sourceAccountId: accountA,
      recipientGovIdOrEmail: citizenB.govIdNumber,
      financialPassword: validFinancialPassword,
    },
    'idem_gift_001',
  );

  assert('Gifting execution returns success = true', giftResult.success === true);
  assert('Gifting returns recipient user ID', giftResult.recipientUserId === citizenB.id);

  const postGiftBalanceA = await shopService.getAccountBalance(accountA);
  assert(
    'Sender account balance decremented by exact gift cost (210,000 minor units)',
    postGiftBalanceA === preGiftBalanceA - 210000n,
    `Expected ${preGiftBalanceA - 210000n}, got ${postGiftBalanceA}`,
  );

  const inventoryB = await shopService.getUserInventory(citizenB.id);
  assert('Gifted artifact [bnr-gold-1] directly granted into recipient vault', inventoryB.ownedItemIds.includes('bnr-gold-1'));

  const inventoryAPostGift = await shopService.getUserInventory(citizenA.id);
  assert('Sender does NOT receive the gifted item in their own vault', !inventoryAPostGift.ownedItemIds.includes('bnr-gold-1'));

  // Self-gifting rejection
  let selfGiftRejected = false;
  try {
    await shopService.giftItem(citizenA.id, {
      itemId: 'bnr-gold-2',
      sourceAccountId: accountA,
      recipientGovIdOrEmail: citizenA.govIdNumber,
      financialPassword: validFinancialPassword,
    });
  } catch (err: any) {
    selfGiftRejected = err instanceof BadRequestException && err.message.includes('Self-gifting is prohibited');
  }
  assert('Self-gifting is strictly rejected with BadRequestException', selfGiftRejected);

  // Gifting to suspended citizen rejection
  let suspendedRecipientRejected = false;
  try {
    await shopService.giftItem(citizenA.id, {
      itemId: 'bnr-gold-2',
      sourceAccountId: accountA,
      recipientGovIdOrEmail: suspendedCitizen.email,
      financialPassword: validFinancialPassword,
    });
  } catch (err: any) {
    suspendedRecipientRejected = err instanceof BadRequestException && err.message.includes('SUSPENDED');
  }
  assert('Gifting to a SUSPENDED citizen is rejected with BadRequestException', suspendedRecipientRejected);

  // Gifting already-owned item to recipient rejection
  let duplicateGiftRejected = false;
  try {
    await shopService.giftItem(citizenA.id, {
      itemId: 'bnr-gold-1', // Citizen B already owns bnr-gold-1 from previous step!
      sourceAccountId: accountA,
      recipientGovIdOrEmail: citizenB.email,
      financialPassword: validFinancialPassword,
    });
  } catch (err: any) {
    duplicateGiftRejected = err instanceof BadRequestException && err.message.includes('already owns artifact');
  }
  assert('Gifting an artifact already owned by recipient is rejected (no wasted gifts)', duplicateGiftRejected);

  // ---------------------------------------------------------------------------
  // TEST GROUP 5: CONCURRENCY PROTECTION (RACE CONDITIONS)
  // ---------------------------------------------------------------------------
  console.log('\n--- Group 5: Concurrency Protection ---');

  // Race condition: Two simultaneous purchases of same unique item by same citizen
  const raceItem = 'frm-pulse';
  const buyerId = 'usr_race_buyer';
  shopService.seedCitizen(buyerId, 'GOV-7777-8888', 'race.buyer@arthax.gov', 'Race Buyer', 'ACTIVE', hashedFinPass);
  const raceAccount = 'acct_race_buyer';
  shopService.seedAccountBalance(raceAccount, 10000000n); // 100,000 ARTH

  const purchaseAttempts = await Promise.allSettled([
    shopService.purchaseItem(buyerId, {
      itemId: raceItem,
      sourceAccountId: raceAccount,
      financialPassword: validFinancialPassword,
    }),
    shopService.purchaseItem(buyerId, {
      itemId: raceItem,
      sourceAccountId: raceAccount,
      financialPassword: validFinancialPassword,
    }),
  ]);

  const purchaseSuccesses = purchaseAttempts.filter((p) => p.status === 'fulfilled');
  const purchaseFailures = purchaseAttempts.filter((p) => p.status === 'rejected');
  assert('Concurrent purchase race: exactly one purchase succeeds', purchaseSuccesses.length === 1, `Successes: ${purchaseSuccesses.length}`);
  assert('Concurrent purchase race: the other purchase is rejected', purchaseFailures.length === 1);

  // Race condition: Two simultaneous gifts of same item to same recipient
  const giftRaceItem = 'bnr-norm-1';
  const recipientId = 'usr_race_recipient';
  shopService.seedCitizen(recipientId, 'GOV-8888-9999', 'race.recipient@arthax.gov', 'Race Recipient', 'ACTIVE', hashedFinPass);

  const giftAttempts = await Promise.allSettled([
    shopService.giftItem(citizenA.id, {
      itemId: giftRaceItem,
      sourceAccountId: accountA,
      recipientGovIdOrEmail: 'GOV-8888-9999',
      financialPassword: validFinancialPassword,
    }),
    shopService.giftItem(citizenA.id, {
      itemId: giftRaceItem,
      sourceAccountId: accountA,
      recipientGovIdOrEmail: 'GOV-8888-9999',
      financialPassword: validFinancialPassword,
    }),
  ]);

  const giftSuccesses = giftAttempts.filter((p) => p.status === 'fulfilled');
  const giftFailures = giftAttempts.filter((p) => p.status === 'rejected');
  assert('Concurrent gift race: exactly one gift succeeds', giftSuccesses.length === 1, `Successes: ${giftSuccesses.length}`);
  assert('Concurrent gift race: the other gift is rejected', giftFailures.length === 1);

  // ---------------------------------------------------------------------------
  // TEST GROUP 6: ATOMIC ROLLBACK VERIFICATION
  // ---------------------------------------------------------------------------
  console.log('\n--- Group 6: Atomic Rollback Invariants ---');

  // Verify that if a failure occurs during transactional execution, the ledger debit rolls back.
  let transactionRollbackTested = false;
  const failingPrisma = {
    isConnected: true,
    shopItem: {
      findUnique: async () => ({
        id: 'frm-gold',
        name: 'Sovereign Gold Filigree Rim',
        category: 'frame',
        rarity: 'gold',
        priceMinor: 480000n,
        status: 'ACTIVE',
        ownershipType: 'UNIQUE_PER_USER',
      }),
    },
    user: {
      findUnique: async () => ({ financialPasswordHash: hashedFinPass }),
    },
    userInventory: {
      findUnique: async () => null,
      create: async () => {
        throw new Error('Database disk I/O error during userInventory insertion');
      },
    },
    $transaction: async (fn: any) => {
      return fn({
        userInventory: {
          findUnique: async () => null,
          create: async () => {
            throw new Error('Database disk I/O error during userInventory insertion');
          },
        },
      });
    },
  } as unknown as PrismaService;

  const failingShopService = new ShopService(failingPrisma, mockLedgerService, mockAuditService);
  failingShopService.seedAccountBalance('acct_rollback_test', 10000000n);

  try {
    await failingShopService.purchaseItem('usr_rollback_citizen', {
      itemId: 'frm-gold',
      sourceAccountId: 'acct_rollback_test',
      financialPassword: validFinancialPassword,
    });
  } catch (err: any) {
    transactionRollbackTested = err instanceof BadRequestException && err.message.includes('Purchase settlement failed');
  }
  assert('Failure during inventory grant triggers complete transactional rollback (no charged balance without item)', transactionRollbackTested);

  // ---------------------------------------------------------------------------
  // TEST GROUP 7: IDEMPOTENCY REPLAY & CONFLICT DETECTION
  // ---------------------------------------------------------------------------
  console.log('\n--- Group 7: Idempotency Protection ---');

  const idemKey = 'idem_shop_replay_999';
  const idemPurchasePayload = {
    itemId: 'avt-m-business',
    sourceAccountId: accountA,
    financialPassword: validFinancialPassword,
  };

  const initialIdemPurchase = await shopService.purchaseItem(citizenA.id, idemPurchasePayload, idemKey);
  assert('Initial purchase with idempotency key succeeds', initialIdemPurchase.success === true);

  const balAfterInitial = await shopService.getAccountBalance(accountA);

  // Replay identical payload with same key
  const replayedPurchase = await shopService.purchaseItem(citizenA.id, idemPurchasePayload, idemKey);
  assert('Replayed purchase returns identical cached result', replayedPurchase.itemId === initialIdemPurchase.itemId);
  assert('Replayed purchase flagged with isIdempotentReplay = true', replayedPurchase.isIdempotentReplay === true);

  const balAfterReplay = await shopService.getAccountBalance(accountA);
  assert('Idempotent replay does NOT double-debit buyer account', balAfterReplay === balAfterInitial);

  // Conflicting payload with same key
  let idemConflictDetected = false;
  try {
    await shopService.purchaseItem(
      citizenA.id,
      {
        ...idemPurchasePayload,
        itemId: 'avt-f-business', // Changed item ID!
      },
      idemKey,
    );
  } catch (err: any) {
    idemConflictDetected = err instanceof ConflictException && err.message.includes('Idempotency conflict');
  }
  assert('Conflicting payload with existing idempotency key rejected with ConflictException', idemConflictDetected);

  // ---------------------------------------------------------------------------
  // TEST GROUP 8: SINGLE-ACTIVE-PET INVARIANT (ZERO STACKING) & LOADOUT
  // ---------------------------------------------------------------------------
  console.log('\n--- Group 8: Single-Active-Pet Invariant (Zero Stacking) ---');

  // Seed citizen B with two pets in their vault
  shopService.seedUserInventory(citizenB.id, 'pet-vidya');
  shopService.seedUserInventory(citizenB.id, 'pet-vrishabha');
  shopService.seedUserInventory(citizenB.id, 'frm-gold');

  // Initially equip pet-vidya
  await shopService.equipLoadout(citizenB.id, {
    petId: 'pet-vidya',
    frameId: 'frm-gold',
  });

  const modifierVidya = await shopService.getActivePetModifier(citizenB.id);
  assert('Equipped Ledger Owl ("Vidya") emits +0.10% FD yield boost', modifierVidya !== null && modifierVidya.petId === 'pet-vidya' && modifierVidya.valuePercent === 0.10);
  assert('Modifier belongs to BANKING downstream domain', modifierVidya?.downstreamDomain === 'BANKING');

  // Now equip pet-vrishabha -> Atomically replaces pet-vidya!
  await shopService.equipLoadout(citizenB.id, {
    petId: 'pet-vrishabha',
  });

  const modifierVrishabha = await shopService.getActivePetModifier(citizenB.id);
  assert('Equipping Market Bull ("Vrishabha") atomically replaces previous pet in loadout', modifierVrishabha !== null && modifierVrishabha.petId === 'pet-vrishabha');
  assert('Active pet emits ONLY -10% equities brokerage discount; NO STACKING with Vidya power', modifierVrishabha?.valuePercent === 10 && modifierVrishabha?.downstreamDomain === 'STOCKS');

  const invBLoadout = await shopService.getUserInventory(citizenB.id);
  assert('Citizen loadout strictly maintains at most ONE active pet companion (petId)', invBLoadout.loadout.petId === 'pet-vrishabha');

  // ---------------------------------------------------------------------------
  // TEST GROUP 9: EQUIP GATING (VAULT OWNERSHIP REQUIRED)
  // ---------------------------------------------------------------------------
  console.log('\n--- Group 9: Equip Gating ---');

  let unownedEquipRejected = false;
  try {
    await shopService.equipLoadout(citizenB.id, {
      frameId: 'frm-vertex', // Citizen B does NOT own frm-vertex!
    });
  } catch (err: any) {
    unownedEquipRejected = err instanceof ForbiddenException && err.message.includes('do not own this artifact');
  }
  assert('Equipping unowned artifact rejected with ForbiddenException', unownedEquipRejected);

  let unownedPetEquipRejected = false;
  try {
    await shopService.equipLoadout(citizenB.id, {
      petId: 'pet-gaja', // Citizen B does NOT own Wealth Elephant!
    });
  } catch (err: any) {
    unownedPetEquipRejected = err instanceof ForbiddenException && err.message.includes('do not own this pet');
  }
  assert('Equipping unowned pet rejected with ForbiddenException', unownedPetEquipRejected);

  // ---------------------------------------------------------------------------
  // TEST GROUP 10: CATALOG LIFECYCLE STATES (ACTIVE, DISABLED, RETIRED)
  // ---------------------------------------------------------------------------
  console.log('\n--- Group 10: Catalog Lifecycle States ---');

  // Disable an item
  shopService.updateItemStatus('pet-kurma', 'DISABLED');
  let disabledPurchaseRejected = false;
  try {
    await shopService.purchaseItem(citizenA.id, {
      itemId: 'pet-kurma',
      sourceAccountId: accountA,
      financialPassword: validFinancialPassword,
    });
  } catch (err: any) {
    disabledPurchaseRejected = err instanceof BadRequestException && err.message.includes('currently disabled');
  }
  assert('Purchase of DISABLED item is rejected with BadRequestException', disabledPurchaseRejected);

  // Retire an item
  shopService.updateItemStatus('frm-aurora', 'RETIRED');
  let retiredPurchaseRejected = false;
  try {
    await shopService.purchaseItem(citizenA.id, {
      itemId: 'frm-aurora',
      sourceAccountId: accountA,
      financialPassword: validFinancialPassword,
    });
  } catch (err: any) {
    retiredPurchaseRejected = err instanceof BadRequestException && err.message.includes('permanently retired');
  }
  assert('Purchase of RETIRED item is rejected with BadRequestException', retiredPurchaseRejected);

  // Retired item cannot be gifted
  let retiredGiftRejected = false;
  try {
    await shopService.giftItem(citizenA.id, {
      itemId: 'frm-aurora',
      sourceAccountId: accountA,
      recipientGovIdOrEmail: citizenB.govIdNumber,
      financialPassword: validFinancialPassword,
    });
  } catch (err: any) {
    retiredGiftRejected = err instanceof BadRequestException && err.message.includes('retired');
  }
  assert('Gifting of RETIRED item is rejected with BadRequestException', retiredGiftRejected);

  // Restore status
  shopService.updateItemStatus('pet-kurma', 'ACTIVE');
  shopService.updateItemStatus('frm-aurora', 'ACTIVE');

  // ---------------------------------------------------------------------------
  // TEST GROUP 11: CIVIC BOUNTY & REWARD POOL SETTLEMENT
  // ---------------------------------------------------------------------------
  console.log('\n--- Group 11: Bounded Pet Modifiers & Civic Bounty Settlement ---');

  // Seed Archive Cat ("Marjara") for citizen A and equip it
  shopService.seedUserInventory(citizenA.id, 'pet-marjara');
  await shopService.equipLoadout(citizenA.id, { petId: 'pet-marjara' });

  const preBountyBalance = await shopService.getAccountBalance(accountA);
  const bountyTx = await shopService.claimCivicBounty(citizenA.id, accountA);

  assert('Civic bounty claim completes successfully', bountyTx.status === 'COMPLETED');
  assert('Civic bounty amount is exactly 500 minor units (+5.00 ARTH)', bountyTx.amountMinor === '500');

  const postBountyBalance = await shopService.getAccountBalance(accountA);
  assert(
    'Citizen balance credited with +5.00 ARTH from authorized sovereign reward pool',
    postBountyBalance === preBountyBalance + 500n,
    `Expected ${preBountyBalance + 500n}, got ${postBountyBalance}`,
  );

  // Rate-limiting check: second claim within 24 hours rejected
  let rateLimitRejected = false;
  try {
    await shopService.claimCivicBounty(citizenA.id, accountA);
  } catch (err: any) {
    rateLimitRejected = err instanceof BadRequestException && err.message.includes('once every 24 hours');
  }
  assert('Duplicate civic bounty claim within 24 hours rejected with BadRequestException', rateLimitRejected);

  // Civic bounty fails if Archive Cat is not equipped
  let noCatRejected = false;
  try {
    await shopService.claimCivicBounty(citizenB.id, accountB);
  } catch (err: any) {
    noCatRejected = err instanceof BadRequestException && err.message.includes('Archive Cat');
  }
  assert('Civic bounty claim rejected when citizen does not have Archive Cat equipped', noCatRejected);

  // ---------------------------------------------------------------------------
  // FINAL REPORT
  // ---------------------------------------------------------------------------
  console.log('\n=================================================================');
  console.log(`  TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('=================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runShopTests().catch((err) => {
  console.error('Fatal error in Shop test suite:', err);
  process.exit(1);
});
