import BloqueContenidos from '../../components/admin/BloqueContenidos.jsx';
import usePlataformas from '../../hooks/usePlataformas.js';
import useTituloPagina from '../../hooks/useTituloPagina.js';

// ── Contenido fijo de deportes.html que no vive en PLATAFORMAS_ESTATICAS ──

const DIAPOSITIVAS = [
  {
    id: 'ds1',
    imagen: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=1400&q=85',
    alt: 'ESPN+',
    badge: { texto: 'ESPN+', fondo: '#e50914', color: '#fff' },
    titulo: 'Todos los Deportes en Un Lugar',
    texto: 'NFL, NBA, MLB, UFC, Fútbol y mucho más en vivo',
    sitio: 'https://www.espn.com/espnplus/',
    botonIcono: 'fas fa-play',
    botonTexto: 'Ver ESPN+',
    anterior: 'ds3',
    siguiente: 'ds2'
  },
  {
    id: 'ds2',
    imagen: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1400&q=85',
    alt: 'NBA LEAGUE PASS',
    badge: { texto: 'NBA LEAGUE PASS', fondo: '#1d428a', color: '#fff' },
    titulo: 'Baloncesto Sin Límites',
    texto: 'Todos los partidos de la mejor liga del mundo',
    sitio: 'https://www.nba.com/league-pass',
    botonIcono: 'fas fa-basketball',
    botonTexto: 'Ver NBA',
    anterior: 'ds1',
    siguiente: 'ds3'
  },
  {
    id: 'ds3',
    imagen: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=1400&q=85',
    alt: 'F1 TV PRO',
    badge: { texto: 'F1 TV PRO', fondo: '#e50914', color: '#fff' },
    titulo: 'Fórmula 1 · La Máxima Velocidad',
    texto: 'Todas las carreras, clasificaciones y documentales exclusivos',
    sitio: 'https://f1tv.formula1.com',
    botonIcono: 'fas fa-flag-checkered',
    botonTexto: 'Ver F1 TV',
    anterior: 'ds2',
    siguiente: 'ds1'
  }
];

const ACCESOS_RAPIDOS = [
  { sitio: 'https://www.espn.com/espnplus/', icono: 'fas fa-trophy', texto: 'ESPN+' },
  { sitio: 'https://www.dazn.com', icono: 'fas fa-broadcast-tower', texto: 'DAZN' },
  { sitio: 'https://www.nba.com/league-pass', icono: 'fas fa-basketball', texto: 'NBA Pass' },
  { sitio: 'https://www.nfl.com/gamepass/', icono: 'fas fa-football', texto: 'NFL GamePass' },
  { sitio: 'https://www.fubo.tv', icono: 'fas fa-satellite', texto: 'FuboTV' },
  { sitio: 'https://f1tv.formula1.com', icono: 'fas fa-flag-checkered', texto: 'F1 TV Pro' }
];

