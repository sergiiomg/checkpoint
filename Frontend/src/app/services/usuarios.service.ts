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

  registrarUsuario(usuario: UsuarioRegistro): Observable<any> {
    return this.http.post(this.apiUrl + 'auth/usuarios', usuario);
  }

  loginUsuario(username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('http://localhost:8080/api/auth/login', {
      nombre_usuario: username,
      contrasena: password
    });
  }

  getUsuarioActualId(): number | null {
  // Por ejemplo: si guardas token con payload o id en localStorage
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
  return usuario?.id || null;
}
}
