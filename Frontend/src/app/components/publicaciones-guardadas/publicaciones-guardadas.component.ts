import { Component, OnInit } from '@angular/core';
import { PublicacionesService, Publicacion } from '../../services/publicaciones.service';
import { Router } from '@angular/router';
import { ComentariosService } from '../../services/comentarios.service';

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
    private comentariosService: ComentariosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPublicacionesGuardadas();
  }

  cargarPublicacionesGuardadas(): void {
    this.publicacionesService.obtenerPublicacionesGuardadas().subscribe({
      next: (data: Publicacion[]) => {
        this.publicacionesGuardadas = data.map(pub => ({
          ...pub,
          guardada: true
        }));
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
  
  toggleGuardar(pub: Publicacion) {
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
  
  toggleFormularioComentario(publicacionId: number): void {
    if (this.publicacionComentandoId === publicacionId) {
      this.publicacionComentandoId = null;
    } else {
      this.publicacionComentandoId = publicacionId;
    }
  }
  
  enviarComentario(publicacionId: number) {
    if (!this.nuevoComentario.trim()) return;
  
    // Esto requiere que tengas ComentariosService también importado e inyectado
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

}
