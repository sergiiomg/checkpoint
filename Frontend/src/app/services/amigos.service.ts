import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

export interface Amigo {
  id: number;
  nombre_usuario: string;
  foto_perfil_url: string;
}

@Injectable({
  providedIn: 'root'
})
export class AmigosService {
  private apiUrl = 'http://localhost:8080/api/';
  private headers: HttpHeaders = new HttpHeaders();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        this.headers = this.headers.set('content-type', 'application/json')
                                   .set('Authorization', `Bearer ${token}`);
      }
    }
  }

  obtenerAmigos(): Observable<Amigo[]> {
    return this.http.get<Amigo[]>(`${this.apiUrl}amigos`, { headers: this.headers });
  }
}
