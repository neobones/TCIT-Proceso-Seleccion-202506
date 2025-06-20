import { DatabaseConfig } from './DatabaseConfig';

export async function migrate(): Promise<void> {
  try {
    const db = await DatabaseConfig.getDatabase();

    await db.exec(`
      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        action TEXT NOT NULL,
        resource TEXT NOT NULL,
        resource_id TEXT,
        level TEXT NOT NULL,
        message TEXT NOT NULL,
        details TEXT,
        user_agent TEXT,
        ip_address TEXT,
        timestamp TEXT NOT NULL
      );
    `);

    // Crear índices para optimizar consultas de auditoría
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_level ON audit_logs(level);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_id ON audit_logs(resource_id);
    `);

    console.log('✅ Migración de base de datos completada exitosamente');
  } catch (error) {
    console.error('❌ Error en la migración:', error);
    throw error;
  }
}

// Ejecutar migración si este archivo se ejecuta directamente
if (require.main === module) {
  migrate()
    .then(() => {
      console.log('Proceso de migración finalizado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error en la migración:', error);
      process.exit(1);
    });
} 