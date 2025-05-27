export interface Comentario {
  id: number;
  publicacion_id: number;
  autor_id: number;
  contenido: string;
  fecha_creacion: Date;
}