import { Component, OnInit } from '@angular/core';
import { LogrosService, Logro } from '../../services/logros.service';

@Component({
  selector: 'app-logros',
  templateUrl: './logros.component.html',
  styleUrl: './logros.component.css'
})
export class LogrosComponent implements OnInit {
  logros: Logro[] = [];
  error: boolean = false;

  constructor(private logrosService: LogrosService) {}

  ngOnInit(): void {
    this.logrosService.obtenerLogros().subscribe({
      next: (data) => this.logros = data,
      error: (err) => {
        console.error('❌ Error al cargar logros:', err);
        this.error = true;
      }
    });
  }
}
