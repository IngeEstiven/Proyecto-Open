import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext.jsx';

// Menú de usuario de GameZone: mismas opciones que en OpenLeaf
// (perfil, favoritos, pedidos y cerrar sesión), con estilos propios de GameZone.
export default function UserMenu() {
  const navegar = useNavigate();
  const { autenticado, esAdmin, usuario, cerrarSesion } = useAuth();
  const [abierto, setAbierto] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!abierto) return undefined;
    const alTeclado = (evento) => {
      if (evento.key === 'Escape') setAbierto(false);
    };
    const alClicFuera = (evento) => {
      if (ref.current && !ref.current.contains(evento.target)) setAbierto(false);
    };
    window.addEventListener('keydown', alTeclado);
    document.addEventListener('mousedown', alClicFuera);
    return () => {
      window.removeEventListener('keydown', alTeclado);
      document.removeEventListener('mousedown', alClicFuera);
    };
  }, [abierto]);

  const alCerrarSesion = () => {
    cerrarSesion();
    navegar('/');
  };

  const nombre = usuario?.nombre || usuario?.username || 'Mi cuenta';

  if (!autenticado) {
    return (
      <NavLink
        to="/?auth=login"
        className="text-2xl text-gray-200 hover:text-primary transition-colors leading-none"
        title="Iniciar sesión"
        aria-label="Iniciar sesión"
      >
        <i className="bi bi-person-circle"></i>
      </NavLink>
    );
  }

  return (
    <div className="gz-user" ref={ref}>
      <button
        type="button"
        className="gz-user-btn"
        onClick={() => setAbierto((v) => !v)}
        title="Mi cuenta"
        aria-label="Mi cuenta"
      >
        <i className="bi bi-person-circle"></i>
      </button>

      {abierto && (
        <div className="gz-user-drop">
          <div className="gz-user-name">
            <p className="text-sm font-bold text-white m-0 truncate">{nombre}</p>
            <p className="text-[0.68rem] text-gray-500 m-0 truncate">{usuario?.email}</p>
          </div>
          <NavLink to="/perfil" className="gz-user-item" onClick={() => setAbierto(false)}>
            <i className="bi bi-person-badge"></i> Mi perfil
          </NavLink>
          <NavLink to="/biblioteca" className="gz-user-item" onClick={() => setAbierto(false)}>
            <i className="bi bi-heart"></i> Mis favoritos
          </NavLink>
          <NavLink to="/mis-pedidos" className="gz-user-item" onClick={() => setAbierto(false)}>
            <i className="bi bi-box-seam"></i> Mis pedidos
          </NavLink>
          {esAdmin && (
            <NavLink to="/admin" className="gz-user-item" onClick={() => setAbierto(false)}>
              <i className="bi bi-shield-lock"></i> Administración
            </NavLink>
          )}
          <button type="button" className="gz-user-item leave" onClick={alCerrarSesion}>
            <i className="bi bi-box-arrow-right"></i> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
