import {
  Controller,
  Get,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../database/prisma.service';
import { LedgerWatcherService } from './ledger-watcher.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ledgerWatcher: LedgerWatcherService,
  ) {}

  /**
   * Kubernetes / container liveness probe.
   * Checks whether the application process is running and responsive.
   */
  @Get('liveness')
  getLiveness(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      status: 'ok',
      process: 'ARTHAX-Sovereign-API',
      uptimeSeconds: Math.floor(process.uptime()),
      pid: process.pid,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Kubernetes / container readiness probe.
   * Checks whether database dependencies are operational and accepting queries.
   */
  @Get('readiness')
  async getReadiness(@Res() res: Response) {
    const isDbConnected = this.prisma.isConnected;

    if (!isDbConnected) {
      return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        status: 'degraded',
        database: 'disconnected',
        message: 'PostgreSQL database connection is offline. API is not ready for transactional traffic.',
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(HttpStatus.OK).json({
      status: 'ready',
      database: 'connected',
      pool: 'healthy',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Continuous Cryptographic Ledger Integrity Endpoint.
   * Autonomous verification of Double-Entry Balance and M0 Supply.
   * Returns HTTP 200 if balanced, HTTP 500 if critical imbalance detected.
   */
  @Get('ledger-integrity')
  async getLedgerIntegrity(@Res() res: Response) {
    const report = await this.ledgerWatcher.runIntegrityAudit();

    if (report.status === 'CRITICAL_IMBALANCE') {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        ...report,
        resolution: 'IMMEDIATE SOVEREIGN INTERVENTION REQUIRED. Paging alerts emitted to financial reliability engineers.',
      });
    }

    return res.status(HttpStatus.OK).json(report);
  }

  /**
   * Returns recent paging alerts emitted by the active ledger watcher.
   */
  @Get('alerts')
  getRecentAlerts(@Res() res: Response) {
    const alerts = this.ledgerWatcher.getRecentAlerts();
    return res.status(HttpStatus.OK).json({
      count: alerts.length,
      alerts,
      timestamp: new Date().toISOString(),
    });
  }
}
