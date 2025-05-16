import e, { Request, Response } from 'express';
import { UsuariosService } from '../services/usuarios-service';

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

            res.status(200).json(usuario);
        } catch(error){
            res.status(500).json({error: 'Error al obtener el perfil del usuario'});
        }
    }

}

export { UsuariosController };