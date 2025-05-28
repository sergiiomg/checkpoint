// controllers/seguimientos-controller.ts
import { Request, Response } from 'express';
import { SeguimientosService } from '../services/seguimientos-service';
import { desbloquearLogro } from '../utils/logros';

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

      const seguidoresUsuario = await this.service.contarSeguidores(seguidoId);

      if (seguidoresUsuario === 10) {
        await desbloquearLogro(seguidoId, 'POPULAR');
      }
      if (seguidoresUsuario === 50) {
        await desbloquearLogro(seguidoId, 'QUERIDO_POR_MUCHOS');
      }
      if (seguidoresUsuario === 100) {
        await desbloquearLogro(seguidoId, 'IDOLO_DE_MASAS');
      }

      const seguidosPorUsuario = await this.service.contarUsuariosSeguidos(seguidorId);

      if (seguidosPorUsuario === 5) {
        await desbloquearLogro(seguidorId, 'CURIOSO');
      }
      if (seguidosPorUsuario === 20) {
        await desbloquearLogro(seguidorId, 'EXPLORADOR');
      }
      if (seguidosPorUsuario === 50) {
        await desbloquearLogro(seguidorId, 'FANATICO');
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

  async getSeguidores(req: Request, res: Response) {
      const usuarioId = parseInt(req.params.id);
    
      try {
        const seguidores = await this.service.seguidoresDeUsuario(usuarioId);
        res.status(200).json(seguidores);
      } catch (error) {
        console.error('❌ Error al obtener seguidores:', error);
        res.status(500).json({ error: 'Error al obtener seguidores' });
      }
    }



    async estoySiguiendo(req: Request, res: Response) {
      const yoId = (req as any).user.id;
      const seguidoId = parseInt(req.params.id);
    
      try {
        const sigue = await this.service.estoySiguiendo(yoId, seguidoId);
        res.status(200).json({ siguiendo: sigue });
      } catch (error) {
        console.error('❌ Error al comprobar seguimiento:', error);
        res.status(500).json({ error: 'Error al comprobar seguimiento' });
      }
    }

    async meSigue(req: Request, res: Response) {
      const yoId = (req as any).user.id;
      const otroUsuarioId = parseInt(req.params.id);
    
      try {
        const teSigue = await this.service.meSigue(yoId, otroUsuarioId);
        res.status(200).json({ teSigue });
      } catch (error) {
        console.error('❌ Error al comprobar si te sigue:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }

    async sonAmigos(req: Request, res: Response) {
      const yoId = (req as any).user.id;
      const otroUsuarioId = parseInt(req.params.id);
    
      try {
        const amigos = await this.service.sonAmigos(yoId, otroUsuarioId);
        res.status(200).json({ amigos });
      } catch (error) {
        console.error('❌ Error al comprobar amistad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }

}
