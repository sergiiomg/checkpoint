import express from 'express';
import { AuthController } from '../controllers/auth-controller';
import { UsuariosController } from '../controllers/usuarios-controller';
import { PublicacionesController } from '../controllers/publicaciones-controller';
import { ComentariosController } from '../controllers/comentarios-controller';
import { SeguimientosController } from '../controllers/seguimientos-controller';

const router = express.Router();
const controller = new AuthController();
const usuariosController = new UsuariosController();
const publicacionesController = new PublicacionesController();
const comentariosController = new ComentariosController();
const seguimientosController = new SeguimientosController();

//Llamada POST para crear un usuario
router.post('/usuarios', (req, res) => controller.crearUsuario(req, res));

//Llamada POST  para iniciar sesión
router.post('/login', (req, res) => controller.iniciarSesion(req, res));

//Llamada GET para obtener todas las publicaciones
router.get('/publicaciones', (req, res) => publicacionesController.obtenerTodas(req, res));

//Llamada GET para obtener las publicaciones de un usuario cuando entras a su perfil
router.get('/usuarios/:id/publicaciones', (req, res) =>publicacionesController.obtenerPublicacionesDeUsuario(req, res));

//Llamada para obtener el número de likes de un comentario
router.get('/comentarios/:id/likes', (req, res) => comentariosController.obtenerLikes(req, res));

//Llamada para buscar a un usuario en el buscador
router.get('/usuarios/buscar', (req, res) => usuariosController.buscarUsuarios(req, res));

//Llamada GET para obtener un usuario
router.get('/usuarios/:id', (req, res) => usuariosController.obtenerUsuarioPorId(req, res));

//Llamada para obtener todos los comentarios raíz de una publicación
router.get('/publicaciones/:id/comentarios', (req, res) =>comentariosController.obtenerComentariosDePublicacion(req, res));

//Llamada para obtener todos los comentarios respuesta de un comentario
router.get('/comentarios/:id/respuestas', (req, res) =>comentariosController.obtenerRespuestasDeComentario(req, res));

//Llamada para ver los seguidos de un usuario
router.get('/usuarios/:id/siguiendo', (req, res) =>seguimientosController.getSiguiendo(req, res));

//Llamada para ver los seguidores de un usuario
router.get('/usuarios/:id/seguidores', (req, res) =>seguimientosController.getSeguidores(req, res));


export = router;