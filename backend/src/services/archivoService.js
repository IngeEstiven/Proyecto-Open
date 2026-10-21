import { supabaseAdmin } from '../config/supabase.js';


const BUCKET_NAME = 'openleaf-media';


export async function uploadFileToStorage(file, modulo) {
  const cleanName = file.originalname
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9.\-_]/g, '')
    .toLowerCase();


  const fileName = `${Date.now()}-${cleanName}`;
  const storagePath = `${modulo}/${fileName}`;


  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .upload(storagePath, file.buffer, { contentType: file.mimetype, upsert: false });


  if (uploadError) throw new Error(uploadError.message);


  const { data: publicUrlData } = supabaseAdmin.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath);


  return {
    bucket: BUCKET_NAME,
    storage_path: storagePath,
    nombre_archivo: file.originalname,
    tipo_archivo: file.mimetype,
    url: publicUrlData.publicUrl
  };
}


export async function createArchivo(data, user) {
  const { data: fila, error } = await supabaseAdmin
    .from('archivos')
    .insert([
      {
        nombre_archivo: data.nombre_archivo,
        url: data.url,
        tipo_archivo: data.tipo_archivo,
        modulo: data.modulo,
        referencia_id: data.referencia_id ?? null,
        bucket: data.bucket,
        storage_path: data.storage_path,
        subido_por: user?.id ?? null
      }
    ])
    .select('id, nombre_archivo, url, tipo_archivo, modulo, referencia_id, bucket, storage_path, subido_por, created_at');


  if (error) throw new Error(error.message);
  return fila[0];
}
