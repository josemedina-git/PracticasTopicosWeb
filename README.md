# Constructora de Movilidad - API REST

API REST con autenticación JWT y gestión de reportes de acceso a datos.

## Requisitos Previos

- Node.js (v14+)
- npm o yarn
- Cuenta en MongoDB Atlas
- Postman o similar para probar endpoints

## Instalación

1. Clonar el proyecto
2. Instalar dependencias: `npm install`
3. Crear archivo `.env` con tus credenciales
4. Cargar datos: `npm run seed`
5. Iniciar servidor: `npm run dev`

## Endpoints

### Autenticación
- POST `/api/auth/register` - Registrar nuevo usuario
- POST `/api/auth/login` - Login y obtener token
- GET `/api/auth/me` - Obtener datos del usuario actual

### Proyectos
- GET `/api/proyectos` - Listar todos (requiere admin/analista)
- GET `/api/proyectos/:id` - Obtener proyecto específ