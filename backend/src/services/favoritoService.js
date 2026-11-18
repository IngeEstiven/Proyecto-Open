import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../middlewares/errorMiddleware.js';


const FAVORITO_SELECT = `
  id, usuario_id, juego_id, contenido_id, plataforma_id, created_at,
  juego:juegos ( id, titulo, slug, categoria, imagen_url, estado ),
  contenido:contenidos ( id, seccion, titulo, miniatura_url, fuente, external_id, genero, estado ),
  plataforma:plataformas ( id, nombre, seccion, logo_url, estado )
`;


const columnasPorTipo = {
  juego: 'juego_id',
  contenido: 'contenido_id',
  plataforma: 'plataforma_id'
};


const tablasPorTipo = {
  juego: 'juegos',
  contenido: 'contenidos',
  plataforma: 'plataformas'
};


export async function getFavoritos(usuarioId) {
  const { data, error } = await supabaseAdmin
    .from('favoritos')
    .select(FAVORITO_SELECT)
    .eq('usuario_id', usuarioId)
    .order('created_at', { ascending: false });


  if (error) throw new Error(error.message);
  return data;
}


// Normaliza texto para comparar títulos: minúsculas, sin acentos y con
// espacios simples. Evita que "Ragnarök" y "ragnarok" se traten distinto.
function normalizarTexto(texto) {
  return (texto || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}


// Campo que hace de "título" en cada tabla para poder resolver un ítem que
// llega sin id (fichas estáticas de GameZone, plataformas antes de cargar).
const CAMPOS_TITULO = {
  juego: 'titulo',
  contenido: 'titulo',
  plataforma: 'nombre'
};


// Compara dos títulos ya normalizados. Solo se acepta coincidencia parcial
// cuando es segura: el texto corto debe empezar el largo con 2+ palabras, o
// estar contenido en él con 3+ palabras. Así se enlazan "Horizon Zero Dawn" y
// "Horizon Zero Dawn Remastered", pero no "Max" con "HBO Max".
function titulosEquivalentes(uno, otro) {
  if (!uno || !otro) return false;
  if (uno === otro) return true;

  const corto = uno.length <= otro.length ? uno : otro;
  const largo = corto === uno ? otro : uno;
  const palabras = corto.split(' ').length;

  if (palabras >= 2 && largo.startsWith(`${corto} `)) return true;
  return palabras >= 3 && largo.includes(corto);
}


// Las fichas estáticas de GameZone usan slugs cortos (gow, horizon, fc...) que
// no tienen por qué coincidir con el slug que genera la base a partir del
// título (god-of-war-ragnarok). Buscamos por título normalizado para poder
// enlazar el corazón con el ítem real del catálogo.
async function buscarPorTitulo(tipo, texto) {
  const campo = CAMPOS_TITULO[tipo];
  const buscado = normalizarTexto(texto);
  if (!campo || !buscado) return null;

  const { data, error } = await supabaseAdmin
    .from(tablasPorTipo[tipo])
    .select(`id, ${campo}`);

  if (error) throw new Error(error.message);

  const candidatos = (data || []).map((fila) => ({
    id: fila.id,
    normalizado: normalizarTexto(fila[campo])
  }));

  const exacto = candidatos.find((fila) => fila.normalizado === buscado);
  if (exacto) return exacto.id;

  // Se ordena por diferencia de longitud para quedarse con el más parecido.
  const parecidos = candidatos
    .filter((fila) => titulosEquivalentes(fila.normalizado, buscado))
    .sort(
      (a, b) =>
        Math.abs(a.normalizado.length - buscado.length) -
        Math.abs(b.normalizado.length - buscado.length)
    );

  return parecidos[0]?.id ?? null;
}


// Resuelve el id real del ítem probando, en orden: id directo, slug (juegos)
// y título/nombre. Las tarjetas de GameZone viven en el frontend como fichas
// estáticas y las plataformas se pintan con datos locales antes de que llegue
// la respuesta de la API, así que el navegador no siempre conoce el id real.
async function resolverItemId(tipo, itemId, itemSlug, itemTitulo) {
  if (itemId != null && itemId !== '') {
    const { data, error } = await supabaseAdmin
      .from(tablasPorTipo[tipo])
      .select('id')
      .eq('id', itemId)
      .limit(1);

    // 22P02 = el id no tiene formato válido (por ejemplo, un id estático que
    // todavía no se ha cargado desde la base). Se ignora y se sigue probando.
    if (error && error.code !== '22P02') throw new Error(error.message);
    if (data?.[0]?.id) return data[0].id;
  }

  if (tipo === 'juego' && itemSlug) {
    const { data, error } = await supabaseAdmin
      .from('juegos')
      .select('id')
      .eq('slug', itemSlug)
      .limit(1);

    if (error) throw new Error(error.message);
    if (data?.[0]?.id) return data[0].id;
  }

  return buscarPorTitulo(tipo, itemTitulo);
}


// Igual que en juegoService: el slug se genera a partir del título.
function slugDesdeTexto(texto) {
  return (texto || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}


async function slugUnico(base) {
  const inicio = base || `juego-${Date.now()}`;
  let slug = inicio;
  let contador = 1;

  while (true) {
    const { data, error } = await supabaseAdmin
      .from('juegos')
      .select('id')
      .eq('slug', slug)
      .limit(1);

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) return slug;

    slug = `${inicio}-${contador}`;
    contador += 1;
  }
}


const CATEGORIAS_VALIDAS = ['accion', 'terror', 'deportes', 'cooperativo'];


// GameZone muestra fichas estáticas que pueden no estar todavía en el
// catálogo. Para que el favorito tenga a qué apuntar, se crea el juego con los
// datos de la ficha; después aparece en el panel de administración y se puede
// editar o borrar como cualquier otro.
async function crearJuegoDesdeFicha(referencia) {
  const titulo = (referencia?.titulo || '').trim();
  if (!titulo) return null;

  const categoria = CATEGORIAS_VALIDAS.includes(referencia.categoria)
    ? referencia.categoria
    : 'accion';

  const slug = await slugUnico(slugDesdeTexto(titulo));

  const { data, error } = await supabaseAdmin
    .from('juegos')
    .insert([
      {
        titulo,
        slug,
        categoria,
        descripcion: referencia.descripcion || null,
        imagen_url: referencia.imagen || null,
        destacado: false,
        estado: 'publicado'
      }
    ])
    .select('id');

  if (error) throw new Error(error.message);
  return data?.[0]?.id ?? null;
}


export async function createFavorito(usuarioId, tipo, referencia = {}) {
  const columna = columnasPorTipo[tipo];
  const tabla = tablasPorTipo[tipo];

  if (!columna || !tabla) {
    throw new AppError(400, 'Selecciona un tipo de favorito válido.');
  }

  const { itemId = null, slug = null, titulo = null } = referencia;
  const referenciado = await resolverItemId(tipo, itemId, slug, titulo);

  if (referenciado == null && tipo === 'juego') {
    // El juego no está en el catálogo: se crea a partir de la ficha y se
    // vuelve a intentar con su id ya real.
    const creado = await crearJuegoDesdeFicha(referencia);
    if (creado) {
      return createFavorito(usuarioId, tipo, { ...referencia, itemId: creado });
    }
  }

  const mensajes = {
    juego: 'Este juego todavía no está en el catálogo de OpenLeaf, así que no se puede guardar en favoritos.',
    contenido: 'Ese contenido ya no está disponible.',
    plataforma: 'Esa plataforma ya no está disponible.'
  };

  if (referenciado == null) {
    throw new AppError(404, mensajes[tipo]);
  }

  const { data: item, error: itemError } = await supabaseAdmin
    .from(tabla)
    .select('id')
    .eq('id', referenciado)
    .limit(1);


  if (itemError) throw new Error(itemError.message);
  if (!item || item.length === 0) throw new AppError(404, mensajes[tipo]);


  const { data: existente, error: existenteError } = await supabaseAdmin
    .from('favoritos')
    .select(FAVORITO_SELECT)
    .eq('usuario_id', usuarioId)
    .eq(columna, referenciado)
    .limit(1);


  if (existenteError) throw new Error(existenteError.message);
  // Idempotente: si ya estaba guardado se devuelve el mismo registro. Evita
  // errores cuando dos botones de la misma página se pulsan a la vez.
  if (existente && existente.length > 0) return existente[0];


  const { data, error } = await supabaseAdmin
    .from('favoritos')
    .insert([
      {
        usuario_id: usuarioId,
        juego_id: tipo === 'juego' ? referenciado : null,
        contenido_id: tipo === 'contenido' ? referenciado : null,
        plataforma_id: tipo === 'plataforma' ? referenciado : null
      }
    ])
    .select(FAVORITO_SELECT);


  if (error) {
    // Violación de la restricción única (dos clics simultáneos): devolvemos el
    // favorito que ya quedó registrado en lugar de fallar.
    if (error.code === '23505') {
      const { data: yaGuardado, error: reintentoError } = await supabaseAdmin
        .from('favoritos')
        .select(FAVORITO_SELECT)
        .eq('usuario_id', usuarioId)
        .eq(columna, referenciado)
        .limit(1);
      if (reintentoError) throw new Error(reintentoError.message);
      if (yaGuardado?.[0]) return yaGuardado[0];
    }
    throw new Error(error.message);
  }
  return data[0];
}


export async function deleteFavorito(id, usuarioId) {
  const { data: existente, error: existenteError } = await supabaseAdmin
    .from('favoritos')
    .select('id, usuario_id, juego_id, contenido_id, plataforma_id')
    .eq('id', id)
    .limit(1);


  if (existenteError) throw new Error(existenteError.message);
  if (!existente || existente.length === 0) return null;


  if (String(existente[0].usuario_id) !== String(usuarioId)) {
    throw new AppError(403, 'No puedes eliminar un favorito que no es tuyo.');
  }


  const { data, error } = await supabaseAdmin
    .from('favoritos')
    .delete()
    .eq('id', id)
    .select('id, usuario_id, juego_id, contenido_id, plataforma_id, created_at');


  if (error) throw new Error(error.message);
  return data[0] || null;
}
