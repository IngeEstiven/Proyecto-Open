import multer from 'multer';
import { AppError } from './errorMiddleware.js';


const storage = multer.memoryStorage();


const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];


function fileFilter(req, file, cb) {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new AppError(400, 'La imagen debe ser JPG, PNG, WEBP o GIF. Elige otro archivo.'),
      false
    );
  }
  cb(null, true);
}


export const uploadSingleFile = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
}).single('file');
