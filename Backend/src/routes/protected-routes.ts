import express from 'express';
import { TestController } from '../controllers/test-controller';
import { UsuariosController } from '../controllers/usuarios-controller';
import { PublicacionesController } from '../controllers/publicaciones-controller';
import { LikesController } from '../controllers/likes-controller';
import { upload } from '../middleware/upload';
import { PublicacionesGuardadasController } from '../controllers/publicaciones-guardadas-controller';
import { authenticateToken } from '../middleware/auth';
import { ComentariosController } from '../controllers/comentarios-controller';

const router = express.Router();
const controller = new TestController();
const usuariosController = new UsuariosController();
const publicacionesController = new PublicacionesController();
const likesController = new LikesController();
const publicacionesGuardadasController = new PublicacionesGuardadasController();
const comentariosController = new ComentariosController();

// Llamada GET genérica al controlador
router.get('/', (req, res) => controller.getTestResponse(req, res));

//Llamada GET para obtener un usuario
router.get('/usuarios/:id', (req, res) => usuariosController.obtenerUsuarioPorId(req, res));

//Llamada get para obtener el usuario propio
router.get('/perfil', (req, res) => usuariosController.obtenerPerfil(req, res));

//Llamada post para crear una publicación
router.post('/publicaciones', upload.single('media'), (req, res) => publicacionesController.crear(req, res));

//Llamada para eliminar una publicación
router.delete('/publicaciones/:id', authenticateToken, (req, res) =>publicacionesController.eliminar(req, res));
//Llamada para dar o quitar like
router.post('/publicaciones/:id/like', (req, res) => likesController.toggleLike(req, res));

//Llamada para guardar publicación
router.post('/publicaciones/:id/guardar', authenticateToken, (req, res) =>
  publicacionesGuardadasController.guardar(req, res)
);

//Llamada para desguardar publicación
router.delete('/publicaciones/:id/guardar', authenticateToken, (req, res) =>
  publicacionesGuardadasController.desguardar(req, res)
);

//Llamada para obtener publicaciones guardadas
router.get('/publicaciones-guardadas', authenticateToken, (req, res) =>publicacionesGuardadasController.obtenerGuardadas(req, res));

//Llamada para crear un comentario
router.post('/publicaciones/:id/comentarios', authenticateToken, (req, res) =>comentariosController.crearComentario(req, res));

//Llamada para obtener todos los comentarios raíz de una publicación
router.get('/publicaciones/:id/comentarios', (req, res) =>comentariosController.obtenerComentariosDePublicacion(req, res));

//Llamada para obtener todos los comentarios respuesta de un comentario
router.get('/comentarios/:id/respuestas', (req, res) =>comentariosController.obtenerRespuestasDeComentario(req, res));

//Llamada para eliminar un comentario 
router.delete('/comentarios/:id', authenticateToken, (req, res) =>comentariosController.eliminarComentario(req, res));

export = router;