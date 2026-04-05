# AGENTE RAÍZ — Crecer Librería Cristiana

## Lectura obligatoria al inicio de cada sesión

Este archivo se lee SIEMPRE. Define las reglas globales del proyecto.

1. Lee `docs/HANDOFF-v01.md` (o la versión más reciente) para conocer el estado actual
2. Lee `docs/MASTER-PROMPT.md` para las reglas inmutables
3. Según la tarea, lee el agente especializado:

| Si tocas... | Lee primero... |
|---|---|
| Componentes `.tsx`, UI, estilos | `docs/agentes/frontend.md` |
| API Routes, servicios, BD, Drizzle | `docs/agentes/backend.md` |
| Supabase Storage, imágenes | `docs/agentes/supabase.md` |

---

## Confirma con este mensaje antes de empezar

> "Contexto absorbido. Stack: Next.js 15 + Drizzle + Supabase + Tailwind v4. Esperando instrucción."

---

## Reglas globales (aplican siempre, sin excepción)

### Código
- TypeScript strict — **nunca usar `any`**
- Archivos siempre **completos** — nunca `// ... existing code`
- Leer el archivo existente **antes** de modificarlo
- Al terminar: `npx tsc --noEmit` y `npm run lint` deben pasar

### Logging
- Solo `console.warn()` y `console.error()` — ESLint bloquea `console.log`

### Eliminación de registros
- Siempre soft delete: `is_active = false` — nunca `DELETE` físico

### Precios
- Siempre `integer` CLP — nunca `float`

### Imports prohibidos
- `jsonwebtoken` → usar `jose`
- `TopBanner` desde barrel `shared/ui/index.ts` → importar directo desde `@/shared/ui/TopBanner`

---

## Arquitectura en una línea

```
Componentes → API Routes → Servicios → Drizzle → PostgreSQL
```

Los componentes **nunca** tocan la BD ni `integrations/` directamente.  
Las API Routes son delgadas — la lógica vive en `features/*/services/`.  
Una feature **nunca** importa de otra feature.

---

## Path aliases

```
@/app/*          → src/app/*
@/features/*     → src/features/*
@/shared/*       → src/shared/*
@/integrations/* → src/integrations/*
@/lib/*          → src/lib/*
```

---

## Anti-patterns críticos del proyecto

Estos errores ya ocurrieron. No repetirlos:

| ❌ No hacer | ✅ Hacer |
|---|---|
| `router.push()` + `router.refresh()` para redirigir | `window.location.href = ruta` |
| `addItem({ ...item, quantity: 3 })` | `addItem(item)` luego `updateQuantity(id, 3)` |
| Poner `paymentMethod` en `CreateOrderSchema` | Es estado frontend, no va en la orden |
| Descontar stock en `createOrder()` | Descontar solo en `processPaymentResult()` al confirmar `paid` |
| Variables `.env.local` en una sola línea | Una por línea sin excepción |
| `tailwind.config.ts` | Tokens en `globals.css` vía `@theme inline` |
| `px-5 md:px-10 lg:px-14` para padding horizontal | Usar clase `.page-px` |
| `py-*` de Tailwind en secciones | `style={{ paddingTop, paddingBottom }}` |
| fetchXxx sin `try/catch/finally` en Client Components | Siempre `finally { setLoading(false) }` — sin esto la UI queda colgada |
| `getAdminById()` sin `.catch()` en el layout | `.catch(() => null)` + redirect a login si falla |
| Pasar `DATABASE_URL` directa a `postgres()` | Parseo manual con `new URL()` — no cambiar `client.ts` |
| `max: 1` en el pool de desarrollo | `max: 3` en dev para evitar pool exhaustion con requests concurrentes |

---

*Agente raíz — Crecer Librería Cristiana — Abril 2026*
