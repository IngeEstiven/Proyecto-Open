// Prueba de humo del corte: solo lectura sobre la API en marcha.
// Uso: definir API_URL (por defecto http://localhost:3001) y ejecutar
// `npm run smoke-test`. Pide el correo/usuario y la contraseña por consola
// (la contraseña se escribe oculta). No lee el .env ni acepta argumentos.

import readline from 'node:readline/promises';


const API_URL = (process.env.API_URL || 'http://localhost:3001').replace(/\/+$/, '');


function preguntarOculto(pregunta) {
  return new Promise((resolve, reject) => {
    const stdin = process.stdin;
    if (!stdin.isTTY) {
      reject(new Error('La consola no permite ocultar la contraseña. Ejecuta en una terminal interactiva.'));
      return;
    }
    process.stdout.write(pregunta);
    stdin.resume();
    stdin.setRawMode(true);
    let entrada = '';
    const alRecibir = (fragmento) => {
      const texto = fragmento.toString('utf8');
      if (texto === '\u0003') {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener('data', alRecibir);
        process.stdout.write('\n');
        process.exit(130);
      }
      if (texto === '\r' || texto === '\n' || texto === '\u0004') {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener('data', alRecibir);
        process.stdout.write('\n');
        resolve(entrada);
        return;
      }
      if (texto === '\u007f' || texto === '\b') {
        entrada = entrada.slice(0, -1);
        return;
      }
      entrada += texto;
    };
    stdin.on('data', alRecibir);
  });
}


async function pedir(ruta, { metodo = 'GET', token = null, cuerpo = null } = {}) {
  const cabeceras = { Accept: 'application/json' };
  if (token) cabeceras.Authorization = `Bearer ${token}`;
  if (cuerpo) cabeceras['Content-Type'] = 'application/json';
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    method: metodo,
    headers: cabeceras,
    body: cuerpo ? JSON.stringify(cuerpo) : undefined
  });
  let datos = null;
  try {
    datos = await respuesta.json();
  } catch {
    datos = null;
  }
  return { estado: respuesta.status, datos };
}


let aprobadas = 0;
let falladas = 0;


function revisar(numero, descripcion, condicion, detalle = '') {
  if (condicion) {
    aprobadas += 1;
    console.log(`  [OK]    Prueba ${numero}: ${descripcion}${detalle ? ` — ${detalle}` : ''}`);
  } else {
    falladas += 1;
    console.log(`  [FALLO] Prueba ${numero}: ${descripcion}${detalle ? ` — ${detalle}` : ''}`);
  }
  return condicion;
}


