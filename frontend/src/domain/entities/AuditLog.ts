export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  ERROR = 'ERROR',
  SYSTEM = 'SYSTEM'
}

export enum AuditResource {
  POST = 'POST',
  USER = 'USER',
  SYSTEM = 'SYSTEM',
  API = 'API'
}

export enum AuditLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

export class AuditLog {
  constructor(
    public readonly id: string,
    public readonly action: AuditAction,
    public readonly resource: AuditResource,
    public readonly resourceId: string | undefined,
    public readonly level: AuditLevel,
    public readonly message: string,
    public readonly details: Record<string, any>,
    public readonly userAgent: string | undefined,
    public readonly ipAddress: string | undefined,
    public readonly timestamp: Date
  ) {}

  static fromJSON(data: any): AuditLog {
    return new AuditLog(
      data.id,
      data.action as AuditAction,
      data.resource as AuditResource,
      data.resourceId,
      data.level as AuditLevel,
      data.message,
      data.details || {},
      data.userAgent,
      data.ipAddress,
      new Date(data.timestamp)
    );
  }

  public getFormattedTimestamp(): string {
    return this.timestamp.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  public getLevelColor(): string {
    switch (this.level) {
      case AuditLevel.INFO:
        return '#10b981'; // Verde
      case AuditLevel.WARNING:
        return '#f59e0b'; // Amarillo
      case AuditLevel.ERROR:
        return '#ef4444'; // Rojo
      case AuditLevel.CRITICAL:
        return '#dc2626'; // Rojo oscuro
      default:
        return '#6b7280'; // Gris
    }
  }

  public getActionIcon(): string {
    switch (this.action) {
      case AuditAction.CREATE:
        return '➕';
      case AuditAction.READ:
        return '👁️';
      case AuditAction.UPDATE:
        return '✏️';
      case AuditAction.DELETE:
        return '🗑️';
      case AuditAction.LOGIN:
        return '🔐';
      case AuditAction.LOGOUT:
        return '🚪';
      case AuditAction.ERROR:
        return '⚠️';
      case AuditAction.SYSTEM:
        return '🔧';
      default:
        return '📋';
    }
  }

  public getResourceIcon(): string {
    switch (this.resource) {
      case AuditResource.POST:
        return '📝';
      case AuditResource.USER:
        return '👤';
      case AuditResource.SYSTEM:
        return '💻';
      case AuditResource.API:
        return '🌐';
      default:
        return '📦';
    }
  }
} 