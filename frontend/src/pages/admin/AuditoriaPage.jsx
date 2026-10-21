import { useEffect, useState } from 'react';

import useTituloPagina from '../../hooks/useTituloPagina.js';
import { listarAuditoria } from '../../services/auditoriaService.js';

export default function AuditoriaPage() {
  useTituloPagina('Auditoría · OpenLeaf');

  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listarAuditoria()
      .then(setRegistros)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  const formatearFecha = (fecha) =>
    new Date(fecha).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <h2 className="sv-section-title text-lg m-0"><i className="fas fa-clipboard-list mr-2 sv-text-gradient"></i>Auditoría</h2>
      </div>

      {error && <p className="text-rose-400 text-sm mb-3">{error}</p>}

      <div className="sv-section overflow-x-auto">
        {cargando ? (
          <p className="text-[#94a3b8] text-sm m-0">Cargando registros de auditoría…</p>
        ) : (
          <table className="sv-admin-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Acción</th>
                <th>Módulo</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((registro) => (
                <tr key={registro.id}>
                  <td className="whitespace-nowrap">{formatearFecha(registro.created_at)}</td>
                  <td><span className="sv-admin-chip bg-[rgba(99,102,241,.15)] text-[#a5b4fc]">{registro.accion}</span></td>
                  <td className="capitalize">{registro.modulo}</td>
                  <td>{registro.descripcion}</td>
                </tr>
              ))}
              {registros.length === 0 && (
                <tr><td colSpan={4} className="text-center text-[#64748b]">No hay registros de auditoría.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}