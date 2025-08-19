# 🚖 Yarvan – Plataforma de Movilidad Inteligente

Yarvan es una aplicación de transporte al estilo **Uber / InDrive**, diseñada con un enfoque en **seguridad, IA y experiencia de usuario**.  
El ecosistema incluye apps móviles (conductor y pasajero), un panel administrativo y una arquitectura de microservicios.

---

## 📱 Componentes Principales

### Apps
- **Passenger App** (Flutter)  
  Solicitud de viajes, pagos, validación biométrica para seguridad.  

- **Driver App** (Flutter)  
  Recepción de viajes, validación de pasajeros, notificaciones de **pico y placa**, alertas de matrícula/revisión, plan de ahorro dinámico.  

- **Admin Panel** (React/Next.js)  
  Gestión de usuarios, conductores, tarifas dinámicas, zonas de alta demanda y monitoreo de cumplimiento.

---

## ⚙️ Microservicios (NestJS + TypeScript)

- **api-gateway** → Punto de entrada unificado (GraphQL/REST).
- **auth** → Autenticación y biometría (huella + 1:1 facial).
- **users** → Gestión de pasajeros.
- **drivers** → Gestión de conductores y vehículos.
- **trips** → Lógica de viajes.
- **dispatch** → Asignación de conductores en tiempo real.
- **pricing** → Tarifas dinámicas y zonas de alta demanda.
- **geofence** → Control de zonas y validación de pico y placa.
- **wallet** → Billetera virtual y retenciones automáticas para ahorro.
- **compliance** → Validación de matrículas, revisión vehicular y normativa.
- **demand-engine** → Predicción de demanda con IA.
- **ml-facial** → Motor de verificación facial y biométrica.
- **notifications** → Push, SMS y correos.

---

## ☁️ Infraestructura

- **Docker + Kubernetes** → Orquestación de microservicios.  
- **PostgreSQL** → Base de datos principal.  
- **Redis** → Cache y colas de eventos.  
- **RabbitMQ / Kafka** → Mensajería entre servicios.  
- **Firebase** → Notificaciones en tiempo real y soporte móvil.  

---

## 🧠 Funcionalidades Clave

1. **Seguridad**
   - Activación de viaje con **huella digital** en el dispositivo del pasajero.  
   - Validación 1:1 facial desde la app del conductor.  

2. **Cumplimiento Legal**
   - Alertas de **pico y placa** según ubicación y horario.  
   - Recordatorio de matrícula y revisión vehicular.  

3. **Finanzas Inteligentes**
   - **Billetera virtual** para retenciones automáticas de ahorro.  
   - Plan dinámico para siempre tener fondos para matrícula/revisión.  

4. **IA**
   - Motor de demanda para detectar zonas calientes.  
   - Análisis de patrones de viaje.  
   - Verificación biométrica robusta.  

---

## 🛠️ Dependencias Clave

### Backend (NestJS)
- `@nestjs/core`, `@nestjs/common`
- `@nestjs/graphql`
- `typeorm` + `pg`
- `passport`, `passport-jwt`
- `class-validator`
- `cache-manager-redis-store`
- `socket.io`

### Frontend (Flutter + React)
- `flutter_bloc`
- `firebase_messaging`
- `google_maps_flutter`
- `dio`
- `provider`
- React 18 + Next.js (para admin)

### Infra
- `docker`
- `kubernetes`
- `redis`
- `rabbitmq`

---

## 🚀 Plan de Desarrollo

1. **Fase 1 – Backend Base**
   - Configuración de `auth`, `users`, `drivers`, `trips`, `wallet`.  
   - Integración de API Gateway.  

2. **Fase 2 – Driver App**
   - Flujo de login y registro.  
   - Recepción de viajes y validaciones de seguridad.  

3. **Fase 3 – Passenger App**
   - Solicitud de viajes, pagos y validación con huella.  

4. **Fase 4 – Admin Panel**
   - Gestión de zonas, tarifas y monitoreo.  

5. **Fase 5 – IA y Optimización**
   - Integración de motor de demanda y biometría avanzada.  

---

## 📂 Estructura de Proyecto

```
yarvan/
├── apps/
│   ├── passenger-app/
│   ├── driver-app/
│   └── admin-panel/
├── services/
│   ├── api-gateway/
│   ├── auth/
│   ├── users/
│   ├── drivers/
│   ├── trips/
│   ├── dispatch/
│   ├── pricing/
│   ├── geofence/
│   ├── wallet/
│   ├── compliance/
│   ├── demand-engine/
│   ├── ml-facial/
│   └── notifications/
├── infra/
│   ├── docker/
│   ├── k8s/
│   └── migrations/
└── packages/
```

---

## ✨ Autor
Proyecto diseñado por **Jorge Bastidas** con visión en movilidad, seguridad y finanzas inteligentes.
