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

    async editar(id: number, autor_id: number, contenido: string): Promise<boolean> {
      if (!this.db) this.db = await obtenerDB();
    
      const [rows] = await this.db.query<RowDataPacket[]>(
        'SELECT id FROM comentarios WHERE id = ? AND autor_id = ?',
        [id, autor_id]
      );
    
      if ((rows as any[]).length === 0) {
        return false;
      }
    
      await this.db.query(
        'UPDATE comentarios SET contenido = ? WHERE id = ? AND autor_id = ?',
        [contenido, id, autor_id]
      );
    
      return true;
    }

    async toggleLikeComentario(comentarioId: number, usuarioId: number): Promise<{ liked: boolean }> {
      if (!this.db) this.db = await obtenerDB();
    
      const [rows] = await this.db.query<RowDataPacket[]>(
        'SELECT * FROM likes_comentarios WHERE comentario_id = ? AND usuario_id = ?',
        [comentarioId, usuarioId]
      );
    
      if (rows.length > 0) {
        // Ya dio like, así que lo quitamos
        await this.db.query(
          'DELETE FROM likes_comentarios WHERE comentario_id = ? AND usuario_id = ?',
          [comentarioId, usuarioId]
        );
        return { liked: false };
      } else {
        // No dio like, así que lo agregamos
        await this.db.query(
          'INSERT INTO likes_comentarios (comentario_id, usuario_id) VALUES (?, ?)',
          [comentarioId, usuarioId]
        );
        return { liked: true };
      }
    }

    async contarLikesComentario(comentarioId: number): Promise<number> {
      if (!this.db) this.db = await obtenerDB();
    
      const [rows] = await this.db.query<RowDataPacket[]>(
        'SELECT COUNT(*) AS total FROM likes_comentarios WHERE comentario_id = ?',
        [comentarioId]
      );
    
      return rows[0].total;
    }

  async contarComentariosUsuario(usuarioId: number): Promise<number> {
    if (!this.db) this.db = await obtenerDB();

    const [resultado] = await this.db.query<RowDataPacket[]>(
      'SELECT COUNT(*) AS total FROM comentarios WHERE autor_id = ?',
      [usuarioId]
    );
    return resultado[0].total;
  }
}
