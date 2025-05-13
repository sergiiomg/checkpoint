import { UsuariosRepository } from '../repository/usuarios-repository';
import bcrypt from 'bcryptjs';

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
}

export { UsuariosService }