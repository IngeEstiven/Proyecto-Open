import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useFavoritos } from '../../context/FavoritosContext.jsx';
import useTituloPagina from '../../hooks/useTituloPagina.js';
import { FICHAS } from '../../services/fichasEstaticas.js';
import { obtenerJuego } from '../../services/juegosService.js';

const ETIQUETA =
  'inline-block font-sans text-xs font-bold border border-primary/40 text-primary/80 bg-primary/10 px-3 py-1 rounded-full';

const REDIRECCION_SIDEBAR =
  'sidebar-link flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-gray-400 border-l-4 border-transparent bg-white/[.04] hover:border-accent hover:bg-accent/10 hover:text-white';

// Navega a una sección de la página (Trailer / Galería).
function irASeccion(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function GameZoneFichaPage() {
  const { slug } = useParams();
  const fichaEstatica = FICHAS[slug];
  const [juegoApi, setJuegoApi] = useState(null);
  const [indice, setIndice] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const { esFavorito, alternar } = useFavoritos();

  useEffect(() => {
    let vivo = true;
    if (fichaEstatica) {
      obtenerJuego(slug)
        .then((dato) => {
          if (vivo) setJuegoApi(dato);
        })
        .catch(() => {
          // Sin registro en la API se muestra la ficha estática.
        });
      setIndice(0);
    }
    return () => {
      vivo = false;
    };
  }, [slug, fichaEstatica]);

  const datos = useMemo(() => {
    if (!fichaEstatica) return null;
    const api = juegoApi || {};
    const videoYoutube = api.trailer_youtube_id || fichaEstatica.video.youtubeId;
    return {
      titulo: api.titulo || fichaEstatica.titulo,
      etiquetas: fichaEstatica.etiquetas,
      sinopsis: api.descripcion || fichaEstatica.sinopsis,
      desarrollador: fichaEstatica.desarrollador,
      lanzamiento: fichaEstatica.lanzamiento,
      plataformas: fichaEstatica.plataformas,
      puntuacion: fichaEstatica.puntuacion,
      banner: fichaEstatica.banner,
      caratula: fichaEstatica.caratula,
      ctaTexto: fichaEstatica.ctaTexto,
      video: { ...fichaEstatica.video, youtubeId: videoYoutube },
      galeria: fichaEstatica.galeria
    };
  }, [fichaEstatica, juegoApi]);

  useTituloPagina(datos ? `${datos.titulo} | GameZone` : 'GameZone');

  if (!datos) {
    return (
      <main className="flex-1 p-6 xl:p-10 min-w-0 text-center py-24">
        <h2 className="font-display text-3xl text-primary tracking-widest mb-3">Juego no encontrado</h2>
        <p className="text-gray-400 font-sans mb-6">Este juego no existe en GameZone.</p>
        <Link
          to="/gamezone"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-[#9965f4] text-white no-underline px-5 py-2.5 rounded-full text-sm font-bold hover:brightness-125 transition-all"
        >
          <i className="bi bi-arrow-left"></i>Volver a la lista
        </Link>
      </main>
    );
  }

  const esFavoritoJuego = juegoApi ? esFavorito('juego', juegoApi.id) : false;
  const total = datos.galeria.imagenes.length;
  const alAnterior = () => setIndice((i) => (i - 1 + total) % total);
  const alSiguiente = () => setIndice((i) => (i + 1) % total);

  return (
    <>
      {/* LAYOUT */}
      <div className="flex">
        {/* SIDEBAR MENÚ */}
        <aside className="hidden md:flex flex-col sticky top-[68px] h-[calc(100vh-68px)] w-[200px] shrink-0 bg-[rgba(12,12,12,.88)] backdrop-blur-lg border-r border-primary/20 px-4 py-6">
          <p className="text-accent text-[.65rem] uppercase tracking-[3px] pb-3 border-b border-accent/25 mb-4 font-bold">
            Menú
          </p>
          <nav className="flex flex-col gap-1.5">
            <Link to="/gamezone" className={REDIRECCION_SIDEBAR}>
              <i className="bi bi-arrow-left"></i>Volver
            </Link>
            <button type="button" className={`${REDIRECCION_SIDEBAR} w-full text-left cursor-pointer`} onClick={() => irASeccion('video-section')}>
              <i className="bi bi-play-circle"></i>Trailer
            </button>
            <button type="button" className={`${REDIRECCION_SIDEBAR} w-full text-left cursor-pointer`} onClick={() => irASeccion('gallery-section')}>
              <i className="bi bi-images"></i>Galería
            </button>
          </nav>
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-6 xl:p-10 min-w-0">
          <Link
            to="/gamezone"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-[#9965f4] text-white no-underline px-5 py-2.5 rounded-full text-sm font-bold mb-6 hover:brightness-125 transition-all"
          >
            <i className="bi bi-arrow-left"></i>Volver a la lista
          </Link>

          {/* Banner */}
          <div
            className="w-full h-[280px] rounded-2xl mb-6 border border-white/10 overflow-hidden"
            style={{ position: 'relative', boxShadow: 'inset 0 -80px 120px #080808' }}
          >
            <img
              src={datos.banner}
              alt={`Banner de ${datos.titulo}`}
              className="w-full h-full object-cover block"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = datos.caratula;
              }}
            />
          </div>

          {/* Info principal */}
          <div className="flex flex-col sm:flex-row gap-6 mb-8">
            <img
              src={datos.caratula}
              alt="Carátula"
              className="w-[180px] shrink-0 rounded-xl border-2 border-white/20 shadow-[0_0_24px_rgba(187,134,252,.4)] self-start"
            />
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <h1
                  className="font-display text-4xl text-accent tracking-widest mb-3 flex-1"
                  style={{ textShadow: '0 0 16px rgba(3,218,198,.4)' }}
                >
                  {datos.titulo}
                </h1>
                {juegoApi && (
                  <button
                    type="button"
                    onClick={() => alternar('juego', juegoApi.id)}
                    className={`shrink-0 text-2xl transition-colors cursor-pointer p-1 mt-1 ${esFavoritoJuego ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'}`}
                    title={esFavoritoJuego ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                    aria-label={esFavoritoJuego ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                  >
                    <i className={`bi ${esFavoritoJuego ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {datos.etiquetas.map((etiqueta) => (
                  <span key={etiqueta} className={ETIQUETA}>
                    {etiqueta}
                  </span>
                ))}
              </div>
              <h3 className="font-sans text-primary font-bold text-base mb-2">Sinopsis</h3>
              <p className="font-sans text-gray-300 text-sm leading-relaxed mb-4">{datos.sinopsis}</p>
              <div className="grid grid-cols-2 gap-4 bg-[rgba(30,30,30,.7)] border border-white/10 rounded-xl p-4 mb-5">
                <div>
                  <strong className="block font-sans text-xs text-primary font-bold mb-0.5">Desarrollador</strong>
                  <span className="font-sans text-sm text-gray-400">{datos.desarrollador}</span>
                </div>
                <div>
                  <strong className="block font-sans text-xs text-primary font-bold mb-0.5">Lanzamiento</strong>
                  <span className="font-sans text-sm text-gray-400">{datos.lanzamiento}</span>
                </div>
                <div>
                  <strong className="block font-sans text-xs text-primary font-bold mb-0.5">Plataforma</strong>
                  <span className="font-sans text-sm text-gray-400">{datos.plataformas}</span>
                </div>
                <div>
                  <strong className="block font-sans text-xs text-primary font-bold mb-0.5">Puntuación</strong>
                  <span className="font-sans text-sm text-gray-400">{datos.puntuacion}</span>
                </div>
              </div>
              <Link
                to={`/checkout/${slug}`}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-[#9965f4] text-white no-underline px-6 py-3 rounded-full font-bold text-sm hover:brightness-125 transition-all shadow-[0_0_20px_rgba(187,134,252,.3)]"
              >
                <i className="bi bi-cart-fill"></i>{datos.ctaTexto}
              </Link>
              <p className="font-sans text-gray-500 text-xs mt-3 italic">
                <i className="bi bi-info-circle me-1"></i>
                Es una simulación de compra: no se realiza ningún cobro.
              </p>
            </div>
          </div>

          {/* VIDEO */}
          <section
            id="video-section"
            className="rounded-2xl p-6 mb-8 border border-white/10 border-l-4 border-l-accent bg-[rgba(20,20,20,.7)]"
          >
            <h2 className="font-display text-2xl text-primary tracking-widest mb-1">
              <i className="bi bi-play-circle-fill me-2"></i>{datos.video.titulo}
            </h2>
            <p className="font-sans text-gray-400 text-sm mb-4">{datos.video.descripcion}</p>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={`https://www.youtube.com/embed/${datos.video.youtubeId}`}
                title={`Tráiler de ${datos.titulo}`}
                className="absolute inset-0 w-full h-full rounded-xl border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <p className="font-sans text-gray-500 text-xs mt-3 italic">
              <i className="bi bi-info-circle me-1"></i>{datos.video.tip}
            </p>
          </section>

          {/* GALERÍA */}
          <section
            id="gallery-section"
            className="rounded-2xl p-6 mb-8 border border-white/10 border-l-4 border-l-primary bg-[rgba(20,20,20,.7)]"
          >
            <h2 className="font-display text-2xl text-primary tracking-widest mb-1">
              <i className="bi bi-images me-2"></i>{datos.galeria.titulo}
            </h2>
            <p className="font-sans text-gray-400 text-sm mb-4">{datos.galeria.ayuda}</p>

            <div className="gz-carousel relative">
              <div className="relative overflow-hidden rounded-xl mb-3">
                {datos.galeria.imagenes.map((imagen, i) => (
                  <div key={imagen.caption} className={i === indice ? 'gz-slide w-full' : 'gz-slide w-full hidden'}>
                    <img
                      src={imagen.imagen}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = datos.caratula;
                      }}
                      alt={imagen.caption}
                      className="w-full h-[380px] object-cover rounded-xl cursor-zoom-in"
                      onClick={() => setLightbox(imagen.imagen)}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="gz-prev absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/60 border border-primary/40 flex items-center justify-center text-primary hover:bg-primary/20 transition-all cursor-pointer"
                  onClick={alAnterior}
                  aria-label="Imagen anterior"
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
                <button
                  type="button"
                  className="gz-next absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/60 border border-primary/40 flex items-center justify-center text-primary hover:bg-primary/20 transition-all cursor-pointer"
                  onClick={alSiguiente}
                  aria-label="Imagen siguiente"
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="gz-caption font-sans text-xs text-white bg-black/60 px-3 py-1 rounded-full">
                    {datos.galeria.imagenes[indice].caption}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {datos.galeria.imagenes.map((imagen, i) => (
                  <button
                    key={`t-${imagen.caption}`}
                    type="button"
                    className={`gz-thumb overflow-hidden rounded-lg border-2 transition-all hover:border-accent/60 cursor-pointer ${i === indice ? 'ring-2 ring-accent' : 'border-transparent'}`}
                    onClick={() => setIndice(i)}
                    aria-label={`Ver miniatura ${i + 1}`}
                  >
                    <img
                      src={imagen.imagen}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = datos.caratula;
                      }}
                      alt={`Miniatura ${i + 1}`}
                      className="w-full h-[70px] object-cover block"
                    />
                  </button>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* LIGHTBOX GALERÍA */}
      <div
        className={`lightbox fixed inset-0 z-[2000] flex justify-center items-center bg-black/55 backdrop-blur-2xl ${lightbox ? 'is-open' : ''}`}
      >
        <a className="absolute inset-0 cursor-default" onClick={() => setLightbox(null)}></a>
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