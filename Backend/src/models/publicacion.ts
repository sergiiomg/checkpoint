export interface Publicacion {
  id: number;
  autor_id: number;
  titulo: string;
  descripcion: string;
  media_url: string;
  tipo_media: 'imagen' | 'video';
  fecha_creacion: number;
}