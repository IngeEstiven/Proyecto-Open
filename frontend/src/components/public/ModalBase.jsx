import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// Estilos base de todos los modales: animaciones de entrada (desde arriba) y una
// regla que "aplana" el contenido heredado de las vistas originales para que no
// rompa el panel (evita position/inset/transform/max-height heredados). No se
// reinician márgenes para conservar el espaciado interno de cada tarjeta.
const ESTILOS_MODALBASE = `
@keyframes op-modal-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes op-modal-drop { from { opacity: 0; transform: translateY(-14px); } to { opacity: 1; transform: translateY(0); } }
.op-modal-panel > *:not(.op-modal-close) {
  position: relative !important;
  inset: auto !important;
  transform: none !important;
  max-height: none !important;
}
`;

// Contenedor único de todos los modales. Se monta en document.body con un portal
// para que ningún ancestro (transform, overflow, position) rompa el position:fixed.
// Cierra con el botón X, con clic fuera del panel y con la tecla Esc, y bloquea el
// scroll del body mientras está abierto. No mueve el scroll al abrir (foco sin salto).
export default function ModalBase({ abierto, onCerrar, ancho = '520px', etiqueta, children }) {
  const refPanel = useRef(null);

  // Bloquea el scroll del fondo compensando el ancho de la barra de desplazamiento.
  useEffect(() => {
    if (!abierto) return undefined;
    const overflowPrevio = document.body.style.overflow;
    const paddingPrevio = document.body.style.paddingRight;
    const compensacion = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (compensacion > 0) document.body.style.paddingRight = `${compensacion}px`;

    const alTeclado = (evento) => {
      if (evento.key === 'Escape') onCerrar?.();
    };
    window.addEventListener('keydown', alTeclado);

    return () => {
      document.body.style.overflow = overflowPrevio;
      document.body.style.paddingRight = paddingPrevio;
      window.removeEventListener('keydown', alTeclado);
    };
  }, [abierto, onCerrar]);

  // Lleva el foco al primer control sin provocar saltos de scroll.
  useEffect(() => {
    if (!abierto) return;
    const primero = refPanel.current?.querySelector(
      'input:not([type="hidden"]), select, textarea, button:not(.op-modal-close), a[href]'
    );
    primero?.focus?.({ preventScroll: true });
  }, [abierto]);

  if (!abierto) return null;

  const alFondo = (evento) => {
    if (evento.target === evento.currentTarget) onCerrar?.();
  };

  return createPortal(
    <>
      <style>{ESTILOS_MODALBASE}</style>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={etiqueta}
        onMouseDown={alFondo}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          overflowY: 'auto',
          padding: '5vh 16px',
          background: 'rgba(4,5,14,.72)',
          backdropFilter: 'blur(6px)',
          animation: 'op-modal-fade .2s ease'
        }}
      >
        <div
          ref={refPanel}
          className="op-modal-panel sv-modal-card"
          style={{ width: '100%', maxWidth: ancho, animation: 'op-modal-drop .25s ease' }}
        >
          <button
            type="button"
            className="sv-modal-close op-modal-close"
            onClick={onCerrar}
            aria-label="Cerrar"
          >
            <i className="fas fa-times"></i>
          </button>
          {children}
        </div>
      </div>
    </>,
    document.body
  );
}
