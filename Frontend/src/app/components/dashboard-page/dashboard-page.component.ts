import { Component, OnInit } from '@angular/core';
import { PublicacionesService, Publicacion } from '../../services/publicaciones.service';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent {
  publicaciones: Publicacion[] = [];

  constructor(private publicacionesService: PublicacionesService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    this.publicacionesService.getPublicaciones().subscribe({
      next: (data) => {
        this.publicaciones = data;
      },
      error: (err) => {
        console.error('Error cargando publicaciones:', err);
      }
    });
  }
}
