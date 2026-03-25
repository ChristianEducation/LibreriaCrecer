# Tarea 3.3 — Gestión de Pedidos (Admin)

## Contexto
Este es el tercer paso de la Fase 3 del proyecto Crecer Librería Cristiana. La Tarea 3.1 configuró la autenticación y la Tarea 3.2 creó el CRUD de productos y categorías. Ahora necesitamos que la administradora pueda ver y gestionar los pedidos de la tienda.

## Decisiones de arquitectura ya tomadas
- Los pedidos se crean desde el checkout público (Tarea 2.2) — aquí solo se consultan y gestionan
- Las transiciones de estado son validadas (definidas en Tarea 2.2)
- Los estados posibles son: pending, paid, preparing, shipped, delivered, cancelled
- El método de entrega puede ser "pickup" (retiro en tienda) o "shipping" (despacho)
- La integración con Resend para emails al cambiar estado se hará en una tarea posterior

## Lo que necesito que hagas

### 1. Crear servicios del admin para pedidos
- Ubicación: `src/features/admin/services/order-admin-service.ts`

**getOrdersAdmin(params):**
- Lista pedidos con filtros y paginación
- Parámetros: page, limit, status (opcional), deliveryMethod (opcional), search (buscar por orderNumber o email del cliente), dateFrom (opcional), dateTo (opcional), sortBy (newest, oldest, total_asc, total_desc)
- Retorna: pedidos con datos del cliente (nombre, email), total, estado, fecha, método de entrega
- Ordenados por fecha descendente por defecto

**getOrderDetailAdmin(orderId):**
- Detalle completo de un pedido para el admin
- Incluir: datos de la orden, todos los items con sus snapshots, datos del cliente, dirección de envío (si existe), información del cupón usado (si existe), historial de pago
- Retorna: orden completa

**updateOrderStatusAdmin(orderId, newStatus, adminNotes?):**
- Usa orderService.updateOrderStatus() de la Tarea 2.2
- Registra las notas del admin si las hay
- Retorna: orden actualizada

**getOrderStats():**
- Estadísticas básicas para el dashboard:
  - Total de pedidos por estado (cuántos pending, paid, preparing, etc.)
  - Total de ventas del día (suma de totales de pedidos con status paid, preparing, shipped, delivered)
  - Total de pedidos del mes
- Retorna: objeto con las estadísticas

### 2. Crear API Routes del admin para pedidos

`GET /api/admin/pedidos`
- Query params: page, limit, status, deliveryMethod, search, dateFrom, dateTo, sortBy
- Response: { data: orders[], pagination }

`GET /api/admin/pedidos/[id]`
- Response: { data: orderDetail }

`PUT /api/admin/pedidos/[id]/estado`
- Body: { status: string, adminNotes?: string }
- Validar transición de estado
- Response: { data: order }

`GET /api/admin/pedidos/stats`
- Response: { data: stats }

### 3. Crear páginas del admin

**Listado de pedidos:** `src/app/admin/pedidos/page.tsx`
- Tabla con columnas: Nº orden, fecha, cliente (nombre), email, método entrega, total (CLP formateado), estado (con badge de color), acciones
- Colores de badge por estado:
  - pending: amarillo
  - paid: verde
  - preparing: azul
  - shipped: morado
  - delivered: gris/verde oscuro
  - cancelled: rojo
- Filtros:
  - Por estado (select o tabs)
  - Por método de entrega (pickup/shipping)
  - Por fecha (desde/hasta)
  - Búsqueda por número de orden o email
- Paginación
- Click en una fila o botón "Ver" lleva al detalle

**Detalle de pedido:** `src/app/admin/pedidos/[id]/page.tsx`
- Sección superior: Nº orden, fecha, estado actual con badge
- Sección de cliente: nombre completo, email, teléfono
- Sección de dirección (solo si es shipping): dirección completa formateada
- Sección de items: tabla con título, SKU, precio unitario, cantidad, subtotal
- Sección de totales: subtotal, descuento (si hay cupón, mostrar código), costo envío, total
- Sección de pago: método de pago, referencia de pago
- Sección de notas del admin: textarea para agregar notas
- Cambio de estado: select o botones con los estados válidos desde el estado actual
  - Mostrar solo las transiciones válidas
  - Confirmar antes de cambiar
- Botón para volver al listado

**Actualizar dashboard:** `src/app/admin/page.tsx`
- Agregar cards con estadísticas reales:
  - Pedidos pendientes (count)
  - Pedidos pagados hoy (count)
  - Ventas del día (monto en CLP)
  - Pedidos del mes (count)
- Links rápidos a las secciones

### 4. Formateo de datos
- Los precios deben mostrarse formateados: $12.500 (con punto como separador de miles, sin decimales)
- Las fechas deben mostrarse en formato chileno: dd/mm/yyyy HH:mm
- Crear helpers de formateo si no existen:
  - `formatCLP(amount)` → "$12.500"
  - `formatDate(date)` → "14/03/2026 15:30"
- Ubicación: `src/shared/utils/formatters.ts`

### 5. UI funcional
- Mismos estándares de UI que la Tarea 3.2
- Los badges de estado deben ser visualmente claros (colores distintivos)
- El detalle del pedido debe ser una vista completa, no un modal
- Las transiciones de estado deben tener confirmación (modal simple o confirm)
- Loading states en todas las acciones

## Reglas importantes
- El admin NO puede crear pedidos manualmente — los pedidos solo se crean desde el checkout
- El admin NO puede editar items ni precios de un pedido — los snapshots son inmutables
- Las transiciones de estado deben respetarse (no saltar de pending a delivered)
- Los datos del cliente son de solo lectura en el admin
- NO integrar envío de emails aún (eso será con Resend en tarea posterior)
- NO crear gestión del landing (eso es Tarea 3.4)
- NO modificar las API Routes públicas de la Fase 2
