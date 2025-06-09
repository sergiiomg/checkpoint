import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface Publicacion {
  id: number;
  autor_id: number;
  titulo: string;
  descripcion: string;
  media_url: string | null;
  tipo_media: 'imagen' | 'video' | null;
  fecha_creacion: number;
  autor_nombre?: string;
  autor_foto?: string;
  liked?: boolean;
  likesCount?: number;
  guardada: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {

  private apiUrl = 'http://localhost:8080/api/';
   private baseUrl = 'http://localhost:8080';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getPublicaciones(): Observable<Publicacion[]> {
    console.log('🌐 LLAMANDO A:', this.apiUrl + 'auth/publicaciones');
    console.log('🔑 Headers de autenticación:', this.http);
    
    return this.http.get<Publicacion[]>(this.apiUrl + 'auth/publicaciones').pipe(
      tap(response => {
        console.log('✅ RESPUESTA RECIBIDA:', response);
      }),
      catchError(error => {
        console.error('❌ ERROR EN LA LLAMADA:', error);
        throw error;
      })
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
    
    
    // Si ya es una URL completa, devolverla tal como está
    if (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://')) {
      console.log('✅ URL ya es completa:', mediaUrl);
      return mediaUrl;
    }
    
    // Si es una ruta relativa, construir la URL completa
    const fullUrl = `${this.baseUrl}${mediaUrl}`;
    
    return fullUrl;
  }

  getPublicacionPorId(id: number): Observable<Publicacion> {
    const token = localStorage.getItem('token'); // O donde tengas el token
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.get<Publicacion>(`${this.apiUrl}auth/publicaciones/${id}`, {headers});
  }

  guardarPublicacion(id: number) {
    return this.http.post(`${this.apiUrl}publicaciones/${id}/guardar`, {});
  }

  desguardarPublicacion(id: number) {
    return this.http.delete(`${this.apiUrl}publicaciones/${id}/guardar`);
  }

  obtenerPublicacionesGuardadas(): Observable<Publicacion[]> {
    console.log('🔁 Llamada REAL a obtenerPublicacionesGuardadas');
    return this.http.get<Publicacion[]>(`${this.apiUrl}publicaciones-guardadas`);
  }

  eliminarPublicacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}publicaciones/${id}`);
  }
}
