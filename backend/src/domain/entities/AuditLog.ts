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

export interface AuditLogData {
  id?: string;
  action: AuditAction;
  resource: AuditResource;
  resourceId?: string;
  level: AuditLevel;
  message: string;
  details?: Record<string, any>;
  userAgent?: string;
  ipAddress?: string;
  timestamp?: Date;
}

export class AuditLog {
  public readonly id: string;
  public readonly action: AuditAction;
  public readonly resource: AuditResource;
  public readonly resourceId?: string;
  public readonly level: AuditLevel;
  public readonly message: string;
  public readonly details: Record<string, any>;
  public readonly userAgent?: string;
  public readonly ipAddress?: string;
  public readonly timestamp: Date;

  constructor(data: AuditLogData) {
    this.id = data.id || this.generateId();
    this.action = data.action;
    this.resource = data.resource;
    this.resourceId = data.resourceId;
    this.level = data.level;
    this.message = data.message;
    this.details = data.details || {};
    this.userAgent = data.userAgent;
    this.ipAddress = data.ipAddress;
    this.timestamp = data.timestamp || new Date();

    this.validateInvariants();
  }

  private generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private validateInvariants(): void {
    if (!this.action) {
      throw new Error('La acción de auditoría es requerida');
    }
    if (!this.resource) {
      throw new Error('El recurso de auditoría es requerido');
    }
    if (!this.level) {
      throw new Error('El nivel de auditoría es requerido');
    }
    if (!this.message?.trim()) {
      throw new Error('El mensaje de auditoría es requerido');
    }
  }

  public toJSON(): Record<string, any> {
    return {
      id: this.id,
      action: this.action,
      resource: this.resource,
      resourceId: this.resourceId,
      level: this.level,
      message: this.message,
      details: this.details,
      userAgent: this.userAgent,
      ipAddress: this.ipAddress,
      timestamp: this.timestamp.toISOString(),
    };
  }

  public static fromJSON(json: Record<string, any>): AuditLog {
    return new AuditLog({
      id: json.id,
      action: json.action as AuditAction,
      resource: json.resource as AuditResource,
      resourceId: json.resourceId,
      level: json.level as AuditLevel,
      message: json.message,
      details: json.details || {},
      userAgent: json.userAgent,
      ipAddress: json.ipAddress,
      timestamp: new Date(json.timestamp),
    });
  }
} 