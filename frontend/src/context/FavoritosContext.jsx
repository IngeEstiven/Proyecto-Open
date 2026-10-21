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

  useEffect(() => {
    if (!autenticado) {
      setFavoritos([]);
      return undefined;
    }

    let vivo = true;
    setCargando(true);

    listarFavoritos()
      .then((datos) => {
        if (vivo) setFavoritos(datos);
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

  const favoritoDe = useCallback(
    (tipo, itemId) => {
      const columna = COLUMNA_POR_TIPO[tipo];
      if (!columna) return null;
      return favoritos.find((f) => String(f[columna]) === String(itemId)) || null;
    },
    [favoritos]
  );

  const esFavorito = useCallback(
    (tipo, itemId) => Boolean(favoritoDe(tipo, itemId)),
    [favoritoDe]
  );

  const alternar = useCallback(
    async (tipo, itemId) => {
      const actual = favoritoDe(tipo, itemId);
      if (actual) {
        await eliminarFavorito(actual.id);
        setFavoritos((prev) => prev.filter((f) => f.id !== actual.id));
        return false;
      }
      const nuevo = await agregarFavorito(tipo, itemId);
      setFavoritos((prev) => [nuevo, ...prev]);
      return true;
    },
    [favoritoDe]
  );

  const quitar = useCallback(async (favoritoId) => {
    await eliminarFavorito(favoritoId);
    setFavoritos((prev) => prev.filter((f) => f.id !== favoritoId));
  }, []);

  const valor = useMemo(
    () => ({ favoritos, cargando, esFavorito, favoritoDe, alternar, quitar }),
    [favoritos, cargando, esFavorito, favoritoDe, alternar, quitar]
  );

  return <FavoritosContext.Provider value={valor}>{children}</FavoritosContext.Provider>;
}

export function useFavoritos() {
  return useContext(FavoritosContext);
}
