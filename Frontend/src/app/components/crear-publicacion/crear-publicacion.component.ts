import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublicacionesService } from '../../services/publicaciones.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-publicacion',
  templateUrl: './crear-publicacion.component.html',
  styleUrl: './crear-publicacion.component.css'
})
export class CrearPublicacionComponent {
  publicacionForm: FormGroup;

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private publicacionesService: PublicacionesService,
    private router: Router
  ) {
    this.publicacionForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      tipo_media: [''] // opcional y vacío por defecto
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Detectar tipo de archivo automáticamente
      if (file.type.startsWith('image/')) {
        this.publicacionForm.patchValue({ tipo_media: 'imagen' });
      } else if (file.type.startsWith('video/')) {
        this.publicacionForm.patchValue({ tipo_media: 'video' });
      }
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.publicacionForm.patchValue({ tipo_media: '' });
    // Limpiar el input file
    const fileInput = document.getElementById('media_file') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  onSubmit(): void {
    console.log('=== DEBUG: Formulario submitted ===');
    console.log('Form valid:', this.publicacionForm.valid);
    console.log('Form value:', this.publicacionForm.value);
    console.log('Form errors:', this.publicacionForm.errors);
    
    // Marcar todos los campos como touched para mostrar errores
    this.publicacionForm.markAllAsTouched();
    
    if (this.publicacionForm.invalid) {
      console.log('Formulario inválido, no se envía');
      return;
    }

    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    console.log('Usuario desde localStorage:', usuario);

    if (!usuario || !usuario.id) {
      alert('Debes iniciar sesión para publicar');
      return;
    }

    const formData = new FormData();
    formData.append('autor_id', usuario.id.toString());
    formData.append('titulo', this.publicacionForm.value.titulo);
    formData.append('descripcion', this.publicacionForm.value.descripcion);
    
    // Solo añadir multimedia si hay archivo seleccionado
    if (this.selectedFile) {
      formData.append('media', this.selectedFile);
      formData.append('tipo_media', this.publicacionForm.value.tipo_media);
    }
    
    console.log('FormData a enviar:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    this.publicacionesService.crearPublicacion(formData).subscribe({
      next: (response) => {
        console.log('Respuesta exitosa:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error completo:', err);
        alert('Ocurrió un error al crear la publicación.');
      }
    });
  }

  // Método helper para verificar errores específicos
  hasError(field: string, error: string): boolean {
    return this.publicacionForm.get(field)?.hasError(error) && 
           this.publicacionForm.get(field)?.touched || false;
  }
}