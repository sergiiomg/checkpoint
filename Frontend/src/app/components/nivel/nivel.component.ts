import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-nivel',
  templateUrl: './nivel.component.html',
  styleUrls: ['./nivel.component.scss']
})
export class NivelComponent implements OnInit {
  nivelActual: number = 0;
  nivelSiguiente: number = 0;
  experienciaActual: number = 0;
  experienciaSiguiente: number = 0;
  porcentaje: number = 0;
  cargando: boolean = true;

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.obtenerDatosNivel();
  }

  obtenerDatosNivel(): void {
    this.usuariosService.obtenerNivelUsuario().subscribe({
      next: (data) => {
        console.log('🎯 Datos recibidos del backend:', data);
        this.nivelActual = data.nivel_actual;
        this.nivelSiguiente = data.nivel_siguiente;
        this.experienciaActual = data.experiencia_actual;
        this.experienciaSiguiente = data.experiencia_siguiente_nivel;
        this.porcentaje = Math.floor((this.experienciaActual / this.experienciaSiguiente) * 100);
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar nivel:', error);
        this.cargando = false;
      }
    });
  }
}
