# OpenLeaf · SAMB

Plataforma multimedia web (SPA) que centraliza el acceso a catálogos de **películas, música y videojuegos con tráilers**. Incluye búsqueda, favoritos, perfil de usuario y un **reproductor persistente** (YouTube / Twitch / Spotify) que sigue sonando mientras navegas entre secciones. El proyecto es académico, desarrollado por **SAMB**.

## Enlaces

| Recurso | URL |
| --- | --- |
| Repositorio | https://github.com/IngeEstiven/Proyecto-Open |
| Frontend (Vercel) | https://openleaf-frontend.vercel.app/ |
| Backend (Render) | https://openleaf-backend.onrender.com |

El *health check* del backend está en la raíz: `GET /` responde `{"message":"API OpenLeaf funcionando correctamente"}`.

> El backend está desplegado en el **plan Free de Render**. Cuando el servicio lleva un tiempo inactivo se suspende: la **primera petición puede tardar unos segundos** (30–50 s) en responder mientras se despierta. Esto es normal, no un error.

---

## Stack tecnológico

**Frontend**
- React 18 + Vite 7
- Tailwind CSS 4 (con PostCSS)
- React Router 7 y Axios

**Backend**
- Node.js + Express 4 (ES modules)
- Supabase (PostgreSQL + autenticación de datos) — se usa **solo en el backend**
- `bcryptjs`, `jsonwebtoken`, `express-rate-limit`, `multer`
- Nodemailer (respaldo SMTP) y **Brevo** vía API HTTPS como proveedor principal de correo (Resend como respaldo)

**Despliegue**
- Frontend: Vercel (con `vercel.json` para reescrituras SPA)
- Backend: Render Web Service

> El frontend **no usa Supabase directamente**: consume únicamente la API REST del backend. Por eso no hay variables `VITE_` de Supabase.

---

## Requisitos

- **Node.js ≥ 20.19** (recomendado 22 LTS; el desarrollo se validó con `v24.14.0`). Vite 7 no funciona con versiones anteriores.
- **npm ≥ 10** (se usó `11.9.0`).
- Una instancia de **Supabase** y una cuenta de **Brevo** para el envío de correos.

No hay archivos `.nvmrc` ni campo `engines` en `package.json`; la versión se indica aquí.

---

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/IngeEstiven/Proyecto-Open.git
cd Proyecto-Open
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env      # crea tu archivo y rellena los valores
npm start                 # o: npm run dev (usa nodemon)
```

Variables que el código lee de `backend/.env` (ver `backend/.env.example`):

| Variable | Descripción |
| --- | --- |
| `PORT` | Puerto del servidor. Por defecto `3001`. |
| `FRONTEND_URL` | Origen permitido por CORS (separar varios con coma). Por defecto `http://localhost:5173`. |
| `SUPABASE_URL` | URL del proyecto Supabase. |
| `SUPABASE_ANON_KEY` | Clave pública (`anon`) de Supabase. |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (privada). Alternativamente se puede dividir en `SUPABASE_KEY_PART1` + `SUPABASE_KEY_PART2`; el código las concatena. |
| `JWT_SECRET` | Secreto para firmar los tokens JWT. |
| `JWT_EXPIRES_IN` | Vigencia del token. Por defecto `2h`. |
| `BREVO_API_KEY` | Clave API de Brevo. **Proveedor principal** de correo (API HTTPS). |
| `BREVO_FROM_NAME` | Nombre del remitente. Por defecto `OpenLeaf`. |
| `BREVO_FROM_EMAIL` | Correo del remitente verificado en Brevo. |
| `RESEND_API_KEY` | Clave de Resend (respaldo si no hay Brevo). |
| `RESEND_FROM` | Remitente de Resend. Por defecto `onboarding@resend.dev`. |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | SMTP de respaldo (último recurso). |
| `MAIL_FROM` | Remitente usado por el respaldo SMTP. |
| `JAMENDO_CLIENT_ID` | Client ID de la API de Jamendo (catálogo de música). |
| `ADMIN_EMAIL` / `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Solo para el script `npm run create-admin`. |
| `API_URL` | Solo para `npm run smoke-test`. Por defecto `http://localhost:3001`. |

