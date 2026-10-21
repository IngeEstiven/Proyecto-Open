import { Link } from 'react-router-dom';

import useTituloPagina from '../../hooks/useTituloPagina.js';
import { EMAIL_CONTACTO } from '../../services/informacionSitio.js';

export default function PrivacidadPage() {
  useTituloPagina('Privacidad | OpenLeaf');

  return (
    <div className="op-landing-root">
      <main className="op-section" style={{ maxWidth: '820px' }}>
        <Link to="/" className="op-footer-link" style={{ display: 'inline-block', marginBottom: '1.5rem' }}>
          <i className="fas fa-arrow-left mr-1"></i> Volver a OpenLeaf
        </Link>
        <h1 className="op-section-title">Política de privacidad</h1>
        <p className="op-section-sub">
          En OpenLeaf nos tomamos en serio tus datos. Esta política explica qué información guardamos y cómo la usamos.
        </p>

        <div className="op-step" style={{ marginBottom: '1rem' }}>
          <p className="op-step-title"><i className="fas fa-user-lock op-step-icon"></i> Qué datos guardamos</p>
          <p className="op-step-desc">
            Solo los que proporcionas al crear tu cuenta: nombre, apellido, país, fecha de nacimiento, correo,
            usuario y una contraseña almacenada de forma cifrada. Las novedades únicamente se te envían si lo
            aceptaste al registrarte. Tu sesión se conserva en tu navegador (token en tu almacenamiento local).
          </p>
        </div>
        <div className="op-step" style={{ marginBottom: '1rem' }}>
          <p className="op-step-title"><i className="fas fa-chart-line op-step-icon"></i> Para qué los usamos</p>
          <p className="op-step-desc">
            Para autenticarte, verificar tu correo, personalizar tu biblioteca de favoritos, gestionar tus
            pedidos de simulación y registrar la actividad administrativa con fines de auditoría. Nunca
            vendemos tus datos.
          </p>
        </div>
        <div className="op-step">
          <p className="op-step-title"><i className="fas fa-file-shield op-step-icon"></i> Tus derechos</p>
          <p className="op-step-desc">
            Puedes actualizar tu perfil o eliminar tu cuenta en cualquier momento. Si tienes dudas, escríbenos
            a {EMAIL_CONTACTO}.
          </p>
        </div>
      </main>
    </div>
  );
}