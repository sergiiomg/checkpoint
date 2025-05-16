import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  nombre_usuario: string = '';
  contrasena: string = '';
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    // Verificar que hemos completado los campos
    if (!this.nombre_usuario || !this.contrasena) {
      this.error = "Por favor completa todos los campos";
      return;
    }

    this.error = null;
    console.log('⌛ Intentando iniciar sesión con:', this.nombre_usuario);
    
    this.authService.loginUsuario(this.nombre_usuario, this.contrasena).subscribe({
      next: (respuesta) => {
        console.log('✅ Usuario autenticado, has iniciado sesión!');
        
        // Verificar que el token existe antes de navegar
        const token = localStorage.getItem('token');
        console.log('Token almacenado después del login:', token ? 'Presente' : 'No encontrado');
        
        this.router.navigate(['/perfil']);
      },
      error: (error) => {
        console.error('❌ Error al iniciar sesión:', error);
        this.error = error.error?.mensaje || 'Error al iniciar sesión. Verifica tus credenciales.';
      }
    });
  }
}