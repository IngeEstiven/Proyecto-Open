import { Link } from 'react-router-dom';

import BloqueContenidos from '../../components/admin/BloqueContenidos.jsx';
import useTituloPagina from '../../hooks/useTituloPagina.js';

export default function EnVivoPage() {
  useTituloPagina('En Vivo · OpenLeaf');

  return (
    <main className="max-w-[1400px] mx-auto px-4 lg:px-6 py-6">
      <div className="sv-page-header">
        <h1>
          <i className="fas fa-satellite-dish mr-2"></i>Video en Vivo
        </h1>
        <p>Las mejores plataformas de streaming en directo del mundo</p>
      </div>

      {/* CARRUSEL */}
      <div className="sv-car-wrap">
        <div className="sv-car-scroll">
          <div className="sv-car-slide" id="ls1">
            <img
              src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1400&q=85"
              alt="TWITCH"
            />
            <div className="sv-car-cap">
              <span className="sv-car-badge" style={{ background: '#9146FF', color: '#fff' }}>
                TWITCH
              </span>
              <h5>Gaming · IRL · Arte · Música</h5>
              <p>Millones de streams en vivo cada día en todas las categorías</p>
              <a
                href="https://www.twitch.tv"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-sv-primary text-sm py-2 px-4"
              >
                <i className="fab fa-twitch mr-1"></i>Ir a Twitch
              </a>
            </div>
            <a href="#ls3" className="sv-car-arrow sv-car-arrow-prev">
              <i className="fas fa-chevron-left"></i>
            </a>
            <a href="#ls2" className="sv-car-arrow sv-car-arrow-next">
              <i className="fas fa-chevron-right"></i>
            </a>
          </div>
          <div className="sv-car-slide" id="ls2">
            <img
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1400&q=85"
              alt="YOUTUBE LIVE"
            />
            <div className="sv-car-cap">
              <span className="sv-car-badge" style={{ background: '#ff0000', color: '#fff' }}>
                YOUTUBE LIVE
              </span>
              <h5>Transmisiones en Directo</h5>
              <p>Conciertos, noticias, tutoriales y entretenimiento en vivo</p>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-sv-primary text-sm py-2 px-4"
              >
                <i className="fab fa-youtube mr-1"></i>Ver en YouTube
              </a>
            </div>
            <a href="#ls1" className="sv-car-arrow sv-car-arrow-prev">
              <i className="fas fa-chevron-left"></i>
            </a>
            <a href="#ls3" className="sv-car-arrow sv-car-arrow-next">
              <i className="fas fa-chevron-right"></i>
            </a>
          </div>
          <div className="sv-car-slide" id="ls3">
            <img
              src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1400&q=85"
              alt="KICK.COM"
            />
            <div className="sv-car-cap">
              <span className="sv-car-badge" style={{ background: '#53fc18', color: '#000' }}>
                KICK.COM
              </span>
              <h5>La Nueva Plataforma de Streaming</h5>
              <p>Sin censura, con 95% de ingresos para creadores</p>
              <a
                href="https://kick.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-sv-primary text-sm py-2 px-4"
              >
                <i className="fas fa-bolt mr-1"></i>Ir a Kick
              </a>
            </div>
            <a href="#ls2" className="sv-car-arrow sv-car-arrow-prev">
              <i className="fas fa-chevron-left"></i>
            </a>
            <a href="#ls1" className="sv-car-arrow sv-car-arrow-next">
              <i className="fas fa-chevron-right"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="sv-car-dots">
        <a href="#ls1" className="sv-car-dot-a" title="Slide 1"></a>
        <a href="#ls2" className="sv-car-dot-a" title="Slide 2"></a>
        <a href="#ls3" className="sv-car-dot-a" title="Slide 3"></a>
      </div>

      {/* ACCESOS RÁPIDOS */}
      <div className="mb-8">
        <h5 className="font-bold text-base mb-3 sv-text-gradient">
          <i className="fas fa-bolt mr-2"></i>Accesos Rápidos
        </h5>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="sv-quick-card"
          >
            <span className="sv-quick-icon text-[#ff0000]">
              <i className="fab fa-youtube"></i>
            </span>
            <span className="sv-quick-label">YouTube</span>
          </a>
          <a
            href="https://www.twitch.tv"
            target="_blank"
            rel="noopener noreferrer"
            className="sv-quick-card"
          >
            <span className="sv-quick-icon text-[#9146FF]">
              <i className="fab fa-twitch"></i>
            </span>
            <span className="sv-quick-label">Twitch</span>
          </a>
          <a
            href="https://www.facebook.com/gaming"
            target="_blank"
            rel="noopener noreferrer"
            className="sv-quick-card"
          >
            <span className="sv-quick-icon">
              <i className="fab fa-facebook"></i>
            </span>
            <span className="sv-quick-label">FB Gaming</span>
          </a>
          <a
            href="https://vimeo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="sv-quick-card"
          >
            <span className="sv-quick-icon">
              <i className="fab fa-vimeo"></i>
            </span>
            <span className="sv-quick-label">Vimeo</span>
          </a>
          <a
            href="https://kick.com"
            target="_blank"
            rel="noopener noreferrer"
            className="sv-quick-card"
          >
            <span className="sv-quick-icon">
              <i className="fas fa-bolt"></i>
            </span>
            <span className="sv-quick-label">Kick</span>
          </a>
          <a
            href="https://www.tiktok.com/live"
            target="_blank"
            rel="noopener noreferrer"
            className="sv-quick-card"
          >
            <span className="sv-quick-icon">
              <i className="fab fa-tiktok"></i>
            </span>
            <span className="sv-quick-label">TikTok Live</span>
          </a>
        </div>
      </div>

      {/* REPRODUCIR EN OPENLEAF (contenido de la base de datos) */}
      <BloqueContenidos seccion="en_vivo" />

      {/* YOUTUBE */}
      <div className="sv-section">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-3">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg"
              alt="YouTube"
              className="sv-platform-logo"
            />
            <div>
              <h2 className="sv-platform-title">YouTube</h2>
              <p className="sv-platform-desc">
                La plataforma de video más grande del mundo con contenido en vivo 24/7
              </p>
            </div>
          </div>
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-sv-visit"
          >
            <i className="fab fa-youtube"></i> Visitar
          </a>
        </div>
        <div className="sv-video-grid">
          <div className="sv-video-card">
            <iframe
              src="https://www.youtube.com/embed/5qap5aO4i9A"
              allowFullScreen
            ></iframe>
            <h6>Lofi Hip Hop Radio 24/7</h6>
          </div>
          <div className="sv-video-card">
            <iframe
              src="https://www.youtube.com/embed/jfKfPfyJRdk"
              allowFullScreen
            ></iframe>
            <h6>Lofi Girl · Study Radio</h6>
          </div>
          <div className="sv-video-card">
            <iframe
              src="https://www.youtube.com/embed/DWcJFNfaw9c"
              allowFullScreen
            ></iframe>
            <h6>Synthwave Radio 24/7</h6>
          </div>
        </div>
      </div>

      {/* TWITCH */}
      <div className="sv-section">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-3">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/26/Twitch_logo.svg"
              alt="Twitch"
              className="sv-platform-logo"
            />
            <div>
              <h2 className="sv-platform-title">Twitch</h2>
              <p className="sv-platform-desc">
                Gaming, IRL, arte, cocina y todo lo que imagines en streaming en vivo
              </p>
            </div>
          </div>
          <a
            href="https://www.twitch.tv"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-sv-visit"
          >
            <i className="fab fa-twitch"></i> Visitar
          </a>
        </div>
        <p className="text-slate-500 text-sm mb-3">
          Categorías más populares en Twitch ahora mismo:
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          <div className="sv-cat-card">
            <img
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&q=70"
              alt="Gaming"
            />
            <div className="sv-cat-label">
              <i className="fas fa-gamepad"></i>
              <h6>Gaming</h6>
            </div>
          </div>
          <div className="sv-cat-card">
            <img
              src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=70"
              alt="Music"
            />
            <div className="sv-cat-label">
              <i className="fas fa-music"></i>
              <h6>Música</h6>
            </div>
          </div>
          <div className="sv-cat-card">
            <img
              src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=300&q=70"
              alt="IRL"
            />
            <div className="sv-cat-label">
              <i className="fas fa-street-view"></i>
              <h6>IRL</h6>
            </div>
          </div>
          <div className="sv-cat-card">
            <img
              src="https://images.unsplash.com/photo-1461344577544-4e5dc9487184?w=300&q=70"
              alt="Arte"
            />
            <div className="sv-cat-label">
              <i className="fas fa-palette"></i>
              <h6>Arte</h6>
            </div>
          </div>
          <div className="sv-cat-card">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=70"
              alt="Cocina"
            />
            <div className="sv-cat-label">
              <i className="fas fa-utensils"></i>
              <h6>Cocina</h6>
            </div>
          </div>
          <div className="sv-cat-card">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&q=70"
              alt="Chat"
            />
            <div className="sv-cat-label">
              <i className="fas fa-comments"></i>
              <h6>Charlemos</h6>
            </div>
          </div>
        </div>
      </div>

      {/* FB GAMING / VIMEO / KICK */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4">
        {/* FB Gaming */}
        <div className="sv-section flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: '#1877f2' }}
            >
              <i className="fab fa-facebook-f text-white text-sm"></i>
            </span>
            <div>
              <h2 className="sv-platform-title m-0 text-base">FB Gaming</h2>
              <p className="text-xs text-[#94a3b8] m-0">Gaming · Torneos · Comunidad</p>
            </div>
            <span
              className="ml-auto text-xs font-bold text-white px-2 py-0.5 rounded-full"
              style={{ background: '#1877f2' }}
            >
              ● LIVE
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-xl bg-[rgba(15,18,35,.7)]">
              <i className="fas fa-gamepad block mb-1" style={{ color: '#1877f2' }}></i>
              <small className="text-[0.68rem] text-slate-100 font-bold">Torneos</small>
            </div>
            <div className="p-2 rounded-xl bg-[rgba(15,18,35,.7)]">
              <i className="fas fa-users block mb-1" style={{ color: '#1877f2' }}></i>
              <small className="text-[0.68rem] text-slate-100 font-bold">Comunidad</small>
            </div>
            <div className="p-2 rounded-xl bg-[rgba(15,18,35,.7)]">
              <i className="fas fa-trophy block mb-1" style={{ color: '#1877f2' }}></i>
              <small className="text-[0.68rem] text-slate-100 font-bold">Premios</small>
            </div>
          </div>
          <a
            href="https://www.facebook.com/gaming"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-sv-visit mt-auto"
            style={{ background: 'linear-gradient(135deg,#1877f2,#0d5ecf)' }}
          >
            <i className="fab fa-facebook-f"></i> Visitar FB Gaming
          </a>
        </div>

        {/* Vimeo */}
        <div className="sv-section flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: '#1ab7ea' }}
            >
              <i className="fab fa-vimeo-v text-white text-sm"></i>
            </span>
            <div>
              <h2 className="sv-platform-title m-0 text-base">Vimeo</h2>
              <p className="text-xs text-[#94a3b8] m-0">Cine Indie · Video Pro · 4K</p>
            </div>
            <span
              className="ml-auto text-xs font-bold text-white px-2 py-0.5 rounded-full"
              style={{ background: '#1ab7ea' }}
            >
              HD 4K
            </span>
          </div>
          <div className="aspect-video rounded-xl overflow-hidden border border-[rgba(26,183,234,.2)]">
            <iframe
              src="https://player.vimeo.com/video/783455878?color=1ab7ea&title=0&byline=0&portrait=0"
              className="w-full h-full"
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture"
            ></iframe>
          </div>
          <a
            href="https://vimeo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-sv-visit mt-auto"
            style={{ background: 'linear-gradient(135deg,#1ab7ea,#0d8fb5)' }}
          >
            <i className="fab fa-vimeo-v"></i> Visitar Vimeo
          </a>
        </div>

        {/* Kick */}
        <div className="sv-section flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: '#53fc18' }}
            >
              <i className="fas fa-bolt text-black text-sm"></i>
            </span>
            <div>
              <h2 className="sv-platform-title m-0 text-base">Kick.com</h2>
              <p className="text-xs text-[#94a3b8] m-0">Sin límites · 95% para creadores</p>
            </div>
            <span
              className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: '#53fc18', color: '#000' }}
            >
              ● LIVE
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-xl bg-[rgba(15,18,35,.7)]">
              <i className="fas fa-dollar-sign block mb-1" style={{ color: '#53fc18' }}></i>
              <small className="text-[0.68rem] text-slate-100 font-bold">95% Rev</small>
            </div>
            <div className="p-2 rounded-xl bg-[rgba(15,18,35,.7)]">
              <i className="fas fa-infinity block mb-1" style={{ color: '#53fc18' }}></i>
              <small className="text-[0.68rem] text-slate-100 font-bold">Sin Límites</small>
            </div>
            <div className="p-2 rounded-xl bg-[rgba(15,18,35,.7)]">
              <i className="fas fa-shield-alt block mb-1" style={{ color: '#53fc18' }}></i>
              <small className="text-[0.68rem] text-slate-100 font-bold">Libre</small>
            </div>
          </div>
          <a
            href="https://kick.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-sv-visit mt-auto"
            style={{ background: 'linear-gradient(135deg,#53fc18,#26a800)', color: '#000!important' }}
          >
            <i className="fas fa-bolt"></i> Visitar Kick
          </a>
        </div>
      </div>
    </main>
  );
}
