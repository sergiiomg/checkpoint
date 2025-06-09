import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Mote {
  id: number;
  nombre: string;
  nivel_minimo: number;
  descripcion: string;
  desbloqueado: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = 'http://localhost:8080/api/';

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders();
    this.headers = this.headers.set('content-type', 'application/json')
                               .set('Authorization', "Bearer " + localStorage.getItem('token')!);
   }

  private headers: HttpHeaders;

  // Obtener el perfil del usuario logueado
  obtenerPerfil(): Observable<any> {
    // if (typeof window !== 'undefined') {
    //   const token = localStorage.getItem('auth_token'); // Asegúrate de usar la misma clave que en el interceptor
    //   console.log('Token en PerfilService:', token ? 'Presente' : 'No encontrado');
    // }

    return this.http.get(`${this.apiUrl}perfil`, {'headers': this.headers}).pipe(
      tap(response => console.log('Perfil obtenido:', response))
    );
  }

  // Obtener perfil de un usuario específico por ID
  obtenerUsuarioPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}auth/usuarios/${id}`);
  }

  editarPerfil(formData: FormData): Observable<any> {
    // Validar que el FormData contiene datos
    console.log('Datos a enviar:');
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    formData.forEach((value, key) => {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    });
    
    return this.http.patch(`${this.apiUrl}perfil/editar`, formData, {headers});
  }

  obtenerPublicacionesDeUsuario(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}auth/usuarios/${id}/publicaciones`, { headers: this.headers });
  }

  obtenerSeguidores(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}auth/usuarios/${id}/seguidores`, { headers: this.headers });
  }
  
  obtenerSeguidos(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}auth/usuarios/${id}/siguiendo`, { headers: this.headers });
  }

  estoySiguiendo(id: number): Observable<{ siguiendo: boolean }> {
    return this.http.get<{ siguiendo: boolean }>(`${this.apiUrl}usuarios/${id}/siguiendo/yo`);
  }

  seguirUsuario(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}usuarios/${id}/seguir`, {});
  }

  dejarDeSeguir(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}usuarios/${id}/seguir`);
  }
  
  seleccionarMote(id: number) {
    return this.http.post<{ message: string; mote_actual: string }>(`${this.apiUrl}motes-seleccionar/${id}`, {});
   }

   getMotes() {
    return this.http.get<any[]>(`${this.apiUrl}motes`);
  }
}