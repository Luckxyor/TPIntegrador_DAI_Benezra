TP Integrador - App móvil (Expo)

Requisitos
- Node 18+
- Expo CLI (`npm i -g expo` recomendado)

Configuración de API
- Por defecto, la app usa:
  - Android emulator: http://10.0.2.2:3000
  - iOS/web: http://localhost:3000
- Para personalizar, exportá la variable `EXPO_PUBLIC_API_URL` antes de iniciar:
  - PowerShell: `$env:EXPO_PUBLIC_API_URL="http://TU_IP_LAN:3000"; npm start`

Instalación y ejecución
1. cd mobile
2. npm install
3. npm start
4. Elegí el dispositivo (Android/iOS/Web)

Endpoints usados
- POST /api/user/register
- POST /api/user/login
- GET /api/event (paginado y búsqueda por `name`)
- GET /api/event/:id
- POST /api/event/:id/enrollment (requiere token)
- DELETE /api/event/:id/enrollment (requiere token)
- GET /api/event-location (requiere token)
- POST /api/event-location (requiere token)


