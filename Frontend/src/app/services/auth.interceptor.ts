import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('AuthInterceptor: Interceptando petición a', req.url);
    
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      console.log('Token recuperado del localStorage:', token ? 'Presente' : 'No encontrado');
      
      if (token) {
        // Clonar la solicitud y agregar el token a los headers
        const cloned = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('Headers enviados:', cloned.headers.keys());
        console.log('Authorization header:', cloned.headers.get('Authorization'));
        
        // Retornar la solicitud con el manejador de errores
        return next.handle(cloned).pipe(
          catchError((error: HttpErrorResponse) => {
            console.error('Error en la petición HTTP:', error);
            
            // Si el token es inválido (401 o 403)
            if (error.status === 401 || error.status === 403) {
              console.error('Error de autenticación, redirigiendo a login');
              localStorage.removeItem('token');
              localStorage.removeItem('usuario');
              this.router.navigate(['/login']);
            }
            return throwError(() => error);
          })
        );
      } else {
        console.warn('No se encontró token de autenticación');
      }
    }
    
    return next.handle(req);
  }
}