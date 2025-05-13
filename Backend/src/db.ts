import mysql from 'mysql2/promise';
import { DB_CONFIG } from './config';

let db: mysql.Connection;

export async function conectarDB(): Promise<void> {
  try {
    db = await mysql.createConnection(DB_CONFIG);
    console.log('✅ Conectado a la base de datos');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    process.exit(1);
  }
}

export { db };