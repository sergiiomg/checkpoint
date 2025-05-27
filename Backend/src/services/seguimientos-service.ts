// servicios/seguimientos-service.ts
import { obtenerDB } from '../db';
import { Connection } from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

export class SeguimientosService {
  private db!: Connection;

  async seguirUsuario(seguidorId: number, seguidoId: number): Promise<boolean> {
    if (!this.db) this.db = await obtenerDB();

    if (seguidorId === seguidoId) return false; // No puedes seguirte a ti mismo

    // Verificar si ya lo sigue
    const [rows] = await this.db.query(
      'SELECT id FROM seguimientos WHERE seguidor_id = ? AND seguido_id = ?',
      [seguidorId, seguidoId]
    );

    if ((rows as any[]).length > 0) return false; // Ya lo sigue

    // Insertar seguimiento
    await this.db.query(
      'INSERT INTO seguimientos (seguidor_id, seguido_id) VALUES (?, ?)',
      [seguidorId, seguidoId]
    );

    return true;
  }

  async dejarDeSeguir(seguidor_id: number, seguido_id: number): Promise<boolean> {
    if (!this.db) this.db = await obtenerDB();

    const [rows] = await this.db.query<RowDataPacket[]>(
      'SELECT id FROM seguimientos WHERE seguidor_id = ? AND seguido_id = ?',
      [seguidor_id, seguido_id]
    );

    if (rows.length === 0) return false;

    await this.db.query(
      'DELETE FROM seguimientos WHERE seguidor_id = ? AND seguido_id = ?',
      [seguidor_id, seguido_id]
    );

    return true;
  }

  async siguiendoDeUsuario(usuarioId: number) {
    if (!this.db) this.db = await obtenerDB();

    const [rows] = await this.db.query(
      `SELECT u.id, u.nombre_usuario, u.email
       FROM seguimientos s
       JOIN usuarios u ON s.seguido_id = u.id
       WHERE s.seguidor_id = ?`,
      [usuarioId]
    );

    return rows;
  }

  async seguidoresDeUsuario(usuarioId: number) {
      if (!this.db) this.db = await obtenerDB();
    
      const [rows] = await this.db.query(
        `SELECT u.id, u.nombre_usuario, u.email
         FROM seguimientos s
         JOIN usuarios u ON s.seguidor_id = u.id
         WHERE s.seguido_id = ?`,
        [usuarioId]
      );
    
      return rows;
    }

    async estoySiguiendo(yoId: number, seguidoId: number): Promise<boolean> {
      if (!this.db) this.db = await obtenerDB();
    
      const [rows] = await this.db.query(
        'SELECT id FROM seguimientos WHERE seguidor_id = ? AND seguido_id = ?',
        [yoId, seguidoId]
      );
    
      return (rows as any[]).length > 0;
    }
}
