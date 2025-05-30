import express from 'express';
import { TestController } from '../controllers/test-controller';
import { UsuariosController } from '../controllers/usuarios-controller';
import { PublicacionesController } from '../controllers/publicaciones-controller';
import { LikesController } from '../controllers/likes-controller';
import { upload } from '../middleware/upload';
import { PublicacionesGuardadasController } from '../controllers/publicaciones-guardadas-controller';
import { authenticateToken } from '../middleware/auth';
import { ComentariosController } from '../controllers/comentarios-controller';
import { SeguimientosController } from '../controllers/seguimientos-controller';
import { LogrosController } from '../controllers/logros-controller';
import { seleccionarMote } from '../controllers/motes-controller';
import { obtenerTodosLosMotesConEstado } from '../controllers/motes-controller';

const router = express.Router();
const controller = new TestController();
const usuariosController = new UsuariosController();
const publicacionesController = new PublicacionesController();
const likesController = new LikesController();
const publicacionesGuardadasController = new PublicacionesGuardadasController();
const comentariosController = new ComentariosController();
const seguimientosController = new SeguimientosController();
const logrosController = new LogrosController();

// Llamada GET genérica al controlador
router.get('/', (req, res) => controller.getTestResponse(req, res));

//Llamada get para obtener el usuario propio
router.get('/perfil', (req, res) => usuariosController.obtenerPerfil(req, res));

//Llamada post para crear una publicación
router.post('/publicaciones', upload.single('media'), (req, res) => publicacionesController.crear(req, res));

//Llamada para eliminar una publicación
router.delete('/publicaciones/:id', authenticateToken, (req, res) =>publicacionesController.eliminar(req, res));

//Llamada para dar o quitar like
router.post('/publicaciones/:id/like', (req, res) => likesController.toggleLike(req, res));

//Llamada para guardar publicación
router.post('/publicaciones/:id/guardar', authenticateToken, (req, res) =>publicacionesGuardadasController.guardar(req, res));

//Llamada para desguardar publicación
router.delete('/publicaciones/:id/guardar', authenticateToken, (req, res) =>publicacionesGuardadasController.desguardar(req, res));

//Llamada para obtener publicaciones guardadas
router.get('/publicaciones-guardadas', authenticateToken, (req, res) =>publicacionesGuardadasController.obtenerGuardadas(req, res));

//Llamada para crear un comentario
router.post('/publicaciones/:id/comentarios', authenticateToken, (req, res) =>comentariosController.crearComentario(req, res));

//Llamada para eliminar un comentario 
router.delete('/comentarios/:id', authenticateToken, (req, res) =>comentariosController.eliminarComentario(req, res));

//Llamada para editar un comentario
router.put('/comentarios/:id', authenticateToken, (req, res) =>comentariosController.editar(req, res));

//Llamada para dar like a un comentario
router.post('/comentarios/:id/like', authenticateToken, (req, res) => comentariosController.toggleLikeComentario(req, res));

//Llamada para seguir a un usuario
router.post('/usuarios/:id/seguir', authenticateToken, (req, res) => seguimientosController.seguir(req, res));

//Llamada para dejar de seguir a un usuario
router.delete('/usuarios/:id/seguir', authenticateToken, (req, res) => seguimientosController.dejarDeSeguir(req, res));

//Llamada para ver si sigo o no a un usuario
router.get('/usuarios/:id/siguiendo/yo', authenticateToken, (req, res) =>seguimientosController.estoySiguiendo(req, res));

//Llamada para ver si un usuario me sigue o no
router.get('/usuarios/:id/me-sigue', authenticateToken, (req, res) =>seguimientosController.meSigue(req, res));

//Llamada para ver si un usuario y tú os seguís mutuamente
router.get('/usuarios/:id/amigos', authenticateToken, (req, res) =>seguimientosController.sonAmigos(req, res));

//Llamada para obtener todos los logros
router.get('/logros', authenticateToken, (req, res) => logrosController.obtenerTodosLosLogrosConEstado(req, res));

//Llamada para obtener todos los motes
router.get('/motes',  authenticateToken, obtenerTodosLosMotesConEstado);

//Llamada para selecciones un mote
router.post('/seleccionar', authenticateToken, seleccionarMote);

export = router;