import { Link } from 'react-router-dom';

import { ModalesAcceso } from '../../components/public/ModalesStreamVerse.jsx';
import useTituloPagina from '../../hooks/useTituloPagina.js';
import '../../assets/streamverse.css';
import '../../assets/landing.css';
import { FICHAS } from '../../services/fichasEstaticas.js';
import { EMAIL_CONTACTO, HERO_LOGO_URL, LOGO_URL } from '../../services/informacionSitio.js';
import { PLATAFORMAS_ESTATICAS } from '../../services/plataformasEstaticas.js';

// Cifras estáticas del catálogo, sin llamadas a la API (landing pública).
const CANTIDAD_JUEGOS = Object.keys(FICHAS).length;

// Logos flotantes del hero (estáticos, aparecen alrededor del logo central).
const LOGOS_HERO = ['netflix', 'spotify', 'youtube', 'twitch', 'hbo', 'prime']
  .map((id) => PLATAFORMAS_ESTATICAS.find((p) => p.id === id))
  .filter(Boolean)
  .map((p) => p.logo);

// Portadas locales de /img/juegos para el bloque GameZone (contenido escrito, sin API).
const PORTADAS_GAMEZONE = [
  { slug: 'gow', portada: '/img/juegos/gow.png', titulo: 'God of War Ragnarök', extra: 'Acción · ⭐ 9.8' },
  { slug: 'callofduty', portada: '/img/juegos/callofduty.jpg', titulo: 'Call of Duty WWII', extra: 'Acción · ⭐ 7.0' },
  { slug: 'residentevil', portada: '/img/juegos/residentevil.jpg', titulo: 'Resident Evil Village', extra: 'Terror · ⭐ 8.3' },
  { slug: 'ittakestwo', portada: '/img/juegos/ittakestwo.jpg', titulo: 'It Takes Two', extra: 'Co-op · ⭐ 8.9' }
];

const QUE_PUEDES_HACER = [
  { titulo: 'Películas y Series chill', icono: 'fas fa-film', seccion: 'peliculas', descripcion: 'Netflix, Prime Video, HBO Max, Disney+ y mucho más.' },
  { titulo: 'Música', icono: 'fas fa-music', seccion: 'musica', descripcion: 'Spotify, Apple Music, YouTube Music y SoundCloud.' },
  { titulo: 'En Vivo', icono: 'fas fa-satellite-dish', seccion: 'en_vivo', descripcion: 'YouTube, Twitch y Vimeo en directo.' },
  { titulo: 'Deportes', icono: 'fas fa-futbol', seccion: 'deportes', descripcion: 'ESPN+, DAZN, NBA League Pass y F1 TV Pro.' },
  { titulo: 'GameZone', icono: 'fas fa-gamepad', seccion: '', descripcion: 'Videojuegos con fichas, tráilers y pedido desde un solo lugar.' }
];

const PASOS = [
  { numero: '01', icono: 'fas fa-compass', titulo: 'Explora las secciones', descripcion: 'Navega por Streaming: Películas, Música, En Vivo y Deportes.' },
  { numero: '02', icono: 'fas fa-user-plus', titulo: 'Crea tu cuenta', descripcion: 'Regístrate gratis y accede a todo el catálogo de plataformas.' },
  { numero: '03', icono: 'fas fa-gamepad', titulo: 'Descubre GameZone', descripcion: 'Encuentra los mejores videojuegos con sus fichas y tráilers.' },
  { numero: '04', icono: 'fas fa-rocket', titulo: 'Disfruta sin límites', descripcion: 'Todo tu entretenimiento centralizado en un solo lugar.' }
];

// Redes sociales mostradas en el pie (sin enlaces reales todavía). El equipo debe
// reemplazar los "#" por sus perfiles oficiales.
const REDES_SOCIALES = [
  { icono: 'fab fa-facebook-f', nombre: 'Facebook' },
  { icono: 'fab fa-instagram', nombre: 'Instagram' },
  // Font Awesome 6.4.0 no trae fa-x-twitter (añadido en 6.4.2); se usa el ícono
  // de Bootstrap Icons (1.11.3) que ya carga index.html.
  { icono: 'bi bi-twitter-x', nombre: 'X (Twitter)' },
  { icono: 'fab fa-youtube', nombre: 'YouTube' },
  { icono: 'fab fa-tiktok', nombre: 'TikTok' },
  { icono: 'fab fa-whatsapp', nombre: 'WhatsApp' }
];

