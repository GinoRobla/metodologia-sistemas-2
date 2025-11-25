# Documentación Técnica - Sistema de Turnos para Barbería

## Tabla de Contenidos

1. [Patrones de Diseño](#patrones-de-diseño)
   - [Factory Method](#1-factory-method)
   - [Singleton](#2-singleton)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Base de Datos](#base-de-datos)
6. [Testing](#testing)

---

## Patrones de Diseño

El sistema implementa dos patrones de diseño fundamentales que mejoran la mantenibilidad, escalabilidad y organización del código.

---

### 1. Factory Method

**Patrón Creacional**

#### ¿Por qué se utilizó?

El patrón Factory Method se implementó para gestionar la creación de diferentes tipos de turnos (Simple, Express, Combo) sin acoplar el código del controlador a las clases concretas de cada tipo. Esto permite:

- **Extensibilidad:** Agregar nuevos tipos de turnos sin modificar el código existente
- **Separación de responsabilidades:** La lógica de creación está separada de la lógica de negocio
- **Mantenibilidad:** Cambios en la creación de turnos solo afectan a las factories
- **Open/Closed Principle:** Abierto a extensión, cerrado a modificación

#### ¿Qué problema resuelve?

Sin este patrón, el controlador tendría que conocer todos los detalles de construcción de cada tipo de turno (duración, precio, servicios), resultando en código acoplado y difícil de mantener:

```typescript
// ❌ SIN Factory Method (acoplado)
if (tipo === 'Simple') {
  turno = new Turno(cliente, barbero, fecha, servicios, 30, 500)
} else if (tipo === 'Express') {
  turno = new Turno(cliente, barbero, fecha, servicios, 20, 900)
} else if (tipo === 'Combo') {
  turno = new Turno(cliente, barbero, fecha, 'Corte-Barba', 45, 700)
}
```

Con Factory Method, cada factory encapsula su lógica de creación:

```typescript
// ✅ CON Factory Method (desacoplado)
factory = new SimpleTurno()
turno = factory.crearTurno(cliente, barbero, fecha, servicios)
```

#### Implementación en el Código

**Estructura de archivos:**
```
backend/src/factories/
├── TurnoFactory.abstract.ts  ← Clase abstracta base
├── SimpleFactory.ts           ← Factory para turnos simples
├── ExpressFactory.ts          ← Factory para turnos express
└── ComboFactory.ts            ← Factory para turnos combo
```

##### Clase Abstracta Base

**Archivo:** `backend/src/factories/TurnoFactory.abstract.ts`

```typescript
import { Turno } from "./Turno";

export abstract class TurnoFactory {
    abstract crearTurno(
        cliente: string,
        barbero: string,
        fecha: string,
        servicios: string
    ): Turno
}
```

**Propósito:** Define el contrato que todas las factories concretas deben cumplir.

##### Factory Concreta - Simple

**Archivo:** `backend/src/factories/SimpleFactory.ts`

```typescript
import { Turno } from "./Turno";
import { TurnoFactory } from "./TurnoFactory.abstract";

export class SimpleTurno extends TurnoFactory {
    crearTurno(cliente: string, barbero: string, fecha: string, servicios: string): Turno {
        return new Turno(cliente, barbero, fecha, servicios, 30, 500)
        //                                                   ↑   ↑
        //                                              duración  precio
    }
}
```

**Características:**
- Duración: 30 minutos
- Precio: $500
- Servicios: Personalizables (Corte o Barba)

##### Factory Concreta - Express

**Archivo:** `backend/src/factories/ExpressFactory.ts`

```typescript
export class ExpressFactory extends TurnoFactory {
    crearTurno(cliente: string, barbero: string, fecha: string, servicios: string): Turno {
        return new Turno(cliente, barbero, fecha, servicios, 20, 900)
        //                                                   ↑   ↑
        //                                              duración  precio
    }
}
```

**Características:**
- Duración: 20 minutos
- Precio: $900
- Servicios: Personalizables (servicio rápido)

##### Factory Concreta - Combo

**Archivo:** `backend/src/factories/ComboFactory.ts`

```typescript
export class ComboFactory extends TurnoFactory {
    crearTurno(cliente: string, barbero: string, fecha: string): Turno {
        return new Turno(cliente, barbero, fecha, 'Corte-Barba', 45, 700)
        //                                        ↑              ↑   ↑
        //                                    servicios fijos  dur. precio
    }
}
```

**Características:**
- Duración: 45 minutos
- Precio: $700
- Servicios: Fijos (Corte + Barba)

#### Uso en el Controlador

**Archivo:** `backend/src/controllers/turnos.controller.ts` (líneas 94-109)

```typescript
let factory: TurnoFactory;
let turno: Turno;

switch (tipo) {
    case 'Simple':
        factory = new SimpleTurno()
        turno = factory.crearTurno(cliente, barbero, fecha, servicios)
        break
    case 'Combo':
        factory = new ComboFactory()
        turno = factory.crearTurno(cliente, barbero, fecha)
        break
    case 'Express':
        factory = new ExpressFactory()
        turno = factory.crearTurno(cliente, barbero, fecha, servicios)
        break
}
```

**Flujo:**
1. El cliente solicita un tipo de turno
2. El controlador selecciona la factory apropiada
3. La factory crea el turno con sus parámetros específicos
4. El turno se guarda en la base de datos

#### Ventajas Demostradas

**Antes (sin Factory Method):**
```typescript
// Si queremos agregar un tipo "Premium", modificamos el controlador:
if (tipo === 'Premium') {
  turno = new Turno(cliente, barbero, fecha, 'Corte-Barba-Afeitado', 60, 1200)
}
```

**Después (con Factory Method):**
```typescript
// 1. Crear nueva factory (sin tocar código existente)
export class PremiumFactory extends TurnoFactory {
    crearTurno(...): Turno {
        return new Turno(cliente, barbero, fecha, 'Corte-Barba-Afeitado', 60, 1200)
    }
}

// 2. Agregar solo un case al switch
case 'Premium':
    factory = new PremiumFactory()
    turno = factory.crearTurno(cliente, barbero, fecha)
```

**Resultado:** Extensión sin modificación masiva del código.

---

### 2. Singleton

**Patrón Creacional**

#### ¿Por qué se utilizó?

El patrón Singleton se implementó en los servicios `TurnoService` y `UsuarioService` para garantizar que exista una única instancia compartida de cada servicio en toda la aplicación. Esto es crítico porque:

- **Consistencia de datos:** Todos los componentes acceden a la misma lista de turnos/usuarios
- **Estado centralizado:** Evita múltiples instancias con datos desincronizados
- **Control de recursos:** Una sola instancia reduce el uso de memoria
- **Testing:** El método `resetInstance()` permite limpiar el estado entre tests

#### ¿Qué problema resuelve?

Sin Singleton, cada vez que se instancia un servicio se crearía una nueva lista vacía:

```typescript
// ❌ SIN Singleton
const service1 = new TurnoService()
service1.addTurno(turno1)  // service1 tiene 1 turno

const service2 = new TurnoService()
service2.getTurnoList()    // service2 tiene 0 turnos ← ¡PROBLEMA!
```

Con Singleton, todas las referencias apuntan a la misma instancia:

```typescript
// ✅ CON Singleton
const service1 = TurnoService.getInstance()
service1.addTurno(turno1)  // instancia única tiene 1 turno

const service2 = TurnoService.getInstance()
service2.getTurnoList()    // misma instancia tiene 1 turno ← ✓ CORRECTO
```

#### Implementación en el Código

##### TurnoService con Singleton

**Archivo:** `backend/src/service/TurnoService.ts`

```typescript
import { Turno } from "../factories/Turno";

export class TurnoService {
    // 1. Instancia estática privada (única)
    private static instance: TurnoService;

    // 2. Lista de turnos (compartida por todos)
    private turnosList: Turno[] = []

    // 3. Constructor privado (evita `new TurnoService()`)
    private constructor() {}

    // 4. Método estático para obtener la instancia
    public static getInstance(): TurnoService {
        if (!TurnoService.instance) {
            // Lazy initialization: se crea solo cuando se necesita
            TurnoService.instance = new TurnoService();
        }
        return TurnoService.instance;
    }

    // 5. Método para resetear (útil en tests)
    public static resetInstance(): void {
        TurnoService.instance = new TurnoService();
    }

    // Métodos del servicio...
    getSize(): number {
        return this.turnosList.length
    }

    getTurnoList(): Turno[] {
        return this.turnosList
    }

    addTurno(turnoNew: Turno): Turno {
        this.turnosList.push(turnoNew)
        return turnoNew
    }

    deleteTurno(clienteName: string): boolean {
        const idx = this.turnosList.findIndex(t => t.cliente === clienteName)
        if (idx === -1) return false
        this.turnosList.splice(idx, 1)
        return true
    }
}
```

##### UsuarioService con Singleton

**Archivo:** `backend/src/service/UsuarioService.ts`

```typescript
import { Usuario } from "../factories/Usuario";

export class UsuarioService {
    private static instance: UsuarioService;
    private usuarioList: Usuario[] = []

    private constructor() {}

    public static getInstance(): UsuarioService {
        if (!UsuarioService.instance) {
            UsuarioService.instance = new UsuarioService();
        }
        return UsuarioService.instance;
    }

    public static resetInstance(): void {
        UsuarioService.instance = new UsuarioService();
    }

    // Métodos del servicio...
    getUsuarioList(): Usuario[] {
        return this.usuarioList
    }

    getUsuarioByEmail(email: string): Usuario | undefined {
        return this.usuarioList.find(usu => usu.email === email)
    }

    addUsuario(nombre: string, email: string, telefono: string,
               contraseña: string, tipoUsuario: string): Usuario {
        const newUsu = new Usuario(nombre, email, telefono, contraseña, tipoUsuario)
        this.usuarioList.push(newUsu)
        return newUsu
    }
}
```

#### Componentes del Patrón

**1. Instancia Estática Privada:**
```typescript
private static instance: TurnoService;
```
- `static`: Pertenece a la clase, no a las instancias
- `private`: No puede ser accedida desde fuera
- Almacena la única instancia del servicio

**2. Constructor Privado:**
```typescript
private constructor() {}
```
- Previene la creación directa de instancias (`new TurnoService()`)
- Solo la clase puede instanciarse a sí misma

**3. Método getInstance():**
```typescript
public static getInstance(): TurnoService {
    if (!TurnoService.instance) {
        TurnoService.instance = new TurnoService();
    }
    return TurnoService.instance;
}
```
- **Lazy Initialization:** Crea la instancia solo cuando se solicita
- **Thread-safe en JavaScript:** JavaScript es single-threaded, no hay race conditions

**4. Método resetInstance() (para testing):**
```typescript
public static resetInstance(): void {
    TurnoService.instance = new TurnoService();
}
```
- Permite limpiar el estado entre tests
- Crea una nueva instancia fresca

#### Uso en los Tests

**Archivo:** `backend/test/unit/TurnoService.test.ts`

```typescript
import { describe, test, it, expect, beforeEach } from 'vitest'
import { TurnoService } from '../../src/service/TurnoService'

describe('Funciones de turnoService', () => {
    // Resetear antes de cada test para evitar contaminación
    beforeEach(() => {
        TurnoService.resetInstance()
    })

    it('addTurno', () => {
        const svc = TurnoService.getInstance()  // ← Obtener instancia única
        const turno = svc.addTurno(...)
        expect(svc.getSize()).toBe(1)
    })

    it('getTurnoByCliente', () => {
        const svc = TurnoService.getInstance()  // ← Misma instancia
        // Sin resetInstance(), este test vería el turno del test anterior
        expect(svc.getSize()).toBe(0)  // ✓ Limpio gracias a beforeEach
    })
})
```

#### Diagrama de Flujo

```
┌─────────────────────────────────────────┐
│  Component A solicita instancia         │
│  TurnoService.getInstance()             │
└────────────────┬────────────────────────┘
                 │
                 ▼
         ¿Existe instance?
                 │
        ┌────────┴────────┐
        │                 │
       NO                YES
        │                 │
        ▼                 ▼
  Crear nueva      Retornar existente
  instancia
        │                 │
        └────────┬────────┘
                 │
                 ▼
         ┌───────────────┐
         │   INSTANCIA   │  ← Una sola para toda la app
         │   ÚNICA       │
         └───────────────┘
                 ▲
                 │
┌────────────────┴────────────────────────┐
│  Component B solicita instancia         │
│  TurnoService.getInstance()             │
│  (recibe la MISMA instancia que A)      │
└─────────────────────────────────────────┘
```

#### Ventajas Demostradas

**Escenario: Múltiples componentes accediendo a turnos**

```typescript
// Componente 1: Crear turno
const serviceA = TurnoService.getInstance()
serviceA.addTurno(turno1)
console.log(serviceA.getSize())  // Output: 1

// Componente 2: Listar turnos
const serviceB = TurnoService.getInstance()
console.log(serviceB.getSize())  // Output: 1 ← ¡Ve el mismo turno!

// Verificar que son la misma instancia
console.log(serviceA === serviceB)  // Output: true
```

---

## Arquitectura del Sistema

### Stack Tecnológico

**Backend:**
- Node.js + TypeScript
- Express.js (servidor HTTP)
- MongoDB + Mongoose (base de datos)
- JWT (autenticación)
- Zod (validación de schemas)

**Frontend:**
- React 18 + TypeScript
- Vite (bundler)
- React Router (navegación)
- Axios (HTTP client)

**Testing:**
- Vitest (unit + integration tests)
- React Testing Library
- Supertest (API testing)

### Arquitectura de 3 Capas

```
┌─────────────────────────────────────────┐
│           FRONTEND (React)              │
│  - Componentes de UI                    │
│  - Context API (estado global)          │
│  - Rutas protegidas                     │
└──────────────┬──────────────────────────┘
               │ HTTP/REST
               │ (Axios)
┌──────────────▼──────────────────────────┐
│           BACKEND (Express)             │
├─────────────────────────────────────────┤
│  Capa de Presentación                   │
│  - Routes                               │
│  - Middleware (verifyToken)             │
├─────────────────────────────────────────┤
│  Capa de Lógica de Negocio              │
│  - Controllers                          │
│  - Services (Singleton)                 │
│  - Factories (Factory Method)           │
├─────────────────────────────────────────┤
│  Capa de Datos                          │
│  - Models (Mongoose)                    │
│  - Schemas (Zod)                        │
└──────────────┬──────────────────────────┘
               │ Mongoose
               │
┌──────────────▼──────────────────────────┐
│           MONGODB                       │
│  - Colección: usuarios                  │
│  - Colección: turnos                    │
│  - Colección: counters                  │
└─────────────────────────────────────────┘
```

---

## Estructura del Proyecto

```
src/
├── backend/
│   ├── src/
│   │   ├── controllers/        # Lógica de negocio
│   │   │   ├── turnos.controller.ts
│   │   │   └── usuarios.controller.ts
│   │   ├── factories/          # Factory Method pattern
│   │   │   ├── TurnoFactory.abstract.ts
│   │   │   ├── SimpleFactory.ts
│   │   │   ├── ExpressFactory.ts
│   │   │   └── ComboFactory.ts
│   │   ├── middlewares/        # Middleware de autenticación
│   │   │   └── verifyToken.middleware.ts
│   │   ├── models/             # Modelos Mongoose
│   │   │   ├── Turno.ts
│   │   │   ├── Usuario.ts
│   │   │   └── Counter.ts
│   │   ├── routes/             # Rutas de API
│   │   │   ├── turnos.route.ts
│   │   │   └── usuarios.route.ts
│   │   ├── schemas/            # Validaciones Zod
│   │   │   ├── turnos.schema.ts
│   │   │   └── usuarios.schema.ts
│   │   ├── service/            # Singleton pattern
│   │   │   ├── TurnoService.ts
│   │   │   └── UsuarioService.ts
│   │   ├── config/             # Configuración
│   │   │   └── database.ts
│   │   ├── app.ts              # Configuración Express
│   │   └── index.ts            # Entry point
│   └── test/                   # Tests del backend
│       ├── unit/
│       └── integration/
│
└── frontend/
    ├── src/
    │   ├── pages/              # Páginas principales
    │   │   ├── LoginPage.tsx
    │   │   ├── RegisterPage.tsx
    │   │   ├── HomePage.tsx
    │   │   ├── ReservarTurnoPage.tsx
    │   │   ├── MisTurnosPage.tsx
    │   │   └── TodosTurnosPage.tsx
    │   ├── context/            # Context API
    │   │   └── AuthContext.tsx
    │   ├── services/           # API client
    │   │   └── api.ts
    │   ├── tests/              # Tests del frontend
    │   │   ├── pages/
    │   │   └── integracion/
    │   ├── App.tsx             # Rutas principales
    │   └── main.tsx            # Entry point
    └── public/
```

---

## Base de Datos

### Colecciones

**1. usuarios**
```javascript
{
  _id: Number,            // ID autoincremental
  nombre: String,
  email: String,          // Único
  telefono: String,
  contraseña: String,     // Hasheada con bcrypt
  tipoUsuario: String,    // "Cliente" | "Barbero"
  createdAt: Date,
  updatedAt: Date
}
```

**2. turnos**
```javascript
{
  _id: Number,            // ID autoincremental
  cliente: String,
  barbero: String,
  fecha: String,          // ISO 8601
  tipo: String,           // "Simple" | "Express" | "Combo"
  servicios: String,
  duracion: Number,       // Minutos
  precio: Number,         // Pesos
  createdAt: Date,
  updatedAt: Date
}
```

**3. counters**
```javascript
{
  _id: String,            // "turnoId" | "usuarioId"
  seq: Number             // Secuencia autoincremental
}
```

---

## Testing

### Cobertura de Tests

**Backend:**
- ✅ 15/15 tests pasando
- Unit tests: TurnoService, UsuarioService, Factories
- Integration tests: Endpoints de API

**Frontend:**
- ✅ 30/30 tests pasando
- Unit tests: Componentes de página
- Integration tests: Flujos completos de usuario

### Ejecutar Tests

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test

# Con cobertura
npm run coverage
```

---

## Conclusión

El sistema implementa patrones de diseño sólidos (Factory Method y Singleton) que proporcionan:

- **Mantenibilidad:** Código organizado y fácil de entender
- **Escalabilidad:** Fácil agregar nuevos tipos de turnos o servicios
- **Testabilidad:** Tests aislados y reproducibles
- **Bajo acoplamiento:** Componentes independientes y reutilizables

La arquitectura de 3 capas separa claramente las responsabilidades, facilitando el desarrollo y mantenimiento del sistema.
