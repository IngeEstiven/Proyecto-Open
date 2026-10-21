import { useLayoutEffect } from 'react';

// Inyecta un bloque de CSS en <head> mientras el componente está montado.
// Se usa para aislar los estilos de GameZone del resto de OpenLeaf.
export function useInlineStyle(id, cssText) {
  useLayoutEffect(() => {
    const el = document.createElement('style');
    el.setAttribute('data-scope', id);
    el.textContent = cssText;
    document.head.appendChild(el);
    return () => el.remove();
  }, [id, cssText]);
}
