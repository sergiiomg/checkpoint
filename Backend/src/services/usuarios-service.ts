import { UsuariosRepository } from '../repository/usuarios-repository';
import bcrypt from 'bcryptjs';
import { Usuario } from '../models/usuarios';

class UsuariosService{
    private usuariosRepository: UsuariosRepository;

    constructor(){
        this.usuariosRepository = new UsuariosRepository();
    }

    /**
     * Crea un nuevo usuario, asegurando la seguridad de la contraseña
     * @param nombre_usuario - El nombre del usuario
     * @param email - El correo electrónico del usuario
     * @param contrasena_hash - La contraseña del usuario
     * @returns El usuario creado
     */

    async crearUsuario(nombre_usuario: string, email: string, contrasena: string){
      try{
        const hash = await bcrypt.hash(contrasena, 10);

        const nuevoUsuario = await this.usuariosRepository.crearUsuario(
          nombre_usuario,
          email,
          hash
        );
        return nuevoUsuario;
      }
      catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error('Error al crear el usuario: ' + error.message);
        } else {
           throw new Error('Error desconocido al crear el usuario.');
        }
      }
    }

  async iniciarSesion(nombre_usuario: string, contrasena: string){
    const usuario: Usuario | null = await this.usuariosRepository.obtenerUsuarioPorNombre(nombre_usuario);

    if(!usuario) return null;

      const coincide = await bcrypt.compare(contrasena, usuario.contrasena_hash);

    if(!coincide) return null;

      const { contrasena_hash, ...resto } = usuario;
      const usuarioSinPassword: Omit<Usuario, 'contrasena_hash'> = resto;

      return usuarioSinPassword;
  }

  async obtenerUsuarioPorId(id: number) {
    return await this.usuariosRepository.obtenerUsuarioPorId(id);
  }

  async sumarExperiencia(usuarioId: number, cantidad: number): Promise<void> {
    await this.usuariosRepository.sumarExperiencia(usuarioId, cantidad);
  }

}

export { UsuariosService }