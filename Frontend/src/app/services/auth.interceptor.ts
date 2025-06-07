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
    // Si no estamos en el navegador, continuar sin modificar
    if (!isPlatformBrowser(this.platformId)) {
      return next.handle(request);
    }

    console.log('Interceptando petición a:', request.url);

    const excludedUrls = ['/api/perfil', '/api/auth/usuarios', '/login'];
    if (excludedUrls.some(url => request.url.includes(url))) {
      return next.handle(request);
    }

    const token = localStorage.getItem('token'); // Usa siempre la misma clave

    if (token) {
      console.log('✅ Token encontrado, añadiendo a la cabecera');
      const authRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });

      return next.handle(authRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.log('⚠️ Token no válido o expirado, redirigiendo al login');
            localStorage.removeItem('token');
            this.router.navigate(['/login']);
          }
          console.error('❌ Error en la petición HTTP:', error);
          return throwError(() => error);
        })
      );
    } else {
      console.warn('⚠️ No se encontró token de autenticación');

      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.log('⚠️ Acceso no autorizado, redirigiendo al login');
            this.router.navigate(['/login']);
          }
          console.error('❌ Error en la petición HTTP:', error);
          return throwError(() => error);
        })
      );
    }
  }
}
