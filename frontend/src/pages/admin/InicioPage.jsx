import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import GameZoneAccesoCard from '../../components/public/GameZoneAccesoCard.jsx';
import TarjetaPlataforma from '../../components/public/TarjetaPlataforma.jsx';
import usePlataformas from '../../hooks/usePlataformas.js';
import useTituloPagina from '../../hooks/useTituloPagina.js';
import { FICHAS } from '../../services/fichasEstaticas.js';
import { HERO_LOGO_URL } from '../../services/informacionSitio.js';
import { PLATAFORMAS_ESTATICAS } from '../../services/plataformasEstaticas.js';
import { listarPlataformas } from '../../services/plataformasService.js';

// Valores de respaldo del hero mientras la API responde (nada de cifras inventadas).
const JUEGOS_POR_DEFECTO = Object.keys(FICHAS).length;
const PLATAFORMAS_POR_DEFECTO = PLATAFORMAS_ESTATICAS.length;

function EncabezadoSeccion({ icono, titulo, subtitulo }) {
  return (
    <div className="pb-4 mb-6 border-b border-[rgba(102,126,234,.2)]">
      <h1 className="sv-section-title mb-1"><i className={`${icono} mr-2 sv-text-gradient`}></i>{titulo}</h1>
      <p className="text-[#94a3b8] text-sm m-0">{subtitulo}</p>
    </div>
  );
}

function Tarjetas({ datos, rejilla }) {
  return (
    <div className={rejilla}>
      {datos.map((p) => (
        <TarjetaPlataforma key={p.id} p={p} />
      ))}
    </div>
  );
}

