// Error de negocio controlado: el handler conoce su código HTTP y su mensaje.
// Los servicios lanzan AppError con 400/401/403/404/409; cualquier error crudo
// (Supabase, Postgres, Multer, etc.) NO debe llegar al cliente.
export class AppError extends Error {
  constructor(status, message, data = null, code = null) {
    super(message);
    this.status = status;
    this.data = data;
    // Código estable opcional para que el frontend distinga casos concretos
    // (por ejemplo "account_inactive") sin depender del texto del mensaje.
    this.code = code;
  }
}


// sendError: centraliza la respuesta de error. Los AppError responden con su
// código y mensaje; el resto se registra en consola y responde 500 genérico,
// sin filtrar detalles internos ni stack traces.
export function sendError(res, error) {
  if (error instanceof AppError) {
    const cuerpo = { error: error.message };
    if (error.code) cuerpo.code = error.code;
    return res.status(error.status).json(cuerpo);
  }


  console.error('Error no controlado:', error);
  return res.status(500).json({ error: 'Ocurrió un error inesperado. Intenta de nuevo.' });
}