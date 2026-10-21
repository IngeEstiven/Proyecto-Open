import { createContext } from 'react';

// Contexto separado del proveedor (patrón de dos archivos) para que
// hooks/usePlayer.js pueda consumirlo sin crear dependencias circulares.
export const PlayerContext = createContext(null);
