# SPEC — Venta web selectiva por producto, consulta por WhatsApp y métricas reales

## Instrucción para el agente implementador

Implementar este spec completo de principio a fin. Las decisiones de arquitectura, nombres y comportamiento ya están cerradas. No volver a diseñar la solución ni sustituirla por otra.

Antes de modificar código, leer completos:

1. `CLAUDE.md` de la raíz.
2. `docs/agentes/frontend.md`.
3. `docs/agentes/backend.md`.
4. `docs/agentes/design-system.md`.
5. Todos los archivos enumerados en la sección **Archivos que se deben revisar**.

Reglas operativas:

- No borrar productos.
- No modificar stock, precio, `sale_price`, `is_active`, SKU, slug, imágenes ni categorías durante la migración.
- No reutilizar `is_active` ni `in_stock` como control de venta web.
- Todas las queries deben usar Drizzle ORM.
- Supabase Client se usa únicamente para Storage.
- No usar `drizzle-kit push`.
- Generar la migración SQL y aplicarla manualmente en Supabase SQL Editor con **Run without RLS**, siguiendo la regla R13 del proyecto.
- Antes de aplicar la migración, crear un respaldo verificable de `products`.
- No hacer commit ni push salvo petición explícita posterior.
- No preguntar por decisiones descritas en este documento.

---

# 1. Objetivo funcional

Durante la revisión del inventario, la tienda seguirá visible y operativa:

- Los productos confirmados podrán comprarse normalmente.
- Los productos no confirmados mostrarán **Consultar stock por WhatsApp**.
- La administradora podrá habilitar o deshabilitar la venta web directamente desde cada fila de `/admin/productos`.
- La administradora podrá habilitar o poner en consulta todo el catálogo desde un control masivo junto a `Nuevo producto`.
- El backend impedirá comprar productos no habilitados aunque se intente llamar directamente a las API.

Cuando el inventario esté completamente conciliado, la administradora podrá ejecutar **Habilitar venta en todos**.

El segundo objetivo es corregir las tarjetas KPI de `/admin/productos`, que actualmente calculan cifras usando solo los 20 productos cargados en la página visible.

---

# 2. Decisiones de dominio

## 2.1 Campo nuevo

Agregar a `products`:

```text
online_sale_enabled boolean NOT NULL DEFAULT false
```

En Drizzle:

```typescript
onlineSaleEnabled: boolean("online_sale_enabled").default(false).notNull()
```

Significado:

- `true`: el producto puede venderse por ecommerce si además está activo y tiene stock.
- `false`: el producto permanece visible, pero su CTA será consulta por WhatsApp.

El campo controla únicamente ecommerce. No representa disponibilidad en una futura caja física.

## 2.2 Disponibilidad efectiva

Un producto puede agregarse al carrito solamente cuando:

```text
STORE_PURCHASES_ENABLED === true
AND products.online_sale_enabled === true
AND products.is_active === true
AND products.in_stock === true
AND products.stock_quantity > 0
```

`STORE_PURCHASES_ENABLED` se conserva como interruptor de emergencia. No se elimina ni se transforma en control operativo diario.

## 2.3 Estado inicial seguro

La migración debe dejar **todos los productos existentes con `online_sale_enabled = false`**.

Los productos nuevos también deben crearse con `onlineSaleEnabled = false` por defecto.

Así, al activar posteriormente `STORE_PURCHASES_ENABLED=true`, ningún producto podrá comprarse hasta ser habilitado individual o masivamente.

## 2.4 Acciones masivas

Las acciones masivas actualizan el booleano de todas las filas de `products` dentro de una transacción:

- `Habilitar venta en todos` → `online_sale_enabled = true`.
- `Poner todos en modo consulta` → `online_sale_enabled = false`.

La acción incluye productos activos e inactivos. `is_active` sigue controlando visibilidad.

No crear una configuración global adicional en base de datos. El estado masivo se deriva del conteo:

- `0 habilitados` → todos en consulta.
- `total habilitados` → todos habilitados.
- cualquier valor intermedio → configuración mixta.

---

# 3. Migración y respaldo

## 3.1 Respaldo obligatorio

Antes de aplicar SQL:

1. Exportar como JSON o CSV, como mínimo:
   - `id`
   - `title`
   - `is_active`
   - `in_stock`
   - `stock_quantity`
   - `price`
   - `sale_price`
2. Guardarlo bajo:

```text
backups/online-sale-control/<timestamp>/
```

3. Crear un SQL de rollback que elimine únicamente la columna nueva:

```sql
ALTER TABLE products DROP COLUMN IF EXISTS online_sale_enabled;
```

