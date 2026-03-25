# Tarea 2.3 — Integración con Getnet Web Checkout

## Contexto
Este es el tercer paso de la Fase 2 del proyecto Crecer Librería Cristiana. La Tarea 2.1 creó las API Routes del catálogo y la Tarea 2.2 creó el flujo de órdenes y checkout. Ahora necesitamos integrar la pasarela de pago Getnet Web Checkout para procesar los pagos de las órdenes.

## Cómo funciona Getnet Web Checkout
Getnet usa un flujo de redirección:
1. Tu servidor crea una sesión de pago enviando los datos al API de Getnet
2. Getnet responde con un requestId y una processUrl
3. Rediriges al cliente a esa processUrl donde paga en el entorno seguro de Getnet
4. El cliente vuelve a tu returnUrl después de pagar
5. Getnet envía una notificación asíncrona (webhook) a tu servidor con el resultado
6. Tu servidor consulta el estado con getRequestInformation para confirmar

## Credenciales de prueba (Ambiente TEST)
- Endpoint: `https://checkout.test.getnet.cl`
- Login: `7ffbb7bf1f7361b1200b2e8d74e1d76f`
- SecretKey: `SnZP3D63n3I9dH9O`
- Tarjeta aprobación: Visa 4111 1111 1111 1111, CVV 123, fecha expiración futura
- Tarjeta rechazo: MasterCard 5367 6800 0000 0013, CVV 123, fecha expiración futura

## Credenciales de producción
- Endpoint: `https://checkout.getnet.cl`
- Login y SecretKey serán proporcionados por Getnet después de la validación

## Lo que necesito que hagas

### 1. Crear el módulo de integración con Getnet
- Ubicación: `src/integrations/payments/getnet/`

**config.ts:**
- Variables de entorno:
  - `GETNET_LOGIN` — login del comercio
  - `GETNET_SECRET_KEY` — secretkey del comercio
  - `GETNET_ENDPOINT` — URL base (test o producción)
  - `NEXT_PUBLIC_APP_URL` — URL base de tu app (para returnUrl y cancelUrl)
- Exportar configuración tipada con valores por defecto para test

**auth.ts:**
- Implementar la autenticación de Getnet según su especificación:
  - Generar nonce aleatorio
  - Generar seed en formato ISO 8601 (fecha actual)
  - Calcular tranKey: Base64(SHA-256(nonce + seed + secretKey))
  - Codificar nonce en Base64
  - Retornar objeto auth: { login, tranKey, nonce (base64), seed }
- Esta función se llama en cada petición a Getnet

**client.ts:**
- Funciones para comunicarse con la API de Getnet:

  - `createPaymentSession(params)` — Crea una sesión de pago (createRequest)
    - Endpoint: POST {base}/api/session/
    - Envía: auth + datos del pago (reference, description, amount, currency "CLP", buyer, returnUrl, cancelUrl, expiration, ipAddress, userAgent)
    - La expiration debe ser 15 minutos después del momento actual
    - Retorna: { requestId, processUrl, status }

  - `getPaymentStatus(requestId)` — Consulta estado de una sesión (getRequestInformation)
    - Endpoint: POST {base}/api/session/{requestId}
    - Envía: auth
    - Retorna: { status, payment (con authorization, receipt, franchise, paymentMethod, etc.) }

  - `reversePayment(internalReference)` — Reversa un pago aprobado (mismo día)
    - Endpoint: POST {base}/api/reverse
    - Envía: auth + internalReference
    - Retorna: { status, payment }

**types.ts:**
- Tipos para las requests y responses de Getnet
- GetnetPaymentSession, GetnetPaymentStatus, GetnetAuthObject, etc.
- Mapeo de estados de Getnet a estados de tu sistema:
  - APPROVED → "paid"
  - REJECTED → "cancelled" (o mantener "pending" para reintento)
  - PENDING → "pending"
  - FAILED → "cancelled"

### 2. Crear el servicio de pagos
- Ubicación: `src/features/checkout/services/payment-service.ts`

