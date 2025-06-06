import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders();
    this.headers = this.headers.set('content-type', 'application/json')
                               .set('Authorization', "Bearer " + localStorage.getItem('token')!);
  }

  private headers: HttpHeaders;

  obtenerLogros(): Observable<Logro[]> {
    return this.http.get<Logro[]>(`${this.apiUrl}logros`, { headers: this.headers });
  }
}
