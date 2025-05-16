import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient) { }

  // Obtener el perfil del usuario logueado
  obtenerPerfil(): Observable<any> {
    console.log('Solicitando perfil desde el PerfilService');
    // Verificar si hay token antes de hacer la petición
    const token = localStorage.getItem('token');
    console.log('Token en PerfilService:', token ? 'Presente' : 'No encontrado');
    
    return this.http.get(`${this.apiUrl}perfil`);
  }

  // Obtener perfil de un usuario específico por ID
  obtenerUsuarioPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}usuarios/${id}`);
  }
}