# 💈 Sistema de Gestión de Turnos - Barbería

Sistema web para reservar turnos en barberías con gestión automática de notificaciones.

## 🎯 Funcionalidades

- Reservar turnos (fecha, hora, barbero, servicio)
- Login de clientes y barberos
- Notificaciones automáticas por email
- Historial de turnos
- Cancelación de turnos
- Servicios: Corte ($500), Barba ($300), Combo ($700)

## 🛠️ Tecnologías

**Frontend:** React + Vite + TypeScript  
**Backend:** Node.js + Express + TypeScript  
**Base de datos:** MongoDB  
**Autenticación:** JWT  
**Email:** Nodemailer  

---

## 🎨 Patrones de Diseño

### 1. Factory Method - Creación de Turnos

**¿Qué problema resuelve?**

El sistema necesita crear diferentes tipos de turnos con características específicas:
- **Turno Simple:** Un solo servicio (Corte O Barba) - 30 minutos
- **Turno Combo:** Dos servicios (Corte + Barba) - 45 minutos
- **Turno Express:** Servicio rápido - 20 minutos

Cada tipo tiene su propia lógica de creación (duración, servicios incluidos, validaciones).

**¿Por qué elegimos Factory Method?**

1. **Extensibilidad:** Si mañana queremos agregar "Turno VIP", solo creamos una nueva factory sin tocar el código existente (Principio Open/Closed)

2. **Centralización:** Toda la lógica de creación está en un solo lugar. Si cambia la duración del combo, se modifica solo en su factory.

3. **Mantenibilidad:** Cada tipo de turno es independiente. Testear o modificar uno no afecta a los demás.

4. **Claridad:** El código queda más limpio. En vez de tener un método gigante con muchos if/else, cada factory sabe cómo crear su turno.

**Alternativas descartadas:**
- ❌ **If/else directo:** Código difícil de mantener y extender
- ❌ **Constructor único:** Demasiados parámetros opcionales

---

### 2. Observer - Sistema de Notificaciones

**¿Qué problema resuelve?**

Cuando ocurre un evento importante (turno creado, confirmado, cancelado), el sistema necesita enviar emails automáticamente al cliente y al barbero.

**¿Por qué elegimos Observer?**

1. **Desacoplamiento:** La clase Turno no necesita saber cómo se envían los emails. Solo notifica que algo pasó y el observador se encarga del resto.

2. **Escalabilidad:** Si en el futuro queremos agregar SMS o WhatsApp, solo creamos un nuevo Observer sin modificar la clase Turno (Principio Open/Closed).

3. **Flexibilidad:** Puedo activar/desactivar el envío de emails fácilmente, útil para testing.

4. **Responsabilidad única:** El Turno maneja su lógica de negocio, el Observer maneja las notificaciones.

**Alternativas descartadas:**
- ❌ **Llamadas directas:** Turno tendría que conocer EmailService (Alto acoplamiento)
- ❌ **Callbacks:** Difícil de mantener con múltiples acciones

---

---

## 📊 Resumen de Patrones

| Patrón | Uso en el proyecto | Beneficio principal |
|--------|-------------------|---------------------|
| **Factory Method** | Crear Turno Simple/Combo/Express | Extensibilidad sin modificar código |
| **Observer** | Notificar al cliente y barbero por email | Desacoplar eventos de acciones |

---

## 📦 Instalación

### Backend
```bash
cd backend
npm install
cp .env.example .env  # Configurar MongoDB, JWT, Email
npm run dev           # Corre en http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev          # Corre en http://localhost:5173
```

---

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── factories/
│   │   └── TurnoFactory.ts      # Factory Method
│   ├── observers/
│   │   ├── Observer.ts          # Interface Observer
│   │   └── NotificadorEmail.ts  # Observer concreto
│   ├── models/
│   │   ├── Turno.ts             # Modelo + Subject (Observer)
│   │   └── Usuario.ts
│   ├── controllers/
│   │   └── turnoController.ts
│   └── routes/
│       └── turnoRoutes.ts

frontend/
├── src/
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── ReservarTurno.tsx
│   │   └── MisTurnos.tsx
│   ├── components/
│   │   └── TurnoCard.tsx
│   └── services/
│       └── api.ts               # Axios config
```

---

## 🔌 API Endpoints

```
POST   /api/auth/register     # Registrar usuario
POST   /api/auth/login        # Login
POST   /api/turnos            # Crear turno
GET    /api/turnos/mis-turnos # Ver mis turnos
PUT    /api/turnos/:id        # Confirmar/cancelar
GET    /api/barberos          # Listar barberos
```

---

## 📐 Diagrama UML

### Diagrama de Clases - Factory Method

```
┌─────────────────────┐
│   TurnoFactory      │ (Abstract)
├─────────────────────┤
│ + crearTurno()      │
└─────────────────────┘
          △
          │ (herencia)
          │
    ┌─────┴──────┬──────────────┐
    │            │              │
┌───────────┐ ┌──────────┐ ┌──────────┐
│ Simple    │ │  Combo   │ │ Express  │
│ Factory   │ │ Factory  │ │ Factory  │
├───────────┤ ├──────────┤ ├──────────┤
│+crearTurno│ │+crearTurno│ │+crearTurno│
└───────────┘ └──────────┘ └──────────┘
      │            │            │
      └────────────┴────────────┘
                   │
                   ▼
            ┌───────────┐
            │   Turno   │
            ├───────────┤
            │- cliente  │
            │- barbero  │
            │- fecha    │
            │- servicios│
            │- duracion │
            │- precio   │
            └───────────┘
```

### Diagrama de Clases - Observer

```
┌──────────────────┐         ┌──────────────────┐
│  TurnoModel      │         │   Observer       │ (Interface)
│  (Subject)       │         ├──────────────────┤
├──────────────────┤         │+ actualizar()    │
│- observadores[]  │◇────────│                  │
│+ agregarObs()    │         └──────────────────┘
│+ removerObs()    │                  △
│+ notificar()     │                  │
│+ confirmar()     │                  │
│+ cancelar()      │         ┌────────┴─────────┐
└──────────────────┘         │                  │
                        ┌────────────┐   ┌─────────────┐
                        │Notificador │   │Notificador  │
                        │  Cliente   │   │  Barbero    │
                        ├────────────┤   ├─────────────┤
                        │+actualizar()│   │+actualizar()│
                        └────────────┘   └─────────────┘
                             │                  │
                             └──────┬───────────┘
                                    │
                                    ▼
                              (Envía emails)
```

---

## 👥 Integrantes del Grupo

- **Gino Robla**
- **Mateo Avila Baez**
- **Lautaro Carrio**
- **Ramiro Gabeiras**

**Materia:** Metodologías de Sistemas II - 2025  
