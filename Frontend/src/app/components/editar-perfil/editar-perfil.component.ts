import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PerfilService } from '../../services/perfil.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrl: './editar-perfil.component.css'
})
export class EditarPerfilComponent implements OnInit {
  formulario: FormGroup;
  foto_perfil?: File;
  banner?: File;
  cargando = false;
  mensaje: string | null = null;
  error: string | null = null;
  
  // Para previsualizar las imágenes
  fotoPreviewUrl: string | null = null;
  bannerPreviewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private perfilService: PerfilService,
    private router: Router
  ) {
    this.formulario = this.fb.group({
      nombre: [''] // Usamos 'nombre' para mantener compatibilidad con el HTML actual
    });
  }

  ngOnInit(): void {
    // Resetear el formulario y las previsualizaciones al iniciar
    this.resetForm();
    
    this.perfilService.obtenerPerfil().subscribe({
      next: (perfil) => {
        this.formulario.patchValue({
          nombre: perfil.nombre_usuario // Usamos 'nombre' en el formulario pero 'nombre_usuario' en el backend
        });
        
        // Guardamos las URLs actuales para mostrarlas
        if (perfil.foto_perfil_url) {
          this.fotoPreviewUrl = perfil.foto_perfil_url;
        }
        
        if (perfil.banner_url) {
          this.bannerPreviewUrl = perfil.banner_url;
        }
      },
      error: (err) => {
        this.error = 'Error al cargar el perfil';
        console.error('Error al cargar perfil:', err);
      }
    });
  }
  
  resetForm(): void {
    this.formulario.reset();
    this.foto_perfil = undefined;
    this.banner = undefined;
    this.fotoPreviewUrl = null;
    this.bannerPreviewUrl = null;
    this.mensaje = null;
    this.error = null;
  }

  onFotoPerfilSeleccionada(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.foto_perfil = event.target.files[0];
      
      // Crear una URL para previsualizar la imagen
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoPreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.foto_perfil!);
    }
  }
  
  onBannerSeleccionado(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.banner = event.target.files[0];
      
      // Crear una URL para previsualizar la imagen
      const reader = new FileReader();
      reader.onload = () => {
        this.bannerPreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.banner!);
    }
  }

  guardarCambios(): void {
    this.cargando = true;
    this.mensaje = null;
    this.error = null;
    
    if (!this.formulario.valid) {
      this.error = 'El formulario no es válido';
      this.cargando = false;
      return;
    }
  
    const formData = new FormData();
    const nombreUsuario = this.formulario.get('nombre')?.value;
    if (nombreUsuario) {
      formData.append('nombre_usuario', nombreUsuario); // Convertimos de 'nombre' a 'nombre_usuario' al enviar
    }
  
    if (this.foto_perfil) {
      formData.append('foto_perfil', this.foto_perfil);
    }
  
    if (this.banner) {
      formData.append('banner', this.banner);
    }
    
    // Verificar si hay cambios para enviar
    if (nombreUsuario || this.foto_perfil || this.banner) {
      this.perfilService.editarPerfil(formData).subscribe({
        next: (res) => {
          console.log('Perfil actualizado', res);
          this.mensaje = 'Perfil actualizado correctamente';
          this.cargando = false;
          
          // Esperar un segundo y luego redirigir a la página de perfil
          setTimeout(() => {
            this.router.navigate(['/perfil']);
          }, 1000);
        },
        error: (err) => {
          console.error('Error en la petición HTTP:', err);
          this.error = `Error al actualizar el perfil: ${err.error?.detalle || err.message || 'Error desconocido'}`;
          this.cargando = false;
        }
      });
    } else {
      this.error = 'No hay cambios para aplicar';
      this.cargando = false;
    }
  }
  
  // Método para cancelar y volver al perfil
  cancelar(): void {
    this.router.navigate(['/perfil']);
  }
}