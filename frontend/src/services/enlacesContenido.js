// Ayudas de frontend para rellenar el campo "ID externo" a partir de un enlace
// pegado. No sustituyen la validación del backend: el ID (external_id) sigue
// siendo la fuente de verdad. Aquí solo reconocen URLs conocidas y extraen el
// identificador para ahorrar trabajo manual.

// Reconoce un enlace de YouTube (watch, youtu.be, embed, shorts, live) y
// devuelve el ID del video, o '' si no es un formato reconocido.
export function extraerIdYouTubeDeUrl(valor) {
  const texto = String(valor || '').trim();
  if (!texto) return '';

  let url;
  try {
    url = new URL(texto);
  } catch {
    return '';
  }

  const host = url.hostname.replace(/^www\./, '');
  if (host === 'youtu.be') {
    return url.pathname.replace(/^\/+/, '').split(/[/?#]/)[0] || '';
  }

  if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
    if (url.pathname === '/watch') return url.searchParams.get('v') || '';
    const enRuta = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?#]+)/);
    return enRuta ? enRuta[1] : '';
  }

  return '';
}

// Miniatura de YouTube a partir del ID (misma convención que usa el backend).
export function miniaturaYouTube(id) {
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
}
