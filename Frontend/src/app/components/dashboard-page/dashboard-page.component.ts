import { Component, OnInit } from '@angular/core';
import { PublicacionesService, Publicacion } from '../../services/publicaciones.service';
import { UsuariosService } from '../../services/usuarios.service';
import { PublicacionesGuardadasService } from '../../services/publicaciones-guardadas.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent implements OnInit {
  publicaciones: Publicacion[] = [];

  constructor(
    public publicacionesService: PublicacionesService,
    private usuariosService: UsuariosService,
    private publicacionesGuardadasService: PublicacionesGuardadasService
  ) {}

  ngOnInit(): void {
    this.publicacionesService.getPublicaciones().subscribe({
      next: (data) => {
        console.log('🔄 Publicaciones recibidas:', data);
        
        // Debug: mostrar cada publicación con su media_url
        data.forEach((pub, index) => {
          console.log(`📄 Publicación ${index + 1}:`, {
            id: pub.id,
            titulo: pub.titulo,
            media_url: pub.media_url,
            tipo_media: pub.tipo_media,
            fullUrl: this.getMediaUrl(pub.media_url)
          });
        });
        
        this.publicaciones = data;
      },
      error: (err) => {
        console.error('❌ Error cargando publicaciones:', err);
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