# Tarea 2.2 — API Routes de Órdenes y Checkout

## Contexto
Este es el segundo paso de la Fase 2 del proyecto Crecer Librería Cristiana. La Tarea 2.1 creó las API Routes de lectura para el catálogo y landing. Ahora necesitamos crear los endpoints que manejan el flujo de compra: crear órdenes, validar stock, y gestionar estados de pedidos.

## Decisiones de arquitectura ya tomadas
- Compra como invitado — no hay cuentas de usuario
- Los datos del comprador (nombre, email, teléfono) se capturan en el checkout
- La dirección de despacho solo se requiere si el método de entrega es "shipping" (no para "pickup")
- Los precios se guardan como snapshot al momento de la compra (no cambian si se edita el producto después)
- El SKU también se guarda como snapshot para la sincronización con VESSI
- Las transacciones de Drizzle se usan para operaciones atómicas (crear orden + descontar stock)
- Los cupones se validan contra la tabla coupons antes de aplicar el descuento

## Lo que necesito que hagas

### 1. Crear la capa de servicios de órdenes
- Ubicación: `src/features/checkout/services/`

**order-service.ts:**

- `createOrder(data)` — Crea una orden completa en una transacción atómica
  - Recibe: items del carrito, datos del cliente, dirección (opcional), método de entrega, cupón (opcional)
  - Dentro de una transacción de Drizzle debe:
    1. Validar que todos los productos existen, están activos y tienen stock suficiente
    2. Si hay cupón, validar que existe, está activo, no ha expirado, no excedió usos máximos, y el monto mínimo se cumple
    3. Generar número de orden legible (formato: "ORD-XXXX" incremental)
    4. Crear el registro en orders con subtotal, descuento, costo de envío y total calculados
    5. Crear los registros en order_items con snapshots de título, precio y SKU
    6. Crear el registro en order_customers con datos del comprador
    7. Si método es "shipping", crear el registro en order_addresses
    8. Descontar stock_quantity de cada producto
    9. Si hay cupón, incrementar current_uses del cupón
  - Si cualquier paso falla, la transacción se revierte completa
  - Retorna: la orden creada con su número y estado

- `getOrderByNumber(orderNumber)` — Consulta una orden por su número legible
  - Incluir: items, datos del cliente, dirección (si existe), estado actual
  - Retorna: orden completa o null

- `getOrderById(id)` — Consulta una orden por UUID
  - Mismo que getOrderByNumber pero busca por id

- `updateOrderStatus(orderId, status, adminNotes?)` — Actualiza el estado de un pedido
  - Valida que la transición de estado sea válida (ej: no puedes ir de "delivered" a "pending")
  - Retorna: orden actualizada

- `updatePaymentInfo(orderId, paymentMethod, paymentReference)` — Registra info del pago
  - Se llama cuando Getnet confirma el pago
  - Actualiza payment_method, payment_reference, y cambia status a "paid"

**coupon-service.ts:**

- `validateCoupon(code, subtotal)` — Valida un cupón
  - Verificar: existe, is_active, no expirado, no excedió max_uses, subtotal >= min_purchase_amount
  - Calcular el descuento: si es percentage → (subtotal * discount_value / 100), si es fixed → discount_value
  - El descuento nunca puede ser mayor que el subtotal
  - Retorna: { valid: boolean, discount: number, error?: string }

**stock-service.ts:**

- `validateStock(items)` — Valida stock de múltiples productos
  - Recibe array de { productId, quantity }
  - Retorna: { valid: boolean, errors: [{ productId, requested, available }] }

- `decrementStock(items)` — Descuenta stock (se usa dentro de la transacción)
  - No debe usarse fuera de una transacción

### 2. Definir esquemas de validación con Zod
- Ubicación: `src/features/checkout/schemas.ts`
- Instalar `zod` si no está instalado

**CreateOrderSchema:**
```
{
  items: [{ productId: uuid, quantity: number (min 1) }]  // mínimo 1 item
  customer: {
    firstName: string (min 2),
    lastName: string (min 2),
    email: string (email válido),
    phone: string (min 8)
  }
  deliveryMethod: "pickup" | "shipping"
  address: {  // requerido solo si deliveryMethod es "shipping"
    street: string,
    number: string,
    apartment: string (opcional),
    commune: string,
    city: string,
    region: string,
    zipCode: string (opcional),
    deliveryInstructions: string (opcional)
  }
  couponCode: string (opcional)
}
```

**ValidateCouponSchema:**
```
{
  code: string,
  subtotal: number (min 1)
}
```

### 3. Crear las API Routes

**Órdenes:**

`POST /api/ordenes`
- Body: CreateOrderSchema
- Validar con Zod antes de procesar
- Llama a orderService.createOrder()
- Response exitosa (201): { data: { orderNumber, orderId, total, status } }
- Response error stock (409): { error: "stock_insufficient", details: [...] }
- Response error cupón (400): { error: "invalid_coupon", message: "..." }

`GET /api/ordenes/[orderNumber]`
- Consulta orden por número legible (ej: ORD-0001)
- Llama a orderService.getOrderByNumber()
- Response: { data: order } o 404

**Cupones:**

`POST /api/cupones/validar`
- Body: ValidateCouponSchema
- Llama a couponService.validateCoupon()
- Response: { data: { valid, discount, couponCode } }

**Stock:**

`POST /api/stock/validar`
- Body: { items: [{ productId, quantity }] }
- Llama a stockService.validateStock()
- Response: { data: { valid, errors? } }

### 4. Definir transiciones de estado válidas
```
pending → paid (pago confirmado por Getnet)
pending → cancelled (cliente cancela o timeout)
paid → preparing (admin comienza a preparar)
preparing → shipped (admin despacha, solo si delivery_method = "shipping")
preparing → delivered (admin entrega, si es "pickup")
shipped → delivered (cliente recibe)
paid → cancelled (admin cancela con devolución)
```

### 5. Definir tipos
- Ubicación: `src/features/checkout/types.ts`
- Tipos para las respuestas de cada endpoint
- Tipos para los parámetros de los servicios

## Reglas importantes
- La creación de orden DEBE ser una transacción atómica — si falla cualquier paso, TODO se revierte
- Los snapshots en order_items son obligatorios (product_title, unit_price, sku) — guardan el valor al momento de la compra
- Los precios son siempre enteros en CLP — nunca usar float para cálculos de dinero
- El número de orden (ORD-XXXX) debe ser único y secuencial
- La validación de stock se hace DENTRO de la transacción para evitar race conditions
- El endpoint POST /api/ordenes NO procesa el pago — solo crea la orden en estado "pending". El pago se maneja en la Tarea 2.3
- NO crear endpoints de admin (listar todas las órdenes, cambiar estado) — eso es Fase 3
- NO crear componentes de frontend
- NO modificar los esquemas de Drizzle existentes