No modificar ningún otro dato en la migración.

## 3.2 SQL esperado

Generar la migración Drizzle correspondiente. El resultado funcional debe equivaler a:

```sql
ALTER TABLE products
ADD COLUMN online_sale_enabled boolean DEFAULT false NOT NULL;
```

Aplicar manualmente en Supabase SQL Editor con **Run without RLS**.

Después de aplicar:

```sql
SELECT count(*) FROM products;
SELECT count(*) FROM products WHERE online_sale_enabled = true;
```

El segundo resultado debe ser `0`.

---

# 4. Archivos que se deben revisar

## Base de datos y servicios

- `src/integrations/drizzle/schema/products.ts`
- `src/integrations/drizzle/schema/index.ts`
- `src/features/admin/schemas/product-schemas.ts`
- `src/features/admin/services/product-admin-service.ts`
- `src/features/catalogo/types.ts`
- `src/features/catalogo/services/product-service.ts`
- `src/features/checkout/services/order-service.ts`
- `src/features/checkout/services/stock-service.ts`
- `src/features/checkout/services/payment-service.ts`

## API

- `src/app/api/admin/productos/route.ts`
- `src/app/api/admin/productos/[id]/route.ts`
- `src/app/api/ordenes/route.ts`
- `src/app/api/pagos/crear-sesion/route.ts`
- `src/app/api/stock/route.ts`

## Admin

- `src/app/admin/(panel)/productos/page.tsx`
- `src/features/admin/components/AdminToggle.tsx`
- `src/features/admin/components/AdminTable.tsx`
- `src/features/admin/components/product-admin-form.tsx`

## Tienda pública

- `src/app/(store)/productos/page.tsx`
- `src/app/(store)/carrito/page.tsx`
- `src/features/catalogo/components/ProductCard.tsx`
- `src/features/catalogo/components/ProductInfoBlock.tsx`
- `src/features/catalogo/components/AddToCartButton.tsx`
- `src/features/catalogo/components/ProductGrid.tsx`
- `src/shared/ui/CartPanel.tsx`
- `src/shared/config/brand.ts`
- `src/shared/config/store-purchases.ts`
- `src/shared/providers/PurchaseAvailabilityProvider.tsx`
- componente actual del aviso `PurchasesPausedBanner`

---

# 5. Contratos del catálogo

Propagar `onlineSaleEnabled: boolean` en:

- tipo administrativo `ProductListItem`;
- `CatalogProduct`;
- `CatalogProductDetail`;
- selects de `getProductsAdmin()`;
- `getProductAdmin()`;
- `getProducts()`;
- `getProductBySlug()`;
- colecciones auxiliares del catálogo;
- productos relacionados;
- payloads enviados a `ProductCard`, `ProductInfoBlock` y `AddToCartButton`.

No dejar ningún select parcial sin el campo cuando termine alimentando un CTA de compra.

Agregar a `CreateProductSchema`:

```typescript
onlineSaleEnabled: z.boolean().default(false)
```

`UpdateProductSchema` lo heredará como opcional.

Agregar el campo a:

- `createProduct()`;
- `updateProduct()`;
- formulario de producto, con toggle **Habilitar venta web**;
- valor inicial de producto nuevo: `false`.

---

# 6. API administrativa

## 6.1 Actualización individual

Reutilizar:

```text
PUT /api/admin/productos/{id}
```

Payload:

```json
{
  "onlineSaleEnabled": true
}
```

Validar con Zod y actualizar únicamente:

- `online_sale_enabled`;
- `updated_at`.

La UI debe hacer actualización optimista y restaurar el valor anterior si la API falla.

## 6.2 Acción masiva

Crear:

```text
PUT /api/admin/productos/venta-web
```

Schema:

```typescript
z.object({
  enabled: z.boolean(),
})
```

Servicio:

```typescript
setAllProductsOnlineSale(enabled: boolean)
```

Debe:

1. abrir transacción;
2. actualizar todas las filas;
3. actualizar `updated_at`;
4. retornar la cantidad afectada.

Respuesta:

```json
{
  "data": {
    "enabled": true,
    "affected": 1725
  }
}
```

La ruta queda protegida por el middleware administrativo existente.

No aceptar IDs ni filtros en esta ruta: siempre es todo el catálogo.

---

# 7. UI administrativa

## 7.1 Cabecera

En `/admin/productos`, a la izquierda de `Nuevo producto`, agregar un control compacto:

```text
[ Venta web: 0 de 1.725 habilitados ▾ ] [ + Nuevo producto ]
```

No usar un switch binario porque el catálogo puede quedar en estado mixto.

