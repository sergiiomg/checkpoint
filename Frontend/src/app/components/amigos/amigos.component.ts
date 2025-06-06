import { Component, OnInit } from '@angular/core';
import { AmigosService, Amigo } from '../../services/amigos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-amigos',
  templateUrl: './amigos.component.html',
  styleUrl: './amigos.component.css'
})
export class AmigosComponent implements OnInit {
  amigos: Amigo[] = [];
  cargando: boolean = true;
  error: string | null = null;

  constructor(
    private amigosService: AmigosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.amigosService.obtenerAmigos().subscribe({
      next: (datos) => {
        this.amigos = datos;
        this.cargando = false;
      },
      error: (err) => {
        console.error('❌ Error al obtener amigos:', err);
        this.error = 'No se pudieron cargar los amigos.';
        this.cargando = false;
      }
    });
  }

  verPerfil(id: number): void {
    this.router.navigate(['/usuarios', id]);
  }
}
