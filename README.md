# Para ti 💌

Web para enamorar a tu novia. Tiene dos vistas:

- **`/admin`** (tuya, protegida con contrasena): crear cartas, frases o collages de fotos, y ver/borrar todo lo publicado.
- **`/`** (su vista): muestra solo lo publicado en el dia de hoy, con un panel de "puntos de enamoramiento" (sumar/restar), mini historial y una barra de progreso por niveles que no tiene limite.

## Estructura

```
backend/    API en Express + MongoDB (Mongoose)
frontend/   React + Vite (se publica en GitHub Pages)
.github/workflows/deploy-frontend.yml   Deploy automatico del frontend
```

## 1. Base de datos (MongoDB Atlas)

1. Crea una cuenta y un cluster gratuito en https://www.mongodb.com/cloud/atlas
2. Crea un usuario de base de datos y copia el **connection string** (`mongodb+srv://...`)
3. En "Network Access" permite `0.0.0.0/0` (o la IP de Render) para que el backend pueda conectarse

## 2. Backend en Render

1. Sube este repo a GitHub.
2. En Render: **New +** → **Web Service** → conecta el repo. Render detectara `backend/render.yaml`, o configura manualmente:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Health Check Path: `/api/health`
3. Agrega las variables de entorno (Environment):
   - `MONGODB_URI` → tu connection string de Atlas
   - `JWT_SECRET` → una cadena aleatoria larga
   - `ADMIN_PASSWORD` → la contrasena que usaras en `/admin`
   - `GF_ACCESS_CODE` → (opcional) codigo que le pedira a tu novia antes de ver la pagina
   - `FRONTEND_URL` → la URL de GitHub Pages, ej. `https://tu-usuario.github.io`
4. Deploy. Cuando termine, prueba `https://tu-backend.onrender.com/api/health` — debe responder `{"status":"ok",...}`.

### UptimeRobot (evitar que Render duerma el servicio gratuito)

1. Crea una cuenta en https://uptimerobot.com
2. **Add New Monitor** → HTTP(s) → URL: `https://tu-backend.onrender.com/api/health` → intervalo 5 minutos.

## 3. Frontend en GitHub Pages

1. En GitHub, ve a **Settings → Pages** y elige "Source: GitHub Actions".
2. En **Settings → Secrets and variables → Actions**, crea el secret:
   - `VITE_API_URL` → `https://tu-backend.onrender.com/api`
3. Haz push a `main`: el workflow `.github/workflows/deploy-frontend.yml` construye `frontend/` y lo publica en Pages automaticamente (usa el nombre del repo como base path, y `HashRouter` para que las rutas funcionen en Pages).
4. Tu web quedara en `https://tu-usuario.github.io/tu-repo/`.

## 4. Uso

- Entra a `https://tu-usuario.github.io/tu-repo/#/admin/login` con `ADMIN_PASSWORD` para publicar el contenido del dia.
- Comparte `https://tu-usuario.github.io/tu-repo/` con tu novia. Si configuraste `GF_ACCESS_CODE`, se lo pides una vez y queda guardado en su navegador.

## Desarrollo local

```bash
# Backend
cd backend
cp .env.example .env   # completa MONGODB_URI, JWT_SECRET, ADMIN_PASSWORD
npm install
npm run dev             # http://localhost:5000

# Frontend
cd frontend
cp .env.example .env    # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev              # http://localhost:5173
```
