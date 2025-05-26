import { PublicacionesRepository } from '../repository/publicaciones-repository';
import { Publicacion } from '../models/publicacion';
import { obtenerDB } from '../db';
import { Connection } from 'mysql2/promise';


export class PublicacionesService {
  private repo = new PublicacionesRepository();
  private db!: Connection;

  async crearPublicacion(publicacion: Omit<Publicacion, 'id' | 'fecha_creacion'>) {
    return this.repo.crearPublicacion({
      ...publicacion,
      fecha_creacion: Date.now()
    });
  }

  async obtenerTodasPublicaciones() {
    return await this.repo.obtenerTodas();
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
}