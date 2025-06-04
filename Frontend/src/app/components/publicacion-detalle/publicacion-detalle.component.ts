import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicacionesService, Publicacion } from '../../services/publicaciones.service';
import { ComentariosService } from '../../services/comentarios.service';

@Component({
  selector: 'app-publicacion-detalle',
  templateUrl: './publicacion-detalle.component.html',
  styleUrls: ['./publicacion-detalle.component.css']
})
export class PublicacionDetalleComponent implements OnInit {
  publicacion: Publicacion | null = null;
  comentarios: any[] = [];
  cargando: boolean = true;
  error: string | null = null;
  nuevoComentario: string = '';
  comentarioEnviado: boolean = false;
  formularioVisible = false;

  constructor(
    private route: ActivatedRoute,
    public publicacionesService: PublicacionesService,
    private comentariosService: ComentariosService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.error = 'ID de publicación inválido';
      return;
    }

    this.cargarPublicacion(id);
    this.cargarComentarios(id);
  }

  cargarPublicacion(id: number): void {
    this.publicacionesService.getPublicacionPorId(id).subscribe({
      next: (data) => {
        this.publicacion = data;
        this.cargando = false;
        console.log('✅ Publicación cargada:', data);
      },
      error: (err) => {
        this.error = 'Error al cargar la publicación';
        this.cargando = false;
        console.error('❌', err);
      }
    });
  }

  cargarComentarios(id: number): void {
    this.comentariosService.getComentariosPorPublicacion(id).subscribe({
      next: (data) => {
        this.comentarios = data;
        console.log('💬 Comentarios:', data);
      },
      error: (err) => {
        console.error('❌ Error al cargar comentarios:', err);
      }
    });
  }

  enviarComentario() {
    if (!this.nuevoComentario.trim()) return;
  
    this.comentariosService.crearComentario(this.publicacion!.id, this.nuevoComentario).subscribe({
      next: (comentarioCreado) => {
        this.comentarios.unshift(comentarioCreado); // lo pones arriba
        this.nuevoComentario = '';
        this.formularioVisible = false;
      },
      error: (err) => console.error('❌ Error al enviar comentario:', err)
    });
  }

  toggleFormularioComentario() {
    this.formularioVisible = !this.formularioVisible;
  }
}
