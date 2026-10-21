import { Router } from 'express';


import { listAuditoria, getAuditoriaDetail } from '../controllers/auditController.js';


import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';


const router = Router();


router.get('/', verifyToken, authorizeRoles('administrador'), listAuditoria);
router.get('/:id', verifyToken, authorizeRoles('administrador'), getAuditoriaDetail);


export default router;
