import { Link } from 'react-router-dom';

import useTituloPagina from '../../hooks/useTituloPagina.js';

export default function AvisoLegalPage() {
  useTituloPagina('Aviso legal | OpenLeaf');

  return (
    <div className="op-landing-root">
      <main className="op-section" style={{ maxWidth: '820px' }}>
        <Link to="/" className="op-footer-link" style={{ display: 'inline-block', marginBottom: '1.5rem' }}>
          <i className="fas fa-arrow-left mr-1"></i> Volver a OpenLeaf
        </Link>
        <h1 className="op-section-title">Aviso legal</h1>
        <p className="op-section-sub">
          Este proyecto es un trabajo académico con fines educativos. OpenLeaf no almacena ni distribuye
          archivos protegidos por derechos de autor; todo el contenido se reproduce desde los servicios
          oficiales de terceros, a través de incrustaciones públicas y enlaces a sus sitios.
        </p>

        <div className="op-step" style={{ marginBottom: '1rem' }}>
          <p className="op-step-title"><i className="fas fa-circle-info op-step-icon"></i> Uso del sitio</p>
          <p className="op-step-desc">
            El acceso al catálogo de plataformas, contenidos y videojuegos es gratuito y requiere una cuenta.
            Los pedidos de videojuegos son una simulación: no se realiza ningún cobro ni envío real.
          </p>
        </div>
        <div className="op-step">
          <p className="op-step-title"><i className="fas fa-shield-halved op-step-icon"></i> Propiedad intelectual</p>
          <p className="op-step-desc">
            Las marcas, logotipos y nombres de plataformas y juegos pertenecen a sus respectivos dueños y se
            muestran únicamente con fines informativos y académicos.
          </p>
        </div>
      </main>
    </div>
  );
}