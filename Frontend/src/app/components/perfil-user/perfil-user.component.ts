import { ActivatedRoute } from '@angular/router';
import { PerfilService } from '../../services/perfil.service';
import { PublicacionesService, Publicacion } from '../../services/publicaciones.service';
import { PublicacionesGuardadasService } from '../../services/publicaciones-guardadas.service';
import { Component, OnInit, Inject, PLATFORM_ID, Input } from '@angular/core';
import { PerfilEventsService } from '../../services/perfil-event.service';
import { isPlatformBrowser } from '@angular/common';
import { ComentariosService } from '../../services/comentarios.service';
import { Router } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';

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
  cargando: boolean = true;
  publicacionComentandoId: number | null = null;
  nuevoComentario: string = '';
  usuarioActualId: number = 0;
  
  @Input() usuarioId?: number; // puede venir de afuera

  siguiendo: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private perfilService: PerfilService,
    private publicacionesService: PublicacionesService,
    private perfilEventsService: PerfilEventsService,
    private usuariosService: UsuariosService,
    private comentariosService: ComentariosService,
    private publicacionesGuardadasService: PublicacionesGuardadasService,
    private router: Router
  ) {}

  ngOnInit(): void {
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

  getMediaUrl(mediaUrl: string | null): string | null {
    return this.publicacionesService.getFullMediaUrl(mediaUrl);
  }
}
