import { Request, Response } from 'express';
import { LikesService } from '../services/likes-services';
import { desbloquearLogro } from '../utils/logros';
import { agregarExperiencia } from '../utils/experiencia-utils';

export class LikesController {
  private service = new LikesService();

  async toggleLike(req: Request, res: Response): Promise<void> {
    const usuarioId = (req as any).user?.id; // Asegúrate de que el middleware añade esto
    const { id: publicacionId } = req.params;

    if (!usuarioId || !publicacionId) {
      res.status(400).json({ error: 'Faltan datos' });
      return;
    }

    try {
      const resultado = await this.service.toggleLike(Number(usuarioId), Number(publicacionId));
      if (resultado.liked) {
        await agregarExperiencia(usuarioId, 1); // Solo si es un nuevo like
      }

      const totalLikes = await this.service.contarLikes(Number(publicacionId));

      const totalLikesLogro = await this.service.contarLikesTotales(usuarioId);
      if (totalLikesLogro === 50) {
        await desbloquearLogro(usuarioId, 'CORAZON_ACTIVO');
      }
      res.status(200).json({ liked: resultado.liked, totalLikes });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al dar me gusta' });
    }
  }
}