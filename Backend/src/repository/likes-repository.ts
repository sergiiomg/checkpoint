import { Like } from '../models/like';
import {obtenerDB} from '../db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class LikesRepository {
  async crearLike(usuarioId: number, publicacionId: number): Promise<Like> {
      const db = await obtenerDB();
      const [result] = await db.query<ResultSetHeader>(
        'INSERT INTO likes (usuario_id, publicacion_id) VALUES (?, ?)',
        [usuarioId, publicacionId]
      );
      return {
        id: result.insertId,
        usuario_id: usuarioId,
        publicacion_id: publicacionId
      };
    }

  async eliminarLike(usuarioId: number, publicacionId: number): Promise<void> {
    const db = await obtenerDB();
    const [resultado] = await db.query(
      'DELETE FROM likes WHERE usuario_id = ? AND publicacion_id = ?',
      [usuarioId, publicacionId]
    );
  }

  async existeLike(usuarioId: number, publicacionId: number): Promise<boolean> {
    const db = await obtenerDB();
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT id FROM likes WHERE usuario_id = ? AND publicacion_id = ?',
      [usuarioId, publicacionId]
    );
    return rows.length > 0;
  }

  async contarLikes(publicacionId: number): Promise<number> {
    const db = await obtenerDB();
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM likes WHERE publicacion_id = ?',
      [publicacionId]
    );
    return rows[0].total;
  }

  async obtenerPublicacionesConLike(usuarioId: number) {
    const db = await obtenerDB();
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT p.*
       FROM publicaciones p
       JOIN likes l ON p.id = l.publicacion_id
       WHERE l.usuario_id = ? 
       ORDER BY l.id DESC`,
      [usuarioId]
    );
    return rows;
  }

}
