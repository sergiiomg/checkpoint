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

    async meSigue(yoId: number, otroUsuarioId: number): Promise<boolean> {
      if (!this.db) this.db = await obtenerDB();
    
      const [rows] = await this.db.query(
        'SELECT id FROM seguimientos WHERE seguidor_id = ? AND seguido_id = ?',
        [otroUsuarioId, yoId]
      );
    
      return (rows as any[]).length > 0;
    }

    async sonAmigos(yoId: number, otroUsuarioId: number): Promise<boolean> {
      if (!this.db) this.db = await obtenerDB();
    
      const [rows] = await this.db.query(
        `SELECT COUNT(*) as cantidad FROM seguimientos 
         WHERE (seguidor_id = ? AND seguido_id = ?) 
            OR (seguidor_id = ? AND seguido_id = ?)`,
        [yoId, otroUsuarioId, otroUsuarioId, yoId]
      );
    
      const cantidad = (rows as any)[0].cantidad;
      return cantidad === 2;
    }

  async contarSeguidores(usuarioId: number): Promise<number> {
    if (!this.db) this.db = await obtenerDB();
    const [resultado] = await this.db.query<RowDataPacket[]>(
      'SELECT COUNT(*) AS total FROM seguimientos WHERE seguido_id = ?',
      [usuarioId]
    );
    return resultado[0].total;
  }

  async contarUsuariosSeguidos(usuarioId: number): Promise<number> {
    if (!this.db) this.db = await obtenerDB();
    const [resultado] = await this.db.query<RowDataPacket[]>(
    'SELECT COUNT(*) AS total FROM seguimientos WHERE seguidor_id = ?',
    [usuarioId]
  );
    return resultado[0].total;
  }

  async obtenerAmigos(usuarioId: number) {
    if (!this.db) this.db = await obtenerDB();
  
    const [rows] = await this.db.query(
      `SELECT u.id, u.nombre_usuario, u.foto_perfil_url
       FROM usuarios u
       JOIN seguimientos s1 ON s1.seguido_id = u.id AND s1.seguidor_id = ?
       JOIN seguimientos s2 ON s2.seguidor_id = u.id AND s2.seguido_id = ?
       WHERE u.id != ?`,
      [usuarioId, usuarioId, usuarioId]
    );
  
    return rows;
  }
}
