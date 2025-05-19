import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = 'http://localhost:8080/api/';

  constructor(private http: HttpClient) { }

  // Obtener el perfil del usuario logueado
  obtenerPerfil(): Observable<any> {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token'); // Asegúrate de usar la misma clave que en el interceptor
      console.log('Token en PerfilService:', token ? 'Presente' : 'No encontrado');
    }

    return this.http.get(`${this.apiUrl}perfil`).pipe(
      tap(response => console.log('Perfil obtenido:', response))
    );
  }

  // Obtener perfil de un usuario específico por ID
  obtenerUsuarioPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}usuarios/${id}`);
  }

  editarPerfil(formData: FormData): Observable<any> {
    // Validar que el FormData contiene datos
    console.log('Datos a enviar:');
    formData.forEach((value, key) => {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    });
    
    return this.http.patch(`${this.apiUrl}perfil`, formData);
  }
}