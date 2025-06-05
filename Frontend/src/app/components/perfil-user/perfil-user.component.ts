// perfil-user.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PerfilService } from '../../services/perfil.service';
import { PublicacionesService } from '../../services/publicaciones.service';
import { Publicacion } from '../../services/publicaciones.service';
import { PublicacionesGuardadasService } from '../../services/publicaciones-guardadas.service';

@Component({
  selector: 'app-perfil-user',
  templateUrl: './perfil-user.component.html',
  styleUrls: ['./perfil-user.component.css']
})
export class PerfilUserComponent implements OnInit {
  usuario: any = null;
  publicaciones: any[] = [];
  estaSiguiendo: boolean = false;
  seguidoresCount = 0;
  seguidosCount = 0;
  publicacion: Publicacion[] = []
  error: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private perfilService: PerfilService,
    private publicacionesService: PublicacionesService,
    private publicacionesGuardadasService: PublicacionesGuardadasService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.perfilService.obtenerUsuarioPorId(id).subscribe(user => this.usuario = user);
      this.perfilService.obtenerPublicacionesDeUsuario(id).subscribe(posts => this.publicaciones = posts);
      this.perfilService.obtenerSeguidores(id).subscribe(followers => this.seguidoresCount = followers.length);
      this.perfilService.obtenerSeguidos(id).subscribe(following => this.seguidosCount = following.length);
      this.perfilService.comprobarSiSigo(id).subscribe(res => this.estaSiguiendo = res.sigue);
    }
  }

  seguir(): void {
    this.perfilService.seguirUsuario(this.usuario.id).subscribe(() => {
      this.estaSiguiendo = true;
      this.seguidoresCount++;
    });
  }

  dejarDeSeguir(): void {
    this.perfilService.dejarDeSeguirUsuario(this.usuario.id).subscribe(() => {
      this.estaSiguiendo = false;
      this.seguidoresCount--;
    });
  }

  toggleLike(publicacion: Publicacion) {
        this.publicacionesService.likePublicacion(publicacion.id).subscribe({
          next: (res) => {
            publicacion.liked = res.liked;
            publicacion.likesCount = res.totalLikes;
          },
          error: (err: any) => {
            console.error('Error al dar me gusta:', err);
          }
        });
      }

      cargarSeguidoresYSeguidos(id: number): void {
    this.perfilService.obtenerSeguidores(id).subscribe({
      next: (data) => this.seguidoresCount = data.length,
      error: (err) => console.error('❌ Error al obtener seguidores:', err)
    });

    this.perfilService.obtenerSeguidos(id).subscribe({
      next: (data) => this.seguidosCount = data.length,
      error: (err) => console.error('❌ Error al obtener seguidos:', err)
    });
  }
  
    isGuardada(publicacion: Publicacion): boolean {
      return publicacion.guardada === true;
    }
  
     toggleGuardado(publicacion: Publicacion) {
      this.publicacionesGuardadasService.toggleGuardado(publicacion.id).subscribe({
        next: (res) => {
          // Cambiar estado guardado localmente para actualizar el icono
          publicacion.guardada = !this.isGuardada(publicacion);
        },
        error: (err) => console.error('Error al togglear guardado:', err)
      });
    }
  
    getMediaUrl(mediaUrl: string | null): string | null {
      const result = this.publicacionesService.getFullMediaUrl(mediaUrl);
      return result;
    }
}
