import { Outlet } from 'react-router-dom';

import FloatingPlayer from '../components/admin/FloatingPlayer.jsx';
import { PlayerProvider } from '../context/PlayerContext.jsx';
import { usePlayer } from '../hooks/usePlayer.js';

// Deja espacio inferior en las páginas solo cuando el reproductor está como
// barra (el mini flota sobre la esquina y el completo es un modal).
function EspacioReproductor() {
  const { current, size } = usePlayer();
  if (!current || size !== 'barra') return null;
  return <div className="op-player-spacer" aria-hidden="true"></div>;
}

export default function AppLayout() {
  return (
    <PlayerProvider>
      <Outlet />
      <EspacioReproductor />
      <FloatingPlayer />
    </PlayerProvider>
  );
}
