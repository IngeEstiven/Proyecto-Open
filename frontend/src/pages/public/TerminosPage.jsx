import { Link } from 'react-router-dom';

import useTituloPagina from '../../hooks/useTituloPagina.js';

export default function TerminosPage() {
  useTituloPagina('Términos de uso | OpenLeaf');

  return (
    <div className="op-landing-root">
      <main className="op-section" style={{ maxWidth: '820px' }}>
        <Link to="/" className="op-footer-link" style={{ display: 'inline-block', marginBottom: '1.5rem' }}>
          <i className="fas fa-arrow-left mr-1"></i> Volver a OpenLeaf
        </Link>
        <h1 className="op-section-title">Términos de uso</h1>
        <p className="op-section-sub">
          Texto base, pendiente de revisión del equipo.
        </p>

        <div className="op-step" style={{ marginBottom: '1rem' }}>
          <p className="op-step-title"><i className="fas fa-circle-check op-step-icon"></i> 1. Uso del servicio</p>
          <p className="op-step-desc">
            OpenLeaf es un proyecto académico con fines educativos. El acceso es gratuito y está disponible
            para mayores de 18 años. Al usar el sitio aceptas estos términos y usas la plataforma de forma
            responsable y legal.
          </p>
        </div>
        <div className="op-step" style={{ marginBottom: '1rem' }}>
          <p className="op-step-title"><i className="fas fa-tower-broadcast op-step-icon"></i> 2. Contenido de terceros</p>
          <p className="op-step-desc">
            El contenido multimedia se reproduce con incrustaciones (iframes) de los servicios oficiales de
            cada plataforma. OpenLeaf no almacena ni distribuye vídeo, audio ni archivos protegidos por
            derechos de autor; la disponibilidad depende de los proveedores externos.
          </p>
        </div>
        <div className="op-step" style={{ marginBottom: '1rem' }}>
          <p className="op-step-title"><i className="fas fa-user-shield op-step-icon"></i> 3. Cuenta y verificación</p>
          <p className="op-step-desc">
            Para registrarte debes tener al menos 18 años, proporcionar datos reales y verificar tu correo
            electrónico con el código que te enviamos. Eres responsable de mantener tu contraseña privada y
            de la actividad realizada con tu cuenta.
          </p>
        </div>
        <div className="op-step" style={{ marginBottom: '1rem' }}>
          <p className="op-step-title"><i className="fas fa-people-pulling op-step-icon"></i> 4. Conducta</p>
          <p className="op-step-desc">
            No está permitido el uso fraudulento del sitio, suplantar identidades, intentar acceder a cuentas
            ajenas ni realizar actividades que puedan dañar el servicio o a otros usuarios.
          </p>
        </div>
        <div className="op-step" style={{ marginBottom: '1rem' }}>
          <p className="op-step-title"><i className="fas fa-cart-shopping op-step-icon"></i> 5. Pedidos simulados</p>
          <p className="op-step-desc">
            Los pedidos de videojuegos son una simulación académica: no se realiza ningún cobro, pago ni
            envío real. No compartas información de pago por esta vía.
          </p>
        </div>
        <div className="op-step" style={{ marginBottom: '1rem' }}>
          <p className="op-step-title"><i className="fas fa-shield-halved op-step-icon"></i> 6. Protección de datos</p>
          <p className="op-step-desc">
            Los datos personales se tratan conforme a la Ley 1581 de 2012 (Colombia) y a nuestra política de
            privacidad. Puedes ejercer los derechos de conocer, actualizar y eliminar tu información.
          </p>
        </div>
        <div className="op-step">
          <p className="op-step-title"><i className="fas fa-scale-balanced op-step-icon"></i> 7. Límites de responsabilidad</p>
          <p className="op-step-desc">
            OpenLeaf se ofrece "tal cual": no garantizamos la disponibilidad continua del servicio ni la
            permanencia de los enlaces a plataformas de terceros. El proyecto se entrega sin fines de lucro.
          </p>
        </div>
      </main>
    </div>
  );
}