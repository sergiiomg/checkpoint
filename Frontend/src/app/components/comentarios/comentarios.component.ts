import { Component, Input } from '@angular/core';
import { ComentariosService } from '../../services/comentarios.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html'
})
export class ComentariosComponent {
  @Input() publicacionId!: number;
  comentarios: any[] = [];
  nuevoComentario: string = '';
  error: string | null = null;

  constructor(private comentariosService: ComentariosService) {}

  ngOnInit() {
    this.cargarComentarios();
  }

  cargarComentarios() {
    this.comentariosService.obtenerComentarios(this.publicacionId).subscribe({
      next: (data) => {
        this.comentarios = data;
      },
      error: (err) => {
        console.error('Error al obtener comentarios:', err);
      }
    });
  }

  enviarComentario() {
    if (!this.nuevoComentario.trim()) return;

    this.comentariosService.crearComentario(this.publicacionId, this.nuevoComentario).subscribe({
      next: (comentarioCreado) => {
        this.comentarios.push(comentarioCreado); // O recargar si prefieres
        this.nuevoComentario = '';
      },
      error: (err) => {
        console.error('Error al crear comentario:', err);
        this.error = 'No se pudo enviar el comentario.';
      }
    });
  }
}
