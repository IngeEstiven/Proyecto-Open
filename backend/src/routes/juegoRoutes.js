import { Router } from 'express';


import {
  listJuegos,
  getJuegoDetail,
  addJuego,
  editJuego,
  updateEstadoJuego,
  removeJuego,
  uploadJuegoImagen
} from '../controllers/juegoController.js';


import { uploadSingleFile } from '../middlewares/uploadMiddleware.js';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';


const router = Router();


router.get('/', verifyToken, authorizeRoles('administrador', 'usuario'), listJuegos);
router.get('/:slug', verifyToken, authorizeRoles('administrador', 'usuario'), getJuegoDetail);


router.post('/', verifyToken, authorizeRoles('administrador'), addJuego);
router.put('/:id', verifyToken, authorizeRoles('administrador'), editJuego);
router.patch('/:id/estado', verifyToken, authorizeRoles('administrador'), updateEstadoJuego);
router.delete('/:id', verifyToken, authorizeRoles('administrador'), removeJuego);


router.patch(
  '/:id/imagen',
  verifyToken,
  authorizeRoles('administrador'),
  uploadSingleFile,
  uploadJuegoImagen
);


export default router;
