import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext.jsx';
import useTituloPagina from '../../hooks/useTituloPagina.js';
import { FICHAS } from '../../services/fichasEstaticas.js';
import { obtenerJuego } from '../../services/juegosService.js';
import { crearPedido } from '../../services/pedidosService.js';

const OPCIONES_PLATAFORMA = [
  { texto: 'PC', valor: 'pc' },
  { texto: 'PlayStation', valor: 'consola' },
  { texto: 'Nintendo Switch', valor: 'consola' },
  { texto: 'Xbox', valor: 'consola' }
];

export default function CheckoutPage() {
  const { slug } = useParams();
  const navegar = useNavigate();
  const { usuario } = useAuth();
  const juego = FICHAS[slug];

  const [campos, setCampos] = useState({
    nombre_completo: '',
    correo: '',
    telefono: '',
    plataforma: 'pc',
    direccion: '',
    ciudad: '',
    codigo_postal: ''
  });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [creado, setCreado] = useState(null);
  const [juegoDb, setJuegoDb] = useState(null);

  useTituloPagina(juego ? `Pedido · ${juego.titulo} | OpenLeaf` : 'Pedido | OpenLeaf');

  useEffect(() => {
    let vivo = true;
    obtenerJuego(slug)
      .then((datos) => {
        if (vivo) setJuegoDb(datos);
      })
      .catch(() => {
        if (vivo) setJuegoDb(null);
      });
    return () => {
      vivo = false;
    };
  }, [slug]);

  useEffect(() => {
    setCampos((previo) => ({
      ...previo,
      nombre_completo: [usuario?.nombre, usuario?.apellido].filter(Boolean).join(' '),
      correo: usuario?.email || ''
    }));
  }, [usuario]);

  if (!juego) {
    return (
      <main className="max-w-[1200px] mx-auto px-4 lg:px-6 py-6 min-h-[50vh]">
        <div className="sv-section text-center py-12">
          <i className="fas fa-face-meh text-[#94a3b8] text-3xl mb-3"></i>
          <p className="text-slate-200 font-bold m-0">Juego no encontrado</p>
          <Link to="/gamezone" className="btn-sv-primary text-sm py-2 px-5 mt-4 inline-flex">Volver a GameZone</Link>
        </div>
      </main>
    );
  }

  const cambiar = (evento) => {
    const { name, value } = evento.target;
    setCampos((previo) => ({ ...previo, [name]: value }));
  };

  const enviar = async (evento) => {
    evento.preventDefault();
    setError('');

    if (!juegoDb?.id) {
      setError('No se pudo identificar el juego en el catálogo. Verifica que esté publicado.');
      return;
    }

    setEnviando(true);

    const direccion_envio = [campos.direccion, campos.ciudad, campos.codigo_postal]
      .map((parte) => (parte || '').trim())
      .filter(Boolean)
      .join(', ');

    try {
      const pedido = await crearPedido({
        juego_id: juegoDb.id,
        nombre_completo: campos.nombre_completo,
        correo: campos.correo,
        telefono: campos.telefono,
        plataforma: campos.plataforma,
        direccion_envio
      });
      setCreado(pedido);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="max-w-[820px] mx-auto px-4 lg:px-6 py-6 min-h-[50vh]">
      <Link
        to={`/gamezone/${slug}`}
        className="inline-flex items-center gap-2 text-[#94a3b8] text-sm no-underline hover:text-white transition-colors mb-6"
      >
        <i className="fas fa-arrow-left"></i>Volver a la ficha
      </Link>

      {/* Aviso de simulación */}
      <div className="rounded-2xl border border-[rgba(245,158,11,.35)] bg-[rgba(245,158,11,.08)] px-5 py-4 mb-6 flex items-start gap-3">
        <i className="fas fa-circle-info text-amber-400 mt-1"></i>
        <p className="text-amber-200 text-sm m-0 leading-relaxed">
          <strong>Es una simulación de compra:</strong> no se realiza ningún cobro ni envío real. Solo se registra el pedido con fines académicos.
        </p>
      </div>

      <div className="rounded-2xl bg-[rgba(12,15,30,.9)] border border-[rgba(102,126,234,.22)] p-7">
        <h1 className="sv-section-title text-3xl mb-1">
          <i className="fas fa-bag-shopping mr-2 sv-text-gradient"></i>{juego.titulo}
        </h1>
        <p className="text-[#94a3b8] text-sm mb-5">{juego.descripcion}</p>

        {creado ? (
          <div className="text-center py-6">
            <i className="fas fa-circle-check text-emerald-400 text-4xl mb-3"></i>
            <p className="sv-section-title text-2xl text-emerald-400 mb-1">Pedido registrado</p>
            <p className="text-[#94a3b8] text-sm mb-5">
              Pedido de <strong className="text-slate-200">{juego.titulo}</strong> recibido. Estado: {creado.estado}.
              Recuerda que es una simulación: no se realizó ningún cobro.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                type="button"
                onClick={() => navegar('/mis-pedidos')}
                className="btn-sv-primary text-sm py-2 px-5"
              >
                <i className="fas fa-list-check"></i> Ver mis pedidos
              </button>
              <Link to="/gamezone" className="btn-sv-secondary text-sm py-2 px-5 no-underline">
                Seguir explorando
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={enviar}>
            <fieldset className="sv-fieldset mb-4" style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <legend className="sv-legend"><i className="fas fa-id-card mr-1"></i> Información de cuenta</legend>
              <div>
                <label className="sv-label">Nombre completo <span className="text-pink-400 text-[0.65rem]">*</span></label>
                <input name="nombre_completo" type="text" className="sv-input" placeholder="Tu nombre" value={campos.nombre_completo} onChange={cambiar} required />
              </div>
              <div>
                <label className="sv-label">Correo electrónico <span className="text-pink-400 text-[0.65rem]">*</span></label>
                <input name="correo" type="email" className="sv-input" placeholder="tu@correo.com" value={campos.correo} onChange={cambiar} required />
              </div>
              <div>
                <label className="sv-label">Teléfono <span className="text-pink-400 text-[0.65rem]">*</span></label>
                <input name="telefono" type="tel" className="sv-input" placeholder="+1234567890" value={campos.telefono} onChange={cambiar} required />
              </div>
            </fieldset>

            <fieldset className="sv-fieldset mb-4" style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <legend className="sv-legend"><i className="fas fa-gamepad mr-1"></i> Plataforma</legend>
              <div>
                <label className="sv-label">Elige tu plataforma</label>
                <select name="plataforma" value={campos.plataforma} onChange={cambiar} className="sv-input" style={{ appearance: 'auto' }}>
                  {OPCIONES_PLATAFORMA.map((opcion) => (
                    <option key={opcion.texto} value={opcion.valor}>{opcion.texto}</option>
                  ))}
                </select>
              </div>
            </fieldset>

            <fieldset className="sv-fieldset mb-5" style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <legend className="sv-legend"><i className="fas fa-truck-fast mr-1"></i> Dirección de envío</legend>
              <div>
                <label className="sv-label">Dirección <span className="text-pink-400 text-[0.65rem]">*</span></label>
                <input name="direccion" type="text" className="sv-input" placeholder="Calle y número" value={campos.direccion} onChange={cambiar} required />
              </div>
              <div>
                <label className="sv-label">Ciudad <span className="text-pink-400 text-[0.65rem]">*</span></label>
                <input name="ciudad" type="text" className="sv-input" placeholder="Tu ciudad" value={campos.ciudad} onChange={cambiar} required />
              </div>
              <div>
                <label className="sv-label">Código postal</label>
                <input name="codigo_postal" type="text" className="sv-input" placeholder="12345" value={campos.codigo_postal} onChange={cambiar} />
              </div>
            </fieldset>

            {error && <p className="text-rose-400 text-sm mb-4 text-center">{error}</p>}

            <button
              type="submit"
              disabled={enviando}
              className="btn-sv-submit w-full"
            >
              <i className="fas fa-bag-shopping"></i> {enviando ? 'Procesando…' : 'Confirmar pedido (simulación)'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}