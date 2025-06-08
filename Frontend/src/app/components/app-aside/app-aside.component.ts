import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aside',
  templateUrl: './app-aside.component.html',
  styleUrls: ['./app-aside.component.css']
})
export class AppAsideComponent implements OnInit {
  isAuthenticated = false;
  user: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.checkAuthentication();
  }

  checkAuthentication(): void {
    this.authService.checkAuth().subscribe({
      next: (res) => {
        this.isAuthenticated = true;
        this.user = res.user;
      },
      error: () => {
        this.isAuthenticated = false;
        this.user = null;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
    this.user = null;
    this.router.navigate(['/login']);
  }
}
