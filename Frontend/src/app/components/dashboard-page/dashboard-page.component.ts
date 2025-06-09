import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { PublicacionesService, Publicacion } from '../../services/publicaciones.service';
import { UsuariosService } from '../../services/usuarios.service';
import { isPlatformBrowser } from '@angular/common';
import { ComentariosService } from '../../services/comentarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent implements OnInit {
  publicaciones: Publicacion[] = [];
  publicacionComentandoId: number | null = null;
  nuevoComentario: string = '';
  usuarioActualId: number = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public publicacionesService: PublicacionesService,
    private usuariosService: UsuariosService,
    private comentariosService: ComentariosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuarioActualId = this.usuariosService.getUsuarioActualId() ?? 0;
    if (isPlatformBrowser(this.platformId)) {
      this.publicacionesService.getPublicaciones().subscribe({
        next: (data) => {
          this.publicaciones = data;
          this.verificarGuardadasUsuario();
        },
        error: (err) => {
          console.error('❌ Error cargando publicaciones:', err);
        }
      });
    } else {
      console.log('🧠 Renderizando en el servidor: no se carga publicaciones todavía');
    }
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

  getMediaUrl(mediaUrl: string | null): string | null {
    const result = this.publicacionesService.getFullMediaUrl(mediaUrl);
    return result;
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
