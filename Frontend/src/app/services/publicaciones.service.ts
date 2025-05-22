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
    if (!mediaUrl) return null;
    if (mediaUrl.startsWith('http')) return mediaUrl; // URL completa
    return `${this.baseUrl}${mediaUrl}`; // URL relativa
  }
}
