import { PublicacionesRepository } from '../repository/publicaciones-repository';
import { Publicacion } from '../models/publicacion';
import { obtenerDB } from '../db';
import { Connection } from 'mysql2/promise';
import { db } from '../db';
import { RowDataPacket } from 'mysql2';

export class PublicacionesService {
  private repo = new PublicacionesRepository();
  private db!: Connection;

  async crearPublicacion(publicacion: Omit<Publicacion, 'id' | 'fecha_creacion'>) {
    return this.repo.crearPublicacion({
      ...publicacion,
      fecha_creacion: Date.now()
    });
  }

  // ✅ MÉTODO ACTUALIZADO - Ahora incluye likes
  async obtenerTodasPublicaciones(usuarioId?: number): Promise<Publicacion[]> {
    if (!this.db) this.db = await obtenerDB();
    
    let query = `
      SELECT 
        p.id,
        p.autor_id,
        p.titulo,
        p.descripcion,
        p.media_url,
        p.tipo_media,
        p.fecha_creacion,
        u.nombre_usuario as autor_nombre,
        u.foto_perfil_url as autor_foto,
        COUNT(l.id) as likesCount
    `;
    
    if (usuarioId) {
      query += `,
        CASE 
          WHEN ul.id IS NOT NULL THEN 1 
          ELSE 0 
        END as liked
      `;
    }
    
    query += `
      FROM publicaciones p
      LEFT JOIN usuarios u ON p.autor_id = u.id
      LEFT JOIN likes l ON p.id = l.publicacion_id
    `;
    
    if (usuarioId) {
      query += `
        LEFT JOIN likes ul ON p.id = ul.publicacion_id AND ul.usuario_id = ?
      `;
    }
    
    query += `
      GROUP BY p.id, p.autor_id, p.titulo, p.descripcion, p.media_url, p.tipo_media, p.fecha_creacion, u.nombre_usuario, u.foto_perfil_url
    `;
    
    if (usuarioId) {
      query += `, ul.id`;
    }
    
    query += `
      ORDER BY p.fecha_creacion DESC
    `;
    
    const params = usuarioId ? [usuarioId] : [];
    const [rows] = await this.db.query<RowDataPacket[]>(query, params);
    
    console.log('🔍 BACKEND - Primera fila RAW:', rows[0]);
    
    return rows.map(row => ({
      id: row.id,
      autor_id: row.autor_id,
      titulo: row.titulo,
      descripcion: row.descripcion,
      media_url: row.media_url,
      tipo_media: row.tipo_media,
      fecha_creacion: row.fecha_creacion,
      autor_nombre: row.autor_nombre,
      autor_foto: row.autor_foto,
      likesCount: parseInt(row.likesCount) || 0,
      liked: usuarioId ? Boolean(row.liked === 1) : false
    }));
  }

  async eliminar(publicacion_id: number, usuario_id: number): Promise<boolean> {
    try {
      // Verifica si la publicación existe y pertenece al usuario
      if (!this.db) this.db = await obtenerDB();
      const [rows]: [any[], any] = await this.db.query(
        'SELECT id FROM publicaciones WHERE id = ? AND autor_id = ?',
        [publicacion_id, usuario_id]
      );
      
      if (rows.length === 0) {
        return false;
      }

      // Elimina la publicación
      if (!this.db) this.db = await obtenerDB();
      const deleted = await this.db.query(
        'DELETE FROM publicaciones WHERE id = ? AND autor_id = ?',
        [publicacion_id, usuario_id]
      );

      return true;
    } catch (error) {
      console.error('❌ Error al eliminar publicación:', error);
      throw error;
    }
  }

  async contarPublicacionesUsuario(usuarioId: number): Promise<number> {
    const [rows] = await db!.query<RowDataPacket[]>(
      'SELECT COUNT(*) AS total FROM publicaciones WHERE autor_id = ?',
      [usuarioId]
    );
    return rows[0].total;
  }

  // ✅ MÉTODO ACTUALIZADO - Ahora incluye likes
  async obtenerPorId(id: number, usuarioId?: number): Promise<Publicacion | null> {
    if (!this.db) this.db = await obtenerDB();
    
    let query = `
      SELECT 
        p.id,
        p.autor_id,
        p.titulo,
        p.descripcion,
        p.media_url,
        p.tipo_media,
        p.fecha_creacion,
        u.nombre_usuario as autor_nombre,
        u.foto_perfil_url as autor_foto,
        COUNT(l.id) as likesCount
    `;
    
    if (usuarioId) {
      query += `,
        CASE 
          WHEN ul.id IS NOT NULL THEN 1 
          ELSE 0 
        END as liked
        ul.id as user_like_id
      `;
    }
    
    query += `
      FROM publicaciones p
      LEFT JOIN usuarios u ON p.autor_id = u.id
      LEFT JOIN likes l ON p.id = l.publicacion_id
    `;
    
    if (usuarioId) {
      query += `
        LEFT JOIN likes ul ON p.id = ul.publicacion_id AND ul.usuario_id = ?
      `;
    }
    
    query += `
      WHERE p.id = ?
      GROUP BY p.id, p.autor_id, p.titulo, p.descripcion, p.media_url, p.tipo_media, p.fecha_creacion, u.nombre_usuario, u.foto_perfil_url
    `;
    
    if (usuarioId) {
      query += `, ul.id`;
    }
    
    const params = usuarioId ? [usuarioId, id] : [id];
    const [rows] = await this.db.query<RowDataPacket[]>(query, params);
    
    if (rows.length === 0) {
      return null;
    }
    
    const row = rows[0];
    return {
      id: row.id,
      autor_id: row.autor_id,
      titulo: row.titulo,
      descripcion: row.descripcion,
      media_url: row.media_url,
      tipo_media: row.tipo_media,
      fecha_creacion: row.fecha_creacion,
      autor_nombre: row.autor_nombre,
      autor_foto: row.autor_foto,
      likesCount: parseInt(row.likesCount) || 0,
      liked: usuarioId ? Boolean(row.liked === 1) : false
    };
  }
}