import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';

function PantallaCargando({ texto = 'Cargando…' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#050810] text-slate-100">
      <span className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
      <p className="text-sm text-slate-400">{texto}</p>
    </div>
  );
}

export function RutaProtegida() {
  const { autenticado, cargando } = useAuth();
  const ubicacion = useLocation();

  if (cargando) return <PantallaCargando />;
  if (!autenticado) {
    return (
      <Navigate
        to="/?auth=login"
        state={{ desde: ubicacion.pathname + ubicacion.search }}
        replace
      />
    );
  }
  return <Outlet />;
}

export function RutaAdmin() {
  const { esAdmin, autenticado, cargando } = useAuth();
  const ubicacion = useLocation();

  if (cargando) return <PantallaCargando />;
  if (!autenticado) {
    return (
      <Navigate
        to="/?auth=login"
        state={{ desde: ubicacion.pathname + ubicacion.search }}
        replace
      />
    );
  }
  if (!esAdmin) return <Navigate to="/inicio" replace />;
  return <Outlet />;
}

export { PantallaCargando };
