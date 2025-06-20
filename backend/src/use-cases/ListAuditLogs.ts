import { AuditLog } from '@domain/entities/AuditLog';
import { AuditLogRepository, AuditLogFilters } from '@domain/repositories/AuditLogRepository';

export interface ListAuditLogsResponse {
  logs: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ListAuditLogsUseCase {
  constructor(private auditLogRepository: AuditLogRepository) {}

  async execute(filters: AuditLogFilters = {}): Promise<ListAuditLogsResponse> {
    const defaultFilters: AuditLogFilters = {
      limit: 50,
      offset: 0,
      ...filters,
    };

    const [logs, total] = await Promise.all([
      this.auditLogRepository.findAll(defaultFilters),
      this.auditLogRepository.count(defaultFilters),
    ]);

    const limit = defaultFilters.limit || 50;
    const offset = defaultFilters.offset || 0;
    const page = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);

    return {
      logs,
      total,
      page,
      limit,
      totalPages,
    };
  }
} 