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
        publicacion.media_url,
        publicacion.tipo_media,
        publicacion.fecha_creacion
      ]
    );

    return {
      id: (result as any).insertId,
      ...publicacion
    };
  }

  async obtenerTodas(): Promise<Publicacion[]> {
    const db = await obtenerDB();
    const [rows] = await db.execute(
        'SELECT * FROM publicaciones ORDER BY fecha_creacion DESC'
    );
    await db.end();
    return rows as Publicacion[];
}
}