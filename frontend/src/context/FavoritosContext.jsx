import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useAuth } from './AuthContext.jsx';
import { agregarFavorito, eliminarFavorito, listarFavoritos } from '../services/favoritosService.js';

const FavoritosContext = createContext(null);

const COLUMNA_POR_TIPO = {
  juego: 'juego_id',
  contenido: 'contenido_id',
  plataforma: 'plataforma_id'
};

// Relación que devuelve la API para poder comparar por slug o por título.
const RELACION_POR_TIPO = {
  juego: 'juego',
  plataforma: 'plataforma'
};

// Misma normalización que aplica el backend: minúsculas, sin acentos y sin
// signos. GameZone guarda las fichas con un slug corto (gow, horizon...) y la
// base genera otro a partir del título (god-of-war-ragnarok), así que el
// corazón se reconoce comparando títulos.
function normalizarTexto(texto) {
  return (texto || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function titulosParecidos(uno, otro) {
  if (!uno || !otro) return false;
  if (uno === otro) return true;

  const corto = uno.length <= otro.length ? uno : otro;
  const largo = corto === uno ? otro : uno;
  const palabras = corto.split(' ').length;

  if (palabras >= 2 && largo.startsWith(`${corto} `)) return true;
  return palabras >= 3 && largo.includes(corto);
}

export function FavoritosProvider({ children }) {
  const { autenticado } = useAuth();
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(false);

  const recargar = useCallback(async () => {
    if (!autenticado) {
      setFavoritos([]);
      return [];
    }

    setCargando(true);
    try {
      const datos = await listarFavoritos();
      setFavoritos(Array.isArray(datos) ? datos : []);
      return datos;
    } catch {
      setFavoritos([]);
      return [];
    } finally {
      setCargando(false);
    }
  }, [autenticado]);

  useEffect(() => {
    if (!autenticado) {
      setFavoritos([]);
      setCargando(false);
      return undefined;
    }

    let vivo = true;
    setCargando(true);

    listarFavoritos()
      .then((datos) => {
        if (vivo) setFavoritos(Array.isArray(datos) ? datos : []);
      })
      .catch(() => {
        if (vivo) setFavoritos([]);
      })
      .finally(() => {
        if (vivo) setCargando(false);
      });

    return () => {
      vivo = false;
    };
  }, [autenticado]);

  // Busca un favorito por id (contenido/plataforma) o, para juegos y
  // plataformas, también por slug o título. Así las fichas estáticas de
  // GameZone y las tarjetas de plataforma previas a la carga de la API pueden
  // marcar el corazón sin conocer el id interno del catálogo.
  const favoritoDe = useCallback(
    (tipo, itemId, slug = null, titulo = null) => {
      const relacion = RELACION_POR_TIPO[tipo];
      if (relacion) {
        const tituloNormalizado = normalizarTexto(titulo);
        const porTitulo = favoritos.find((f) => {
          const item = f[relacion];
          if (!item) return false;
          if (slug && item.slug === slug) return true;
          return titulosParecidos(
            normalizarTexto(item.titulo || item.nombre),
            tituloNormalizado
          );
        });
        if (porTitulo) return porTitulo;
      }

      const columna = COLUMNA_POR_TIPO[tipo];
      if (!columna || itemId == null) return null;
      return favoritos.find((f) => String(f[columna]) === String(itemId)) || null;
    },
    [favoritos]
  );

  const esFavorito = useCallback(
    (tipo, itemId, slug = null, titulo = null) => Boolean(favoritoDe(tipo, itemId, slug, titulo)),
    [favoritoDe]
  );

  const alternar = useCallback(
    async (tipo, itemId, datos = {}) => {
      const actual = favoritoDe(tipo, itemId, datos.slug ?? null, datos.titulo ?? null);

      if (actual) {
        await eliminarFavorito(actual.id);
        setFavoritos((prev) => prev.filter((f) => f.id !== actual.id));
        return false;
      }

      const nuevo = await agregarFavorito(tipo, itemId, datos);
      // El backend es idempotente: si ya existía, devuelve el mismo registro.
      setFavoritos((prev) => {
        if (prev.some((f) => f.id === nuevo.id)) return prev;
        return [nuevo, ...prev];
      });
      return true;
    },
    [favoritoDe]
  );

  const quitar = useCallback(async (favoritoId) => {
    await eliminarFavorito(favoritoId);
    setFavoritos((prev) => prev.filter((f) => f.id !== favoritoId));
  }, []);

  const valor = useMemo(
    () => ({ favoritos, cargando, esFavorito, favoritoDe, alternar, quitar, recargar }),
    [favoritos, cargando, esFavorito, favoritoDe, alternar, quitar, recargar]
  );

  return <FavoritosContext.Provider value={valor}>{children}</FavoritosContext.Provider>;
}

export function useFavoritos() {
  return useContext(FavoritosContext);
}
