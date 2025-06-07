import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Mote {
  id: number;
  nombre: string;
  descripcion: string;
  nivel_minimo: number;
  estado: 'Aplicado' | 'Aplicar' | 'Bloqueado';
}

@Injectable({
  providedIn: 'root'
})
export class MotesService {
  private baseUrl = 'http://localhost:8080/api/';

  constructor(private http: HttpClient) {}

  obtenerMotes(): Observable<Mote[]> {
    return this.http.get<Mote[]>(`${this.baseUrl}motes`);
  }

  seleccionarMote(moteId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}seleccionar`, { moteId });
  }
}
