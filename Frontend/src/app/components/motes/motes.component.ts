import { Component, OnInit } from '@angular/core';
import { MotesService, Mote } from '../../services/motes.service';

@Component({
  selector: 'app-motes',
  templateUrl: './motes.component.html',
  styleUrls: ['./motes.component.css']
})
export class MotesComponent implements OnInit {
  motes: Mote[] = [];
  cargando = false;
  error: string | null = null;

  constructor(private motesService: MotesService) {}

  ngOnInit(): void {
    this.cargarMotes();
  }

  cargarMotes() {
    this.cargando = true;
    this.error = null;
    this.motesService.obtenerMotes().subscribe({
      next: (data) => {
        this.motes = data;
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar los motes.';
        this.cargando = false;
      }
    });
  }

  aplicarMote(mote: Mote) {
    if (mote.estado !== 'Aplicar') return;

    this.motesService.seleccionarMote(mote.id).subscribe({
      next: () => {
        this.cargarMotes();
      },
      error: () => {
        this.error = 'No se pudo aplicar el mote.';
      }
    });
  }
}
