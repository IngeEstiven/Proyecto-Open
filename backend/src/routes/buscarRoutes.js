import { Router } from 'express';


import { search, filtros } from '../controllers/buscarController.js';


import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';


const router = Router();


router.get('/filtros', verifyToken, authorizeRoles('administrador', 'usuario'), filtros);
router.get('/', verifyToken, authorizeRoles('administrador', 'usuario'), search);


export default router;
