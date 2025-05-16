import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

// Definir interfaces para los tipos
interface LoginResponse {
  token: string;
  usuario: any;
  [key: string]: any; // Para permitir otras propiedades
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/';
  
  constructor(private http: HttpClient) { }

  loginUsuario(nombre_usuario: string, contrasena: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}auth/login`, {
      nombre_usuario,
      contrasena
    }).pipe(
      tap((respuesta: LoginResponse) => {
        // Guardar el token y usuario en localStorage
        if (respuesta && respuesta.token) {
          console.log('Guardando token en localStorage:', respuesta.token.substring(0, 10) + '...');
          localStorage.setItem('token', respuesta.token);
          
          if (respuesta.usuario) {
            localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
          }
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}