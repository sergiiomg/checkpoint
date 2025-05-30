import { Request, Response } from 'express';
import { LogrosService } from '../services/logros-service';

export class LogrosController {
  private service = new LogrosService();

  async obtenerLogrosUsuario(req: Request, res: Response): Promise<void> {
    const usuarioId = (req as any).user?.id;

    if (!usuarioId) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    try {
      const logros = await this.service.obtenerLogrosPorUsuario(usuarioId);
      res.status(200).json(logros);
    } catch (error) {
      console.error('Error al obtener logros del usuario:', error);
      res.status(500).json({ error: 'Error al obtener logros del usuario' });
    }
  }
}
