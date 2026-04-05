# AGENTE: BACKEND & APIs

## Antes de escribir cualquier línea

1. Lee `docs/HANDOFF-v01.md` — estado actual del proyecto
2. Lee `docs/agentes/CLAUDE.md` — reglas globales
3. Si la tarea toca Supabase Storage → lee también `docs/agentes/supabase.md`

---

## Arquitectura de capas (no romper)

```
API Route (route.ts)
  → valida con Zod
  → llama al servicio
  → devuelve NextResponse

Servicio (features/*/services/*.ts)
  → lógica de negocio
  → llama a Drizzle o integraciones externas
  → nunca toca NextResponse

Integración (integrations/*)
  → wrapper de servicio externo (Getnet, Supabase Storage, etc.)
  → nunca tiene lógica de negocio
```

**Las API Routes son delgadas.** Si la función tiene más de ~30 líneas, la lógica va al servicio.

---

## Patrón de API Route

```typescript
// src/app/api/[recurso]/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { miServicio } from "@/features/[feature]/services/mi-servicio";

const Schema = z.object({
  campo: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = Schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Payload inválido.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const result = await miServicio(parsed.data);

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    console.error("POST /api/[recurso] failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Error inesperado." },
      { status: 500 },
    );
  }
}
```

### Respuestas estándar

```typescript
// Éxito — listado
{ data: items[], pagination?: { page, limit, total, totalPages } }  // 200

// Éxito — creación
{ data: item }  // 201

// Error de validación
{ error: "validation_error", message: "...", details: parsed.error.flatten() }  // 400

// Error de negocio conocido
{ error: "stock_insufficient", details: [...] }  // 409
{ error: "invalid_coupon", message: "..." }      // 400

// No encontrado
{ error: "not_found", message: "..." }  // 404

// Error de servidor
{ error: "internal_server_error", message: "..." }  // 500
```

---

## Patrón de Servicio con Drizzle

```typescript
// src/features/[feature]/services/mi-servicio.ts
import { and, eq, desc } from "drizzle-orm";
import { db } from "@/integrations/drizzle/client";
import { miTabla } from "@/integrations/drizzle/schema";

// ✅ Select específico — nunca select *
export async function getMiRecurso(id: string) {
  const [row] = await db
    .select({
      id: miTabla.id,
      nombre: miTabla.nombre,
      // solo los campos que necesitas
    })
    .from(miTabla)
    .where(and(eq(miTabla.id, id), eq(miTabla.isActive, true)))
    .limit(1);

  return row ?? null;
}

// ✅ Transacción atómica para operaciones multi-tabla
export async function crearConRelaciones(data: MiInput) {
  return await db.transaction(async (tx) => {
    const [principal] = await tx
      .insert(miTabla)
      .values({ ...data })
      .returning();

    await tx.insert(tablaRelacionada).values({
      principalId: principal.id,
      // ...
    });

    return principal;
  });
}

// ✅ Soft delete — nunca delete físico
export async function eliminarRecurso(id: string) {
  await db
    .update(miTabla)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(miTabla.id, id));
}
```

### Operadores Drizzle más usados en este proyecto

```typescript
import { and, or, eq, ne, ilike, inArray, isNotNull, asc, desc, count, sql } from "drizzle-orm";

// Búsqueda textual (case-insensitive)
ilike(products.title, `%${term}%`)

// Condiciones múltiples
and(eq(products.isActive, true), eq(products.inStock, true))

// Búsqueda en título Y autor
or(ilike(products.title, term), ilike(products.author, term))

// Precio efectivo (sale_price si existe, si no price)
sql<number>`coalesce(${products.salePrice}, ${products.price})`

// Paginación
.limit(limit).offset((page - 1) * limit)

// Conteo
const [{ total }] = await db.select({ total: count(tabla.id) }).from(tabla).where(where);
const totalItems = Number(total);
```

---

## Patrón de Schema Zod

```typescript
// src/features/[feature]/schemas.ts
import { z } from "zod";

export const MiSchema = z.object({
  // Strings
  nombre: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),

  // UUID
  productoId: z.string().uuid("UUID inválido"),

  // Número integer (precios en CLP)
  precio: z.number().int().min(1, "El precio debe ser mayor a 0"),

  // Enum
  metodo: z.enum(["pickup", "shipping"]),

  // Opcional
  notas: z.string().optional(),

  // Con default
  activo: z.boolean().default(true),
});

export type MiSchemaInput = z.infer<typeof MiSchema>;
```

---

## API Routes del Admin — verificación de sesión

Las rutas bajo `/api/admin/` están protegidas por el middleware. No necesitas verificar la sesión manualmente en cada route. El middleware rechaza con 401 antes de llegar al handler.

Si necesitas datos del admin logueado dentro del handler:

```typescript
import { cookies } from "next/headers";
import { verifyToken } from "@/features/admin/services/auth-service";
import { ADMIN_SESSION_COOKIE } from "@/features/admin/constants";

export async function GET() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  const session = token ? await verifyToken(token) : null;

  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // session.adminId, session.email, session.name
}
```

---

## Transiciones de estado de órdenes (validadas)

```
pending   → paid        (Getnet confirma pago)
pending   → cancelled   (cliente cancela o timeout 24h)
paid      → preparing   (admin comienza preparación)
preparing → shipped     (admin despacha — solo si delivery_method = "shipping")
preparing → delivered   (admin entrega — si es "pickup")
shipped   → delivered   (cliente recibe)
paid      → cancelled   (admin cancela con devolución)
```

**El stock se descuenta SOLO al pasar de `pending` a `paid`.** Nunca al crear la orden.

---

## Slugs — generación automática

```typescript
// src/features/admin/services/slug.ts — ya existe, usar siempre este
import { generateUniqueSlug } from "@/features/admin/services/slug";

const slug = await generateUniqueSlug(titulo, tablaTarget, db);
```

Nunca generar slugs a mano. La función maneja colisiones con sufijo numérico (-1, -2...).

---

## Getnet — reglas críticas

```typescript
// ✅ El tranKey DEBE generarse fresco en CADA request
// Ya implementado en src/integrations/payments/getnet/auth.ts — usar siempre ese módulo

// ✅ Reference única por transacción — usar orderNumber
reference: order.orderNumber  // ORD-0001

// ✅ Guard idempotente en processPaymentResult — no tocar
// Evita doble descuento de stock entre retorno y webhook
```

---

## Reglas de base de datos

- Todos los IDs son UUID — no usar auto-increment
- Todos los precios son `integer` CLP — no usar `real` ni `decimal`
- Todas las tablas tienen `createdAt` — algunas tienen `updatedAt` (actualizar en cada `update`)
- Los snapshots en `order_items` son inmutables — nunca editar `productTitle`, `unitPrice`, `sku`
- `DATABASE_URL` usa Session Pooler (puerto 5432) — no cambiar el parseo manual en `client.ts`

---

## Lo que NO hacer en este dominio

```typescript
// ❌ Select * — siempre listar campos explícitos
db.select().from(products)

// ❌ Delete físico
db.delete(products).where(eq(products.id, id))

// ❌ Float para precios
salePrice: real("sale_price")

// ❌ Lógica de negocio en la API Route
export async function POST(req) {
  // 50 líneas de lógica aquí — va al servicio
}

// ❌ Múltiples operaciones sin transacción cuando deben ser atómicas
await db.insert(orders).values(...)
await db.insert(orderItems).values(...)  // si esto falla, la orden queda huérfana
```

---

*Agente backend — Crecer Librería Cristiana — Abril 2026*
