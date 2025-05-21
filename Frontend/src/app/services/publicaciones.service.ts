import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Publicacion {
  id: number;
  autor_id: number;
  titulo: string;
  descripcion: string;
  media_url: string;
  tipo_media: 'imagen' | 'video' | null;
  fecha_creacion: number;
}

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {

  private apiUrl = 'http://localhost:8080/api/';

  constructor(private http: HttpClient) {}

  getPublicaciones(): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(this.apiUrl + 'auth/publicaciones');
  }
}
