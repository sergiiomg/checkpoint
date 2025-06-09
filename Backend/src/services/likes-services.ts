import { LikesRepository } from '../repository/likes-repository';
import { obtenerDB } from '../db';
import { Connection } from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

export class LikesService {
  private repo = new LikesRepository();
  private db!: Connection;

  async toggleLike(usuarioId: number, publicacionId: number): Promise<{ liked: boolean }> {
    const yaExiste = await this.repo.existeLike(usuarioId, publicacionId);
    if (yaExiste) {
      await this.repo.eliminarLike(usuarioId, publicacionId);
      return { liked: false };
    } else {
      await this.repo.crearLike(usuarioId, publicacionId);
      return { liked: true };
    }
  }

  async contarLikes(publicacionId: number): Promise<number> {
    return this.repo.contarLikes(publicacionId);
  }

  async contarLikesTotales(usuarioId: number): Promise<number> {
    if (!this.db) this.db = await obtenerDB();
  
      const [likesPublicaciones] = await this.db.query<RowDataPacket[]>(
      'SELECT COUNT(*) AS total FROM likes WHERE usuario_id = ?',
      [usuarioId]
    );
  
    const [likesComentarios] = await this.db.query<RowDataPacket[]>(
      'SELECT COUNT(*) AS total FROM likes_comentarios WHERE usuario_id = ?',
      [usuarioId]
    );
  
    const totalLikesLogro = likesPublicaciones[0].total + likesComentarios[0].total;
    return totalLikesLogro;
  }

  async obtenerPublicacionesConLike(usuarioId: number) {
    const publicaciones = await this.repo.obtenerPublicacionesConLike(usuarioId);
    return publicaciones;
  }

}