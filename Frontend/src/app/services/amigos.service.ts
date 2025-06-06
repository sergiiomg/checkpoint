import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  private apiUrl = 'http://localhost:8080/api/'; // ajusta según tu backend

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders();
    this.headers = this.headers.set('content-type', 'application/json')
                               .set('Authorization', "Bearer " + localStorage.getItem('token')!);
  }

  private headers: HttpHeaders;

  obtenerAmigos(): Observable<Amigo[]> {
    return this.http.get<Amigo[]>(`${this.apiUrl}amigos`, { headers: this.headers });
  }
}