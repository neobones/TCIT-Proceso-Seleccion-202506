import { Database } from 'sqlite';
import { AuditLog, AuditAction, AuditResource, AuditLevel } from '@domain/entities/AuditLog';
import { AuditLogRepository, AuditLogFilters } from '@domain/repositories/AuditLogRepository';

export class SqliteAuditLogRepository implements AuditLogRepository {
  constructor(private database: Database) {}

  async save(auditLog: AuditLog): Promise<AuditLog> {
    const query = `
      INSERT INTO audit_logs (
        id, action, resource, resource_id, level, message, 
        details, user_agent, ip_address, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.database.run(query, [
      auditLog.id,
      auditLog.action,
      auditLog.resource,
      auditLog.resourceId,
      auditLog.level,
      auditLog.message,
      JSON.stringify(auditLog.details),
      auditLog.userAgent,
      auditLog.ipAddress,
      auditLog.timestamp.toISOString(),
    ]);

    return auditLog;
  }

  async findAll(filters: AuditLogFilters = {}): Promise<AuditLog[]> {
    const { whereClause, params } = this.buildWhereClause(filters);
    const { limit = 50, offset = 0 } = filters;

    const query = `
      SELECT * FROM audit_logs 
      ${whereClause}
      ORDER BY timestamp DESC
      LIMIT ? OFFSET ?
    `;

    const rows = await this.database.all(query, [...params, limit, offset]);
    return rows.map(this.mapRowToAuditLog);
  }

  async findById(id: string): Promise<AuditLog | null> {
    const query = 'SELECT * FROM audit_logs WHERE id = ?';
    const row = await this.database.get(query, [id]);
    
    if (!row) return null;
    return this.mapRowToAuditLog(row);
  }

  async count(filters: AuditLogFilters = {}): Promise<number> {
    const { whereClause, params } = this.buildWhereClause(filters);
    
    const query = `SELECT COUNT(*) as total FROM audit_logs ${whereClause}`;
    const row = await this.database.get(query, params);
    
    return row?.total || 0;
  }

  async deleteOlderThan(date: Date): Promise<number> {
    const query = 'DELETE FROM audit_logs WHERE timestamp < ?';
    const result = await this.database.run(query, [date.toISOString()]);
    
    return result.changes || 0;
  }

  private buildWhereClause(filters: AuditLogFilters): { whereClause: string; params: any[] } {
    const conditions: string[] = [];
    const params: any[] = [];

    if (filters.action) {
      conditions.push('action = ?');
      params.push(filters.action);
    }

    if (filters.resource) {
      conditions.push('resource = ?');
      params.push(filters.resource);
    }

    if (filters.level) {
      conditions.push('level = ?');
      params.push(filters.level);
    }

    if (filters.resourceId) {
      conditions.push('resource_id = ?');
      params.push(filters.resourceId);
    }

    if (filters.fromDate) {
      conditions.push('timestamp >= ?');
      params.push(filters.fromDate.toISOString());
    }

    if (filters.toDate) {
      conditions.push('timestamp <= ?');
      params.push(filters.toDate.toISOString());
    }

    if (filters.search) {
      conditions.push('(message LIKE ? OR details LIKE ?)');
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    return { whereClause, params };
  }

  private mapRowToAuditLog(row: any): AuditLog {
    return AuditLog.fromJSON({
      id: row.id,
      action: row.action as AuditAction,
      resource: row.resource as AuditResource,
      resourceId: row.resource_id,
      level: row.level as AuditLevel,
      message: row.message,
      details: row.details ? JSON.parse(row.details) : {},
      userAgent: row.user_agent,
      ipAddress: row.ip_address,
      timestamp: row.timestamp,
    });
  }
} 