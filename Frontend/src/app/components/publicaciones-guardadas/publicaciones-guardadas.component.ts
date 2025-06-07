import { Component, OnInit } from '@angular/core';
import { PublicacionesService, Publicacion } from '../../services/publicaciones.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-publicaciones-guardadas',
  templateUrl: './publicaciones-guardadas.component.html',
  styleUrls: ['./publicaciones-guardadas.component.css']
})
export class PublicacionesGuardadasComponent implements OnInit {
  publicacionesGuardadas: Publicacion[] = [];
  publicaciones: Publicacion[] = [];
  publicacionComentandoId: number | null = null;
  nuevoComentario: string = '';


  constructor(
    private publicacionesService: PublicacionesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPublicacionesGuardadas();
  }

  cargarPublicacionesGuardadas(): void {
    this.publicacionesService.obtenerPublicacionesGuardadas().subscribe({
      next: (data: Publicacion[]) => {
        this.publicacionesGuardadas = data;
      },
      error: (err) => {
        console.error('❌ Error cargando publicaciones guardadas:', err);
      }
    });
  }

  getMediaUrl(mediaUrl: string | null): string | null {
    return this.publicacionesService.getFullMediaUrl(mediaUrl);
  }

  verDetalle(id: number): void {
    this.router.navigate(['/publicacion', id]);
  }
}
