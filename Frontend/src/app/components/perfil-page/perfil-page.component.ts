import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../../services/perfil.service';
import { PublicacionesService, Publicacion } from '../../services/publicaciones.service';
import { PublicacionesGuardadasService } from '../../services/publicaciones-guardadas.service';

@Component({
  selector: 'app-perfil-page',
  templateUrl: './perfil-page.component.html',
  styleUrl: './perfil-page.component.css'
})
export class PerfilPageComponent implements OnInit {
  usuario: any = null;
  cargando: boolean = true;
  publicaciones: Publicacion[] = [];
  error: string | null = null;

  seguidoresCount: number = 0;
  seguidosCount: number = 0;

  constructor(
    private perfilService: PerfilService,
    public publicacionesService: PublicacionesService,
    private publicacionesGuardadasService: PublicacionesGuardadasService
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.cargando = true;
    this.perfilService.obtenerPerfil().subscribe({
      next: (data) => {
        this.usuario = data;
        this.cargando = false;
        console.log('✅ Perfil cargado:', this.usuario);

        this.cargarPublicaciones(this.usuario.id);
        this.cargarSeguidoresYSeguidos(this.usuario.id);
      },
      error: (err) => {
        this.error = 'Error al cargar el perfil';
        this.cargando = false;
        console.error('❌ Error al cargar el perfil:', err);
      }
    });
  }

  cargarPublicaciones(id: number): void {
    this.perfilService.obtenerPublicacionesDeUsuario(id).subscribe({
      next: (data) => {
        this.publicaciones = data;
        console.log('✅ Publicaciones cargadas:', data);
      },
      error: (err) => {
        console.error('❌ Error al cargar publicaciones:', err);
      }
    });
  }

  toggleLike(publicacion: Publicacion) {
      this.publicacionesService.likePublicacion(publicacion.id).subscribe({
        next: (res) => {
          publicacion.liked = res.liked;
          publicacion.likesCount = res.totalLikes;
        },
        error: (err: any) => {
          console.error('Error al dar me gusta:', err);
        }
      });
    }

  cargarSeguidoresYSeguidos(id: number): void {
    this.perfilService.obtenerSeguidores(id).subscribe({
      next: (data) => this.seguidoresCount = data.length,
      error: (err) => console.error('❌ Error al obtener seguidores:', err)
    });

    this.perfilService.obtenerSeguidos(id).subscribe({
      next: (data) => this.seguidosCount = data.length,
      error: (err) => console.error('❌ Error al obtener seguidos:', err)
    });
  }
  
    isGuardada(publicacion: Publicacion): boolean {
      return publicacion.guardada === true;
    }
  
     toggleGuardado(publicacion: Publicacion) {
      this.publicacionesGuardadasService.toggleGuardado(publicacion.id).subscribe({
        next: (res) => {
          // Cambiar estado guardado localmente para actualizar el icono
          publicacion.guardada = !this.isGuardada(publicacion);
        },
        error: (err) => console.error('Error al togglear guardado:', err)
      });
    }
  
    getMediaUrl(mediaUrl: string | null): string | null {
      const result = this.publicacionesService.getFullMediaUrl(mediaUrl);
      return result;
    }
}