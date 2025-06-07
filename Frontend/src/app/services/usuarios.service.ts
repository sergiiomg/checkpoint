import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface UsuarioRegistro {
  nombre_usuario: string;
  email: string;
  contrasena: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiUrl = 'http://localhost:8080/api/';

  constructor(private http: HttpClient) { }

  registrarUsuario(usuario: UsuarioRegistro): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('http://localhost:8080/api/auth/usuarios', usuario);
  }

  loginUsuario(username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('http://localhost:8080/api/auth/login', {
      nombre_usuario: username,
      contrasena: password
    });
  }

  getUsuarioActualId(): number | null {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    return usuario?.id || null;
  }
}
