// Datos de identidad del sitio: logo y contacto.
// Encontrar el logo aquí: se usa en todas las páginas y su ruta se cambia una sola vez.

export const LOGO_URL = '/img/streaming/logo.png';

// Imagen del hero: es una copia del logo con el texto "StreamVerse" incrustado,
// que se conserva como parte del diseño. Ruta única; se cambia una sola vez.
export const HERO_LOGO_URL = '/img/streaming/hero-logo.png';

// El correo se lee de VITE_CONTACT_EMAIL (frontend/.env). Si no está definido,
// se muestra "Próximamente" en vez de inventar un correo.
export const EMAIL_CONTACTO = import.meta.env.VITE_CONTACT_EMAIL || 'Próximamente';

// No existen oficinas ni horario reales: se muestra "Próximamente".
export const DIRECCION_CONTACTO = 'Próximamente';
export const HORARIO_CONTACTO = 'Próximamente';
export const TELEFONO_CONTACTO = 'Próximamente';