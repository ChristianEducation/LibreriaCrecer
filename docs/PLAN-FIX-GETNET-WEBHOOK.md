# Plan — Fix webhook Getnet + avisos propios a la dueña

**Estado:** pendiente de aprobación — no se ha tocado código todavía.
**Fecha del diagnóstico:** 2026-09-08

## Por qué estamos haciendo esto

El pedido ORD-0044 (Alejandro, $26.900) quedó "pending" en el sistema pese a que
el cliente sí pagó — el comprobante que nos compartió muestra el pago aprobado
a las 14:06:42, el mismo segundo en que nuestro servidor recibió y rechazó el
webhook de Getnet (14:06:44). Getnet cobró y notificó bien; el error fue 100%
nuestro.

Causa raíz confirmada contra el manual oficial de Getnet (Web Checkout API,
v2.1 y v2.3): la firma de la notificación asíncrona se calcula con
`SHA-1(requestId + status + date + secretKey)`, pero nuestro código en
`src/integrations/payments/getnet/notification.ts` usa `SHA-256` y además
exige que la firma recibida tenga 64 caracteres hex (formato SHA-256) cuando
una firma real de Getnet tiene 40 (SHA-1). Como no coincide ni en longitud, el
webhook se rechaza automáticamente, siempre — no fue un caso puntual de
ORD-0043/ORD-0044, es estructural y afecta el 100% de los webhooks desde que
existe esta validación.

Los pedidos que sí llegaron a "paid" (ORD-0039, 0041, 0042) lo lograron porque
el cliente completó el regreso normal al navegador (`/api/pagos/retorno`),
camino que no depende de esta firma.

Segunda falla que agravó el problema: `CRON_SECRET` no está configurado en
Vercel Production, así que el cron horario de reconciliación
(`/api/cron/limpiar-pendientes`) devuelve 401 en todas sus ejecuciones — la
red de seguridad tampoco estaba funcionando.

Verificado en el código actual (2026-09-09): el bug sigue sin corregir.

## Las 4 tareas

### 1. Fix de la firma del webhook (causa raíz)
- Archivo: `src/integrations/payments/getnet/notification.ts`
- Cambiar `createHash("sha256")` → `createHash("sha1")` (líneas ~82-84)
- Ajustar la validación de largo de la firma recibida: regex de 64 a 40
  caracteres hex (línea ~44)
- Sin esto, todo lo demás es un parche — es el fix que soluciona el problema
  de fondo.

### 2. Configurar CRON_SECRET en Vercel Production
- Generar un secreto nuevo y agregarlo como env var en Vercel (Production)
- Acción sobre producción → requiere confirmación explícita antes de
  aplicarla
- Activa la red de seguridad: el cron de reconciliación empieza a poder
  corregir pedidos que quedaron mal sincronizados

### 3. Aviso "Venta confirmada" — correo a la dueña
- Se dispara cada vez que un pedido pasa a `paid`, sin importar la vía
  (retorno del navegador, webhook ya arreglado, o cron)
- Mismo punto del código donde hoy se envía el correo de confirmación al
  cliente (`processPaymentResult()` en `payment-service.ts`)
- Contenido: cliente, productos, monto, modalidad de entrega
- Hoy no existe ningún correo a la dueña — solo le llega al cliente
- **Destinatarios:** la dueña siempre, + `c.wevarh@gmail.com` (el usuario) por
  un tiempo, como respaldo mientras se confirma que el sistema nuevo funciona
  bien. Fácil de sacar después (un solo lugar donde se define la lista de
  destinatarios, no hardcodeado disperso en el código).

### 4. Aviso "Pago recibido pero no confirmado" — alerta
- Este es el que habría evitado el caso de Alejandro
- Se dispara cuando:
  - Llega un webhook de Getnet y falla la validación de firma, o
  - Un pedido con sesión de pago iniciada (`paymentReference`) lleva más de
    1-2 horas en `pending` sin resolverse (probablemente extendiendo el cron
    existente)
- **Destinatario: solo `c.wevarh@gmail.com` (el usuario), siempre — NO a la
  dueña.** Requiere una acción técnica (revisar webhook/portal de Getnet) que
  ella no podría resolver; mandárselo solo la alarmaría sin darle nada
  accionable.

## Tarea 5 — NO incluida
Reconciliar manualmente pedidos "pending" que ya estén pagados. La dueña
confirma que no hay pedidos pendientes de reconciliar en este momento — lo
hará ella misma a mano si aparece algún caso.

## Orden de implementación
1. Fix SHA-1 (notification.ts)
2. CRON_SECRET en Vercel
3. Aviso "Venta confirmada"
4. Aviso "Pago no reconciliado"

## Verificación antes de dar por cerrado
- `npx tsc --noEmit` y `npm run lint` sin errores
- Probar un pago completo en TEST (Visa 4111 1111 1111 1111) y confirmar que
  el webhook se valida correctamente
- Confirmar que ambos correos nuevos llegan a la dueña en un pedido de prueba
- No hacer commit/push hasta verificación completa y aprobación explícita
