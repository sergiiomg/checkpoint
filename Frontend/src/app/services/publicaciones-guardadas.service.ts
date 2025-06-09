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
export class PublicacionesGuardadasService {

  private apiUrl = 'http://localhost:8080/api/';

  constructor(private http: HttpClient) {}

  obtenerGuardadas(): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(this.apiUrl + 'auth/publicaciones-guardadas');
  }

  toggleGuardado(publicacionId: number): Observable<any> {
    return this.http.delete(this.apiUrl + `publicaciones/${publicacionId}/guardar`);
  }
  
}