async function main() {
  console.log('Prueba de humo de OpenLeaf');
  console.log(`API: ${API_URL}`);
  console.log('Solo se realizan lecturas (login + consultas). No se modifica nada.\n');

  const consola = readline.createInterface({ input: process.stdin, output: process.stdout });
  const identificador = (await consola.question('Correo o usuario: ')).trim();
  consola.close();
  const contrasena = await preguntarOculto('Contraseña (oculta): ');

  if (!identificador || !contrasena) {
    console.error('\nDebes indicar correo/usuario y contraseña.');
    process.exit(1);
  }

  console.log('\nEjecutando pruebas...\n');

  // 1. Login con credenciales incorrectas -> 401
  const loginMalo = await pedir('/api/auth/login', {
    metodo: 'POST',
    cuerpo: { identifier: 'correo.inexistente@openleaf.test', password: 'clave-incorrecta-123' }
  });
  revisar(1, 'Login con credenciales incorrectas responde 401', loginMalo.estado === 401, `estado ${loginMalo.estado}`);

  // 2. Login correcto -> 200 + token
  const loginBueno = await pedir('/api/auth/login', {
    metodo: 'POST',
    cuerpo: { identifier: identificador, password: contrasena }
  });
  const token = loginBueno.datos?.token || null;
  revisar(
    2,
    'Login correcto responde 200 con token',
    loginBueno.estado === 200 && Boolean(token),
    `estado ${loginBueno.estado}${loginBueno.estado === 403 ? ' (verifica tu correo primero)' : ''}`
  );

  if (!token) {
    console.log('\nSin token no se pueden ejecutar las pruebas siguientes. Revisa las credenciales.');
    console.log(`\nResumen: ${aprobadas} aprobadas, ${falladas} falladas.`);
    process.exit(1);
  }

  // 3. Ruta protegida sin token -> 401, con token -> 200
  const sinToken = await pedir('/api/auth/me');
  const conToken = await pedir('/api/auth/me', { token });
  revisar(
    3,
    'Ruta protegida exige token (401 sin token, 200 con token)',
    sinToken.estado === 401 && conToken.estado === 200,
    `sin token ${sinToken.estado}, con token ${conToken.estado}`
  );

  // 4. /api/juegos?categoria=terror vs accion: distintas y coherentes
  const terror = await pedir('/api/juegos?categoria=terror', { token });
  const accion = await pedir('/api/juegos?categoria=accion', { token });
  const terrorOk =
    terror.estado === 200 &&
    Array.isArray(terror.datos) &&
    terror.datos.every((j) => j.categoria === 'terror');
  const accionOk =
    accion.estado === 200 &&
    Array.isArray(accion.datos) &&
    accion.datos.every((j) => j.categoria === 'accion');
  const idsTerror = new Set((terror.datos || []).map((j) => j.id));
  const idsAccion = new Set((accion.datos || []).map((j) => j.id));
  const distintas = ![...idsTerror].some((id) => idsAccion.has(id));
  revisar(
    4,
    '/api/juegos?categoria=terror y accion devuelven listas distintas y coherentes',
    terrorOk && accionOk && distintas,
    `terror ${(terror.datos || []).length}, accion ${(accion.datos || []).length}`
  );

  // 5. Películas: animacion vs fantasia distintas y coherentes
  const animacion = await pedir('/api/contenidos?seccion=peliculas&genero=animacion', { token });
  const fantasia = await pedir('/api/contenidos?seccion=peliculas&genero=fantasia', { token });
  const animacionOk =
    animacion.estado === 200 &&
    Array.isArray(animacion.datos) &&
    animacion.datos.every((c) => c.genero === 'animacion');
  const fantasiaOk =
    fantasia.estado === 200 &&
    Array.isArray(fantasia.datos) &&
    fantasia.datos.every((c) => c.genero === 'fantasia');
  const idsAnimacion = new Set((animacion.datos || []).map((c) => c.id));
  const idsFantasia = new Set((fantasia.datos || []).map((c) => c.id));
  const distintasPeliculas = ![...idsAnimacion].some((id) => idsFantasia.has(id));
  revisar(
    5,
    'Películas por género (animacion vs fantasia) son distintas y coherentes',
    animacionOk && fantasiaOk && distintasPeliculas,
    `animacion ${(animacion.datos || []).length}, fantasia ${(fantasia.datos || []).length}`
  );

  // 6. Música sin género jazz -> lista vacía 200
  const jazz = await pedir('/api/contenidos?seccion=musica&genero=jazz', { token });
  revisar(
    6,
    'Música con género jazz sin datos responde 200 con lista vacía',
    jazz.estado === 200 && Array.isArray(jazz.datos) && jazz.datos.length === 0,
    `estado ${jazz.estado}, ${(jazz.datos || []).length} elementos`
  );

  // 7. Búsqueda existente, parcial y con acentos
  const catalogoJuegos = await pedir('/api/juegos', { token });
  const juegos = Array.isArray(catalogoJuegos.datos) ? catalogoJuegos.datos : [];
  const muestra = juegos.find((j) => j.titulo && j.titulo.length >= 4);

  if (muestra) {
    const parcial = muestra.titulo.slice(0, 3);
    const busquedaParcial = await pedir(`/api/buscar?q=${encodeURIComponent(parcial)}`, { token });
    const encontroParcial = (busquedaParcial.datos?.juegos || []).some((j) => j.id === muestra.id);

    const conAcento = juegos.find(
      (j) => j.titulo && j.titulo.normalize('NFD').replace(/[\u0300-\u036f]/g, '') !== j.titulo
    );
    let encontroAcento = true;
    let detalleAcento = 'sin títulos con acentos para probar';
    if (conAcento) {
      const sinAcento = conAcento.titulo
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      const busquedaAcento = await pedir(`/api/buscar?q=${encodeURIComponent(sinAcento)}`, { token });
      encontroAcento = (busquedaAcento.datos?.juegos || []).some((j) => j.id === conAcento.id);
      detalleAcento = `«${sinAcento}» encuentra «${conAcento.titulo}»`;
    }

    revisar(
      7,
      'Búsqueda parcial y sin acentos encuentra coincidencias',
      busquedaParcial.estado === 200 && encontroParcial && encontroAcento,
      `parcial «${parcial}»${encontroParcial ? ' OK' : ' sin coincidencia'}; ${detalleAcento}`
    );
  } else {
    revisar(7, 'Búsqueda parcial y sin acentos encuentra coincidencias', false, 'no hay juegos publicados para probar');
  }

  // 8. Término inexistente -> 200 con resultados vacíos
  const inexistente = await pedir('/api/buscar?q=zzzzqwertyopenleaf', { token });
  revisar(
    8,
    'Búsqueda sin coincidencias responde 200 con total 0',
    inexistente.estado === 200 && inexistente.datos?.total === 0,
    `estado ${inexistente.estado}, total ${inexistente.datos?.total}`
  );

  // 9. Sin texto -> catálogo completo (200 y con datos)
  const catalogo = await pedir('/api/buscar', { token });
  revisar(
    9,
    'Búsqueda vacía devuelve el catálogo completo (200 con datos)',
    catalogo.estado === 200 && Array.isArray(catalogo.datos?.juegos) && catalogo.datos.juegos.length > 0,
    `estado ${catalogo.estado}, ${(catalogo.datos?.juegos || []).length} juegos`
  );

  // 10. Un solo carácter -> 400
  const unCaracter = await pedir('/api/buscar?q=a', { token });
  revisar(
    10,
    'Búsqueda de un solo carácter responde 400',
    unCaracter.estado === 400,
    `estado ${unCaracter.estado}`
  );

  console.log(`\nResumen: ${aprobadas} aprobadas, ${falladas} falladas de ${aprobadas + falladas}.`);
  process.exit(falladas === 0 ? 0 : 1);
}


main().catch((error) => {
  console.error(`\nError ejecutando la prueba de humo: ${error.message}`);
  process.exit(1);
});
