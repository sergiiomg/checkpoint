import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent {
  query: string = '';

  constructor(private router: Router) {}

  redirigirABuscador() {
    if (this.query.trim()) {
      this.router.navigate(['/buscar'], { queryParams: { q: this.query.trim() } });
    }
  }
}
