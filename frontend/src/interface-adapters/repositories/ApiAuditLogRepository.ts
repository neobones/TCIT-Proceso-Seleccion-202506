import { AuditLog } from '../../domain/entities/AuditLog';
import { 
  AuditLogRepository, 
  AuditLogFilters, 
  AuditLogResponse, 
  AuditStats 
} from '../../domain/repositories/AuditLogRepository';
import { httpClient } from '../../frameworks-drivers/http/HttpClient';

export class ApiAuditLogRepository implements AuditLogRepository {
  async findAll(filters: AuditLogFilters = {}): Promise<AuditLogResponse> {
    const queryParams = new URLSearchParams();

    // Convertir filtros a query params
    if (filters.action) queryParams.append('action', filters.action);
    if (filters.resource) queryParams.append('resource', filters.resource);
    if (filters.level) queryParams.append('level', filters.level);
    if (filters.resourceId) queryParams.append('resourceId', filters.resourceId);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.fromDate) queryParams.append('fromDate', filters.fromDate.toISOString());
    if (filters.toDate) queryParams.append('toDate', filters.toDate.toISOString());

    const queryString = queryParams.toString();
    const url = queryString ? `/audit?${queryString}` : '/audit';

    try {
      const response = await httpClient.get(url);
      
      if (!response.success) {
        throw new Error(response.error || 'Error al obtener logs de auditoría');
      }

      const logs = response.data.map((logData: any) => AuditLog.fromJSON(logData));

      return {
        logs,
        pagination: response.pagination
      };
    } catch (error) {
      console.error('Error al obtener logs de auditoría:', error);
      throw new Error('Error al obtener logs de auditoría');
    }
  }

  async getStats(): Promise<AuditStats> {
    try {
      const response = await httpClient.get('/audit/stats');
      
      if (!response.success) {
        throw new Error(response.error || 'Error al obtener estadísticas de auditoría');
      }

      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de auditoría:', error);
      throw new Error('Error al obtener estadísticas de auditoría');
    }
  }
} 