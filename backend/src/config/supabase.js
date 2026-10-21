import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';


dotenv.config();


// Sin estas variables supabase-js lanza una excepción en inglés con stack trace,
// así que se validan antes de crear los clientes.
const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'];
for (const name of required) {
  if (!process.env[name]) {
    console.error(`Falta la variable de entorno ${name}`);
    process.exit(1);
  }
}


// normalizeSupabaseUrl: quita espacios, barras finales y el sufijo /rest/v1.
// Si se pasa ".../rest/v1", supabase-js construye ".../rest/v1/rest/v1" y lanza
// "Invalid path specified in request URL", así que se limpia antes de crear los clientes.
function normalizeSupabaseUrl(url) {
  const limpia = url
    .trim()
    .replace(/\/rest\/v1\/?$/i, '')
    .replace(/\/+$/, '');


  if (!/^https:\/\//.test(limpia)) {
    console.error(
      'La variable SUPABASE_URL no es una URL válida: debe comenzar con https:// y apuntar al proyecto de Supabase (por ejemplo https://xxxx.supabase.co).'
    );
    process.exit(1);
  }


  return limpia;
}


const supabaseUrl = normalizeSupabaseUrl(process.env.SUPABASE_URL);


export const supabase = createClient(
  supabaseUrl,
  process.env.SUPABASE_ANON_KEY
);


export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
