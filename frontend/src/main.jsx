import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './assets/temas.css';
import './assets/streamverse.css';
import './index.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
