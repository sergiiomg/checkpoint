import { Request, Response } from 'express';
import { LogrosService } from '../services/logros-service';
import { obtenerDB } from '../db';

export class LogrosController {
  private service = new LogrosService();

  async obtenerTodosLosLogrosConEstado(req: Request, res: Response) {
    const usuarioId = (req as any).user?.id;
  
    try {
      const db = await obtenerDB();
  
      const [logros] = await db.query(`
        SELECT l.id, l.nombre, l.descripcion, l.experiencia, l.clave,
          CASE
            WHEN lu.usuario_id IS NOT NULL THEN 'Completado'
            ELSE 'Sin completar'
          END AS estado
        FROM logros l
        LEFT JOIN logros_usuarios lu ON l.id = lu.logro_id AND lu.usuario_id = ?
      `, [usuarioId]);
  
      res.status(200).json(logros);
    } catch (err) {
      console.error('Error al obtener logros con estado:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}
