import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Publicacion {
  id: number;
  autor_id: number;
  titulo: string;
  descripcion: string;
  media_url: string | null;
  tipo_media: 'imagen' | 'video' | null;
  fecha_creacion: number;
  liked?: boolean;
  likesCount?: number;
  guardada?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {

  private apiUrl = 'http://localhost:8080/api/';
   private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getPublicaciones(): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(this.apiUrl + 'auth/publicaciones');
  }

  likePublicacion(publicacionId: number): Observable<{ liked: boolean, totalLikes: number }> {
    return this.http.post<{ liked: boolean, totalLikes: number }>(
      `${this.apiUrl}publicaciones/${publicacionId}/like`, 
      {}
    );
  }

  crearPublicacion(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}publicaciones`, data);
  }

   getFullMediaUrl(mediaUrl: string | null): string | null {
    if (!mediaUrl) {
      console.warn('⚠️ mediaUrl está vacío o null');
      return null;
    }
    
    console.log('🔗 URL original recibida:', mediaUrl);
    
    // Si ya es una URL completa, devolverla tal como está
    if (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://')) {
      console.log('✅ URL ya es completa:', mediaUrl);
      return mediaUrl;
    }
    
    // Si es una ruta relativa, construir la URL completa
    const fullUrl = `${this.baseUrl}${mediaUrl}`;
    console.log('🌐 URL completa generada:', fullUrl);
    
    return fullUrl;
  }
}
