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

    async crearUsuario(req: Request, res: Response): Promise<void>{
        try{
            const { nombre_usuario, email, contrasena_hash } = req.body;

            if(!nombre_usuario || !email || !contrasena_hash){
                res.status(400).json({ error: 'Todos los campos son requeridos.' });
                return;
            }

            const usuarioCreado = await this.usuariosService.crearUsuario(nombre_usuario, email, contrasena_hash);

            if(usuarioCreado){
                res.status(201).json(usuarioCreado);
            } else{
                res.status(500).json({ error: 'Error al crear el usuario.' });
            }
        } catch{
            res.status(500).json({ error: 'Hubo un error inesperado.' });
        }
    }
}

export { UsuariosController };