import { Injectable, Logger } from '@nestjs/common';
import { AuditLogDto, AuditSeverity } from '@arthax/types';

export interface RecordAuditEventInput {
  eventType:
    | 'POLICY_CHANGE'
    | 'BANK_ACTION'
    | 'SETTLEMENT_OVERRIDE'
    | 'SECURITY_EVENT'
    | 'COMPLIANCE_NOTICE'
    | 'MONETARY_EVENT';
  actorId: string;
  actorRole: string;
  targetEntity: string;
  action: string;
  severity: AuditSeverity;
  ipAddress?: string;
  sessionHash?: string;
  beforeState?: Record<string, unknown>;
  afterState?: Record<string, unknown>;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  async logEvent(event: RecordAuditEventInput): Promise<AuditLogDto> {
    const log: AuditLogDto = {
      id: `AUD-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString(),
      ...event,
    };

    this.logger.log(
      `[SOVEREIGN AUDIT] [${log.severity}] [${log.eventType}] Actor: ${log.actorId} (${log.actorRole}) -> ${log.action}`,
    );

    return log;
  }
}
