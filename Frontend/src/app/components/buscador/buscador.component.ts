import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit {
  query: string = '';
  usuarios: any[] = [];
  cargando = false;

  constructor(
    private route: ActivatedRoute,
    private usuariosService: UsuariosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = params['q'] || '';
      if (this.query.trim()) {
        this.buscar();
      }
    });
  }

  buscar(): void {
    this.cargando = true;
    this.usuariosService.buscarUsuarios(this.query).subscribe({
      next: (res) => {
        this.usuarios = res;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al buscar usuarios:', err);
        this.usuarios = [];
        this.cargando = false;
      }
    });
  }

  verPerfil(id: number): void {
    this.router.navigate(['/usuarios', id]);
  }
}
