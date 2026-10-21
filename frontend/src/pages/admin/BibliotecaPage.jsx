import { Link } from 'react-router-dom';

import { useFavoritos } from '../../context/FavoritosContext.jsx';
import useTituloPagina from '../../hooks/useTituloPagina.js';
import { LOGO_URL } from '../../services/informacionSitio.js';

const RUTA_SECCION = {
  peliculas: '/peliculas',
  musica: '/musica',
  en_vivo: '/en-vivo',
  deportes: '/deportes'
};

function TarjetaBiblioteca({ favorito, onQuitar }) {
  const juego = favorito.juego;
  const contenido = favorito.contenido;
  const plataforma = favorito.plataforma;

  let destino = '#';
  let imagen = LOGO_URL;
  let titulo = 'Ítem';
  let etiqueta = '';

  if (juego) {
    destino = `/gamezone/${juego.slug}`;
    imagen = juego.imagen_url || LOGO_URL;
    titulo = juego.titulo;
    etiqueta = `Juego · ${juego.categoria}`;
  } else if (contenido) {
    destino = `/reproductor/${contenido.id}`;
    imagen = contenido.miniatura_url || LOGO_URL;
    titulo = contenido.titulo;
    etiqueta = `Contenido · ${contenido.seccion?.replace('_', ' ')}`;
  } else if (plataforma) {
    destino = RUTA_SECCION[plataforma.seccion] || '#';
    imagen = plataforma.logo_url || LOGO_URL;
    titulo = plataforma.nombre;
    etiqueta = `Plataforma · ${plataforma.seccion?.replace('_', ' ')}`;
  }

  return (
    <div className="sv-section relative flex flex-col">
      <Link to={destino} className="no-underline block">
        <div className="sv-video-card">
          <img src={imagen} alt={titulo} />
          <p className="sv-video-title">{titulo}</p>
        </div>
      </Link>
      <div className="flex items-center justify-between mt-2">
        <span className="text-[0.7rem] text-[#94a3b8] uppercase tracking-wide">{etiqueta}</span>
        <button
          type="button"
          onClick={() => onQuitar(favorito.id)}
          className="sv-btn-fav"
          title="Quitar de la biblioteca"
        >
          <i className="fas fa-trash-can"></i>
        </button>
      </div>
    </div>
  );
}

export default function BibliotecaPage() {
  useTituloPagina('Mi biblioteca · OpenLeaf');
  const { favoritos, cargando, quitar } = useFavoritos();

  return (
    <main className="max-w-[1600px] mx-auto px-4 lg:px-6 py-6 min-h-[50vh]">
      <div className="pb-4 mb-6 border-b border-[rgba(102,126,234,.2)]">
        <h1 className="sv-section-title mb-1"><i className="fas fa-bookmark mr-2 sv-text-gradient"></i>Mi biblioteca</h1>
        <p className="text-[#94a3b8] text-sm m-0">Todo lo que guardaste: juegos, contenidos y plataformas</p>
      </div>

      {cargando && (
        <div className="text-center py-10 text-[#94a3b8]">
          <span className="animate-spin inline-block rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent mb-3"></span>
          <p className="m-0">Cargando tu biblioteca…</p>
        </div>
      )}

      {!cargando && favoritos.length === 0 && (
        <div className="sv-section text-center py-12">
          <i className="fas fa-book-open text-[#94a3b8] text-3xl mb-3"></i>
          <p className="text-slate-200 font-bold m-0">Tu biblioteca está vacía</p>
          <p className="text-[#94a3b8] text-sm mb-4">Guarda juegos, contenidos y plataformas con el corazón para verlos aquí.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/gamezone" className="btn-sv-primary text-sm py-2 px-5">Explorar juegos</Link>
            <Link to="/inicio" className="btn-sv-secondary text-sm py-2 px-5">Ver plataformas</Link>
          </div>
        </div>
      )}

      {!cargando && favoritos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {favoritos.map((favorito) => (
            <TarjetaBiblioteca key={favorito.id} favorito={favorito} onQuitar={quitar} />
          ))}
        </div>
      )}
    </main>
  );
}
