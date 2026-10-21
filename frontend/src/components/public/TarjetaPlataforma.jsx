import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext.jsx';
import { useFavoritos } from '../../context/FavoritosContext.jsx';

function convertirEstilo(cadena) {
  if (!cadena) return undefined;
  const resultado = {};
  cadena.split(';').forEach((regla) => {
    const partes = regla.split(':');
    if (partes.length >= 2) {
      const propiedad = partes[0].trim();
      const valor = partes.slice(1).join(':').trim();
      if (propiedad && valor) {
        const clave = propiedad.replace(/-([a-z])/g, (m, letra) => letra.toUpperCase());
        resultado[clave] = valor;
      }
    }
  });
  return resultado;
}

export default function TarjetaPlataforma({ p }) {
  const { autenticado } = useAuth();
  const { esFavorito, alternar } = useFavoritos();
  const [guardando, setGuardando] = useState(false);
  const [errorFavorito, setErrorFavorito] = useState('');
  const esFav = esFavorito('plataforma', p.id);

  const alternarFavorito = async () => {
    setErrorFavorito('');
    setGuardando(true);
    try {
      await alternar('plataforma', p.id);
    } catch (error) {
      setErrorFavorito(error.message);
    } finally {
      setGuardando(false);
    }
  };

  const badge = p.badge || null;
  const stats = p.stats || [];
  const feats = p.feats || [];
  const tag = p.lightbox?.tag || null;
  const descLightbox = p.lightbox?.descripcion || p.descripcion || '';
  const estiloImagen = convertirEstilo(p.imagenEstilo);
  const textoVisita = p.sitioTexto || `Visitar ${p.nombre}`;
  const textoIr = `Ir a ${textoVisita.replace('Visitar ', '')}`;

  return (
    <>
      <div className={`sv-flip ${p.tarjetaClases || ''}`.trim()}>
        <div className="sv-flip-inner">
          <div className="sv-flip-front">
            <div className="sv-img-wrap">
              <img src={p.imagen} alt={p.nombre} style={estiloImagen} />
              <div className="sv-img-overlay">
                <span className="sv-img-hint"><i className="fas fa-expand-alt"></i> Ver detalles</span>
              </div>
            </div>
            <div className="sv-card-body">
              <div className="flex items-center justify-between mb-2">
                <img src={p.logo} alt={p.nombre} className={`sv-logo ${p.logoClase || ''}`.trim()} />
                <div className="flex items-center gap-2">
                  {autenticado ? (
                    <button
                      type="button"
                      onClick={alternarFavorito}
                      disabled={guardando}
                      className="sv-btn-fav"
                      title={esFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                    >
                      <i className={esFav ? 'fas fa-heart' : 'far fa-heart'}></i>
                    </button>
                  ) : (
                    <Link to="/?auth=login" className="sv-btn-fav" title="Inicia sesión para guardar en tu biblioteca">
                      <i className="far fa-heart"></i>
                    </Link>
                  )}
                  {badge && (
                    <span className="sv-badge" style={{ background: badge.fondo, color: badge.color }}>
                      {badge.texto}
                    </span>
                  )}
                </div>
              </div>
              {errorFavorito && <p className="text-[0.7rem] text-rose-400 m-0 mb-2">{errorFavorito}</p>}
              <p className="sv-card-title">{p.nombre}</p>
              <p className="sv-card-desc">{p.descripcion}</p>
              {feats.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {feats.map((f) => (
                    <div className="sv-feat" key={f.titulo}>
                      <span className="sv-feat-icon"><i className={f.icono}></i></span>
                      <p className="text-[0.7rem] font-bold text-slate-100 m-0">{f.titulo}</p>
                      <p className="text-[0.63rem] text-[#94a3b8] m-0">{f.texto}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="sv-flip-back">
            <img src={p.logo} alt={p.nombre} className={`sv-back-logo ${p.logoClase || ''}`.trim()} />
            {badge && (
              <span
                className="sv-back-badge"
                style={{ background: badge.fondo, color: badge.color, border: `1px solid ${badge.borde || badge.fondo}` }}
              >
                {p.badgeTraseroTexto || badge.texto}
              </span>
            )}
            <p className="sv-back-title">{p.nombre}</p>
            <p className="sv-back-desc">{p.descripcionTrasera}</p>
            {stats.length > 0 && (
              <div className="sv-stats">
                {stats.map((s) => (
                  <div className="sv-stat" key={s.etiqueta}>
                    <span>{s.valor}</span>
                    <small>{s.etiqueta}</small>
                  </div>
                ))}
              </div>
            )}
            <a href={`#imgmodal-${p.id}`} className="sv-btn-detail">
              <i className="fas fa-info-circle"></i> Ver detalles
            </a>
            <a href={p.sitio} target="_blank" rel="noopener noreferrer" className="sv-btn-visit">
              <img src={p.logo} alt="" />{textoVisita} <i className="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>

      <div id={`imgmodal-${p.id}`} className="sv-imgmodal">
        <a className="sv-modal-bg" href="#"></a>
        <div className="sv-lbox-card">
          <a className="sv-lbox-close" href="#"><i className="fas fa-times"></i></a>
          <img src={p.imagenGrande || p.imagen} alt={p.nombre} className="sv-lbox-img" />
          <div className="p-5">
            <img src={p.logo} alt={p.nombre} className={`h-6 mb-3 block ${p.logoClase || ''}`.trim()} />
            {tag && (
              <span
                className="sv-lbox-tag"
                style={{ background: tag.fondo, color: tag.color, border: `1px solid ${tag.borde || tag.fondo}` }}
              >
                <i className={`${tag.icono} mr-1`}></i>{tag.texto}
              </span>
            )}
            <h3 className="sv-lbox-title">{p.nombre}</h3>
            <p className="sv-lbox-desc">{descLightbox}</p>
            {stats.length > 0 && (
              <div className="sv-stats mb-4">
                {stats.map((s) => (
                  <div className="sv-stat" key={s.etiqueta}>
                    <span>{s.valor}</span>
                    <small>{s.etiqueta}</small>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-3 flex-wrap">
              <a href={p.sitio} target="_blank" rel="noopener noreferrer" className="btn-sv-primary text-sm py-2 px-5">
                <img src={p.logo} alt="" className="h-4" /> {textoIr}
              </a>
              <a href="#" className="btn-sv-secondary text-sm py-2 px-5">
                <i className="fas fa-times"></i> Cerrar
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
