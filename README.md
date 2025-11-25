# Sistema de Turnos para Barberia

Sistema web completo para la gestion de turnos en una barberia, desarrollado con React, TypeScript, Node.js, Express y MongoDB.

[![Tests](https://img.shields.io/badge/tests-45%2F45%20passing-brightgreen)]()
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)]()
[![React](https://img.shields.io/badge/React-18.x-blue)]()
[![Node](https://img.shields.io/badge/Node.js-18.x-green)]()
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green)]()

---

## Tabla de Contenidos

- [Caracteristicas](#caracteristicas)
- [Tecnologias](#tecnologias)
- [Patrones de Diseno](#patrones-de-diseno)
- [Capturas de Pantalla](#capturas-de-pantalla)
- [Instalacion](#instalacion)
- [Documentacion](#documentacion)
- [Testing](#testing)
- [Contacto](#contacto)

---

## Caracteristicas

### Para Clientes
- Registro e inicio de sesion
- Reserva de turnos con validacion de horarios
- 3 tipos de turnos: Simple, Express y Combo
- Seleccion de barbero
- Visualizacion de turnos reservados
- Cancelacion de turnos

### Para Barberos
- Inicio de sesion
- Visualizacion de todos los turnos agendados
- Informacion detallada de cada turno

### Validaciones Automaticas
- Horario de atencion: Lunes a Sabado, 9:00 AM - 8:00 PM
- No permite turnos en el pasado
- No permite turnos los domingos
- Verifica disponibilidad del barbero
- Previene solapamiento de horarios

---

## Tecnologias

### Frontend
- **React 18** con TypeScript
- **Vite** (bundler y dev server)
- **React Router** (navegacion)
- **Axios** (cliente HTTP)
- **Context API** (manejo de estado)

### Backend
- **Node.js** con TypeScript
- **Express.js** (servidor HTTP)
- **MongoDB** + **Mongoose** (base de datos)
- **JWT** (autenticacion)
- **bcryptjs** (hash de contrasenas)
- **Zod** (validacion de schemas)

### Testing
- **Vitest** (test runner)
- **React Testing Library** (tests de componentes)
- **Supertest** (tests de API)
- **Cobertura:** 45/45 tests pasando (100%)

---

## Patrones de Diseno

Este proyecto implementa dos patrones de diseno fundamentales:

### 1. Factory Method
Gestiona la creacion de diferentes tipos de turnos (Simple, Express, Combo) sin acoplar el codigo del controlador a las clases concretas.

**Ventajas:**
- Extensibilidad: Facil agregar nuevos tipos de turnos
- Separacion de responsabilidades
- Open/Closed Principle

**Ubicacion:** `backend/src/factories/`

### 2. Singleton
Garantiza una unica instancia de los servicios `TurnoService` y `UsuarioService` en toda la aplicacion.

**Ventajas:**
- Consistencia de datos
- Estado centralizado
- Optimizacion de recursos

**Ubicacion:** `backend/src/service/`

---

## Capturas de Pantalla

### Inicio de Sesion
Pantalla de login con validacion de credenciales.

![Login](./src/screenshots/login.png)

---

### Registro de Usuario
Formulario de registro para clientes y barberos.

![Registro](./src/screenshots/register.png)

---

### Panel de Cliente
Vista principal para clientes con acceso a reservar turnos y ver sus turnos.

![Inicio Cliente](./src/screenshots/inicio-cliente.png)

---

### Panel de Barbero
Vista principal para barberos con acceso a ver todos los turnos.

![Inicio Barbero](./src/screenshots/inicio-barbero.png)

---

### Reservar Turno
Formulario completo para reservar un turno con validaciones en tiempo real.

![Reservar Turno](./src/screenshots/reservar-turno.png)

---

### Mis Turnos (Cliente)
Lista de turnos reservados por el cliente con opcion de cancelar.

![Mis Turnos](./src/screenshots/mis-turnos.png)

---

### Agenda del Barbero
Vista completa de todos los turnos agendados en la barberia.

![Agenda Barbero](./src/screenshots/agenda-barbero.png)

---

## Instalacion

### Requisitos Previos
- Node.js 18 o superior
- Git

**Nota:** MongoDB ya esta configurado con Atlas (cloud), no necesitas instalarlo localmente.

### Clonar el Repositorio

```bash
git clone https://github.com/GinoRobla/metodologia-sistemas-2.git
cd "Metodologias de Sistemas 2/src"
```

### Instalar Dependencias

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### Configurar Variables de Entorno

El backend incluye un archivo `.env` con MongoDB Atlas ya configurado:

```env
URL_DATABASE=mongodb+srv://Imprenta_Backend01:imprentapassword@clustermataviez.a1t0imp.mongodb.net/Peluqueria?retryWrites=true&w=majority
PORT=3000
PASSWORD_JWT=palabrasecreta
```

**IMPORTANTE:** No necesitas configurar nada. MongoDB Atlas ya esta listo para usar.

Si prefieres usar MongoDB local, modifica `URL_DATABASE` en el `.env` y asegurate de tener MongoDB corriendo localmente.

### Poblar la Base de Datos (Recomendado)

Cargar datos de prueba antes de iniciar:

```bash
cd backend
npm run seed
```

**Credenciales de prueba:**
- Barbero: `barbero@test.com` / `123456`
- Cliente: `cliente@test.com` / `123456`

---

### Ejecutar el Proyecto

Necesitaras 2 terminales:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Acceder a la Aplicacion

Abrir el navegador en: **http://localhost:5173**

---

## Documentacion

El proyecto incluye documentacion completa:

- **[Documentacion de Usuario](./DOCUMENTACION_USUARIO.md)**: Instalacion, configuracion y uso del sistema
- **[Documentacion de API](./DOCUMENTACION_API.md)**: Endpoints, parametros y ejemplos de uso
- **[Documentacion Tecnica](./DOCUMENTACION_TECNICA.md)**: Patrones de diseno, arquitectura y decisiones tecnicas

---

## Testing

### Ejecutar Tests

**Backend:**
```bash
cd backend
npm test
```

**Frontend:**
```bash
cd frontend
npm test
```

### Cobertura de Tests

```bash
# Backend
cd backend
npm run coverage

# Frontend
cd frontend
npm run coverage
```

### Resultados de Tests

```
Backend:  15/15 tests passing
Frontend: 30/30 tests passing
Total:    45/45 tests passing
```

---

## Estructura del Proyecto

```
src/
├── backend/
│   ├── src/
│   │   ├── controllers/        # Logica de negocio
│   │   ├── factories/          # Factory Method pattern
│   │   ├── middlewares/        # Autenticacion JWT
│   │   ├── models/             # Modelos Mongoose
│   │   ├── routes/             # Rutas de API
│   │   ├── schemas/            # Validaciones Zod
│   │   ├── service/            # Singleton pattern
│   │   └── config/             # Configuracion
│   └── test/                   # Tests unitarios e integracion
│
├── frontend/
│   ├── src/
│   │   ├── pages/              # Paginas principales
│   │   ├── context/            # Context API (AuthContext)
│   │   ├── services/           # Cliente API (Axios)
│   │   └── tests/              # Tests de componentes
│   └── public/
│
├── screenshots/                # Capturas de pantalla
├── DOCUMENTACION_USUARIO.md   # Doc de usuario
├── DOCUMENTACION_API.md        # Doc de API
├── DOCUMENTACION_TECNICA.md    # Doc tecnica
└── README.md                   # Este archivo
```

---

## Arquitectura

### Arquitectura de 3 Capas

```
┌─────────────────────────────────────────┐
│           FRONTEND (React)              │
│  - Componentes de UI                    │
│  - Context API (estado global)          │
│  - Rutas protegidas                     │
└──────────────┬──────────────────────────┘
               │ HTTP/REST (Axios)
┌──────────────▼──────────────────────────┐
│           BACKEND (Express)             │
├─────────────────────────────────────────┤
│  Capa de Presentacion                   │
│  - Routes                               │
│  - Middleware (verifyToken)             │
├─────────────────────────────────────────┤
│  Capa de Logica de Negocio              │
│  - Controllers                          │
│  - Services (Singleton)                 │
│  - Factories (Factory Method)           │
├─────────────────────────────────────────┤
│  Capa de Datos                          │
│  - Models (Mongoose)                    │
│  - Schemas (Zod)                        │
└──────────────┬──────────────────────────┘
               │ Mongoose
┌──────────────▼──────────────────────────┐
│           MONGODB                       │
│  - Coleccion: usuarios                  │
│  - Coleccion: turnos                    │
│  - Coleccion: counters                  │
└─────────────────────────────────────────┘
```

---

## Tipos de Turnos

| Tipo | Duracion | Precio | Servicios |
|------|----------|--------|-----------|
| **Simple** | 30 min | $500 | Personalizable (Corte o Barba) |
| **Express** | 20 min | $900 | Servicio rapido |
| **Combo** | 45 min | $700 | Corte + Barba (fijo) |

---

## Seguridad

- Contrasenas hasheadas con bcryptjs
- Autenticacion basada en JWT
- Rutas protegidas con middleware
- Validacion de datos con Zod
- Prevencion de inyeccion SQL (Mongoose)
- CORS configurado

---

## Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork del repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

---

## Licencia

Este proyecto fue desarrollado como proyecto academico para la materia Metodologias de Sistemas.

---

## Contacto

- Email: ginoroblabelleggia@gmail.com
- Email: baezavilamateo@gmail.com

---
