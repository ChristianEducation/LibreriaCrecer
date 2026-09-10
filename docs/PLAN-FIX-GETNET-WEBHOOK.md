# Plan — Fix webhook Getnet + avisos propios a la dueña

**Estado:** tareas 1, 2, 3, 4 y 6 implementadas y verificadas localmente
(2026-09-10). Falta commit/push a producción — pendiente de confirmación.
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

### 1. Fix de la firma del webhook (causa raíz) — ✅ COMPLETO
- Archivo: `src/integrations/payments/getnet/notification.ts`
- `createHash("sha256")` → `createHash("sha1")`, largo de firma 64 → 40
  caracteres hex
- Commit `ad336cf`, desplegado y verificado en producción

### 2. CRON_SECRET en Vercel Production — ✅ COMPLETO
- Configurado en Production. Verificado: el cron pasó de 401 a 200
- Al probarlo se reconciliaron 3 pedidos reales atascados desde antes del
  fix (ORD-0040, ORD-0043, ORD-0044) — detalle completo en la memoria de
  sesión `project_fix-getnet-webhook-2026-09`. Se corrigió además un
  pedido duplicado (ORD-0041) que había quedado "paid" por error manual.

### 3. Aviso "Venta confirmada" — correo a la dueña
- Se dispara cada vez que un pedido pasa a `paid`, sin importar la vía
  (retorno del navegador, webhook ya arreglado, o cron)
- Mismo punto del código donde hoy se envía el correo de confirmación al
  cliente (`processPaymentResult()` en `payment-service.ts`)
- Contenido: cliente, producto(s), monto, modalidad de entrega, link directo
  al pedido en `admin.libreriacrecer.cl/pedidos/[id]` (si no está logueada,
  el middleware existente ya la redirige sola al login y de vuelta — no hay
  que construir nada extra para eso)
- **Destinatarios:** `crecerlibreria@gmail.com` (dueña) siempre, +
  `c.wevarh@gmail.com` (el usuario) por un tiempo, como respaldo mientras se
  confirma que el sistema nuevo funciona bien. Fácil de sacar después (un
  solo lugar donde se define la lista de destinatarios, no hardcodeado
  disperso en el código).
- **Diseño:** header dorado sólido (`#c8a830` fondo, `#3a3001` texto), sin
  musgo — mismo tratamiento que el correo al cliente (punto 6)

### 4. Aviso "Pago recibido pero no confirmado" — alerta
- Este es el que habría evitado el caso de Alejandro
- **Destinatario: solo `c.wevarh@gmail.com` (el usuario), siempre — NO a la
  dueña.** Requiere una acción técnica que ella no podría resolver.
- Se dispara en dos casos, con prioridad distinta:
  1. **Inmediato:** llega un webhook de Getnet y falla la validación de
     firma — la señal más directa, habría capturado el caso de Alejandro en
     tiempo real.
  2. **Vía cron (sin crear un cron nuevo, se extiende el existente):**
     - Señal principal: el cron intenta reconciliar un pedido `pending` y
       Getnet devuelve un error real (`payment_data_mismatch` o
       `provider_error` — hoy esto solo queda en un log que nadie revisa).
     - Señal de respaldo, más laxa: un pedido con `paymentReference` sigue
       `pending` más de **24 horas** sin error explícito ni resolución (no
       2 horas — un umbral corto genera ruido por carritos abandonados
       normales, que Getnet suele marcar como rechazados/expirados y el
       cron limpia solo en la corrida siguiente).
- Diseño: acento rojo/alerta (ya aprobado), incluye motivo, `requestId`,
  link al pedido en el panel admin.

### 6. Ajuste de diseño — correo de confirmación al cliente (ya existente)
- Archivo: `src/integrations/email/templates/order-confirmation.ts`
- Quitar el musgo (`#736002`) del header — reemplazar por dorado sólido
  (`#c8a830` fondo, `#3a3001` texto), igual que el aviso a la dueña
- Solo cambio visual, sin tocar la lógica de envío

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
