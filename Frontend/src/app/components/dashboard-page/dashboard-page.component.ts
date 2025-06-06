import { Component, OnInit, Inject, PLATFORM_ID  } from '@angular/core';
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

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public publicacionesService: PublicacionesService,
    private usuariosService: UsuariosService,
    private comentariosService: ComentariosService,
    private router: Router
  ) {}

  ngOnInit(): void {
  if (isPlatformBrowser(this.platformId)) {
    this.publicacionesService.getPublicaciones().subscribe({
      next: (data) => {
        console.log('🔄 Publicaciones recibidas:', data);
        
        data.forEach((pub, index) => {
          console.log(`📄 Publicación ${index + 1}:`, {
            id: pub.id,
            titulo: pub.titulo,
            media_url: pub.media_url,
            tipo_media: pub.tipo_media,
            liked: pub.liked,
            fullUrl: this.getMediaUrl(pub.media_url)
          });
        });
        console.log('✅ Publicaciones recibidas:', this.publicaciones[0]);
        this.publicaciones = data;
        this.verificarLikesUsuario();
      },
      error: (err) => {
        console.error('❌ Error cargando publicaciones:', err);
      }
    });
  } else {
    console.log('🧠 Renderizando en el servidor: no se carga publicaciones todavía');
  }
}

  verificarLikesUsuario() {
    if (this.publicaciones.length === 0) return;
    
    const publicacionIds = this.publicaciones.map(p => p.id);
    
    this.publicacionesService.verificarMultiplesLikes(publicacionIds).subscribe(
      response => {
        this.publicaciones.forEach(publicacion => {
          publicacion.liked = response.likes[publicacion.id] || false;
        });
      },
      error => {
        console.error('Error al verificar likes:', error);
      }
    );
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
        this.publicacionComentandoId = null; // Cierra el formulario
        // (opcional) podrías recargar comentarios aquí si los muestras debajo
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