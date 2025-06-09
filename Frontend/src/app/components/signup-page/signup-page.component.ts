import { Component } from '@angular/core';
import { UsuariosService, UsuarioRegistro } from '../../services/usuarios.service';
import { Router } from '@angular/router';

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

  constructor(
    private usuariosService: UsuariosService,
    private router: Router
  ) {}

  registrar() {
    const nuevoUsuario: UsuarioRegistro = {
      nombre_usuario: this.nombre_usuario,
      email: this.email,
      contrasena: this.contrasena
    };

    this.usuariosService.registrarUsuario(nuevoUsuario).subscribe({
      next: (respuesta) => {
        console.log('✅ Usuario autenticado, has iniciado sesión!');
        localStorage.setItem('token', respuesta.token);
  
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = 'Error al registrar usuario.';
        this.mensaje = '';
      }
    });
  }
}

