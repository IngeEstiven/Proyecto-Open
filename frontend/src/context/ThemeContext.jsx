import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { CLAVE_TEMA, TEMA_POR_DEFECTO, TEMAS, ThemeContext } from './themeContext.js';

const VALORES_VALIDOS = TEMAS.map((tema) => tema.valor);

// Lee el tema guardado. Si no es válido devuelve el tema por defecto.
function leerTemaGuardado() {
  try {
    const guardado = localStorage.getItem(CLAVE_TEMA);
    return VALORES_VALIDOS.includes(guardado) ? guardado : TEMA_POR_DEFECTO;
  } catch {
    return TEMA_POR_DEFECTO;
  }
}

function aplicarAtributo(tema) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', tema);
  }
}

export function ThemeProvider({ children }) {
  const [tema, setTemaEstado] = useState(leerTemaGuardado);

  // Aplica el atributo en <html> al montar (por si el script de index.html no
  // corrió) y cada vez que cambia el tema. No recarga la página.
  useEffect(() => {
    aplicarAtributo(tema);
  }, [tema]);

  const setTema = useCallback((nuevo) => {
    if (!VALORES_VALIDOS.includes(nuevo)) return;
    setTemaEstado(nuevo);
    aplicarAtributo(nuevo);
    try {
      localStorage.setItem(CLAVE_TEMA, nuevo);
    } catch {
      // Si el navegador bloquea localStorage, el tema queda solo en memoria.
    }
  }, []);

  const valor = useMemo(() => ({ tema, setTema, temas: TEMAS }), [tema, setTema]);

  return <ThemeContext.Provider value={valor}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const contexto = useContext(ThemeContext);
  if (!contexto) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return contexto;
}
