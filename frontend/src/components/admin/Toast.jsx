/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// Avisos flotantes del panel. Se montan en document.body con un portal para que
// ningún ancestro (transform, overflow) los recorte. Se apilan arriba a la derecha
// y se cierran solos a los 4 segundos; también con el botón X.

const ToastContext = createContext(null);

let contador = 0;

export function useToast() {
  const contexto = useContext(ToastContext);
  if (!contexto) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  return contexto;
}

const ICONOS = {
  exito: 'fa-circle-check',
  error: 'fa-circle-exclamation',
  aviso: 'fa-triangle-exclamation'
};

function Aviso({ aviso, onCerrar }) {
  return (
    <div className={`sv-toast sv-toast-${aviso.tipo}`} role={aviso.tipo === 'error' ? 'alert' : 'status'}>
      <i className={`fas ${ICONOS[aviso.tipo] || ICONOS.aviso} sv-toast-icono`}></i>
      <span className="sv-toast-texto">{aviso.mensaje}</span>
      <button type="button" className="sv-toast-cerrar" onClick={() => onCerrar(aviso.id)} aria-label="Cerrar aviso">
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [avisos, setAvisos] = useState([]);
  const temporizadores = useRef(new Map());

  const cerrar = useCallback((id) => {
    setAvisos((previos) => previos.filter((aviso) => aviso.id !== id));
    const temporizador = temporizadores.current.get(id);
    if (temporizador) {
      clearTimeout(temporizador);
      temporizadores.current.delete(id);
    }
  }, []);

  const agregar = useCallback(
    (mensaje, tipo) => {
      contador += 1;
      const id = contador;
      setAvisos((previos) => [...previos, { id, mensaje, tipo }]);
      const temporizador = setTimeout(() => cerrar(id), 4000);
      temporizadores.current.set(id, temporizador);
    },
    [cerrar]
  );

  useEffect(() => {
    const pendientes = temporizadores.current;
    return () => {
      pendientes.forEach((temporizador) => clearTimeout(temporizador));
      pendientes.clear();
    };
  }, []);

  const valor = useMemo(
    () => ({
      exito: (mensaje) => agregar(mensaje, 'exito'),
      error: (mensaje) => agregar(mensaje, 'error'),
      aviso: (mensaje) => agregar(mensaje, 'aviso')
    }),
    [agregar]
  );

  return (
    <ToastContext.Provider value={valor}>
      {children}
      {createPortal(
        <div className="sv-toast-viewport" aria-live="polite">
          {avisos.map((aviso) => (
            <Aviso key={aviso.id} aviso={aviso} onCerrar={cerrar} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}