**initializePayment(orderId):**
- Busca la orden por ID
- Valida que esté en estado "pending"
- Llama a getnet.createPaymentSession() con los datos de la orden
- Guarda el requestId de Getnet en la orden (payment_reference)
- Retorna: { processUrl } para redirigir al cliente

**processPaymentResult(requestId):**
- Llama a getnet.getPaymentStatus(requestId)
- Busca la orden asociada al requestId
- Según el estado de Getnet:
  - APPROVED: actualiza orden a "paid", guarda datos del pago (authorization, receipt, paymentMethod)
  - REJECTED/FAILED: mantiene orden en "pending" o marca como "cancelled"
  - PENDING: no hace nada, espera la notificación
- Retorna: { orderNumber, status, paymentStatus }

**validateNotification(body):**
- Valida la autenticidad de la notificación de Getnet
- Verificar firma: SHA-1(requestId + status + date + secretKey) === signature
- Si es válida, procesar el resultado llamando a processPaymentResult

### 3. Crear las API Routes

`POST /api/pagos/crear-sesion`
- Body: { orderId: string }
- Valida que la orden existe y está en "pending"
- Llama a paymentService.initializePayment(orderId)
- Response: { data: { processUrl, requestId } }
- El frontend redirige al cliente a processUrl

`GET /api/pagos/retorno`
- Query params: reference (el orderNumber que enviaste en returnUrl)
- Esta es la URL a la que Getnet redirige al cliente después de pagar
- Llama a paymentService.processPaymentResult() para obtener el estado actualizado
- Redirige al cliente a la página de confirmación: /checkout/confirmacion?order={orderNumber}&status={status}

`POST /api/pagos/notificacion`
- Body: notificación de Getnet (requestId, reference, signature, status)
- Llama a paymentService.validateNotification()
- Si es válida, procesa el resultado
- Response: 200 OK (Getnet espera confirmación)
- Este endpoint DEBE responder rápido — no hacer operaciones pesadas

### 4. Agregar variables de entorno
- Agregar al `.env.local`:
  - `GETNET_LOGIN=7ffbb7bf1f7361b1200b2e8d74e1d76f`
  - `GETNET_SECRET_KEY=SnZP3D63n3I9dH9O`
  - `GETNET_ENDPOINT=https://checkout.test.getnet.cl`
  - `NEXT_PUBLIC_APP_URL=http://localhost:3000`
- Agregar al `.env.local.example` los mismos sin valores reales

### 5. Flujo completo esperado

```
1. Frontend: usuario confirma compra
2. Frontend: llama POST /api/ordenes → crea orden en estado "pending"
3. Frontend: llama POST /api/pagos/crear-sesion con el orderId
4. Frontend: recibe processUrl y redirige al usuario a Getnet
5. Usuario: paga en Getnet (o cancela)
6. Getnet: redirige al usuario a GET /api/pagos/retorno?reference=ORD-0001
7. Servidor: consulta estado en Getnet, actualiza orden
8. Servidor: redirige a /checkout/confirmacion?order=ORD-0001&status=paid
9. Getnet: (async) envía POST /api/pagos/notificacion
10. Servidor: valida firma, actualiza orden si no se actualizó en paso 7
```

## Reglas importantes
- La autenticación con Getnet requiere generar tranKey fresco en CADA petición (nonce + seed + secretkey → SHA-256 → Base64)
- El seed no puede tener más de 5 minutos de diferencia con la hora actual
- Cada transacción debe tener una reference única — usar el orderNumber
- NO capturar datos de tarjeta — Getnet maneja todo eso en su entorno seguro
- El webhook de notificación DEBE responder rápido con 200 — procesar en background si es necesario
- Siempre verificar la firma (signature) de las notificaciones de Getnet
- Implementar getRequestInformation como fallback por si el webhook no llega
- Las credenciales de producción se configuran después de la validación con Getnet
- NO crear componentes de frontend (la página de confirmación es Fase 4)
- NO modificar las API Routes de la Tarea 2.1 ni 2.2
- Usar las credenciales de TEST por defecto
