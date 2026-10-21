import { Router } from 'express';


import { listFavoritos, addFavorito, removeFavorito } from '../controllers/favoritoController.js';


import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';


const router = Router();


router.get('/', verifyToken, authorizeRoles('administrador', 'usuario'), listFavoritos);
router.post('/', verifyToken, authorizeRoles('administrador', 'usuario'), addFavorito);
router.delete('/:id', verifyToken, authorizeRoles('administrador', 'usuario'), removeFavorito);


export default router;
