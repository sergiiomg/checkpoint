import { UsuariosRepository } from '../repository/usuarios-repository';
import { SeguimientosService } from './seguimientos-service'; // Importar el service de seguimientos
import bcrypt from 'bcryptjs';
import { Usuario } from '../models/usuarios';
import { obtenerDB } from '../db';

class UsuariosService{
    private usuariosRepository: UsuariosRepository;
    private seguimientosService: SeguimientosService; // Añadir esta línea

    constructor(){
        this.usuariosRepository = new UsuariosRepository();
        this.seguimientosService = new SeguimientosService(); // Añadir esta línea
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

    // Nuevo método para obtener usuario con contadores de seguimientos
    async obtenerUsuarioConContadores(id: number) {
      const usuario = await this.usuariosRepository.obtenerUsuarioPorId(id);
      
      if (!usuario) return null;

      // Obtener contadores de seguimientos
      const [seguidores, seguidos] = await Promise.all([
        this.seguimientosService.contarSeguidores(id),
        this.seguimientosService.contarUsuariosSeguidos(id)
      ]);

      // Excluir la contraseña hash de la respuesta
      const { contrasena_hash, ...usuarioSinPassword } = usuario;

      return {
        ...usuarioSinPassword,
        seguidores_count: seguidores,
        seguidos_count: seguidos
      };
    }

    async actualizarUsuario(id: number, cambios: Partial<Usuario>) {
      const db = await obtenerDB();
  
      const campos = Object.keys(cambios);
      const valores = Object.values(cambios);
  
      if (campos.length === 0) {
          throw new Error('No hay cambios para aplicar');
      }
  
      const setClause = campos.map(campo => `${campo} = ?`).join(', ');
      const sql = `UPDATE usuarios SET ${setClause} WHERE id = ?`;
  
      await db.query(sql, [...valores, id]);
  
      const [rows] = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
      const actualizado = (rows as Usuario[])[0];
      return actualizado;
  }
}

export { UsuariosService }