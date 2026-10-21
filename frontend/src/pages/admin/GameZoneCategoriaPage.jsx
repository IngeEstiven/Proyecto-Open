import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';

import GameZoneSidebar from '../../components/public/GameZoneSidebar.jsx';
import useTituloPagina from '../../hooks/useTituloPagina.js';
import { nombreCategoria } from '../../services/categoriasGZ.js';
import { FICHAS } from '../../services/fichasEstaticas.js';

const TARJETA =
  'flex flex-col rounded-xl overflow-hidden border border-white/[.07] bg-[rgba(30,30,30,.7)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_20px_rgba(3,218,198,.2)] hover:border-accent';

const BADGE =
  'inline-block text-[.62rem] font-bold tracking-[1.8px] uppercase border border-primary text-primary bg-black/55 px-2.5 py-0.5 rounded-full';

const IMAGEN =
  'w-full h-full object-cover border-b-2 border-accent transition-transform duration-300 cursor-pointer hover:scale-[1.06]';

const BOTON =
  'self-start inline-flex items-center gap-1 bg-gradient-to-r from-primary to-[#9965f4] text-white no-underline px-4 py-1.5 rounded-full text-xs font-bold hover:brightness-125 transition-all';

// Datos de cada página de categoría, fieles a accion/terror/deportes/cooperativo.html.
const CATEGORIAS = {
  accion: {
    tituloDocumento: 'Juegos de Acción | GameZone',
    titulo: 'Juegos de Acción',
    descripcion: 'Adrenalina pura, combates intensos y mundos por conquistar.',
    juegos: [
      { slug: 'horizon', titulo: 'Horizon Zero Dawn', desc: 'Un mundo abierto vasto lleno de peligros y misterios oscuros.' },
      { slug: 'halo', titulo: 'Halo Infinite', desc: 'El Jefe Maestro regresa para enfrentarse a los Desterrados.' },
      { slug: 'gow', titulo: 'God of War Ragnarök', desc: 'Kratos y Atreus se adentran en los reinos nórdicos.' },
      { slug: 'callofduty', titulo: 'Call of Duty WWII', desc: 'Una experiencia sobrecogedora que redefine la Segunda Guerra Mundial.' },
      { slug: 'uncharted4', titulo: 'Uncharted: Legacy of Thieves', desc: 'Colección remasterizada de los dos juegos de la saga Uncharted.' }
    ]
  },
  terror: {
    tituloDocumento: 'Juegos de Terror | GameZone',
    titulo: 'Juegos de Terror',
    descripcion: '¿Te atreves a enfrentar tus miedos en la oscuridad?',
    juegos: [
      { slug: 'residentevil', titulo: 'Resident Evil Village', desc: 'Terror y supervivencia en primera persona a su máxima expresión.' }
    ]
  },
  deportes: {
    tituloDocumento: 'Deportes y Carreras | GameZone',
    titulo: 'Deportes y Carreras',
    descripcion: 'Competición al más alto nivel y velocidad extrema.',
    juegos: [
      { slug: 'fc', titulo: 'FC 2026', desc: 'La simulación de fútbol más realista hasta la fecha.' },
      { slug: 'efootball', titulo: 'eFootball', desc: 'Una evolución del clásico PES.' },
      { slug: 'gridlegends', titulo: 'GRID Legends', desc: 'Videojuego de carreras de estilo arcade y simulación ligera.' },
      { slug: 'nba2k26', titulo: 'NBA2K 2026', desc: 'La simulación de baloncesto más realista hasta la fecha.' }
    ]
  },
  cooperativo: {
    tituloDocumento: 'Juegos Co-op | GameZone',
    titulo: 'Juegos Co-op',
    descripcion: 'Embárcate en aventuras diseñadas para disfrutar en compañía.',
    juegos: [
      { slug: 'awayout', titulo: 'A Way Out', desc: 'Leo y Vincent buscan su libertad al tratar de escapar juntos.' },
      { slug: 'ittakestwo', titulo: 'It Takes Two', desc: 'Embárcate en la aventura cooperativa de tu vida.' }
    ]
  }
};

export default function GameZoneCategoriaPage() {
  const { categoria } = useParams();
  const [lightbox, setLightbox] = useState(null);
  const datos = CATEGORIAS[categoria];

  useTituloPagina(datos ? datos.tituloDocumento : 'GameZone');

  if (!datos) return <Navigate to="/gamezone" replace />;

  return (
    <>
      {/* LAYOUT */}
      <div className="flex">
        <GameZoneSidebar activa={categoria} />

        {/* MAIN */}
        <main className="flex-1 p-6 xl:p-10 min-w-0">
          <div className="mb-8">
            <h2 className="font-display text-4xl text-primary tracking-widest mb-2">
              {datos.titulo}
            </h2>
            <p className="text-gray-400 font-sans text-base">{datos.descripcion}</p>
            <div className="mt-3 h-px bg-gradient-to-r from-primary/40 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {datos.juegos.map((juego) => {
              const ficha = FICHAS[juego.slug];
              return (
                <div key={juego.slug} className={TARJETA}>
                  <div className="relative h-44 overflow-hidden">
                    <button
                      type="button"
                      className="block w-full h-full p-0 border-0 bg-transparent"
                      onClick={() => setLightbox(ficha.caratula)}
                      aria-label={`Ver imagen de ${juego.titulo}`}
                    >
                      <img src={ficha.caratula} alt={juego.titulo} className={IMAGEN} />
                    </button>
                  </div>
                  <div className="flex flex-col flex-1 gap-2 p-4">
                    <span className={`${BADGE} self-start`}>{nombreCategoria(categoria)}</span>
                    <h3 className="text-white font-semibold text-base m-0 font-sans">
                      {juego.titulo}
                    </h3>
                    <p className="text-gray-400 text-sm flex-1 m-0 font-sans">{juego.desc}</p>
                    <Link to={`/gamezone/${juego.slug}`} className={BOTON}>
                      <i className="bi bi-play-fill"></i>Ver Juego
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {datos.juegos.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center py-16 text-gray-500">
              <i className="bi bi-controller text-4xl mb-3 text-accent/60"></i>
              <p className="m-0 font-sans">
                Aún no hay juegos en esta categoría.
              </p>
            </div>
          )}

          <p className="text-gray-600 text-xs mt-10 pt-3 border-t border-white/[.05]">
            Desarrollado por: <strong className="text-gray-400">SAMB</strong>
          </p>
        </main>
      </div>

      {/* LIGHTBOX */}
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
