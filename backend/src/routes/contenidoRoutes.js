import { Router } from 'express';


import {
  listContenidos,
  getContenidoDetail,
  addContenido,
  editContenido,
  removeContenido
} from '../controllers/contenidoController.js';


import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';


const router = Router();


router.get('/', verifyToken, authorizeRoles('administrador', 'usuario'), listContenidos);
router.get('/:id', verifyToken, authorizeRoles('administrador', 'usuario'), getContenidoDetail);


router.post('/', verifyToken, authorizeRoles('administrador'), addContenido);
router.put('/:id', verifyToken, authorizeRoles('administrador'), editContenido);
router.patch('/:id', verifyToken, authorizeRoles('administrador'), editContenido);
router.delete('/:id', verifyToken, authorizeRoles('administrador'), removeContenido);


export default router;
