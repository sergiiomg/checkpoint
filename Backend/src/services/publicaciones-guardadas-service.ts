import { Connection } from 'mysql2/promise';
import { obtenerDB } from '../db';

export class PublicacionesGuardadasService {
  private db!: Connection;

  constructor() {
    this.init();
  }

  private async init() {
    this.db = await obtenerDB();
  }

  async guardarPublicacion(usuario_id: number, publicacion_id: number) {
    if (!this.db) this.db = await obtenerDB();
    const [result] = await this.db.query(
      `INSERT IGNORE INTO publicaciones_guardadas (usuario_id, publicacion_id) VALUES (?, ?)`,
      [usuario_id, publicacion_id]
    );
    return result;
  }

  async desguardarPublicacion(usuario_id: number, publicacion_id: number) {
    if (!this.db) this.db = await obtenerDB();
    const [result] = await this.db.query(
      `DELETE FROM publicaciones_guardadas WHERE usuario_id = ? AND publicacion_id = ?`,
      [usuario_id, publicacion_id]
    );
    return result;
  }

  async obtenerGuardadasPorUsuario(usuario_id: number) {
    if (!this.db) this.db = await obtenerDB();
    const [rows] = await this.db.query(
      `SELECT p.* 
       FROM publicaciones p
       JOIN publicaciones_guardadas pg ON p.id = pg.publicacion_id
       WHERE pg.usuario_id = ?
       ORDER BY pg.created_at DESC`,
      [usuario_id]
    );
    return rows;
  }
}
