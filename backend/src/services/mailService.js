import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});


function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}


export async function sendResetCodeEmail(to, nombre, code) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject: 'Tu código de recuperación de OpenLeaf',
    text: `Hola ${nombre}, tu código de recuperación es ${code}. Vence en 10 minutos. Si no lo pediste, ignora este correo.`,
    html: `<p>Hola ${escapeHtml(nombre)},</p>
           <p>Tu código de recuperación de OpenLeaf es:</p>
           <p style="font-size:28px;font-weight:bold;letter-spacing:6px">${escapeHtml(code)}</p>
           <p>Vence en 10 minutos. Si no lo pediste, ignora este correo.</p>`
  });
}


export async function sendVerificationCodeEmail(to, nombre, code) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject: 'Tu código de verificación de OpenLeaf',
    text: `Hola ${nombre}, confirma tu correo en OpenLeaf con este código: ${code}. Vence en 10 minutos. Si no lo pediste, ignora este correo.`,
    html: `<p>Hola ${escapeHtml(nombre)},</p>
           <p>Confirma tu dirección de correo en OpenLeaf con este código:</p>
           <p style="font-size:28px;font-weight:bold;letter-spacing:6px">${escapeHtml(code)}</p>
           <p>Vence en 10 minutos. Si no lo pediste, ignora este correo.</p>`
  });
}
