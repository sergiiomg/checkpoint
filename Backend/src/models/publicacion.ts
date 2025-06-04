export interface Publicacion {
  id: number;
  autor_id: number;
  titulo: string;
  descripcion: string;
  media_url?: string | null;
  tipo_media?: 'imagen' | 'video' | null;
  fecha_creacion: number;
  autor_nombre?: string;
  autor_foto?: string;
  liked?: boolean;
  likesCount?: number;
}