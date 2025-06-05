import { RowDataPacket } from 'mysql2';
import { obtenerDB } from '../db';
import { Publicacion } from '../models/publicacion';

export class PublicacionesRepository {
  async crearPublicacion(publicacion: Omit<Publicacion, 'id'>) {
    const db = await obtenerDB();
    const [result] = await db.execute(
      `INSERT INTO publicaciones (autor_id, titulo, descripcion, media_url, tipo_media, fecha_creacion)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        publicacion.autor_id,
        publicacion.titulo,
        publicacion.descripcion,
        publicacion.media_url ?? null,
        publicacion.tipo_media ?? null,
        publicacion.fecha_creacion
      ]
    );

    return {
      id: (result as any).insertId,
      ...publicacion
    };
  }

  // ✅ MANTÉN SOLO ESTE método básico para obtener por ID
  async obtenerPorId(id: number): Promise<Publicacion | null> {
    const db = await obtenerDB();
    const [rows] = await db.execute(
      `SELECT p.*, u.nombre_usuario AS autor_nombre, u.foto_perfil_url AS autor_foto
       FROM publicaciones p
       JOIN usuarios u ON p.autor_id = u.id
       WHERE p.id = ?`,
      [id]
    );
    const publicaciones = rows as Publicacion[];
    return publicaciones.length > 0 ? publicaciones[0] : null;
  }
}