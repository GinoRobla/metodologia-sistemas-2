# Documentación de Usuario - Sistema de Turnos para Barbería

## Tabla de Contenidos
1. [Descripción](#descripción)
2. [Requisitos del Sistema](#requisitos-del-sistema)
3. [Instalación](#instalación)
4. [Configuración](#configuración)
5. [Ejecución del Proyecto](#ejecución-del-proyecto)
6. [Uso de la Aplicación](#uso-de-la-aplicación)
7. [Ejecución de Tests](#ejecución-de-tests)
8. [Solución de Problemas](#solución-de-problemas)

---

## Descripción

Sistema web para la gestión de turnos en una barbería. Permite a los clientes reservar turnos con diferentes barberos y a los barberos visualizar y gestionar sus agendas.

**Características principales:**
- Registro e inicio de sesión de usuarios (Clientes y Barberos)
- Tres tipos de turnos: Simple, Express y Combo
- Validación de horarios y disponibilidad
- Gestión de turnos para clientes
- Panel de administración para barberos

---

## Requisitos del Sistema

### Software Necesario

- **Node.js**: Versión 18 o superior
  - Descargar desde: https://nodejs.org/

- **MongoDB**: Versión 6.0 o superior
  - Descargar desde: https://www.mongodb.com/try/download/community
  - O usar MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

- **Git**: Para clonar el repositorio (opcional)
  - Descargar desde: https://git-scm.com/

### Verificar Instalaciones

Ejecutar en la terminal:

```bash
node --version    # Debe mostrar v18.x.x o superior
npm --version     # Debe mostrar 9.x.x o superior
mongo --version   # Debe mostrar versión 6.x.x o superior
```

---

## Instalación

### 1. Obtener el Proyecto

```bash
git clone https://github.com/GinoRobla/metodologia-sistemas-2.git
cd "Metodologias de Sistemas 2/src"
```

### 2. Instalar Dependencias del Backend

```bash
cd backend
npm install
```

Esto instalará todas las dependencias necesarias del servidor.

### 3. Instalar Dependencias del Frontend

```bash
cd ../frontend
npm install
```

Esto instalará todas las dependencias necesarias del cliente.

---

## Configuración

### 1. Configurar Base de Datos MongoDB

**POR DEFECTO:** El proyecto ya viene configurado con MongoDB Atlas (Cloud). No necesitas hacer nada.

#### Opción Alternativa: MongoDB Local

Si prefieres usar MongoDB local en lugar de Atlas:

1. Instalar MongoDB desde https://www.mongodb.com/try/download/community

2. Iniciar el servicio de MongoDB:

**Windows:**
```bash
net start MongoDB
```

**Linux/Mac:**
```bash
sudo systemctl start mongod
```

3. Actualizar el archivo `.env` del backend:
```env
URL_DATABASE=mongodb://localhost:27017/barberia
```

### 2. Configurar Variables de Entorno

El backend ya incluye un archivo `.env` con MongoDB Atlas configurado:

```env
URL_DATABASE=mongodb+srv://Imprenta_Backend01:imprentapassword@clustermataviez.a1t0imp.mongodb.net/Peluqueria?retryWrites=true&w=majority
PORT=3000
PASSWORD_JWT=palabrasecreta
```

**IMPORTANTE:** MongoDB Atlas ya esta configurado y listo para usar. No necesitas instalar MongoDB local.

**Alternativa (MongoDB Local):** Si prefieres usar MongoDB local, modifica `URL_DATABASE` en el archivo `.env`:
```env
URL_DATABASE=mongodb://localhost:27017/barberia
```

---

## Ejecución del Proyecto

### Paso Previo: Poblar la Base de Datos (Recomendado)

Antes de ejecutar el proyecto, puedes cargar datos de prueba:

```bash
cd backend
npm run seed
```

**Esto creará:**
- 1 barbero: Carlos Martinez
- 1 cliente: Juan Perez
- 1 turno de ejemplo (para mañana)

**Credenciales de prueba:**

**Barbero:**
- Email: `barbero@test.com`
- Password: `123456`

**Cliente:**
- Email: `cliente@test.com`
- Password: `123456`

**Nota:** El seed limpia y repobla la base de datos. Ejecutarlo solo una vez o cuando quieras resetear los datos.

---

### Opción 1: Ejecución Manual (Desarrollo)

Necesitarás **3 terminales** abiertas:

#### Terminal 1 - Backend (Servidor)

```bash
cd backend
npm run dev
```

**Resultado esperado:**
```
✅ Conectado a MongoDB
Server is running on port 3001
```

#### Terminal 2 - Frontend (Cliente)

```bash
cd frontend
npm run dev
```

**Resultado esperado:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

#### Terminal 3 - MongoDB (si es local)

Si MongoDB no está corriendo como servicio, iniciarlo:

```bash
mongod
```

### Opción 2: Ejecución en Producción

#### Backend:

```bash
cd backend
npm run build
npm start
```

#### Frontend:

```bash
cd frontend
npm run build
npm run preview
```

---

## Uso de la Aplicación

### 1. Acceder a la Aplicación

Abrir el navegador en: **http://localhost:5173**

### 2. Registro de Usuario

1. Hacer clic en "¿No tenés cuenta? Registrate acá"
2. Completar el formulario:
   - Nombre completo
   - Email
   - Teléfono
   - Contraseña
   - Tipo de usuario: Cliente o Barbero
3. Hacer clic en "Registrarse"

### 3. Inicio de Sesión

1. Ingresar email y contraseña
2. Hacer clic en "Iniciar Sesión"

### 4. Funcionalidades según Tipo de Usuario

#### Como Cliente:

**Reservar Turno:**
1. Desde el panel principal, hacer clic en "Reservar Turno"
2. Seleccionar tipo de turno:
   - **Simple** (30 min, $500): Corte o Barba
   - **Express** (20 min, $900): Servicio rápido
   - **Combo** (45 min, $700): Corte + Barba
3. Seleccionar barbero
4. Elegir fecha y hora
5. Si es Simple o Express, especificar el servicio
6. Hacer clic en "Reservar Turno"

**Ver Mis Turnos:**
1. Hacer clic en "Mis Turnos"
2. Ver lista de turnos reservados
3. Cancelar turnos si es necesario

#### Como Barbero:

**Ver Todos los Turnos:**
1. Desde el panel principal, hacer clic en "Ver Todos los Turnos"
2. Ver lista completa de turnos agendados
3. Visualizar información de cada turno:
   - Cliente
   - Fecha y hora
   - Tipo de servicio
   - Duración
   - Precio

### 5. Cerrar Sesión

Hacer clic en el botón "Cerrar Sesión" en la esquina superior derecha.

---

## Ejecución de Tests

### Tests del Backend

```bash
cd backend
npm test
```

**Cobertura de tests:**
```bash
npm run coverage
```

### Tests del Frontend

```bash
cd frontend
npm test
```

**Tests en modo interactivo:**
```bash
npm test -- --ui
```

---

## Solución de Problemas

### Error: "Cannot connect to MongoDB"

**Solución:**
1. Verificar que MongoDB esté corriendo:
   ```bash
   # Windows
   net start MongoDB

   # Linux/Mac
   sudo systemctl status mongod
   ```
2. Verificar la URI en el archivo `.env`
3. Si usas MongoDB Atlas, verificar que tu IP esté en la whitelist

### Error: "Port 3001 is already in use"

**Solución:**
1. Cerrar cualquier proceso usando el puerto 3001
2. O cambiar el puerto en `.env`:
   ```env
   PORT=3002
   ```

### Error: "CORS blocked"

**Solución:**
- Verificar que el frontend esté accediendo a `http://localhost:3001`
- El backend ya tiene CORS configurado para `http://localhost:5173`

### Error: "Module not found"

**Solución:**
1. Eliminar node_modules y reinstalar:
   ```bash
   rm -rf node_modules
   npm install
   ```

### Error: "JWT token invalid"

**Solución:**
1. Cerrar sesión y volver a iniciar
2. Verificar que `JWT_SECRET` sea el mismo en `.env`
3. Limpiar localStorage del navegador:
   - F12 > Application > Local Storage > Clear

### La aplicación se ve sin estilos

**Solución:**
1. Verificar que el frontend esté corriendo en modo desarrollo
2. Limpiar caché del navegador (Ctrl + Shift + R)
3. Verificar que los archivos CSS existan en `frontend/src/pages/css/`

---

## Contacto

Para reportar problemas o consultas:
- Email: ginoroblabelleggia@gmail.com
- Crear un issue en el repositorio del proyecto

---

## Horarios de Atención de la Barbería

- **Días:** Lunes a Sábado
- **Horario:** 9:00 AM - 8:00 PM
- **Cerrado:** Domingos

**Nota:** El sistema validará automáticamente que los turnos estén dentro del horario de atención.
