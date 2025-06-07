import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config';
import bcrypt from 'bcryptjs';
import { UsuariosService } from '../services/usuarios-service';
import { db } from '../db';
import { desbloquearLogro } from '../utils/logros';
import { RowDataPacket } from 'mysql2';

const SECRET_KEY = JWT_SECRET_KEY;

class AuthController {
  private usuariosService: UsuariosService;

    constructor(){
        this.usuariosService = new UsuariosService();
    }
    

    async crearUsuario(req: Request, res: Response): Promise<void>{
        console.log('REQ.BODY:', req.body);
        try{
            const { nombre_usuario, email, contrasena } = req.body;

            if(!nombre_usuario || !email || !contrasena){
                res.status(400).json({ error: 'Todos los campos son requeridos.' });
                return;
            }

            const usuarioCreado = await this.usuariosService.crearUsuario(nombre_usuario, email, contrasena);
            await desbloquearLogro(usuarioCreado.id, 'BIENVENIDO_A_BORDO');

            if(usuarioCreado){
                res.status(201).json(usuarioCreado);
            } else{
                res.status(500).json({ error: 'Error al crear el usuario.' });
            }
        } catch(error){
            console.error('Error en crearUsuario:', error);
              res.status(500).json({ error: 'Hubo un error inesperado.' });
        }
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
              { id: usuario.id, nombre_usuario: usuario.nombre_usuario },
              SECRET_KEY,
              { expiresIn: '1h' }
            );

            const hoy = new Date().toISOString().split('T')[0];

            // Evita duplicados: asegura que no se registre el mismo día dos veces
            await db!.query(
              `INSERT IGNORE INTO inicios_sesion (usuario_id, fecha) VALUES (?, ?)`,
              [usuario.id, hoy]
            );
            
            // Contar los días únicos
            const [rows] = await db!.query<RowDataPacket[]>(
              `SELECT COUNT(DISTINCT fecha) AS totalDias FROM inicios_sesion WHERE usuario_id = ?`,
              [usuario.id]
            );
            
            const diasTotales = rows?.[0]?.totalDias || 0;
            
            if (diasTotales >= 30) {
              console.log('Desbloqueando logro VETERANO');
              await desbloquearLogro(usuario.id, 'VETERANO');
            }

            res.status(200).json({token, usuario});
        } catch(error){
            res.status(500).json({error: 'Error en el servidor'});
        }
    }
}

export { AuthController };