import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useFavoritos } from '../../context/FavoritosContext.jsx';
import useTituloPagina from '../../hooks/useTituloPagina.js';
import { obtenerContenido } from '../../services/contenidosService.js';

function urlEmbed(contenido) {
  if (contenido.embed_url) return contenido.embed_url;
  if (contenido.fuente === 'youtube' && contenido.external_id) {
    return `https://www.youtube.com/embed/${contenido.external_id}`;
  }
  return null;
}

export default function ReproductorPage() {
  const { id } = useParams();
  const [contenido, setContenido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const { esFavorito, alternar } = useFavoritos();
  const [errorFavorito, setErrorFavorito] = useState('');

  useTituloPagina(contenido ? `${contenido.titulo} · OpenLeaf` : 'Reproductor · OpenLeaf');

  useEffect(() => {
    let vivo = true;
    setCargando(true);
    setError('');

    obtenerContenido(id)
      .then((datos) => {
        if (vivo) setContenido(datos);
      })
      .catch((err) => {
        if (vivo) setError(err.message);
      })
      .finally(() => {
        if (vivo) setCargando(false);
      });

    return () => {
      vivo = false;
    };
  }, [id]);

  const embed = contenido ? urlEmbed(contenido) : null;
  const esFav = contenido ? esFavorito('contenido', contenido.id) : false;

  const alternarFavorito = async () => {
    setErrorFavorito('');
    try {
      await alternar('contenido', contenido.id);
    } catch (err) {
      setErrorFavorito(err.message);
    }
  };

  return (
    <main className="max-w-[1100px] mx-auto px-4 lg:px-6 py-6 min-h-[50vh]">
      <Link to="/buscar" className="sv-footer-link inline-flex mb-4"><i className="fas fa-arrow-left mr-2"></i>Volver</Link>

      {cargando && (
        <div className="text-center py-16 text-[#94a3b8]">
          <span className="animate-spin inline-block rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent mb-3"></span>
          <p className="m-0">Cargando contenido…</p>
        </div>
      )}

      {!cargando && error && (
        <div className="sv-section text-center py-12">
          <i className="fas fa-triangle-exclamation text-amber-400 text-3xl mb-3"></i>
          <p className="text-rose-400 m-0">{error}</p>
        </div>
      )}

      {!cargando && !error && contenido && (
        <>
          <div className="sv-section mb-5">
            <div className="rounded-xl overflow-hidden aspect-video bg-black">
              {embed ? (
                <iframe
                  src={embed}
                  className="w-full h-full border-0"
                  title={contenido.titulo}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#94a3b8]">
                  <p className="m-0">Este contenido no tiene un reproductor disponible.</p>
                </div>
              )}
            </div>
          </div>

          <div className="sv-section">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <span className="text-[0.7rem] uppercase tracking-widest text-[#94a3b8]">{contenido.seccion?.replace('_', ' ')}</span>
                <h1 className="sv-section-title mb-2">{contenido.titulo}</h1>
              </div>
              <button
                type="button"
                onClick={alternarFavorito}
                className="btn-sv-secondary text-sm py-2 px-4 inline-flex items-center gap-2"
              >
                <i className={esFav ? 'fas fa-heart' : 'far fa-heart'}></i>
                {esFav ? 'En tu biblioteca' : 'Añadir a favoritos'}
              </button>
            </div>
            {contenido.descripcion && <p className="text-[#cbd5e1] leading-relaxed mb-0">{contenido.descripcion}</p>}
            {errorFavorito && <p className="text-[0.8rem] text-rose-400 mt-2 mb-0">{errorFavorito}</p>}
          </div>
        </>
      )}
    </main>
  );
}
