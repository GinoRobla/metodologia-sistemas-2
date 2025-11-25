# Documentación de API - Sistema de Turnos para Barbería

## Información General

**Base URL:** `http://localhost:3001`

**Formato de Respuestas:** JSON

**Autenticación:** JWT (JSON Web Token)

---

## Tabla de Contenidos

1. [Autenticación](#autenticación)
2. [Endpoints de Usuarios](#endpoints-de-usuarios)
3. [Endpoints de Turnos](#endpoints-de-turnos)
4. [Códigos de Estado HTTP](#códigos-de-estado-http)
5. [Ejemplos de Uso](#ejemplos-de-uso)

---

## Autenticación

La API utiliza JWT para autenticación. El token debe incluirse en el header `Authorization` de las peticiones protegidas.

### Header de Autenticación

```
Authorization: Bearer <token>
```

---

## Endpoints de Usuarios

### 1. Registrar Usuario

Crea una nueva cuenta de usuario.

**Endpoint:** `POST /usuarios/register`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "telefono": "123456789",
  "contraseña": "password123",
  "tipoUsuario": "Cliente"
}
```

**Parámetros:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| nombre | string | Sí | Nombre completo del usuario |
| email | string | Sí | Email único del usuario |
| telefono | string | Sí | Número de teléfono |
| contraseña | string | Sí | Contraseña (mínimo 6 caracteres) |
| tipoUsuario | string | Sí | "Cliente" o "Barbero" |

**Respuesta Exitosa (201):**
```json
{
  "_id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "telefono": "123456789",
  "tipoUsuario": "Cliente",
  "createdAt": "2024-01-01T10:00:00.000Z",
  "updatedAt": "2024-01-01T10:00:00.000Z"
}
```

**Errores Posibles:**
- `400`: Datos faltantes o inválidos
- `409`: Email ya registrado

---

### 2. Iniciar Sesión

Autentica un usuario y devuelve un token JWT.

**Endpoint:** `POST /usuarios/login`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "juan@example.com",
  "contraseña": "password123"
}
```

**Parámetros:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| email | string | Sí | Email del usuario |
| contraseña | string | Sí | Contraseña del usuario |

**Respuesta Exitosa (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "tipoUsuario": "Cliente"
  }
}
```

**Errores Posibles:**
- `400`: Datos faltantes
- `401`: Credenciales inválidas

---

### 3. Obtener Todos los Barberos

Obtiene la lista de usuarios con rol "Barbero".

**Endpoint:** `GET /usuarios/barberos`

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta Exitosa (200):**
```json
[
  {
    "_id": 2,
    "nombre": "Carlos Barbero",
    "email": "carlos@barberia.com",
    "telefono": "987654321",
    "tipoUsuario": "Barbero"
  },
  {
    "_id": 3,
    "nombre": "Ana López",
    "email": "ana@barberia.com",
    "telefono": "456789123",
    "tipoUsuario": "Barbero"
  }
]
```

**Errores Posibles:**
- `401`: Token inválido o expirado
- `500`: Error del servidor

---

## Endpoints de Turnos

### 1. Obtener Todos los Turnos

Obtiene la lista completa de turnos (uso para barberos/administración).

**Endpoint:** `GET /turnos`

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta Exitosa (200):**
```json
[
  {
    "_id": 1,
    "cliente": "Juan Pérez",
    "barbero": "Carlos Barbero",
    "fecha": "2024-01-15T10:00:00.000Z",
    "tipo": "Simple",
    "servicios": "Corte",
    "duracion": 30,
    "precio": 500,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
]
```

**Errores Posibles:**
- `401`: No autenticado
- `500`: Error del servidor

---

### 2. Obtener Turnos por Cliente

Obtiene los turnos de un cliente específico.

**Endpoint:** `POST /turnos/mis-turnos`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "cliente": "Juan Pérez"
}
```

**Parámetros:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| cliente | string | Sí | Nombre del cliente |

**Respuesta Exitosa (200):**
```json
[
  {
    "_id": 1,
    "cliente": "Juan Pérez",
    "barbero": "Carlos Barbero",
    "fecha": "2024-01-15T10:00:00.000Z",
    "tipo": "Combo",
    "servicios": "Corte-Barba",
    "duracion": 45,
    "precio": 700
  }
]
```

**Errores Posibles:**
- `401`: No autenticado
- `404`: Cliente no encontrado

---

### 3. Crear Turno

Crea una nueva reserva de turno.

**Endpoint:** `POST /turnos`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "tipo": "Simple",
  "cliente": "Juan Pérez",
  "barbero": "Carlos Barbero",
  "fecha": "2024-01-15T10:00:00.000Z",
  "servicios": "Corte"
}
```

**Parámetros:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| tipo | string | Sí | "Simple", "Express" o "Combo" |
| cliente | string | Sí | Nombre del cliente |
| barbero | string | Sí | Nombre del barbero |
| fecha | string | Sí | Fecha y hora en formato ISO 8601 |
| servicios | string | Condicional | Requerido para Simple y Express |

**Tipos de Turno:**

| Tipo | Duración | Precio | Servicios |
|------|----------|--------|-----------|
| Simple | 30 min | $500 | Personalizable (Corte/Barba) |
| Express | 20 min | $900 | Personalizable (servicio rápido) |
| Combo | 45 min | $700 | Corte + Barba (fijo) |

**Respuesta Exitosa (201):**
```json
{
  "_id": 5,
  "cliente": "Juan Pérez",
  "barbero": "Carlos Barbero",
  "fecha": "2024-01-15T10:00:00.000Z",
  "tipo": "Simple",
  "servicios": "Corte",
  "duracion": 30,
  "precio": 500,
  "createdAt": "2024-01-10T10:00:00.000Z",
  "updatedAt": "2024-01-10T10:00:00.000Z"
}
```

**Errores Posibles:**

| Código | Descripción |
|--------|-------------|
| 400 | Datos faltantes o formato inválido |
| 400 | Turno en el pasado |
| 400 | Fuera del horario de atención (9:00-20:00) |
| 400 | Domingo (barbería cerrada) |
| 404 | Barbero no existe |
| 409 | Barbero no disponible en ese horario |

**Validaciones Automáticas:**

1. **Fecha no en el pasado**
2. **Horario de atención:**
   - Lunes a Sábado: 9:00 AM - 8:00 PM
   - Domingos: Cerrado
3. **Barbero existe** en la base de datos
4. **Disponibilidad del barbero:**
   - Verifica que no haya solapamiento de turnos
   - Considera la duración de cada tipo de turno

---

### 4. Cancelar Turno

Elimina un turno existente.

**Endpoint:** `DELETE /turnos/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Parámetros de URL:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | number | ID del turno a cancelar |

**Respuesta Exitosa (204):**
```
No content
```

**Errores Posibles:**
- `401`: No autenticado
- `404`: Turno no encontrado
- `500`: Error al eliminar

---

## Códigos de Estado HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Solicitud exitosa |
| 201 | Created | Recurso creado exitosamente |
| 204 | No Content | Eliminación exitosa |
| 400 | Bad Request | Datos inválidos o faltantes |
| 401 | Unauthorized | No autenticado o token inválido |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Conflicto (ej: email duplicado, horario ocupado) |
| 500 | Internal Server Error | Error del servidor |

---

## Ejemplos de Uso

### Ejemplo 1: Flujo Completo de Registro y Reserva

#### 1. Registrar Usuario

```bash
curl -X POST http://localhost:3001/usuarios/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María García",
    "email": "maria@example.com",
    "telefono": "123456789",
    "contraseña": "password123",
    "tipoUsuario": "Cliente"
  }'
```

#### 2. Iniciar Sesión

```bash
curl -X POST http://localhost:3001/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@example.com",
    "contraseña": "password123"
  }'
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

#### 3. Obtener Barberos Disponibles

```bash
curl -X GET http://localhost:3001/usuarios/barberos \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 4. Crear Turno

```bash
curl -X POST http://localhost:3001/turnos \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "Combo",
    "cliente": "María García",
    "barbero": "Carlos Barbero",
    "fecha": "2024-01-15T14:00:00.000Z"
  }'
```

---

### Ejemplo 2: Uso con JavaScript/Fetch

```javascript
// 1. Login
const login = async () => {
  const response = await fetch('http://localhost:3001/usuarios/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'maria@example.com',
      contraseña: 'password123'
    })
  });

  const data = await response.json();
  const token = data.token;

  // Guardar token
  localStorage.setItem('token', token);
  return token;
};

// 2. Crear turno
const crearTurno = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch('http://localhost:3001/turnos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      tipo: 'Simple',
      cliente: 'María García',
      barbero: 'Carlos Barbero',
      fecha: '2024-01-15T10:00:00.000Z',
      servicios: 'Corte'
    })
  });

  const turno = await response.json();
  console.log('Turno creado:', turno);
};
```

---

## Notas Adicionales

### Formato de Fechas

Todas las fechas deben enviarse en formato **ISO 8601**:

```
2024-01-15T10:00:00.000Z
```

### Manejo de Errores

Todas las respuestas de error siguen el formato:

```json
{
  "error": "Descripción del error"
}
```

O para errores de validación:

```json
{
  "error": "validationError",
  "detail": "Descripción detallada"
}
```

### CORS

El servidor acepta peticiones desde:
- `http://localhost:5173` (desarrollo)
- Configurar otros orígenes en `backend/src/app.ts`

### Rate Limiting

Actualmente no hay límite de peticiones, pero se recomienda implementarlo para producción.
