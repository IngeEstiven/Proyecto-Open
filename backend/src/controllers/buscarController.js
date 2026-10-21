import { searchAll, getFiltros } from '../services/buscarService.js';
import { sendError } from '../middlewares/errorMiddleware.js';
import { esGeneroDeSeccion, SECCIONES, CATEGORIAS_JUEGO } from '../services/catalogoConstantes.js';


const tiposValidos = ['todo', 'juegos', 'contenidos', 'plataformas'];
const categoriasValidas = CATEGORIAS_JUEGO.map((c) => c.valor);


export async function filtros(req, res) {
  try {
    res.json(getFiltros());
  } catch (error) {
    return sendError(res, error);
  }
}


export async function search(req, res) {
  try {
    const q = req.query.q !== undefined ? String(req.query.q).trim() : '';
    const tipo = String(req.query.tipo || 'todo').trim();
    const seccion = req.query.seccion ? String(req.query.seccion).trim() : null;
    const genero = req.query.genero ? String(req.query.genero).trim() : null;
    const categoria = req.query.categoria ? String(req.query.categoria).trim() : null;


    if (q && q.length < 2) {
      return res.status(400).json({ error: 'Escribe al menos 2 caracteres' });
    }


    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({ error: 'Tipo de búsqueda inválido. Use: todo, juegos, contenidos o plataformas' });
    }
    if (seccion && !SECCIONES.includes(seccion)) {
      return res.status(400).json({ error: 'Sección inválida. Use: peliculas, musica, en_vivo o deportes' });
    }
    if (categoria && !categoriasValidas.includes(categoria)) {
      return res.status(400).json({ error: 'Categoría inválida. Use: accion, terror, deportes o cooperativo' });
    }
    if (genero) {
      if (seccion) {
        if (!esGeneroDeSeccion(seccion, genero)) {
          return res.status(400).json({ error: 'Género inválido para esta sección' });
        }
      } else if (!SECCIONES.some((s) => esGeneroDeSeccion(s, genero))) {
        return res.status(400).json({ error: 'Género inválido' });
      }
    }


    const resultados = await searchAll(req.user, q, { tipo, seccion, genero, categoria });


    res.json(resultados);
  } catch (error) {
    return sendError(res, error);
  }
}
