import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilEventsService {
  private moteCambiadoSource = new Subject<void>();
  moteCambiado$ = this.moteCambiadoSource.asObservable();

  emitirMoteCambiado() {
    this.moteCambiadoSource.next();
  }
}
