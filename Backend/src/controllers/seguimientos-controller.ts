// controllers/seguimientos-controller.ts
import { Request, Response } from 'express';
import { SeguimientosService } from '../services/seguimientos-service';

export class SeguimientosController {
  private service = new SeguimientosService();

  async seguir(req: Request, res: Response): Promise<void> {
    const seguidoId = parseInt(req.params.id);
    const seguidorId = (req as any).user.id;

    try {
      const exito = await this.service.seguirUsuario(seguidorId, seguidoId);
      if (!exito) {
        res.status(400).json({ error: 'No se pudo seguir al usuario (posiblemente ya lo sigues o es tu propio usuario).' });
        return;
      }

      res.status(200).json({ mensaje: 'Ahora sigues a este usuario' });
    } catch (error) {
      console.error('❌ Error al seguir usuario:', error);
      res.status(500).json({ error: 'Error al seguir usuario' });
    }
  }

   async dejarDeSeguir(req: Request, res: Response): Promise<void> {
    const seguido_id = parseInt(req.params.id);
    const seguidor_id = (req as any).user.id;

    if (seguidor_id === seguido_id) {
        res.status(400).json({ error: 'No puedes dejar de seguirte a ti mismo' });
    }

    try {
      const exito = await this.service.dejarDeSeguir(seguidor_id, seguido_id);
      if (!exito) {
        res.status(400).json({ error: 'No estás siguiendo a este usuario' });
      }
      res.status(200).json({ mensaje: 'Has dejado de seguir a este usuario' });
    } catch (error) {
      console.error('❌ Error al dejar de seguir:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getSiguiendo(req: Request, res: Response) {
    const usuarioId = parseInt(req.params.id);

    try {
      const siguiendo = await this.service.siguiendoDeUsuario(usuarioId);
      res.status(200).json(siguiendo);
    } catch (error) {
      console.error('❌ Error al obtener siguiendo:', error);
      res.status(500).json({ error: 'Error al obtener siguiendo' });
    }
  }
}
