import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { supabaseAdmin } from '../config/supabase.js';


dotenv.config();


async function createAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;


  if (!email || !username || !password) {
    console.error('Faltan ADMIN_EMAIL, ADMIN_USERNAME o ADMIN_PASSWORD en el .env');
    return;
  }


  const { data: roles, error: rolError } = await supabaseAdmin
    .from('roles')
    .select('id')
    .eq('nombre', 'administrador')
    .limit(1);


  if (rolError || !roles || roles.length === 0) {
    console.error('No existe el rol administrador. Ejecuta primero el SQL inicial.');
    return;
  }


  const { data: existing } = await supabaseAdmin
    .from('usuarios')
    .select('id')
    .eq('email', email.toLowerCase())
    .limit(1);


  if (existing && existing.length > 0) {
    console.log('El administrador ya existe.');
    return;
  }


  const passwordHash = await bcrypt.hash(password, 10);


  const { error } = await supabaseAdmin.from('usuarios').insert([
    {
      nombre: 'Admin',
      apellido: 'OpenLeaf',
      email: email.toLowerCase(),
      username,
      password_hash: passwordHash,
      rol_id: roles[0].id,
      estado: 'activo',
      email_verificado: true
    }
  ]);


  if (error) {
    console.error('Error creando administrador:', error.message);
    return;
  }


  console.log('Administrador creado correctamente:', email);
}


createAdmin();
