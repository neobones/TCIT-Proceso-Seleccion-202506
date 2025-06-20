import { AuditLogRepository, AuditStats } from '../domain/repositories/AuditLogRepository';

export class GetAuditStatsUseCase {
  constructor(private auditLogRepository: AuditLogRepository) {}

  async execute(): Promise<AuditStats> {
    return await this.auditLogRepository.getStats();
  }
} 