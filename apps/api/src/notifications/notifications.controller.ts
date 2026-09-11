import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { MailboxQuerySchema, MailboxQueryInput } from '@arthax/validation';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { NotificationCategory } from '@arthax/types';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * Retrieves the citizen's dispatch mailbox with category/status filters,
   * search, authoritative unread count, and pagination.
   */
  @Get('mailbox')
  @UsePipes(new ZodValidationPipe(MailboxQuerySchema))
  async getMailbox(
    @CurrentUser('sub') userId: string,
    @Query() query: MailboxQueryInput,
  ) {
    return this.notificationsService.getMailbox(userId, query);
  }

  /**
   * Retrieves the unread notification count for badge rendering in portal header.
   */
  @Get('unread-count')
  async getUnreadCount(@CurrentUser('sub') userId: string) {
    return this.notificationsService.getUnreadCount(userId);
  }

  /**
   * Retrieves a single notification notice. Enforces strict citizen tenant isolation.
   */
  @Get(':id')
  async getNotification(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
  ) {
    return this.notificationsService.getNotificationById(userId, id);
  }

  /**
   * Marks a specific notification notice as read.
   */
  @Patch(':id/read')
  async markAsRead(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
  ) {
    return this.notificationsService.markAsRead(userId, id);
  }

  /**
   * Marks all active notifications (optionally filtered by category) as read.
   */
  @Patch('read-all')
  async markAllAsRead(
    @CurrentUser('sub') userId: string,
    @Body('category') category?: NotificationCategory,
  ) {
    return this.notificationsService.markAllAsRead(userId, category);
  }

  /**
   * Archives a notification notice.
   */
  @Patch(':id/archive')
  async archiveNotification(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
  ) {
    return this.notificationsService.archiveNotification(userId, id);
  }
}
