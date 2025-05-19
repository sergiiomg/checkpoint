import { PublicacionesRepository } from '../repository/publicaciones-repository';
import { Publicacion } from '../models/publicacion';

export class PublicacionesService {
  private repo = new PublicacionesRepository();

  async crearPublicacion(publicacion: Omit<Publicacion, 'id' | 'fecha_creacion'>) {
    return this.repo.crearPublicacion({
      ...publicacion,
      fecha_creacion: Date.now()
    });
  }
}