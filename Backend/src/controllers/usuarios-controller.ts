import e, { Request, Response } from 'express';
import { UsuariosService } from '../services/usuarios-service';
import { DEFAULT_PROFILE_IMAGE, DEFAULT_BANNER_IMAGE } from '../models/usuarios';
import { obtenerDB } from '../db';
import { SeguimientosService } from '../services/seguimientos-service';

class UsuariosController {
    private usuariosService: UsuariosService;
    private seguimientosService: SeguimientosService;

    constructor(){
        this.usuariosService = new UsuariosService();
        this.seguimientosService = new SeguimientosService();
    }

    /**
     * Crea un nuevo usuario
     * @param req - Express request object
     * @param res - Express response object
     */

    

    async obtenerUsuarioPorId(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);

    try {
      const usuario = await this.usuariosService.obtenerUsuarioPorId(id);
      
      if (!usuario) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }

      // Obtener contadores de seguimientos
      const [seguidores, seguidos] = await Promise.all([
        this.seguimientosService.contarSeguidores(id),
        this.seguimientosService.contarUsuariosSeguidos(id)
      ]);

      if (!usuario.foto_perfil_url) {
              usuario.foto_perfil_url = DEFAULT_PROFILE_IMAGE;
          }
          
          if (!usuario.banner_url) {
              usuario.banner_url = DEFAULT_BANNER_IMAGE;
          }
  
          const baseUrl = 'http://localhost:8080';
          usuario.foto_perfil_url = baseUrl + usuario.foto_perfil_url;
          usuario.banner_url = baseUrl + usuario.banner_url;

      // Crear respuesta con información completa del usuario
      const usuarioCompleto = {
        ...usuario,
        seguidores_count: seguidores,
        seguidos_count: seguidos
      };

      res.status(200).json(usuarioCompleto);
    } catch (error) {
      console.error('❌ Error al obtener usuario:', error);
      res.status(500).json({ error: 'Error al obtener usuario' });
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
  
          // Obtener contadores de seguimientos
          const [seguidores, seguidos] = await Promise.all([
              this.seguimientosService.contarSeguidores(userId),
              this.seguimientosService.contarUsuariosSeguidos(userId)
          ]);
  
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
  
          // Agregar los contadores al usuario
          const usuarioCompleto = {
              ...usuarioSinPassword,
              seguidores_count: seguidores,
              seguidos_count: seguidos
          };
  
          res.status(200).json(usuarioCompleto);
      } catch(error){
          console.error('❌ Error al obtener perfil:', error);
          res.status(500).json({error: 'Error al obtener el perfil del usuario'});
      }
  }

  async editarPerfil(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
  
      if (!userId) {
        res.status(401).json({ error: 'Usuario no encontrado' });
        return;
      }
  
      console.log('Body recibido:', req.body);
      console.log('Archivos recibidos:', (req as any).files);
  
      const { nombre_usuario } = req.body;
      const foto_perfil = (req as any).files?.foto_perfil?.[0];
      const banner = (req as any).files?.banner?.[0];

      console.log('Body:', req.body);
  
      if (!nombre_usuario && !foto_perfil && !banner) {
        res.status(400).json({ error: 'No hay cambios para aplicar' });
        return;
      }
  
      const cambios: any = {};
      if (nombre_usuario) cambios.nombre_usuario = nombre_usuario;
      if (foto_perfil) cambios.foto_perfil_url = `/uploads/${foto_perfil.filename}`;
      if (banner) cambios.banner_url = `/uploads/${banner.filename}`;
  
      console.log('Cambios a aplicar:', cambios);
  
      const actualizado = await this.usuariosService.actualizarUsuario(userId, cambios);
  
      if (!actualizado) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }
  
      res.status(200).json({ 
        mensaje: 'Perfil actualizado correctamente', 
        datos: {
          ...actualizado,
          foto_perfil_url: actualizado.foto_perfil_url ? `http://localhost:8080${actualizado.foto_perfil_url}` : null,
          banner_url: actualizado.banner_url ? `http://localhost:8080${actualizado.banner_url}` : null
        }
      });
    } catch (error) {
      console.error('Error detallado al editar perfil:', error);
      res.status(500).json({ error: 'Error al editar perfil', detalle: error instanceof Error ? error.message : error });
    }
  }
  
  async buscarUsuarios(req: Request, res: Response): Promise<void> {
    const query = req.query.query as string;
  
    if (!query) {
      res.status(400).json({ error: 'Falta el parámetro de búsqueda' });
      return;
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