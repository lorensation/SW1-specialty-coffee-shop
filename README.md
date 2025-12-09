# ☕ Royal Coffee - Specialty Coffee Shop

**Aplicación web full-stack para una cafetería especializada** desarrollada con React, Node.js, Express y Supabase.

---

## 👥 Miembros del Proyecto

- Lorenzo Sanz Trucharte
- Alfredo Martinez Escoval
- Pedro Varona Parra
- Juan Garcia-Obregon Thevenet
- Alvaro Iñiguez Disla
- Claudia Erguido Aguilar

---

## 📋 Información Breve del Proyecto

Royal Coffee es una plataforma web moderna que permite a los usuarios explorar productos de café de especialidad, hacer reservas, gestionar favoritos y compartir opiniones. Los administradores pueden gestionar productos, reservas, usuarios y comunicarse con clientes a través de un sistema de chat en tiempo real.

### ✨ Características Principales

- 🛍️ **Catálogo de Productos**: Navegación por categorías (café, postres, ediciones especiales)
- 🛒 **Carrito de Compras**: Gestión dinámica de productos
- 📅 **Sistema de Reservas**: Reserva de mesas con gestión de horarios
- ⭐ **Favoritos**: Guarda tus productos preferidos
- 💬 **Feed de Opiniones**: Comparte y lee comentarios de la comunidad
- 👤 **Autenticación**: Registro, login y recuperación de contraseña
- 🔐 **Panel de Administración**: Gestión completa de productos, usuarios, reservas y chat
- 💬 **Chat en Tiempo Real**: Comunicación instantánea admin-cliente (Socket.io)
- 📧 **Emails Transaccionales**: Notificaciones por email (Mailjet)

---

## 🏗️ Arquitectura

### Stack Tecnológico

**Frontend:**
- React 18 + Vite
- React Router DOM (navegación)
- Lucide React (iconos)
- Socket.io Client (WebSockets)
- React Hot Toast (notificaciones)

**Backend:**
- Node.js + Express
- Supabase (PostgreSQL database)
- Socket.io (chat en tiempo real)
- Bcrypt.js (encriptación de contraseñas)
- Express Validator (validación de datos)
- Nodemailer + Mailjet (emails)
- Cookie-based authentication

### Estructura del Proyecto

```
SW1-specialty-coffee-shop/
├── src/
│   ├── client/                 # Frontend React
│   │   ├── src/
│   │   │   ├── components/     # Componentes reutilizables
│   │   │   ├── pages/          # Páginas de la aplicación
│   │   │   ├── context/        # Context API (Auth, Cart)
│   │   │   ├── services/       # API services
│   │   │   └── assets/         # Imágenes y recursos
│   │   └── package.json
│   │
│   └── server/                 # Backend Node.js
│       ├── config/             # Configuración de DB
│       ├── controllers/        # Lógica de negocio
│       ├── models/             # Modelos de datos
│       ├── routes/             # Rutas de API
│       ├── middlewares/        # Middlewares (auth, validación)
│       ├── services/           # Servicios (email, sockets)
│       ├── database/           # Scripts SQL
│       └── package.json
│
└── docs/                       # Build para GitHub Pages
```

---

## 🚀 Instalación y Configuración

### Prerequisitos

- Node.js (v16 o superior)
- npm o yarn
- Cuenta de Supabase (para la base de datos)
- Cuenta de Mailjet (para envío de emails)

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/lorensation/SW1-specialty-coffee-shop.git
cd SW1-specialty-coffee-shop
```

### 2️⃣ Configurar el Backend

```bash
cd src/server
npm install
```

Crear archivo `.env` en `src/server/` con las siguientes variables:

```env
# Server
NODE_ENV=development
PORT=5001

# Supabase
SUPABASE_URL=tu_supabase_url
SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_KEY=tu_supabase_service_key

# JWT
JWT_SECRET=tu_jwt_secret
JWT_EXPIRES_IN=7d

# Email (Mailjet)
EMAIL_USER=tu_mailjet_api_key
EMAIL_PASS=tu_mailjet_secret_key
EMAIL_FROM=tu_email@example.com

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Inicializar la base de datos:**

Ejecuta los scripts SQL en Supabase en este orden:
1. `src/server/database/schema.sql`
2. `src/server/database/seed.sql`
3. `src/server/database/insert_products.sql`

**Crear usuario administrador:**

```bash
npm run create-admin
```

**Iniciar el servidor:**

```bash
npm run dev
# Servidor corriendo en http://localhost:5001
```