El control abre un menú con:

- **Habilitar venta en todos**
- **Poner todos en modo consulta**

Antes de ejecutar, mostrar confirmación:

### Habilitar

```text
¿Habilitar la venta web en todo el catálogo?

Los productos activos y con stock podrán agregarse al carrito.
```

### Deshabilitar

```text
¿Poner todo el catálogo en modo consulta?

Los productos seguirán visibles, pero el botón de compra será reemplazado por WhatsApp.
```

Durante el request:

- bloquear el botón;
- mostrar estado de carga;
- impedir doble envío.

Al terminar:

- actualizar las filas visibles;
- actualizar el contador;
- mostrar toast con cantidad afectada.

## 7.2 Columna por producto

Agregar una columna `VENTA WEB` entre `CATEGORÍA` y `ESTADO`.

Usar `AdminToggle` o el switch ya establecido por el design system.

Estados:

- activo: tooltip o texto accesible `Venta web habilitada`;
- inactivo: `Consulta por WhatsApp`;
- cargando: switch deshabilitado.

No mezclar este switch con `Activo/Inactivo`.

## 7.3 Filtro

Agregar selector:

```text
Todos los productos
Venta web habilitada
En consulta por WhatsApp
```

Query param administrativo:

```text
onlineSaleEnabled=true|false
```

Agregar este filtro a:

- `ProductAdminListParams`;
- API GET;
- `getProductsAdmin()`;
- estado y limpieza de filtros.

---

# 8. Consulta por WhatsApp

## 8.1 Configuración

Agregar a `BRAND`:

```typescript
whatsappNumber: "56981336797"
```

El valor se guarda sin `+`, espacios ni guiones porque será utilizado por `wa.me`.

Centralizar la construcción del enlace en:

```text
src/shared/utils/whatsapp.ts
```

No duplicar strings ni lógica entre componentes.

## 8.2 Mensaje exacto

Usar:

```text
Hola, quisiera consultar si tienen disponible "{TÍTULO}".
SKU: {SKU O "no informado"}
Producto: {URL ABSOLUTA}
```

La URL debe ser:

```text
https://www.libreriacrecer.cl/productos/{slug}
```

Usar `NEXT_PUBLIC_APP_URL` cuando esté disponible y fallback:

```text
https://www.libreriacrecer.cl
```

Codificar con `encodeURIComponent`.

URL final:

```text
https://wa.me/56981336797?text=...
```

Abrir en pestaña nueva:

```text
target="_blank"
rel="noopener noreferrer"
```

## 8.3 CTA público

Prioridad de estados:

1. Si `STORE_PURCHASES_ENABLED` es `false`:
   - mantener el bloqueo de emergencia y mensajes actuales.
2. Si `onlineSaleEnabled` es `false`:
   - mostrar `Consultar stock por WhatsApp`.
3. Si está habilitado pero no tiene stock:
   - mostrar `Sin stock`.
4. Si está habilitado y tiene stock:
   - mostrar `Agregar al carrito`.

Aplicar en:

- `ProductCard`;
- `ProductInfoBlock`;
- `AddToCartButton`.

El CTA de WhatsApp:

- no agrega al carrito;
- no cambia el estado Zustand;
- conserva la navegación normal hacia el detalle del producto;
- usa icono de mensaje compatible con el sistema existente, sin SVG improvisado si ya existe iconografía reutilizable.

## 8.4 Visibilidad de productos en consulta

En `/productos`, los productos activos con `onlineSaleEnabled=false` deben seguir apareciendo aunque estén en modo consulta.

No agregar `onlineSaleEnabled=true` a las condiciones de catálogo.

Para permitir consultar fichas con stock dudoso:

- el listado principal `/productos` debe incluir productos activos aunque `stock_quantity = 0`;
- las secciones editoriales del landing pueden conservar sus filtros actuales de stock;
- el detalle por slug continúa accesible para cualquier producto activo.

Cuando un producto tenga `onlineSaleEnabled=false`, el CTA de WhatsApp prevalece incluso si su stock registrado es cero.

---

# 9. Carrito y checkout

## 9.1 Carritos existentes

Un producto puede haber sido agregado antes de ser puesto en consulta.

Extender la validación de disponibilidad existente para informar por producto:

```typescript
{
  productId: string;
  available: boolean;
  onlineSaleEnabled: boolean;
  reason: "available" | "consultation_only" | "out_of_stock" | "inactive" | "not_found";
}
```

En carrito:

- marcar artículos `consultation_only`;
- ofrecer `Consultar por WhatsApp`;
- impedir checkout mientras haya artículos no comprables;
- permitir eliminarlos normalmente.

