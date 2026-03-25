# Crecer Librería Cristiana — Plan de Desarrollo

**Desarrollador:** Christian Wevar  
**Fecha:** Marzo 2026  
**Documento de planificación técnica**

---

## 1. Resumen Ejecutivo

Este documento consolida todas las decisiones de planificación técnica para el desarrollo de la tienda online de Crecer Librería Cristiana. Sirve como guía de referencia durante todo el ciclo de desarrollo del proyecto.

El proyecto consiste en un e-commerce completo que permite a los clientes explorar un catálogo de productos, agregar al carrito y realizar compras como invitado, con integración de pasarela de pago chilena y sincronización de inventario con el sistema VESSI.

### Equipo de trabajo

- **Desarrollador full-stack:** Christian Wevar — responsable del frontend, backend e integraciones.
- **Diseñador UI/UX:** Socio y colaborador — trabaja con Claude y Cursor para generar el design system y UI Contract.

### Decisiones clave

- **Arquitectura:** 3 capas con Next.js como orquestador central.
- **Modelo de compra:** Invitado (sin cuentas de usuario, sin autenticación de clientes).
- **Estrategia:** Proyecto específico para Crecer, con decisiones inteligentes reutilizables a futuro.

---

## 2. Arquitectura General

La arquitectura del proyecto se basa en un modelo de 3 capas donde Next.js actúa como el centro de todo el sistema. El frontend nunca se comunica directamente con la base de datos ni con servicios externos para operaciones de negocio.

### Capa 1 — Presentación

Es el frontend en Next.js con App Router. Incluye Server Components para páginas del catálogo (mejor SEO y carga rápida) y Client Components para las partes interactivas (carrito, filtros, checkout). Esta capa no conoce Supabase, Getnet ni VESSI. Solo consume las API Routes y muestra los datos que recibe.

### Capa 2 — Lógica de negocio (API Routes)

Es el cerebro del sistema. Los Route Handlers dentro de app/api/ reciben peticiones del frontend, ejecutan la lógica (validaciones, cálculos de precio, reglas de stock), se comunican con la base de datos vía Drizzle ORM, y se conectan con servicios externos. Si en el futuro se cambia la base de datos o la pasarela de pago, solo se modifica esta capa.

### Capa 3 — Datos y servicios externos

- **Supabase PostgreSQL:** Base de datos relacional, consultada vía Drizzle ORM (conexión directa).
- **Supabase Storage:** Almacenamiento de imágenes de productos.
- **Getnet/Webpay:** Procesamiento de pagos.
- **VESSI:** Sincronización de inventario.
- **Resend:** Envío de emails transaccionales.

### Panel Admin

El panel de administración vive dentro de la misma aplicación Next.js bajo la ruta /admin. Comparte la misma infraestructura y API Routes. Esta decisión evita duplicar esfuerzo de deployment y mantenimiento para un equipo de una persona.

---

## 3. Estructura del Proyecto

La organización del proyecto sigue un modelo por dominio/feature, donde cada módulo funcional del negocio tiene su propia carpeta con todo lo que necesita.

### Zona 1 — Rutas y páginas (app/)

Define la estructura de URLs del sitio: páginas públicas (home, catálogo, detalle de producto, carrito, checkout) y páginas de admin bajo /admin. Las páginas deben ser delgadas — solo importan componentes de las features y los ensamblan. No debe haber lógica de negocio en ninguna página.

### Zona 2 — Features (módulos de negocio)

Cada feature es un módulo autocontenido que agrupa componentes, hooks, tipos y utilidades de un dominio del negocio (catálogo, carrito, checkout, admin). La regla de oro: una feature puede importar de la zona compartida (Zona 4), pero nunca de otra feature directamente.

### Zona 3 — Capa API (app/api/)

Los Route Handlers reciben requests, llaman a servicios de lógica de negocio, y devuelven respuestas. Los archivos de ruta deben ser delgados — la lógica pesada vive en archivos de servicio separados dentro de cada feature.

### Zona 4 — Código compartido

Componentes de UI genéricos del design system (botones, inputs, modals, cards), utilidades generales (formateo de fechas, manejo de errores), tipos globales, configuración de Supabase Storage, y wrappers de servicios externos.

### Zona 5 — Integraciones externas

Cada integración (Supabase Storage, Getnet/Webpay, VESSI, Resend) tiene su propio módulo aislado que expone funciones claras hacia el proyecto pero encapsula toda la complejidad del SDK o API externa.

### Estructura de carpetas

