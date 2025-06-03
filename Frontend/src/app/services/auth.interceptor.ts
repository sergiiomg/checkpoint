import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('/api/perfil') || request.url.includes('/api/auth/usuarios')) {
      return next.handle(request);
    }

    console.log(request.url);

    let token: string | null = null;

    // Solo accede a localStorage si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token');
    }

    console.log('AuthInterceptor: Interceptando petición a', request.url);

    if (token) {
      console.log('Token encontrado, añadiendo a la cabecera');
      const authRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });

      return next.handle(authRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 && isPlatformBrowser(this.platformId)) {
            console.log('Error 401: Token no válido o expirado');
            localStorage.removeItem('auth_token');
            this.router.navigate(['/login']);
          }
          console.error('Error en la petición HTTP:', error);
          return throwError(() => error);
        })
      );
    } else {
      console.log('No se encontró token de autenticación');

      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 && !request.url.includes('/login') && isPlatformBrowser(this.platformId)) {
            console.log('Error 401: Acceso no autorizado');
            this.router.navigate(['/login']);
          }
          console.error('Error en la petición HTTP:', error);
          return throwError(() => error);
        })
      );
    }
  }
}
