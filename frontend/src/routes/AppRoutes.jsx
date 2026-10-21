import { Navigate, Route, Routes } from 'react-router-dom';

import { RutaAdmin, RutaProtegida } from './RutaProtegida.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import AppLayout from '../layouts/AppLayout.jsx';
import GameZoneLayout from '../layouts/GameZoneLayout.jsx';
import StreamVerseLayout from '../layouts/StreamVerseLayout.jsx';
import AuditoriaPage from '../pages/admin/AuditoriaPage.jsx';
import ContenidosPage from '../pages/admin/ContenidosPage.jsx';
import DashboardPage from '../pages/admin/DashboardPage.jsx';
import JuegosPage from '../pages/admin/JuegosPage.jsx';
import PedidosPageAdmin from '../pages/admin/PedidosAdminPage.jsx';
import PlataformasPageAdmin from '../pages/admin/PlataformasPage.jsx';
import UsuariosPage from '../pages/admin/UsuariosPage.jsx';
import AvisoLegalPage from '../pages/public/AvisoLegalPage.jsx';
import BibliotecaPage from '../pages/admin/BibliotecaPage.jsx';
import BuscarPage from '../pages/admin/BuscarPage.jsx';
import CheckoutPage from '../pages/admin/CheckoutPage.jsx';
import DeportesPage from '../pages/admin/DeportesPage.jsx';
import EnVivoPage from '../pages/admin/EnVivoPage.jsx';
import GameZoneCategoriaPage from '../pages/admin/GameZoneCategoriaPage.jsx';
import GameZoneFichaPage from '../pages/admin/GameZoneFichaPage.jsx';
import GameZonePage from '../pages/admin/GameZonePage.jsx';
import InicioPage from '../pages/admin/InicioPage.jsx';
import LandingPage from '../pages/public/LandingPage.jsx';
import MusicaPage from '../pages/admin/MusicaPage.jsx';
import PedidosPage from '../pages/admin/PedidosPage.jsx';
import PeliculasPage from '../pages/admin/PeliculasPage.jsx';
import PerfilPage from '../pages/admin/PerfilPage.jsx';
import PrivacidadPage from '../pages/public/PrivacidadPage.jsx';
import TerminosPage from '../pages/public/TerminosPage.jsx';
import ReproductorPage from '../pages/admin/ReproductorPage.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      {/* ═══ PÚBLICAS (sin sesión) ═══ */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/aviso-legal" element={<AvisoLegalPage />} />
      <Route path="/privacidad" element={<PrivacidadPage />} />
      <Route path="/terminos" element={<TerminosPage />} />

      {/* ═══ REDIRECCIONES DE MODALES ═══ */}
      <Route path="/login" element={<Navigate to="/?auth=login" replace />} />
      <Route path="/registro" element={<Navigate to="/?auth=register" replace />} />
      <Route path="/recuperar" element={<Navigate to="/?auth=recuperar" replace />} />

      {/* ═══ RUTAS PROTEGIDAS ═══ */}
      <Route element={<RutaProtegida />}>
        <Route element={<AppLayout />}>
          <Route element={<StreamVerseLayout />}>
            <Route path="/inicio" element={<InicioPage />} />
            <Route path="/peliculas" element={<PeliculasPage />} />
            <Route path="/musica" element={<MusicaPage />} />
            <Route path="/en-vivo" element={<EnVivoPage />} />
            <Route path="/deportes" element={<DeportesPage />} />
            <Route path="/buscar" element={<BuscarPage />} />
            <Route path="/biblioteca" element={<BibliotecaPage />} />
            <Route path="/reproductor/:id" element={<ReproductorPage />} />
            <Route path="/perfil" element={<PerfilPage />} />

            <Route path="/checkout/:slug" element={<CheckoutPage />} />
            <Route path="/mis-pedidos" element={<PedidosPage />} />

            {/* Administración (solo rol administrador) */}
            <Route element={<RutaAdmin />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="usuarios" element={<UsuariosPage />} />
                <Route path="juegos" element={<JuegosPage />} />
                <Route path="plataformas" element={<PlataformasPageAdmin />} />
                <Route path="contenidos" element={<ContenidosPage />} />
                <Route path="pedidos" element={<PedidosPageAdmin />} />
                <Route path="auditoria" element={<AuditoriaPage />} />
              </Route>
            </Route>
          </Route>

          {/* GameZone: sitio propio con su cabecera, cuerpo y pie */}
          <Route element={<GameZoneLayout />}>
            <Route path="/gamezone" element={<GameZonePage />} />
            <Route path="/gamezone/categoria/:categoria" element={<GameZoneCategoriaPage />} />
            <Route path="/gamezone/:slug" element={<GameZoneFichaPage />} />
          </Route>
        </Route>
      </Route>

      {/* ═══ REDIRECCIONES DE RUTAS ANTIGUAS ═══ */}
      <Route path="/juegos" element={<Navigate to="/gamezone" replace />} />
      <Route path="/juegos/categoria/:categoria" element={<Navigate to="/gamezone/categoria/:categoria" replace />} />
      <Route path="/juegos/pedidos" element={<Navigate to="/mis-pedidos" replace />} />
      <Route path="/juegos/checkout/:slug" element={<Navigate to="/checkout/:slug" replace />} />
      <Route path="/juegos/:slug" element={<Navigate to="/gamezone/:slug" replace />} />
      <Route path="/videojuegos" element={<Navigate to="/gamezone" replace />} />
      <Route path="/videojuegos/categoria/:categoria" element={<Navigate to="/gamezone/categoria/:categoria" replace />} />
      <Route path="/videojuegos/:slug" element={<Navigate to="/gamezone/:slug" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}