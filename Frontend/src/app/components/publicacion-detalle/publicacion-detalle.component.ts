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
    console.log('📍 ID obtenido de la ruta:', id);
    
    if (isNaN(id)) {
      this.error = 'ID de publicación inválido';
      this.cargando = false;
      console.error('❌ ID inválido:', id);
      return;
    }

    this.cargarPublicacion(id);
    this.cargarComentarios(id);
  }

  cargarPublicacion(id: number): void {
    console.log('🔄 Iniciando carga de publicación con ID:', id);
    
    this.publicacionesService.getPublicacionPorId(id).subscribe({
      next: (data) => {
        console.log('✅ Respuesta del servidor:', data);
        console.log('📊 Tipo de dato recibido:', typeof data);
        console.log('🔍 Propiedades del objeto:', Object.keys(data || {}));
        
        this.publicacion = data;
        this.cargando = false;
        
        // Verificar cada campo importante
        console.log('📝 Título:', data?.titulo);
        console.log('📄 Descripción:', data?.descripcion);
        console.log('🖼️ Media URL:', data?.media_url);
        console.log('🎭 Tipo media:', data?.tipo_media);
      },
      error: (err) => {
        console.error('❌ Error completo:', err);
        console.error('📊 Status del error:', err.status);
        console.error('💬 Mensaje del error:', err.message);
        
        this.error = `Error al cargar la publicación: ${err.status || 'Desconocido'}`;
        this.cargando = false;
      }
    });
  }

  cargarComentarios(id: number): void {
    console.log('💬 Cargando comentarios para publicación:', id);
    
    this.comentariosService.getComentariosPorPublicacion(id).subscribe({
      next: (data) => {
        this.comentarios = data;
        console.log('✅ Comentarios cargados:', data.length, 'comentarios');
      },
      error: (err) => {
        console.error('❌ Error al cargar comentarios:', err);
      }
    });
  }

  enviarComentario() {
    if (!this.nuevoComentario.trim()) {
      console.warn('⚠️ Comentario vacío, no se envía');
      return;
    }

    if (!this.publicacion) {
      console.error('❌ No hay publicación cargada');
      return;
    }

    console.log('📝 Enviando comentario:', this.nuevoComentario);
  
    this.comentariosService.crearComentario(this.publicacion.id, this.nuevoComentario).subscribe({
      next: (comentarioCreado) => {
        console.log('✅ Comentario creado:', comentarioCreado);
        this.comentarios.unshift(comentarioCreado);
        this.nuevoComentario = '';
        this.formularioVisible = false;
      },
      error: (err) => {
        console.error('❌ Error al enviar comentario:', err);
      }
    });
  }

  toggleFormularioComentario() {
    this.formularioVisible = !this.formularioVisible;
    console.log('🔄 Formulario visible:', this.formularioVisible);
  }
}