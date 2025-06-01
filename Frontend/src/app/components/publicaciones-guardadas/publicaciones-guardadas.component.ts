import { Component, OnInit } from '@angular/core';
import { Publicacion, PublicacionesGuardadasService } from '../../services/publicaciones-guardadas.service';



@Component({
  selector: 'app-publicaciones-guardadas',
  templateUrl: './publicaciones-guardadas.component.html',
  styleUrls: ['./publicaciones-guardadas.component.scss']
})
export class PublicacionesGuardadasComponent implements OnInit {
  publicaciones: Publicacion[] = [];

  constructor(private publicacionesGuardadasService: PublicacionesGuardadasService) {}

  ngOnInit(): void {
    this.obtenerGuardadas();
  }

  obtenerGuardadas(): void {
    this.publicacionesGuardadasService.obtenerGuardadas()
      .subscribe({
        next: (data) => this.publicaciones = data,
        error: (err) => console.error('Error al obtener guardadas:', err)
      });
  }

  getMediaUrl(path: string): string {
    return `http://localhost:8080${path}`;
  }

  toggleLike(p: Publicacion): void {
    this.publicacionesGuardadasService.toggleLike(p.id)
      .subscribe(() => {
        p.liked = !p.liked;
        p.likesCount = (p.likesCount || 0) + (p.liked ? 1 : -1);
      });
  }

  toggleGuardado(p: Publicacion): void {
    this.publicacionesGuardadasService.toggleGuardado(p.id)
      .subscribe(() => {
        this.publicaciones = this.publicaciones.filter(pub => pub.id !== p.id);
      });
  }
}
