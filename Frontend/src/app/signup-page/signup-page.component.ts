import { Component } from '@angular/core';
import { UsuariosService, UsuarioRegistro } from '../services/usuarios.service';

@Component({
  selector: 'signup-page',
  standalone: false,
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.css'
})
export class SignUpComponent {
  nombre_usuario = '';
  email = '';
  contrasena = '';
  
  mensaje = '';
  error = '';

  constructor(private usuariosService: UsuariosService) {}

  registrar() {
    const nuevoUsuario: UsuarioRegistro = {
      nombre_usuario: this.nombre_usuario,
      email: this.email,
      contrasena: this.contrasena
    };

    this.usuariosService.registrarUsuario(nuevoUsuario).subscribe({
      next: (res) => {
        this.mensaje = '¡Usuario registrado con éxito!';
        this.error = '';
      },
      error: (err) => {
        this.error = 'Error al registrar usuario.';
        this.mensaje = '';
      }
    });
  }
}

