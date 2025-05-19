import express from 'express';
import { TestController } from '../controllers/test-controller';
import { UsuariosController } from '../controllers/usuarios-controller';
import { upload } from '../middleware/upload';

const router = express.Router();
const controller = new TestController();
const usuariosController = new UsuariosController();

// Llamada GET genérica al controlador
router.get('/', (req, res) => controller.getTestResponse(req, res));

//Llamada GET para obtener un usuario
router.get('/usuarios/:id', (req, res) => usuariosController.obtenerUsuarioPorId(req, res));

//Llamada get para obtener el usuario propio
router.get('/perfil', (req, res) => usuariosController.obtenerPerfil(req, res));

//Llamada PATCH para modificar el perfil
router.patch('/perfil', upload.fields([
  { name: 'foto_perfil', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]), (req, res) => usuariosController.editarPerfil(req, res));

export = router;