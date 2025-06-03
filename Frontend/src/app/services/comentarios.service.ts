import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComentariosService {
  private apiUrl = 'http://localhost:8080/api'; // Ajusta si tu endpoint tiene /auth

  constructor(private http: HttpClient) {}

  crearComentario(publicacionId: number, contenido: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const body = {
      contenido: contenido
    };

    return this.http.post(
      `${this.apiUrl}/publicaciones/${publicacionId}/comentarios`,
      body,
      { headers }
    );
  }

  // (Opcional) Obtener comentarios de una publicación
  obtenerComentarios(publicacionId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/publicaciones/${publicacionId}/comentarios`);
  }
}
