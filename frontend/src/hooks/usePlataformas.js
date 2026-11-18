import { useEffect, useState } from 'react';

import { useAuth } from '../context/AuthContext.jsx';
import { listarPlataformas } from '../services/plataformasService.js';
import { PLATAFORMAS_ESTATICAS } from '../services/plataformasEstaticas.js';

export function estaticasPorSeccion(seccion) {
  return PLATAFORMAS_ESTATICAS.filter((p) => p.seccion === seccion);
}

function buscarEstatica(nombre) {
  const buscado = (nombre || '').trim().toLowerCase();
  return PLATAFORMAS_ESTATICAS.find((p) => p.nombre.trim().toLowerCase() === buscado) || null;
}

export function enriquecerPlataforma(fila, seccion) {
  const est = buscarEstatica(fila.nombre);
  return {
    // El id real de la base es el que usa el backend de favoritos. La clave
    // estática (netflix, spotify...) solo se usa como sufijo del lightbox.
    id: fila.id,
    clave: est?.id ?? fila.id,
    seccion: est?.seccion ?? seccion,
    nombre: fila.nombre,
    logo: fila.logo_url || est?.logo || '',
    logoClase: est?.logoClase || '',
    imagen: fila.imagen_url || est?.imagen || '',
    imagenGrande: est?.imagenGrande || fila.imagen_url || est?.imagen || '',
    imagenEstilo: est?.imagenEstilo || '',
    tarjetaClases: est?.tarjetaClases || '',
    badge: est?.badge || null,
    descripcion: fila.descripcion || est?.descripcion || '',
    descripcionTrasera: est?.descripcionTrasera || fila.descripcion || '',
    stats: est?.stats || [],
    sitio: fila.sitio_url || est?.sitio || '',
    sitioTexto: est?.sitioTexto || `Visitar ${fila.nombre}`,
    lightbox: est?.lightbox || null,
    feats: est?.feats || [],
    badgeTraseroTexto: est?.badgeTraseroTexto || null
  };
}

export default function usePlataformas(seccion) {
  const { autenticado } = useAuth();
  const [datos, setDatos] = useState(() => estaticasPorSeccion(seccion));
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!autenticado) {
      setDatos(estaticasPorSeccion(seccion));
      setCargando(false);
      return undefined;
    }

    let vivo = true;
    setCargando(true);

    listarPlataformas(seccion)
      .then((filas) => {
        if (vivo) setDatos(filas.map((fila) => enriquecerPlataforma(fila, seccion)));
      })
      .catch(() => {
        if (vivo) setDatos(estaticasPorSeccion(seccion));
      })
      .finally(() => {
        if (vivo) setCargando(false);
      });

    return () => {
      vivo = false;
    };
  }, [autenticado, seccion]);

  return { datos, cargando };
}
