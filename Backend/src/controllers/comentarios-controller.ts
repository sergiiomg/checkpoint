import { Request, Response } from 'express';
import { ComentariosService } from '../services/comentarios-services';

export class ComentariosController {
  private service = new ComentariosService();

  async crearComentario(req: Request, res: Response): Promise<void> {
    const usuario_id = (req as any).user.id;
    const publicacion_id = parseInt(req.params.id);
    const { contenido, comentario_padre_id } = req.body;

    if (!contenido || contenido.trim() === '') {
      res.status(400).json({ error: 'Contenido del comentario es requerido' });
    }

    try {
      const nuevoComentario = await this.service.crearComentario({
        contenido,
        autor_id: usuario_id,
        publicacion_id,
        comentario_padre_id: comentario_padre_id || null
      });

      res.status(201).json(nuevoComentario);
    } catch (error) {
      console.error('❌ Error al crear comentario:', error);
      res.status(500).json({ error: 'Error al crear comentario' });
    }
  }

  async obtenerComentariosDePublicacion(req: Request, res: Response) {
      const publicacionId = parseInt(req.params.id);
      try {
        const comentarios = await this.service.obtenerComentariosDePublicacion(publicacionId);
        res.status(200).json(comentarios);
      } catch (error) {
        console.error('❌ Error al obtener comentarios:', error);
        res.status(500).json({ error: 'Error al obtener comentarios' });
      }
    }

    async obtenerRespuestasDeComentario(req: Request, res: Response) {
      const comentarioId = parseInt(req.params.id);
      try {
        const respuestas = await this.service.obtenerRespuestasDeComentario(comentarioId);
        res.status(200).json(respuestas);
      } catch (error) {
        console.error('❌ Error al obtener respuestas:', error);
        res.status(500).json({ error: 'Error al obtener respuestas' });
      }
    }

    async eliminarComentario(req: Request, res: Response) {
      const comentarioId = parseInt(req.params.id);
      const usuarioId = (req as any).user.id; // Obtener el id del usuario autenticado
      
      try {
        const fueEliminado = await this.service.eliminarComentario(comentarioId, usuarioId);
        
        if (fueEliminado) {
          res.status(200).json({ mensaje: 'Comentario eliminado correctamente' });
        } else {
          res.status(404).json({ mensaje: 'Comentario no encontrado o no autorizado a eliminarlo' });
        }
      } catch (error) {
        console.error('❌ Error al eliminar comentario:', error);
        res.status(500).json({ error: 'Error al eliminar comentario' });
      }
    }

    async editar(req: Request, res: Response): Promise<void> {
      const comentarioId = parseInt(req.params.id);
      const { contenido } = req.body;
      const usuarioId = (req as any).user.id;
    
      if (!contenido) {
        res.status(400).json({ error: 'El contenido no puede estar vacío' });
      }
    
      try {
        const fueEditado = await this.service.editar(comentarioId, usuarioId, contenido);
    
        if (!fueEditado) {
          res.status(403).json({ error: 'No tienes permiso para editar este comentario' });
        }
    
        res.status(200).json({ mensaje: 'Comentario editado correctamente' });
      } catch (error) {
        console.error('❌ Error al editar comentario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
}
