import { createContext } from 'react';

// Clave usada tanto por el script anti-parpadeo de index.html como por
// ThemeContext para recordar el tema elegido.
export const CLAVE_TEMA = 'openleaf-theme';

// Temas disponibles. Cada uno corresponde a [data-theme="..."] en temas.css.
export const TEMAS = [
  {
    valor: 'purpura',
    nombre: 'Morado',
    descripcion: 'Acentos morados y violetas (tema original)',
    muestra: 'linear-gradient(135deg, #667eea, #764ba2)'
  },
  {
    valor: 'azul',
    nombre: 'Azul neón',
    descripcion: 'Acentos azules y cian, misma luminosidad',
    muestra: 'linear-gradient(135deg, #3b82f6, #0ea5e9)'
  },
  {
    valor: 'claro',
    nombre: 'Claro',
    descripcion: 'Fondos claros con acentos índigo',
    muestra: 'linear-gradient(135deg, #eef2ff, #6366f1)'
  }
];

export const TEMA_POR_DEFECTO = 'purpura';

export const ThemeContext = createContext(null);
