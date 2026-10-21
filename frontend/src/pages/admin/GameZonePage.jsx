import { useState } from 'react';
import { Link } from 'react-router-dom';

import GameZoneSidebar from '../../components/public/GameZoneSidebar.jsx';
import useTituloPagina from '../../hooks/useTituloPagina.js';
import { FICHAS } from '../../services/fichasEstaticas.js';

const TARJETA_BASE =
  'gcard relative overflow-hidden rounded-[14px] border border-white/[.07] h-full transition-all duration-300 hover:border-accent hover:shadow-[0_0_30px_rgba(3,218,198,.22)] hover:-translate-y-[3px] hover:z-[5]';

const BADGE_CATEGORIA =
  'inline-block text-[.62rem] font-bold tracking-[1.8px] uppercase border border-primary text-primary bg-black/55 px-2.5 py-0.5 rounded-full mb-1';

const BOTON_VER =
  'inline-flex items-center gap-1 bg-gradient-to-r from-primary to-[#9965f4] text-white no-underline px-3.5 py-1.5 rounded-full text-xs font-bold transition-all hover:brightness-125 hover:scale-105';

// Orden y estilos de los 12 slots del grid editorial (Sitio-Tailwind/index.html).
const EDITORIAL = [
  {
    slug: 'gow',
    slot: 'slot-hero',
    destacado: true,
    categoria: 'Acción',
    titulo: 'God of War\nRagnarök',
    tituloClase: 'text-[2.6rem]',
    desc: 'Kratos y Atreus se adentran en los reinos nórdicos para enfrentar el destino de los dioses en una épica odisea mitológica.',
    descClase: 'text-[.9rem]',
    padding: 'p-6',
    cta: 'Ver Juego'
  },
  {
    slug: 'horizon',
    slot: 'slot-tall',
    categoria: 'Acción',
    titulo: 'Horizon Zero Dawn',
    tituloClase: 'text-[1.55rem]',
    desc: 'Un mundo abierto salvaje lleno de peligros y misterios oscuros.',
    descClase: 'text-sm',
    padding: 'p-4',
    cta: 'Ver Juego'
  },
  {
    slug: 'residentevil',
    slot: 'slot-small',
    categoria: 'Terror',
    titulo: 'Resident Evil Village',
    tituloClase: 'text-base',
    padding: 'p-2.5',
    cta: 'Ver'
  },
  {
    slug: 'halo',
    slot: 'slot-wide',
    categoria: 'Acción',
    titulo: 'Halo Infinite',
    tituloClase: 'text-[1.7rem]',
    desc: 'El Jefe Maestro regresa para enfrentarse a los Desterrados en el conflicto más épico del universo.',
    descClase: 'text-sm',
    padding: 'p-4',
    cta: 'Ver Juego'
  },
  {
    slug: 'ittakestwo',
    slot: 'slot-med',
    categoria: 'Co-op',
    titulo: 'It Takes Two',
    tituloClase: 'text-[1.25rem]',
    desc: 'Embárcate en la aventura cooperativa de tu vida.',
    descClase: 'text-sm',
    padding: 'p-4',
    cta: 'Ver'
  },
  {
    slug: 'awayout',
    slot: 'slot-thin',
    categoria: 'Co-op',
    titulo: 'A Way Out',
    tituloClase: 'text-base',
    padding: 'p-2.5',
    cta: 'Ver'
  },
  {
    slug: 'callofduty',
    slot: 'slot-thin2',
    categoria: 'Acción',
    titulo: 'Call of Duty WWII',
    tituloClase: 'text-base',
    padding: 'p-2.5',
    cta: 'Ver'
  },
  {
    slug: 'fc',
    slot: 'slot-quarter',
    categoria: 'Deportes',
    titulo: 'FC 2026',
    tituloClase: 'text-[1.15rem]',
    desc: 'La simulación de fútbol más realista hasta la fecha.',
    descClase: 'text-[.78rem]',
    padding: 'p-4',
    cta: 'Ver'
  },
  {
    slug: 'efootball',
    slot: 'slot-quarter',
    categoria: 'Deportes',
    titulo: 'eFootball',
    tituloClase: 'text-[1.15rem]',
    desc: 'Una evolución del clásico PES con motor renovado.',
    descClase: 'text-[.78rem]',
    padding: 'p-4',
    cta: 'Ver'
  },
  {
    slug: 'uncharted4',
    slot: 'slot-quarter',
    categoria: 'Acción',
    titulo: 'Uncharted: Legacy of Thieves',
    tituloClase: 'text-[1.15rem]',
    desc: 'Colección remasterizada de dos joyas de la saga Uncharted.',
    descClase: 'text-[.78rem]',
    padding: 'p-4',
    cta: 'Ver Juego',
    posicionObjeto: 'center 30%'
  },
  {
    slug: 'gridlegends',
    slot: 'slot-quarter',
    categoria: 'Deportes',
    titulo: 'GRID Legends',
    tituloClase: 'text-[1.15rem]',
    desc: 'Carreras arcade de alta velocidad y adrenalina pura.',
    descClase: 'text-[.78rem]',
    padding: 'p-4',
    cta: 'Ver'
  },
  {
    slug: 'nba2k26',
    slot: 'slot-quarter',
    categoria: 'Deportes',
    titulo: 'NBA2K 2026',
    tituloClase: 'text-[1.15rem]',
    desc: 'La simulación de baloncesto más realista del año.',
    descClase: 'text-[.78rem]',
    padding: 'p-4',
    cta: 'Ver'
  }
];

