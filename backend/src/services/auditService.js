import { supabaseAdmin } from '../config/supabase.js';


export async function createAuditLog({
  usuario_id = null,
  accion,
  modulo,
  registro_id = null,
  descripcion = '',
  ip = null
}) {
  const { data, error } = await supabaseAdmin
    .from('bitacora_auditoria')
    .insert([{ usuario_id, accion, modulo, registro_id, descripcion, ip }])
    .select('id, usuario_id, accion, modulo, registro_id, descripcion, ip, created_at');


  if (error) {
    console.error('Error registrando auditoría:', error.message);
    return null;
  }


  return data[0];
}


const AUDIT_SELECT = `
  id, accion, modulo, registro_id, descripcion, ip, created_at,
  usuario:usuarios ( id, nombre, apellido, username )
`;


export async function getAuditLogs() {
  const { data, error } = await supabaseAdmin
    .from('bitacora_auditoria')
    .select(AUDIT_SELECT)
    .order('created_at', { ascending: false })
    .limit(500);


  if (error) throw new Error(error.message);
  return data;
}


export async function getAuditLogById(id) {
  const { data, error } = await supabaseAdmin
    .from('bitacora_auditoria')
    .select(AUDIT_SELECT)
    .eq('id', id)
    .limit(1);


  if (error) throw new Error(error.message);
  return data[0] || null;
}
