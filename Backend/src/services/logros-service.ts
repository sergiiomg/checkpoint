import { obtenerDB } from '../db';
import { RowDataPacket } from 'mysql2';

export class LogrosService {
  async obtenerLogrosPorUsuario(usuarioId: number): Promise<any[]> {
    const db = await obtenerDB();

    const [rows] = await db.query<RowDataPacket[]>(`
      SELECT l.id, l.nombre, l.descripcion, l.experiencia, l.clave, lu.fecha_desbloqueo
      FROM logros_usuarios lu
      JOIN logros l ON l.id = lu.logro_id
      WHERE lu.usuario_id = ?
      ORDER BY lu.fecha_desbloqueo DESC
    `, [usuarioId]);

    return rows;
  }
}