export default function LandingPage() {
  useTituloPagina('OpenLeaf — Todo tu entretenimiento en un solo lugar');

  return (
    <div className="op-landing-root">
      {/* ═══ BARRA SUPERIOR ═══ */}
      <header className="op-topbar">
        <div className="op-topbar-inner">
          <a className="op-brand" href="#arriba">
            <img src={LOGO_URL} alt="OpenLeaf" className="op-brand-img" />
            <span className="op-brand-text">
              <p className="op-brand-name">OpenLeaf</p>
              <p className="op-brand-sub">Infinito entretenimiento</p>
            </span>
          </a>
          <ul className="op-topbar-nav">
            <li><a className="op-topbar-link" href="#quienes-somos">Quiénes somos</a></li>
            <li><a className="op-topbar-link" href="#que-puedes">Qué puedes hacer</a></li>
            <li><a className="op-topbar-link" href="#plataformas">Plataformas</a></li>
            <li><a className="op-topbar-link" href="#gamezone">GameZone</a></li>
            <li><a className="op-topbar-link" href="#como-funciona">Cómo funciona</a></li>
          </ul>
          <div className="op-topbar-actions">
            <Link to="/?auth=login" className="op-btn op-btn-solid op-btn-sm">
              <i className="fas fa-right-to-bracket"></i> Iniciar sesión
            </Link>
          </div>
        </div>
      </header>

      {/* ═══ HERO (igual que el de /inicio) ═══ */}
      <section className="sv-hero-section" id="arriba">
        <div className="sv-hero-text">
          <span className="sv-hero-badge inline-flex items-center gap-2 px-4 py-1 rounded-full text-[0.73rem] font-bold uppercase tracking-widest mb-4">
            <i className="fas fa-bolt"></i> Nuevo · Películas · Música · En Vivo · Videojuegos
          </span>
          <h1 className="sv-hero-title font-black leading-tight mb-5">
            Todo tu entretenimiento<br />en un solo lugar
          </h1>
          <p className="text-[#94a3b8] text-lg leading-relaxed mb-8">
            OpenLeaf centraliza tus plataformas de streaming favoritas y la tienda de videojuegos GameZone.
            Un solo acceso para películas, series, música, deportes y los últimos lanzamientos de gaming.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/?auth=login" className="btn-sv-primary"><i className="fas fa-rocket"></i> Comenzar ahora</Link>
            <Link to="/?auth=login" className="btn-sv-secondary"><i className="fas fa-right-to-bracket"></i> Iniciar sesión</Link>
          </div>
        </div>
        <div className="sv-hero-visual-wrap">
          <div className="sv-hv-bg-glow"></div>
          <div className="sv-hv-center-logo">
            <img src={HERO_LOGO_URL} alt="OpenLeaf Logo" className="sv-hv-logo-main" />
            <div className="sv-hv-logo-glow"></div>
            {LOGOS_HERO[0] && <div className="sv-hv-logo sv-hv-l1"><img src={LOGOS_HERO[0]} alt="Plataforma" /></div>}
            {LOGOS_HERO[1] && <div className="sv-hv-logo sv-hv-l2"><img src={LOGOS_HERO[1]} alt="Plataforma" /></div>}
            {LOGOS_HERO[2] && <div className="sv-hv-logo sv-hv-l3"><img src={LOGOS_HERO[2]} alt="Plataforma" /></div>}
            {LOGOS_HERO[3] && <div className="sv-hv-logo sv-hv-l4"><img src={LOGOS_HERO[3]} alt="Plataforma" /></div>}
            {LOGOS_HERO[4] && <div className="sv-hv-logo sv-hv-l5"><img src={LOGOS_HERO[4]} alt="Plataforma" /></div>}
            {LOGOS_HERO[5] && <div className="sv-hv-logo sv-hv-l6"><img src={LOGOS_HERO[5]} alt="Plataforma" /></div>}
            <div className="sv-hv-badge sv-hv-b1"><i className="fas fa-gamepad"></i><span>{CANTIDAD_JUEGOS} juegos</span></div>
            <div className="sv-hv-badge sv-hv-b2"><i className="fas fa-star"></i><span>Más de 10 plataformas</span></div>
          </div>
        </div>
      </section>

      {/* ═══ QUIÉNES SOMOS ═══ */}
      <section className="op-section" id="quienes-somos">
        <div className="op-section-head">
          <span className="op-section-eyebrow"><i className="fas fa-leaf"></i> Quiénes somos</span>
          <h2 className="op-section-title">Un portal para todo tu entretenimiento</h2>
          <p className="op-section-sub">
            OpenLeaf nace como un proyecto académico para centralizar el acceso a los principales servicios
            de streaming y a la tienda de videojuegos GameZone. No almacenamos contenido: te llevamos a las
            plataformas oficiales de terceros, organizadas en un diseño limpio y accesible.
          </p>
        </div>
        <div className="op-about-grid">
          <div className="op-step">
            <i className="fas fa-video op-step-icon"></i>
            <p className="op-step-title">Streaming ordenado</p>
            <p className="op-step-desc">Películas, series, música, en vivo y deportes en secciones claras.</p>
          </div>
          <div className="op-step">
            <i className="fas fa-gamepad op-step-icon"></i>
            <p className="op-step-title">GameZone integrado</p>
            <p className="op-step-desc">Fichas de videojuegos con sinopsis, tráilers y pedido directo.</p>
          </div>
          <div className="op-step">
            <i className="fas fa-shield-halved op-step-icon"></i>
            <p className="op-step-title">Cuenta verificada</p>
            <p className="op-step-desc">Tu correo se verifica al registrarte para cuidar tu información.</p>
          </div>
        </div>
      </section>

      {/* ═══ QUÉ PUEDES HACER ═══ */}
      <section className="op-section" id="que-puedes">
        <div className="op-section-head">
          <span className="op-section-eyebrow"><i className="fas fa-tower-broadcast"></i> Qué puedes hacer</span>
          <h2 className="op-section-title">Todas tus plataformas, centralizadas</h2>
          <p className="op-section-sub">Accede a los principales servicios de streaming desde un único portal.</p>
        </div>
        <div className="op-stream-grid">
          {QUE_PUEDES_HACER.map((t) => {
            const logos = PLATAFORMAS_ESTATICAS.filter((p) => p.seccion === t.seccion).map((p) => p.logo);
            return (
              <div className="op-stream-card" key={t.titulo}>
                <span className="op-stream-icon"><i className={t.icono}></i></span>
                <h3 className="op-stream-title">{t.titulo}</h3>
                <p className="op-stream-desc">{t.descripcion}</p>
                {t.seccion && (
                  <div className="op-stream-logos">
                    {logos.map((logo) => (
                      <img key={logo} src={logo} alt="" loading="lazy" className="op-logo-chip" />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ PLATAFORMAS CONECTADAS ═══ */}
      <section className="op-section" id="plataformas">
        <div className="op-section-head">
          <span className="op-section-eyebrow"><i className="fas fa-link"></i> Plataformas conectadas</span>
          <h2 className="op-section-title">Las marcas que ya puedes encontrar</h2>
          <p className="op-section-sub">Streaming, música, en vivo y deportes en una sola cartelera.</p>
        </div>
        <div className="op-logo-cloud">
          {PLATAFORMAS_ESTATICAS.map((p) => (
            <img key={p.id} src={p.logo} alt={p.nombre} loading="lazy" className={`op-logo-chip op-logo-big ${p.logoClase || ''}`} />
          ))}
        </div>
      </section>

      {/* ═══ GAMEZONE ═══ */}
      <section className="op-gamezone" id="gamezone">
        <div className="op-section">
          <div className="op-section-head">
            <span className="op-section-eyebrow"><i className="fas fa-gamepad"></i> GameZone</span>
            <h2 className="op-section-title">Tu portal de videojuegos</h2>
            <p className="op-section-sub">Analizamos jugabilidad, gráficos e historia para traerte solo lo mejor del gaming.</p>
          </div>
          <div className="op-cat-grid">
            <a className="op-cat-chip" href="#gamezone"><i className="fas fa-crosshairs"></i> Acción</a>
            <a className="op-cat-chip" href="#gamezone"><i className="fas fa-moon"></i> Terror</a>
            <a className="op-cat-chip" href="#gamezone"><i className="fas fa-trophy"></i> Deportes</a>
            <a className="op-cat-chip" href="#gamezone"><i className="fas fa-people-group"></i> Co-op</a>
          </div>
          <div className="op-cover-grid">
            {PORTADAS_GAMEZONE.map((j) => (
              <Link className="op-cover-card" to={`/gamezone/${j.slug}`} key={j.slug}>
                <img src={j.portada} alt={j.titulo} loading="lazy" className="op-cover-img" />
                <div className="op-cover-meta">
                  <p className="op-cover-titulo">{j.titulo}</p>
                  <p className="op-cover-extra">{j.extra}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CÓMO FUNCIONA ═══ */}
      <section className="op-section" id="como-funciona">
        <div className="op-section-head">
          <span className="op-section-eyebrow"><i className="fas fa-circle-question"></i> Cómo funciona</span>
          <h2 className="op-section-title">Tres pasos para empezar</h2>
          <p className="op-section-sub">Crea tu cuenta y explora todo lo que OpenLeaf tiene para ti.</p>
        </div>
        <div className="op-steps">
          {PASOS.map((paso) => (
            <div className="op-step" key={paso.numero}>
              <i className={`${paso.icono} op-step-icon`}></i>
              <p className="op-step-num">{paso.numero}</p>
              <p className="op-step-title">{paso.titulo}</p>
              <p className="op-step-desc">{paso.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ PIE ═══ */}
      <footer className="op-footer">
        <div className="op-footer-inner">
          <div className="op-footer-top">
            <div className="op-footer-col">
              <span className="op-footer-brand">
                <img src={LOGO_URL} alt="OpenLeaf" className="op-footer-brand-img" />
                OpenLeaf
              </span>
              <p className="op-footer-aviso">
                OpenLeaf no almacena ni distribuye archivos protegidos por derechos de autor; todo el contenido
                se reproduce desde los servicios oficiales de terceros.
              </p>
              <p className="op-footer-aviso mt-3">
                Correo de contacto: <a className="op-footer-link" href={`mailto:${EMAIL_CONTACTO}`}>{EMAIL_CONTACTO}</a>
              </p>
            </div>
            <div className="op-footer-col">
              <strong className="op-section-eyebrow">Explora</strong>
              <a className="op-footer-link" href="#quienes-somos">Quiénes somos</a>
              <a className="op-footer-link" href="#que-puedes">Qué puedes hacer</a>
              <a className="op-footer-link" href="#gamezone">GameZone</a>
              <a className="op-footer-link" href="#como-funciona">Cómo funciona</a>
            </div>
            <div className="op-footer-col">
              <strong className="op-section-eyebrow">Legal</strong>
              <Link className="op-footer-link" to="/terminos">Términos de uso</Link>
              <Link className="op-footer-link" to="/privacidad">Privacidad</Link>
              <Link className="op-footer-link" to="/aviso-legal">Aviso legal</Link>
            </div>
            <div className="op-footer-col">
              <strong className="op-section-eyebrow">Redes sociales</strong>
              <div className="op-socials">
                {REDES_SOCIALES.map((red) => (
                  <a key={red.nombre} href="#" aria-label={red.nombre} className="op-social" title={red.nombre}>
                    <i className={red.icono}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="op-footer-bottom">
            <p className="m-0">© 2026 OpenLeaf · Creado por SAMB</p>
            <p className="m-0">Todos los derechos reservados</p>
          </div>
        </div>
      </footer>

      {/* ═══ MODALES DE ACCESO (?auth=login|register|verificar|recuperar) ═══ */}
      <ModalesAcceso />
    </div>
  );
}