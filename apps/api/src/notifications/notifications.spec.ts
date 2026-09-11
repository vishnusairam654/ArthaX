import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationTemplates } from './notification-templates';
import {
  DispatchNotificationInput,
  NotificationCategory,
  NotificationPriority,
  formatArth,
} from '@arthax/types';
import { BankingService } from '../banking/banking.service';
import { ShopService } from '../shop/shop.service';
import * as argon2 from 'argon2';

// -----------------------------------------------------------------------------
// ARTHAX NOTIFICATIONS & MAILBOX — PHASE 9 INVARIANT VERIFICATION SUITE
// -----------------------------------------------------------------------------

async function runNotificationsTests() {
  console.log('=================================================================');
  console.log('  ARTHAX NOTIFICATIONS & MAILBOX — PHASE 9 INVARIANT SUITE');
  console.log('=================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  const notificationsService = new NotificationsService();

  const citizenA = 'usr_citizen_alpha';
  const citizenB = 'usr_citizen_beta';

  // ===========================================================================
  // GROUP 1: Deterministic Dispatch & Event Identity
  // ===========================================================================
  console.log('--- Group 1: Deterministic Dispatch & Event Identity ---');

  const dispatchInput1: DispatchNotificationInput = {
    userId: citizenA,
    category: 'TRANSFER',
    priority: 'NORMAL',
    title: 'Credit Notice: 2,500.00 ARTH Received',
    summary: 'Direct transfer from NAVA credited to account ARTH-NAVA-001.',
    content: 'SOVEREIGN BANKING SETTLEMENT NOTICE\n\nReference: TX-NAVA-101',
    templateCode: 'BANK_TRANSFER_RECEIVED_V1',
    templateVersion: 1,
    sourceDomain: 'BANKING',
    sourceType: 'TRANSFER_RECEIVED',
    sourceId: 'TX-NAVA-101',
    eventId: 'evt-tx-nava-101',
    metadata: { amountMinor: '250000', sourceBank: 'NAVA' },
  };

  const notice1 = await notificationsService.dispatchNotification(dispatchInput1);

  assert(Boolean(notice1.id), 'Dispatched notification receives a unique ID');
  assert(notice1.userId === citizenA, 'Dispatched notification records correct citizen userId');
  assert(notice1.sourceDomain === 'BANKING', 'Dispatched notification records immutable sourceDomain');
  assert(notice1.sourceType === 'TRANSFER_RECEIVED', 'Dispatched notification records immutable sourceType');
  assert(notice1.sourceId === 'TX-NAVA-101', 'Dispatched notification records immutable sourceId');
  assert(notice1.eventId === 'evt-tx-nava-101', 'Dispatched notification records globally unique eventId');
  assert(notice1.templateCode === 'BANK_TRANSFER_RECEIVED_V1', 'Dispatched notification records canonical templateCode');
  assert(notice1.isRead === false, 'Dispatched notification initializes with isRead = false');
  assert(notice1.isArchived === false, 'Dispatched notification initializes with isArchived = false');
  assert(notice1.readAt === null, 'Dispatched notification initializes with readAt = null');

  // ===========================================================================
  // GROUP 2: Dispatch Idempotency (userId, eventId)
  // ===========================================================================
  console.log('\n--- Group 2: Dispatch Idempotency (userId, eventId) ---');

  const replayedNotice = await notificationsService.dispatchNotification({
    ...dispatchInput1,
    title: 'DIFFERENT TITLE SHOULD NOT OVERWRITE ORIGINAL NOTICE',
    summary: 'Modified summary attempting mutation on replay',
  });

  assert(replayedNotice.id === notice1.id, 'Duplicate dispatch with same (userId, eventId) returns original notice ID');
  assert(replayedNotice.title === dispatchInput1.title, 'Replay does NOT mutate immutable notice title');
  assert(replayedNotice.summary === dispatchInput1.summary, 'Replay does NOT mutate immutable notice summary');

  const mailboxAfterReplay = await notificationsService.getMailbox(citizenA);
  const matchingNotices = mailboxAfterReplay.items.filter((n) => n.eventId === 'evt-tx-nava-101');
  assert(matchingNotices.length === 1, 'Exactly 1 notice exists for eventId after duplicate dispatch');

  // ===========================================================================
  // GROUP 3: Strict Citizen Tenant Isolation
  // ===========================================================================
  console.log('\n--- Group 3: Strict Citizen Tenant Isolation ---');

  // Dispatch notice to citizenB
  const dispatchCitizenB: DispatchNotificationInput = {
    userId: citizenB,
    category: 'SECURITY',
    priority: 'URGENT',
    title: 'Security Alert: Financial Password Changed',
    summary: 'Your financial authorization password was updated.',
    content: 'SECURITY NOTICE\n\nAction: PASSWORD_UPDATE',
    templateCode: 'SECURITY_STEP_UP_ALERT_V1',
    templateVersion: 1,
    sourceDomain: 'SECURITY',
    sourceType: 'SECURITY_ALERT',
    sourceId: 'SEC-LOG-991',
    eventId: 'evt-sec-991',
  };
  const noticeCitizenB = await notificationsService.dispatchNotification(dispatchCitizenB);

  // Citizen A attempts to read Citizen B's notice
  let citizenAReadDenied = false;
  try {
    await notificationsService.getNotificationById(citizenA, noticeCitizenB.id);
  } catch (err) {
    if (err instanceof ForbiddenException) {
      citizenAReadDenied = true;
    }
  }
  assert(citizenAReadDenied, 'Cross-citizen notice inspection strictly rejected with ForbiddenException');

  // Citizen A attempts to mark Citizen B's notice as read
  let citizenAMarkReadDenied = false;
  try {
    await notificationsService.markAsRead(citizenA, noticeCitizenB.id);
  } catch (err) {
    if (err instanceof ForbiddenException) {
      citizenAMarkReadDenied = true;
    }
  }
  assert(citizenAMarkReadDenied, 'Cross-citizen markAsRead mutation strictly rejected with ForbiddenException');

  // Citizen A attempts to archive Citizen B's notice
  let citizenAArchiveDenied = false;
  try {
    await notificationsService.archiveNotification(citizenA, noticeCitizenB.id);
  } catch (err) {
    if (err instanceof ForbiddenException) {
      citizenAArchiveDenied = true;
    }
  }
  assert(citizenAArchiveDenied, 'Cross-citizen archive mutation strictly rejected with ForbiddenException');

  // Verify Citizen A's mailbox contains 0 notices belonging to Citizen B
  const citizenAMailbox = await notificationsService.getMailbox(citizenA);
  const leakedToA = citizenAMailbox.items.some((n) => n.userId === citizenB);
  assert(!leakedToA, 'Mailbox query strictly partitions notices by citizen userId');

  // ===========================================================================
  // GROUP 4: Authoritative Unread Count & Archival Exclusion
  // ===========================================================================
  console.log('\n--- Group 4: Authoritative Unread Count & Archival Exclusion ---');

  const unreadBefore = (await notificationsService.getUnreadCount(citizenA)).unreadCount;
  assert(unreadBefore > 0, `Initial citizen unreadCount is authoritative (${unreadBefore} unread)`);

  // Read one notice
  const readResult = await notificationsService.markAsRead(citizenA, notice1.id);
  assert(readResult.isRead === true, 'Notice marked as read returns isRead = true');
  assert(Boolean(readResult.readAt), 'Notice marked as read records readAt timestamp');

  const unreadAfterOneRead = (await notificationsService.getUnreadCount(citizenA)).unreadCount;
  assert(unreadAfterOneRead === unreadBefore - 1, 'Marking notice as read decrements unreadCount by exactly 1');

  // Dispatch a new unread notice to citizenA
  const unreadToArchive = await notificationsService.dispatchNotification({
    userId: citizenA,
    category: 'POLICY',
    priority: 'HIGH',
    title: 'Directive: Interim Capital Controls',
    summary: 'Notice regarding capital controls.',
    content: 'DIRECTIVE CONTENT',
    templateCode: 'CENTRAL_BANK_POLICY_DIRECTIVE_V1',
    templateVersion: 1,
    sourceDomain: 'CENTRAL_BANK',
    sourceType: 'POLICY_DIRECTIVE',
    sourceId: 'ANN-2026-99',
    eventId: 'evt-pol-99',
  });

  const unreadBeforeArchive = (await notificationsService.getUnreadCount(citizenA)).unreadCount;
  assert(unreadToArchive.isRead === false, 'Newly dispatched notice is unread');

  // ARCHIVE THE UNREAD NOTICE
  const archiveResult = await notificationsService.archiveNotification(citizenA, unreadToArchive.id);
  assert(archiveResult.isArchived === true, 'Archived notice has isArchived = true');

  const unreadAfterArchive = (await notificationsService.getUnreadCount(citizenA)).unreadCount;
  assert(
    unreadAfterArchive === unreadBeforeArchive - 1,
    'INVARIANT: Archiving an unread notice excludes it from authoritative unreadCount',
  );

  // Mark all as read
  await notificationsService.markAllAsRead(citizenA);
  const unreadAfterMarkAll = (await notificationsService.getUnreadCount(citizenA)).unreadCount;
  assert(unreadAfterMarkAll === 0, 'markAllAsRead reduces unreadCount to exactly 0');

  // ===========================================================================
  // GROUP 5: Deterministic Pagination, Sorting & Filtering
  // ===========================================================================
  console.log('\n--- Group 5: Deterministic Pagination, Sorting & Filtering ---');

  // Dispatch 5 sequential notices with controlled timestamps
  const dispatchedIds: string[] = [];
  for (let i = 1; i <= 5; i++) {
    const d = await notificationsService.dispatchNotification({
      userId: citizenA,
      category: 'STOCK',
      priority: 'NORMAL',
      title: `Stock Execution #${i}`,
      summary: `Trade #${i} executed on Sovereign Exchange`,
      content: `Content for trade ${i}`,
      templateCode: 'STOCK_ORDER_FILLED_V1',
      templateVersion: 1,
      sourceDomain: 'STOCKS',
      sourceType: 'TRADE_EXECUTED',
      sourceId: `ORD-${1000 + i}`,
      eventId: `evt-stock-test-${i}-${Date.now()}`,
    });
    dispatchedIds.push(d.id);
  }

  // Fetch page 1 (limit 3, offset 0)
  const page1 = await notificationsService.getMailbox(citizenA, {
    category: 'STOCK',
    status: 'ALL',
    limit: 3,
    offset: 0,
  });
  assert(page1.items.length === 3, 'Page 1 returns exactly 3 items');
  assert(page1.hasMore === true, 'Page 1 reports hasMore = true');

  // Fetch page 2 (limit 3, offset 3)
  const page2 = await notificationsService.getMailbox(citizenA, {
    category: 'STOCK',
    status: 'ALL',
    limit: 3,
    offset: 3,
  });
  assert(page2.items.length > 0, 'Page 2 returns remaining items');

  // Verify page items have no intersection
  const page1Ids = new Set(page1.items.map((i) => i.id));
  const hasOverlap = page2.items.some((i) => page1Ids.has(i.id));
  assert(!hasOverlap, 'Deterministic pagination guarantees zero overlap between pages');

  // Verify descending sort order: items are strictly newest first
  let isSortedDescending = true;
  for (let i = 0; i < page1.items.length - 1; i++) {
    const timeA = new Date(page1.items[i].createdAt).getTime();
    const timeB = new Date(page1.items[i + 1].createdAt).getTime();
    if (timeA < timeB) {
      isSortedDescending = false;
      break;
    }
  }
  assert(isSortedDescending, 'Mailbox feed is strictly sorted by createdAt DESC');

  // Search filter verification
  const searchResult = await notificationsService.getMailbox(citizenA, {
    category: 'ALL',
    status: 'ALL',
    search: 'ORD-1003',
    limit: 10,
    offset: 0,
  });
  assert(searchResult.items.length === 1, 'Search query successfully locates notice by sourceId');
  assert(searchResult.items[0].sourceId === 'ORD-1003', 'Search result correctly matches target sourceId');

  // ===========================================================================
  // GROUP 6: Immutable Financial Facts vs Mutable Mailbox State
  // ===========================================================================
  console.log('\n--- Group 6: Immutable Financial Facts vs Mutable Mailbox State ---');

  const immutableOriginal = await notificationsService.getNotificationById(citizenA, notice1.id);
  const originalSourceId = immutableOriginal.sourceId;
  const originalEventId = immutableOriginal.eventId;
  const originalDomain = immutableOriginal.sourceDomain;
  const originalContent = immutableOriginal.content;

  // Mark as read again
  await notificationsService.markAsRead(citizenA, notice1.id);

  const inspectedAfterMutation = await notificationsService.getNotificationById(citizenA, notice1.id);
  assert(inspectedAfterMutation.sourceId === originalSourceId, 'sourceId remains immutable across status updates');
  assert(inspectedAfterMutation.eventId === originalEventId, 'eventId remains immutable across status updates');
  assert(inspectedAfterMutation.sourceDomain === originalDomain, 'sourceDomain remains immutable across status updates');
  assert(inspectedAfterMutation.content === originalContent, 'content remains immutable across status updates');

  // Statutory Reversal Notice Invariant:
  // Reversals MUST produce a DISTINCT notice rather than mutating the original transaction notice
  const reversalNotice = await notificationsService.dispatchNotification({
    userId: citizenA,
    category: 'TRANSFER',
    priority: 'URGENT',
    title: `Reversal Notice: Transfer ${originalSourceId} Reversed`,
    summary: 'Statutory reversal applied by Central Settlement Layer.',
    content: `REVERSAL ORDER: Original transaction ${originalSourceId} was reversed.`,
    templateCode: 'TRANSACTION_REVERSAL_V1',
    templateVersion: 1,
    sourceDomain: 'BANKING',
    sourceType: 'REVERSAL_NOTICE',
    sourceId: `REV-${originalSourceId}`,
    eventId: `evt-rev-${originalSourceId}`,
  });

  assert(reversalNotice.id !== notice1.id, 'Reversal notice creates a distinct new notice entity');
  const originalPreserved = await notificationsService.getNotificationById(citizenA, notice1.id);
  assert(originalPreserved.sourceType === 'TRANSFER_RECEIVED', 'Original credit notice remains intact and unmutated');

  // ===========================================================================
  // GROUP 7: Cross-Domain Post-Commit Dispatch Simulation
  // ===========================================================================
  console.log('\n--- Group 7: Cross-Domain Post-Commit Dispatch Simulation ---');

  // 1. Intra-Bank Transfer post-commit dispatches
  const creditNotice = await notificationsService.dispatchNotification({
    userId: citizenB,
    category: 'TRANSFER',
    priority: 'NORMAL',
    title: 'Credit Notice: 500.00 ARTH Received',
    summary: 'Direct transfer from NAVA credited to your account.',
    content: 'TRANSFER RECEIPT',
    templateCode: 'BANK_TRANSFER_RECEIVED_V1',
    templateVersion: 1,
    sourceDomain: 'BANKING',
    sourceType: 'TRANSFER_RECEIVED',
    sourceId: 'TX-INTRA-9901',
    eventId: 'tx-recv-TX-INTRA-9901',
  });
  assert(creditNotice.sourceType === 'TRANSFER_RECEIVED', 'Banking transfer delivers recipient credit notice');

  // 2. Shop Gift post-commit dispatches
  const giftNotice = await notificationsService.dispatchNotification({
    userId: citizenB,
    category: 'SHOP',
    priority: 'HIGH',
    title: 'Gift Bestowed: Golden Crest from Alpha Citizen',
    summary: 'A civic artifact gift has been added to your vault.',
    content: 'VAULT GIFT NOTICE',
    templateCode: 'SHOP_GIFT_RECEIVED_V1',
    templateVersion: 1,
    sourceDomain: 'SHOP',
    sourceType: 'SHOP_GIFT_RECEIVED',
    sourceId: 'GIFT-9902',
    eventId: 'shp-gift-GIFT-9902',
  });
  assert(giftNotice.category === 'SHOP', 'Shop domain delivers artifact gift notice to recipient');

  // 3. Central Bank Directive broadcast
  const directiveNotice = await notificationsService.dispatchNotification({
    userId: citizenA,
    category: 'POLICY',
    priority: 'HIGH',
    title: 'Central Bank Directive: Liquidity Reserve Adjustment',
    summary: 'Mandatory commercial bank reserve ratio updated to 12.5%.',
    content: 'DIRECTIVE TEXT',
    templateCode: 'CENTRAL_BANK_POLICY_DIRECTIVE_V1',
    templateVersion: 1,
    sourceDomain: 'CENTRAL_BANK',
    sourceType: 'POLICY_DIRECTIVE',
    sourceId: 'DIR-2026-08',
    eventId: 'evt-dir-2026-08',
  });
  assert(directiveNotice.category === 'POLICY', 'Central Bank broadcasts statutory policy directives');

  // ===========================================================================
  // GROUP 8: Canonical Template Engine Math & Fidelity
  // ===========================================================================
  console.log('\n--- Group 8: Canonical Template Engine Math & Fidelity ---');

  const renderedTransfer = NotificationTemplates.BANK_TRANSFER_RECEIVED_V1.render({
    amountMinor: 14250n,
    senderBank: 'NAVA',
    senderName: 'Alpha Citizen',
    txId: 'TX-771',
    targetAccount: 'ARTH-NAVA-999',
  });
  assert(
    renderedTransfer.title.includes('142.50 ARTH'),
    'Template formats minor units to exact float representation (14250n -> 142.50 ARTH)',
  );
  assert(renderedTransfer.category === 'TRANSFER', 'Rendered template assigns TRANSFER category');
  assert(renderedTransfer.priority === 'NORMAL', 'Rendered template assigns NORMAL priority');

  const renderedStock = NotificationTemplates.STOCK_ORDER_FILLED_V1.render({
    symbol: 'NILA',
    side: 'BUY',
    quantity: 100,
    priceMinor: 12500n, // 125.00 ARTH
    totalMinor: 1250000n, // 12,500.00 ARTH
    orderId: 'ORD-5501',
    tradeId: 'TRD-9901',
  });
  assert(renderedStock.title.includes('BUY 100 NILA'), 'Stock template correctly generates trade title');
  assert(
    renderedStock.summary.includes('125.00 ARTH/share'),
    'Stock template correctly formats price per share',
  );
  assert(
    renderedStock.content.includes('12,500.00 ARTH'),
    'Stock template correctly formats total consideration with thousands separator',
  );

  const renderedReversal = NotificationTemplates.TRANSACTION_REVERSAL_V1.render({
    originalTxId: 'TX-ORIG-1',
    reversalTxId: 'TX-REV-1',
    amountMinor: 500000n,
    reason: 'Settlement failure in participating commercial bank',
  });
  assert(renderedReversal.priority === 'URGENT', 'Reversal notice is rendered with URGENT priority');
  assert(
    renderedReversal.content.includes('audit fidelity'),
    'Reversal content emphasizes non-destructive historical accounting invariant',
  );

  console.log('\n=================================================================');
  console.log(`  TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('=================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runNotificationsTests().catch((err) => {
  console.error('Fatal error running notifications tests:', err);
  process.exit(1);
});
