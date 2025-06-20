import { AuditLog, AuditAction, AuditResource, AuditLevel } from '../entities/AuditLog';

export interface AuditLogFilters {
  action?: AuditAction;
  resource?: AuditResource;
  level?: AuditLevel;
  resourceId?: string;
  fromDate?: Date;
  toDate?: Date;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AuditLogResponse {
  logs: AuditLog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AuditStats {
  total: number;
  byLevel: {
    info: number;
    warning: number;
    error: number;
    critical: number;
  };
  last24Hours: number;
}

export interface AuditLogRepository {
  findAll(filters?: AuditLogFilters): Promise<AuditLogResponse>;
  getStats(): Promise<AuditStats>;
} 