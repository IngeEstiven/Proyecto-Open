import { Router } from 'express';


import {
  addPedido,
  listPedidosMios,
  listPedidos,
  updateEstadoPedido
} from '../controllers/pedidoController.js';


import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';


const router = Router();


router.get('/', verifyToken, authorizeRoles('administrador'), listPedidos);
router.get('/mios', verifyToken, authorizeRoles('administrador', 'usuario'), listPedidosMios);


router.post('/', verifyToken, authorizeRoles('administrador', 'usuario'), addPedido);


router.patch('/:id/estado', verifyToken, authorizeRoles('administrador'), updateEstadoPedido);


export default router;
