import { supabaseAdmin } from '../config/supabase.js';


const PLATAFORMA_SELECT = `
  id, nombre, seccion, descripcion, logo_url, imagen_url, sitio_url,
  estado, created_at, updated_at
`;


function extraerErrorDuplicado(error) {
  if (error.message.includes('plataformas_nombre_key')) {
    return new Error('El nombre de la plataforma ya existe');
  }
  return null;
}


export async function getPlataformas(user, { seccion } = {}) {
  let query = supabaseAdmin
    .from('plataformas')
    .select(PLATAFORMA_SELECT)
    .order('nombre', { ascending: true });


  if (user.rol !== 'administrador') query = query.eq('estado', 'activo');
  if (seccion) query = query.eq('seccion', seccion);


  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}


export async function createPlataforma(plataformaData) {
  const { data, error } = await supabaseAdmin
    .from('plataformas')
    .insert([
      {
        nombre: plataformaData.nombre.trim(),
        seccion: plataformaData.seccion,
        descripcion: plataformaData.descripcion || null,
        logo_url: plataformaData.logo_url || null,
        imagen_url: plataformaData.imagen_url || null,
        sitio_url: plataformaData.sitio_url || null,
        estado: plataformaData.estado || 'activo'
      }
    ])
    .select(PLATAFORMA_SELECT);


  if (error) {
    const duplicado = extraerErrorDuplicado(error);
    if (duplicado) throw duplicado;
    throw new Error(error.message);
  }


  return data[0];
}


export async function updatePlataforma(id, plataformaData) {
  const campos = {
    updated_at: new Date().toISOString()
  };


  if (plataformaData.nombre !== undefined) campos.nombre = plataformaData.nombre.trim();
  if (plataformaData.seccion !== undefined) campos.seccion = plataformaData.seccion;
  if (plataformaData.descripcion !== undefined) campos.descripcion = plataformaData.descripcion || null;
  if (plataformaData.logo_url !== undefined) campos.logo_url = plataformaData.logo_url || null;
  if (plataformaData.imagen_url !== undefined) campos.imagen_url = plataformaData.imagen_url || null;
  if (plataformaData.sitio_url !== undefined) campos.sitio_url = plataformaData.sitio_url || null;
  if (plataformaData.estado !== undefined) campos.estado = plataformaData.estado;


  const { data, error } = await supabaseAdmin
    .from('plataformas')
    .update(campos)
    .eq('id', id)
    .select(PLATAFORMA_SELECT);


  if (error) {
    const duplicado = extraerErrorDuplicado(error);
    if (duplicado) throw duplicado;
    throw new Error(error.message);
  }


  return data[0] || null;
}


export async function deletePlataforma(id) {
  const { data, error } = await supabaseAdmin
    .from('plataformas')
    .delete()
    .eq('id', id)
    .select('id, nombre, seccion, estado');


  if (error) throw new Error(error.message);
  return data[0] || null;
}


export async function updatePlataformaImage(id, imageUrl) {
  const { data, error } = await supabaseAdmin
    .from('plataformas')
    .update({ imagen_url: imageUrl, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(PLATAFORMA_SELECT);


  if (error) throw new Error(error.message);
  return data[0] || null;
}