const DISCIPLINAS = [
  { imagen: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=300&q=70', alt: 'Fútbol', icono: 'fas fa-futbol', nombre: 'Fútbol' },
  { imagen: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&q=70', alt: 'Basket', icono: 'fas fa-basketball', nombre: 'Basket' },
  { imagen: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&q=70', alt: 'Tenis', icono: 'fas fa-baseball', nombre: 'Tenis' },
  { imagen: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=300&q=70', alt: 'F1', icono: 'fas fa-flag-checkered', nombre: 'Fórmula 1' },
  { imagen: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=300&q=70', alt: 'Ciclismo', icono: 'fas fa-bicycle', nombre: 'Ciclismo' },
  { imagen: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=300&q=70', alt: 'Boxeo', icono: 'fas fa-fist-raised', nombre: 'Boxeo/MMA' }
];

const VIDEOS_ESPN = [
  { src: 'https://www.youtube.com/embed/GbpMiJwpBQ8', titulo: 'NFL Highlights 2024' },
  { src: 'https://www.youtube.com/embed/FXrL33nL4MA', titulo: 'NBA Best Plays' },
  { src: 'https://www.youtube.com/embed/hGsFCMnc_50', titulo: 'UFC Best Moments' }
];

const FEATS_DAZN = [
  { icono: 'fas fa-futbol', titulo: 'LaLiga', texto: 'Todos los partidos' },
  { icono: 'fas fa-fist-raised', titulo: 'Boxeo', texto: 'Peleas mundiales' },
  { icono: 'fas fa-broadcast-tower', titulo: 'En Vivo', texto: '100+ eventos/mes' },
  { icono: 'fas fa-mobile-alt', titulo: 'Multidispositivo', texto: 'TV, móvil, tablet' }
];

const FEATS_NBA = [
  { icono: 'fas fa-basketball', titulo: '1,230 Partidos', texto: 'Toda la temporada' },
  { icono: 'fas fa-clock', titulo: 'On Demand', texto: 'Revive cualquier partido' }
];

const FEATS_F1 = [
  { icono: 'fas fa-flag-checkered', titulo: '24 Carreras', texto: 'Calendario completo' },
  { icono: 'fas fa-camera', titulo: 'F1 Driver Cam', texto: 'Cámara del piloto' }
];

export default function DeportesPage() {
  useTituloPagina('Deportes - OpenLeaf');
  const { datos } = usePlataformas('deportes');

  const buscarPlataforma = (id, nombre) =>
    datos.find((p) => p.id === id) || datos.find((p) => p.nombre === nombre) || null;

  const espn = buscarPlataforma('espn', 'ESPN+');
  const dazn = buscarPlataforma('dazn', 'DAZN');
  const nba = buscarPlataforma('nba', 'NBA League Pass');
  const f1tv = buscarPlataforma('f1tv', 'F1 TV Pro');

  return (
    <main className="max-w-[1400px] mx-auto px-4 lg:px-6 py-6">

      <div className="sv-page-header">
        <h1><i className="fas fa-futbol mr-2"></i>Deportes en Streaming</h1>
        <p>Las mejores plataformas deportivas para seguir a tus equipos favoritos</p>
      </div>

      {/* ═══ CARRUSEL (misma técnica del original: scroll-snap + anclas #ds1..#ds3) ═══ */}
      <div className="sv-car-wrap">
        <div className="sv-car-scroll">
          {DIAPOSITIVAS.map((d) => (
            <div className="sv-car-slide" id={d.id} key={d.id}>
              <img src={d.imagen} alt={d.alt} />
              <div className="sv-car-cap">
                <span className="sv-car-badge" style={{ background: d.badge.fondo, color: d.badge.color }}>{d.badge.texto}</span>
                <h5>{d.titulo}</h5>
                <p>{d.texto}</p>
                <a href={d.sitio} target="_blank" rel="noopener noreferrer" className="btn-sv-primary text-sm py-2 px-4">
                  <i className={`${d.botonIcono} mr-1`}></i>{d.botonTexto}
                </a>
              </div>
              <a href={`#${d.anterior}`} className="sv-car-arrow sv-car-arrow-prev"><i className="fas fa-chevron-left"></i></a>
              <a href={`#${d.siguiente}`} className="sv-car-arrow sv-car-arrow-next"><i className="fas fa-chevron-right"></i></a>
            </div>
          ))}
        </div>
      </div>
      <div className="sv-car-dots">
        {DIAPOSITIVAS.map((d, i) => (
          <a href={`#${d.id}`} className="sv-car-dot-a" title={`Slide ${i + 1}`} key={d.id}></a>
        ))}
      </div>

      {/* En deportes.html este comentario HTML está roto (falta <!--), así que el
          texto se renderiza visible en la página: se conserva tal cual. */}
      {'ACCESOS RÁPIDOS -->'}

      {/* ═══ ACCESOS RÁPIDOS ═══ */}
      <div className="mb-8">
        <h5 className="font-bold text-base mb-3 sv-text-gradient"><i className="fas fa-bolt mr-2"></i>Accesos Rápidos</h5>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {ACCESOS_RAPIDOS.map((a) => (
            <a href={a.sitio} target="_blank" rel="noopener noreferrer" className="sv-quick-card" key={a.texto}>
              <span className="sv-quick-icon"><i className={a.icono}></i></span>
              <span className="sv-quick-label">{a.texto}</span>
            </a>
          ))}
        </div>
      </div>

      {/* REPRODUCIR EN OPENLEAF (contenido de la base de datos) */}
      <BloqueContenidos seccion="deportes" />

      {/* ═══ DISCIPLINAS ═══ */}
      <div className="sv-section mb-6">
        <h4 className="sv-section-title mb-4"><i className="fas fa-medal mr-2 sv-text-gradient"></i>Disciplinas Deportivas</h4>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {DISCIPLINAS.map((c) => (
            <div className="sv-cat-card" key={c.nombre}>
              <img src={c.imagen} alt={c.alt} />
              <div className="sv-cat-label"><i className={c.icono}></i><h6>{c.nombre}</h6></div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ ESPN+ ═══ */}
      {espn && (
        <div className="sv-section">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-3">
              <img src={espn.logo} alt={espn.nombre} className="sv-platform-logo" />
              <div>
                <h2 className="sv-platform-title">{espn.nombre}</h2>
                <p className="sv-platform-desc">{espn.descripcion || 'NFL, NBA, MLB, NHL, MLS, UFC, golf, tenis y mucho más'}</p>
              </div>
            </div>
            <a href={espn.sitio || 'https://www.espn.com/espnplus/'} target="_blank" rel="noopener noreferrer" className="btn-sv-visit">
              <i className="fas fa-trophy"></i>{espn.sitioTexto || 'Visitar'}
            </a>
          </div>
          <div className="sv-video-grid">
            {VIDEOS_ESPN.map((v) => (
              <div className="sv-video-card" key={v.src}>
                <iframe src={v.src} allowFullScreen></iframe>
                <h6>{v.titulo}</h6>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ DAZN ═══ */}
      {dazn && (
        <div className="sv-section">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-3">
              <img src={dazn.logo} alt={dazn.nombre} className="sv-platform-logo" />
              <div>
                <h2 className="sv-platform-title">{dazn.nombre}</h2>
                <p className="sv-platform-desc">{dazn.descripcion || 'Fútbol, boxeo, MMA y los mejores deportes del mundo en directo'}</p>
              </div>
            </div>
            <a href={dazn.sitio || 'https://www.dazn.com'} target="_blank" rel="noopener noreferrer" className="btn-sv-visit">
              <i className="fas fa-broadcast-tower"></i>{dazn.sitioTexto || 'Visitar'}
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {FEATS_DAZN.map((f) => (
              <div className="sv-feat" key={f.titulo}>
                <span className="sv-feat-icon"><i className={f.icono}></i></span>
                <h6>{f.titulo}</h6>
                <p>{f.texto}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ NBA + F1 ═══ */}
      {(nba || f1tv) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
          {nba && (
            <div className="sv-section">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={nba.logo} alt="NBA" className="sv-platform-logo" />
                  <h2 className="sv-platform-title m-0 text-xl">{nba.nombre}</h2>
                </div>
                <a href={nba.sitio || 'https://www.nba.com/league-pass'} target="_blank" rel="noopener noreferrer" className="btn-sv-visit text-xs py-2 px-3">
                  <i className="fas fa-external-link-alt"></i>
                </a>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {FEATS_NBA.map((f) => (
                  <div className="sv-feat" key={f.titulo}>
                    <span className="sv-feat-icon"><i className={f.icono}></i></span>
                    <h6>{f.titulo}</h6>
                    <p>{f.texto}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {f1tv && (
            <div className="sv-section">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={f1tv.logo} alt="F1" className="sv-platform-logo" />
                  <h2 className="sv-platform-title m-0 text-xl">{f1tv.nombre}</h2>
                </div>
                <a href={f1tv.sitio || 'https://f1tv.formula1.com'} target="_blank" rel="noopener noreferrer" className="btn-sv-visit text-xs py-2 px-3">
                  <i className="fas fa-external-link-alt"></i>
                </a>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {FEATS_F1.map((f) => (
                  <div className="sv-feat" key={f.titulo}>
                    <span className="sv-feat-icon"><i className={f.icono}></i></span>
                    <h6>{f.titulo}</h6>
                    <p>{f.texto}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </main>
  );
}
