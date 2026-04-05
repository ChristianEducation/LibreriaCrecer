# Crecer Librería Cristiana — Prompt Maestro
**Versión:** 1.0 — Abril 2026  
**Este archivo no se versiona. Las reglas aquí son inmutables.**

---

## PROTOCOLO DE INICIO

Antes de escribir cualquier línea de código, confirma con este mensaje:

> "Contexto absorbido. Stack: Next.js 15 + Drizzle + Supabase + Tailwind v4. Reglas: archivos completos, sin any, soft delete, integers CLP. Esperando instrucción."

Luego lee `docs/HANDOFF-v01.md` (o la versión más reciente) para conocer el estado actual del proyecto.

---

## QUÉ ES ESTE PROYECTO

E-commerce completo para **Crecer Librería Cristiana**, una librería católica en Antofagasta, Chile. Los clientes compran como invitado (sin registro), pagan con Getnet/Webpay. El admin gestiona catálogo, pedidos y contenido del landing desde `/admin`.

**Desarrollador:** Christian Wevar (full-stack — frontend + backend + integraciones)  
**Diseñador:** Socio colaborador — entrega UI Contract en HTML

---

## REGLAS DE ENTREGA DE CÓDIGO (INNEGOCIABLE)

### 1. Archivos siempre completos
Nunca usar fragmentos. Nunca escribir `// ... existing code`, `// ... resto aquí`, `// TODO`, ni ninguna forma de código incompleto. El archivo se entrega listo para copy-paste directo.

```typescript
// ❌ NUNCA
export function MyComponent() {
  // ... existing code
  const newThing = () => { ... };
  // ... rest
}

// ✅ SIEMPRE — archivo completo, imports incluidos
import { useState } from "react";
export function MyComponent() {
  const [state, setState] = useState(false);
  const existingThing = () => { /* lógica completa */ };
  const newThing = () => { /* lógica completa */ };
  return <div>...</div>;
}
```

### 2. Para archivos largos (500+ líneas): str_replace
Si el archivo ya existe y es largo, usar `str_replace` quirúrgico en lugar de reescribir todo. Leer el archivo primero, identificar el bloque exacto a cambiar, aplicar el reemplazo mínimo necesario.

### 3. Leer antes de modificar
Siempre leer el archivo existente antes de modificarlo. Nunca asumir su contenido.

### 4. Verificar al final
Después de cualquier cambio de código, correr:
```bash
npx tsc --noEmit   # Debe pasar sin errores
npm run lint       # Debe pasar sin errores
```

---

## ARQUITECTURA — 3 CAPAS (NO ROMPER)

```
Presentación (app/ pages + features/ components)
        ↓ solo fetch a API Routes
API Routes (app/api/ — toda la lógica de negocio)
        ↓ solo llamadas a servicios
Datos / Servicios externos (integrations/)
```

**Reglas de la arquitectura:**
- Los componentes **nunca** tocan la base de datos directamente
- Los componentes **nunca** importan de `integrations/` directamente
- Las API Routes son delgadas: validan, llaman al servicio, devuelven respuesta
- La lógica pesada vive en archivos de servicio dentro de `features/`
- Una feature **nunca** importa de otra feature — solo de `shared/` e `integrations/`

**Excepción conocida:** Las páginas Server Component del catálogo llaman directamente a los servicios de Drizzle (no vía fetch) por performance. Esto está documentado y es intencional.

---

## CONVENCIONES DE CÓDIGO

### TypeScript
- Strict mode activo — `"strict": true` en tsconfig
- **Nunca usar `any`** — si el tipo es desconocido, usar `unknown` y narrowing
- Preferir tipos explícitos sobre inferencia en firmas de funciones públicas
- Nunca ignorar errores de TypeScript con `@ts-ignore` o `@ts-expect-error` sin comentario explicativo

### Nombres de archivos
```
Componentes React:     PascalCase.tsx        (ProductCard.tsx)
Servicios/utils:       kebab-case.ts         (product-service.ts)
Hooks:                 camelCase con use      (useCartHydration.ts)
Schemas Zod:           kebab-case.ts         (product-schemas.ts)
API Routes:            route.ts              (convención Next.js)
```

### Estructura de imports (orden)
```typescript
// 1. React y Next.js
import { useState } from "react";
import Link from "next/link";

// 2. Librerías externas
import { z } from "zod";

// 3. Aliases internos (@/)
import { db } from "@/integrations/drizzle/client";
import { Button } from "@/shared/ui";

// 4. Relativos
import "./styles.css";
```

### Respuesta estándar de API Routes
```typescript
// Éxito
return NextResponse.json({ data: result }, { status: 200 });

// Error de validación
return NextResponse.json({ error: "validation_error", message: "..." }, { status: 400 });

// No encontrado
return NextResponse.json({ error: "not_found", message: "..." }, { status: 404 });

// Error de servidor
return NextResponse.json({ error: "internal_error", message: "..." }, { status: 500 });
```

### Console
Solo `console.warn()` y `console.error()`. El proyecto tiene ESLint con `no-console` que bloquea `console.log`.

