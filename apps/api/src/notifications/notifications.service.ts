import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  Optional,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../database/prisma.service';
import {
  NotificationDto,
  MailboxSummaryDto,
  DispatchNotificationInput,
  NotificationCategory,
  NotificationPriority,
} from '@arthax/types';
import { MailboxQueryInput } from '@arthax/validation';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  // In-memory store: id -> NotificationDto
  private memoryStore = new Map<string, NotificationDto>();

  // Unique constraint index: `${userId}:${eventId}` -> id
  private userEventIndex = new Map<string, string>();

  // Flag to check if default institutional seed notices have been loaded
  private seededUsers = new Set<string>();

  constructor(@Optional() private readonly prisma?: PrismaService) {}

  /**
   * Dispatches a notification post-commit.
   * Enforces (userId, eventId) idempotency and immutable financial facts.
   */
  async dispatchNotification(input: DispatchNotificationInput): Promise<NotificationDto> {
    const userEventKey = `${input.userId}:${input.eventId}`;

    // 1. In-memory idempotency check
    if (this.userEventIndex.has(userEventKey)) {
      const existingId = this.userEventIndex.get(userEventKey)!;
      const existing = this.memoryStore.get(existingId);
      if (existing) {
        this.logger.debug(
          `[IDEMPOTENCY HIT] Notification already dispatched for citizen ${input.userId} and event ${input.eventId}`,
        );
        return existing;
      }
    }

    const id = crypto.randomUUID();
    const nowIso = new Date().toISOString();

    const record: NotificationDto = {
      id,
      userId: input.userId,
      category: input.category,
      priority: input.priority || 'NORMAL',
      title: input.title,
      summary: input.summary,
      content: input.content,
      templateCode: input.templateCode,
      templateVersion: input.templateVersion ?? 1,
      sourceDomain: input.sourceDomain,
      sourceType: input.sourceType,
      sourceId: input.sourceId,
      eventId: input.eventId,
      metadata: input.metadata || null,
      isRead: false,
      readAt: null,
      isArchived: false,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    // 2. Database persistence if connected
    if (this.prisma && this.prisma.isConnected) {
      try {
        const dbResult = await this.prisma.notification.create({
          data: {
            id,
            userId: input.userId,
            category: input.category,
            priority: input.priority || 'NORMAL',
            title: input.title,
            summary: input.summary,
            content: input.content,
            templateCode: input.templateCode,
            templateVersion: input.templateVersion ?? 1,
            sourceDomain: input.sourceDomain,
            sourceType: input.sourceType,
            sourceId: input.sourceId,
            eventId: input.eventId,
            metadata: (input.metadata as any) || undefined,
            isRead: false,
            isArchived: false,
          },
        });

        const mappedResult: NotificationDto = {
          ...record,
          id: dbResult.id,
          createdAt: dbResult.createdAt.toISOString(),
          updatedAt: dbResult.updatedAt.toISOString(),
        };

        this.memoryStore.set(mappedResult.id, mappedResult);
        this.userEventIndex.set(userEventKey, mappedResult.id);
        return mappedResult;
      } catch (err: any) {
        // Prisma P2002: Unique constraint violation on [userId, eventId]
        if (err?.code === 'P2002') {
          const existing = await this.prisma.notification.findUnique({
            where: {
              userId_eventId: {
                userId: input.userId,
                eventId: input.eventId,
              },
            },
          });
          if (existing) {
            const mapped: NotificationDto = {
              id: existing.id,
              userId: existing.userId,
              category: existing.category as NotificationCategory,
              priority: existing.priority as NotificationPriority,
              title: existing.title,
              summary: existing.summary,
              content: existing.content,
              templateCode: existing.templateCode,
              templateVersion: existing.templateVersion,
              sourceDomain: existing.sourceDomain as any,
              sourceType: existing.sourceType,
              sourceId: existing.sourceId,
              eventId: existing.eventId,
              metadata: (existing.metadata as any) || null,
              isRead: existing.isRead,
              readAt: existing.readAt?.toISOString() || null,
              isArchived: existing.isArchived,
              createdAt: existing.createdAt.toISOString(),
              updatedAt: existing.updatedAt.toISOString(),
            };
            this.memoryStore.set(mapped.id, mapped);
            this.userEventIndex.set(userEventKey, mapped.id);
            return mapped;
          }
        }
        this.logger.error(`Failed to persist notification to PostgreSQL: ${err?.message}`, err?.stack);
        throw err;
      }
    }

    // 3. Resilient In-memory storage (offline / unit-tests)
    this.memoryStore.set(id, record);
    this.userEventIndex.set(userEventKey, id);
    return record;
  }

  /**
   * Retrieves the citizen's mailbox with authoritative unread count,
   * deterministic ordering, and filters.
   */
  async getMailbox(userId: string, query?: MailboxQueryInput): Promise<MailboxSummaryDto> {
    this.ensureInstitutionalSeedForUser(userId);

    const category = query?.category || 'ALL';
    const status = query?.status || 'ALL';
    const search = query?.search?.trim().toLowerCase();
    const limit = query?.limit ?? 20;
    const offset = query?.offset ?? 0;

    let allUserItems: NotificationDto[] = [];

    // Check database if connected
    if (this.prisma && this.prisma.isConnected) {
      const dbItems = await this.prisma.notification.findMany({
        where: { userId },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      });
      allUserItems = dbItems.map((n) => ({
        id: n.id,
        userId: n.userId,
        category: n.category as NotificationCategory,
        priority: n.priority as NotificationPriority,
        title: n.title,
        summary: n.summary,
        content: n.content,
        templateCode: n.templateCode,
        templateVersion: n.templateVersion,
        sourceDomain: n.sourceDomain as any,
        sourceType: n.sourceType,
        sourceId: n.sourceId,
        eventId: n.eventId,
        metadata: (n.metadata as any) || null,
        isRead: n.isRead,
        readAt: n.readAt?.toISOString() || null,
        isArchived: n.isArchived,
        createdAt: n.createdAt.toISOString(),
        updatedAt: n.updatedAt.toISOString(),
      }));
    } else {
      // In-memory retrieval
      allUserItems = Array.from(this.memoryStore.values()).filter((n) => n.userId === userId);
    }

    // Authoritative counts
    // Unread count: unread AND unarchived
    const unreadCount = allUserItems.filter((n) => !n.isRead && !n.isArchived).length;
    // Total active count: unarchived items
    const totalActiveCount = allUserItems.filter((n) => !n.isArchived).length;

    // Apply filtering
    let filtered = allUserItems.filter((item) => {
      // Category filter
      if (category !== 'ALL' && item.category !== category) {
        return false;
      }

      // Status filter
      if (status === 'UNREAD') {
        if (item.isRead || item.isArchived) return false;
      } else if (status === 'READ') {
        if (!item.isRead || item.isArchived) return false;
      } else if (status === 'ARCHIVED') {
        if (!item.isArchived) return false;
      } else {
        // 'ALL' status displays all unarchived notices
        if (item.isArchived) return false;
      }

      // Search filter
      if (search) {
        const titleMatch = item.title.toLowerCase().includes(search);
        const summaryMatch = item.summary.toLowerCase().includes(search);
        const sourceIdMatch = item.sourceId.toLowerCase().includes(search);
        if (!titleMatch && !summaryMatch && !sourceIdMatch) {
          return false;
        }
      }

      return true;
    });

    // Deterministic sorting: createdAt DESC, id DESC
    filtered.sort((a, b) => {
      const timeDiff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (timeDiff !== 0) return timeDiff;
      return b.id.localeCompare(a.id);
    });

    const paginatedItems = filtered.slice(offset, offset + limit);
    const hasMore = offset + limit < filtered.length;

    return {
      unreadCount,
      totalActiveCount,
      items: paginatedItems,
      hasMore,
    };
  }

  /**
   * Retrieves authoritative unread count for the citizen's navigation badge.
   * Excludes archived items.
   */
  async getUnreadCount(userId: string): Promise<{ unreadCount: number }> {
    this.ensureInstitutionalSeedForUser(userId);

    if (this.prisma && this.prisma.isConnected) {
      const count = await this.prisma.notification.count({
        where: {
          userId,
          isRead: false,
          isArchived: false,
        },
      });
      return { unreadCount: count };
    }

    const count = Array.from(this.memoryStore.values()).filter(
      (n) => n.userId === userId && !n.isRead && !n.isArchived,
    ).length;
    return { unreadCount: count };
  }

  /**
   * Retrieves a single notice with strict citizen isolation.
   */
  async getNotificationById(userId: string, id: string): Promise<NotificationDto> {
    this.ensureInstitutionalSeedForUser(userId);

    let item: NotificationDto | undefined;

    if (this.prisma && this.prisma.isConnected) {
      const dbItem = await this.prisma.notification.findUnique({
        where: { id },
      });
      if (dbItem) {
        item = {
          id: dbItem.id,
          userId: dbItem.userId,
          category: dbItem.category as NotificationCategory,
          priority: dbItem.priority as NotificationPriority,
          title: dbItem.title,
          summary: dbItem.summary,
          content: dbItem.content,
          templateCode: dbItem.templateCode,
          templateVersion: dbItem.templateVersion,
          sourceDomain: dbItem.sourceDomain as any,
          sourceType: dbItem.sourceType,
          sourceId: dbItem.sourceId,
          eventId: dbItem.eventId,
          metadata: (dbItem.metadata as any) || null,
          isRead: dbItem.isRead,
          readAt: dbItem.readAt?.toISOString() || null,
          isArchived: dbItem.isArchived,
          createdAt: dbItem.createdAt.toISOString(),
          updatedAt: dbItem.updatedAt.toISOString(),
        };
      }
    } else {
      item = this.memoryStore.get(id);
    }

    if (!item) {
      throw new NotFoundException(`Notification notice '${id}' not found`);
    }

    // Strict Citizen Isolation Invariant
    if (item.userId !== userId) {
      this.logger.warn(
        `[TENANT ISOLATION VIOLATION] Citizen ${userId} attempted to access notice ${id} owned by ${item.userId}`,
      );
      throw new ForbiddenException('Access denied: Citizen is not authorized to inspect this dispatch notice');
    }

    return item;
  }

  /**
   * Marks a notification as read.
   */
  async markAsRead(userId: string, id: string): Promise<NotificationDto> {
    const item = await this.getNotificationById(userId, id);
    if (item.isRead) {
      return item; // already read
    }

    const nowIso = new Date().toISOString();
    const updated: NotificationDto = {
      ...item,
      isRead: true,
      readAt: nowIso,
      updatedAt: nowIso,
    };

    if (this.prisma && this.prisma.isConnected) {
      await this.prisma.notification.update({
        where: { id },
        data: {
          isRead: true,
          readAt: new Date(nowIso),
        },
      });
    }

    this.memoryStore.set(id, updated);
    return updated;
  }

  /**
   * Marks all unread, unarchived notifications as read for a citizen.
   */
  async markAllAsRead(userId: string, category?: NotificationCategory): Promise<{ updatedCount: number }> {
    this.ensureInstitutionalSeedForUser(userId);
    const nowIso = new Date().toISOString();
    let updatedCount = 0;

    if (this.prisma && this.prisma.isConnected) {
      const where: any = {
        userId,
        isRead: false,
        isArchived: false,
      };
      if (category && category !== ('ALL' as any)) {
        where.category = category;
      }
      const res = await this.prisma.notification.updateMany({
        where,
        data: {
          isRead: true,
          readAt: new Date(nowIso),
        },
      });
      updatedCount = res.count;
    }

    for (const [id, item] of this.memoryStore.entries()) {
      if (item.userId === userId && !item.isRead && !item.isArchived) {
        if (!category || category === ('ALL' as any) || item.category === category) {
          this.memoryStore.set(id, {
            ...item,
            isRead: true,
            readAt: nowIso,
            updatedAt: nowIso,
          });
          if (!this.prisma || !this.prisma.isConnected) {
            updatedCount++;
          }
        }
      }
    }

    return { updatedCount };
  }

  /**
   * Archives a notification notice.
   */
  async archiveNotification(userId: string, id: string): Promise<NotificationDto> {
    const item = await this.getNotificationById(userId, id);
    if (item.isArchived) {
      return item; // already archived
    }

    const nowIso = new Date().toISOString();
    const updated: NotificationDto = {
      ...item,
      isArchived: true,
      updatedAt: nowIso,
    };

    if (this.prisma && this.prisma.isConnected) {
      await this.prisma.notification.update({
        where: { id },
        data: {
          isArchived: true,
        },
      });
    }

    this.memoryStore.set(id, updated);
    return updated;
  }

  /**
   * Ensures default sovereign institutional notices exist for citizens on initial mailbox visit.
   */
  private ensureInstitutionalSeedForUser(userId: string) {
    if (this.seededUsers.has(userId)) {
      return;
    }
    this.seededUsers.add(userId);

    // Initial institutional seed notices
    const initialNotices: DispatchNotificationInput[] = [
      {
        userId,
        category: 'POLICY',
        priority: 'HIGH',
        title: 'Central Bank Directive #26-41: Realized Profit Tax Clarification',
        summary: 'Clarification regarding capital loss offset rules on the Sovereign Equities Exchange.',
        content: `SOVEREIGN REVENUE BUREAU DIRECTIVE #26-41\n\nTo all citizens and registered market participants:\n\nUnder sovereign financial decree, realized capital losses may be offset against realized gains up to 50,000 ARTH per fiscal quarter. Unutilized losses carry forward indefinitely.\n\nAuthor: Central Bank Monetary Council\nEffective Date: 2026-09-01`,
        templateCode: 'CENTRAL_BANK_POLICY_DIRECTIVE_V1',
        templateVersion: 1,
        sourceDomain: 'CENTRAL_BANK',
        sourceType: 'POLICY_DIRECTIVE',
        sourceId: 'ANN-2026-041',
        eventId: `seed-policy-01-${userId}`,
      },
      {
        userId,
        category: 'SETTLEMENT',
        priority: 'NORMAL',
        title: 'Settlement Confirmation: Transfer TX-260908-014 Completed',
        summary: 'Bilateral clearing instruction settled via SETU CLS with sub-200ms finality.',
        content: `CENTRAL SETTLEMENT LAYER RECEIPT\n\nInstruction CLS-SET-260908-014 completed successfully between NAVA and VAYU.\nAll debits and credits committed to the Core Ledger.\nNet settlement balance: Balanced.`,
        templateCode: 'CLS_SETTLEMENT_COMPLETED_V1',
        templateVersion: 1,
        sourceDomain: 'CLS',
        sourceType: 'SETTLEMENT_COMPLETED',
        sourceId: 'CLS-SET-260908-014',
        eventId: `seed-settlement-02-${userId}`,
      },
      {
        userId,
        category: 'STOCK',
        priority: 'NORMAL',
        title: 'Exchange Execution: BUY 50 NILA',
        summary: 'Trade executed at 124.50 ARTH/share for total value 6,225.00 ARTH.',
        content: `SOVEREIGN EQUITIES EXCHANGE CONFIRMATION\n\nExecuted BUY order for 50 shares of NILA Solar Systems at 124.50 ARTH per share.\nDvP settlement finalized via Core Ledger.\nTax withheld: 0.00 ARTH.`,
        templateCode: 'STOCK_ORDER_FILLED_V1',
        templateVersion: 1,
        sourceDomain: 'STOCKS',
        sourceType: 'TRADE_EXECUTED',
        sourceId: 'ORD-NILA-09221',
        eventId: `seed-trade-03-${userId}`,
      },
      {
        userId,
        category: 'SHOP',
        priority: 'NORMAL',
        title: 'Sovereign Emporium: Golden Crest Acquired',
        summary: 'Item added to citizen vault. Consideration: 1,500.00 ARTH.',
        content: `CITIZEN VAULT ACQUISITION RECEIPT\n\nItem: Golden Crest (frame-gold)\nCategory: Avatar Frame\nStatus: Unlocked in Vault.\nProceeds credited to Sovereign Shop Revenue.`,
        templateCode: 'SHOP_PURCHASE_CONFIRMATION_V1',
        templateVersion: 1,
        sourceDomain: 'SHOP',
        sourceType: 'SHOP_PURCHASE',
        sourceId: 'SHP-TX-99014',
        eventId: `seed-shop-04-${userId}`,
      },
    ];

    for (const notice of initialNotices) {
      const userEventKey = `${notice.userId}:${notice.eventId}`;
      if (!this.userEventIndex.has(userEventKey)) {
        const id = crypto.randomUUID();
        const nowIso = new Date().toISOString();
        const record: NotificationDto = {
          id,
          userId: notice.userId,
          category: notice.category,
          priority: notice.priority || 'NORMAL',
          title: notice.title,
          summary: notice.summary,
          content: notice.content,
          templateCode: notice.templateCode,
          templateVersion: notice.templateVersion || 1,
          sourceDomain: notice.sourceDomain,
          sourceType: notice.sourceType,
          sourceId: notice.sourceId,
          eventId: notice.eventId,
          metadata: notice.metadata || null,
          isRead: false,
          readAt: null,
          isArchived: false,
          createdAt: nowIso,
          updatedAt: nowIso,
        };
        this.memoryStore.set(id, record);
        this.userEventIndex.set(userEventKey, id);
      }
    }
  }
}
