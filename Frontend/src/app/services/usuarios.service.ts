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

  private apiUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient) { }

  registrarUsuario(usuario: UsuarioRegistro): Observable<any> {
    return this.http.post(this.apiUrl + 'usuarios', usuario);
  }

  loginUsuario(nombre_usuario: string, contrasena: string) {
  return this.http.post(this.apiUrl + 'login', {
    nombre_usuario,
    contrasena
  });
}
}
