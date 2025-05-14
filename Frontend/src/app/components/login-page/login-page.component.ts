import { Component } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  nombre_usuario: string = '';
  contrasena: string = '';

  constructor(private usuariosService: UsuariosService){

  }

  login(){
    this.usuariosService.loginUsuario(this.nombre_usuario, this.contrasena).subscribe(
      (respuesta) => {
        console.log('✅ Usuario autenticado, has iniciado sesión!:', respuesta);
      },
      (error) => {
        console.error('❌ Error al iniciar sesión:', error);
      }
    )
  }
}
