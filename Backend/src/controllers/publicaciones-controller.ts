import { Request, Response } from 'express';
import { PublicacionesService } from '../services/publicaciones-service';

export class PublicacionesController {
  private service = new PublicacionesService();

  async crear(req: Request, res: Response): Promise<void> {
    try {
      const { autor_id, titulo, descripcion, media_url, tipo_media } = req.body;

      if (!autor_id || !titulo || !descripcion || !tipo_media) {
        res.status(400).json({ error: 'Faltan campos requeridos' });
        return;
      }

      if (tipo_media !== 'imagen' && tipo_media !== 'video') {
        res.status(400).json({ error: 'tipo_media debe ser "imagen" o "video"' });
        return;
      }

      const nueva = await this.service.crearPublicacion({
        autor_id,
        titulo,
        descripcion,
        media_url,
        tipo_media
      });

      res.status(201).json(nueva);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear la publicación' });
    }
  }
}