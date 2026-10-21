import { Router } from 'express';


import {
  listPlataformas,
  addPlataforma,
  editPlataforma,
  removePlataforma,
  uploadPlataformaImagen
} from '../controllers/plataformaController.js';


import { uploadSingleFile } from '../middlewares/uploadMiddleware.js';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';


const router = Router();


router.get('/', verifyToken, authorizeRoles('administrador', 'usuario'), listPlataformas);


router.post('/', verifyToken, authorizeRoles('administrador'), addPlataforma);
router.put('/:id', verifyToken, authorizeRoles('administrador'), editPlataforma);
router.patch('/:id', verifyToken, authorizeRoles('administrador'), editPlataforma);
router.delete('/:id', verifyToken, authorizeRoles('administrador'), removePlataforma);


router.patch(
  '/:id/imagen',
  verifyToken,
  authorizeRoles('administrador'),
  uploadSingleFile,
  uploadPlataformaImagen
);


export default router;
