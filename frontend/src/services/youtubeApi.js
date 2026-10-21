// Carga única de la API IFrame de YouTube. Se usa desde el reproductor para
// controlar el video (play/pausa, progreso, volumen) con controles propios, sin
// mostrar los controles nativos. No es un servicio de backend: solo un helper de
// navegador.

const URL_API = 'https://www.youtube.com/iframe_api';

let promesa = null;

export function cargarApiYouTube() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('La API de YouTube solo existe en el navegador'));
  }
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (promesa) return promesa;

  promesa = new Promise((resolve, reject) => {
    const previo = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previo === 'function') previo();
      if (window.YT && window.YT.Player) resolve(window.YT);
      else reject(new Error('La API de YouTube no se inicializó'));
    };

    const script = document.createElement('script');
    script.src = URL_API;
    script.async = true;
    script.onerror = () => reject(new Error('No se pudo cargar la API de YouTube'));
    document.head.appendChild(script);
  });

  return promesa;
}

// Extrae el id de un video de YouTube desde una URL de embed, una URL de
// reproducción o un id directo.
export function extraerIdYouTube(url) {
  if (!url) return '';
  const valor = String(url).trim();
  if (/^[a-zA-Z0-9_-]{6,}$/.test(valor) && !valor.includes('/') && !valor.includes('.')) {
    return valor;
  }
  try {
    const parsed = new URL(valor);
    if (parsed.hostname === 'youtu.be') return parsed.pathname.replace('/', '');
    const enRuta = parsed.pathname.match(/\/embed\/([^/?#]+)/);
    if (enRuta) return enRuta[1];
    return parsed.searchParams.get('v') || '';
  } catch {
    return '';
  }
}
