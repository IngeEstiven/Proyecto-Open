import { useEffect, useState } from 'react';

import ModalBase from '../public/ModalBase.jsx';

// Cambio de contraseña de un usuario desde el panel. Sustituye a window.prompt.
// Valida longitud y confirmación en línea antes de llamar al backend; los errores
// del servidor se muestran dentro del propio modal.

export default function PasswordModal({ abierto, usuario, onCancelar, onGuardar }) {
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [ver, setVer] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (abierto) {
      setNueva('');
      setConfirmar('');
      setVer(false);
      setError('');
      setCargando(false);
    }
  }, [abierto]);

  const enviar = async (evento) => {
    evento.preventDefault();
    setError('');
    if (nueva.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (nueva !== confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setCargando(true);
    try {
      await onGuardar(nueva);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <ModalBase abierto={abierto} onCerrar={cargando ? undefined : onCancelar} ancho="440px" etiqueta="Cambiar contraseña">
      <h3 className="sv-modal-title">Cambiar contraseña de @{usuario?.username}</h3>
      <p className="sv-modal-sub mt-2 mb-4">Define una nueva contraseña para esta cuenta.</p>
      <form onSubmit={enviar} className="flex flex-col gap-4">
        <div>
          <label className="text-[#94a3b8] text-xs block mb-1">Nueva contraseña</label>
          <div className="sv-password-wrap">
            <input
              type={ver ? 'text' : 'password'}
              value={nueva}
              onChange={(evento) => setNueva(evento.target.value)}
              className="sv-input"
              autoComplete="new-password"
              minLength={8}
              required
            />
            <button
              type="button"
              className="sv-eye"
              onClick={() => setVer((previo) => !previo)}
              aria-label={ver ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              <i className={`fas ${ver ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
        </div>
        <div>
          <label className="text-[#94a3b8] text-xs block mb-1">Confirmar contraseña</label>
          <input
            type={ver ? 'text' : 'password'}
            value={confirmar}
            onChange={(evento) => setConfirmar(evento.target.value)}
            className="sv-input"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>
        <p className="text-[#64748b] text-xs m-0">Mínimo 8 caracteres.</p>
        {error && <p className="text-rose-400 text-sm m-0">{error}</p>}
        <div className="flex gap-3 justify-end flex-wrap">
          <button type="button" className="btn-sv-secondary" onClick={onCancelar} disabled={cargando}>
            Cancelar
          </button>
          <button type="submit" className="btn-sv-primary disabled:opacity-60" disabled={cargando}>
            {cargando ? 'Guardando…' : 'Guardar contraseña'}
          </button>
        </div>
      </form>
    </ModalBase>
  );
}
