import { Component, OnInit } from '@angular/core';
import { PublicacionesService, Publicacion } from '../../services/publicaciones.service';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent implements OnInit {
  publicaciones: Publicacion[] = [];

  constructor(
    public publicacionesService: PublicacionesService,
    private usuariosService: UsuariosService
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

  getMediaUrl(mediaUrl: string | null): string | null {
    const result = this.publicacionesService.getFullMediaUrl(mediaUrl);
    console.log(`🔗 getMediaUrl: "${mediaUrl}" → "${result}"`);
    return result;
  }
}