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

  loginUsuario(nombre_usuario: string, contrasena: string) {
    return this.http.post(this.apiUrl + 'auth/login', {
      nombre_usuario,
      contrasena
    });
  }
}
