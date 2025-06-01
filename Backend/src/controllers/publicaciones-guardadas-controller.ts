import { Request, Response } from 'express';
import { PublicacionesGuardadasService } from '../services/publicaciones-guardadas-service';


export class PublicacionesGuardadasController {
  private service = new PublicacionesGuardadasService();

  async guardar(req: Request, res: Response) {
    const usuario_id = (req as any).user.id;
    const publicacion_id = parseInt(req.params.id);

    try {
      await this.service.guardarPublicacion(usuario_id, publicacion_id);
      res.status(200).json({ mensaje: 'Publicación guardada' });
    } catch (error) {
      console.error('Error al guardar publicación:', error);
      res.status(500).json({ error: 'Error al guardar la publicación' });
    }
  }

  async desguardar(req: Request, res: Response) {
    const usuario_id = (req as any).user.id;
    const publicacion_id = parseInt(req.params.id);

    try {
      await this.service.desguardarPublicacion(usuario_id, publicacion_id);
      res.status(200).json({ mensaje: 'Publicación desguardada' });
    } catch (error) {
      console.error('Error al desguardar publicación:', error);
      res.status(500).json({ error: 'Error al desguardar la publicación' });
    }
  }

  async obtenerGuardadas(req: Request, res: Response) {
    const usuario_id = (req as any).user.id;

    try {
      const publicaciones = await this.service.obtenerGuardadasPorUsuario(usuario_id);
      res.status(200).json(publicaciones);
    } catch (error) {
      console.error('Error al obtener guardadas:', error);
      res.status(500).json({ error: 'Error al obtener publicaciones guardadas' });
    }
  }
}
