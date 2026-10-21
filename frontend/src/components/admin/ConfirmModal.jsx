import { useEffect } from 'react';

import ModalBase from '../public/ModalBase.jsx';

// Diálogo de confirmación del panel. Sustituye a window.confirm con el mismo
// aspecto del sitio. La variante decide el color del botón principal y, en
// "peligro", el foco inicial queda en Cancelar para evitar confirmaciones por
// inercia.

const VARIANTES = {
  peligro: 'btn-sv-danger',
  aviso: 'btn-sv-warning',
  normal: 'btn-sv-primary'
};

export default function ConfirmModal({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  variante = 'normal',
  cargando = false,
  error = '',
  onConfirmar,
  onCancelar
}) {
  useEffect(() => {
    if (abierto && variante === 'peligro') {
      const boton = document.querySelector('.op-modal-panel .sv-confirm-cancelar');
      boton?.focus?.({ preventScroll: true });
    }
  }, [abierto, variante]);

  return (
    <ModalBase abierto={abierto} onCerrar={cargando ? undefined : onCancelar} ancho="460px" etiqueta={titulo}>
      <h3 className="sv-modal-title">{titulo}</h3>
      <p className="sv-modal-sub mt-2 mb-4">{mensaje}</p>
      {error && <p className="text-rose-400 text-sm mb-3">{error}</p>}
      <div className="flex gap-3 justify-end flex-wrap">
        <button
          type="button"
          className="btn-sv-secondary sv-confirm-cancelar"
          onClick={onCancelar}
          disabled={cargando}
        >
          Cancelar
        </button>
        <button
          type="button"
          className={`${VARIANTES[variante] || VARIANTES.normal} disabled:opacity-60`}
          onClick={onConfirmar}
          disabled={cargando}
        >
          {cargando ? 'Procesando…' : textoConfirmar}
        </button>
      </div>
    </ModalBase>
  );
}
