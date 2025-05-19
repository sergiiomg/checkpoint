import { Injectable } from '@angular/core';
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

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Obtenemos el token del localStorage
    const token = localStorage.getItem('auth_token'); // Asegúrate de usar la clave correcta
    console.log('AuthInterceptor: Interceptando petición a', request.url);
    
    // Si existe un token, lo añadimos a las cabeceras
    if (token) {
      console.log('Token encontrado, añadiendo a la cabecera');
      const authRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });
      
      // Continuamos con la petición modificada
      return next.handle(authRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          // Si es un error de autenticación (401), redirigimos al login
          if (error.status === 401) {
            console.log('Error 401: Token no válido o expirado');
            localStorage.removeItem('auth_token'); // Eliminamos el token inválido
            this.router.navigate(['/login']);
          }
          console.error('Error en la petición HTTP:', error);
          return throwError(() => error);
        })
      );
    } else {
      console.log('No se encontró token de autenticación');
      // Si no hay token y la ruta requiere autenticación, podríamos redirigir aquí
      // Pero dejamos que sea el backend quien devuelva 401 para no interferir con rutas públicas
      
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 && !request.url.includes('/login')) {
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