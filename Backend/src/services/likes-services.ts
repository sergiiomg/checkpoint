import { LikesRepository } from '../repository/likes-repository';

export class LikesService {
  private repo = new LikesRepository();

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
}