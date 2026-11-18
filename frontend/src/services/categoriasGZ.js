// Categorías de GameZone (sección de videojuegos dentro de OpenLeaf).
// Los slugs coinciden con los valores que valida el backend en /api/juegos.

export const CATEGORIAS_GZ = [
  { ruta: '/gamezone/categoria/accion', slug: 'accion', texto: 'Acción / Shooter', textoFiltro: 'Acción', icono: 'fas fa-crosshairs' },
  { ruta: '/gamezone/categoria/terror', slug: 'terror', texto: 'Terror / Suspenso', textoFiltro: 'Terror', icono: 'fas fa-moon' },
  { ruta: '/gamezone/categoria/deportes', slug: 'deportes', texto: 'Deportes / Carreras', textoFiltro: 'Deportes', icono: 'fas fa-trophy' },
  { ruta: '/gamezone/categoria/cooperativo', slug: 'cooperativo', texto: 'Co-op / Puzzle', textoFiltro: 'Co-op', icono: 'fas fa-people-group' }
];

export const SLUGS_CATEGORIA = CATEGORIAS_GZ.map((c) => c.slug);

export function nombreCategoria(slug) {
  const categoria = CATEGORIAS_GZ.find((c) => c.slug === slug);
  return categoria ? categoria.textoFiltro : slug || '';
}

// Convierte la etiqueta visible ("Acción", "Co-op", "Carreras"...) al slug que
// valida el backend al crear un juego desde una ficha estática de GameZone.
const EQUIVALENCIAS_CATEGORIA = {
  accion: 'accion',
  'accion shooter': 'accion',
  terror: 'terror',
  'terror suspenso': 'terror',
  deportes: 'deportes',
  'deportes carreras': 'deportes',
  carreras: 'deportes',
  cooperativo: 'cooperativo',
  coop: 'cooperativo',
  'co op': 'cooperativo',
  'co op puzzle': 'cooperativo'
};

export function slugCategoria(texto) {
  const clave = (texto || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return EQUIVALENCIAS_CATEGORIA[clave] || null;
}