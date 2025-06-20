import { 
  AuditLogRepository, 
  AuditLogFilters, 
  AuditLogResponse 
} from '../domain/repositories/AuditLogRepository';

export class ListAuditLogsUseCase {
  constructor(private auditLogRepository: AuditLogRepository) {}

  async execute(filters: AuditLogFilters = {}): Promise<AuditLogResponse> {
    // Valores por defecto para paginación
    const defaultFilters: AuditLogFilters = {
      page: 1,
      limit: 25,
      ...filters,
    };

    return await this.auditLogRepository.findAll(defaultFilters);
  }
} 