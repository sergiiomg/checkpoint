import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../../services/perfil.service';

@Component({
  selector: 'app-perfil-page',
  templateUrl: './perfil-page.component.html',
  styleUrl: './perfil-page.component.css'
})
export class PerfilPageComponent implements OnInit {
  usuario: any = null;
  cargando: boolean = true;
  error: string | null = null;

  constructor(private perfilService: PerfilService) {}

  ngOnInit(): void {
    this.cargarPerfil();
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