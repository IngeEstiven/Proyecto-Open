import { Router } from 'express';


import {
  listUsers,
  getUserDetail,
  addUser,
  editUser,
  updateUserRol,
  updateUserPassword,
  updateUserStatus,
  removeUser,
  removeUserPermanent
} from '../controllers/userController.js';


import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';


const router = Router();


router.get('/', verifyToken, authorizeRoles('administrador'), listUsers);
router.get('/:id', verifyToken, authorizeRoles('administrador'), getUserDetail);


router.post('/', verifyToken, authorizeRoles('administrador'), addUser);


router.put('/:id', verifyToken, authorizeRoles('administrador'), editUser);
router.patch('/:id', verifyToken, authorizeRoles('administrador'), editUser);
router.patch('/:id/rol', verifyToken, authorizeRoles('administrador'), updateUserRol);
router.patch('/:id/password', verifyToken, authorizeRoles('administrador'), updateUserPassword);
router.patch('/:id/estado', verifyToken, authorizeRoles('administrador'), updateUserStatus);


router.delete('/:id/permanent', verifyToken, authorizeRoles('administrador'), removeUserPermanent);
router.delete('/:id', verifyToken, authorizeRoles('administrador'), removeUser);


export default router;
