import mysql from 'mysql2/promise';
import { DB_CONFIG } from './config';

let db: mysql.Connection | null = null;

export async function obtenerDB(): Promise<mysql.Connection> {
  if (!db) {
    try {
      db = await mysql.createConnection(DB_CONFIG);
      console.log('✅ Conectado a la base de datos');
    } catch (error) {
      console.error('❌ Error al conectar con la base de datos:', error);
      process.exit(1);
    }
  }
  return db;
}

export { db };