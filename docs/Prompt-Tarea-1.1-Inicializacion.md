# Tarea 1.1 — Inicialización del proyecto Crecer Librería

## Contexto
Estoy iniciando el desarrollo de una tienda online (e-commerce) para una librería católica llamada "Crecer Librería Cristiana". Este es el primer paso de un proyecto planificado en 5 fases.

## Stack definido
- Next.js 15 con App Router
- TypeScript (strict mode)
- Tailwind CSS
- Drizzle ORM (se configurará en la siguiente tarea)
- Supabase PostgreSQL + Supabase Storage
- Zustand (estado del carrito)
- Zod + React Hook Form
- TanStack Query (React Query)
- Resend (emails)
- Deploy en Vercel

## Arquitectura
- 3 capas: Presentación → API Routes (lógica de negocio) → Datos/Servicios externos
- Organización por features/dominio (NO por tipo de archivo)
- El admin vive dentro de la misma app bajo /admin
- No hay autenticación de clientes (compra como invitado)
- Auth solo para el panel admin

## Lo que necesito que hagas

1. Inicializa un proyecto Next.js con App Router y TypeScript
2. Configura Tailwind CSS
3. Configura ESLint y Prettier con reglas razonables para el proyecto
4. Crea la estructura de carpetas siguiendo la organización por features:

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

5. Crea archivos placeholder (index.ts vacíos o con exports básicos) en cada carpeta para que la estructura quede establecida
6. Configura los path aliases en tsconfig.json para imports limpios:
   - @/app/* 
   - @/features/*
   - @/shared/*
   - @/integrations/*
   - @/lib/*

## Reglas importantes
- NO instales aún Drizzle, Zustand, TanStack Query, Zod, React Hook Form ni Resend. Solo el proyecto base con Next.js, TypeScript y Tailwind. Las dependencias se agregan en sus tareas correspondientes.
- Las páginas deben tener contenido mínimo placeholder (un h1 con el nombre de la página).
- NO agregues lógica de negocio ni componentes funcionales aún.
- El objetivo es tener el esqueleto limpio y listo para construir encima.
