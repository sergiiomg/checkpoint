import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PerfilService } from '../../services/perfil.service';
import { PublicacionesService, Publicacion } from '../../services/publicaciones.service';
import { PublicacionesGuardadasService } from '../../services/publicaciones-guardadas.service';

@Component({
  selector: 'app-perfil-user',
  templateUrl: './perfil-user.component.html',
  styleUrls: ['./perfil-user.component.css']
})
export class PerfilUserComponent implements OnInit {
  usuario: any = null;
  publicaciones: Publicacion[] = [];
  seguidoresCount = 0;
  seguidosCount = 0;
  error: string | null = null;
  
  @Input() usuarioId?: number; // puede venir de afuera

  siguiendo: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private perfilService: PerfilService,
    private publicacionesService: PublicacionesService,
    private publicacionesGuardadasService: PublicacionesGuardadasService
  ) {}

  ngOnInit(): void {
    // Prioridad a usuarioId recibido por Input, si no existe, tomar de ruta
    const id = this.usuarioId ?? Number(this.route.snapshot.paramMap.get('id'));
    console.log('📦 ID del usuario desde ruta:', id);

    if (id) {
      this.usuarioId = id;
      this.cargarDatosUsuario(id);
      this.cargarPublicaciones(id);
      this.cargarSeguidoresYSeguidos(id);
      this.cargarEstadoSeguimiento(id);
    } else {
      this.error = 'ID de usuario no válido';
    }
  }

  cargarDatosUsuario(id: number) {
    console.log('🔍 Cargando perfil del usuario con ID:', id);

    this.perfilService.obtenerUsuarioPorId(id).subscribe({
      next: user => {
        console.log('✅ Usuario cargado:', user);
        this.usuario = user;
      },
      error: err => {
        console.error('❌ Error al obtener el usuario:', err);
        this.error = 'No se pudo cargar el usuario';
      }
    });
  }

  cargarPublicaciones(id: number) {
    this.perfilService.obtenerPublicacionesDeUsuario(id).subscribe({
      next: posts => this.publicaciones = posts,
      error: () => this.error = 'No se pudieron cargar las publicaciones'
    });
  }

  cargarSeguidoresYSeguidos(id: number) {
    this.perfilService.obtenerSeguidores(id).subscribe({
      next: data => this.seguidoresCount = data.length,
      error: err => console.error('Error al obtener seguidores:', err)
    });

    this.perfilService.obtenerSeguidos(id).subscribe({
      next: data => this.seguidosCount = data.length,
      error: err => console.error('Error al obtener seguidos:', err)
    });
  }

  cargarEstadoSeguimiento(id: number) {
    this.perfilService.estoySiguiendo(id).subscribe({
      next: data => this.siguiendo = data.siguiendo,
      error: () => this.siguiendo = false
    });
  }

  toggleSeguir() {
    const accion = this.siguiendo
      ? this.perfilService.dejarDeSeguir(this.usuarioId!)
      : this.perfilService.seguirUsuario(this.usuarioId!);

    accion.subscribe({
      next: () => {
        this.siguiendo = !this.siguiendo;
        // Actualizar contadores de seguidores localmente
        this.seguidoresCount += this.siguiendo ? 1 : -1;
      },
      error: (err) => alert(err.error?.error || 'Error al cambiar estado de seguimiento')
    });
  }

  isGuardada(publicacion: Publicacion): boolean {
    return publicacion.guardada === true;
  }

  toggleGuardado(publicacion: Publicacion) {
    this.publicacionesGuardadasService.toggleGuardado(publicacion.id).subscribe({
      next: () => {
        publicacion.guardada = !this.isGuardada(publicacion);
      },
      error: (err) => console.error('Error al togglear guardado:', err)
    });
  }

  getMediaUrl(mediaUrl: string | null): string | null {
    return this.publicacionesService.getFullMediaUrl(mediaUrl);
  }
}
