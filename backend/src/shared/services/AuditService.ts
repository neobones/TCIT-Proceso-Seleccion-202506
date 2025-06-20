import { AuditLog, AuditAction, AuditResource, AuditLevel, AuditLogData } from '@domain/entities/AuditLog';
import { CreateAuditLogUseCase } from '@use-cases/CreateAuditLog';

export interface AuditContext {
  userAgent?: string;
  ipAddress?: string;
  details?: Record<string, any>;
}

export class AuditService {
  constructor(private createAuditLogUseCase: CreateAuditLogUseCase) {}

  async logInfo(
    action: AuditAction,
    resource: AuditResource,
    message: string,
    context?: AuditContext
  ): Promise<void> {
    await this.log(action, resource, AuditLevel.INFO, message, context);
  }

  async logWarning(
    action: AuditAction,
    resource: AuditResource,
    message: string,
    context?: AuditContext
  ): Promise<void> {
    await this.log(action, resource, AuditLevel.WARNING, message, context);
  }

  async logError(
    action: AuditAction,
    resource: AuditResource,
    message: string,
    context?: AuditContext
  ): Promise<void> {
    await this.log(action, resource, AuditLevel.ERROR, message, context);
  }

  async logCritical(
    action: AuditAction,
    resource: AuditResource,
    message: string,
    context?: AuditContext
  ): Promise<void> {
    await this.log(action, resource, AuditLevel.CRITICAL, message, context);
  }

  // Métodos específicos para Posts
  async logPostCreated(postId: string, postName: string, context?: AuditContext): Promise<void> {
    await this.logInfo(
      AuditAction.CREATE,
      AuditResource.POST,
      `Post creado: "${postName}"`,
      {
        ...context,
        details: { ...context?.details, postId, postName }
      }
    );
  }

  async logPostDeleted(postId: string, postName: string, context?: AuditContext): Promise<void> {
    await this.logInfo(
      AuditAction.DELETE,
      AuditResource.POST,
      `Post eliminado: "${postName}"`,
      {
        ...context,
        details: { ...context?.details, postId, postName }
      }
    );
  }

  async logPostsListed(count: number, context?: AuditContext): Promise<void> {
    await this.logInfo(
      AuditAction.READ,
      AuditResource.POST,
      `Posts listados: ${count} elementos`,
      {
        ...context,
        details: { ...context?.details, count }
      }
    );
  }

  // Métodos para errores del sistema
  async logSystemError(error: Error, context?: AuditContext): Promise<void> {
    await this.logError(
      AuditAction.ERROR,
      AuditResource.SYSTEM,
      `Error del sistema: ${error.message}`,
      {
        ...context,
        details: {
          ...context?.details,
          errorName: error.name,
          errorMessage: error.message,
          errorStack: error.stack
        }
      }
    );
  }

  async logApiRequest(
    method: string,
    path: string,
    statusCode: number,
    context?: AuditContext
  ): Promise<void> {
    const level = statusCode >= 400 ? AuditLevel.WARNING : AuditLevel.INFO;
    await this.log(
      AuditAction.READ,
      AuditResource.API,
      level,
      `${method} ${path} - ${statusCode}`,
      {
        ...context,
        details: {
          ...context?.details,
          method,
          path,
          statusCode
        }
      }
    );
  }

  private async log(
    action: AuditAction,
    resource: AuditResource,
    level: AuditLevel,
    message: string,
    context?: AuditContext
  ): Promise<void> {
    try {
      const auditData: AuditLogData = {
        action,
        resource,
        level,
        message,
        details: context?.details || {},
        userAgent: context?.userAgent,
        ipAddress: context?.ipAddress,
      };

      await this.createAuditLogUseCase.execute(auditData);
    } catch (error) {
      // No queremos que fallos en auditoría afecten la funcionalidad principal
      console.error('Error al crear log de auditoría:', error);
    }
  }
} 