### 3️⃣ Configurar el Frontend

```bash
cd src/client
npm install
```

Crear archivo `.env` en `src/client/` (opcional):

```env
VITE_API_URL=http://localhost:5001/api
```

**Iniciar la aplicación:**

```bash
npm run dev
# Aplicación corriendo en http://localhost:5173
```

### Ejecución Completa del Proyecto

**Terminal 1 - Backend:**
```bash
cd src/server
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd src/client
npm install
npm run dev
```

Ahora puedes acceder a:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001/api

---

## 🎯 Funcionalidades por Rol

### 👤 Usuario Regular

- Explorar catálogo de productos
- Agregar productos al carrito
- Guardar productos favoritos
- Hacer reservas de mesa
- Publicar y leer opiniones en el feed
- Editar perfil y cambiar contraseña
- Chatear con soporte (admin)

### 🔑 Administrador

- Todas las funcionalidades de usuario
- **Gestión de Productos**: CRUD completo con imágenes
- **Gestión de Reservas**: Confirmar, reprogramar, cancelar
- **Gestión de Usuarios**: Promover/degradar roles, suspender cuentas
- **Chat Admin**: Gestionar múltiples conversaciones en tiempo real
- Dashboard con estadísticas

---

## 📡 API Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual
- `POST /api/auth/forgot-password` - Recuperar contraseña
- `POST /api/auth/reset-password` - Resetear contraseña

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener producto
- `POST /api/products` - Crear producto (admin)
- `PUT /api/products/:id` - Actualizar producto (admin)
- `DELETE /api/products/:id` - Eliminar producto (admin)

### Reservas
- `GET /api/reservations` - Listar reservas
- `POST /api/reservations` - Crear reserva
- `PATCH /api/reservations/:id/status` - Cambiar estado (admin)

### Usuarios
- `GET /api/users` - Listar usuarios (admin)
- `PATCH /api/users/:id/role` - Cambiar rol (admin)
- `PATCH /api/users/:id/status` - Suspender/activar (admin)

### Comentarios
- `GET /api/comments` - Listar comentarios
- `POST /api/comments` - Crear comentario
- `PATCH /api/comments/:id` - Editar comentario
- `DELETE /api/comments/:id` - Eliminar comentario

### Favoritos
- `GET /api/favorites` - Listar favoritos
- `POST /api/favorites` - Añadir favorito
- `DELETE /api/favorites/:productId` - Eliminar favorito

---

## 🛡️ Seguridad

- **Autenticación basada en cookies** (HttpOnly, Secure)
- **Hashing de contraseñas** con bcrypt
- **Validación de datos** con express-validator
- **Protección CORS** configurada
- **Helmet.js** para headers de seguridad
- **Rate limiting** en endpoints sensibles
- **Middleware de autorización** por roles

---

## 🌐 Información de Despliegue

### Despliegue del Frontend (GitHub Pages)

---

## 📁 Estructura del Repositorio

```
SW1-specialty-coffee-shop/
│
├── docs/                          # Carpeta con toda la documentación del proyecto
│   ├── index.html                 # Build del frontend para GitHub Pages
│   └── assets/                    # Recursos estáticos del build
│
├── src/                           # Código fuente del proyecto
│   ├── client/                    # Frontend React
│   │   ├── src/
│   │   │   ├── components/        # Componentes reutilizables
│   │   │   ├── pages/             # Páginas de la aplicación
│   │   │   ├── context/           # Context API (Auth, Cart)
│   │   │   └── services/          # Servicios de API
│   │   └── package.json
│   │
│   └── server/                    # Backend Node.js/Express
│       ├── controllers/           # Lógica de negocio
│       ├── models/                # Modelos de datos
│       ├── routes/                # Rutas de la API
│       ├── middlewares/           # Middlewares (auth, validación)
│       ├── services/              # Servicios (email, sockets)
│       ├── database/              # Scripts SQL
│       └── package.json
│
└── README.md                      # Este archivo
```

---

## 📄 Licencia

ISC License

---

**Proyecto desarrollado para la asignatura de Sistemas Web 1**  

## ⚙️ Información de Ejecución

### Requisitos Previos

- **Node.js** v16 o superior
- **npm** o **yarn**
- **Cuenta de Supabase** (base de datos)
- **Cuenta de Mailjet** (envío de emails)


## 🐛 Reportar Problemas

Si encuentras algún bug o tienes sugerencias, por favor abre un issue en el repositorio.

---

**Desarrollado con ☕ y ❤️ por el equipo de Royal Coffee**
