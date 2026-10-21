import { Router } from 'express';
import rateLimit from 'express-rate-limit';


import {
  register,
  login,
  verifyEmail,
  resendVerification,
  getMe,
  updateMe,
  requestEmailChange,
  confirmEmailChange,
  updateAvatar,
  changeMyPassword,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';


import { verifyToken } from '../middlewares/authMiddleware.js';
import { uploadSingleFile } from '../middlewares/uploadMiddleware.js';


const router = Router();


// Límite para rutas públicas que generan códigos o cuentas: 10 por 15 min por IP.
const limiteCodigos = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes. Intenta de nuevo en unos minutos.' }
});


router.post('/register', limiteCodigos, register);
router.post('/login', login);
router.post('/verify-email', limiteCodigos, verifyEmail);
router.post('/resend-verification', limiteCodigos, resendVerification);
router.post('/forgot-password', limiteCodigos, forgotPassword);
router.post('/reset-password', limiteCodigos, resetPassword);


router.get('/me', verifyToken, getMe);
router.patch('/me', verifyToken, updateMe);
router.post('/me/email', verifyToken, requestEmailChange);
router.post('/me/email/confirm', verifyToken, confirmEmailChange);
router.patch('/me/avatar', verifyToken, uploadSingleFile, updateAvatar);
router.patch('/change-my-password', verifyToken, changeMyPassword);


export default router;