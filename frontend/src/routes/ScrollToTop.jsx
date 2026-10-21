import { useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// Lleva la página al inicio en cada cambio de ruta (nunca al volver atrás/adelante).
// Los cambios de solo query string no mueven el scroll; un hash salta a su ancla.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const tipoNavegacion = useNavigationType();

  useLayoutEffect(() => {
    if (tipoNavegacion === 'POP') return;

    if (hash) {
      const objetivo = document.getElementById(hash.slice(1));
      if (objetivo) {
        objetivo.scrollIntoView({ block: 'start' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash, tipoNavegacion]);

  return null;
}
