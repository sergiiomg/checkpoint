import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config';
import bcrypt from 'bcryptjs';
import { UsuariosService } from '../services/usuarios-service';
import { db } from '../db';

const SECRET_KEY = JWT_SECRET_KEY;




class AuthController {
  private usuariosService: UsuariosService;

    constructor(){
        this.usuariosService = new UsuariosService();
    }
  async iniciarSesion(req: Request, res: Response): Promise<void>{
        try{
            const { nombre_usuario, contrasena } = req.body;

            if(!nombre_usuario || !contrasena){
                res.status(400).json({error: 'Usuario y contraseña son requeridos'});
                return;
            }

            const usuario = await this.usuariosService.iniciarSesion(nombre_usuario, contrasena);

            if(!usuario){
                res.status(401).json({error: 'Credenciales incorrectas'});
                return;
            }

            const token = jwt.sign(
              { id: usuario.id, username: usuario.nombre },
              SECRET_KEY,
              { expiresIn: '1h' }
            );

            res.status(200).json({token, usuario});
        } catch(error){
            res.status(500).json({error: 'Error en el servidor'});
        }
    }
}

export { AuthController };