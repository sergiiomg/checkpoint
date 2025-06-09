import { LikeRepository } from "../repository/likes-repository";

export class LikeService {
  private likeRepo = new LikeRepository();

  async toggleLike(usuarioId: number, publicacionId: number) {
    const hasLiked = await this.likeRepo.findLike(usuarioId, publicacionId);

    if (hasLiked) {
      await this.likeRepo.deleteLike(usuarioId, publicacionId);
    } else {
      await this.likeRepo.createLike(usuarioId, publicacionId);
    }

    const updatedCount = await this.likeRepo.countLikes(publicacionId);

    return {
      liked: !hasLiked,
      totalLikes: updatedCount,
    };
  }
}
