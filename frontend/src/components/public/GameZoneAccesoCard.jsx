import { useState } from 'react';
import { Link } from 'react-router-dom';

// Flip card de acceso a GameZone. Usa las mismas clases sv-flip* que las tarjetas
// flip de OpenLeaf: frente = identidad de GameZone, reverso = descripción + botón.
// El giro se controla por hover (CSS) y por click/toque/teclado (Enter o Espacio).
export default function GameZoneAccesoCard() {
  const [girada, setGirada] = useState(false);

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
      aria-label="Acceder a GameZone"
      onClick={() => setGirada((v) => !v)}
      onKeyDown={alTeclado}
    >
      <div className="sv-flip-inner" style={girada ? { transform: 'rotateY(180deg)' } : undefined}>
        {/* ═══ FRENTE ═══ */}
        <div className="sv-flip-front">
          <div
            className="sv-img-wrap"
            style={{
              height: '170px',
              background: 'linear-gradient(160deg, rgba(109,40,217,.85), rgba(15,18,35,.95))'
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                padding: '1.2rem',
                textAlign: 'center'
              }}
            >
              <i className="fas fa-gamepad sv-text-gradient" style={{ fontSize: '3rem' }}></i>
              <p className="sv-card-title" style={{ margin: 0, fontSize: '1.5rem' }}>GameZone</p>
            </div>
          </div>
          <div className="sv-card-body">
            <div className="flex items-center justify-between mb-2">
              <span className="sv-categoria-tag">Videojuegos</span>
            </div>
            <p className="sv-card-title">Tu portal de gaming</p>
            <p className="sv-card-desc">
              Fichas, tráilers y pedidos de los mejores títulos en un solo lugar.
            </p>
          </div>
        </div>

        {/* ═══ REVERSO ═══ */}
        <div className="sv-flip-back">
          <span className="sv-back-icon"><i className="fas fa-gamepad"></i></span>
          <p className="sv-back-title">GameZone</p>
          <p className="sv-back-desc">
            Explora el catálogo de videojuegos de OpenLeaf: sinopsis, galería, tráiler de
            YouTube y simulador de pedido. Todo desde la sección GameZone.
          </p>
          <Link to="/gamezone" className="sv-btn-detail" onClick={(e) => e.stopPropagation()}>
            <i className="fas fa-gamepad"></i> Entrar a GameZone
          </Link>
        </div>
      </div>
    </div>
  );
}