export default function InicioPage() {
  useTituloPagina('OpenLeaf — Tu Portal de Entretenimiento Total');
  const { datos: peliculas } = usePlataformas('peliculas');
  const { datos: musica } = usePlataformas('musica');
  const { datos: vivo } = usePlataformas('en_vivo');

  const [stats, setStats] = useState({ juegos: null, plataformas: null });

  useEffect(() => {
    let vivo = true;

    listarPlataformas()
      .then((todas) => {
        if (vivo) setStats((s) => ({ ...s, plataformas: todas.length }));
      })
      .catch(() => {
        // sin sesión o API caída: se conservan las etiquetas con valor neutro
      });

    return () => {
      vivo = false;
    };
  }, []);

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="sv-hero-section" id="inicio">
        <div className="sv-hero-text">
          <span className="sv-hero-badge inline-flex items-center gap-2 px-4 py-1 rounded-full text-[0.73rem] font-bold uppercase tracking-widest mb-4">
            <i className="fas fa-bolt"></i> Nuevo · Todo en un lugar
          </span>
          <h1 className="sv-hero-title font-black leading-tight mb-5">
            Todas tus plataformas favoritas en un solo lugar
          </h1>
          <p className="text-[#94a3b8] text-lg leading-relaxed mb-8">
            Accede a Netflix, Prime Video, HBO Max, Disney+, Apple TV+, Paramount+, Peacock, YouTube, Spotify y muchas más desde un único portal.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/gamezone" className="btn-sv-primary"><i className="fas fa-gamepad"></i> Explorar juegos</Link>
            <Link to="?panel=info" className="btn-sv-secondary"><i className="fas fa-info-circle"></i> Más Info</Link>
          </div>
        </div>
        <div className="sv-hero-visual-wrap">
          <div className="sv-hv-bg-glow"></div>
          <div className="sv-hv-center-logo">
            <img src={HERO_LOGO_URL} alt="OpenLeaf Logo" className="sv-hv-logo-main" />
            <div className="sv-hv-logo-glow"></div>
            <div className="sv-hv-logo sv-hv-l1"><img src="https://images.ctfassets.net/4cd45et68cgf/Rx83JoRDMkYNlMC9MKzcB/2b14d5a59fc3937afd3f03191e19502d/Netflix-Symbol.png?w=80" alt="Netflix" /></div>
            <div className="sv-hv-logo sv-hv-l2"><img src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" alt="Spotify" /></div>
            <div className="sv-hv-logo sv-hv-l3"><img src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" alt="YouTube" /></div>
            <div className="sv-hv-logo sv-hv-l4"><img src="https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg" alt="Prime" /></div>
            <div className="sv-hv-logo sv-hv-l5"><img src="https://upload.wikimedia.org/wikipedia/commons/d/d3/Twitch_Glitch_Logo_Purple.svg" alt="Twitch" /></div>
            <div className="sv-hv-logo sv-hv-l6"><img src="https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg" alt="HBO" /></div>
            <div className="sv-hv-badge sv-hv-b1"><i className="fas fa-gamepad"></i><span>{stats.juegos ?? JUEGOS_POR_DEFECTO} juegos</span></div>
            <div className="sv-hv-badge sv-hv-b2"><i className="fas fa-star"></i><span>{stats.plataformas ?? PLATAFORMAS_POR_DEFECTO} plataformas</span></div>
          </div>
        </div>
      </section>

      {/* ═══ GAMEZONE (acceso) ═══ */}
      <section className="py-6 px-4">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
            <div className="pb-0 mb-0">
              <h2 className="sv-section-title mb-1"><i className="fas fa-gamepad mr-2 sv-text-gradient"></i>GameZone</h2>
              <p className="text-[#94a3b8] text-sm m-0">Las tarjetas de acceso quedaron iguales a GameZone</p>
            </div>
            <Link to="/gamezone" className="btn-sv-secondary text-sm py-2 px-5">
              Ver todo GameZone <i className="fas fa-arrow-right ml-1"></i>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            <GameZoneAccesoCard />
          </div>
        </div>
      </section>

      {/* ═══ ACCESOS RÁPIDOS ═══ */}
      <section className="py-6 px-4">
        <div className="max-w-[1600px] mx-auto grid grid-cols-3 sm:grid-cols-6 gap-3">
          <a href="#peliculas" className="sv-quick-card"><span className="sv-quick-icon"><i className="fas fa-film"></i></span><span className="text-[0.83rem] font-bold">Películas</span></a>
          <a href="#musica" className="sv-quick-card"><span className="sv-quick-icon"><i className="fas fa-music"></i></span><span className="text-[0.83rem] font-bold">Música</span></a>
          <a href="#live" className="sv-quick-card"><span className="sv-quick-icon"><i className="fas fa-satellite-dish"></i></span><span className="text-[0.83rem] font-bold">En Vivo</span></a>
          <Link to="/deportes" className="sv-quick-card"><span className="sv-quick-icon"><i className="fas fa-futbol"></i></span><span className="text-[0.83rem] font-bold">Deportes</span></Link>
          <Link to="/gamezone" className="sv-quick-card"><span className="sv-quick-icon"><i className="fas fa-gamepad"></i></span><span className="text-[0.83rem] font-bold">GameZone</span></Link>
          <Link to="/buscar" className="sv-quick-card"><span className="sv-quick-icon"><i className="fas fa-magnifying-glass"></i></span><span className="text-[0.83rem] font-bold">Buscar</span></Link>
        </div>
      </section>

      {/* ═══ LAYOUT PRINCIPAL ═══ */}
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-6 flex gap-6">

        {/* SIDEBAR */}
        <aside className="sv-sidebar hidden lg:flex flex-col w-52 flex-shrink-0 sticky top-[76px] self-start">
          <p className="uppercase font-bold text-[0.68rem] tracking-[1.5px] text-[#94a3b8] mb-4 flex items-center gap-2">
            <i className="fas fa-list text-[#6366f1]"></i>Categorías
          </p>
          <nav className="flex flex-col gap-1">
            <a href="#peliculas" className="sv-sidebar-link"><i className="fas fa-film text-[#6366f1]"></i> Películas y Series</a>
            <a href="#musica" className="sv-sidebar-link"><i className="fas fa-music text-[#8b5cf6]"></i> Música</a>
            <a href="#live" className="sv-sidebar-link"><i className="fas fa-satellite-dish text-[#ec4899]"></i> En Vivo</a>
            <Link to="/deportes" className="sv-sidebar-link"><i className="fas fa-futbol text-cyan-400"></i> Deportes</Link>
            <Link to="/gamezone" className="sv-sidebar-link"><i className="fas fa-gamepad text-purple-400"></i> GameZone</Link>
            <Link to="/peliculas" className="sv-sidebar-link"><i className="fas fa-th text-lime-400"></i> Ver Todo</Link>
          </nav>
          <div className="sv-sidebar-promo mt-5 p-5 rounded-xl text-center text-white">
            <i className="fas fa-star text-lg mb-2 block"></i>
            <p className="font-bold text-sm mb-1">Explora más</p>
            <p className="text-[0.78rem] opacity-80 mb-4">Descubre todas las plataformas</p>
            <Link to="/peliculas" className="btn-sv-visit block text-center text-sm"><i className="fas fa-arrow-right mr-1"></i>Ver Todo</Link>
          </div>
        </aside>

        {/* CONTENIDO */}
        <div className="flex-1 min-w-0">

          <section id="peliculas" className="mb-12">
            <EncabezadoSeccion
              icono="fas fa-film"
              titulo="Plataformas de Video Streaming"
              subtitulo="Pasa el cursor sobre la tarjeta para ver más detalles"
            />
            <Tarjetas
              datos={peliculas}
              rejilla="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5"
            />
          </section>

          <section id="musica" className="mb-12">
            <EncabezadoSeccion
              icono="fas fa-music"
              titulo="Plataformas de Música"
              subtitulo="Escucha millones de canciones, podcasts y descubre nuevos artistas"
            />
            <Tarjetas
              datos={musica}
              rejilla="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            />
          </section>

          <section id="live" className="mb-12">
            <EncabezadoSeccion
              icono="fas fa-satellite-dish"
              titulo="Video y Contenido en Vivo"
              subtitulo="Transmisiones en vivo, tutoriales y entretenimiento sin límites"
            />
            <Tarjetas
              datos={vivo}
              rejilla="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
            />
          </section>

        </div>
      </div>
    </>
  );
}