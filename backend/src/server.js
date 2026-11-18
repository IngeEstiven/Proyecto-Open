import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import juegoRoutes from './routes/juegoRoutes.js';
import plataformaRoutes from './routes/plataformaRoutes.js';
import contenidoRoutes from './routes/contenidoRoutes.js';
import musicaRoutes from './routes/musicaRoutes.js';
import buscarRoutes from './routes/buscarRoutes.js';
import favoritoRoutes from './routes/favoritoRoutes.js';
import pedidoRoutes from './routes/pedidoRoutes.js';
import auditRoutes from './routes/auditRoutes.js';

import { sendError } from './middlewares/errorMiddleware.js';


dotenv.config();

// Reconstruye la llave en memoria si viene dividida en el .env
if (!process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_KEY_PART1 && process.env.SUPABASE_KEY_PART2) {
  process.env.SUPABASE_SERVICE_ROLE_KEY = `${process.env.SUPABASE_KEY_PART1}${process.env.SUPABASE_KEY_PART2}`;
}

const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'JWT_SECRET'];
for (const name of required) {
  if (!process.env[name]) {
    console.error(`Falta la variable de entorno ${name}`);
    process.exit(1);
  }
}


const app = express();


app.set('trust proxy', 1);


const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Permite patrones con * (por ejemplo https://openleaf-frontend-*.vercel.app)
// para no depender del hash que Vercel asigna a cada deployment.
function esOrigenPermitido(origin) {
  if (!origin) return false;
  return allowedOrigins.some((permitido) => {
    if (!permitido.includes('*')) return permitido === origin;
    const patron = permitido
      .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\*/g, '.*');
    return new RegExp(`^${patron}$`).test(origin);
  });
}

app.use(cors({ origin: esOrigenPermitido }));
app.use(express.json({ limit: '1mb' }));


app.get('/', (req, res) => {
  res.json({ message: 'API OpenLeaf funcionando correctamente' });
});


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/juegos', juegoRoutes);
app.use('/api/plataformas', plataformaRoutes);
app.use('/api/contenidos', contenidoRoutes);
app.use('/api/musica', musicaRoutes);
app.use('/api/buscar', buscarRoutes);
app.use('/api/favoritos', favoritoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/auditoria', auditRoutes);


// Manejo de errores (por ejemplo, archivos rechazados por multer)
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'La imagen supera los 5 MB. Elige un archivo más liviano.' });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'No pudimos leer los datos enviados. Recarga la página e intenta de nuevo.' });
  }
  return sendError(res, err);
});


const PORT = process.env.PORT || 3001;


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});