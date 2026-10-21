import { useEffect } from 'react';

export default function useTituloPagina(titulo) {
  useEffect(() => {
    document.title = titulo;
  }, [titulo]);
}