No eliminar automáticamente artículos del carrito.

## 9.2 Seguridad backend

Dentro de `createOrder()` y dentro de la misma consulta que valida productos, exigir:

```text
is_active = true
online_sale_enabled = true
in_stock = true
stock_quantity >= quantity solicitada
```

Si el producto está en modo consulta, devolver:

```text
code: "product_not_available_online"
```

con detalle de productos afectados.

Antes de crear una sesión Getnet:

- volver a validar que todos los productos de la orden sigan habilitados;
- si alguno fue deshabilitado después de crear la orden, no abrir sesión de pago;
- devolver error controlado.

Las validaciones del frontend no reemplazan estas barreras.

No modificar el procesamiento de webhooks, retorno Getnet ni conciliación salvo lo estrictamente necesario para esta validación previa.

---

# 10. Corrección de métricas administrativas

## 10.1 Causa confirmada

Actualmente `/admin/productos/page.tsx` calcula:

```typescript
products.length
products.filter(...).length
products.reduce(stock)
products.reduce(effectivePrice * stock)
new Set(products.flatMap(categories)).size
```

`products` contiene solo la página actual, cuyo límite es 20. Por eso las tarjetas y el texto `20 productos encontrados` son incorrectos.

## 10.2 Servicio de estadísticas

Crear:

```typescript
getProductAdminStats()
```

Debe calcular en PostgreSQL, sin paginación y sin depender de los filtros de la tabla:

```typescript
{
  totalProducts: number;
  activeProducts: number;
  totalStock: number;
  potentialSalesValue: number;
  activeCategories: number;
  onlineSaleEnabledProducts: number;
}
```

Definiciones:

- `totalProducts`: todas las filas de `products`.
- `activeProducts`: `products.is_active = true`.
- `totalStock`: `sum(greatest(stock_quantity, 0))` de todas las filas.
- `potentialSalesValue`: `sum(greatest(stock_quantity, 0) * price)`.
- `activeCategories`: categorías con `is_active = true`.
- `onlineSaleEnabledProducts`: productos con `online_sale_enabled = true`.

El valor es potencial de venta, no costo contable. No usar `sale_price`.

Puede resolverse en una o pocas consultas agregadas claras. No cargar todos los productos para sumar en JavaScript.

## 10.3 Contrato API

Extender:

```text
GET /api/admin/productos
```

