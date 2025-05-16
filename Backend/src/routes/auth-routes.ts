import express from 'express';
import { AuthController } from '../controllers/auth-controller';
import { UsuariosController } from '../controllers/usuarios-controller';

const router = express.Router();
const controller = new AuthController();
const usuariosController = new UsuariosController();

//Llamada POST para crear un usuario
router.post('/usuarios', (req, res) => controller.crearUsuario(req, res));

//Llamada POST  para iniciar sesión
router.post('/login', (req, res) => controller.iniciarSesion(req, res));

export = router;