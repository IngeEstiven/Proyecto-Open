import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useAuth } from './AuthContext.jsx';
import { agregarFavorito, eliminarFavorito, listarFavoritos } from '../services/favoritosService.js';

const FavoritosContext = createContext(null);

const COLUMNA_POR_TIPO = {
  juego: 'juego_id',
  contenido: 'contenido_id',
  plataforma: 'plataforma_id'
};

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

  // Busca un favorito por id (contenido/plataforma) o, en el caso de los
  // juegos, también por slug. Así las fichas estáticas de GameZone pueden
  // marcar el corazón sin conocer el id interno del catálogo.
  const favoritoDe = useCallback(
    (tipo, itemId, slug = null) => {
      if (tipo === 'juego' && slug) {
        const porSlug = favoritos.find((f) => f.juego?.slug === slug);
        if (porSlug) return porSlug;
      }

      const columna = COLUMNA_POR_TIPO[tipo];
      if (!columna || itemId == null) return null;
      return favoritos.find((f) => String(f[columna]) === String(itemId)) || null;
    },
    [favoritos]
  );

  const esFavorito = useCallback(
    (tipo, itemId, slug = null) => Boolean(favoritoDe(tipo, itemId, slug)),
    [favoritoDe]
  );

  const alternar = useCallback(
    async (tipo, itemId, slug = null) => {
      const actual = favoritoDe(tipo, itemId, slug);

      if (actual) {
        await eliminarFavorito(actual.id);
        setFavoritos((prev) => prev.filter((f) => f.id !== actual.id));
        return false;
      }

      const nuevo = await agregarFavorito(tipo, itemId, slug);
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
