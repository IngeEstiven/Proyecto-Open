import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

import css from '../assets/gamezone.css?inline';
import UserMenu from '../components/public/UserMenu.jsx';
import { useInlineStyle } from '../hooks/useInlineStyle.js';
import {
  EMAIL_CONTACTO,
  TELEFONO_CONTACTO
} from '../services/informacionSitio.js';

const NAV_ENLACES = [
  { to: '/gamezone', texto: 'Inicio', fin: true },
  { to: '/gamezone/categoria/accion', texto: 'Acción' },
  { to: '/gamezone/categoria/terror', texto: 'Terror' },
  { to: '/gamezone/categoria/deportes', texto: 'Deportes' },
  { to: '/gamezone/categoria/cooperativo', texto: 'Co-op' }
];

const NAV_BASE = 'block px-3 py-2 text-sm font-bold rounded transition-all border';

function claseNav(activo) {
  return activo
    ? `${NAV_BASE} border-primary text-primary bg-primary/10 shadow-[0_0_10px_rgba(187,134,252,.4)]`
    : `${NAV_BASE} border-transparent hover:text-primary hover:bg-primary/10 hover:border-primary`;
}

export default function GameZoneLayout() {
  useInlineStyle('gamezone', css);
  const ubicacion = useLocation();

  const [intro, setIntro] = useState(true);
  const [navAbierto, setNavAbierto] = useState(false);
  const [modalMapa, setModalMapa] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIntro(false), 1950);
    return () => clearTimeout(t);
  }, []);

  // Al navegar se cierra el menú móvil y el modal.
  useEffect(() => {
    setNavAbierto(false);
    setModalMapa(false);
  }, [ubicacion.pathname]);

  useEffect(() => {
    const alTeclado = (evento) => {
      if (evento.key === 'Escape') {
        setNavAbierto(false);
        setModalMapa(false);
      }
    };
    window.addEventListener('keydown', alTeclado);
    return () => window.removeEventListener('keydown', alTeclado);
  }, []);

  const correoDisponible = EMAIL_CONTACTO && EMAIL_CONTACTO !== 'Próximamente';
  const telefonoDisponible = TELEFONO_CONTACTO && TELEFONO_CONTACTO !== 'Próximamente';

  return (
    <div className="gz-root min-h-screen overflow-x-hidden text-gray-200 font-sans">
      {/* INTRO SCREEN */}
      {intro && (
        <div id="intro-screen">
          <span className="intro-logo">
            <i className="bi bi-joystick" style={{ marginRight: 10 }}></i>GameZone
          </span>
          <div className="intro-bar"></div>
          <span className="intro-sub">Cargando experiencia gamer...</span>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="gz-navbar sticky top-0 z-50 h-[68px] flex items-center bg-black/75 backdrop-blur-2xl border-b border-primary/25 shadow-[0_4px_30px_rgba(0,0,0,.6)]">
        <div className="w-full px-5 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/gamezone"
              className="flex items-center gap-2 font-display text-3xl tracking-widest text-primary drop-shadow-[0_0_14px_rgba(187,134,252,.6)]"
            >
              <i className="bi bi-joystick text-2xl"></i>GameZone
            </Link>

            {/* Botón de regreso a OpenLeaf (mismo estilo de GameZone) */}
            <Link
              to="/inicio"
              title="Volver a OpenLeaf"
              aria-label="Volver a OpenLeaf"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-primary/40 text-primary text-sm font-bold hover:bg-primary/10 hover:border-primary transition-all whitespace-nowrap"
            >
              <i className="bi bi-arrow-left"></i>
              <span className="hidden sm:inline">Volver a OpenLeaf</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <ul
              id="navMenu"
              className={`${navAbierto ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row items-start lg:items-center gap-1 absolute lg:static top-[68px] left-0 w-full lg:w-auto bg-black/95 lg:bg-transparent px-4 lg:px-0 py-3 lg:py-0 z-50`}
            >
              <li>
                <button
                  type="button"
                  className={`${NAV_BASE} border-transparent w-full text-left hover:text-primary hover:bg-primary/10 hover:border-primary`}
                  onClick={() => setModalMapa(true)}
                >
                  <i className="bi bi-geo-alt-fill me-1"></i>Encuéntranos
                </button>
              </li>
              <li>
                <a
                  href="https://steamcommunity.com/?l=spanish"
                  target="_blank"
                  rel="noreferrer"
                  className={`${NAV_BASE} border-transparent hover:text-primary hover:bg-primary/10 hover:border-primary`}
                >
                  <i className="bi bi-steam me-1"></i>Steam
                </a>
              </li>
              {NAV_ENLACES.map((enlace) => (
                <li key={enlace.to}>
                  <NavLink to={enlace.to} end={enlace.fin} className={({ isActive }) => claseNav(isActive)}>
                    {enlace.texto}
                  </NavLink>
                </li>
              ))}
            </ul>

            <UserMenu />
            <button
              id="navToggle"
              type="button"
              className="lg:hidden border border-primary/40 rounded p-1 text-gray-200"
              onClick={() => setNavAbierto((v) => !v)}
              aria-label="Abrir menú"
            >
              <i className="bi bi-list text-2xl"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* CONTENIDO */}
      <Outlet />

      {/* MODAL MAPA */}
      <div className={`modal-overlay fixed inset-0 z-[9999] flex justify-center items-center bg-black/88 backdrop-blur-xl ${modalMapa ? 'is-open' : ''}`}>
        <a className="absolute inset-0 cursor-default" onClick={() => setModalMapa(false)}></a>
        <div className="modal-box relative bg-[#1a1a1a] w-[95%] max-w-[580px] p-7 rounded-2xl border-2 border-primary shadow-[0_0_40px_rgba(187,134,252,.3)]">
          <a
            className="absolute top-4 right-5 text-2xl text-gray-400 no-underline hover:text-white leading-none cursor-pointer"
            onClick={() => setModalMapa(false)}
          >
            &times;
          </a>
          <h2 className="text-accent mt-0 mb-1 font-display text-2xl tracking-widest">
            <i className="bi bi-geo-alt-fill me-2"></i>Nuestra Sede
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            C.C. Viva Tunja: <strong className="text-gray-200">Av Universitaria, Tunja, Boyacá</strong>
          </p>
          <div className="rounded-xl overflow-hidden aspect-video">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1180.605448591356!2d-73.34544206593492!3d5.5570047166545224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e6a7d6072b25591%3A0xa1b4bf6452764811!2sCentro%20Comercial%20Viva%20Tunja!5e0!3m2!1ses-419!2sco!4v1772168506457!5m2!1ses-419!2sco"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              title="Ubicación GameZone"
            ></iframe>
          </div>
          <div className="text-center mt-4">
            <a
              className="inline-block bg-gradient-to-r from-primary to-[#9965f4] text-white no-underline px-6 py-2 rounded-full text-sm font-bold hover:brightness-125 transition-all cursor-pointer"
              onClick={() => setModalMapa(false)}
            >
              Entendido
            </a>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer
        className="relative mt-8 overflow-hidden border-t border-primary/20"
        style={{ background: 'linear-gradient(135deg, rgba(10,10,10,.98) 0%, rgba(20,10,30,.98) 100%)' }}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"></div>
        <div
          className="absolute inset-0 pointer-events-none opacity-[.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 39px, #bb86fc 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, #bb86fc 40px)'
          }}
        ></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            {/* COL 1: Marca + Contacto */}
            <div>
              <Link
                to="/gamezone"
                className="inline-flex items-center gap-2 font-display text-2xl tracking-widest text-primary mb-4 drop-shadow-[0_0_12px_rgba(187,134,252,.5)]"
              >
                <i className="bi bi-joystick"></i>GameZone
              </Link>
              <p className="font-sans text-gray-400 text-sm leading-relaxed mb-5">
                Tu portal de videojuegos. Analizamos jugabilidad, gráficos e historia para traerte
                solo lo mejor del gaming. Una sección de OpenLeaf.
              </p>
              <h4 className="font-sans text-[.65rem] font-bold uppercase tracking-[3px] text-accent mb-3 border-b border-accent/20 pb-2">
                Contacto
              </h4>
              <ul className="flex flex-col gap-2">
                <li className="flex items-center gap-2 font-sans text-sm text-gray-400 hover:text-white transition-colors">
                  <i className="bi bi-telephone-fill text-primary text-xs"></i>
                  {telefonoDisponible ? (
                    <a href={`tel:${TELEFONO_CONTACTO.replace(/\s/g, '')}`} className="no-underline text-gray-400 hover:text-white transition-colors">
                      {TELEFONO_CONTACTO}
                    </a>
                  ) : (
                    <span>{TELEFONO_CONTACTO}</span>
                  )}
                </li>
                <li className="flex items-center gap-2 font-sans text-sm text-gray-400 hover:text-white transition-colors">
                  <i className="bi bi-envelope-fill text-primary text-xs"></i>
                  {correoDisponible ? (
                    <a href={`mailto:${EMAIL_CONTACTO}`} className="no-underline text-gray-400 hover:text-white transition-colors break-all">
                      {EMAIL_CONTACTO}
                    </a>
                  ) : (
                    <span>{EMAIL_CONTACTO}</span>
                  )}
                </li>
                <li className="flex items-center gap-2 font-sans text-sm text-gray-400">
                  <i className="bi bi-geo-alt-fill text-primary text-xs"></i>
                  <button type="button" className="no-underline text-gray-400 hover:text-white transition-colors text-left cursor-pointer" onClick={() => setModalMapa(true)}>
                    C.C. Viva Tunja, Boyacá
                  </button>
                </li>
              </ul>
            </div>

            {/* COL 2: Categorías + Comunidad */}
            <div>
              <h4 className="font-sans text-[.65rem] font-bold uppercase tracking-[3px] text-accent mb-4 border-b border-accent/20 pb-2">
                Categorías
              </h4>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link to="/gamezone" className="footer-link font-sans text-sm text-gray-400 no-underline hover:text-primary transition-colors flex items-center gap-2">
                    <i className="bi bi-grid-fill text-xs text-primary/50"></i>Todos los Juegos
                  </Link>
                </li>
                <li>
                  <Link to="/gamezone/categoria/accion" className="footer-link font-sans text-sm text-gray-400 no-underline hover:text-primary transition-colors flex items-center gap-2">
                    <i className="bi bi-crosshair text-xs text-primary/50"></i>Acción / Shooter
                  </Link>
                </li>
                <li>
                  <Link to="/gamezone/categoria/terror" className="footer-link font-sans text-sm text-gray-400 no-underline hover:text-primary transition-colors flex items-center gap-2">
                    <i className="bi bi-moon-stars text-xs text-primary/50"></i>Terror / Suspenso
                  </Link>
                </li>
                <li>
                  <Link to="/gamezone/categoria/deportes" className="footer-link font-sans text-sm text-gray-400 no-underline hover:text-primary transition-colors flex items-center gap-2">
                    <i className="bi bi-trophy text-xs text-primary/50"></i>Deportes / Carreras
                  </Link>
                </li>
                <li>
                  <Link to="/gamezone/categoria/cooperativo" className="footer-link font-sans text-sm text-gray-400 no-underline hover:text-primary transition-colors flex items-center gap-2">
                    <i className="bi bi-people text-xs text-primary/50"></i>Co-op / Puzzle
                  </Link>
                </li>
              </ul>

              <h4 className="font-sans text-[.65rem] font-bold uppercase tracking-[3px] text-accent mt-7 mb-3 border-b border-accent/20 pb-2">
                Comunidad
              </h4>
              <ul className="flex flex-col gap-2">
                <li>
                  <a href="https://steamcommunity.com/?l=spanish" target="_blank" rel="noreferrer" className="font-sans text-sm text-gray-400 no-underline hover:text-primary transition-colors flex items-center gap-2">
                    <i className="bi bi-steam text-xs text-primary/50"></i>Comunidad Steam
                  </a>
                </li>
                <li>
                  <Link to="/inicio" className="font-sans text-sm text-gray-400 no-underline hover:text-primary transition-colors flex items-center gap-2">
                    <i className="bi bi-play-circle text-xs text-primary/50"></i>Volver a OpenLeaf
                  </Link>
                </li>
              </ul>
            </div>

            {/* COL 3: Redes sociales */}
            <div>
              <h4 className="font-sans text-[.65rem] font-bold uppercase tracking-[3px] text-accent mb-4 border-b border-accent/20 pb-2">
                Redes Sociales
              </h4>
              <div className="flex flex-col gap-3">
                <a href="https://twitter.com/game_zone2026" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl border border-white/[.06] bg-white/[.03] hover:border-primary/40 hover:bg-primary/5 transition-all group no-underline">
                  <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center border border-white/10 group-hover:border-primary/40 transition-colors">
                    <i className="bi bi-twitter-x text-sm text-gray-300 group-hover:text-primary transition-colors"></i>
                  </div>
                  <div>
                    <p className="font-sans text-xs text-gray-500 m-0 leading-none mb-0.5">Twitter / X</p>
                    <p className="font-sans text-sm text-gray-300 m-0 group-hover:text-white transition-colors">@game_zone2026</p>
                  </div>
                </a>

                <a href="https://instagram.com/Ur_gamezone_place" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl border border-white/[.06] bg-white/[.03] hover:border-pink-500/40 hover:bg-pink-500/5 transition-all group no-underline">
                  <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center border border-white/10 group-hover:border-pink-500/40 transition-colors">
                    <i className="bi bi-instagram text-sm text-gray-300 group-hover:text-pink-400 transition-colors"></i>
                  </div>
                  <div>
                    <p className="font-sans text-xs text-gray-500 m-0 leading-none mb-0.5">Instagram</p>
                    <p className="font-sans text-sm text-gray-300 m-0 group-hover:text-white transition-colors">@Ur_gamezone_place</p>
                  </div>
                </a>

                <a href="https://tiktok.com/@GAME_ZONE2026" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl border border-white/[.06] bg-white/[.03] hover:border-accent/40 hover:bg-accent/5 transition-all group no-underline">
                  <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center border border-white/10 group-hover:border-accent/40 transition-colors">
                    <i className="bi bi-tiktok text-sm text-gray-300 group-hover:text-accent transition-colors"></i>
                  </div>
                  <div>
                    <p className="font-sans text-xs text-gray-500 m-0 leading-none mb-0.5">TikTok</p>
                    <p className="font-sans text-sm text-gray-300 m-0 group-hover:text-white transition-colors">@GAME_ZONE2026</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/[.06] pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-sans text-xs text-gray-600 m-0">
              &copy; 2026 GameZone &middot; Pasión por los videojuegos &middot; Una sección de OpenLeaf
            </p>
            <p className="font-sans text-xs text-gray-600 m-0">
              Desarrollado por <strong className="text-gray-400 font-semibold">SAMB</strong> · <span className="text-primary/60">USANTOTO</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
