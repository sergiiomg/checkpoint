import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../../services/perfil.service';
import { PerfilEventsService } from '../../services/perfil-event.service';

@Component({
  selector: 'app-motes',
  templateUrl: 'motes.component.html',
  styleUrls: ['motes.component.css']
})
export class MotesPageComponent implements OnInit {
  motes: any[] = [];
  cargando = false;
  error: string | null = null;

  constructor(
      private perfilService: PerfilService,
      private perfilEventsService: PerfilEventsService
    ) {}

  ngOnInit(): void {
    this.cargarMotes();
  }

cargarMotes() {
  this.cargando = true;
  this.perfilService.getMotes().subscribe({
    next: (data) => {
      // Supongamos que tienes el mote actual guardado en algún lado,
      // por ejemplo en el perfil del usuario que cargas en otro servicio.
      // Aquí lo ponemos hardcoded para el ejemplo:
      const moteActual = 'Aprendiz Digital'; // O lo sacas del usuario real

      this.motes = data.map(mote => {
        let estado: 'Aplicado' | 'Aplicar' | 'Bloqueado';

        if (!mote.desbloqueado) {
          estado = 'Bloqueado';
        } else if (mote.nombre === moteActual) {
          estado = 'Aplicado';
        } else {
          estado = 'Aplicar';
        }

        return { ...mote, estado };
      });

      this.cargando = false;
    },
    error: (err) => {
      this.error = '❌ Error al cargar motes';
      this.cargando = false;
      console.error(err);
    }
  });
}


    aplicarMote(mote: any) {
      if (mote.estado !== 'Aplicar') return;
    
      this.perfilService.seleccionarMote(mote.id).subscribe({
        next: (res) => {
          alert('✅ Mote aplicado correctamente');
          this.cargarMotes();
          this.perfilEventsService.emitirMoteCambiado();
        },
        error: (err) => {
          console.error('❌ Error al aplicar mote:', err);
          alert('No se pudo aplicar el mote');
        }
      });
    }
}
