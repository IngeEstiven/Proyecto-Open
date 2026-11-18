import nodemailer from 'nodemailer';

const transporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    })
  : null;

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function sendEmail({ to, subject, text, html }) {
  // Brevo permite enviar a cualquier destinatario verificando un correo de
  // remitente, sin necesidad de comprar y verificar un dominio propio.
  if (process.env.BREVO_API_KEY) {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: process.env.BREVO_FROM_NAME || 'OpenLeaf',
          email: process.env.BREVO_FROM_EMAIL || 'openleaf.app@gmail.com'
        },
        to: [{ email: to }],
        subject,
        textContent: text,
        htmlContent: html
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(`Brevo ${response.status}: ${data.message || JSON.stringify(data)}`);
    }
    return data;
  }

  if (process.env.RESEND_API_KEY) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'onboarding@resend.dev',
        to: [to],
        subject,
        text,
        html
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(`Resend ${response.status}: ${data.message || JSON.stringify(data)}`);
    }
    return data;
  }

  if (!transporter) {
    throw new Error('No hay proveedor de correo configurado (falta BREVO_API_KEY, RESEND_API_KEY o SMTP_HOST)');
  }

  return transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html
  });
}

export async function sendResetCodeEmail(to, nombre, code) {
  await sendEmail({
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
  await sendEmail({
    to,
    subject: 'Tu código de verificación de OpenLeaf',
    text: `Hola ${nombre}, confirma tu correo en OpenLeaf con este código: ${code}. Vence en 10 minutos. Si no lo pediste, ignora este correo.`,
    html: `<p>Hola ${escapeHtml(nombre)},</p>
           <p>Confirma tu dirección de correo en OpenLeaf con este código:</p>
           <p style="font-size:28px;font-weight:bold;letter-spacing:6px">${escapeHtml(code)}</p>
           <p>Vence en 10 minutos. Si no lo pediste, ignora este correo.</p>`
  });
}
