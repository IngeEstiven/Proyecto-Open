import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useFavoritos } from '../../context/FavoritosContext.jsx';
import { nombreCategoria } from '../../services/categoriasGZ.js';

// Flip card de videojuegos reutilizando las clases de las tarjetas flip de OpenLeaf.
// (.sv-flip*): misma fuente visual. El giro se controla por hover (CSS) y por
// click/toque/teclado (Enter o Espacio) mediante estado.
export default function JuegoFlipCard({ juego }) {
  const { esFavorito, alternar } = useFavoritos();
  const [girada, setGirada] = useState(false);
  const [errorFavorito, setErrorFavorito] = useState('');

  const esFav = esFavorito('juego', juego.id);
  const categoria = nombreCategoria(juego.categoria);
  const imagen = juego.imagen_url || '';

  const alternarFavorito = async (evento) => {
    evento.preventDefault();
    evento.stopPropagation();
    setErrorFavorito('');
    try {
      await alternar('juego', juego.id);
    } catch (error) {
      setErrorFavorito(error.message);
    }
  };

  const alTeclado = (evento) => {
    if (evento.key === 'Enter' || evento.key === ' ') {
      evento.preventDefault();
      setGirada((v) => !v);
    }
  };

  return (
    <div
      className="sv-flip"
      role="button"
      tabIndex={0}
      aria-label={`Ver más sobre ${juego.titulo}`}
      onClick={() => setGirada((v) => !v)}
      onKeyDown={alTeclado}
    >
      <div className="sv-flip-inner" style={girada ? { transform: 'rotateY(180deg)' } : undefined}>
        {/* ═══ FRENTE ═══ */}
        <div className="sv-flip-front">
          <div className="sv-img-wrap">
            {imagen ? (
              <img src={imagen} alt={juego.titulo} />
            ) : (
              <div
                className="sv-juego-sin-imagen"
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.2rem',
                  textAlign: 'center',
                  background: 'linear-gradient(160deg, rgba(30,27,75,.9), rgba(15,18,35,.95))'
                }}
              >
                <p className="sv-card-title" style={{ margin: 0 }}>{juego.titulo}</p>
              </div>
            )}
          </div>
          <div className="sv-card-body">
            <div className="flex items-center justify-between mb-2">
              {categoria ? (
                <span className="sv-categoria-tag">{categoria}</span>
              ) : (
                <span className="sv-categoria-tag">Juego</span>
              )}
              {juego.puntuacion != null && (
                <span className="sv-nota">
                  <i className="fas fa-star mr-1"></i>{juego.puntuacion}
                </span>
              )}
            </div>
            <p className="sv-card-title">{juego.titulo}</p>
            <p className="sv-card-desc">
              {juego.descripcion || 'Descubre este título en la ficha del juego.'}
            </p>
          </div>
        </div>

        {/* ═══ REVERSO ═══ */}
        <div className="sv-flip-back">
          <span className="sv-back-icon"><i className="fas fa-gamepad"></i></span>
          <p className="sv-back-title">{juego.titulo}</p>
          <p className="sv-back-desc">
            {juego.descripcion || 'Consulta los detalles completos en la ficha del juego.'}
          </p>
          {errorFavorito && <p className="text-[0.7rem] text-rose-400 m-0">{errorFavorito}</p>}
          <Link to={`/gamezone/${juego.slug}`} className="sv-btn-detail" onClick={(e) => e.stopPropagation()}>
            <i className="fas fa-gamepad"></i> Ver juego
          </Link>
          <button
            type="button"
            onClick={alternarFavorito}
            className="sv-btn-fav"
            title={esFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          >
            <i className={esFav ? 'fas fa-heart' : 'far fa-heart'}></i>
            {esFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          </button>
        </div>
      </div>
    </div>
  );
}