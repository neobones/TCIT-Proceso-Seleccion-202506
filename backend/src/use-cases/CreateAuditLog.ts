import { AuditLog, AuditLogData } from '@domain/entities/AuditLog';
import { AuditLogRepository } from '@domain/repositories/AuditLogRepository';

export class CreateAuditLogUseCase {
  constructor(private auditLogRepository: AuditLogRepository) {}

  async execute(data: AuditLogData): Promise<AuditLog> {
    const auditLog = new AuditLog(data);
    return await this.auditLogRepository.save(auditLog);
  }
} 