```
src/
├── app/                          # Zona 1 — Rutas y páginas
│   ├── (store)/                  # Grupo de rutas de la tienda pública
│   │   ├── page.tsx              # Home
│   │   ├── categorias/
│   │   ├── productos/
│   │   ├── carrito/
│   │   └── checkout/
│   ├── admin/                    # Panel admin (protegido)
│   │   ├── page.tsx
│   │   ├── productos/
│   │   ├── categorias/
│   │   └── pedidos/
│   ├── api/                      # Zona 3 — API Routes
│   │   ├── productos/
│   │   ├── categorias/
│   │   ├── ordenes/
│   │   ├── pagos/
│   │   └── inventario/
│   ├── layout.tsx
│   └── globals.css
│
├── features/                     # Zona 2 — Módulos de negocio
│   ├── catalogo/                 # Componentes, hooks, tipos, servicios del catálogo
│   ├── carrito/                  # Store de Zustand, lógica del carrito
│   ├── checkout/                 # Flujo de compra
│   ├── admin/                    # Componentes y lógica del panel admin
│   └── pedidos/                  # Gestión de órdenes
│
├── shared/                       # Zona 4 — Código compartido
│   ├── ui/                       # Componentes genéricos del design system
│   ├── hooks/                    # Hooks compartidos
│   ├── types/                    # Tipos globales
│   ├── utils/                    # Utilidades generales
│   └── config/                   # Configuración global
│
├── integrations/                 # Zona 5 — Servicios externos
│   ├── supabase/                 # Cliente de Supabase (solo Storage)
│   ├── drizzle/                  # Configuración de Drizzle, esquemas, migraciones
│   ├── payments/                 # Getnet/Webpay
│   ├── inventory/                # VESSI
│   └── email/                    # Resend
│
└── lib/                          # Utilidades de infraestructura
    └── ...
```

---

## 4. Stack Tecnológico

| Componente | Tecnología / Herramienta |
|---|---|
| Framework | Next.js con App Router + TypeScript |
| Base de datos | Supabase PostgreSQL |
| ORM | Drizzle ORM (conexión directa a PostgreSQL) |
| Storage | Supabase Storage (imágenes de productos) |
| Deployment | Vercel |
| Pagos | Getnet / Webpay |
| Inventario | Integración con VESSI |
| Estado del carrito | Zustand |
| Validación | Zod |
| Formularios | React Hook Form + Zod resolver |
| Fetching dinámico | TanStack Query (React Query) |
| Emails | Resend |
| Estilos | Tailwind CSS (por confirmar con diseñador) |
| Auth | Solo admin (sin cuentas de cliente) |
| Modelo de compra | Invitado — sin registro de usuarios |

### Justificaciones clave

**Drizzle ORM sobre cliente de Supabase:** Al no utilizar Supabase Auth en este proyecto, el cliente de Supabase quedaría solo como query builder. Drizzle ofrece tipado completo de TypeScript, transacciones nativas (críticas para el checkout: crear orden + descontar stock de forma atómica), y conexión directa a PostgreSQL que es más rápida que la API REST. Supabase se mantiene exclusivamente para Storage de imágenes.

**Zustand para estado del carrito:** Es más limpio que React Context para estado complejo como un carrito con cantidades, variantes y cálculos de total. Pesa casi nada y tiene mínimo boilerplate.

**TanStack Query para fetching dinámico:** Centraliza estados de loading, error, cache y revalidación de datos. Se usa específicamente en las partes interactivas: carrito, checkout y panel admin. Las páginas del catálogo público usan Server Components con fetch nativo de Next.js.

**Resend para emails:** Servicio de emails transaccionales con integración mínima desde API Routes. Tier gratuito de 100 emails/día, más que suficiente para el inicio. Se usa para confirmación de compra y actualización de estado de pedido.

---

## 5. Flujo de Trabajo Diseñador — Desarrollador

El diseñador trabaja con Claude y Cursor, generando un UI Contract que sirve como puente formal entre diseño y desarrollo.

### UI Contract — Entregables del diseñador

El diseñador genera una carpeta ui-contract/ con los siguientes archivos:

- **screens.md:** Lista de todas las pantallas del e-commerce (Home, Categoría, Producto, Carrito, Checkout, Admin).
- **components.md:** Componentes reutilizables identificados (Navbar, Footer, ProductCard, CartItem, Button, Input, Badge, Modal, etc.).
- **layouts.md:** Layouts base del sitio (tienda, producto, checkout, admin).
- **tokens.json:** Design tokens extraídos: colores, tipografías, spacing, border radius, shadows.
- **design-rules.md:** Reglas del sistema visual para mantener consistencia.

### Acuerdos técnicos con el diseñador

- Los componentes deben ser React funcionales con TypeScript.
- No deben incluir lógica de negocio ni fetching de datos.
- Deben usar la escala de tokens definida en tokens.json.
- Confirmar si se trabaja con Tailwind CSS para alinear la entrega de tokens.

### Trabajo en paralelo

