import { AuditLog, AuditAction, AuditResource, AuditLevel } from '@domain/entities/AuditLog';

export interface AuditLogFilters {
  action?: AuditAction;
  resource?: AuditResource;
  level?: AuditLevel;
  resourceId?: string;
  fromDate?: Date;
  toDate?: Date;
  limit?: number;
  offset?: number;
  search?: string;
}

export interface AuditLogRepository {
  save(auditLog: AuditLog): Promise<AuditLog>;
  findAll(filters?: AuditLogFilters): Promise<AuditLog[]>;
  findById(id: string): Promise<AuditLog | null>;
  count(filters?: AuditLogFilters): Promise<number>;
  deleteOlderThan(date: Date): Promise<number>;
} 