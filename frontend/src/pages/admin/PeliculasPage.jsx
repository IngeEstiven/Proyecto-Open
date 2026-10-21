import { Link } from 'react-router-dom';

import BloqueContenidos from '../../components/admin/BloqueContenidos.jsx';
import useTituloPagina from '../../hooks/useTituloPagina.js';

export default function PeliculasPage() {
  useTituloPagina('Películas y Series - OpenLeaf');

  return (
    <main className="max-w-[1400px] mx-auto px-4 lg:px-6 py-6">
      <div className="sv-page-header">
        <h1><i className="fas fa-film mr-2"></i>Películas y Series</h1>
        <p>Las mejores plataformas de streaming de video en un solo lugar</p>
      </div>

      {/* CARRUSEL */}
      <div className="sv-car-wrap">
        <div className="sv-car-scroll">
          <div className="sv-car-slide" id="p1">
            <img src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1400&q=85" alt="NETFLIX" />
            <div className="sv-car-cap">
              <span className="sv-car-badge" style={{ background: '#e50914', color: '#fff' }}>NETFLIX</span>
              <h5>Stranger Things – Temporada 5</h5>
              <p>El capítulo final de la serie más vista del mundo</p>
              <a href="https://www.netflix.com" target="_blank" rel="noopener noreferrer" className="btn-sv-primary text-sm py-2 px-4">
                <i className="fas fa-play mr-1"></i>Ver en Netflix
              </a>
            </div>
            <a href="#p4" className="sv-car-arrow sv-car-arrow-prev">
              <i className="fas fa-chevron-left"></i>
            </a>
            <a href="#p2" className="sv-car-arrow sv-car-arrow-next">
              <i className="fas fa-chevron-right"></i>
            </a>
          </div>
          <div className="sv-car-slide" id="p2">
            <img src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1400&q=85" alt="HBO MAX" />
            <div className="sv-car-cap">
              <span className="sv-car-badge" style={{ background: '#6d00f5', color: '#fff' }}>HBO MAX</span>
              <h5>House of the Dragon – S2</h5>
              <p>La guerra de los Targaryen continúa ardiendo</p>
              <a href="https://www.max.com" target="_blank" rel="noopener noreferrer" className="btn-sv-primary text-sm py-2 px-4">
                <i className="fas fa-play mr-1"></i>Ver en Max
              </a>
            </div>
            <a href="#p1" className="sv-car-arrow sv-car-arrow-prev">
              <i className="fas fa-chevron-left"></i>
            </a>
            <a href="#p3" className="sv-car-arrow sv-car-arrow-next">
              <i className="fas fa-chevron-right"></i>
            </a>
          </div>
          <div className="sv-car-slide" id="p3">
            <img src="https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=1400&q=85" alt="DISNEY+" />
            <div className="sv-car-cap">
              <span className="sv-car-badge" style={{ background: '#0063e5', color: '#fff' }}>DISNEY+</span>
              <h5>The Mandalorian – Temporada 4</h5>
              <p>El Camino es más peligroso que nunca</p>
              <a href="https://www.disneyplus.com" target="_blank" rel="noopener noreferrer" className="btn-sv-primary text-sm py-2 px-4">
                <i className="fas fa-play mr-1"></i>Ver en Disney+
              </a>
            </div>
            <a href="#p2" className="sv-car-arrow sv-car-arrow-prev">
              <i className="fas fa-chevron-left"></i>
            </a>
            <a href="#p4" className="sv-car-arrow sv-car-arrow-next">
              <i className="fas fa-chevron-right"></i>
            </a>
          </div>
          <div className="sv-car-slide" id="p4">
            <img src="https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=1400&q=85" alt="PRIME VIDEO" />
            <div className="sv-car-cap">
              <span className="sv-car-badge" style={{ background: '#00a8e0', color: '#fff' }}>PRIME VIDEO</span>
              <h5>Rings of Power – Temporada 2</h5>
              <p>La Tierra Media antes de El Señor de los Anillos</p>
              <a href="https://www.primevideo.com" target="_blank" rel="noopener noreferrer" className="btn-sv-primary text-sm py-2 px-4">
                <i className="fas fa-play mr-1"></i>Ver en Prime
              </a>
            </div>
            <a href="#p3" className="sv-car-arrow sv-car-arrow-prev">
              <i className="fas fa-chevron-left"></i>
            </a>
            <a href="#p1" className="sv-car-arrow sv-car-arrow-next">
              <i className="fas fa-chevron-right"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="sv-car-dots">
        <a href="#p1" className="sv-car-dot-a" title="Slide 1"></a>
        <a href="#p2" className="sv-car-dot-a" title="Slide 2"></a>
        <a href="#p3" className="sv-car-dot-a" title="Slide 3"></a>
        <a href="#p4" className="sv-car-dot-a" title="Slide 4"></a>
      </div>

      {/* ACCESOS RÁPIDOS */}
      <div className="mb-8">
        <h5 className="font-bold text-base mb-3 sv-text-gradient">
          <i className="fas fa-bolt mr-2"></i>Accesos Rápidos
        </h5>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          <a href="https://www.netflix.com" target="_blank" rel="noopener noreferrer" className="sv-quick-card">
            <span className="sv-quick-icon text-[#e50914]"><i className="fas fa-n"></i></span>
            <span className="sv-quick-label">Netflix</span>
          </a>
          <a href="https://www.primevideo.com" target="_blank" rel="noopener noreferrer" className="sv-quick-card">
            <span className="sv-quick-icon"><i className="fab fa-amazon"></i></span>
            <span className="sv-quick-label">Prime Video</span>
          </a>
          <a href="https://www.max.com" target="_blank" rel="noopener noreferrer" className="sv-quick-card">
            <span className="sv-quick-icon"><i className="fas fa-play"></i></span>
            <span className="sv-quick-label">HBO Max</span>
          </a>
          <a href="https://www.disneyplus.com" target="_blank" rel="noopener noreferrer" className="sv-quick-card">
            <span className="sv-quick-icon"><i className="fas fa-star"></i></span>
            <span className="sv-quick-label">Disney+</span>
          </a>
          <a href="https://tv.apple.com" target="_blank" rel="noopener noreferrer" className="sv-quick-card">
            <span className="sv-quick-icon"><i className="fab fa-apple"></i></span>
            <span className="sv-quick-label">Apple TV+</span>
          </a>
          <a href="https://www.paramountplus.com" target="_blank" rel="noopener noreferrer" className="sv-quick-card">
            <span className="sv-quick-icon"><i className="fas fa-mountain"></i></span>
            <span className="sv-quick-label">Paramount+</span>
          </a>
        </div>
      </div>

      {/* REPRODUCIR EN OPENLEAF (contenido de la base de datos) */}
      <BloqueContenidos seccion="peliculas" conGenero />

      {/* NETFLIX */}
      <div className="sv-section">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-3">
            <img src="https://images.ctfassets.net/4cd45et68cgf/Rx83JoRDMkYNlMC9MKzcB/2b14d5a59fc3937afd3f03191e19502d/Netflix-Symbol.png?w=200" alt="Netflix" className="sv-platform-logo" />
            <div>
              <h2 className="sv-platform-title">Netflix</h2>
              <p className="sv-platform-desc">Series originales, películas, documentales y contenido para toda la familia</p>
            </div>
          </div>
          <a href="https://www.netflix.com" target="_blank" rel="noopener noreferrer" className="btn-sv-visit">
            <i className="fas fa-external-link-alt"></i> Visitar
          </a>
        </div>
        <div className="sv-video-grid">
          <div className="sv-video-card">
            <iframe src="https://www.youtube.com/embed/b9EkMc79ZSU" allowFullScreen title="Stranger Things - Trailer"></iframe>
            <h6>Stranger Things - Trailer</h6>
          </div>
          <div className="sv-video-card">
            <iframe src="https://www.youtube.com/embed/ndl1W4ltcmg" allowFullScreen title="The Witcher - Trailer"></iframe>
            <h6>The Witcher - Trailer</h6>
          </div>
          <div className="sv-video-card">
            <iframe src="https://www.youtube.com/embed/Di310WS8zLk" allowFullScreen title="Wednesday - Trailer"></iframe>
            <h6>Wednesday - Trailer</h6>
          </div>
        </div>
      </div>

      {/* PRIME */}
      <div className="sv-section">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg" alt="Prime Video" className="sv-platform-logo" />
            <div>
              <h2 className="sv-platform-title">Prime Video</h2>
              <p className="sv-platform-desc">Contenido original de Amazon y miles de películas y series</p>
            </div>
          </div>
          <a href="https://www.primevideo.com" target="_blank" rel="noopener noreferrer" className="btn-sv-visit">
            <i className="fas fa-external-link-alt"></i> Visitar
          </a>
        </div>
        <div className="sv-video-grid">
          <div className="sv-video-card">
            <iframe src="https://www.youtube.com/embed/x8UAUAuKNcU" allowFullScreen title="The Rings of Power - Trailer"></iframe>
            <h6>The Rings of Power - Trailer</h6>
          </div>
          <div className="sv-video-card">
            <iframe src="https://www.youtube.com/embed/lQ7-jixm9Vw" allowFullScreen title="Su Majestad - Tráiler"></iframe>
            <h6>Su Majestad - Tráiler</h6>
          </div>
          <div className="sv-video-card">
            <iframe src="https://www.youtube.com/embed/ybWrgLrwBsw" allowFullScreen title="Jack Ryan - Trailer"></iframe>
            <h6>Jack Ryan - Trailer</h6>
          </div>
        </div>
      </div>

      {/* HBO MAX */}
      <div className="sv-section">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg" alt="HBO Max" className="sv-platform-logo" />
            <div>
              <h2 className="sv-platform-title">HBO Max</h2>
              <p className="sv-platform-desc">Lo mejor de HBO, Warner Bros y DC Comics en un solo lugar</p>
            </div>
          </div>
          <a href="https://www.max.com" target="_blank" rel="noopener noreferrer" className="btn-sv-visit">
            <i className="fas fa-external-link-alt"></i> Visitar
          </a>
        </div>
        <div className="sv-video-grid">
          <div className="sv-video-card">
            <iframe src="https://www.youtube.com/embed/HHfulnVk81g" allowFullScreen title="La Casa del Dragón"></iframe>
            <h6>La Casa del Dragón</h6>
          </div>
          <div className="sv-video-card">
            <iframe src="https://www.youtube.com/embed/3Q3PSISAZL8" allowFullScreen title="The Last of Us"></iframe>
            <h6>The Last of Us</h6>
          </div>
          <div className="sv-video-card">
            <iframe src="https://www.youtube.com/embed/BIhNsAtPbPI" allowFullScreen title="Succession"></iframe>
            <h6>Succession</h6>
          </div>
        </div>
      </div>

      {/* DISNEY+ */}
      <div className="sv-section">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg" alt="Disney+" className="sv-platform-logo" />
            <div>
              <h2 className="sv-platform-title">Disney+</h2>
              <p className="sv-platform-desc">Disney, Pixar, Marvel, Star Wars y National Geographic</p>
            </div>
          </div>
          <a href="https://www.disneyplus.com" target="_blank" rel="noopener noreferrer" className="btn-sv-visit">
            <i className="fas fa-external-link-alt"></i> Visitar
          </a>
        </div>
        <div className="sv-video-grid">
          <div className="sv-video-card">
            <iframe src="https://www.youtube.com/embed/aV8H7kszXqo" allowFullScreen title="The Mandalorian"></iframe>
            <h6>The Mandalorian</h6>
          </div>
          <div className="sv-video-card">
            <iframe src="https://www.youtube.com/embed/KcBStos46EM" allowFullScreen title="Loki"></iframe>
            <h6>Loki</h6>
          </div>
          <div className="sv-video-card">
            <iframe src="https://www.youtube.com/embed/J_1EXWNETiI" allowFullScreen title="Ahsoka"></iframe>
            <h6>Ahsoka</h6>
          </div>
        </div>
      </div>

      {/* APPLE TV+ */}
      <div className="sv-section">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg" alt="Apple TV+" className="sv-platform-logo apple-logo" />
            <div>
              <h2 className="sv-platform-title">Apple TV+</h2>
              <p className="sv-platform-desc">Series y películas originales de Apple con calidad cinematográfica</p>
            </div>
          </div>
          <a href="https://tv.apple.com" target="_blank" rel="noopener noreferrer" className="btn-sv-visit">
            <i className="fas fa-external-link-alt"></i> Visitar
          </a>
        </div>
        <div className="sv-video-grid">
          <div className="sv-video-card">
            <iframe src="https://www.youtube.com/embed/3u7EIiohs6U" allowFullScreen title="Ted Lasso"></iframe>
            <h6>Ted Lasso</h6>
          </div>
          <div className="sv-video-card">
            <iframe src="https://www.youtube.com/embed/Klq88ERaGuM" allowFullScreen title="The Morning Show"></iframe>
            <h6>The Morning Show</h6>
          </div>
          <div className="sv-video-card">
            <iframe src="https://www.youtube.com/embed/AV8HdnTjevs" allowFullScreen title="Foundation"></iframe>
            <h6>Foundation</h6>
          </div>
        </div>
      </div>

      {/* PARAMOUNT+ */}
      <div className="sv-section">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Paramount_Plus.svg" alt="Paramount+" className="sv-platform-logo" />
            <div>
              <h2 className="sv-platform-title">Paramount+</h2>
              <p className="sv-platform-desc">CBS, MTV, Nickelodeon y todo el universo ViacomCBS</p>
            </div>
          </div>
          <a href="https://www.paramountplus.com" target="_blank" rel="noopener noreferrer" className="btn-sv-visit">
            <i className="fas fa-external-link-alt"></i> Visitar
          </a>
        </div>
        <div className="sv-video-grid">
          <div className="sv-video-card">
            <iframe src="https://www.youtube.com/embed/qY4_EG8gh9E" allowFullScreen title="Tulsa King Season 3"></iframe>
            <h6>Tulsa King Season 3</h6>
          </div>
          <div className="sv-video-card">
            <iframe src="https://www.youtube.com/embed/v88e9Dwnqo0" allowFullScreen title="1923"></iframe>
            <h6>1923</h6>
          </div>
          <div className="sv-video-card">
            <iframe src="https://www.youtube.com/embed/rutRDICG2oE" allowFullScreen title="Adulthood - Trailer"></iframe>
            <h6>Adulthood - Trailer</h6>
          </div>
        </div>
      </div>
    </main>
  );
}