El desarrollador puede avanzar toda la infraestructura y backend sin esperar al diseñador. Cuando el UI Contract esté listo, se integran los tokens y componentes sobre un backend ya funcional.

---

## 6. Fases del Desarrollo

El desarrollo se organiza en 5 fases secuenciales donde cada una construye sobre la anterior. Las Fases 1-3 no dependen del diseñador.

### Fase 1 — Cimientos (inicio inmediato)

Infraestructura base del proyecto. Nada de lo posterior funciona si esto no está sólido.

1. **Inicialización del proyecto.** Crear repo con Next.js, App Router, TypeScript, Tailwind, estructura de carpetas por features. Configurar ESLint y Prettier.
2. **Configurar Drizzle + esquema de base de datos.** Conectar Drizzle a Supabase PostgreSQL, definir todas las tablas (productos, categorías, órdenes, items de orden, datos de comprador, estados de pedido), relaciones y migraciones iniciales.
3. **Configurar Supabase Storage.** Crear buckets para imágenes, definir políticas de acceso (público para lectura, protegido para subida desde admin).
4. **Configurar Zustand store del carrito.** Definir el store con acciones: agregar, quitar, actualizar cantidad, limpiar, calcular subtotal y total. Lógica pura sin UI.

### Fase 2 — API y lógica de negocio

Todo el backend de la tienda. Sigue sin necesitar diseño.

1. **API Routes de catálogo.** Endpoints para listar productos (con paginación), filtrar por categoría, buscar por texto, obtener detalle de producto.
2. **API Routes de órdenes y checkout.** Crear orden desde carrito + datos del comprador, validar stock, descontar stock al confirmar. Transacciones atómicas con Drizzle.
3. **Integración con Getnet/Webpay.** Flujo de pago: crear transacción, redirigir al cliente, recibir confirmación/rechazo, actualizar estado de orden. Trabajo con sandbox de pruebas.
4. **Integración con VESSI.** Sincronización de inventario según la API que VESSI exponga (pull, push o importación manual).
5. **Configurar Resend.** Templates de email para confirmación de compra y actualización de estado. Integrar envío en flujos de orden.

### Fase 3 — Panel Admin (parcialmente independiente del diseño)

Herramienta interna. Puede empezar con UI funcional básica y pulirse después.

1. **Auth del admin.** Sistema simple de login para el administrador. Middleware con credenciales de entorno o solución básica para proteger rutas /admin/*.
2. **CRUD de productos y categorías.** Crear, editar, eliminar productos con imágenes. Gestionar categorías. Formularios con React Hook Form + Zod.
3. **Gestión de pedidos.** Lista de pedidos con filtros (estado, fecha), detalle de pedido, cambio de estado. Disparo de email al cliente vía Resend al cambiar estado.

### Fase 4 — Frontend público (requiere UI Contract)

Aquí se une todo. Necesita los tokens y componentes del diseñador.

1. **Integrar design tokens y componentes base.** Configurar colores, tipografías y spacing en Tailwind según tokens.json. Montar componentes base (Button, Input, Card, etc.) en la zona compartida.
2. **Páginas del catálogo.** Home, listado por categoría, detalle de producto. Server Components consumiendo API Routes. TanStack Query para filtros dinámicos y búsqueda.
3. **Flujo de carrito y checkout.** Interfaz del carrito conectada a Zustand, formulario de checkout con React Hook Form + Zod, integración visual con Getnet/Webpay.
4. **Pulir admin con design system.** Aplicar componentes y estilos del diseñador al panel admin que ya funciona desde Fase 3.

### Fase 5 — Pulido y lanzamiento

Preparación final para producción.

1. **SEO y performance.** Metadata de páginas, Open Graph, optimización de imágenes con Next.js Image, verificar Core Web Vitals.
2. **Testing de flujos críticos.** Probar flujo completo de compra end-to-end, casos edge (stock agotado, pago rechazado, timeout de pasarela).
3. **Deploy a producción.** Configurar dominio, variables de entorno en Vercel, deploy final.

---

## 7. Decisiones Pendientes

Los siguientes puntos necesitan definición antes o durante el desarrollo:

- **Tailwind CSS:** Confirmar con el diseñador que trabaja con Tailwind para alinear la entrega de tokens y componentes.
- **Formato de entrega del diseñador:** Definir si trabaja en rama del mismo repositorio, entrega archivos aparte, o hace PRs.
- **Auth del admin:** Definir el mecanismo específico (middleware con env vars, solución simple de sesión, etc.).
- **API de VESSI:** Investigar qué tipo de integración soporta (pull, push, importación manual) para planificar la sincronización.
- **Sandbox de Getnet/Webpay:** Obtener credenciales de prueba para comenzar la integración de pagos.
