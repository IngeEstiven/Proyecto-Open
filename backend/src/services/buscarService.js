import { supabaseAdmin } from '../config/supabase.js';
import {
  normalizarTexto,
  SECCIONES,
  GENEROS_POR_SECCION,
  CATEGORIAS_JUEGO
} from './catalogoConstantes.js';


// El catálogo es pequeño (pensado para menos de 1000 filas por tabla). Por eso
// se traen los candidatos y se filtra/ordena en memoria: así la coincidencia
// ignora acentos y mayúsculas ("ragnarok" encuentra "Ragnarök").
const LIMITE_CANDIDATOS = 1000;
const MAX_POR_GRUPO = 20;


function coincide(texto, termino) {
  if (!termino) return true;
  return normalizarTexto(texto).includes(termino);
}


function ordenarPorPrefijo(items, campo, termino) {
  return items.sort((a, b) => {
    const na = normalizarTexto(a[campo]);
    const nb = normalizarTexto(b[campo]);
    const aPrefijo = termino ? na.startsWith(termino) : false;
    const bPrefijo = termino ? nb.startsWith(termino) : false;
    if (aPrefijo !== bPrefijo) return aPrefijo ? -1 : 1;
    return na.localeCompare(nb, 'es');
  });
}


export function getFiltros() {
  return {
    secciones: SECCIONES,
    generos_por_seccion: GENEROS_POR_SECCION,
    categorias_juego: CATEGORIAS_JUEGO
  };
}


export async function searchAll(user, q, { tipo = 'todo', seccion = null, genero = null, categoria = null } = {}) {
  const termino = normalizarTexto(q);
  const esAdmin = user && user.rol === 'administrador';


  const buscarJuegos = tipo === 'todo' || tipo === 'juegos';
  const buscarContenidos = tipo === 'todo' || tipo === 'contenidos';
  const buscarPlataformas = tipo === 'todo' || tipo === 'plataformas';


  const promesas = [];


  if (buscarJuegos) {
    let query = supabaseAdmin
      .from('juegos')
      .select('id, titulo, slug, categoria, imagen_url, puntuacion, destacado, estado')
      .limit(LIMITE_CANDIDATOS);
    if (!esAdmin) query = query.eq('estado', 'publicado');
    promesas.push(query);
  } else {
    promesas.push(Promise.resolve({ data: [], error: null }));
  }


  if (buscarContenidos) {
    let query = supabaseAdmin
      .from('contenidos')
      .select('id, seccion, titulo, descripcion, miniatura_url, fuente, external_id, embed_url, genero, estado')
      .limit(LIMITE_CANDIDATOS);
    if (!esAdmin) query = query.eq('estado', 'publicado');
    promesas.push(query);
  } else {
    promesas.push(Promise.resolve({ data: [], error: null }));
  }


  if (buscarPlataformas) {
    let query = supabaseAdmin
      .from('plataformas')
      .select('id, nombre, seccion, descripcion, logo_url, imagen_url, sitio_url, estado')
      .limit(LIMITE_CANDIDATOS);
    if (!esAdmin) query = query.eq('estado', 'activo');
    promesas.push(query);
  } else {
    promesas.push(Promise.resolve({ data: [], error: null }));
  }


  const [juegosResult, contenidosResult, plataformasResult] = await Promise.all(promesas);


  if (juegosResult.error) throw new Error(juegosResult.error.message);
  if (contenidosResult.error) throw new Error(contenidosResult.error.message);
  if (plataformasResult.error) throw new Error(plataformasResult.error.message);


  const juegos = ordenarPorPrefijo(
    juegosResult.data.filter(
      (j) => (!categoria || j.categoria === categoria) && coincide(j.titulo, termino)
    ),
    'titulo',
    termino
  ).slice(0, MAX_POR_GRUPO);


  const contenidos = ordenarPorPrefijo(
    contenidosResult.data.filter(
      (c) =>
        (!seccion || c.seccion === seccion) &&
        (!genero || c.genero === genero) &&
        coincide(c.titulo, termino)
    ),
    'titulo',
    termino
  ).slice(0, MAX_POR_GRUPO);


  const plataformas = ordenarPorPrefijo(
    plataformasResult.data.filter(
      (p) => (!seccion || p.seccion === seccion) && coincide(p.nombre, termino)
    ),
    'nombre',
    termino
  ).slice(0, MAX_POR_GRUPO);


  return {
    juegos,
    contenidos,
    plataformas,
    total: juegos.length + contenidos.length + plataformas.length
  };
}
