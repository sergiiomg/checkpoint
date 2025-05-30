import e, { Request, Response } from 'express';
import { UsuariosService } from '../services/usuarios-service';
import { DEFAULT_PROFILE_IMAGE, DEFAULT_BANNER_IMAGE } from '../models/usuarios';
import { obtenerDB } from '../db';

class UsuariosController {
    private usuariosService: UsuariosService;

    constructor(){
        this.usuariosService = new UsuariosService();
    }

    /**
     * Crea un nuevo usuario
     * @param req - Express request object
     * @param res - Express response object
     */

    

    async obtenerUsuarioPorId(req: Request, res: Response): Promise<void>{
        try{
            const id = parseInt(req.params.id);

            if(isNaN(id)){
                res.status(400).json({error: 'ID inválido'});
                return;
            }

            const usuario = await this.usuariosService.obtenerUsuarioPorId(id);

            if(!usuario){
                res.status(401).json({error: 'Usuario no encontrado'});
                return;
            }

            const baseUrl = 'http://localhost:8080/images/defaults';

            if (!usuario.foto_perfil_url) {
                usuario.foto_perfil_url = DEFAULT_PROFILE_IMAGE;
            }
            
            if (!usuario.banner_url) {
                usuario.banner_url = DEFAULT_BANNER_IMAGE;
            }

            usuario.foto_perfil_url = baseUrl + usuario.foto_perfil_url;
            usuario.banner_url = baseUrl + usuario.banner_url;

            // Eliminamos la contraseña hash de la respuesta por seguridad
            const { contrasena_hash, ...usuarioSinPassword } = usuario;

            res.status(200).json(usuario);
        } catch(error){
            res.status(500).json({error: 'Error al obtener al usuario'});
        }
    }

    async obtenerPerfil(req: Request, res: Response): Promise<void> {
        try{
            const userId = (req as any).user?.id;

            if(!userId){
                res.status(401).json({error: 'No se pudo identificar al usuario'});
                return;
            }

            const usuario = await this.usuariosService.obtenerUsuarioPorId(userId);

            if(!usuario){
                res.status(404).json({error: 'Usuario no encontrado'});
                return;
            }

            if (!usuario.foto_perfil_url) {
                usuario.foto_perfil_url = DEFAULT_PROFILE_IMAGE;
            }
            
            if (!usuario.banner_url) {
                usuario.banner_url = DEFAULT_BANNER_IMAGE;
            }

            const baseUrl = 'http://localhost:8080';
            usuario.foto_perfil_url = baseUrl + usuario.foto_perfil_url;
            usuario.banner_url = baseUrl + usuario.banner_url;

            // Eliminamos la contraseña hash de la respuesta por seguridad
            const { contrasena_hash, ...usuarioSinPassword } = usuario;

            res.status(200).json(usuario);
        } catch(error){
            res.status(500).json({error: 'Error al obtener el perfil del usuario'});
        }
    }

    async buscarUsuarios(req: Request, res: Response): Promise<void> {
      const query = req.query.query as string;
    
      if (!query) {
        res.status(400).json({ error: 'Falta el parámetro de búsqueda' });
      }
    
      try {
        const db = await obtenerDB();
        const [usuarios] = await db.query(
          `SELECT id, nombre_usuario, foto_perfil_url FROM usuarios WHERE nombre_usuario LIKE ? LIMIT 20`,
          [`%${query}%`]
        );
    
        res.status(200).json(usuarios);
      } catch (error) {
        console.error('Error al buscar usuarios:', error);
        res.status(500).json({ error: 'Error del servidor' });
      }
    }
}

export { UsuariosController };