export default function GameZonePage() {
  useTituloPagina('GameZone | Tu portal de Videojuegos');
  const [busqueda, setBusqueda] = useState('');
  const [lightbox, setLightbox] = useState(null);

  // Filtra los juegos en la propia página, sin salir de GameZone.
  const termino = busqueda.trim().toLowerCase();
  const juegosFiltrados = termino
    ? EDITORIAL.filter((juego) => {
        const texto = `${juego.titulo} ${juego.categoria} ${juego.desc || ''}`.toLowerCase();
        return texto.includes(termino);
      })
    : EDITORIAL;

  return (
    <>
      {/* HEADER */}
      <header className="site-header">
        <div className="header-bg"></div>

        <div className="header-content">
          <span className="header-eyebrow inline-flex items-center gap-2 font-sans text-[.72rem] font-bold tracking-[4px] uppercase text-accent border-l-[3px] border-accent pl-2.5 mb-3.5">
            <i className="bi bi-controller"></i> Portal de Videojuegos — 2026
          </span>

          <h1
            className="header-title font-display leading-none tracking-widest text-white mb-4"
            style={{
              fontSize: 'clamp(3rem, 7vw, 5.5rem)',
              textShadow: '0 0 60px rgba(187,134,252,.4), 0 4px 20px rgba(0,0,0,.9)'
            }}
          >
            <span className="text-primary">Zona</span>
            <br />
            Gamer
          </h1>

          <p className="header-desc font-sans text-base text-white/60 leading-relaxed max-w-[460px] mb-6">
            Explora nuestra colección con los mejores títulos del gaming. Analizamos
            jugabilidad, gráficos e historia para traerte solo lo mejor.
          </p>

          <div className="header-badges flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 border border-accent text-accent bg-accent/10 rounded-full px-4 py-1 text-xs font-bold font-sans tracking-wide transition-all hover:bg-accent/20 hover:shadow-[0_0_16px_rgba(3,218,198,.4)]">
              <i className="bi bi-joystick"></i> 12 Juegos
            </span>
            <span className="inline-flex items-center gap-1 border border-accent text-accent bg-accent/10 rounded-full px-4 py-1 text-xs font-bold font-sans tracking-wide transition-all hover:bg-accent/20 hover:shadow-[0_0_16px_rgba(3,218,198,.4)]">
              <i className="bi bi-star-fill"></i> Top Rated
            </span>
            <span className="inline-flex items-center gap-1 border border-accent text-accent bg-accent/10 rounded-full px-4 py-1 text-xs font-bold font-sans tracking-wide transition-all hover:bg-accent/20 hover:shadow-[0_0_16px_rgba(3,218,198,.4)]">
              <i className="bi bi-lightning-fill"></i> Actualizado 2026
            </span>
            <span className="inline-flex items-center gap-1 border border-accent text-accent bg-accent/10 rounded-full px-4 py-1 text-xs font-bold font-sans tracking-wide transition-all hover:bg-accent/20 hover:shadow-[0_0_16px_rgba(3,218,198,.4)]">
              <i className="bi bi-globe"></i> Multi-plataforma
            </span>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="header-search-wrap absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[4] flex-col items-center gap-2.5 w-[340px]">
          <span className="font-sans text-[.65rem] font-bold tracking-[3px] uppercase text-white/35">
            <i className="bi bi-search me-1"></i>Buscar juego
          </span>
          <div className="search-box relative w-full">
            <input
              type="text"
              id="gameSearch"
              placeholder="Ej: God of War, FIFA..."
              autoComplete="off"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
              className="w-full bg-black/55 border border-primary/35 rounded-full py-3 pl-5 pr-12 font-sans text-[.95rem] font-semibold text-white outline-none backdrop-blur-xl placeholder:text-white/30 transition-all focus:border-primary focus:shadow-[0_0_20px_rgba(187,134,252,.35),0_0_40px_rgba(187,134,252,.1)]"
            />
            <i className="bi bi-search search-icon absolute right-4 top-1/2 -translate-y-1/2 text-primary/60 pointer-events-none transition-colors"></i>
          </div>
          <span
            id="searchCount"
            className="font-sans text-[.72rem] font-semibold text-accent/70 tracking-wide min-h-[18px]"
          >
            {termino
              ? `${juegosFiltrados.length} ${juegosFiltrados.length === 1 ? 'juego encontrado' : 'juegos encontrados'}`
              : 'Escribe para filtrar los juegos'}
          </span>
        </div>

        {/* FLOATING DECO */}
        <div className="header-deco absolute right-20 top-1/2 -translate-y-1/2 z-[3]">
          <div className="header-deco-ring"></div>
          <div className="header-deco-ring2"></div>
          <i className="bi bi-controller header-deco-icon"></i>
        </div>

        {/* STATS STRIP */}
        <div className="header-stats-strip absolute bottom-0 left-0 right-0 z-[3] flex border-t border-primary/15 bg-black/60 backdrop-blur-xl">
          {[
            { valor: '12', etiqueta: 'Juegos' },
            { valor: '5', etiqueta: 'Categorías' },
            { valor: '9.8', etiqueta: 'Puntuación máx.' },
            { valor: '4', etiqueta: 'Plataformas' },
            { valor: '2026', etiqueta: 'Temporada' }
          ].map((dato, indice) => (
            <div
              key={dato.etiqueta}
              className={`flex-1 text-center py-3 px-4 ${indice < 4 ? 'border-r border-white/[.07]' : ''}`}
            >
              <span className="block font-display text-[1.55rem] text-primary tracking-widest leading-none">
                {dato.valor}
              </span>
              <span className="font-sans text-[.58rem] text-white/40 uppercase tracking-widest">
                {dato.etiqueta}
              </span>
            </div>
          ))}
        </div>
      </header>

      {/* LAYOUT */}
      <div className="flex">
        <GameZoneSidebar activa="todos" />

        {/* MAIN */}
        <main className="flex-1 p-4 xl:p-8 min-w-0">
          <div className="section-heading-wrap flex items-center gap-3 mb-5">
            <i className="bi bi-grid-3x3-gap-fill text-lg text-accent"></i>
            <h2 className="font-display text-3xl text-primary tracking-widest">
              Todos los Juegos
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-primary/40 to-transparent"></div>
            <span className="text-gray-500 text-xs">
              {juegosFiltrados.length} {juegosFiltrados.length === 1 ? 'título' : 'títulos'}
            </span>
          </div>

          <div className="game-grid">
            {juegosFiltrados.map((item) => {
              const ficha = FICHAS[item.slug];
              return (
                <div key={item.slug} className={`${item.slot}`}>
                  <div className={`${TARJETA_BASE}${item.destacado ? ' hero-card' : ''}`}>
                    {item.destacado && (
                      <span className="featured-badge absolute top-3.5 left-0 z-10 inline-flex items-center gap-1.5 bg-gradient-to-r from-accent/20 to-transparent border-l-[3px] border-accent text-accent text-[.68rem] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-r-[4px]">
                        <i className="bi bi-star-fill"></i>DESTACADO
                      </span>
                    )}
                    <button
                      type="button"
                      className="block w-full h-full cursor-pointer p-0 border-0 bg-transparent"
                      onClick={() => setLightbox(ficha.caratula)}
                      aria-label={`Ver imagen de ${ficha.titulo}`}
                    >
                      <img
                        src={ficha.caratula}
                        alt={ficha.titulo}
                        className="w-full h-full object-cover block"
                        style={item.posicionObjeto ? { objectPosition: item.posicionObjeto } : undefined}
                      />
                    </button>
                    <div className="gcard-overlay absolute inset-0 bg-gradient-to-t from-black/93 via-black/48 to-black/5 pointer-events-none"></div>
                    <div className={`absolute bottom-0 left-0 right-0 ${item.padding}`}>
                      <span className={BADGE_CATEGORIA}>{item.categoria}</span>
                      <h3
                        className={`font-display ${item.tituloClase} leading-none text-white mb-1 whitespace-pre-line`}
                        style={{ textShadow: '0 2px 10px rgba(0,0,0,.9)' }}
                      >
                        {item.titulo}
                      </h3>
                      {item.desc && (
                        <p className={`gcard-desc${item.destacado ? ' hero-card' : ''} font-sans text-white/75 ${item.descClase} leading-snug mb-2`}>
                          {item.desc}
                        </p>
                      )}
                      <Link to={`/gamezone/${item.slug}`} className={BOTON_VER}>
                        <i className="bi bi-play-fill"></i>
                        {item.cta}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {juegosFiltrados.length === 0 && (
            <p className="text-center font-sans text-white/50 py-10">
              No se encontraron juegos para «{busqueda.trim()}».
            </p>
          )}

          <p className="text-gray-600 text-xs mt-8 pt-3 border-t border-white/[.05]">
            Desarrollado por: <strong className="text-gray-400">SAMB</strong>
          </p>
        </main>
      </div>

      {/* LIGHTBOX */}
      <div
        className={`lightbox fixed inset-0 z-[2000] flex justify-center items-center bg-black/55 backdrop-blur-2xl ${lightbox ? 'is-open' : ''}`}
      >
        <a
          className="absolute inset-0 cursor-default"
          onClick={() => setLightbox(null)}
        ></a>
        <div className="relative w-[80vw] max-w-[700px] text-center z-10">
          {lightbox && (
            <img
              src={lightbox}
              alt=""
              className="lb-img w-full rounded-2xl border-2 border-primary shadow-[0_0_60px_rgba(187,134,252,.4)]"
            />
          )}
          <a
            className="block mt-3 text-gray-400 font-bold no-underline hover:text-primary text-sm cursor-pointer"
            onClick={() => setLightbox(null)}
          >
            &#x2715; Cerrar
          </a>
        </div>
      </div>
    </>
  );
}
