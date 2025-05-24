import { Request, Response } from 'express';
import { PublicacionesService } from '../services/publicaciones-service';

export class PublicacionesController {
  private PublicacionesService = new PublicacionesService();

  async crear(req: Request, res: Response): Promise<void> {
    console.log('=== DEBUG CREAR PUBLICACIÓN ===');
    console.log('REQ.BODY:', req.body);
    console.log('REQ.FILE:', req.file);
    
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
        console.log('🎬 Archivo detectado:', req.file.filename);
        console.log('📁 Tipo MIME:', req.file.mimetype);
        
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

        console.log('🏷️ Tipo final detectado:', finalTipoMedia);
        console.log('🔗 URL generada:', media_url);
      } else {
        console.log('❌ No se detectó archivo en req.file');
      }

      console.log('== DATOS FINALES A GUARDAR ==');
      console.log('autor_id:', autor_id);
      console.log('titulo:', titulo);
      console.log('descripcion:', descripcion);
      console.log('media_url:', media_url);
      console.log('tipo_media:', finalTipoMedia);

      const nueva = await this.PublicacionesService.crearPublicacion({
        autor_id: parseInt(autor_id),
        titulo,
        descripcion,
        media_url: media_url || undefined,
        tipo_media: finalTipoMedia || undefined
      });

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
      console.error('Error en obtenerTodas:', error);
      res.status(500).json({ error: 'Error al obtener las publicaciones' });
    }
  }
}