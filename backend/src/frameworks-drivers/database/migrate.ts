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