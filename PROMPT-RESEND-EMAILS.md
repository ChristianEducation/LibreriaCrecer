# PROMPT — Integración Resend: email de confirmación de pedido + email de despacho

## Objetivo
Implementar envío de emails transaccionales con Resend:
1. **Email de confirmación de pedido** — se dispara cuando una orden pasa a estado `"paid"`.
2. **Email de despacho con tracking** — se dispara cuando el admin marca una orden como
   despachada y queda registrado el número de seguimiento de Chilexpress.

## Prerrequisitos (ya configurados por Christian)
- Dominio `libreriacrecer.cl` verificado en Resend (DKIM, SPF, DMARC en Vercel DNS).
- `RESEND_API_KEY` — agregar a `.env.local` para desarrollo. Christian la carga también en
  Vercel (Production) por separado.
- Dirección de envío: `pedidos@libreriacrecer.cl`.

## Archivos a leer primero
- `src/integrations/email/index.ts` (actualmente vacío, solo `export {};`)
- `src/integrations/shipping/chilexpress/client.ts` y `config.ts` (seguir el mismo patrón de
  estructura de integración: config.ts con env vars, client.ts con las funciones)
- `src/features/checkout/services/payment-service.ts`, función `processPaymentResult`
  (líneas ~148-245) — aquí se dispara el email de confirmación, justo después de que el
  `db.transaction(...)` que transiciona la orden a `"paid"` se complete con éxito (después de
  la línea 235, antes del `return` de éxito en la línea 237-244). **No enviar el email si el
  guard de "ya fue procesada" se activó** (esa rama no debe disparar email duplicado).
- `src/integrations/drizzle/schema/orders.ts` — campos disponibles: `orderNumber`, `total`,
  `subtotal`, `shippingCost`, `chilexpressTransportOrderNumber`, `chilexpressLabelUrl`, etc.
- `src/features/admin/services/order-admin-service.ts` — buscar la función que actualiza el
  estado de una orden a "despachado" o equivalente, ahí se dispara el segundo email.
- `docs/agentes/design-system.md` — para que el HTML del email use los mismos colores/tipografía
  de la marca (no necesita ser idéntico al sitio, pero sí reconocible: misma paleta).

## Paso 1 — Instalar dependencia
```bash
npm install resend
```

## Paso 2 — Cliente de Resend (`src/integrations/email/config.ts`)
Mismo patrón que `chilexpress/config.ts`: leer `RESEND_API_KEY` de env, exportar config con
default `fromAddress: "pedidos@libreriacrecer.cl"` y `fromName: "Crecer Librería Católica"`.

## Paso 3 — Templates HTML (`src/integrations/email/templates/`)
Crear dos funciones que reciben datos tipados y devuelven un string HTML completo (inline
CSS, sin dependencias externas, deben verse bien en clientes de correo como Gmail/Outlook que
no soportan CSS moderno — usar tablas HTML para el layout, no flexbox/grid).

### Template 1 — `order-confirmation.ts`
Datos necesarios: `orderNumber`, lista de items (`productTitle`, `quantity`, `unitPrice`,
`subtotal`), `subtotal`, `shippingCost`, `total`, datos de `orderCustomers` (nombre),
`orderAddresses` (dirección de despacho o "Retiro en tienda" si aplica), `deliveryMethod`.

Contenido:
- Encabezado con nombre de la tienda (texto, no requiere logo embebido por ahora).
- "¡Gracias por tu compra, {nombre}!" + número de orden destacado.
- Tabla de productos (título, cantidad, precio unitario, subtotal por línea).
- Resumen: subtotal, envío, total — total en CLP sin decimales, separador de miles.
- Dirección de despacho (si `deliveryMethod` es envío) o mensaje de retiro en tienda.
- **NO incluir bloque de tracking en este email** — el pedido recién se pagó, no se ha
  despachado. Sí puede incluir una línea breve: "Te avisaremos por este mismo correo cuando
  tu pedido sea despachado, con el número de seguimiento."
- Footer simple con datos de contacto de la librería.

### Template 2 — `order-shipped.ts`
Datos necesarios: `orderNumber`, nombre del cliente, `chilexpressTransportOrderNumber`,
`chilexpressLabelUrl` (si existe, no es obligatorio mostrarlo al cliente).

Contenido:
- "¡Tu pedido {orderNumber} está en camino!"
- Número de seguimiento Chilexpress, destacado.
- Texto explicando que puede rastrear su pedido en el sitio de Chilexpress con ese número
  (recordar: por políticas de Chilexpress no se puede armar una URL directa de tracking
  automática — solo mostrar el número para que el cliente lo busque manualmente en
  chilexpress.cl, o usar el enlace genérico a la home de tracking de Chilexpress si existe).
- Footer igual al template 1.

## Paso 4 — Función de envío (`src/integrations/email/index.ts`)
Dos funciones exportadas:
```ts
export async function sendOrderConfirmationEmail(params: {...}): Promise<void>
export async function sendOrderShippedEmail(params: {...}): Promise<void>
```
Ambas:
- Deben ser **best-effort**: si el envío de email falla (Resend caído, error de red), NO debe
  revertir ni afectar la transacción de la orden — solo loggear el error con `console.error`,
  igual que el patrón ya usado para `decrementStock` en `payment-service.ts` (try/catch que no
  re-lanza).
- Usar el SDK oficial de `resend` (`new Resend(apiKey)`, método `.emails.send(...)`).

## Paso 5 — Conectar en el flujo de pago
En `payment-service.ts`, después de que la transacción de `processPaymentResult` confirme el
pago (status "paid"), llamar a `sendOrderConfirmationEmail` con los datos de la orden. Hay que
hacer un `SELECT` adicional para traer `orderCustomers`, `orderAddresses` y `orderItems`
completos (no solo los campos que ya se seleccionan hoy), ya que el email necesita más datos
de los que la función actualmente consulta.

## Paso 6 — Conectar en el flujo de despacho (admin)
En `order-admin-service.ts`, identificar dónde se actualiza la orden con
`chilexpressTransportOrderNumber` (al generar la OT desde el admin). Después de guardar ese
dato exitosamente, llamar a `sendOrderShippedEmail`. Si no existe todavía ese flujo de
"generar OT desde el admin" (puede que aún no esté implementado, dependiendo de si
Chilexpress ya está conectado), dejar la función lista pero **no forzar su integración** —
reportarlo en el resumen final en vez de inventar un punto de conexión que no existe.

## Verificación
- `npx tsc --noEmit` y `npm run lint` limpios.
- Probar en desarrollo: hacer un pago de prueba (Getnet test) y confirmar que llega el email
  de confirmación a una dirección de prueba real.
- Revisar visualmente el HTML del email en al menos Gmail (web) — verificar que la tabla de
  productos y el total se vean bien, sin elementos rotos.

## Reglas del proyecto a respetar
- No usar `// ... existing code`, archivos completos.
- No hacer commit — Christian revisa y commitea manualmente.
- Precios siempre en CLP, enteros, sin decimales, con separador de miles.
- No reemplazar ninguna lógica existente de stock/orden — el email es estrictamente aditivo.

## Reporte final
Confirmar: archivos creados/modificados, resultado de `tsc`+`lint`, y si el Paso 6 (email de
despacho) pudo conectarse o quedó pendiente por falta de un punto de integración existente.
