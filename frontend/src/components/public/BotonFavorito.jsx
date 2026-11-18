import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext.jsx';
import { useFavoritos } from '../../context/FavoritosContext.jsx';
import { useToast } from '../admin/Toast.jsx';

// Botón de favorito reutilizable.
//
// - iconSet="fa" usa Font Awesome (StreamVerse) y "bi" Bootstrap Icons (GameZone).
// - Acepta itemId (id del catálogo) o slug (juegos de GameZone).
// - Añade la clase `is-active` cuando el ítem está guardado para que cada
//   sección aplique su propio estilo con CSS.
export default function BotonFavorito({
  tipo,
  itemId = null,
  slug = null,
  titulo = null,
  categoria = null,
  descripcion = null,
  imagen = null,
  className = '',
  iconSet = 'fa',
  mostrarTexto = false,
  textoAnadir = 'Añadir a favoritos',
  textoQuitar = 'Quitar de favoritos',
  onError = null
}) {
  const { autenticado } = useAuth();
  const { esFavorito, alternar } = useFavoritos();
  const toast = useToast();
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const activo = esFavorito(tipo, itemId, slug, titulo);
  const identificable = itemId != null || Boolean(slug) || Boolean(titulo);
  const etiqueta = activo ? textoQuitar : textoAnadir;

  if (!identificable) return null;

  if (!autenticado) {
    return (
      <Link
        to="/?auth=login"
        className={className}
        title="Inicia sesión para guardar en tu biblioteca"
        aria-label="Inicia sesión para guardar en tu biblioteca"
      >
        <i className={iconSet === 'bi' ? 'bi bi-heart' : 'far fa-heart'}></i>
        {mostrarTexto && <span>{textoAnadir}</span>}
      </Link>
    );
  }

  const alternarFavorito = async (evento) => {
    evento.preventDefault();
    evento.stopPropagation();

    if (guardando) return;

    setError('');
    setGuardando(true);
    try {
      const guardado = await alternar(tipo, itemId, {
        slug,
        titulo,
        categoria,
        descripcion,
        imagen
      });
      toast.exito(guardado ? 'Guardado en tu biblioteca' : 'Quitado de tu biblioteca');
    } catch (err) {
      const mensaje = err.message || 'No pudimos actualizar tus favoritos.';
      setError(mensaje);
      toast.error(mensaje);
      if (onError) onError(mensaje);
    } finally {
      setGuardando(false);
    }
  };

  const iconoActivo = iconSet === 'bi' ? 'bi-heart-fill' : 'fas fa-heart';
  const iconoInactivo = iconSet === 'bi' ? 'bi-heart' : 'far fa-heart';

  return (
    <button
      type="button"
      onClick={alternarFavorito}
      disabled={guardando}
      className={`${className}${activo ? ' is-active' : ''}${guardando ? ' is-saving' : ''}`.trim()}
      title={error || etiqueta}
      aria-label={etiqueta}
      aria-pressed={activo}
      aria-busy={guardando}
    >
      <i className={guardando ? (iconSet === 'bi' ? 'bi bi-arrow-repeat animate-spin' : 'fas fa-spinner fa-spin') : (activo ? iconoActivo : iconoInactivo)}></i>
      {mostrarTexto && <span>{guardando ? 'Guardando…' : etiqueta}</span>}
    </button>
  );
}
