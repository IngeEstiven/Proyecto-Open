import { BrowserRouter } from 'react-router-dom';

import { ToastProvider } from './components/admin/Toast.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { FavoritosProvider } from './context/FavoritosContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';
import ScrollToTop from './routes/ScrollToTop.jsx';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <FavoritosProvider>
            <ToastProvider>
              <AppRoutes />
            </ToastProvider>
          </FavoritosProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
