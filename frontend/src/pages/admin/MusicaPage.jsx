import { useState } from 'react';

import BloqueContenidos from '../../components/admin/BloqueContenidos.jsx';
import BuscadorJamendo from '../../components/admin/BuscadorJamendo.jsx';
import { usePlayer } from '../../hooks/usePlayer.js';
import useTituloPagina from '../../hooks/useTituloPagina.js';

// Playlists de Spotify que ya vivían en la página de Música. Ahora también se
// pueden lanzar al reproductor flotante (igual que las canciones de Jamendo).
const PLAYLISTS_SPOTIFY = [
  {
    titulo: 'Top Global',
    icono: 'fa-fire',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZEVXbMDoHDwVN2tF'
  },
  {
    titulo: 'Top Colombia',
    icono: 'fa-star',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZEVXbOa2lmxNORXQ'
  },
  {
    titulo: 'Mix del Día',
    icono: 'fa-bolt',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX0XUsuxWHRQd'
  }
];

export default function MusicaPage() {
  useTituloPagina('Música - OpenLeaf');
  const { play } = usePlayer();
  const [vista, setVista] = useState('plataformas');

  const reproducirPlaylist = (titulo, embedUrl) => {
    play({
      titulo,
      fuente: 'spotify',
      seccion: 'musica',
      descripcion: 'Playlist de Spotify',
      embed_url: embedUrl
    });
  };

  return (
    <main className="max-w-[1400px] mx-auto px-4 lg:px-6 py-6">

      <div className="sv-page-header">
        <h1><i className="fas fa-music mr-2"></i>Música en Streaming</h1>
        <p>Todas las plataformas musicales en un solo lugar</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5" role="tablist" aria-label="Vistas de música">
        <button
          type="button"
          role="tab"
          aria-selected={vista === 'plataformas'}
          className={vista === 'plataformas' ? 'btn-sv-primary text-sm py-2 px-4' : 'btn-sv-visit text-sm py-2 px-4'}
          onClick={() => setVista('plataformas')}
        >
          <i className="fas fa-layer-group mr-1"></i>Plataformas
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={vista === 'jamendo'}
          className={vista === 'jamendo' ? 'btn-sv-primary text-sm py-2 px-4' : 'btn-sv-visit text-sm py-2 px-4'}
          onClick={() => setVista('jamendo')}
        >
          <i className="fas fa-magnifying-glass mr-1"></i>Buscar en Jamendo
        </button>
      </div>

      {vista === 'jamendo' ? (
        <BuscadorJamendo />
      ) : (
        <>

      {/* CARRUSEL */}
      <div className="sv-car-wrap">
        <div className="sv-car-scroll">
          <div className="sv-car-slide" id="ms1">
            <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1400&q=85" alt="SPOTIFY" />
            <div className="sv-car-cap">
              <span className="sv-car-badge" style={{ background: '#1DB954', color: '#fff' }}>SPOTIFY</span>
              <h5>100 Millones de Canciones</h5>
              <p>La biblioteca musical más grande del mundo al alcance de tu mano</p>
              <a href="https://www.spotify.com" target="_blank" rel="noopener noreferrer" className="btn-sv-primary text-sm py-2 px-4"><i className="fab fa-spotify mr-1"></i>Abrir Spotify</a>
            </div>
            <a href="#ms3" className="sv-car-arrow sv-car-arrow-prev"><i className="fas fa-chevron-left"></i></a>
            <a href="#ms2" className="sv-car-arrow sv-car-arrow-next"><i className="fas fa-chevron-right"></i></a>
          </div>
          <div className="sv-car-slide" id="ms2">
            <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1400&q=85" alt="YOUTUBE MUSIC" />
            <div className="sv-car-cap">
              <span className="sv-car-badge" style={{ background: '#ff0000', color: '#fff' }}>YOUTUBE MUSIC</span>
              <h5>Videos y Música Sin Límites</h5>
              <p>Videoclips oficiales, en vivo y versiones exclusivas</p>
              <a href="https://music.youtube.com" target="_blank" rel="noopener noreferrer" className="btn-sv-primary text-sm py-2 px-4"><i className="fab fa-youtube mr-1"></i>Abrir YT Music</a>
            </div>
            <a href="#ms1" className="sv-car-arrow sv-car-arrow-prev"><i className="fas fa-chevron-left"></i></a>
            <a href="#ms3" className="sv-car-arrow sv-car-arrow-next"><i className="fas fa-chevron-right"></i></a>
          </div>
          <div className="sv-car-slide" id="ms3">
            <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1400&q=85" alt="TIDAL HI-FI" />
            <div className="sv-car-cap">
              <span className="sv-car-badge" style={{ background: '#0693e3', color: '#fff' }}>TIDAL HI-FI</span>
              <h5>Calidad de Estudio sin Compresión</h5>
              <p>Audio lossless y Dolby Atmos para los oídos más exigentes</p>
              <a href="https://tidal.com" target="_blank" rel="noopener noreferrer" className="btn-sv-primary text-sm py-2 px-4"><i className="fas fa-headphones mr-1"></i>Abrir Tidal</a>
            </div>
            <a href="#ms2" className="sv-car-arrow sv-car-arrow-prev"><i className="fas fa-chevron-left"></i></a>
            <a href="#ms1" className="sv-car-arrow sv-car-arrow-next"><i className="fas fa-chevron-right"></i></a>
          </div>
        </div>
      </div>
      <div className="sv-car-dots">
        <a href="#ms1" className="sv-car-dot-a" title="Slide 1"></a>
        <a href="#ms2" className="sv-car-dot-a" title="Slide 2"></a>
        <a href="#ms3" className="sv-car-dot-a" title="Slide 3"></a>
      </div>

      {/* ACCESOS RÁPIDOS */}
      <div className="mb-8">
        <h5 className="font-bold text-base mb-3 sv-text-gradient"><i className="fas fa-bolt mr-2"></i>Accesos Rápidos</h5>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          <a href="https://www.spotify.com" target="_blank" rel="noopener noreferrer" className="sv-quick-card"><span className="sv-quick-icon text-[#1DB954]"><i className="fab fa-spotify"></i></span><span className="sv-quick-label">Spotify</span></a>
          <a href="https://music.youtube.com" target="_blank" rel="noopener noreferrer" className="sv-quick-card"><span className="sv-quick-icon text-[#ff0000]"><i className="fab fa-youtube"></i></span><span className="sv-quick-label">YT Music</span></a>
          <a href="https://music.apple.com" target="_blank" rel="noopener noreferrer" className="sv-quick-card"><span className="sv-quick-icon"><i className="fab fa-apple"></i></span><span className="sv-quick-label">Apple Music</span></a>
          <a href="https://soundcloud.com" target="_blank" rel="noopener noreferrer" className="sv-quick-card"><span className="sv-quick-icon text-[#FF5500]"><i className="fab fa-soundcloud"></i></span><span className="sv-quick-label">SoundCloud</span></a>
          <a href="https://www.deezer.com" target="_blank" rel="noopener noreferrer" className="sv-quick-card"><span className="sv-quick-icon"><i className="fas fa-music"></i></span><span className="sv-quick-label">Deezer</span></a>
          <a href="https://tidal.com" target="_blank" rel="noopener noreferrer" className="sv-quick-card"><span className="sv-quick-icon"><i className="fas fa-water"></i></span><span className="sv-quick-label">Tidal</span></a>
        </div>
      </div>

      {/* REPRODUCIR EN OPENLEAF (contenido de la base de datos) */}
      <BloqueContenidos seccion="musica" conGenero />

      {/* SPOTIFY */}
      <div className="sv-section">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" alt="Spotify" className="sv-platform-logo" />
            <div><h2 className="sv-platform-title">Spotify</h2><p className="sv-platform-desc">Más de 100 millones de canciones, podcasts y audiolibros</p></div>
          </div>
          <a href="https://www.spotify.com" target="_blank" rel="noopener noreferrer" className="btn-sv-visit"><i className="fab fa-spotify"></i> Abrir</a>
        </div>
        <div className="sv-music-grid">
          {PLAYLISTS_SPOTIFY.map((playlist) => (
            <div key={playlist.titulo} className="sv-music-card">
              <h6><i className={`fas ${playlist.icono} mr-1`}></i>{playlist.titulo}</h6>
              <iframe src={playlist.embedUrl} height="152" allowTransparency="true" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title={playlist.titulo}></iframe>
              <div className="p-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[0.68rem] text-[#1DB954]">
                  <i className="fab fa-spotify mr-1"></i>Vía Spotify · duración completa si tienes sesión iniciada
                </span>
                <button
                  type="button"
                  className="btn-sv-primary text-xs py-1 px-3"
                  onClick={() => reproducirPlaylist(playlist.titulo, playlist.embedUrl)}
                >
                  <i className="fas fa-play mr-1"></i>Reproducir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* YOUTUBE MUSIC */}
      <div className="sv-section">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div className="flex items-center gap-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/Youtube_Music_icon.svg" alt="YT Music" className="sv-platform-logo" />
            <div>
              <h2 className="sv-platform-title">YouTube Music</h2>
              <p className="sv-platform-desc">Videoclips, versiones en vivo y exclusivas de los mejores artistas</p>
            </div>
          </div>
          <a href="https://music.youtube.com" target="_blank" rel="noopener noreferrer" className="btn-sv-visit"><i className="fab fa-youtube mr-1"></i> Abrir</a>
        </div>
        <div className="sv-video-grid">
          <div className="sv-video-card">
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
              <iframe src="https://www.youtube.com/embed/q3lX2p_Uy9I?rel=0" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} allowFullScreen allow="accelerometer *; clipboard-write *; encrypted-media *; gyroscope *; picture-in-picture *; web-share *;" referrerPolicy="strict-origin" title="Video Destacado"></iframe>
            </div>
            <h6>Video Destacado</h6>
          </div>
          <div className="sv-video-card">
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
              <iframe src="https://www.youtube.com/embed/04854XqcfCY?rel=0" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} allowFullScreen title="Karol G - CAIRO"></iframe>
            </div>
            <h6>Karol G - CAIRO</h6>
          </div>
          <div className="sv-video-card">
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
              <iframe src="https://www.youtube.com/embed/ekr2nIex040?rel=0" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} allowFullScreen title="Shakira - Bzrp Music Sessions"></iframe>
            </div>
            <h6>Shakira - Bzrp Music Sessions</h6>
          </div>
        </div>
      </div>

      {/* APPLE MUSIC */}
      <div className="sv-section">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Apple_Music_icon.svg" alt="Apple Music" className="sv-platform-logo" />
            <div>
              <h2 className="sv-platform-title">Apple Music</h2>
              <p className="sv-platform-desc">100 millones de canciones con audio espacial Dolby Atmos</p>
            </div>
          </div>
          <a href="https://music.apple.com" target="_blank" rel="noopener noreferrer" className="btn-sv-visit"><i className="fab fa-apple mr-1"></i> Abrir</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="sv-feat"><span className="sv-feat-icon"><i className="fas fa-headphones"></i></span><h6>Audio Espacial</h6><p>Dolby Atmos y Lossless sin pérdida</p></div>
          <div className="sv-feat"><span className="sv-feat-icon"><i className="fas fa-radio"></i></span><h6>Apple Music Radio</h6><p>Estaciones 24h sin anuncios</p></div>
          <div className="sv-feat"><span className="sv-feat-icon"><i className="fas fa-compact-disc"></i></span><h6>100M+ Canciones</h6><p>La mayor biblioteca musical</p></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="sv-video-card" style={{ overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: '220px' }}>
              <iframe src="https://embed.music.apple.com/us/album/magical-mystery-tour/1441163490" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} allowFullScreen allow="encrypted-media *; fullscreen *; clipboard-write *;" title="Magical Mystery Tour · The Beatles"></iframe>
            </div>
            <h6>Magical Mystery Tour · The Beatles</h6>
          </div>
          <div className="sv-video-card" style={{ overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: '220px' }}>
              <iframe src="https://embed.podcasts.apple.com/us/podcast/the-crumb-bake-from-scratch/id1458736427" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} allowFullScreen allow="encrypted-media *; fullscreen *; clipboard-write *;" title="The Crumb · Podcast"></iframe>
            </div>
            <h6>The Crumb · Podcast</h6>
          </div>
        </div>
      </div>

      {/* SOUNDCLOUD */}
      <div className="sv-section">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Antu_soundcloud.svg" alt="SoundCloud" className="sv-platform-logo" />
            <div>
              <h2 className="sv-platform-title">SoundCloud</h2>
              <p className="sv-platform-desc">Descubre artistas emergentes y comparte tu propia música</p>
            </div>
          </div>
          <a href="https://soundcloud.com" target="_blank" rel="noopener noreferrer" className="btn-sv-visit"><i className="fab fa-soundcloud mr-1"></i> Abrir</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="sv-feat"><span className="sv-feat-icon"><i className="fas fa-users"></i></span><h6>40M+ Artistas</h6><p>La mayor comunidad indie</p></div>
          <div className="sv-feat"><span className="sv-feat-icon"><i className="fas fa-music"></i></span><h6>320M+ Pistas</h6><p>Música exclusiva independiente</p></div>
          <div className="sv-feat"><span className="sv-feat-icon"><i className="fas fa-dollar-sign"></i></span><h6>Plan Gratis</h6><p>Escucha sin registrarte</p></div>
        </div>
        <div className="sv-video-card" style={{ overflow: 'hidden' }}>
          <div style={{ position: 'relative', height: '220px' }}>
            <iframe src="https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F1668658005&show_artwork=true" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} allowFullScreen title="SoundCloud"></iframe>
          </div>
        </div>
      </div>

      {/* DEEZER + TIDAL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">

        {/* DEEZER */}
        <div className="sv-section">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img src="https://img.utdstc.com/icon/574/8f7/5748f7a5ecf472d1f91f5ba6a7309fecfffff78e3b090573385b7b662e8be7b7:200" alt="Deezer" className="sv-platform-logo" />
              <div>
                <h2 className="sv-platform-title" style={{ fontSize: '1.2rem' }}>Deezer</h2>
                <p className="sv-platform-desc text-xs">90M+ canciones con Flow personalizado</p>
              </div>
            </div>
            <a href="https://www.deezer.com" target="_blank" rel="noopener noreferrer" className="btn-sv-visit text-xs py-2 px-3"><i className="fas fa-external-link-alt"></i></a>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="sv-feat"><span className="sv-feat-icon"><i className="fas fa-magic"></i></span><h6>Flow IA</h6><p>Mix infinito personalizado</p></div>
            <div className="sv-feat"><span className="sv-feat-icon"><i className="fas fa-podcast"></i></span><h6>Podcasts</h6><p>Miles de episodios gratis</p></div>
          </div>
          <div className="sv-video-card" style={{ overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: '220px' }}>
              <iframe src="https://widget.deezer.com/widget/dark/playlist/1479458365?app_id=457142&autoplay=false&radius=true&tracklist=false" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} allowFullScreen allow="clipboard-write *; encrypted-media *;" title="Happy Hits · Playlist"></iframe>
            </div>
            <h6>Happy Hits · Playlist</h6>
          </div>
        </div>

        {/* TIDAL */}
        <div className="sv-section">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img src="https://cdn.aptoide.com/imgs/7/6/a/76adfcb8ebaaaeb43d4a9abdf2440300_icon.jpg" alt="Tidal" className="sv-platform-logo" style={{ borderRadius: '8px' }} />
              <div>
                <h2 className="sv-platform-title" style={{ fontSize: '1.2rem' }}>Tidal</h2>
                <p className="sv-platform-desc text-xs">HiFi y MQA · La mejor calidad de audio</p>
              </div>
            </div>
            <a href="https://tidal.com" target="_blank" rel="noopener noreferrer" className="btn-sv-visit text-xs py-2 px-3"><i className="fas fa-external-link-alt"></i></a>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="sv-feat"><span className="sv-feat-icon"><i className="fas fa-record-vinyl"></i></span><h6>MQA Lossless</h6><p>Calidad de estudio</p></div>
            <div className="sv-feat"><span className="sv-feat-icon"><i className="fas fa-compact-disc"></i></span><h6>Dolby Atmos</h6><p>Audio 3D inmersivo</p></div>
          </div>
          <div className="sv-video-card" style={{ overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: '220px' }}>
              <iframe src="https://embed.tidal.com/albums/75413011" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} allowFullScreen allow="encrypted-media *; fullscreen *; web-share *;" title="4:44 · JAY-Z"></iframe>
            </div>
            <h6>4:44 · JAY-Z</h6>
          </div>
        </div>

      </div>

        </>
      )}

    </main>
  );
}
