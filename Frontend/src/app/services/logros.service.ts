import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface Logro {
  id: number;
  nombre: string;
  descripcion: string;
  experiencia: number;
  clave: string;
  estado: 'Completado' | 'Sin completar';
}

@Injectable({
  providedIn: 'root'
})
export class LogrosService {
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

  obtenerLogros(): Observable<Logro[]> {
    return this.http.get<Logro[]>(`${this.apiUrl}logros`, { headers: this.headers });
  }
}