Prioridad de envío de correo: **Brevo → Resend → SMTP**. En Render Free los puertos SMTP están bloqueados, por eso se usa la API HTTPS de Brevo.

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env      # crear archivo local
npm run dev               # servidor de desarrollo
```

Variables de `frontend/.env` (ver `frontend/.env.example`):

| Variable | Descripción |
| --- | --- |
| `VITE_API_URL` | Base de la API. En local se usa `/api` (Vite hace proxy a `http://localhost:3001`); en producción, `https://openleaf-backend.onrender.com/api`. |
| `VITE_CONTACT_EMAIL` | Correo de contacto mostrado en el sitio. |

Las variables `VITE_` se exponen al navegador **por diseño**: nunca pongas secretos en ellas.

---

## Ejecución

| Entorno | Comando | URL |
| --- | --- | --- |
| Backend (dev) | `cd backend && npm run dev` | http://localhost:3001 |
| Backend (prod local) | `cd backend && npm start` | http://localhost:3001 |
| Frontend (dev) | `cd frontend && npm run dev` | http://localhost:5173 |
| Frontend (build) | `cd frontend && npm run build` | genera `frontend/dist` |
| Frontend (previsualizar build) | `cd frontend && npm run preview` | http://localhost:4173 |

En desarrollo, `vite.config.js` redirige `/api` a `http://localhost:3001`, así que el frontend puede usar `VITE_API_URL=/api`.

Otros scripts del backend: `npm run create-admin` (crea el usuario administrador) y `npm run smoke-test` (prueba rápida de endpoints).

---

## Recorrido de prueba

1. **Iniciar sesión** desde `https://openleaf-frontend.vercel.app/?auth=login` con el usuario de prueba:
   - Correo: `pruebacorreo`
   - Contraseña: `b1234567`
2. **Explorar categorías**: entrar a Películas, Música, En vivo, Deportes y GameZone desde la cabecera.
3. **Buscar un título** con la barra de búsqueda (o `/buscar?q=...`). Probar también con un texto inexistente para ver el estado vacío.
4. **Reproducir un contenido** y navegar a otra sección: el reproductor flotante debe seguir activo sin reiniciarse.
5. **Marcar un favorito** con el botón de corazón en una tarjeta.
6. **Cerrar sesión** y volver a entrar: verificar que el favorito persiste (se guarda en el backend, no solo en el navegador).
7. **Probar recuperación de contraseña** en `/?auth=recuperar` (o `/recuperar`): se envía un código de 6 dígitos por correo; introducirlo junto con la nueva contraseña. El código vence a los 10 minutos.

---

## Estructura del proyecto

```
openLeaf/
├── backend/
│   ├── src/
│   │   ├── config/        # configuración (cliente Supabase)
│   │   ├── controllers/   # controladores HTTP
│   │   ├── middlewares/   # autenticación JWT, etc.
│   │   ├── routes/        # rutas de la API (/auth, /contenidos, /favoritos, ...)
│   │   ├── scripts/       # createAdmin, smokeTest
│   │   └── services/      # lógica de negocio y mailService (Brevo/Resend/SMTP)
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/           # cliente Axios
│   │   ├── components/    # componentes públicos y de administración
│   │   ├── context/       # AuthContext, FavoritosContext, PlayerContext, ThemeContext
│   │   ├── hooks/         # hooks reutilizables (incluye reproductor)
│   │   ├── layouts/       # StreamVerse, GameZone, Admin, App
│   │   ├── pages/         # páginas públicas y de aplicación
│   │   ├── routes/        # enrutado y rutas protegidas
│   │   └── services/      # servicios de API por dominio
│   ├── vercel.json        # rewrite SPA para Vercel
│   ├── .env.example
│   └── package.json
└── README.md
```

## Seguridad

Los archivos `.env` **no se versionan**: `backend/.env` está excluido en `.gitignore` y las claves se configuran como variables de entorno en **Render** (backend) y **Vercel** (frontend). Ningún secreto aparece en este repositorio; los ejemplos `.env.example` solo contienen nombres de variables.
