import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PerfilService } from '../../services/perfil.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent {
  query: string = '';
  usuario: any = null;
  cargando: boolean = true;
  error: string | null = null;

  constructor(
    private perfilService: PerfilService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  redirigirABuscador() {
    if (this.query.trim()) {
      this.router.navigate(['/buscar'], { queryParams: { q: this.query.trim() } });
    }
  }

  cargarPerfil(): void {
    this.cargando = true;
    this.perfilService.obtenerPerfil().subscribe({
      next: (data) => {
        this.usuario = data;
        this.cargando = false;
        console.log('✅ Perfil cargado:', this.usuario);
      },
      error: (err) => {
        this.error = 'Error al cargar el perfil';
        this.cargando = false;
        console.error('❌ Error al cargar el perfil:', err);
      }
    });
  }
}
