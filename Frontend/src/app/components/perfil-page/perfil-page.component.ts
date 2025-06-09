import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { PerfilService } from '../../services/perfil.service';
import { PublicacionesService, Publicacion } from '../../services/publicaciones.service';
import { PerfilEventsService } from '../../services/perfil-event.service';
import { isPlatformBrowser } from '@angular/common';
import { ComentariosService } from '../../services/comentarios.service';
import { Router } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';

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

  publicacionComentandoId: number | null = null;
  nuevoComentario: string = '';
  usuarioActualId: number = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private perfilService: PerfilService,
    public publicacionesService: PublicacionesService,
    private perfilEventsService: PerfilEventsService,
    private usuariosService: UsuariosService,
    private comentariosService: ComentariosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuarioActualId = this.usuariosService.getUsuarioActualId() ?? 0;
    this.cargarPerfil();
    this.perfilEventsService.moteCambiado$.subscribe(() => {
      this.cargarPerfil();
    });
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
  
        this.verificarGuardadasUsuario();
        this.verificarLikeadasUsuario();
      },
      error: (err) => {
        console.error('❌ Error al cargar publicaciones:', err);
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
  
    getMediaUrl(mediaUrl: string | null): string | null {
      const result = this.publicacionesService.getFullMediaUrl(mediaUrl);
      return result;
    }

  eliminarPublicacion(pub: Publicacion) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta publicación?')) return;
  
    this.publicacionesService.eliminarPublicacion(pub.id).subscribe({
      next: () => {
        this.publicaciones = this.publicaciones.filter(p => p.id !== pub.id);
        console.log('✅ Publicación eliminada');
      },
      error: (err) => {
        console.error('❌ Error al eliminar publicación:', err);
      }
    });
  }

  verificarLikeadasUsuario() {
    this.publicacionesService.obtenerPublicacionesLikeadas().subscribe(
      likeadas => {
        this.publicaciones.forEach(pub => {
          pub.liked = likeadas.includes(pub.id);
        });
      },
      error => {
        console.error('Error al verificar publicaciones likeadas:', error);
      }
    );
  }

  toggleLike(publicacion: Publicacion): void {
    this.publicacionesService.toggleLike(publicacion.id).subscribe(
      (res) => {
        publicacion.liked = res.liked;
        publicacion.likesCount = res.totalLikes;
      },
      (error) => {
        console.error('Error al dar like:', error);
      }
    );
  }

  verificarGuardadasUsuario() {
    this.publicacionesService.obtenerPublicacionesGuardadas().subscribe(
      guardadas => {
        const guardadasIds = guardadas.map(p => p.id);
        this.publicaciones.forEach(pub => {
          pub.guardada = guardadasIds.includes(pub.id);
        });
      },
      error => {
        console.error('Error al verificar publicaciones guardadas:', error);
      }
    );
  }

  toggleGuardar(pub: any) {
    if (pub.guardada) {
      this.publicacionesService.desguardarPublicacion(pub.id).subscribe(() => {
        pub.guardada = false;
      });
    } else {
      this.publicacionesService.guardarPublicacion(pub.id).subscribe(() => {
        pub.guardada = true;
      });
    }
  }

  irAlPerfil(usuarioId: number) {
    this.router.navigate(['/usuarios', usuarioId]);
  }

  toggleFormularioComentario(publicacionId: number): void {
    if (this.publicacionComentandoId === publicacionId) {
      this.publicacionComentandoId = null;
    } else {
      this.publicacionComentandoId = publicacionId;
    }
  }

  enviarComentario(publicacionId: number) {
    if (!this.nuevoComentario.trim()) return;

    this.comentariosService.crearComentario(publicacionId, this.nuevoComentario).subscribe({
      next: (res) => {
        console.log('✅ Comentario creado:', res);
        this.nuevoComentario = '';
        this.publicacionComentandoId = null;
      },
      error: (err) => {
        console.error('❌ Error al enviar comentario:', err);
      }
    });
  }

  verDetalle(id: number) {
    this.router.navigate(['/publicacion', id]);
  }
}