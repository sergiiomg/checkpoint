import { obtenerDB } from '../db';
import { Connection } from 'mysql2/promise';
import { RowDataPacket, FieldPacket } from 'mysql2';
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

    async obtenerRespuestasDeComentario(comentarioId: number) {
      if (!this.db) this.db = await obtenerDB();
      const [rows] = await this.db.query(
        'SELECT * FROM comentarios WHERE comentario_padre_id = ? ORDER BY fecha_creacion ASC',
        [comentarioId]
      );
      return rows;
    }

    async eliminarComentario(comentarioId: number, usuarioId: number): Promise<boolean> {
      try {
        if (!this.db) this.db = await obtenerDB();
    
        // Verificar si el comentario existe y si pertenece al usuario
        const [rows] = await this.db.query(
          'SELECT id, autor_id FROM comentarios WHERE id = ? AND autor_id = ?',
          [comentarioId, usuarioId]
        ) as [RowDataPacket[], FieldPacket[]];
    
        if (rows.length === 0) {
          return false; // No existe o no pertenece al usuario
        }
    
        // Eliminar el comentario
        await this.db.query('DELETE FROM comentarios WHERE id = ?', [comentarioId]);
    
        return true;
      } catch (error) {
        console.error('❌ Error al eliminar comentario:', error);
        throw error;
      }
    }
}
