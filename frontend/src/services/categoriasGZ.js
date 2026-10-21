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