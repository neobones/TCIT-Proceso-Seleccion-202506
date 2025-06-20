import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { DatabaseError } from '../../shared/errors/DomainErrors';

export class DatabaseConfig {
  private static instance: Database | null = null;

  static async getDatabase(): Promise<Database> {
    if (!this.instance) {
      this.instance = await this.createDatabase();
    }
    return this.instance;
  }

  private static async createDatabase(): Promise<Database> {
    try {
      const db = await open({
        filename: process.env.DATABASE_PATH || './database.sqlite',
        driver: sqlite3.Database
      });

      // Habilitar foreign keys
      await db.exec('PRAGMA foreign_keys = ON;');
      
      return db;
    } catch (error) {
      throw new DatabaseError(
        `Error al crear la conexión a la base de datos: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  static async closeDatabase(): Promise<void> {
    if (this.instance) {
      await this.instance.close();
      this.instance = null;
    }
  }
} 