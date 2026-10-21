import { Router } from 'express';

import { buscar, importar } from '../controllers/musicaController.js';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/buscar', verifyToken, buscar);
router.post('/importar', verifyToken, authorizeRoles('administrador'), importar);

export default router;
