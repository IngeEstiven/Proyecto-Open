// Catálogo estático de plataformas de OpenLeaf (copiado de los HTML originales).
// Se usa como contenido de respaldo y para enriquecer los datos de la API.

export const PLATAFORMAS_ESTATICAS = [
  // ══ SECCIÓN PELÍCULAS (index.html #peliculas) ══
  {
    id: 'netflix',                 // sufijo del lightbox: imgmodal-<id>
    seccion: 'peliculas',          // peliculas | musica | en_vivo | deportes
    nombre: 'Netflix',
    logo: 'https://images.ctfassets.net/4cd45et68cgf/Rx83JoRDMkYNlMC9MKzcB/2b14d5a59fc3937afd3f03191e19502d/Netflix-Symbol.png?w=200',
    logoClase: '',
    imagen: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400',
    imagenGrande: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=820',
    imagenEstilo: '',
    tarjetaClases: '',
    badge: { texto: 'Video', fondo: 'rgba(229,9,20,.18)', color: '#f87171', borde: 'rgba(229,9,20,.25)' },
    descripcion: 'Series, películas originales, documentales y contenido para toda la familia.',
    descripcionTrasera: 'Series originales, películas, documentales. HD, 4K y Dolby Atmos.',
    stats: [
      { valor: '300M+', etiqueta: 'Suscriptores' },
      { valor: '4K', etiqueta: 'Dolby Atmos' },
      { valor: '190+', etiqueta: 'Países' }
    ],
    sitio: 'https://www.netflix.com',
    sitioTexto: 'Visitar Netflix',
    lightbox: {
      tag: { texto: 'Video Streaming', icono: 'fas fa-film', fondo: 'rgba(229,9,20,.18)', color: '#f87171', borde: 'rgba(229,9,20,.25)' },
      descripcion: 'Series originales, películas de estreno, documentales. Planes desde básico hasta 4K con Dolby Atmos.'
    }
  },
  {
    id: 'prime',
    seccion: 'peliculas',
    nombre: 'Prime Video',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg',
    logoClase: '',
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShHjdc5f_ym3yh14jG8UkBivrdxLSGyVf-SQ&s',
    imagenGrande: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShHjdc5f_ym3yh14jG8UkBivrdxLSGyVf-SQ&s',
    imagenEstilo: '',
    tarjetaClases: '',
    badge: { texto: 'Video', fondo: 'rgba(0,168,225,.15)', color: '#38bdf8', borde: 'rgba(0,168,225,.25)' },
    descripcion: 'Contenido original de Amazon, películas y series exclusivas.',
    descripcionTrasera: 'Amazon Studios, offline en 240+ países. Incluido en Prime.',
    stats: [
      { valor: '200M+', etiqueta: 'Usuarios' },
      { valor: '240+', etiqueta: 'Países' },
      { valor: '4K', etiqueta: 'HDR10+' }
    ],
    sitio: 'https://www.primevideo.com',
    sitioTexto: 'Visitar Prime',
    lightbox: {
      tag: { texto: 'Video Streaming', icono: 'fas fa-film', fondo: 'rgba(0,168,225,.15)', color: '#38bdf8', borde: 'rgba(0,168,225,.25)' },
      descripcion: 'Contenido original de Amazon Studios incluido en Prime. 240+ países con descarga offline.'
    }
  },
  {
    id: 'hbo',
    seccion: 'peliculas',
    nombre: 'HBO Max',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg',
    logoClase: '',
    imagen: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400',
    imagenGrande: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=820',
    imagenEstilo: '',
    tarjetaClases: '',
    badge: { texto: 'Video', fondo: 'rgba(91,33,182,.2)', color: '#c4b5fd', borde: 'rgba(91,33,182,.3)' },
    descripcion: 'Lo mejor de HBO, Warner Bros y contenido premium exclusivo.',
    descripcionTrasera: 'HBO, Warner Bros y DC. Estrenos el mismo día que en cines.',
    stats: [
      { valor: '95M+', etiqueta: 'Suscriptores' },
      { valor: '4K', etiqueta: 'HDR Dolby' },
      { valor: '50+', etiqueta: 'Países' }
    ],
    sitio: 'https://www.max.com',
    sitioTexto: 'Visitar HBO Max',
    lightbox: {
      tag: { texto: 'Video Streaming', icono: 'fas fa-film', fondo: 'rgba(91,33,182,.2)', color: '#c4b5fd', borde: 'rgba(91,33,182,.3)' },
      descripcion: 'HBO, Warner Bros y DC. Series icónicas y estrenos el mismo día que en cines en 4K HDR.'
    }
  },
  {
    id: 'disney',
    seccion: 'peliculas',
    nombre: 'Disney+',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg',
    logoClase: '',
    imagen: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
    imagenGrande: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=820',
    imagenEstilo: '',
    tarjetaClases: '',
    badge: { texto: 'Video', fondo: 'rgba(29,78,216,.18)', color: '#93c5fd', borde: 'rgba(29,78,216,.28)' },
    descripcion: 'Disney, Pixar, Marvel, Star Wars y National Geographic.',
    descripcionTrasera: 'Disney, Pixar, Marvel, Star Wars y Nat Geo. 4K HDR semanal.',
    stats: [
      { valor: '150M+', etiqueta: 'Suscriptores' },
      { valor: '500+', etiqueta: 'Títulos Marvel' },
      { valor: '4K', etiqueta: 'HDR' }
    ],
    sitio: 'https://www.disneyplus.com',
    sitioTexto: 'Visitar Disney+',
    lightbox: {
      tag: { texto: 'Video Streaming', icono: 'fas fa-film', fondo: 'rgba(29,78,216,.18)', color: '#93c5fd', borde: 'rgba(29,78,216,.28)' },
      descripcion: 'Disney, Pixar, Marvel, Star Wars y National Geographic. Contenido nuevo cada semana en 4K HDR.'
    }
  },
  {
    id: 'apple',
    seccion: 'peliculas',
    nombre: 'Apple TV+',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg',
    logoClase: 'sv-logo-apple',
    imagen: 'https://images.unsplash.com/photo-1512070679279-8988d32161be?w=400',
    imagenGrande: 'https://images.unsplash.com/photo-1512070679279-8988d32161be?w=820',
    imagenEstilo: '',
    tarjetaClases: '',
    badge: { texto: 'Video', fondo: 'rgba(255,255,255,.08)', color: '#e2e8f0', borde: 'rgba(255,255,255,.12)' },
    descripcion: 'Producciones originales de Apple, exclusivo de calidad.',
    descripcionTrasera: 'Calidad cinematográfica en todos tus dispositivos Apple.',
    stats: [
      { valor: '50+', etiqueta: 'Originales' },
      { valor: '4K', etiqueta: 'Dolby Vision' },
      { valor: '100+', etiqueta: 'Países' }
    ],
    sitio: 'https://tv.apple.com',
    sitioTexto: 'Visitar Apple TV+',
    lightbox: {
      tag: { texto: 'Video Streaming', icono: 'fas fa-film', fondo: 'rgba(255,255,255,.08)', color: '#e2e8f0', borde: 'rgba(255,255,255,.12)' },
      descripcion: 'Producciones originales en Dolby Vision y Dolby Atmos. Disponible en todos tus dispositivos Apple.'
    }
  },
  {
    id: 'paramount',
    seccion: 'peliculas',
    nombre: 'Paramount+',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Paramount_Plus.svg',
    logoClase: '',
    imagen: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400',
    imagenGrande: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=820',
    imagenEstilo: '',
    tarjetaClases: '',
    badge: { texto: 'Video', fondo: 'rgba(14,116,144,.18)', color: '#67e8f9', borde: 'rgba(14,116,144,.28)' },
    descripcion: 'CBS, MTV, Nickelodeon y más contenido de ViacomCBS.',
    descripcionTrasera: 'CBS, MTV, Nickelodeon. Deportes en vivo y noticias 24/7.',
    stats: [
      { valor: '67M+', etiqueta: 'Suscriptores' },
      { valor: '24/7', etiqueta: 'Noticias CBS' },
      { valor: '4K', etiqueta: 'Streaming' }
    ],
    sitio: 'https://www.paramountplus.com',
    sitioTexto: 'Visitar Paramount+',
    lightbox: {
      tag: { texto: 'Video Streaming', icono: 'fas fa-film', fondo: 'rgba(14,116,144,.18)', color: '#67e8f9', borde: 'rgba(14,116,144,.28)' },
      descripcion: 'CBS, MTV, Nickelodeon y catálogo Paramount Pictures. Deportes en vivo y noticias 24/7.'
    }
  },
  {
    id: 'peacock',
    seccion: 'peliculas',
    nombre: 'Peacock',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/NBCUniversal_Peacock_Logo.svg',
    logoClase: '',
    imagen: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400',
    imagenGrande: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=820',
    imagenEstilo: '',
    tarjetaClases: '',
    badge: { texto: 'Video', fondo: 'rgba(21,128,61,.18)', color: '#86efac', borde: 'rgba(21,128,61,.28)' },
    descripcion: 'NBC Universal: series clásicas, deportes y contenido original.',
    descripcionTrasera: 'NBC Universal: NFL, F1 y Premier League. Plan gratuito disponible.',
    stats: [
      { valor: '30M+', etiqueta: 'Usuarios' },
      { valor: 'NFL', etiqueta: 'En vivo' },
      { valor: 'FREE', etiqueta: 'Plan gratis' }
    ],
    sitio: 'https://www.peacocktv.com',
    sitioTexto: 'Visitar Peacock',
    lightbox: {
      tag: { texto: 'Video Streaming', icono: 'fas fa-film', fondo: 'rgba(21,128,61,.18)', color: '#86efac', borde: 'rgba(21,128,61,.28)' },
      descripcion: 'NBC Universal: NFL, F1 y Premier League en vivo. Plan gratuito disponible con clásicos y originales.'
    }
  },
  {
    id: 'crunchyroll',
    seccion: 'peliculas',
    nombre: 'Crunchyroll',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Crunchyroll_Logo.png',
    logoClase: '',
    imagen: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400',
    imagenGrande: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=820',
    imagenEstilo: '',
    tarjetaClases: '',
    badge: { texto: 'Anime', fondo: 'rgba(234,88,12,.18)', color: '#fdba74', borde: 'rgba(234,88,12,.28)' },
    descripcion: 'La plataforma líder de anime, manga y cultura japonesa.',
    descripcionTrasera: '1,200+ títulos y 45,000 episodios. Simulcast desde Japón.',
    stats: [
      { valor: '1200+', etiqueta: 'Títulos' },
      { valor: '45K+', etiqueta: 'Episodios' },
      { valor: '200+', etiqueta: 'Países' }
    ],
    sitio: 'https://www.crunchyroll.com',
    sitioTexto: 'Visitar Crunchyroll',
    lightbox: {
      tag: { texto: 'Anime', icono: 'fas fa-dragon', fondo: 'rgba(234,88,12,.18)', color: '#fdba74', borde: 'rgba(234,88,12,.28)' },
      descripcion: '1,200+ títulos y 45,000 episodios anime. Simulcast desde Japón, manga digital y J-Pop.'
    }
  },

  // ══ SECCIÓN MÚSICA (index.html #musica) ══
  {
    id: 'spotify',
    seccion: 'musica',
    nombre: 'Spotify',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
    logoClase: '',
    imagen: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400',
    imagenGrande: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=820',
    imagenEstilo: '',
    tarjetaClases: '',
    badge: { texto: 'Música', fondo: 'rgba(30,215,96,.15)', color: '#4ade80', borde: 'rgba(30,215,96,.25)' },
    descripcion: 'Más de 100 millones de canciones y 5 millones de podcasts.',
    descripcionTrasera: '100M canciones, 5M podcasts. Playlists IA, offline y 320 kbps.',
    stats: [
      { valor: '602M+', etiqueta: 'Usuarios' },
      { valor: '100M+', etiqueta: 'Canciones' },
      { valor: '5M+', etiqueta: 'Podcasts' }
    ],
    sitio: 'https://www.spotify.com',
    sitioTexto: 'Visitar Spotify',
    lightbox: {
      tag: { texto: 'Música', icono: 'fas fa-music', fondo: 'rgba(30,215,96,.15)', color: '#4ade80', borde: 'rgba(30,215,96,.25)' },
      descripcion: '100M canciones, 5M podcasts y audiolibros. Playlists IA, descarga offline y 320 kbps.'
    }
  },
  {
    id: 'ytmusic',
    seccion: 'musica',
    nombre: 'YouTube Music',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Youtube_Music_icon.svg',
    logoClase: '',
    imagen: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
    imagenGrande: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=820',
    imagenEstilo: '',
    tarjetaClases: '',
    badge: { texto: 'Música', fondo: 'rgba(229,9,20,.15)', color: '#f87171', borde: 'rgba(229,9,20,.25)' },
    descripcion: 'Música, videos musicales y conciertos en vivo.',
    descripcionTrasera: 'Música oficial y videoclips. Integrado con YouTube Premium.',
    stats: [
      { valor: '100M+', etiqueta: 'Canciones' },
      { valor: '80M+', etiqueta: 'Usuarios' },
      { valor: 'HD', etiqueta: 'Videoclips' }
    ],
    sitio: 'https://music.youtube.com',
    sitioTexto: 'Visitar YT Music',
    lightbox: {
      tag: { texto: 'Música', icono: 'fas fa-music', fondo: 'rgba(229,9,20,.15)', color: '#f87171', borde: 'rgba(229,9,20,.25)' },
      descripcion: 'Música oficial, videoclips y conciertos en vivo. Integrado con YouTube Premium.'
    }
  },
  {
    id: 'applemusic',
    seccion: 'musica',
    nombre: 'Apple Music',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Apple_Music_icon.svg',
    logoClase: '',
    imagen: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=400',
    imagenGrande: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=820',
    imagenEstilo: '',
    tarjetaClases: '',
    badge: { texto: 'Música', fondo: 'rgba(255,255,255,.08)', color: '#e2e8f0', borde: 'rgba(255,255,255,.12)' },
    descripcion: 'Más de 100 millones de canciones sin anuncios ni interrupciones.',
    descripcionTrasera: '100M canciones lossless y Dolby Atmos. Radio 24h sin anuncios.',
    stats: [
      { valor: '100M+', etiqueta: 'Canciones' },
      { valor: 'Lossless', etiqueta: 'Calidad' },
      { valor: '24h', etiqueta: 'Radio' }
    ],
    sitio: 'https://music.apple.com',
    sitioTexto: 'Visitar Apple Music',
    lightbox: {
      tag: { texto: 'Música', icono: 'fas fa-music', fondo: 'rgba(255,255,255,.08)', color: '#e2e8f0', borde: 'rgba(255,255,255,.12)' },
      descripcion: '100M canciones lossless y Dolby Atmos. Sin anuncios, descarga y radio 24h.'
    }
  },
  {
    id: 'soundcloud',
    seccion: 'musica',
    nombre: 'SoundCloud',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Antu_soundcloud.svg',
    logoClase: '',
    imagen: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400',
    imagenGrande: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=820',
    imagenEstilo: '',
    tarjetaClases: '',
    badge: { texto: 'Indie', fondo: 'rgba(234,88,12,.15)', color: '#fdba74', borde: 'rgba(234,88,12,.25)' },
    descripcion: 'Descubre música emergente y artistas independientes.',
    descripcionTrasera: 'Música emergente y artistas independientes. Favorita de DJs.',
    stats: [
      { valor: '40M+', etiqueta: 'Artistas' },
      { valor: '320M+', etiqueta: 'Pistas' },
      { valor: 'FREE', etiqueta: 'Plan gratis' }
    ],
    sitio: 'https://soundcloud.com',
    sitioTexto: 'Visitar SoundCloud',
    lightbox: {
      tag: { texto: 'Indie · Música', icono: 'fas fa-headphones', fondo: 'rgba(234,88,12,.15)', color: '#fdba74', borde: 'rgba(234,88,12,.25)' },
      descripcion: 'Música emergente y artistas independientes. La favorita de productores y DJs para compartir sonidos únicos.'
    }
  },

  // ══ SECCIÓN VIDEO Y CONTENIDO EN VIVO (index.html #live) ══
  {
    id: 'youtube',
    seccion: 'en_vivo',
    nombre: 'YouTube',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg',
    logoClase: '',
    imagen: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600',
    imagenGrande: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=820',
    imagenEstilo: 'height:200px;',
    tarjetaClases: 'sv-flip-tall md:col-span-2',
    badge: { texto: 'Live · Video', fondo: 'rgba(229,9,20,.15)', color: '#f87171', borde: 'rgba(229,9,20,.25)' },
    badgeTraseroTexto: 'Live',
    feats: [
      { icono: 'fas fa-broadcast-tower', titulo: 'En Vivo', texto: 'Streams globales' },
      { icono: 'fas fa-film', titulo: 'Millones', texto: 'de videos' },
      { icono: 'fas fa-globe', titulo: 'Global', texto: '200+ países' }
    ],
    descripcion: 'Miles de millones de videos: música, tutoriales, gaming, vlogs y transmisiones en vivo.',
    descripcionTrasera: 'La plataforma de video más grande del mundo en 200+ países.',
    stats: [
      { valor: '2.7B+', etiqueta: 'Usuarios' },
      { valor: '500h', etiqueta: 'Video/min' },
      { valor: '80+', etiqueta: 'Idiomas' }
    ],
    sitio: 'https://www.youtube.com',
    sitioTexto: 'Visitar YouTube',
    lightbox: {
      tag: { texto: 'Live · Video', icono: 'fas fa-broadcast-tower', fondo: 'rgba(229,9,20,.15)', color: '#f87171', borde: 'rgba(229,9,20,.25)' },
      descripcion: 'La plataforma de video más grande del mundo. Música, gaming, vlogs y streams en 80 idiomas y 200+ países.'
    }
  },
  {
    id: 'twitch',
    seccion: 'en_vivo',
    nombre: 'Twitch',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Twitch_Glitch_Logo_Purple.svg',
    logoClase: '',
    imagen: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
    imagenGrande: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=820',
    imagenEstilo: '',
    tarjetaClases: '',
    badge: { texto: 'Gaming', fondo: 'rgba(145,70,255,.2)', color: '#c4b5fd', borde: 'rgba(145,70,255,.3)' },
    descripcion: 'Streaming en vivo de gaming, música, deportes y más.',
    descripcionTrasera: 'Streaming en vivo de gaming y esports. Millones de creadores.',
    stats: [
      { valor: '140M+', etiqueta: 'Usuarios' },
      { valor: '9M+', etiqueta: 'Streamers' },
      { valor: '1080p', etiqueta: '60fps' }
    ],
    sitio: 'https://www.twitch.tv',
    sitioTexto: 'Visitar Twitch',
    lightbox: {
      tag: { texto: 'Gaming · Live', icono: 'fas fa-gamepad', fondo: 'rgba(145,70,255,.2)', color: '#c4b5fd', borde: 'rgba(145,70,255,.3)' },
      descripcion: 'Plataforma líder de streaming en vivo para gaming y esports. Millones de creadores transmitiendo diariamente.'
    }
  },
  {
    id: 'vimeo',
    seccion: 'en_vivo',
    nombre: 'Vimeo',
    logo: 'https://play-lh.googleusercontent.com/iNaG_KPEUnnq-VsM8PKAfy2U8DWGWgBlUNgZy9LRPRt4klbludgBoKjA-mA_Oz3DPQ',
    logoClase: '',
    imagen: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400',
    imagenGrande: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=820',
    imagenEstilo: '',
    tarjetaClases: '',
    badge: { texto: 'Pro', fondo: 'rgba(26,183,234,.15)', color: '#67e8f9', borde: 'rgba(26,183,234,.25)' },
    descripcion: 'Plataforma para creadores de video profesional.',
    descripcionTrasera: '4K sin compresión para cineastas y creadores profesionales.',
    stats: [
      { valor: '300M+', etiqueta: 'Videos' },
      { valor: '4K', etiqueta: 'Sin compresión' },
      { valor: 'Pro', etiqueta: 'Creadores' }
    ],
    sitio: 'https://vimeo.com',
    sitioTexto: 'Visitar Vimeo',
    lightbox: {
      tag: { texto: 'Video Pro', icono: 'fas fa-video', fondo: 'rgba(26,183,234,.15)', color: '#67e8f9', borde: 'rgba(26,183,234,.25)' },
      descripcion: '4K sin compresión para cineastas y creadores profesionales. Herramientas de colaboración avanzadas.'
    }
  },

  // ══ SECCIÓN DEPORTES (deportes.html) ══
  // deportes.html no tiene tarjetas flip (.sv-flip), ni badges, ni stats,
  // ni lightboxes #imgmodal-*: usa bloques .sv-section con .sv-platform-*.
  // Los campos inexistentes quedan vacíos y lightbox queda en null.
  {
    id: 'espn',
    seccion: 'deportes',
    nombre: 'ESPN+',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/ESPN_wordmark.svg',
    logoClase: '',
    imagen: '',
    imagenGrande: '',
    imagenEstilo: '',
    tarjetaClases: '',
    badge: null,
    descripcion: 'NFL, NBA, MLB, NHL, MLS, UFC, golf, tenis y mucho más',
    descripcionTrasera: '',
    stats: [],
    sitio: 'https://www.espn.com/espnplus/',
    sitioTexto: 'Visitar',
    lightbox: null
  },
  {
    id: 'dazn',
    seccion: 'deportes',
    nombre: 'DAZN',
    logo: 'https://play-lh.googleusercontent.com/Ygc_b_RDFJfbMNXPsyFBDiwUsBz-rLrNWyL2f2LxernvBNYYaHFMCY9wnXHk3hEoybvp=w240-h480-rw',
    logoClase: '',
    imagen: '',
    imagenGrande: '',
    imagenEstilo: '',
    tarjetaClases: '',
    badge: null,
    descripcion: 'Fútbol, boxeo, MMA y los mejores deportes del mundo en directo',
    descripcionTrasera: '',
    stats: [],
    sitio: 'https://www.dazn.com',
    sitioTexto: 'Visitar',
    lightbox: null
  },
  {
    id: 'nba',
    seccion: 'deportes',
    nombre: 'NBA League Pass',
    logo: 'https://upload.wikimedia.org/wikipedia/en/0/03/National_Basketball_Association_logo.svg',
    logoClase: '',
    imagen: '',
    imagenGrande: '',
    imagenEstilo: '',
    tarjetaClases: '',
    badge: null,
    descripcion: '',
    descripcionTrasera: '',
    stats: [],
    sitio: 'https://www.nba.com/league-pass',
    sitioTexto: '',
    lightbox: null
  },
  {
    id: 'f1tv',
    seccion: 'deportes',
    nombre: 'F1 TV Pro',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/33/F1.svg',
    logoClase: '',
    imagen: '',
    imagenGrande: '',
    imagenEstilo: '',
    tarjetaClases: '',
    badge: null,
    descripcion: '',
    descripcionTrasera: '',
    stats: [],
    sitio: 'https://f1tv.formula1.com',
    sitioTexto: '',
    lightbox: null
  }
];