---

## DECISIONES TÉCNICAS FIJAS

| Decisión | Regla | Por qué |
|---|---|---|
| Precios | Siempre `integer` CLP, nunca float | Sin decimales en pesos chilenos — float causa errores de redondeo |
| Eliminación | Soft delete siempre (`is_active = false`) | Trazabilidad de pedidos — un producto eliminado puede estar en órdenes antiguas |
| Auth | `jose` para JWT, nunca `jsonwebtoken` | Edge Runtime compatibility en el middleware |
| BD queries | Drizzle ORM siempre, nunca cliente Supabase para datos | Transacciones nativas, tipado completo |
| Supabase | Solo para Storage de imágenes | El cliente Supabase no se usa para queries |
| Conexión BD | Session Pooler puerto 5432, NUNCA Transaction Pooler puerto 6543 | El Transaction Pooler causó fallos de conexión previos |
| Carrito | `addItem` siempre agrega 1 unidad | Firma del store — para más usar `updateQuantity` separado |
| TopBanner | Import directo, nunca por barrel de `shared/ui` | Arrastra Drizzle (Node.js fs) al bundle del cliente |
| Tailwind | Sin `tailwind.config.ts` — tokens en `globals.css` vía `@theme inline` | Tailwind v4 |
| Padding | `.page-px` para horizontal, `style={{}}` para valores únicos | Turbopack + Tailwind v4 no compila clases arbitrarias confiablemente |
| Login admin | `window.location.href` para redirect, nunca `router.push` + `router.refresh` | Se cancelan mutuamente en App Router |
| Stock | Se descuenta solo al pasar de `pending` a `paid` | Nunca al crear la orden |

---

## SISTEMA DE DISEÑO — RESUMEN RÁPIDO

Los tokens completos están en `docs/agentes/design-system.md`. Aquí solo lo esencial:

```css
/* Paleta principal */
--color-gold:       #c8a830   /* acento principal */
--color-moss:       #736002   /* verde oscuro — textos importantes */
--color-beige:      #f5f3e8   /* fondo del sitio */
--color-white:      #faf9f4   /* blanco cálido */
--color-text:       #3a3001   /* texto body */

/* Tipografía */
--font-serif: EB Garamond     /* headings */
--font-sans:  DM Sans         /* body */

/* Forma */
--radius: 2px                 /* border-radius en todo el sitio */
--radius-hero: 16px           /* única excepción — hero cards */
```

**Componentes compartidos disponibles en `src/shared/ui/`:**
`Button`, `Input`, `Badge`, `Navbar`, `Footer`, `CartPanel`, `Toast`, `SectionHeader`, `Separator`, `TopBanner`, `TopBannerClient`

**Componentes admin disponibles en `src/features/admin/components/`:**
`AdminSidebar`, `AdminTopbar`, `AdminTable`, `AdminStatusPill`, `AdminMetricCard`, `AdminToggle`, `AdminUploadZone`

---

## FLUJO DE TRABAJO CON ESTE PROYECTO

**Planificación y arquitectura:** Claude.ai (aquí, en este Project)  
**Ejecución de código:** Cursor (VS Code con IA integrada)

### Antes de empezar una tarea en Cursor:
1. Leer `docs/HANDOFF-v01.md` (o versión más reciente)
2. Leer `docs/agentes/CLAUDE.md`
3. Según el tipo de tarea, leer el agente correspondiente:
   - UI / componentes → `docs/agentes/frontend.md`
   - API / servicios / BD → `docs/agentes/backend.md`

### Al terminar una tarea:
1. `npx tsc --noEmit` — debe pasar
2. `npm run lint` — debe pasar
3. Probar manualmente el flujo afectado
4. Si la tarea fue grande (feature completa o bugfix importante), actualizar el handoff

---

## LO QUE NO HACER — NUNCA

- ❌ Instalar `jsonwebtoken` — usar `jose`
- ❌ Agregar `tailwind.config.ts` — Tailwind v4 usa `globals.css`
- ❌ Importar `TopBanner` desde el barrel `shared/ui/index.ts`
- ❌ Poner `paymentMethod` en `CreateOrderSchema` — es estado frontend solamente
- ❌ Pasar `quantity` a `addItem()` en el carrito
- ❌ Hacer queries a la BD desde componentes React directamente
- ❌ Usar el cliente Supabase para queries a la BD (solo para Storage)
- ❌ Eliminar registros con `delete` — siempre soft delete
- ❌ Usar `float` para precios — siempre `integer` CLP
- ❌ Usar `router.push` + `router.refresh` juntos para redirigir tras login
- ❌ Usar `console.log` — solo `console.warn` y `console.error`
- ❌ Entregar código fragmentado con `// ... existing code`
- ❌ Usar `any` en TypeScript
- ❌ Conectar al Transaction Pooler de Supabase (puerto 6543)

---

*Crecer Librería Cristiana — Master Prompt v1.0 — Abril 2026*  
*Este archivo no cambia entre versiones del handoff. Para el estado actual del proyecto, ver HANDOFF-v01.md*
