// Respaldo local de géneros por sección, por si falla GET /api/buscar/filtros.
// Debe mantener los mismos valores que backend/src/services/catalogoConstantes.js.
export const GENEROS_POR_SECCION = {
  peliculas: [
    { valor: 'accion', etiqueta: 'Acción' },
    { valor: 'aventura', etiqueta: 'Aventura' },
    { valor: 'animacion', etiqueta: 'Animación' },
    { valor: 'ciencia_ficcion', etiqueta: 'Ciencia ficción' },
    { valor: 'comedia', etiqueta: 'Comedia' },
    { valor: 'documental', etiqueta: 'Documental' },
    { valor: 'drama', etiqueta: 'Drama' },
    { valor: 'fantasia', etiqueta: 'Fantasía' },
    { valor: 'misterio', etiqueta: 'Misterio' },
    { valor: 'romance', etiqueta: 'Romance' },
    { valor: 'terror', etiqueta: 'Terror' }
  ],
  musica: [
    { valor: 'pop', etiqueta: 'Pop' },
    { valor: 'rock', etiqueta: 'Rock' },
    { valor: 'reggaeton', etiqueta: 'Reggaetón' },
    { valor: 'salsa', etiqueta: 'Salsa' },
    { valor: 'electronica', etiqueta: 'Electrónica' },
    { valor: 'hip_hop', etiqueta: 'Hip Hop' },
    { valor: 'clasica', etiqueta: 'Clásica' },
    { valor: 'jazz', etiqueta: 'Jazz' },
    { valor: 'baladas', etiqueta: 'Baladas' },
    { valor: 'instrumental', etiqueta: 'Instrumental' },
    { valor: 'otros', etiqueta: 'Otros' }
  ],
  en_vivo: [],
  deportes: []
};

export const CATEGORIAS_JUEGO = [
  { valor: 'accion', etiqueta: 'Acción' },
  { valor: 'terror', etiqueta: 'Terror' },
  { valor: 'deportes', etiqueta: 'Deportes' },
  { valor: 'cooperativo', etiqueta: 'Cooperativo' }
];

export function etiquetaGenero(seccion, genero) {
  const lista = GENEROS_POR_SECCION[seccion] || [];
  const encontrado = lista.find((g) => g.valor === genero);
  return encontrado ? encontrado.etiqueta : genero;
}
