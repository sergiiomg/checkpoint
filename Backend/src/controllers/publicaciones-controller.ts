import { Request, Response } from 'express';
import { PublicacionesService } from '../services/publicaciones-service';

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
        // Generar URL del archivo
        media_url = `/uploads/${req.file.filename}`;
        
        // Si no se especificó tipo_media, detectarlo del archivo
        if (!tipo_media) {
          if (req.file.mimetype.startsWith('image/')) {
            finalTipoMedia = 'imagen';
          } else if (req.file.mimetype.startsWith('video/')) {
            finalTipoMedia = 'video';
          }
        } else {
          finalTipoMedia = tipo_media;
        }

        // Validar que el tipo_media sea correcto
        if (finalTipoMedia !== 'imagen' && finalTipoMedia !== 'video') {
          res.status(400).json({ error: 'tipo_media debe ser "imagen" o "video"' });
          return;
        }
      }

      const nueva = await this.PublicacionesService.crearPublicacion({
        autor_id,
        titulo,
        descripcion,
        media_url: media_url || undefined,
        tipo_media: finalTipoMedia || undefined
      });

      res.status(201).json(nueva);
    } catch (error) {
      console.error('Error al crear publicación:', error);
      res.status(500).json({ error: 'Error al crear la publicación' });
    }
  }

  async obtenerTodas(req: Request, res: Response): Promise<void> {
    try {
      const publicaciones = await this.PublicacionesService.obtenerTodasPublicaciones();
      res.status(200).json(publicaciones);
    } catch (error) {
      console.error('Error en obtenerTodas:', error);
      res.status(500).json({ error: 'Error al obtener las publicaciones' });
    }
  }
}