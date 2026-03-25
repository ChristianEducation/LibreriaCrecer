# Tarea 1.4 — Configurar Zustand Store del Carrito

## Contexto
Este es el cuarto y último paso de la Fase 1 del proyecto Crecer Librería Cristiana (e-commerce de librería católica). Las tareas anteriores configuraron el proyecto base (1.1), Drizzle ORM con el esquema de BD (1.2), y Supabase Storage (1.3). Ahora necesitamos crear el store de Zustand para manejar el carrito de compras.

## Decisiones de arquitectura ya tomadas
- **Zustand** para el estado del carrito (elegido sobre React Context por su simplicidad con estado complejo)
- **Compra como invitado** — no hay cuentas de usuario, el carrito vive solo en el navegador
- **Precios en CLP** (pesos chilenos, enteros sin decimales)
- El carrito debe persistir entre recargas de página (localStorage)
- El proyecto usa la estructura por features definida en la Tarea 1.1

## Lo que necesito que hagas

### 1. Instalar Zustand
- Instalar `zustand`

### 2. Definir los tipos del carrito
- Ubicación: `src/features/carrito/types.ts`

**CartItem** — Un producto en el carrito:
| Campo | Tipo | Notas |
|-------|------|-------|
| productId | string | UUID del producto |
| title | string | Título del producto |
| slug | string | Slug del producto (para links) |
| author | string o null | Autor |
| price | number | Precio actual en CLP (usa sale_price si existe, sino price) |
| originalPrice | number o null | Precio original si tiene descuento (para mostrar tachado) |
| imageUrl | string o null | URL de la imagen principal |
| sku | string o null | SKU para referencia con VESSI |
| quantity | number | Cantidad en el carrito |

**CartSummary** — Resumen del carrito (tipo derivado, no almacenado):
| Campo | Tipo | Notas |
|-------|------|-------|
| totalItems | number | Cantidad total de productos (sumando todas las cantidades) |
| subtotal | number | Suma de (price * quantity) de cada item |
| discount | number | Monto de descuento por cupón (default 0) |
| shippingCost | number | Costo de envío (default 0, se calcula en checkout) |
| total | number | subtotal - discount + shippingCost |

### 3. Crear el store de Zustand
- Ubicación: `src/features/carrito/store.ts`

**Estado:**
| Campo | Tipo | Notas |
|-------|------|-------|
| items | CartItem[] | Los productos en el carrito |
| couponCode | string o null | Código del cupón aplicado |
| couponDiscount | number | Monto de descuento del cupón |

**Acciones:**

| Acción | Parámetros | Qué hace |
|--------|-----------|----------|
| addItem | item: CartItem (sin quantity) | Si el producto ya existe en el carrito, incrementa quantity en 1. Si no existe, lo agrega con quantity 1. |
| removeItem | productId: string | Elimina el producto del carrito completamente. |
| updateQuantity | productId: string, quantity: number | Actualiza la cantidad de un producto. Si quantity es 0 o menor, elimina el item. |
| incrementQuantity | productId: string | Incrementa la cantidad en 1. |
| decrementQuantity | productId: string | Decrementa la cantidad en 1. Si llega a 0, elimina el item. |
| clearCart | — | Vacía el carrito completo y resetea el cupón. |
| applyCoupon | code: string, discount: number | Guarda el código de cupón y el monto de descuento. |
| removeCoupon | — | Elimina el cupón aplicado y resetea el descuento a 0. |

**Getters (valores computados):**

| Getter | Retorna | Qué calcula |
|--------|---------|-------------|
| getTotalItems | number | Suma de quantity de todos los items |
| getSubtotal | number | Suma de (price * quantity) de cada item |
| getTotal | number | subtotal - couponDiscount |
| getItemCount | number | Cantidad de items distintos (no quantity, sino filas) |
| isCartEmpty | boolean | Si no hay items |
| getItemByProductId | CartItem o undefined | Busca un item por productId |

### 4. Configurar persistencia con localStorage
- Usar el middleware `persist` de Zustand para que el carrito sobreviva al cerrar/recargar el navegador
- Nombre del storage: `crecer-cart`
- Solo persistir `items`, `couponCode` y `couponDiscount` (no los getters)

### 5. Crear hooks de conveniencia
- Ubicación: `src/features/carrito/hooks.ts`
- Crear hooks que simplifiquen el uso del store en componentes:
  - `useCart()` — devuelve items y acciones principales
  - `useCartSummary()` — devuelve los valores calculados (totalItems, subtotal, total, etc.)
  - `useCartItem(productId)` — devuelve un item específico si existe en el carrito (útil para botones "agregar al carrito" que cambian a "ya en el carrito")

### 6. Crear archivo de exportación
- Ubicación: `src/features/carrito/index.ts`
- Re-exportar el store, los hooks y los tipos

## Reglas importantes
- Todo en TypeScript con tipos estrictos
- Los precios son siempre enteros en CLP (nunca usar float/decimales para dinero)
- El store es lógica pura — NO incluye componentes de UI ni llamadas a API
- La validación de stock contra el servidor se hace en el checkout (Fase 2), NO en el store del carrito
- La validación del cupón contra el servidor también se hace vía API (Fase 2), el store solo guarda el resultado
- NO crear componentes visuales del carrito (eso es Fase 4)
- NO instalar TanStack Query, React Hook Form, Zod ni otras dependencias (cada una tiene su tarea)
