import { Request, Response } from 'express';
import { PublicacionesService } from '../services/publicaciones-service';
import { agregarExperiencia } from '../utils/experiencia-utils';


export class PublicacionesController {
  private PublicacionesService = new PublicacionesService();


  async crear(req: Request, res: Response): Promise<void> {
    
    try {
      const { autor_id, titulo, descripcion, tipo_media } = req.body;

      // Validaciones básicas
      if (!autor_id || !titulo || !descripcion) {
        res.status(400).json({ error: 'Faltan campos requeridos: autor_id, titulo, descripcion' });
        return;
      }

      let media_url = null;
      let finalTipoMedia = null;

      // Si hay archivo subido, procesarlo
      if (req.file) {
        
        // Generar URL del archivo (sin el protocolo y dominio, solo la ruta)
        media_url = `/uploads/${req.file.filename}`;
        
        // Detectar tipo automáticamente si no se especificó
        if (req.file.mimetype.startsWith('image/')) {
          finalTipoMedia = 'imagen';
        } else if (req.file.mimetype.startsWith('video/')) {
          finalTipoMedia = 'video';
        }

        // Si se especificó tipo_media en el formulario, usarlo (sobrescribir detección automática)
        if (tipo_media && (tipo_media === 'imagen' || tipo_media === 'video')) {
          finalTipoMedia = tipo_media;
        }

      } else {
        console.log('❌ No se detectó archivo en req.file');
      }

      const nueva = await this.PublicacionesService.crearPublicacion({
        autor_id: parseInt(autor_id),
        titulo,
        descripcion,
        media_url: media_url || undefined,
        tipo_media: finalTipoMedia || undefined
      });

      await agregarExperiencia(autor_id, 2);

      console.log('✅ Publicación creada exitosamente:', nueva);
      res.status(201).json(nueva);
      
    } catch (error) {
      console.error('❌ Error al crear publicación:', error);
      res.status(500).json({ error: 'Error al crear la publicación' });
    }
  }

  async obtenerTodas(req: Request, res: Response): Promise<void> {
    try {
      const publicaciones = await this.PublicacionesService.obtenerTodasPublicaciones();
      res.status(200).json(publicaciones);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las publicaciones' });
    }
  }

  async eliminar(req: Request, res: Response): Promise<void> {
    const publicacion_id = parseInt(req.params.id);
    const usuario_id = (req as any).user.id;
  
    try {
      const fueEliminada = await this.PublicacionesService.eliminar(publicacion_id, usuario_id);
  
      if (!fueEliminada) {
        res.status(403).json({ error: 'No tienes permiso para eliminar esta publicación' });
      }
  
        res.status(200).json({ mensaje: 'Publicación eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la publicación' });
    }
  }
}