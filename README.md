# Event Manager App

Una aplicación completa de gestión de eventos con backend en Node.js/Express y frontend en React Native.

## Estructura del Proyecto

```
TPIntegrador_DAI_Benezra/
├── backend/                    # API REST con Node.js y Express
│   ├── src/
│   │   ├── controllers/       # Controladores de la API
│   │   ├── services/          # Lógica de negocio
│   │   ├── repositories/      # Acceso a datos
│   │   ├── middlewares/       # Middlewares de autenticación
│   │   └── configs/           # Configuraciones
│   ├── database/              # Scripts de base de datos
│   └── package.json
└── frontend/                   # Aplicación móvil con React Native
    └── EventApp/
        ├── src/
        │   ├── screens/       # Pantallas de la aplicación
        │   ├── navigation/    # Navegación de la app
        │   ├── services/      # Servicios API
        │   ├── contexts/      # Contextos de React
        │   └── components/    # Componentes reutilizables
        └── package.json
```

## Funcionalidades

### Backend (API REST)
- ✅ Autenticación de usuarios (registro/login)
- ✅ CRUD de eventos
- ✅ CRUD de ubicaciones de eventos
- ✅ Inscripción/desinscripción a eventos
- ✅ Filtrado y búsqueda de eventos
- ✅ Middleware de autenticación JWT

### Frontend (React Native)
- ✅ Pantallas de login y registro
- ✅ Lista de eventos con búsqueda
- ✅ Detalle de eventos
- ✅ Creación de eventos
- ✅ Gestión de ubicaciones de eventos
- ✅ Perfil de usuario
- ✅ Navegación por tabs
- ✅ Autenticación persistente

## Instalación y Configuración

### Prerrequisitos
- Node.js (v14 o superior)
- PostgreSQL
- Expo CLI: `npm install -g @expo/cli`
- Expo Go app en tu móvil

### Backend

1. Navega a la carpeta del backend:
   ```bash
   cd backend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   - Crea un archivo `.env` en la carpeta backend
   - Agrega las variables necesarias para la base de datos PostgreSQL

4. Ejecuta el script de base de datos:
   - Importa `database/BD_TPIntegrador.sql` en tu instancia de PostgreSQL

5. Inicia el servidor:
   ```bash
   npm run dev  # Para desarrollo con nodemon
   # o
   npm start    # Para producción
   ```

El backend estará disponible en `http://localhost:3000`

### Frontend

1. Navega a la carpeta del frontend:
   ```bash
   cd frontend/EventApp
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia la aplicación:
   ```bash
   npx expo start
   ```

4. Escanea el código QR con la app Expo Go en tu móvil

## Configuración de IP

**IMPORTANTE**: Para que el frontend se conecte al backend, necesitas actualizar la IP en el archivo de configuración API:

1. Abre `frontend/EventApp/src/services/api.js`
2. Cambia `localhost` por tu IP local:
   ```javascript
   const API_URL = 'http://TU_IP_LOCAL:3000/api';
   ```

Para obtener tu IP local:
- Windows: `ipconfig`
- macOS/Linux: `ifconfig`

## Uso con Expo Go

1. Descarga Expo Go en tu dispositivo móvil
2. Asegúrate de que tu móvil y computadora estén en la misma red WiFi
3. Ejecuta `npx expo start` en la carpeta del frontend
4. Escanea el código QR que aparece en la terminal
5. La aplicación se cargará en tu móvil

## Endpoints de la API

### Autenticación
- `POST /api/user/register` - Registro de usuario
- `POST /api/user/login` - Login de usuario

### Eventos
- `GET /api/event` - Listar eventos (con filtros opcionales)
- `GET /api/event/:id` - Obtener evento por ID
- `POST /api/event` - Crear evento (requiere autenticación)
- `PUT /api/event` - Actualizar evento (requiere autenticación)
- `DELETE /api/event/:id` - Eliminar evento (requiere autenticación)
- `POST /api/event/:id/enrollment` - Inscribirse a evento
- `DELETE /api/event/:id/enrollment` - Desinscribirse de evento

### Ubicaciones de Eventos
- `GET /api/event-location` - Listar ubicaciones (requiere autenticación)
- `GET /api/event-location/:id` - Obtener ubicación por ID
- `POST /api/event-location` - Crear ubicación (requiere autenticación)
- `PUT /api/event-location/:id` - Actualizar ubicación (requiere autenticación)
- `DELETE /api/event-location/:id` - Eliminar ubicación (requiere autenticación)

## Tecnologías Utilizadas

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT para autenticación
- bcryptjs para encriptación
- CORS

### Frontend
- React Native
- Expo
- React Navigation
- Axios
- Expo Secure Store
- Vector Icons

## Autor
Lucas Benezra
