import express from 'express';
import { TestController } from '../controllers/test-controller';
import { UsuariosController } from '../controllers/usuarios-controller';
import { PublicacionesController } from '../controllers/publicaciones-controller';
import { LikesController } from '../controllers/likes-controller';

const router = express.Router();
const controller = new TestController();
const usuariosController = new UsuariosController();
const publicacionesController = new PublicacionesController();
const likesController = new LikesController();

// Llamada GET genérica al controlador
router.get('/', (req, res) => controller.getTestResponse(req, res));

//Llamada GET para obtener un usuario
router.get('/usuarios/:id', (req, res) => usuariosController.obtenerUsuarioPorId(req, res));

//Llamada get para obtener el usuario propio
router.get('/perfil', (req, res) => usuariosController.obtenerPerfil(req, res));

//Llamada post para crear una publicación
router.post('/publicaciones', (req, res) => publicacionesController.crear(req, res));

//Llamada para dar o quitar like
router.post('/publicaciones/:id/like', (req, res) => likesController.toggleLike(req, res));

export = router;