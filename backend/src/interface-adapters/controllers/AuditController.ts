import { Request, Response } from 'express';
import { ListAuditLogsUseCase } from '@use-cases/ListAuditLogs';
import { AuditLogFilters } from '@domain/repositories/AuditLogRepository';
import { AuditAction, AuditResource, AuditLevel } from '@domain/entities/AuditLog';

export class AuditController {
  constructor(private listAuditLogsUseCase: ListAuditLogsUseCase) {}

  listAuditLogs = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters: AuditLogFilters = this.parseFilters(req.query);
      
      const result = await this.listAuditLogsUseCase.execute(filters);
      
      res.json({
        success: true,
        data: result.logs.map(log => log.toJSON()),
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      console.error('Error al obtener logs de auditoría:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
      });
    }
  };

  getAuditStats = async (req: Request, res: Response): Promise<void> => {
    try {
      // Obtener estadísticas por nivel
      const [
        totalLogs,
        infoLogs,
        warningLogs,
        errorLogs,
        criticalLogs,
        recentLogs,
      ] = await Promise.all([
        this.listAuditLogsUseCase.execute({ limit: 1 }),
        this.listAuditLogsUseCase.execute({ level: AuditLevel.INFO, limit: 1 }),
        this.listAuditLogsUseCase.execute({ level: AuditLevel.WARNING, limit: 1 }),
        this.listAuditLogsUseCase.execute({ level: AuditLevel.ERROR, limit: 1 }),
        this.listAuditLogsUseCase.execute({ level: AuditLevel.CRITICAL, limit: 1 }),
        this.listAuditLogsUseCase.execute({ 
          fromDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Últimas 24 horas
          limit: 1 
        }),
      ]);

      res.json({
        success: true,
        data: {
          total: totalLogs.total,
          byLevel: {
            info: infoLogs.total,
            warning: warningLogs.total,
            error: errorLogs.total,
            critical: criticalLogs.total,
          },
          last24Hours: recentLogs.total,
        },
      });
    } catch (error) {
      console.error('Error al obtener estadísticas de auditoría:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
      });
    }
  };

  private parseFilters(query: any): AuditLogFilters {
    const filters: AuditLogFilters = {};

    if (query.action && Object.values(AuditAction).includes(query.action)) {
      filters.action = query.action as AuditAction;
    }

    if (query.resource && Object.values(AuditResource).includes(query.resource)) {
      filters.resource = query.resource as AuditResource;
    }

    if (query.level && Object.values(AuditLevel).includes(query.level)) {
      filters.level = query.level as AuditLevel;
    }

    if (query.resourceId) {
      filters.resourceId = query.resourceId;
    }

    if (query.search) {
      filters.search = query.search;
    }

    if (query.fromDate) {
      const fromDate = new Date(query.fromDate);
      if (!isNaN(fromDate.getTime())) {
        filters.fromDate = fromDate;
      }
    }

    if (query.toDate) {
      const toDate = new Date(query.toDate);
      if (!isNaN(toDate.getTime())) {
        filters.toDate = toDate;
      }
    }

    if (query.page) {
      const page = parseInt(query.page);
      if (page > 0) {
        const limit = parseInt(query.limit) || 50;
        filters.offset = (page - 1) * limit;
      }
    }

    if (query.limit) {
      const limit = parseInt(query.limit);
      if (limit > 0 && limit <= 200) {
        filters.limit = limit;
      }
    }

    return filters;
  }
} 