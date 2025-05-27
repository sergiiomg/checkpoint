import { obtenerDB } from '../db';
import { Connection } from 'mysql2/promise';

export class ComentariosService {
  private db!: Connection;

  async crearComentario(data: {
    contenido: string,
    autor_id: number,
    publicacion_id: number,
    comentario_padre_id?: number | null
  }) {
    if (!this.db) this.db = await obtenerDB();

    const { contenido, autor_id, publicacion_id, comentario_padre_id } = data;

    const [result] = await this.db.query(
      `INSERT INTO comentarios (contenido, autor_id, publicacion_id, comentario_padre_id)
       VALUES (?, ?, ?, ?)`,
      [contenido, autor_id, publicacion_id, comentario_padre_id]
    );

    return {
      id: (result as any).insertId,
      ...data,
      fecha_creacion: new Date().toISOString()
    };
  }

  async obtenerComentariosDePublicacion(publicacionId: number) {
  if (!this.db) this.db = await obtenerDB();
  const [rows] = await this.db.query(
    'SELECT * FROM comentarios WHERE publicacion_id = ? AND comentario_padre_id IS NULL ORDER BY fecha_creacion DESC',
    [publicacionId]
  );
  return rows;
}
}
