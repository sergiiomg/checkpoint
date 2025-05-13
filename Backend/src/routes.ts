import express from 'express';
import { TestController } from './controllers/test-controller';
import { UsuariosController } from './controllers/usuarios-controller';

const router = express.Router();
const controller = new TestController();
const usuariosController = new UsuariosController();

// Llamada GET genérica al controlador
router.get('/', (req, res) => controller.getTestResponse(req, res));

//Llamada POST para crear un usuario
router.post('/usuarios', (req, res) => usuariosController.crearUsuario(req, res));

//Llamada POST para iniciar sesión
router.post('/login', (req, res) => usuariosController.iniciarSesion(req, res));

//Llamada GET para obtener un usuario
router.get('/usuarios/:id', (req, res) => usuariosController.obtenerUsuarioPorId(req, res));

export = router;