Respuesta:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1143,
    "totalPages": 58
  },
  "stats": {
    "totalProducts": 1725,
    "activeProducts": 1143,
    "totalStock": 0,
    "potentialSalesValue": 0,
    "activeCategories": 0,
    "onlineSaleEnabledProducts": 0
  }
}
```

Las estadísticas son globales. La paginación sí refleja búsqueda y filtros.

## 10.4 UI de métricas

Corregir el subtítulo del encabezado para usar:

```text
pagination.total
```

Tarjetas:

1. `Total productos`
   - valor: `stats.totalProducts`
   - subtítulo: `{stats.activeProducts} activos`
2. `Stock total`
   - valor: `stats.totalStock`
   - subtítulo: `unidades`
3. Renombrar `Valor en inventario` a:
   - `Valor potencial de venta`
   - valor: `formatCLP(stats.potentialSalesValue)`
   - subtítulo: `a precio vigente`
4. Renombrar `Categorías visibles` a:
   - `Categorías activas`
   - valor: `stats.activeCategories`
   - subtítulo: `en el catálogo`

Eliminar los cálculos derivados del array paginado.

---

# 11. Manejo de errores

Todos los fetch del Client Component deben usar `try/catch/finally`.

En acciones individuales y masivas:

- toast de éxito;
- toast de error;
- rollback del estado optimista;
- `finally` debe liberar loading;
- no dejar switches bloqueados permanentemente.

La lectura de estadísticas no debe romper toda la tabla:

- mostrar error existente;
- conservar un estado de carga coherente;
- no presentar cifras inventadas.

---

# 12. Responsive y accesibilidad

- El control masivo debe quedar junto a `Nuevo producto` en desktop.
- En móvil ambos botones pueden saltar a una segunda línea, ocupando el ancho necesario sin solaparse.
- La nueva columna puede desplazarse horizontalmente dentro del patrón actual de `AdminTable`; no ocultarla sin alternativa.
- Los switches deben tener `aria-label` con el título del producto.
- El menú masivo debe poder cerrarse con Escape y click exterior.
- Mantener foco visible.
- Confirmaciones deben ser accesibles por teclado.
- No usar clases Tailwind arbitrarias para layout crítico.

---

# 13. Pruebas obligatorias

## Unitarias/servicio

1. Producto activo, con stock y habilitado → comprable.
2. Producto activo, con stock y deshabilitado → `product_not_available_online`.
3. Producto habilitado sin stock → stock insuficiente.
4. Producto inactivo habilitado → no comprable.
5. Acción masiva `true` afecta todas las filas.
6. Acción masiva `false` afecta todas las filas.
7. Las métricas agregadas no dependen de `limit=20`.
8. `potentialSalesValue` usa `price * max(stock, 0)`.

## E2E/manual

1. Producto en consulta muestra WhatsApp en tarjeta.
2. El mensaje contiene título, SKU y URL.
3. El CTA no modifica el carrito.
4. Activar switch individual cambia el CTA a compra.
5. Desactivarlo vuelve a WhatsApp.
6. Habilitar todos actualiza filas y contador.
7. Poner todos en consulta actualiza filas y contador.
8. Un producto deshabilitado dentro del carrito bloquea checkout.
9. Llamar directamente a `/api/ordenes` con producto deshabilitado falla.
10. Las tarjetas KPI muestran cifras globales en página 1 y página 2.
11. El texto de resultados usa `pagination.total`.

---

# 14. Secuencia de implementación

Ejecutar exactamente en este orden:

1. Leer documentación y archivos indicados.
2. Revisar `git status`; no revertir cambios ajenos.
3. Crear respaldo de `products`.
4. Actualizar schema Drizzle.
5. Generar migración SQL.
6. Aplicar migración manualmente en Supabase y verificar cero habilitados.
7. Propagar tipos y selects.
8. Implementar servicios y schemas admin.
9. Implementar API individual y masiva.
10. Implementar estadísticas agregadas.
11. Corregir cabecera y tarjetas KPI.
12. Implementar control masivo.
13. Implementar switch por fila y filtro.
14. Implementar utilidad WhatsApp.
15. Actualizar tarjetas y detalle público.
16. Actualizar validación de carrito.
17. Blindar creación de orden y sesión Getnet.
18. Agregar o ajustar pruebas.
19. Ejecutar verificaciones.
20. Entregar resumen y pasos de activación.

---

# 15. Verificación final

Ejecutar:

```bash
npx tsc --noEmit
npm run lint
npm run test:payments
```

Ejecutar también los tests Playwright relevantes de catálogo, producto y carrito en Chromium si el entorno local está disponible.

Verificar en base de datos:

```sql
SELECT count(*) AS total FROM products;
SELECT count(*) AS enabled FROM products WHERE online_sale_enabled = true;
SELECT count(*) AS invalid
FROM products
WHERE online_sale_enabled IS NULL;
```

`invalid` debe ser `0`.

---

# 16. Activación de producción

Al terminar la implementación:

1. Mantener `STORE_PURCHASES_ENABLED=false` mientras se verifica.
2. Confirmar que todos los productos tienen `online_sale_enabled=false`.
3. Probar desde admin habilitando un único producto.
4. Verificar que ese producto muestra compra cuando el interruptor de emergencia esté activo en un entorno controlado.
5. Configurar en Vercel:

```text
STORE_PURCHASES_ENABLED=true
```

6. Redeploy.

Después del redeploy:

- productos deshabilitados → WhatsApp;
- productos habilitados, activos y con stock → compra normal;
- productos habilitados sin stock → sin stock.

No habilitar todos automáticamente durante el deploy.

---

# 17. Criterios de aceptación

- [ ] Existe `products.online_sale_enabled` con default `false`.
- [ ] Ningún producto fue habilitado accidentalmente durante la migración.
- [ ] La administradora puede habilitar/deshabilitar un producto desde su fila.
- [ ] Existe acción masiva para habilitar todos.
- [ ] Existe acción masiva para poner todos en consulta.
- [ ] El estado mixto se representa sin un switch global engañoso.
- [ ] Los productos en consulta permanecen visibles.
- [ ] El CTA abre WhatsApp con título, SKU y URL.
- [ ] El CTA WhatsApp no agrega al carrito.
- [ ] Carrito y checkout detectan productos deshabilitados.
- [ ] Las API impiden saltarse el bloqueo.
- [ ] Getnet no inicia sesión para una orden con productos deshabilitados.
- [ ] Las métricas del admin provienen de agregados globales.
- [ ] El encabezado usa el total real de la paginación.
- [ ] `Valor potencial de venta` está correctamente nombrado.
- [ ] `npx tsc --noEmit` pasa.
- [ ] `npm run lint` pasa sin errores nuevos.
- [ ] Tests de pagos pasan.
- [ ] No se hizo commit ni push.

