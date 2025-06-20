import { Router } from 'express';
import { AuditController } from '@interface-adapters/controllers/AuditController';
import { ListAuditLogsUseCase } from '@use-cases/ListAuditLogs';
import { SqliteAuditLogRepository } from '@interface-adapters/repositories/SqliteAuditLogRepository';
import { DatabaseConfig } from '@frameworks-drivers/database/DatabaseConfig';

export async function createAuditRoutes(): Promise<Router> {
  const router = Router();
  
  // Dependency injection
  const database = await DatabaseConfig.getDatabase();
  const auditLogRepository = new SqliteAuditLogRepository(database);
  const listAuditLogsUseCase = new ListAuditLogsUseCase(auditLogRepository);
  
  const auditController = new AuditController(listAuditLogsUseCase);

  // Rutas de auditoría
  router.get('/', auditController.listAuditLogs);
  router.get('/stats', auditController.getAuditStats);

  return router;
} 