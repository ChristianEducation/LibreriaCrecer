# Revisión de la carpeta docs para fase 4
_Exported on 3/19/2026 at 19:41:09 GMT-3 from Cursor (2.6.20)_

---

**User**

Quiero que analices toda la carpeta docs y sus archivos, revises el codigo y me digas si ya estamos en condiciones de poder comenzar con la fase 4.

---

**Cursor**

Revisando el código del proyecto para comprobar si las Fases 1, 2 y 3 están implementadas (prerrequisitos de la Fase 4).


Resumen del análisis:

---

# Análisis: ¿Estamos listos para la Fase 4?

Revisé la carpeta **docs** (planificación y prompts 4.1–4.5) y el **código** del proyecto. Conclusión:

## Sí se puede empezar la Fase 4, pero hay que hacerla desde la Tarea 4.1

Las **Fases 1, 2 y 3 están implementadas** (backend, APIs, admin, carrito, checkout atómico, Getnet). Lo que falta es **todo el frontend público y el design system** que describe la Fase 4. Por tanto, se puede comenzar la Fase 4, pero **empezando por la Tarea 4.1** y en orden, porque 4.2, 4.3, 4.4 y 4.5 dependen de ella.

---

## Lo que ya está listo (prerrequisitos)

### Fase 1 — Cimientos
- Estructura Next.js, App Router, `(store)` y `admin/(panel)`.
- Drizzle: esquemas (productos, categorías, órdenes, items, banners, hero_slides, etc.).
- Supabase Storage configurado.
- **Zustand carrito**: `store.ts` con `addItem`, `removeItem`, `incrementQuantity`, `decrementQuantity`, `clearCart`, `applyCoupon`, `removeCoupon`; hooks `useCart()`, `useCartSummary()`, `useCartItem()`.

### Fase 2 — API y lógica
- **Catálogo**: `/api/productos`, `/api/productos/[slug]`, `/api/productos/novedades`, `/api/productos/ofertas`, `/api/productos/destacados`.
- **Categorías**: `/api/categorias`, `/api/categorias/[slug]`, `/api/categorias/destacadas`.
- **Landing**: `/api/landing/hero`, `/api/landing/banners`, `/api/landing/seleccion`.
- **Órdenes y pagos**: `/api/ordenes`, `/api/ordenes/[orderNumber]`, `/api/pagos/crear-sesion`, `/api/pagos/retorno`, `/api/pagos/notificacion`.
- **Auxiliares**: `/api/cupones/validar`, `/api/stock/validar`.
- Integración Getnet en `integrations/payments/getnet/`.

### Fase 3 — Panel Admin
- Auth: login, logout, `/api/admin/auth/me`, middleware.
- CRUD productos y categorías (listado, nuevo, editar, imágenes).
- Gestión de pedidos (listado, detalle, cambio de estado).
- Landing admin: hero, banners, selección curada.

### Otros
- **Checkout**: `CreateOrderSchema` y schemas Zod en `features/checkout/schemas.ts`.
- **Utilidades**: `formatCLP` y `formatDate` en `shared/utils/formatters.ts`.

---

## Lo que falta para la Fase 4 (por tarea)

### Tarea 4.1 — Tokens y componentes base
- **Tailwind**: El proyecto usa Tailwind v4 (`@tailwindcss/postcss`). No hay tokens del design system (beige, moss, gold, tipografías EB Garamond / DM Sans, border-radius 2px). Habrá que definirlos en `globals.css` con `@theme` / variables y, si aplica, en config.
- **globals.css**: Sigue el tema por defecto (background/foreground). Faltan variables del doc (beige, moss, gold, etc.) y fuentes del diseño.
- **shared/ui**: Solo existe `index.ts` con `export {}`. No hay **Button**, **Badge**, **Input**, **Textarea**, **SectionHeader**, **Separator**.
- **Hooks**: No existe `useScrollReveal` ni `useScrollRevealMultiple`.
- **Dependencia**: No está `class-variance-authority` (cva) que pide el prompt 4.1.

### Tarea 4.2 — Navbar, Footer, layouts
- No existe **`src/app/(store)/layout.tsx`** (layout tienda con Navbar + Footer). Solo hay `app/layout.tsx` (raíz) y `admin/(panel)/layout.tsx`.
- No hay componentes **Navbar**, **CartPanel**, **Footer** en `shared/ui`.
- Tabla **banners**: no tiene campo `metadata` (jsonb) para parámetros del footer (opacity, fadeStart, fadeEnd, etc.). El schema actual no lo incluye.
- Admin: el layout existe pero no sigue el diseño de la Tarea 4.2 (AdminSidebar / AdminTopbar con design system).

### Tarea 4.3 — Home y catálogo
- **categories**: no tiene el campo `header_image_url` que pide 4.3 para el header del catálogo.
- **Home** `(store)/page.tsx`: solo `<h1>Home</h1>`.
- **Catálogo**: existe `(store)/productos/page.tsx` como placeholder; el doc habla de `/catalogo` (ruta a definir). No hay **ProductCard**, **CategoryCard**, **PageHeader**, **FilterBar**, **HeroSlider**, etc.

### Tarea 4.4 — Detalle producto, carrito, checkout
- No existe ruta **productos/[slug]** (detalle de producto).
- Páginas **carrito** y **checkout** son placeholders (`<h1>Carrito</h1>`, `<h1>Checkout</h1>`).
- No hay **ProductGallery**, **AddToCartButton**, **CheckoutForm**, página de confirmación ni 404 con el diseño definido.

### Tarea 4.5 — Admin con design system
- Pendiente hasta tener 4.1 y 4.2 (componentes y layouts del design system). La UI del admin es funcional pero sin aplicar tokens ni componentes de `shared/ui`.

---

## Resumen ejecutivo

| Requisito | Estado |
|-----------|--------|
| Fases 1–3 completas (backend, APIs, admin, carrito, pagos) | ✅ Listo |
| Design tokens y componentes base (4.1) | ❌ No iniciado |
| Navbar, Footer, layouts tienda/admin (4.2) | ❌ No iniciado |
| Migraciones para Fase 4 (banners.metadata, categories.header_image_url) | ❌ No hechas |
| Páginas y componentes de la tienda (4.3–4.5) | ❌ Placeholders |

**Conclusión:** Sí se puede **empezar la Fase 4**, pero de forma ordenada:

1. **Comenzar por la Tarea 4.1** (tokens, `globals.css`, componentes en `shared/ui`, `useScrollReveal`, cva).
2. Luego **4.2** (Navbar, CartPanel, Footer, layout `(store)`, layout admin con sidebar/topbar, migración `banners.metadata`).
3. Después 4.3 (Home, catálogo, migración `header_image_url` en categories), 4.4 (detalle, carrito, checkout) y 4.5 (pulir admin).

Si quieres, el siguiente paso puede ser un plan concreto para la **Tarea 4.1** (archivos a crear/tocar y orden de implementación).

---

**User**

obvio que lo haermos de forma ordenada, y obvio que no esta la fase 4 realizada ya que esa era la pregunta, entocnes comenzamos con el prompt de la tarea 4,1?

---

**Cursor**

Sí. Lo correcto es **empezar por la Tarea 4.1**.

El enunciado completo está en:

**`docs/Prompt-Tarea-4_1-Tokens-Base.md`**

Ahí se define todo lo que hay que hacer:

1. **Tailwind** — Paleta (beige, moss, gold, text, border), fuentes (EB Garamond, DM Sans), `border-radius: 2px`, `fontSize.eyebrow`.
2. **globals.css** — Variables CSS en `:root`, fuentes Google, reset, scrollbar, clases `.reveal` / `.reveal.visible`.
3. **shared/ui** — `Button` (variantes primary, moss, outline, ghost, add-to-cart, secondary), `Badge`, `Input` + `Textarea`, `SectionHeader`, `Separator`.
4. **Hooks** — `useScrollReveal` y `useScrollRevealMultiple` en `shared/hooks/`.
5. **Exports** — Actualizar `shared/ui/index.ts` y `shared/hooks/index.ts`.
6. **Dependencia** — `npm install class-variance-authority`.

Importante para tu proyecto: usas **Tailwind v4** (`@tailwindcss/postcss`), así que no tienes `tailwind.config.ts`; la configuración de tema va en CSS con `@theme` y variables. El prompt 4.1 está pensado para Tailwind v3 con `tailwind.config.ts`; al implementar, habrá que **adaptar** esos tokens y fuentes al formato de Tailwind v4 en `globals.css` (y en la configuración que estés usando).

Cuando quieras que yo **implemente** la Tarea 4.1 en el código, cambia a **Agent mode** y dímelo; en Ask mode solo puedo orientar y revisar, no editar archivos.

---

**User**

analiza cada prompt de la fase 4 y dime los detalles que hay que tener en ceunta para poder corregirlos y se adapten a nuestro proyecto

---

**Cursor**

Revisando cada prompt de la Fase 4 y el estado actual del proyecto para listar las adaptaciones necesarias.


Revisando la estructura de rutas del admin y el addItem del carrito:


Aquí va el análisis por prompt con los detalles a corregir o adaptar a vuestro proyecto.

---

# Análisis de prompts Fase 4 — adaptaciones al proyecto

## Tarea 4.1 — Tokens y componentes base

| Detalle | En el prompt | En vuestro proyecto | Qué hacer |
|--------|---------------|----------------------|-----------|
| **Config de Tailwind** | Usa `tailwind.config.ts` con `theme.extend` (colores, fontFamily, borderRadius, fontSize). | Tenéis **Tailwind v4** (`tailwindcss: ^4`, `@tailwindcss/postcss`). En v4 no hay `tailwind.config.ts` por defecto; el tema se define en CSS. | No crear `tailwind.config.ts`. Definir la paleta, fuentes y radius en `src/app/globals.css` con `@theme` y variables CSS (y `@config` si usáis un config en v4). Mantener los mismos valores (beige, moss, gold, EB Garamond, DM Sans, 2px). |
| **Import de Tailwind en CSS** | `@tailwind base; @tailwind components; @tailwind utilities;` | En `globals.css` tenéis `@import "tailwindcss";` (sintaxis v4). | No cambiar a las tres directivas antiguas. Dejar `@import "tailwindcss";` y sumar debajo las variables `:root`, fuentes y clases (.reveal, etc.) del prompt. |
| **Ruta de Drizzle en otros prompts** | 4.2 dice `import { db } from '@/integrations/drizzle/client'`. | En el proyecto se usa `import { db } from '@/integrations/drizzle'` (barrel que reexporta `client`). | En 4.2 (y donde se copie código) usar `@/integrations/drizzle` para no depender de la ruta interna `client`. |
| **class-variance-authority (cva)** | Instalar y usar para variantes de `Button`. | No está en `package.json`. | Añadir dependencia en 4.1 cuando implementéis. |
| **Textarea** | Mismo archivo que Input: "Crear también `Textarea.tsx` con los mismos estilos". | — | Podéis crear `Textarea.tsx` en `shared/ui` o exportar desde el mismo módulo que `Input` (p. ej. `Input.tsx` con `Input` y `Textarea`). |

---

## Tarea 4.2 — Navbar, Footer y layouts

| Detalle | En el prompt | En vuestro proyecto | Qué hacer |
|--------|---------------|----------------------|-----------|
| **Layout admin** | Ruta de archivo: `src/app/admin/layout.tsx`. | El admin está bajo **route group**: `src/app/admin/(panel)/layout.tsx`. La URL sigue siendo `/admin/...`. | Crear o modificar el layout en **`src/app/admin/(panel)/layout.tsx`** (no en `admin/layout.tsx`). El contenido (AdminSidebar, AdminTopbar) es el mismo que describe el prompt. |
| **Carga de categorías en layout store** | "Las categorías se cargan directo con Drizzle" con `import { db } from '@/integrations/drizzle/client'` y `categories` desde `@/integrations/drizzle/schema`. | Schema exportado como namespace: `import * as schema from '@/integrations/drizzle'` → `schema.categories`. O `from '@/integrations/drizzle/schema'` según cómo esté el barrel. | Usar el mismo patrón que en el resto del proyecto: `import { db } from '@/integrations/drizzle'` y `import { categories } from '@/integrations/drizzle/schema'` (o el path que uséis para el schema). |
| **CartPanel – total de ítems** | "Muestra el total de items del store (useCartSummary().**totalItems**)". | `useCartSummary()` devuelve `totalItems` e `itemCount`. | Usar `totalItems` (o `itemCount` si preferís consistencia con “cantidad de ítems”) y dejar el resto del hook igual. |
| **API banners para footer** | `GET /api/landing/banners?position=footer_illustration` debe devolver `image_url, opacity, fade_start, fade_end, img_width, art_space_width`. | Tabla `banners` no tiene `metadata` ni esos campos. `getBanners()` solo devuelve id, title, description, imageUrl, linkUrl, position, createdAt. | 1) Añadir migración: columna `metadata jsonb` en `banners`. 2) En el servicio/API que lee el banner de footer, leer y devolver ese objeto (p. ej. `FooterBannerMetadata`) desde `metadata`. 3) El Footer usa esos valores; si no hay banner o metadata, usar los defaults del prompt. |
| **Navegación del sidebar admin** | Rutas: `/admin`, `/admin/pedidos`, `/admin/productos`, `/admin/categorias`, `/admin/landing/hero`, etc. | Rutas reales: mismas URLs porque `(panel)` no afecta la URL. Pero hay `admin/(panel)/landing/banners` y `admin/(panel)/landing/seleccion` (y posiblemente `landing/hero`). | Comprobar que cada ítem del sidebar apunte a la ruta que realmente existe (ej. `/admin/landing/hero`, `/admin/landing/banners`, etc.). |
| **Badge del carrito** | "total de items del store". | Store expone `getTotalItems()` (suma de cantidades). `useCartSummary().totalItems` es ese valor. | Correcto usar `totalItems` del hook. |

---

## Tarea 4.3 — Home y catálogo

| Detalle | En el prompt | En vuestro proyecto | Qué hacer |
|--------|---------------|----------------------|-----------|
| **Ruta del catálogo** | Página: `src/app/(store)/catalogo/page.tsx` → URL **/catalogo**. | Hoy existe `(store)/productos/page.tsx` (placeholder) y `(store)/categorias/page.tsx`. No hay carpeta `catalogo`. | Decidir: o bien crear **`(store)/catalogo/page.tsx`** y usar la ruta **/catalogo** (como en el prompt), o bien usar **/productos** como catálogo y renombrar/adaptar el contenido del prompt de “catalogo” a “productos”. Si seguís el doc al pie, crear `catalogo/page.tsx` y dejar productos para listado por categoría o detalle. |
| **ProductCard – navegación** | "Clic en la card (fuera del botón) navega a **/productos/{slug}**". | Coherente con detalle en `productos/[slug]` (por implementar en 4.4). | Mantener: links a `/productos/{slug}`. |
| **Campo header_image_url** | Migración: en `categories` agregar `header_image_url` (nullable). Schema en `src/integrations/drizzle/schema/categories.ts`. | En `categories` solo está `imageUrl`; no hay `header_image_url`. | Añadir en la tarea 4.3 la migración que agregue `header_image_url` y usarla en PageHeader / headers de categoría. |
| **APIs listadas** | `/api/productos/novedades`, `/api/productos/ofertas`, `/api/categorias/destacadas`. | Existen esas rutas. | Sin cambio. |
| **Home – fetch** | "fetch('/api/landing/hero')" etc. desde el Server Component. | En Next 15, `fetch` desde server sin base URL puede necesitar URL absoluta en algunos entornos. | Si fallan los fetch, usar la URL absoluta (ej. `process.env.NEXT_PUBLIC_APP_URL` o `headers()` para armarla) o el cliente de datos que ya uséis en server. |

---

## Tarea 4.4 — Detalle producto, carrito y checkout

| Detalle | En el prompt | En vuestro proyecto | Qué hacer |
|--------|---------------|----------------------|-----------|
| **Ruta detalle producto** | `src/app/(store)/productos/[slug]/page.tsx`. | No existe esa ruta; solo `(store)/productos/page.tsx`. | Crear la ruta **`(store)/productos/[slug]/page.tsx`** al implementar 4.4. |
| **addItem con cantidad** | AddToCartButton llama a `addItem({ ..., quantity: qty })`. | El store define `addItem(item: CartItemInput)`; no recibe `quantity`. Siempre suma 1 o mergea con el ítem existente (quantity + 1). | Adaptar: o bien **extender** `addItem` para aceptar cantidad opcional (p. ej. `addItem(item, quantity?)` y si no se pasa, 1), o bien en AddToCartButton: hacer `addItem` una vez y luego `updateQuantity(productId, qty)` hasta la cantidad elegida. La opción más limpia es extender el store con cantidad en `addItem`. |
| **CartItemInput** | Prompt usa `price`, `salePrice ?? price`, `originalPrice: product.salePrice ? product.price : null`, `imageUrl`, `sku`, `quantity`. | `CartItemInput` = `Omit<CartItem, 'quantity'>`. `CartItem` tiene `price`, `originalPrice`, `imageUrl`, `sku` (no `salePrice`). | El mapeo en el prompt (salePrice/price/originalPrice) es compatible: enviar `price` como precio efectivo (salePrice ?? price), `originalPrice` como el otro. No hace falta cambiar tipos si el contrato del store se mantiene. |
| **CreateOrderSchema y método de pago** | CheckoutForm tiene sección "Método de pago" (Tarjeta / Transferencia / Efectivo). Si es tarjeta → POST crear-sesion y redirigir. Si no → ir a confirmación. | `CreateOrderSchema` no incluye **paymentMethod**. La tabla `orders` tiene `payment_method`; `createOrder` no lo rellena en el insert. | Incluir en el flujo: 1) Añadir al schema (ej. `paymentMethod: z.enum(['tarjeta','transferencia','efectivo']).optional()` o el valor que use el backend). 2) En `order-service`, al hacer insert, setear `paymentMethod` desde el body (ej. mapear tarjeta → 'getnet', transferencia/efectivo como está). 3) Front: enviar ese campo al POST `/api/ordenes`; según valor, después llamar a crear-sesion o ir a confirmación. |
| **Confirmación – params** | `?order=ORD-0001` y `?status=paid|pending`. | — | Implementar la página de confirmación leyendo `searchParams.order` y `searchParams.status` y mostrando el mensaje según status. |
| **Página 404** | `src/app/not-found.tsx`. | Puede no existir o ser la por defecto de Next. | Crear o reemplazar `app/not-found.tsx` con el diseño del prompt (cruz, 404, botones). |
| **ProductGallery – border-radius** | "Imagen principal: aspect-ratio 3/4 | **border-radius: 4px**". | El sistema es 2px en todo; el prompt 4.1 dice "2px en absolutamente todo". | Unificar en **2px** para la galería también, salvo que el diseño explícito pida 4px (en ese caso documentar la excepción). |

---

## Tarea 4.5 — Admin con design system

| Detalle | En el prompt | En vuestro proyecto | Qué hacer |
|--------|---------------|----------------------|-----------|
| **Rutas del admin** | Login: `src/app/admin/login/page.tsx`. Páginas: productos, categorias, pedidos, landing (hero, banner, footer, selección). | Login existe en `admin/login`. El resto está bajo `admin/(panel)/`: `productos/`, `categorias/`, `pedidos/`, `landing/` (hero, banners, seleccion). No hay `landing/footer` ni `landing/banner` como en el prompt. | Rutas reales: `admin/(panel)/landing/hero`, `admin/(panel)/landing/banners`, etc. Ajustar el sidebar y los links del índice del landing a estas rutas. Crear las páginas que falten (p. ej. editor de footer y de banner intermedio) según el prompt. |
| **Layout admin** | "Reemplaza el layout básico" en `src/app/admin/layout.tsx`. | El layout que envuelve el panel es **`admin/(panel)/layout.tsx`**. | Aplicar el diseño (AdminSidebar, AdminTopbar) en **`admin/(panel)/layout.tsx`**, no en un hipotético `admin/layout.tsx`. |
| **Login** | "Esta página NO usa el layout del admin (sin sidebar)". | Login está en `admin/login`; si el layout de `(panel)` no lo envuelve, ya está aislado. | Asegurar que el layout de `(panel)` no aplique a `login` (por estructura de carpetas, no está dentro de `(panel)`, así que suele ser correcto). |
| **GET /api/admin/pedidos/stats** | Dashboard usa métricas de esta API. | Existe `src/app/api/admin/pedidos/stats/route.ts`. | Comprobar que la respuesta tenga los datos que pide el dashboard (ventas del mes, pedidos del mes, etc.). |
| **formatCLP / formatDate** | Usar desde `src/shared/utils/formatters.ts`. | Ya existen en ese archivo. | Sin cambio. |

---

## Resumen de cambios que afectan a varios prompts

1. **Tailwind v4**  
   Todo lo que en los prompts sea “poner en `tailwind.config.ts`” debe llevarse a **CSS** (`globals.css` + `@theme` / variables). Sin crear `tailwind.config.ts` salvo que decidáis usar uno explícito con v4.

2. **Imports de Drizzle**  
   Usar siempre `@/integrations/drizzle` (y el path al schema que uséis) en los ejemplos de código que copiéis de los prompts.

3. **Rutas del admin**  
   Todas las rutas de archivo del prompt que digan `admin/...` referidas al panel (layout, sidebar, páginas) son en realidad **`admin/(panel)/...`**.

4. **Carrito – cantidad en addItem**  
   Para AddToCartButton (y ProductCard si suma más de 1), el store debe aceptar cantidad en `addItem` o usar `updateQuantity` después; lo más claro es extender `addItem`.

5. **Checkout – paymentMethod**  
   Para que el estado de la orden y el flujo (tarjeta vs transferencia/efectivo) queden bien, conviene que el schema de creación de orden y el `order-service` incluyan y persistan `paymentMethod`.

6. **Catálogo vs productos**  
   Definir si el listado principal es **/catalogo** (y crear esa ruta) o **/productos**, y que todos los links (Navbar, Home, etc.) usen la misma convención.

7. **Banners y footer**  
   Migración `metadata` en `banners` y que la API/servicio del footer devuelva y opcionalmente edite esos parámetros (opacity, fadeStart, fadeEnd, imgWidth, artSpaceWidth).

Si quieres, en el siguiente paso puedo bajar esto a una “lista de tareas” por archivo (qué tocar en schema, order-service, store, rutas y layouts) para que solo tengáis que ir marcando al implementar.

---

**User**

Nose si es lo que me diste, pero lo que quiero es que me pases que cosas debemos modifcar en los prompt para que usen todo lo que nesesita y ya tiene el proyecto. No quiero adaptar mi ppryecto que ya esta avanzado a los prompt, si no, los prompt al proyecto. Se entiende?

---

**Cursor**

Entendido: quieres **cambiar los documentos de los prompts** (los `.md` en `docs/`) para que digan exactamente qué usar de tu proyecto actual (rutas, imports, Tailwind v4, store, schema, etc.), no adaptar el código a los prompts.

Aquí van las **modificaciones concretas que hay que hacer en cada prompt** para alinearlos al proyecto.

---

# Cambios a hacer en los prompts (docs) para que reflejen el proyecto

## 1. Prompt Tarea 4.1 — `docs/Prompt-Tarea-4_1-Tokens-Base.md`

**Qué modificar:**

- **Sección "1. Configurar Tailwind CSS"**  
  - Sustituir todo el bloque que pide crear/actualizar `tailwind.config.ts` por algo como:
  - "El proyecto usa **Tailwind v4** (`@import "tailwindcss"` en `globals.css`). No existe `tailwind.config.ts`. Definir la paleta, tipografías y border-radius en **`src/app/globals.css`** usando `@theme` y variables CSS (según la sintaxis de Tailwind v4). Incluir los mismos tokens: beige, moss, gold, text, success/error/info/warning, font-family serif (EB Garamond) y sans (DM Sans), borderRadius 2px y hero 16px, fontSize eyebrow."

- **Sección "2. Actualizar globals.css"**  
  - Indicar que se **parte del contenido actual** de `src/app/globals.css` (que ya tiene `@import "tailwindcss"` y un `:root`/`@theme` básico) y se **añaden o reemplazan** solo las variables y reglas necesarias para los tokens del design system, **sin quitar** la directiva de Tailwind v4 (`@import "tailwindcss"` o la que corresponda).

- **Dependencia cva**  
  - Dejar la instrucción de instalar `class-variance-authority`; el proyecto no la tiene aún y el prompt debe pedirla.

Con esto el prompt 4.1 usa solo lo que el proyecto ya tiene (Tailwind v4, `globals.css`) y no menciona `tailwind.config.ts`.

---

## 2. Prompt Tarea 4.2 — `docs/Prompt-Tarea-4_2-Navbar-Footer-Layouts.md`

**Qué modificar:**

- **Layout de la tienda**  
  - Dejar que diga: crear **`src/app/(store)/layout.tsx`** y que cargue categorías con Drizzle.  
  - En el ejemplo de código, poner:
    - `import { db } from '@/integrations/drizzle'`
    - `import { categories } from '@/integrations/drizzle/schema'`  
  (o el import exacto que uséis para el schema, p. ej. si exportáis desde `@/integrations/drizzle` con namespace, indicar ese mismo patrón en el prompt.)

- **Layout del admin**  
  - Donde diga `src/app/admin/layout.tsx`, cambiarlo a: **`src/app/admin/(panel)/layout.tsx`**.  
  - Aclarar que el panel admin está bajo el route group `(panel)` y que las URLs siguen siendo `/admin`, `/admin/productos`, etc.

- **AdminSidebar – rutas**  
  - Listar las rutas reales del proyecto, por ejemplo:
    - Hero → `/admin/landing/hero` (o la ruta que corresponda si está bajo `(panel)`)
    - Banner → `/admin/landing/banners` (no solo "banner")
    - Footer, Selección, etc., con las rutas que ya tengáis (ej. `landing/banners`, `landing/seleccion`).

- **CartPanel – total de ítems**  
  - Dejar explícito: "Usar `useCartSummary()` de `src/features/carrito/hooks.ts`; para el contador del carrito usar la propiedad **`totalItems`** (o **`itemCount`**, según la que quieras estandarizar en el prompt)."

- **Footer – API banners**  
  - Especificar que:
    - Se usa **`GET /api/landing/banners?position=footer_illustration`**.
    - La tabla `banners` debe tener un campo **`metadata` (jsonb)** para los parámetros del footer (opacity, fadeStart, fadeEnd, imgWidth, artSpaceWidth).  
  - Si en el proyecto la API aún no devuelve `metadata`, añadir en el prompt: "Incluir en la respuesta del endpoint (o en el servicio que alimenta el footer) el objeto `metadata` cuando exista; si no existe, el front usará valores por defecto (opacity 0.80, fadeStart 40, fadeEnd 70, etc.)."

Así el prompt 4.2 usa la estructura real del proyecto (route group, imports de Drizzle, rutas del admin y API de banners).

---

## 3. Prompt Tarea 4.3 — `docs/Prompt-Tarea-4_3-Home-Catalogo (1).md`

**Qué modificar:**

- **Ruta de la página de catálogo**  
  - Si en el proyecto el listado principal está en **`/productos`** (y existe `(store)/productos/page.tsx`), en el prompt:
    - Cambiar "Página Catálogo — `src/app/(store)/catalogo/page.tsx`" por algo como: "Página de catálogo / listado de productos — **`src/app/(store)/productos/page.tsx`** (ruta pública **/productos**)."
    - Si en cambio decidís usar **/catalogo**, entonces poner: "Crear **`src/app/(store)/catalogo/page.tsx`** (URL **/catalogo**)."  
  Es decir: que el prompt nombre la ruta y el archivo que **realmente** queréis usar en el proyecto.

- **Links y navegación**  
  - Donde el prompt hable de "ir al catálogo" o "listado", unificar: "Enlaces a la página de listado de productos: **/productos** (o **/catalogo** si se usa esa ruta)."

- **Migración `header_image_url`**  
  - Mantener: "Agregar en **`src/integrations/drizzle/schema/categories.ts`** el campo **`header_image_url`** (nullable) y generar/ejecutar la migración con drizzle-kit."

- **ProductCard – destino del clic**  
  - Dejar claro: "Al hacer clic en la card (fuera del botón) navegar a **/productos/[slug]**", coherente con la ruta de detalle que tenéis.

Con esto el prompt 4.3 usa la convención de rutas que ya tenéis (productos vs catalogo) y el schema de categorías real.

---

## 4. Prompt Tarea 4.4 — `docs/Prompt-Tarea-4_4-Producto-Carrito-Checkout.md`

**Qué modificar:**

- **Ruta de detalle de producto**  
  - Dejar explícito: "Página de detalle — **`src/app/(store)/productos/[slug]/page.tsx`** (ruta **/productos/[slug]**)."

- **AddToCartButton y store del carrito**  
  - Indicar que el store está en **`src/features/carrito/store.ts`** y los hooks en **`src/features/carrito/hooks.ts`**.
  - Sobre la cantidad: como **`addItem`** actualmente solo recibe el ítem (sin cantidad) y siempre suma 1 o mergea, en el prompt poner una de estas dos opciones (elegid una y dejarla fija):
    - Opción A: "Para agregar con cantidad N: llamar **`addItem(item)`** una vez y luego **`updateQuantity(productId, N)`**."
    - Opción B: "Extender el store: **`addItem(item, quantity?: number)`** con quantity opcional (default 1) y usar **`addItem(item, qty)`** desde AddToCartButton."
  - Así el prompt no asume un contrato que el proyecto no tiene.

- **Checkout y CreateOrderSchema**  
  - Indicar que el schema a usar es el existente: **`src/features/checkout/schemas.ts`** — **`CreateOrderSchema`** con `items`, `customer`, `deliveryMethod`, `address` (opcional), `couponCode` (opcional), **sin campo `paymentMethod`**.
  - Añadir algo como: "El formulario de checkout debe incluir una **sección de método de pago (Tarjeta / Transferencia / Efectivo)** solo para el flujo: si el usuario elige Tarjeta, tras crear la orden se llama a **POST /api/pagos/crear-sesion** con `{ orderId }` y se redirige a `processUrl`; si elige Transferencia o Efectivo, se redirige a la página de confirmación. **No** enviar método de pago en el body de **POST /api/ordenes**; el backend actual no lo recibe."  
  (Si más adelante añadís `paymentMethod` al schema y al backend, entonces podéis actualizar el prompt para decir que sí se envía.)

- **Confirmación**  
  - Mantener que la página de confirmación lee **`order`** y **`status`** por query (`?order=...&status=...`).

- **ProductGallery – border-radius**  
  - Unificar con el resto del design system: "Usar **border-radius 2px** en la galería (incluida la imagen principal), salvo que se documente una excepción explícita."

Así el prompt 4.4 usa el schema actual, el store actual y las rutas del proyecto sin asumir cambios que no queréis hacer en el código.

---

## 5. Prompt Tarea 4.5 — `docs/Prompt-Tarea-4_5-Admin-Design-System.md`

**Qué modificar:**

- **Rutas y archivos del admin**  
  - Donde diga "`src/app/admin/...`" para páginas del panel (productos, categorías, pedidos, landing), cambiarlo a **`src/app/admin/(panel)/...`**, por ejemplo:
    - Layout: **`src/app/admin/(panel)/layout.tsx`**
    - Dashboard: **`src/app/admin/(panel)/page.tsx`**
    - Productos: **`src/app/admin/(panel)/productos/...`**
    - Categorías: **`src/app/admin/(panel)/categorias/...`**
    - Pedidos: **`src/app/admin/(panel)/pedidos/...`**
    - Landing: **`src/app/admin/(panel)/landing/...`** (hero, banners, seleccion, y las que existan: footer, etc.)
  - Añadir una nota: "El panel está bajo el route group **`(panel)`**; las URLs públicas siguen siendo **/admin**, **/admin/productos**, etc."

- **Login**  
  - Dejar: "Página de login — **`src/app/admin/login/page.tsx`**. No usa el layout del panel (está fuera de `(panel)`)."

- **Componentes del admin**  
  - Mantener que viven en **`src/features/admin/components/`** y que usan **`shared/ui`** y tokens del proyecto.

- **APIs y datos**  
  - Donde se mencione "GET /api/admin/...", comprobar que coincidan con vuestras rutas (ej. **`/api/admin/pedidos/stats`**) y, si usáis **formatCLP** / **formatDate**, indicar: "Usar **`src/shared/utils/formatters.ts`** (formatCLP, formatDate)."

Así el prompt 4.5 describe el admin tal como está estructurado en el proyecto.

---

## Resumen en una frase por prompt

- **4.1:** En el doc, quitar `tailwind.config.ts` y poner que Tailwind v4 se configura en **`globals.css`** con `@theme` y variables; mantener el resto de componentes y cva.
- **4.2:** En el doc, usar **`admin/(panel)/layout.tsx`**, imports **`@/integrations/drizzle`** (y schema), rutas reales del sidebar, API de banners con **`metadata`** en DB, y **useCartSummary().totalItems** (o itemCount).
- **4.3:** En el doc, definir una sola ruta de listado (**/productos** con `(store)/productos/page.tsx` o **/catalogo** con `catalogo/page.tsx`), enlaces a **/productos/[slug]**, y migración **header_image_url** en `categories`.
- **4.4:** En el doc, detalle en **productos/[slug]**, carrito usando **addItem** (y **updateQuantity** para cantidad, o extender addItem según lo que elijáis), checkout con **CreateOrderSchema** actual **sin** paymentMethod en el body y flujo Tarjeta vía crear-sesion; galería con radius 2px.
- **4.5:** En el doc, todas las rutas del panel como **`admin/(panel)/...`**, login en **admin/login**, y referencias a **formatters** y APIs reales.

Si quieres, el siguiente paso puede ser un “diff” frase por frase para cada archivo (por ejemplo solo el 4.1 o el 4.2) para que puedas copiar/pegar en los `.md`.

---

**User**

me darias un resuemn tambien, para que claude entienda donde fue lo que paso?

---

**Cursor**

Aquí tienes un **resumen para Claude** que puede usar como contexto:

---

# Resumen de contexto — Fase 4 y prompts (Crecer Librería)

## De qué va el proyecto

- **Proyecto:** Crecer Librería Cristiana — e-commerce (Next.js, App Router, Drizzle, Zustand, Getnet, etc.).
- **Fases:** 1–3 ya hechas (backend, APIs, admin, carrito, checkout atómico). **Fase 4** es el frontend público + design system y aún **no está hecha**.
- **Objetivo de la conversación:** No adaptar el código a los prompts, sino **adaptar los documentos de los prompts** (en `docs/`) para que describan usar **lo que el proyecto ya tiene** (rutas, Tailwind v4, imports, store, schema, etc.).

## Decisiones tomadas

1. **Orden de trabajo:** Fase 4 se hace en orden: 4.1 → 4.2 → 4.3 → 4.4 → 4.5.
2. **Fuente de verdad:** El **proyecto actual** es la referencia; los prompts en `docs/` deben modificarse para que quien los ejecute use rutas, convenciones y código existentes, sin asumir estructura antigua (p. ej. Tailwind v3, rutas distintas).
3. **Tailwind:** El proyecto usa **Tailwind v4** (`@import "tailwindcss"` en `globals.css`). No hay `tailwind.config.ts`. Los prompts no deben pedir crear `tailwind.config.ts`; deben indicar definir tokens en **CSS** (`globals.css` con `@theme` / variables).

## Estado del proyecto (lo que ya existe)

- **Estructura:**  
  - Tienda: `src/app/(store)/` (page, productos, categorias, carrito, checkout).  
  - Admin: `src/app/admin/(panel)/` (layout, page, productos, categorias, pedidos, landing/hero, landing/banners, landing/seleccion).  
  - Login fuera del panel: `src/app/admin/login/`.
- **Drizzle:** Se importa como `@/integrations/drizzle` (barrel); schema desde `@/integrations/drizzle/schema` (o el patrón que usen). No usar `@/integrations/drizzle/client` en los prompts.
- **Carrito:** Store en `src/features/carrito/store.ts`; hooks en `src/features/carrito/hooks.ts`. `addItem(item)` no recibe cantidad; siempre suma 1 o mergea. `useCartSummary()` devuelve `totalItems` e `itemCount`.
- **Checkout:** Schema en `src/features/checkout/schemas.ts`. `CreateOrderSchema` tiene `items`, `customer`, `deliveryMethod`, `address` (opcional), `couponCode` (opcional). **No** incluye `paymentMethod`. La API de órdenes no persiste método de pago en el insert actual.
- **Banners/Footer:** Tabla `banners` existe; **no** tiene campo `metadata` (jsonb). Los prompts que hablen del footer deben indicar que hace falta esa columna (o que la API devuelva esos datos de otra forma).
- **Categorías:** Schema en `src/integrations/drizzle/schema/categories.ts`; tiene `imageUrl` pero **no** `header_image_url`; los prompts de 4.3 deben pedir esa migración.
- **Utilidades:** `formatCLP` y `formatDate` en `src/shared/utils/formatters.ts`.

## Cambios acordados en los prompts (por archivo)

- **4.1:** Quitar toda referencia a `tailwind.config.ts`. Indicar que el proyecto usa Tailwind v4 y que los tokens (colores, fuentes, radius) se definen en `src/app/globals.css` con `@theme`/variables. Mantener el resto (componentes shared/ui, cva, useScrollReveal).
- **4.2:** Usar layout del panel en **`src/app/admin/(panel)/layout.tsx`** (no `admin/layout.tsx`). Imports de Drizzle: `@/integrations/drizzle` y schema como en el proyecto. CartPanel: contador con `useCartSummary().totalItems` (o `itemCount`). Footer: API banners con `position=footer_illustration`; DB con `metadata` jsonb en `banners` para parámetros del footer.
- **4.3:** Definir una sola convención de ruta para el listado: o bien **`/productos`** y `(store)/productos/page.tsx`, o bien **`/catalogo`** y `(store)/catalogo/page.tsx`. Enlaces a detalle: **`/productos/[slug]`**. Incluir migración que agregue **`header_image_url`** en `categories`.
- **4.4:** Detalle de producto en **`(store)/productos/[slug]/page.tsx`**. AddToCart: usar store actual; si se necesita cantidad, o bien “addItem + updateQuantity” o bien “extender addItem(item, quantity?)” y dejarlo explícito en el prompt. Checkout: usar `CreateOrderSchema` actual; no enviar `paymentMethod` en el body; método de pago solo para flujo (tarjeta → crear-sesion + redirect; resto → confirmación). Galería: border-radius 2px para consistencia.
- **4.5:** Todas las rutas del panel como **`admin/(panel)/...`**; login en `admin/login`. Referencias a `formatters` y APIs reales del proyecto.

## Qué tiene que hacer Claude (si sigue con esto)

1. **Si va a editar los prompts:** Aplicar en cada `docs/Prompt-Tarea-4_X-....md` los cambios listados arriba para que los prompts reflejen el proyecto actual (Tailwind v4, rutas `(panel)`, imports Drizzle, store sin cantidad en addItem, schema sin paymentMethod, banners con metadata, categorías con header_image_url, formatters).
2. **Si va a implementar la Fase 4:** Seguir los prompts **ya modificados** (o este resumen) para no crear `tailwind.config.ts`, no asumir rutas distintas a `(store)` y `admin/(panel)`, y usar el store y el schema tal como están descritos aquí.

## Archivos clave

- Prompts: `docs/Prompt-Tarea-4_1-Tokens-Base.md`, `4_2-Navbar-Footer-Layouts.md`, `4_3-Home-Catalogo (1).md`, `4_4-Producto-Carrito-Checkout.md`, `4_5-Admin-Design-System.md`.
- Plan general: `docs/PLANIFICACION.md`.
- Código de referencia: `src/app/(store)/`, `src/app/admin/(panel)/`, `src/features/carrito/`, `src/features/checkout/schemas.ts`, `src/integrations/drizzle/`, `src/app/globals.css`.

Con esto Claude puede entender qué pasó y seguir ya sea corrigiendo los prompts o implementando la Fase 4 alineada al proyecto.

---

**User**

@docs/Prompt-Tarea-4_1-Tokens-Base-v2.md analiza la version 2 de la tarea 4,1 y dime si ya quedo ajustado. Por mi parte estoy ajustando las otras tareas

---

**Cursor**

Revisé **`docs/Prompt-Tarea-4_1-Tokens-Base-v2.md`**. Está bien alineado al proyecto. Resumen:

---

## Lo que quedó bien ajustado

1. **Tailwind v4**
   - Dice explícitamente que el proyecto usa Tailwind v4, que no existe `tailwind.config.ts` y que no se usan las directivas antiguas.
   - La configuración se hace en `src/app/globals.css` con `@import "tailwindcss"` y `@theme`.

2. **globals.css**
   - Respeta lo existente: “No eliminar la directiva @import \"tailwindcss\"” y “solo incorporar los tokens”.
   - Orden claro: directiva Tailwind → fuentes → `@theme` → `:root` → reset → scrollbar → `.reveal`.
   - Incluye nota sobre respetar la sintaxis actual del proyecto si el `@theme` es distinto.

3. **Tokens**
   - `@theme` con prefijos v4 (`--color-*`, `--font-*`, `--radius*`, `--text-eyebrow`).
   - `:root` con variables sin prefijo para `var()` en inline/CSS.
   - Paleta, tipografías y radius coinciden con lo acordado.

4. **Dependencia**
   - Instalación de `class-variance-authority` indicada y que el proyecto aún no la tiene.

5. **Componentes y hooks**
   - Button (cva), Badge, Input, SectionHeader, Separator y “crear también Textarea” con los mismos estilos.
   - Hook `useScrollReveal` y `useScrollRevealMultiple` en `shared/hooks`.
   - Exports en `shared/ui/index.ts` y `shared/hooks/index.ts`.

6. **Reglas importantes**
   - Vuelve a decir que no crear ni modificar `tailwind.config.ts`, no Navbar/Footer, no páginas/layouts, no tocar Fases 1–3.

No hay referencias a `tailwind.config.ts` ni a Tailwind v3. El prompt está listo para usarse con el proyecto actual.

---

## Detalle opcional (claridad)

En el punto 3, el export dice:

```ts
export { Input, Textarea } from './Input'
```

Eso implica que **Textarea** vive en el mismo módulo que **Input** (p. ej. en `Input.tsx`). El texto “Crear también `Textarea.tsx`” puede leerse como “archivo aparte”. Para evitar dudas, podrías cambiar a algo como:

- “Crear también el componente **Textarea** en el mismo archivo que Input (`Input.tsx`), con los mismos estilos visuales pero para `<textarea>`, y exportar ambos desde ese módulo.”

Es solo aclaración; quien implemente puede deducirlo del bloque de exports.

---

**Conclusión:** La v2 del prompt 4.1 está ajustada al proyecto (Tailwind v4, globals.css, sin config, cva, componentes y hooks). Puedes usarla tal cual; el único ajuste sugerido es la aclaración de Textarea en el mismo archivo que Input si quieres evitar ambigüedad.

---

**User**

Lo usaras tu en su debido momento asique, te sugieres a ti mismo eso.

---

**Cursor**

Cuando toque implementar la 4.1, tendré en cuenta que **Textarea** va en el mismo módulo que **Input** (`Input.tsx`) y que ambos se exportan desde ahí, aunque el prompt diga “Crear también Textarea.tsx”. No hace falta cambiar el doc; lo aplico yo en su momento.

---

**User**

@docs/Prompt-Tarea-4_2-Navbar-Footer-Layouts-v2.md revisar tarea 4.2 version 2

---

**Cursor**

Revisé **`docs/Prompt-Tarea-4_2-Navbar-Footer-Layouts-v2.md`**. Está bien alineado al proyecto.

---

## Lo que quedó bien ajustado

1. **Layout del panel admin**  
   - Ruta correcta: **`src/app/admin/(panel)/layout.tsx`**.  
   - Aclara que el route group `(panel)` no cambia las URLs (`/admin`, `/admin/productos`, etc.) y que el login está fuera del group.

2. **Imports de Drizzle**  
   - Usa **`@/integrations/drizzle`** (barrel).  
   - Nota explícita: no usar `@/integraciones/drizzle/client`.  
   - Indica ajustar al proyecto si el schema se importa como namespace (`schema.categories`) u otra convención.

3. **CartPanel / Navbar y Zustand**  
   - Contador del carrito con **`useCartSummary()`** de `src/features/carrito/hooks.ts`, mostrando **`totalItems`** (o `itemCount` si se prefiere, manteniendo consistencia).  
   - CartPanel usa **`useCart()`** y **`useCartSummary()`** para acciones y totales.

4. **Footer y API de banners**  
   - Footer llama a **`GET /api/landing/banners?position=footer_illustration`**.  
   - Respuesta con **`metadata`** cuando exista; si no, usar defaults.  
   - Tipo **`FooterBannerMetadata`** y defaults definidos.

5. **Migración `banners.metadata`**  
   - Indica que la tabla **no tiene** el campo y que la tarea incluye añadir **`metadata` (jsonb)** en `src/integrations/drizzle/schema/landing.ts` y ejecutar generate + migrate.

6. **Layout de la tienda**  
   - **`src/app/(store)/layout.tsx`**, Server Component, categorías con Drizzle y paso por prop al Navbar; no padding extra.

7. **Navegación del sidebar**  
   - Rutas coherentes con la estructura actual: `/admin`, `/admin/pedidos`, `/admin/productos`, `/admin/categorias`, `/admin/landing/hero`, `/admin/landing/banners`, `/admin/landing/seleccion`, `/admin/landing/footer`, `/admin/cupones`.  
   - Uso de **`usePathname()`** y **`startsWith`** para el ítem activo en rutas anidadas.

8. **Reglas importantes**  
   - Refuerzan: layout admin en `(panel)/layout.tsx`, login fuera del group, Drizzle vía barrel, migración de `metadata` en esta tarea, sin tocar APIs ni store de Fases 1–3.

No hay referencias a `admin/layout.tsx` ni a imports incorrectos de Drizzle. El prompt está listo para usarse.

---

## Detalle opcional (import del schema)

En el proyecto, el barrel es:

```ts
export { db } from "./client";
export * as schema from "./schema";
```

No hay `categories` exportado directamente desde el barrel; las tablas van en **`schema`**. Quien implemente puede usar, por ejemplo:

- `import { db, schema } from '@/integrations/drizzle'` y luego `schema.categories`,  
o  
- Si existe otro archivo que reexporte `categories`, usar ese.  

El prompt ya dice “ajustar el import según la convención del proyecto”, así que está cubierto. Cuando toque implementar la 4.2, usaré `schema.categories` (o la convención que tenga el repo) según el barrel actual.

**Conclusión:** La v2 del prompt 4.2 está ajustada al proyecto; no hace falta cambiar nada obligatorio. El único detalle es recordar el import vía `schema` cuando se implemente.

---

**User**

El detalle lo recoerdaras para hacerlo corretamente, recuerda que seras tu el que hara implementara estas tareas

---

**Cursor**

Sí. Cuando implemente la 4.2 recordaré:

- **Drizzle en el layout de la tienda:** usar el barrel `@/integrations/drizzle`; las tablas van en el namespace `schema` (p. ej. `import { db, schema } from '@/integrations/drizzle'` y luego `schema.categories` para la query de categorías), no `@/integrations/drizzle/client` ni un import directo de `categories` desde el barrel.

Lo tendré en cuenta al hacer la tarea 4.2.

---

**User**

@docs/Prompt-Tarea-4_3-Home-Catalogo-v2.md revisar tarea 4.3 v2

---

**Cursor**

Revisé **`docs/Prompt-Tarea-4_3-Home-Catalogo-v2.md`**. Está bien alineado al proyecto.

---

## Lo que quedó bien ajustado

1. **Ruta del listado**  
   - Listado en **`/productos`** y archivo **`src/app/(store)/productos/page.tsx`**.  
   - Indica explícitamente: no crear `/catalogo` y que todos los enlaces al listado usen `/productos`.  
   - Reglas lo repiten.

2. **ProductCard**  
   - Clic en la card (fuera del botón) → **`/productos/{slug}`**.  
   - Store: `addItem` del carrito vía `src/features/carrito/store.ts` y hooks; recibe el ítem y agrega 1 unidad (o incrementa 1 si ya existe). Sin parámetro de cantidad.  
   - Animación con `useScrollReveal` de `src/shared/hooks/`.

3. **CategoryCard**  
   - Link a **`/productos?cat={slug}`** (no `/catalogo`).

4. **Migración `header_image_url`**  
   - Indica que la tabla **no tiene** el campo.  
   - Añadir en **`src/integrations/drizzle/schema/categories.ts`** y ejecutar generate + migrate.  
   - Reglas: migración obligatoria para que PageHeader pueda usarlo.

5. **PageHeader**  
   - `activeCategory`: `'todos' | slug`; categorías con `headerImageUrl` opcional.  
   - Pills y URL con `?cat=`.

6. **Home y Productos – fetch**  
   - Uso de **`process.env.NEXT_PUBLIC_APP_URL`** en las URLs de fetch para que funcionen en server.  
   - APIs listadas: landing/hero, productos/novedades, categorias/destacadas, landing/seleccion, productos, categorias.

7. **LibrosMesSection**  
   - Enlaces a **`/productos/{slug}`**.

8. **Utilidades**  
   - **`formatCLP`** desde **`src/shared/utils/formatters.ts`**, sin redefinir.

9. **Excepciones de diseño**  
   - Hero con **border-radius: 16px** como única excepción al sistema 2px.  
   - No crear en esta tarea detalle, carrito ni checkout (Tarea 4.4).  
   - No tocar Fases 1–3 ni layouts de 4.2.

10. **Reglas**  
   - Resumen claro: rutas `/productos` y `/productos?cat=`, detalle `/productos/{slug}`, addItem sin cantidad, migración obligatoria, formatCLP desde formatters.

No hay referencias a `/catalogo` como ruta del listado ni a `addItem` con cantidad. El prompt está listo para implementar.

---

## Detalles para cuando implemente la 4.3

- **Forma de la respuesta de las APIs:** El prompt asume por ejemplo `productos.data`, `productos.pagination.total`, `productos.pagination.totalPages` y `categorias.data`. Al implementar, comprobar la forma real de **GET /api/productos** y **GET /api/categorias** (si devuelven `{ data, pagination }` o distinto) y mapear en la página si hace falta.
- **TanStack Query:** Se menciona para filtros dinámicos en la página de productos. Si en el proyecto aún no está `@tanstack/react-query`, habrá que añadirlo o usar la alternativa que prefieras (p. ej. `router.push` + `revalidatePath` o similar).

Con eso, la v2 del prompt 4.3 queda revisada y alineada al proyecto; esos dos puntos los tendré en cuenta al implementar.

---

**User**

@docs/Prompt-Tarea-4_4-Producto-Carrito-Checkout-v2.md Revisar

---

**Cursor**

Revisé **`docs/Prompt-Tarea-4_4-Producto-Carrito-Checkout-v2.md`**. Está bien alineado al proyecto.

---

## Lo que quedó bien ajustado

1. **Ruta detalle de producto**  
   - **`src/app/(store)/productos/[slug]/page.tsx`** indicada de forma explícita.

2. **AddToCartButton y store (cantidad)**  
   - El store no acepta cantidad en `addItem`.  
   - Estrategia descrita: `addItem(item)` y, si `qty > 1`, llamar **`updateQuantity(product.id, qty)`**.  
   - Código de ejemplo con ese patrón y uso de **`useCart`** de `src/features/carrito/hooks.ts`.

3. **CreateOrderSchema y método de pago**  
   - Se aclara que el schema **no incluye `paymentMethod`** y que el método de pago es solo lógica de frontend.  
   - El body del POST a `/api/ordenes` se arma sin `paymentMethod`.  
   - Flujo: si "tarjeta" → POST crear-sesion y redirección a `processUrl`; si no → ir a confirmación con `status=pending`.

4. **ProductGallery**  
   - Imagen principal y thumbnails con **border-radius: 2px** (nota explícita de consistencia con el sistema).

5. **Confirmación**  
   - Query params `?order=` y `?status=paid|pending`; mensajes según status; "Seguir explorando" → **`/productos`**.

6. **404**  
   - **`src/app/not-found.tsx`** con diseño definido; "Ver colección" → **`/productos`**.

7. **Rutas y enlaces**  
   - Reglas: todos los enlaces al listado usan **`/productos`**, nunca `/catalogo`.

8. **Carrito y cupón**  
   - Cupón: POST `/api/cupones/validar` con `{ code, subtotal }` y **`applyCoupon(code, discount)`** en el store.  
   - **`clearCart()`** solo después de respuesta exitosa del backend (orden creada).

9. **Utilidades y componentes**  
   - **`formatCLP`** desde **`src/shared/utils/formatters.ts`**.  
   - **ProductCard** de la tarea 4.3 para relacionados y recomendaciones.

10. **Prerrequisitos y reglas**  
   - APIs, store, hooks y schema citados con rutas correctas.  
   - No modificar Fases 1–3 ni componentes de 4.1–4.3.

No hay referencias a `paymentMethod` en el schema ni a `addItem` con cantidad. El prompt está listo para implementar.

---

**Conclusión:** La v2 del prompt 4.4 está ajustada al proyecto; no hace falta cambiar nada.

---

**User**

@docs/Prompt-Tarea-4_5-Admin-Design-System-v2.md revisa la ultima tarea

---

**Cursor**

Revisé **`docs/Prompt-Tarea-4_5-Admin-Design-System-v2.md`**. Está bien alineado al proyecto.

---

## Lo que quedó bien ajustado

1. **Estructura del admin**  
   - Sección "Estructura del admin en el proyecto": route group **`(panel)`**, páginas en **`src/app/admin/(panel)/`**, URLs públicas sin cambios.  
   - Login **fuera** del group: **`src/app/admin/login/page.tsx`**, sin sidebar.

2. **Rutas de archivos**  
   - Dashboard: **`src/app/admin/(panel)/page.tsx`**  
   - Productos, categorías, pedidos: **`(panel)/productos/`, `categorias/`, `pedidos/`**  
   - Landing: **`(panel)/landing/`** con índice, **hero**, **banners**, **seleccion**, **footer**  
   - Reglas: "Todas las páginas del panel admin están en `src/app/admin/(panel)/`".

3. **Login**  
   - Página standalone, POST `/api/admin/auth/login`, redirección a `/admin`, error 401 con banner.

4. **Utilidades**  
   - **formatCLP** y **formatDate** desde **`src/shared/utils/formatters.ts`** (reglas y ejemplos en listado/detalle de pedidos).

5. **APIs**  
   - Pedidos: GET stats, GET listado, PUT `[id]/estado`.  
   - Landing: GET/PUT hero, banners, seleccion; footer con `banners.metadata`.  
   - Nota: "Verificar que las rutas coincidan con las implementadas en la Fase 3".

6. **Campo header_image_url**  
   - En formulario de categorías se indica que la "Imagen de header" se guarda en **header_image_url** (Tarea 4.3).

7. **Componentes admin**  
   - En **`src/features/admin/components/`**: AdminTable, AdminMetricCard, AdminStatusPill, AdminUploadZone, AdminToggle.  
   - Input/Textarea desde **shared/ui/**.

8. **Border radius**  
   - 2px en todo el admin; **AdminStatusPill** como excepción con 20px.

9. **Toast**  
   - **`src/shared/ui/Toast.tsx`** y hook **`useToast`** en **`src/shared/hooks/useToast.ts`**, con exports en los index.

10. **Reglas**  
   - No tocar lógica (solo JSX y estilos), mantener React Hook Form + Zod, layout `(panel)/layout.tsx` con sidebar visible.

No hay referencias a rutas sin `(panel)` ni a utilidades en otra ruta. El prompt está listo para implementar.

---

**Conclusión:** La v2 del prompt 4.5 está ajustada al proyecto; no hace falta cambiar nada. Con esto, los cinco prompts de la Fase 4 (4.1–4.5 v2) están revisados y alineados.

---

**User**

Tarea 4.1 — Tokens de diseño y componentes base (shared/ui)
Contexto
Este es el primer paso de la Fase 4 del proyecto Crecer Librería Cristiana. Las Fases 1–3 están completamente implementadas y validadas — el backend está funcional con APIs, auth admin, CRUD, checkout atómico y Getnet. Ahora comenzamos el frontend público.
Esta tarea es la fundación visual de todo el proyecto. Sin ella no se puede construir ningún componente ni página. El objetivo es crear el sistema de diseño completo — tokens, estilos globales y componentes atómicos — que todas las demás tareas de la Fase 4 consumirán.
Decisiones de diseño ya tomadas
El sistema visual fue revisado y aprobado con el diseñador. Los valores que se listan a continuación son definitivos — NO usar los valores originales del HTML del diseñador que difieren de estos.
Paleta de tokens
beige:       #F5F3E8   → fondo base del sitio
beige-warm:  #EDE9D4   → footer, cards secundarias, superficies cálidas
beige-mid:   #E0DBB8   → bordes suaves, separadores
white:       #FAF9F4   → superficie elevada, secciones blancas
moss:        #736002   → botones primarios, íconos, detalles de marca
moss-mid:    #8A7302   → hover de moss
gold:        #C8A830   → acento principal — precios, badges, eyebrows, cruz del logo
gold-light:  #D4B840   → hover de gold
gold-pale:   #E8D060   → fondos dorados muy suaves
text:        #3A3001   → cuerpo principal
text-mid:    #6B5A04   → textos secundarios
text-light:  #8A7830   → labels, hints, placeholders
border:      rgba(115,96,2,0.13)    → borde estándar
border-gold: rgba(200,168,48,0.3)   → borde dorado decorativo
Colores de estado (solo se usan en el panel admin):
success: #27AE60
error:   #C0392B
info:    #2980B9
warning: #E67E22
Tipografías

EB Garamond — títulos, nombres de marca, precios totales, citas, blockquotes. Pesos: 400 y 500.
DM Sans — todo lo demás: cuerpo, navegación, botones, labels, inputs. Pesos: 300, 400, 500.

Border radius

2px en absolutamente todo el sistema — inputs, botones, cards, badges, modales.
Única excepción: el contenedor del hero principal usa 16px.


Lo que necesito que hagas
1. Configurar los tokens en globals.css (Tailwind v4)
IMPORTANTE: El proyecto usa Tailwind v4. No existe tailwind.config.ts ni directivas @tailwind base/components/utilities. La configuración se hace íntegramente dentro de src/app/globals.css usando @import "tailwindcss" y el bloque @theme de Tailwind v4.
Abrir src/app/globals.css (que ya existe con contenido inicial) y añadir o reemplazar las secciones necesarias. No eliminar la directiva @import "tailwindcss" ni ninguna otra regla de Tailwind v4 que ya exista — solo incorporar los tokens del design system.
El archivo resultante debe contener, en este orden:
css/* 1. Directiva Tailwind v4 — mantener la que ya existe en el proyecto */
@import "tailwindcss";

/* 2. Importación de fuentes */
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');

/* 3. Tokens del design system — bloque @theme de Tailwind v4 */
@theme {
  /* Colores */
  --color-beige:       #F5F3E8;
  --color-beige-warm:  #EDE9D4;
  --color-beige-mid:   #E0DBB8;
  --color-white:       #FAF9F4;
  --color-moss:        #736002;
  --color-moss-mid:    #8A7302;
  --color-gold:        #C8A830;
  --color-gold-light:  #D4B840;
  --color-gold-pale:   #E8D060;
  --color-text:        #3A3001;
  --color-text-mid:    #6B5A04;
  --color-text-light:  #8A7830;

  /* Estados — solo admin */
  --color-success: #27AE60;
  --color-error:   #C0392B;
  --color-info:    #2980B9;
  --color-warning: #E67E22;

  /* Tipografías */
  --font-serif: "EB Garamond", Georgia, serif;
  --font-sans:  "DM Sans", system-ui, sans-serif;

  /* Border radius */
  --radius:      2px;
  --radius-sm:   2px;
  --radius-md:   2px;
  --radius-lg:   2px;
  --radius-xl:   2px;
  --radius-hero: 16px;

  /* Font size eyebrow */
  --text-eyebrow: 9px;
}

/* 4. Variables CSS globales — para uso directo con var() en estilos inline y CSS custom */
:root {
  --beige:       #F5F3E8;
  --beige-warm:  #EDE9D4;
  --beige-mid:   #E0DBB8;
  --white:       #FAF9F4;
  --moss:        #736002;
  --moss-mid:    #8A7302;
  --gold:        #C8A830;
  --gold-light:  #D4B840;
  --gold-pale:   #E8D060;
  --text:        #3A3001;
  --text-mid:    #6B5A04;
  --text-light:  #8A7830;
  --border:      rgba(115,96,2,0.13);
  --border-gold: rgba(200,168,48,0.3);
}

/* 5. Reset y base */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'DM Sans', sans-serif;
  background: var(--beige);
  color: var(--text);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* 6. Scrollbar personalizado */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--beige-mid); border-radius: 2px; }

/* 7. Animación de entrada — scroll reveal */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.8s cubic-bezier(0.22,1,0.36,1),
              transform 0.8s cubic-bezier(0.22,1,0.36,1);
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
Notas sobre Tailwind v4 y el bloque @theme:

Los tokens definidos en @theme generan automáticamente clases de utilidad. Por ejemplo, --color-moss genera bg-moss, text-moss, border-moss, etc.
El prefijo --color- es el estándar de Tailwind v4 para colores; --font- para tipografías; --radius- para border-radius.
Las variables CSS en :root (sin prefijo --color-) se mantienen en paralelo para poder usarlas con var(--moss) en estilos inline, propiedades CSS custom y componentes que no usen clases de Tailwind.
Si el globals.css del proyecto ya tiene una sintaxis ligeramente diferente para el @theme (por ejemplo, con inline o sin él), respetar la sintaxis existente y solo agregar los tokens que falten.


2. Instalar dependencia
Instalar class-variance-authority para gestionar las variantes de los componentes. El proyecto no la tiene aún:
bashnpm install class-variance-authority

3. Crear los componentes atómicos en src/shared/ui/

Button.tsx
Componente base de botones con todas las variantes del sistema.
Variantes requeridas (basadas en el HTML del diseñador):

primary — fondo gold, texto blanco. Para CTAs principales del hero y carrito.

  background: var(--gold) | hover: var(--gold-light) | hover: translateY(-1px)
  padding: 13px 32px | font-size: 12px | font-weight: 500
  letter-spacing: 0.1em | text-transform: uppercase | border-radius: 2px

moss — fondo moss, texto blanco. Para el botón de checkout y acciones admin.

  background: var(--moss) | hover: var(--moss-mid) | hover: translateY(-1px)
  Mismas propiedades tipográficas que primary

outline — borde moss, texto moss, fondo transparente. Para acciones secundarias.

  border: 1px solid var(--moss) | color: var(--moss) | background: transparent
  hover: background var(--moss), color white

ghost — solo texto con borde inferior. Para "Ver todos →" y links de navegación.

  color: var(--moss) | border-bottom: 1px solid transparent
  hover: border-bottom-color: var(--moss)
  font-size: 12px | font-weight: 500 | letter-spacing: 0.08em | uppercase

add-to-cart — variante del overlay de las cards de producto.

  background: var(--gold) | color: white | border: none
  padding: 9px 18px | font-size: 10px | font-weight: 500
  hover: background var(--gold-light) | transform: scale(1.03)

secondary — solo para contexto oscuro (dentro del hero). Texto blanco con borde inferior.

  color: rgba(255,255,255,0.72) | border-bottom: 1px solid rgba(255,255,255,0.25)
  hover: color var(--gold-light), border-color var(--gold-light)
Props del componente:
typescriptinterface ButtonProps {
  variant?: 'primary' | 'moss' | 'outline' | 'ghost' | 'add-to-cart' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  as?: 'button' | 'a'   // para usar como link
  href?: string
  onClick?: () => void
  children: React.ReactNode
  className?: string
}
Implementar con cva de class-variance-authority. Los estilos de cada variante pueden aplicarse como clases de Tailwind (usando los tokens definidos en @theme, por ejemplo bg-moss, text-gold) o como style inline usando var(). Usar el método que dé código más limpio — lo importante es que los valores vengan siempre de los tokens y no sean colores hardcodeados.
El componente debe ser un Client Component ('use client') solo si tiene interactividad propia; si no, puede ser un Server Component.

Badge.tsx
Componente para etiquetas de estado sobre las cards de producto y en el admin.
Variantes:

new — fondo gold, texto blanco. Para productos nuevos.

  background: var(--gold) | color: white
  font-size: 8px | font-weight: 600 | letter-spacing: 0.1em | uppercase
  padding: 3px 8px | border-radius: 1px

sale — fondo moss, texto blanco. Para productos en oferta.

  background: var(--moss) | color: white
  Mismas propiedades tipográficas

success — para estados de pedido en admin.

  background: rgba(39,174,96,0.10) | color: #27AE60
  border: 1px solid rgba(39,174,96,0.25)

error — para estados cancelados.

  background: rgba(192,57,43,0.08) | color: #C0392B
  border: 1px solid rgba(192,57,43,0.2)

warning — para estados pendientes.

  background: rgba(230,126,34,0.08) | color: #E67E22
  border: 1px solid rgba(230,126,34,0.2)

info — para estados en preparación.

  background: rgba(41,128,185,0.08) | color: #2980B9
  border: 1px solid rgba(41,128,185,0.2)
Props:
typescriptinterface BadgeProps {
  variant: 'new' | 'sale' | 'success' | 'error' | 'warning' | 'info'
  children: React.ReactNode
  className?: string
}

Input.tsx
Componente base de inputs para formularios del checkout y admin.
Especificación visual (del checkout.html):
padding: 10px 14px
border: 1px solid var(--border)
border-radius: 2px
font-family: DM Sans | font-size: 14px
color: var(--text) | background: var(--white)
outline: none
transition: border-color 0.22s, box-shadow 0.22s

focus:
  border-color: var(--gold)
  box-shadow: 0 0 0 3px rgba(200,168,48,0.1)

error:
  border-color: var(--error) → #C0392B

placeholder:
  color: var(--text-light)
El label asociado tiene:
font-size: 10px | letter-spacing: 0.18em | text-transform: uppercase
color: var(--text-light)
Props:
typescriptinterface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  wrapperClassName?: string
}
Crear también Textarea.tsx con los mismos estilos visuales pero para <textarea>.

SectionHeader.tsx
Composición de eyebrow + título + descripción opcional. Aparece en todas las secciones del landing.
Especificación visual (del index.html):
/* Eyebrow */
font-family: DM Sans
font-size: 9px | letter-spacing: 0.35em | text-transform: uppercase
color: var(--gold)
display: flex | align-items: center | gap: 12px
::before → width: 24px, height: 1px, background: var(--gold)

/* Título */
font-family: EB Garamond
font-size: clamp(28px, 2.8vw, 42px) | font-weight: 400
color: var(--moss) | line-height: 1.15 | letter-spacing: -0.01em

/* Descripción */
font-size: 14px | color: var(--text-light)
line-height: 1.75 | max-width: 400px | font-weight: 300
margin-top: 12px
Props:
typescriptinterface SectionHeaderProps {
  eyebrow?: string
  title: string
  titleEm?: string        // texto en <em> para la parte en cursiva del título
  description?: string
  align?: 'left' | 'center'
  className?: string
}

Separator.tsx
Línea decorativa que aparece en el footer y secciones con fondo moss.
width: 100% | height: 1px
background: linear-gradient(to right, transparent, rgba(200,168,48,0.3), transparent)

4. Crear el hook useScrollReveal
Ubicación: src/shared/hooks/useScrollReveal.ts
Este hook implementa el patrón de animación de entrada por scroll que el diseñador usa en todos los cards y secciones del landing.
typescript// El hook debe:
// 1. Aceptar una ref de elemento HTML
// 2. Usar IntersectionObserver con threshold: 0.07 y rootMargin: '0px 0px -36px 0px'
// 3. Agregar la clase 'visible' cuando el elemento entra en viewport
// 4. Hacer unobserve después de la primera aparición (animación solo ocurre una vez)

// Uso esperado en componentes:
// const ref = useScrollReveal()
// <div ref={ref} className="reveal">...</div>
También crear useScrollRevealMultiple para aplicarlo a una lista de elementos con delays escalonados automáticos.

5. Crear archivos de exportación
src/shared/ui/index.ts — re-exportar todos los componentes:
typescriptexport { Button } from './Button'
export { Badge } from './Badge'
export { Input, Textarea } from './Input'
export { SectionHeader } from './SectionHeader'
export { Separator } from './Separator'
src/shared/hooks/index.ts — re-exportar hooks:
typescriptexport { useScrollReveal, useScrollRevealMultiple } from './useScrollReveal'

Reglas importantes

El proyecto usa Tailwind v4 — no crear ni modificar tailwind.config.ts. Todos los tokens van en globals.css dentro del bloque @theme. No existe ese archivo en el proyecto y no debe crearse.
Todos los tokens de color usan los valores definitivos aprobados, NO los valores originales del HTML del diseñador (que difieren en el gold y el beige).
Los componentes de shared/ui/ no tienen colores hardcodeados. Usar clases de Tailwind generadas por @theme (ej. bg-moss, text-gold) o variables CSS con var(). Nunca valores de color literales dentro del JSX o CSS modules.
border-radius: 2px en absolutamente todo. En Tailwind v4, si --radius está definido como 2px en @theme, la clase rounded aplicará 2px. Verificar que esto funcione; si no, usar style={{ borderRadius: '2px' }} o la clase específica del proyecto.
NO crear componentes de Navbar ni Footer — eso es la Tarea 4.2.
NO crear páginas ni layouts — eso es la Tarea 4.2.
NO modificar ningún archivo de las Fases 1–3 — ni schemas de Drizzle, ni API Routes, ni el store de Zustand.
Los componentes deben funcionar tanto en Server Components como en Client Components, a menos que necesiten estado propio (en ese caso son Client Components con 'use client').
Cada componente debe tener sus tipos TypeScript definidos con interface, no type.
Verificar que tsc --noEmit pase sin errores al finalizar.

Recordar el detalle a tener en cuenta en la tarea 4.1

---

**Cursor**

Voy a implementar la Tarea 4.1 sobre la base actual del proyecto: primero reviso el skill de frontend y los archivos clave (`globals.css`, `shared/ui`, `shared/hooks`, `package.json`) para adaptar los tokens y componentes a Tailwind v4 sin tocar Fases 1–3.

Ya vi la base actual: `globals.css` está mínimo y `shared/ui` / `shared/hooks` están vacíos, así que voy a montar el design system desde cero sobre Tailwind v4, manteniendo el detalle acordado de exportar `Textarea` desde el mismo módulo de `Input`.

Estoy entrando a la parte de implementación: voy a instalar `class-variance-authority`, actualizar `globals.css` con los tokens v4 y crear los componentes/hook base en `shared/ui` y `shared/hooks`, sin tocar APIs ni el store existente.

Estoy escribiendo la base del design system: primero los tokens globales y después los componentes atómicos y hooks para dejar una capa reutilizable limpia antes de verificar TypeScript y lints.

La capa base ya está escrita; ahora voy a validar que compile con TypeScript y revisar lints en los archivos tocados para corregir cualquier incompatibilidad antes de cerrar la tarea.

Implementé la **Tarea 4.1** y dejé lista la base del design system para la Fase 4.

Actualicé `src/app/globals.css` con los tokens aprobados en Tailwind v4 (`@theme` + `:root`), tipografías, reset, scrollbar y clases `.reveal`. También instalé `class-variance-authority` y creé los componentes base en `src/shared/ui`: `Button`, `Badge`, `Input`, `Textarea` (exportado desde `Input.tsx`, como habíamos acordado), `SectionHeader` y `Separator`. Además, agregué `useScrollReveal` y `useScrollRevealMultiple` en `src/shared/hooks`, y actualicé los archivos `index.ts` de `ui` y `hooks`.

Verifiqué con `npx tsc --noEmit` y no quedaron errores de TypeScript ni lints en los archivos tocados.

Siguiente paso natural: continuar con la **Tarea 4.2** (`Navbar`, `CartPanel`, `Footer` y layouts).

---

**User**

Tarea 4.2 — Navbar, Footer y Layouts
Contexto
Este es el segundo paso de la Fase 4 del proyecto Crecer Librería Cristiana. La Tarea 4.1 configuró los tokens de diseño en globals.css (Tailwind v4 con @theme), y creó los componentes atómicos en shared/ui/ (Button, Badge, Input, SectionHeader, Separator) y el hook useScrollReveal.
Ahora construimos los componentes que envuelven todas las páginas — Navbar, CartPanel, Footer — y los layouts base de la tienda pública y del panel admin. Al terminar esta tarea, cualquier página que se cree heredará automáticamente el layout correcto.
Prerequisitos

Tarea 4.1 completada: tokens en globals.css, componentes en shared/ui/, hook useScrollReveal
Los componentes Button y Badge de shared/ui/ ya existen y se importan desde ahí
El store de Zustand del carrito ya existe en src/features/carrito/store.ts con sus hooks en src/features/carrito/hooks.ts
Las APIs de categorías (GET /api/categorias) y banners (GET /api/landing/banners) ya están implementadas


Lo que necesito que hagas
1. Navbar — src/shared/ui/Navbar.tsx
Client Component ('use client'). Aparece en todas las páginas de la tienda pública excepto en su variante simplificada para checkout.
Especificación visual (del index.html y catalogo.html):
/* Contenedor */
position: sticky | top: 0 | z-index: 100
height: 64px | padding: 0 48px
display: flex | align-items: center | justify-content: space-between | gap: 20px
background: rgba(245,243,232,0.95)   ← usa el nuevo --beige con alfa
backdrop-filter: blur(16px)
border-bottom: 1px solid var(--border)
transition: box-shadow 0.3s

/* Al hacer scroll (clase .scrolled) */
box-shadow: 0 2px 24px rgba(58,48,1,0.08)
Logo / marca:
display: flex | align-items: center | gap: 10px
Cruz decorativa: width 28px, height 28px
  ::before → width 1.5px, height 100%, left 50%, background: var(--gold)
  ::after  → width 100%, height 1.5px, top 50%, background: var(--gold)
Nombre: font-family EB Garamond, 18px, weight 500, color: var(--moss)
Subtítulo: DM Sans, 9px, letter-spacing 0.22em, uppercase, color: var(--gold)
Buscador:
flex: 1 | max-width: 300px
Input: padding 8px 36px 8px 16px | background: var(--beige-warm)
border: 1px solid var(--border) | border-radius: 2px
font-size: 13px | color: var(--text)
focus: border-color var(--gold), background var(--white)
Botón lupa: posición absoluta derecha, color var(--text-light), hover: var(--moss)
Links de navegación:
display: flex | gap: 28px | list-style: none
Links: font-size 13px, font-weight 400, letter-spacing 0.04em
color: var(--text-mid) | hover: var(--moss)
Link activo: font-weight 500, color: var(--moss)
Dropdown de categorías:
position: absolute | top: 100% | margin-top: 10px
min-width: 230px | padding: 10px 0
background: rgba(245,243,232,0.98) | backdrop-filter: blur(16px)
border: 1px solid var(--border) | border-radius: 2px
box-shadow: 0 16px 40px rgba(58,48,1,0.12)
Animación: opacity 0→1, visibility, translateY(-8px→0) en 0.22s
Trigger: onMouseEnter/onMouseLeave del item padre
Items: padding 9px 18px, font-size 13px, color var(--text-mid)
hover: background var(--beige-warm), color var(--moss)
Ícono del carrito:
display: flex | align-items: center | gap: 6px
SVG: width 17px, height 17px | color: var(--moss)
hover: opacity 0.7
Badge: background var(--gold), color white, font-size 9px, font-weight 600
width 16px, height 16px, border-radius 50%
El contador del badge usa useCartSummary() del hook de Zustand en src/features/carrito/hooks.ts. La propiedad a mostrar es totalItems (suma de todas las cantidades). Si se prefiere mostrar solo el número de filas distintas, usar itemCount — elegir una y ser consistente en todo el proyecto.
Comportamiento:

Al hacer scroll > 40px, agregar clase que activa la sombra (usar useEffect + scroll listener)
Al hacer clic en el ícono del carrito, abrir/cerrar CartPanel
Cerrar dropdown con Escape
Cerrar CartPanel al hacer clic fuera
Las categorías del dropdown llegan como prop desde el layout Server Component

Props:
typescriptinterface NavbarProps {
  categories?: { id: string; name: string; slug: string }[]
  variant?: 'default' | 'checkout'  // checkout: sin links, sin búsqueda, muestra "← Volver al carrito"
}
Variante checkout (del checkout.html):
Solo muestra: logo | "← Volver al carrito" (link, color var(--text-light))
Sin buscador, sin links de navegación, sin carrito

2. CartPanel — src/shared/ui/CartPanel.tsx
Client Component ('use client'). Panel del carrito que aparece como dropdown al hacer clic en el ícono del carrito de la Navbar.
Especificación visual (del index.html):
/* Contenedor */
position: fixed | top: 72px | right: 24px
width: 320px
background: rgba(245,243,232,0.99)
border: 1px solid var(--border) | border-radius: 2px
box-shadow: 0 20px 48px rgba(58,48,1,0.14)
backdrop-filter: blur(20px)
z-index: 200
Animación open: opacity 0→1, visibility, translateY(-8px→0) en 0.22s ease

/* Header */
padding: 16px 18px 14px
border-bottom: 1px solid var(--border)
Título "Mi carrito": EB Garamond, 16px, weight 500, color var(--moss)
Contador: "X productos" o "Vacío" — DM Sans, 10px, letter-spacing 0.15em, uppercase, color var(--text-light)

/* Lista de items */
max-height: 260px | overflow-y: auto
scrollbar: width 3px, thumb color var(--beige-mid)

/* Item del carrito */
display: flex | align-items: center | gap: 12px | padding: 10px 18px
hover: background var(--beige-warm)

Miniatura del libro:
  width: 34px | aspect-ratio: 2/3
  background: linear-gradient(145deg, var(--beige-warm), var(--beige-mid))
  border-radius: 1px
  Si hay imageUrl: mostrar imagen con object-fit cover
  Si no hay: mostrar ícono de libro SVG (opacity 0.22, color var(--moss))

Info del libro:
  Título: EB Garamond, 13px, weight 500, color var(--text)
  overflow: hidden, text-overflow: ellipsis, white-space: nowrap
  Autor: DM Sans, 11px, color var(--text-light), margin-top 1px

Precio y cantidad (columna derecha):
  Precio: 13px, weight 500, color var(--gold)
  Controles cantidad: botones − y + de 18x18px
    border: 1px solid var(--border) | border-radius: 1px
    hover: background var(--moss), border-color var(--moss), color white

/* Estado vacío */
padding: 40px 18px | text-align: center
Ícono bolsa: width 32px, opacity 0.15, color var(--moss)
Texto: "Tu carrito está vacío" — 13px, color var(--text-light)

/* Footer del panel */
padding: 14px 18px 16px
border-top: 1px solid var(--border)
Fila total: "TOTAL" label (10px, letter-spacing 0.2em, uppercase, var(--text-light))
            Monto (EB Garamond, 20px, weight 500, color var(--moss))
Botón checkout:
  width: 100% | padding: 12px
  background: var(--moss) | color: white
  font-size: 11px | font-weight: 500 | letter-spacing: 0.12em | uppercase
  border-radius: 2px
  hover: var(--moss-mid), translateY(-1px)
  disabled (carrito vacío): opacity 0.38, cursor not-allowed
Conexión con Zustand:

Usar useCart() de src/features/carrito/hooks.ts para las acciones: incrementQuantity, decrementQuantity, removeItem
Usar useCartSummary() de src/features/carrito/hooks.ts para los totales
El botón de checkout es un <Link href="/checkout"> que también cierra el panel

Props:
typescriptinterface CartPanelProps {
  isOpen: boolean
  onClose: () => void
}

3. Footer — src/shared/ui/Footer.tsx
Server Component. Carga los datos del banner de footer desde la API y renderiza el footer completo con la ilustración de fondo.
Fondo: var(--beige-warm) — #EDE9D4
Línea decorativa superior:
position: absolute | top: 0 | left: 0 | right: 0 | height: 1px
background: linear-gradient(to right, transparent, rgba(200,168,48,0.35), transparent)
z-index: 4
Ilustración de fondo:
position: absolute | inset: 0
width controlado por parámetro | height: 100%
object-fit: cover | object-position: left center
mix-blend-mode: multiply
opacity: controlado por parámetro (default 0.80)
Overlay de desvanecimiento:
position: absolute | inset: 0 | z-index: 2
background: linear-gradient(to right,
  rgba(237,233,212,0) 0%,
  rgba(237,233,212,0) {fadeStart}%,
  rgba(237,233,212,0.78) {mid}%,
  rgba(237,233,212,0.97) {fadeEnd}%,
  rgba(237,233,212,1) 100%
)
donde mid = Math.round((fadeStart + fadeEnd) / 2)
Layout de información (z-index: 3):
display: flex | align-items: stretch | min-height: 280px

Espacio izquierdo para ilustración: width = artSpaceWidth%
Panel de información derecho: flex: 1

Padding del panel: 40px 56px 0 32px
Grid interno: grid-template-columns: 1.3fr 1fr 1fr 1fr | gap: 28px
Columna 1 — Branding:
Cruz decorativa: 20x20px, líneas en var(--gold)
Nombre: EB Garamond, 17px, color var(--text)
Tagline: DM Sans, 7px, letter-spacing 0.22em, uppercase, color var(--gold)
Descripción: DM Sans, 11px, line-height 1.75, color var(--text-light), weight 300
Columnas 2 y 3 — Catálogo e Información:
h4: DM Sans, 7px, letter-spacing 0.28em, uppercase, color var(--gold), margin-bottom 14px
Links: DM Sans, 11px, color var(--text-mid), weight 300 | hover: color var(--moss)
Columna 4 — Ubicación:
h4: igual a las columnas anteriores
Ícono pin SVG: 14px, color var(--gold)
Texto: "Arturo Prat 470 / Antofagasta, Chile" — 11px, color var(--text-mid), weight 300
Link "Ver en el mapa →":
  9px, font-weight 500, letter-spacing 0.1em, uppercase
  color var(--gold) | border-bottom: 1px solid rgba(200,168,48,0.3)
  hover: border-color var(--gold)
  href: "https://maps.google.com/?q=Arturo+Prat+470+Antofagasta"
  target: _blank
Barra inferior:
padding: 14px 56px 20px
border-top: 1px solid rgba(115,96,2,0.1)
display: flex | justify-content: space-between
font-size: 10px | color: var(--text-light)
"© 2026 Crecer Librería. Todos los derechos reservados." | "Diseño: Hultur Studio"
Carga de datos del footer:
El footer llama a GET /api/landing/banners?position=footer_illustration. El endpoint devuelve el banner correspondiente incluyendo el campo metadata cuando existe. Si no existe el banner o no tiene metadata, el footer usa valores por defecto:
typescript// Valores por defecto si no existe el banner o su metadata:
const defaults = {
  imageUrl: null,
  opacity: 0.80,
  fadeStart: 40,
  fadeEnd: 70,
  imgWidth: 72,       // % del ancho total
  artSpaceWidth: 36,  // % de espacio reservado para la ilustración
}

// Tipo del metadata almacenado en DB:
interface FooterBannerMetadata {
  opacity: number       // 0-1
  fadeStart: number     // 0-100
  fadeEnd: number       // 0-100
  imgWidth: number      // 0-100
  artSpaceWidth: number // 0-100
}
Si no hay imageUrl, el footer se muestra sin ilustración, solo con el fondo beige-warm.

4. Migración de Drizzle — campo metadata en banners
La tabla banners actualmente no tiene este campo. Agregarlo como columna nueva:
typescript// En src/integrations/drizzle/schema/landing.ts
// Agregar en la definición de la tabla banners:
metadata: jsonb('metadata'),   // nullable — parámetros extendidos por sección
Generar y ejecutar la migración:
bashnpx drizzle-kit generate
npx drizzle-kit migrate
Esta columna también será útil para otras secciones del landing que necesiten parámetros configurables en el futuro.

5. Layout de la tienda pública — src/app/(store)/layout.tsx
Server Component. Envuelve todas las páginas de la tienda pública.
typescript// Carga las categorías para el Navbar directamente con Drizzle
// (estamos en el servidor, no necesitamos fetch a la API)

import { db } from '@/integrations/drizzle'
import { categories } from '@/integrations/drizzle/schema'
import { eq, asc } from 'drizzle-orm'

// Consultar categorías activas ordenadas por display_order
// Pasar como prop al Navbar: <Navbar categories={categories} />
// Renderizar: <Navbar> + {children} + <Footer />
IMPORTANTE — imports de Drizzle: El proyecto expone Drizzle a través de un barrel en @/integrations/drizzle. Usar siempre ese import, nunca @/integrations/drizzle/client directamente. Si el barrel exporta el schema como namespace separado, ajustar el import según la convención del proyecto (p. ej. import { schema } from '@/integrations/drizzle' o import { categories } from '@/integrations/drizzle/schema').
El layout NO incluye ningún padding ni wrapper adicional — cada página maneja su propio espaciado interno.

6. Layout del panel admin — src/app/admin/(panel)/layout.tsx
IMPORTANTE — estructura del admin: El panel admin está bajo el route group (panel). Las páginas del admin viven en src/app/admin/(panel)/. Las URLs públicas siguen siendo /admin, /admin/productos, etc. — el route group no afecta las URLs.
El login (src/app/admin/login/) está fuera del route group (panel) y no hereda este layout.
Client Component ('use client'). Reemplaza el layout básico de la Fase 3.
Estructura:
<div style="display: flex; height: 100vh; overflow: hidden">
  <AdminSidebar />           ← siempre visible
  <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden">
    <AdminTopbar />          ← barra superior
    <main style="flex: 1; overflow-y: auto; padding: 28px">
      {children}
    </main>
  </div>
</div>
AdminSidebar — crear en src/features/admin/components/AdminSidebar.tsx:
width: 220px | flex-shrink: 0
background: var(--moss) | border-right: 1px solid rgba(217,186,30,0.15)
display: flex | flex-direction: column | height: 100vh

/* Logo */
padding: 20px 18px 16px
border-bottom: 1px solid rgba(255,255,255,0.1)
Cruz cuadrada: 28x28px, background var(--gold), border-radius 2px (NO 6px — nuestro sistema es 2px)
Nombre: EB Garamond, 1.2rem, color white
Sub: DM Sans, 0.6rem, color rgba(255,255,255,0.4), letter-spacing 1px, uppercase

/* Navegación */
flex: 1 | overflow-y: auto | padding: 12px 10px

Sección label:
  font-size: 0.58rem | font-weight: 600 | letter-spacing: 2px
  text-transform: uppercase | color: rgba(255,255,255,0.35)
  padding: 14px 10px 6px

Item del sidebar:
  display: flex | align-items: center | gap: 10px
  padding: 9px 10px | border-radius: 2px (NO 8px)
  cursor: pointer | transition: all 0.18s | margin-bottom: 2px
  hover: background rgba(255,255,255,0.08)
  active: background rgba(217,186,30,0.15), border: 1px solid rgba(217,186,30,0.25)
  active icon: color var(--gold)
  active label: color white, font-weight 500

Ícono: font-size 15px, width 18px, color rgba(255,255,255,0.55)
Label: font-size 0.8rem, color rgba(255,255,255,0.65)
Badge numérico: background var(--error), color white, font-size 0.6rem, font-weight 700
               padding: 2px 6px, border-radius: 10px

/* Footer del sidebar */
padding: 14px 18px
border-top: 1px solid rgba(255,255,255,0.1)
Avatar: 32px, border-radius 50%, gradient de var(--gold)
Nombre admin: 0.78rem, weight 500, color white
Rol: 0.65rem, color rgba(255,255,255,0.4)
Botón logout: color rgba(255,255,255,0.35), hover: color var(--error)
              llama a POST /api/admin/auth/logout y redirige a /admin/login
Navegación del sidebar (items y rutas reales del proyecto):
─── Principal ───
Dashboard          → /admin
Pedidos            → /admin/pedidos     (badge con pedidos pendientes)

─── Catálogo ───
Productos          → /admin/productos
Categorías         → /admin/categorias

─── Página principal ───
Hero               → /admin/landing/hero
Banners            → /admin/landing/banners
Selección curada   → /admin/landing/seleccion
Footer             → /admin/landing/footer

─── Sistema ───
Cupones            → /admin/cupones
El item activo se determina comparando usePathname() con el href de cada item. Usar startsWith para que rutas anidadas (ej. /admin/productos/nuevo) mantengan el item "Productos" activo.
AdminTopbar — crear en src/features/admin/components/AdminTopbar.tsx:
height: 56px | flex-shrink: 0
background: rgba(245,243,232,0.95) | backdrop-filter: blur(12px)
border-bottom: 1px solid var(--border)
display: flex | align-items: center | justify-content: space-between | padding: 0 28px

Título de la sección actual: 0.88rem, font-weight 600, color var(--text)
  Se determina por la ruta actual con usePathname()

Zona derecha: buscador simple + botón "Cerrar sesión"
El nombre del admin logueado se obtiene haciendo fetch a GET /api/admin/auth/me al montar el componente.

7. Archivos de exportación
Actualizar src/shared/ui/index.ts agregando los nuevos componentes:
typescriptexport { Navbar } from './Navbar'
export { CartPanel } from './CartPanel'
export { Footer } from './Footer'
// (mantener los exports existentes de la Tarea 4.1)

Reglas importantes

El layout del panel admin va en src/app/admin/(panel)/layout.tsx, no en src/app/admin/layout.tsx. El route group (panel) no afecta las URLs — /admin, /admin/productos, etc. siguen funcionando igual.
La página de login está fuera del route group: src/app/admin/login/page.tsx. No hereda el layout del panel y no debe hacerlo.
El sidebar del admin siempre está visible — es parte del layout, no un componente toggle.
El Navbar usa categories como prop recibida desde el layout Server Component — no hace fetch propio.
El Footer hace su propio fetch de los parámetros de la ilustración porque es un Server Component independiente.
Imports de Drizzle: usar siempre @/integrations/drizzle (barrel). No usar rutas internas como @/integrations/drizzle/client.
La tabla banners no tiene metadata todavía — la migración de este campo es parte de esta tarea y debe ejecutarse antes de que el footer intente leerlo.
border-radius: 2px en todo — el sidebar del admin usa 2px en sus items, NO el 8px del HTML del diseñador.
NO modificar las API Routes de Fases 1–3 ni el store de Zustand.
NO crear páginas — solo layouts y componentes compartidos.
Verificar que tsc --noEmit pase sin errores al finalizar.

Recordar los detalles para esta tarea: El único detalle es recordar el import vía schema cuando se implemente.

---

**Cursor**

Empiezo revisando el layout actual del admin, el schema de `banners`, el barrel de Drizzle y los hooks del carrito para montar Navbar/Footer/layouts sin romper la estructura existente.

Voy a revisar un poco más el shape real del schema y de las APIs para que `Footer` y el layout de tienda queden conectados al proyecto sin suposiciones erróneas.

Voy a preparar la parte de datos y auth shell del admin antes de escribir los componentes: necesito ver la forma de respuesta de `ok()` y la config de Drizzle para generar la migración de `metadata` sin inventar estructura.

Ya tengo claro el encaje con el proyecto: mantendré el layout admin como server para no romper la auth actual, pero con `AdminSidebar` y `AdminTopbar` como componentes client usando `usePathname`. Ahora escribo los componentes, el layout de tienda y la migración de `metadata`.

Antes de cerrar la implementación del shell admin, voy a mirar el shape de `GET /api/admin/pedidos/stats` para usar el badge de pendientes sin inventar un contrato.

Voy a comprobar la configuración de imágenes antes de cerrar `CartPanel` y `Footer`, para decidir si uso `next/image` o un `img` seguro con URLs remotas del storage.

Ya están escritos `Navbar`, `CartPanel`, `Footer`, el layout de tienda y el shell visual del admin. Me falta generar la migración de `banners.metadata` y luego validar TypeScript/lints para ajustar cualquier detalle de integración.

La integración compila bien; me falta generar y aplicar la migración de `banners.metadata` para que el schema de Drizzle quede alineado con el footer y cerrar luego con una última verificación.

El fallo fue del shell de PowerShell por el uso de `&&`; voy a ejecutar la generación y la migración en dos pasos separados y luego revalidar.

Ya quedó aplicada la migración. Hago una última pasada rápida sobre usos de `AdminLogoutButton` y el typecheck final para asegurar que el reemplazo visual del layout admin no dejó cabos sueltos.

Implementé la **Tarea 4.2** completa.

Quedaron creados `Navbar`, `CartPanel` y `Footer` en `src/shared/ui/`, además del layout público en `src/app/(store)/layout.tsx`. El `Navbar` usa las categorías recibidas por prop, el badge del carrito muestra `totalItems`, y el `Footer` ya consume `/api/landing/banners?position=footer_illustration` con valores por defecto si no hay metadata.

También actualicé el shell visual del admin: añadí `AdminSidebar` y `AdminTopbar`, y reemplacé el layout de `src/app/admin/(panel)/layout.tsx` por la nueva estructura. Mantuve la validación de sesión server-side que ya tenía el proyecto, y monté los componentes client dentro de ese layout para no romper la auth existente.

En datos, agregué `metadata` a `banners` en `src/integrations/drizzle/schema/landing.ts`, extendí `getBanners()` para devolverlo y generé/apliqué la migración de Drizzle (`0001_brave_warbird.sql`).

Verifiqué con `npx tsc --noEmit` y no quedaron errores ni lints en los archivos tocados.

Siguiente paso natural: seguir con la **Tarea 4.3**.

---

**User**

# Verificación Tareas 4.1 y 4.2 — Crecer Librería

Necesito que analices el código del proyecto y me digas exactamente qué está bien, qué falta y qué está mal respecto a lo que debían implementar las Tareas 4.1 y 4.2.

No corrijas nada todavía. Solo analiza y reporta.

---

## Qué verificar en la Tarea 4.1 — Tokens y componentes base

### 1. globals.css
- Leer `src/app/globals.css` completo
- Verificar que la directiva `@import "tailwindcss"` sigue presente (Tailwind v4)
- Verificar que existe un bloque `@theme` con los tokens de color (prefijo `--color-`)
- Verificar que existen variables CSS en `:root` con `var(--moss)`, `var(--gold)`, etc.
- Verificar los valores exactos de los tokens críticos:
  - `--color-gold` debe ser `#C8A830` (NO `#D9BA1E`)
  - `--color-beige` debe ser `#F5F3E8` (NO `#F2EFDF`)
  - `--color-moss` debe ser `#736002`
- Verificar que existe `.reveal` y `.reveal.visible` con las transiciones de scroll

### 2. Dependencias
- Leer `package.json` y verificar que `class-variance-authority` está instalado

### 3. Componentes en `src/shared/ui/`
- Listar todos los archivos que existen en esa carpeta
- Leer `Button.tsx` y verificar que tiene las 6 variantes: `primary`, `moss`, `outline`, `ghost`, `add-to-cart`, `secondary`
- Leer `Badge.tsx` y verificar que tiene las 6 variantes: `new`, `sale`, `success`, `error`, `warning`, `info`
- Verificar que existen: `Input.tsx`, `Textarea.tsx`, `SectionHeader.tsx`, `Separator.tsx`
- Leer `index.ts` y verificar que exporta todos los componentes

### 4. Hooks
- Verificar que existe `src/shared/hooks/useScrollReveal.ts`
- Verificar que existe `useScrollRevealMultiple` (en el mismo archivo o separado)
- Verificar que existe `src/shared/hooks/index.ts` con los exports

### 5. Verificación crítica
- Verificar que NO existe ningún archivo `tailwind.config.ts` en la raíz del proyecto
- Verificar que los componentes no tienen colores hardcodeados (ej. `#736002` directo en el JSX en lugar de `var(--moss)` o clase Tailwind)

---

## Qué verificar en la Tarea 4.2 — Navbar, Footer y Layouts

### 1. Migración de Drizzle
- Leer `src/integrations/drizzle/schema/landing.ts` (o donde esté definida la tabla `banners`)
- Verificar que la tabla `banners` tiene un campo `metadata` de tipo `jsonb`
- Verificar que existe una migración generada que incluye ese campo (buscar en la carpeta de migraciones)

### 2. Componentes en `src/shared/ui/`
- Verificar que existen `Navbar.tsx`, `CartPanel.tsx`, `Footer.tsx`
- Leer `Navbar.tsx` y verificar:
  - Acepta prop `variant: 'default' | 'checkout'`
  - En variante `checkout` no muestra links ni búsqueda
  - El badge del carrito usa `useCartSummary()` de `src/features/carrito/hooks.ts`
  - La propiedad usada para el contador es `totalItems` o `itemCount` (ser consistente)
  - Tiene lógica de scroll para agregar sombra
- Leer `CartPanel.tsx` y verificar:
  - Usa `useCart()` de `src/features/carrito/hooks.ts` para las acciones
  - Usa `useCartSummary()` para los totales
- Leer `Footer.tsx` y verificar:
  - Hace fetch a `/api/landing/banners?position=footer_illustration`
  - Tiene valores por defecto si no hay banner: `opacity: 0.80`, `fadeStart: 40`, `fadeEnd: 70`

### 3. Layout de la tienda pública
- Leer `src/app/(store)/layout.tsx`
- Verificar que carga categorías con Drizzle directamente (no con fetch a la API)
- Verificar que el import de Drizzle usa `@/integrations/drizzle` (barrel), no `@/integrations/drizzle/client`
- Verificar que renderiza `<Navbar>`, `{children}` y `<Footer>`

### 4. Layout del panel admin
- Verificar que el archivo es `src/app/admin/(panel)/layout.tsx` (dentro del route group)
- Verificar que NO existe un `src/app/admin/layout.tsx` que esté haciendo el trabajo del panel
- Leer el layout y verificar que incluye `AdminSidebar` y `AdminTopbar`

### 5. AdminSidebar
- Leer `src/features/admin/components/AdminSidebar.tsx`
- Verificar que las rutas del sidebar son correctas:
  - Banners → `/admin/landing/banners` (no `/admin/landing/banner` sin s)
  - Hero → `/admin/landing/hero`
  - Selección → `/admin/landing/seleccion`
  - Footer → `/admin/landing/footer`
- Verificar que el item activo usa `usePathname()` con `startsWith` para rutas anidadas
- Verificar que el botón de logout llama a `POST /api/admin/auth/logout`

### 6. Página de login
- Verificar que `src/app/admin/login/page.tsx` existe fuera del route group `(panel)`
- Verificar que NO importa el layout del panel (sin sidebar)

---

## Formato del reporte

Para cada punto verificado, indicar:
- ✅ Correcto — breve descripción de lo encontrado
- ⚠️ Parcial — qué está y qué falta
- ❌ Falta o incorrecto — qué se encontró en su lugar o qué está ausente

Al final del reporte, listar:
1. **Bloqueantes** — cosas que impedirán que la Tarea 4.3 funcione correctamente si no se corrigen
2. **Importantes** — cosas que deben corregirse pero no bloquean la siguiente tarea
3. **Menores** — detalles cosméticos o de convención que se pueden dejar para después


No corrijas nada todavía. Solo analiza y reporta.

---

**Cursor**

Voy a revisar los archivos exactos de 4.1 y 4.2 para darte un informe punto por punto, distinguiendo lo correcto, lo parcial y lo que quedó mal o faltante.

Ahora reviso los componentes y layouts concretos para comparar implementación vs. lo pedido en 4.1 y 4.2, y también detectar hardcodes o ausencias puntuales.

Me falta revisar `AdminSidebar`, `AdminTopbar` y la página de login para cerrar la parte admin del reporte y luego te entrego el diagnóstico completo con bloqueantes/importantes/menores.

## Tarea 4.1

### 1. `globals.css`
- ✅ Correcto — `src/app/globals.css` mantiene `@import "tailwindcss"` y por tanto sigue usando Tailwind v4.
- ✅ Correcto — existe un bloque `@theme inline` con tokens `--color-*`, `--font-*`, `--radius-*` y `--text-eyebrow`.
- ✅ Correcto — existe `:root` con variables CSS paralelas como `--moss`, `--gold`, `--beige`, `--border`, etc.
- ✅ Correcto — los valores críticos están bien:
  - `--color-gold: #c8a830`
  - `--color-beige: #f5f3e8`
  - `--color-moss: #736002`
- ✅ Correcto — existen `.reveal` y `.reveal.visible` con transición y `translateY` para scroll reveal.
- ✅ Correcto — también quedaron scrollbar custom, reset global y tipografías cargadas por Google Fonts.

### 2. Dependencias
- ✅ Correcto — `class-variance-authority` está instalado en `package.json`.

### 3. Componentes en `src/shared/ui/`
- ✅ Correcto — existen estos archivos en `src/shared/ui/`:
  - `Button.tsx`
  - `Badge.tsx`
  - `Input.tsx`
  - `SectionHeader.tsx`
  - `Separator.tsx`
  - `Navbar.tsx`
  - `CartPanel.tsx`
  - `Footer.tsx`
  - `index.ts`
- ✅ Correcto — `Button.tsx` tiene las 6 variantes requeridas:
  - `primary`
  - `moss`
  - `outline`
  - `ghost`
  - `add-to-cart`
  - `secondary`
- ✅ Correcto — `Badge.tsx` tiene las 6 variantes requeridas:
  - `new`
  - `sale`
  - `success`
  - `error`
  - `warning`
  - `info`
- ✅ Correcto — existen `Input.tsx`, `SectionHeader.tsx`, `Separator.tsx`.
- ⚠️ Parcial — no existe un archivo separado `Textarea.tsx`; el componente `Textarea` sí existe, pero dentro de `src/shared/ui/Input.tsx`.
- ✅ Correcto — `src/shared/ui/index.ts` exporta todos los componentes base y también los de 4.2.

### 4. Hooks
- ✅ Correcto — existe `src/shared/hooks/useScrollReveal.ts`.
- ✅ Correcto — en ese mismo archivo existe `useScrollRevealMultiple`.
- ✅ Correcto — `src/shared/hooks/index.ts` exporta ambos hooks.

### 5. Verificación crítica
- ✅ Correcto — no existe `tailwind.config.ts` en la raíz del proyecto.
- ⚠️ Parcial — en los componentes atómicos de 4.1 no vi hardcodes del tipo `#736002` o `#C8A830` metidos directo en JSX; usan clases Tailwind y `var()`.  
  Pero ya en `shared/ui` hay hardcodes tipo `rgba(...)` y `white/70` en componentes de 4.2 (`Navbar`, `CartPanel`, `Footer`) para sombras, overlays y algunos estados visuales. No rompe 4.1, pero sí significa que el criterio de “sin colores hardcodeados en componentes” no se está cumpliendo al 100% en toda la carpeta.

---

## Tarea 4.2

### 1. Migración de Drizzle
- ✅ Correcto — en `src/integrations/drizzle/schema/landing.ts`, la tabla `banners` ya tiene `metadata: jsonb("metadata")`.
- ✅ Correcto — existe migración generada para ese cambio: `src/integrations/drizzle/migrations/0001_brave_warbird.sql`.
- ✅ Correcto — la migración contiene `ALTER TABLE "banners" ADD COLUMN "metadata" jsonb;`.

### 2. Componentes en `src/shared/ui/`
- ✅ Correcto — existen `Navbar.tsx`, `CartPanel.tsx` y `Footer.tsx`.

#### `Navbar.tsx`
- ✅ Correcto — acepta `variant?: "default" | "checkout"`.
- ✅ Correcto — en variante `checkout` no muestra búsqueda, links ni carrito; solo marca + link de volver al carrito.
- ✅ Correcto — el badge usa `useCartSummary()` de `src/features/carrito/hooks.ts`.
- ✅ Correcto — la propiedad usada para el contador es `totalItems`.
- ✅ Correcto — tiene lógica de scroll para activar sombra (`useEffect` + `window.scrollY > 40`).
- ✅ Correcto — también tiene cierre con `Escape`.
- ✅ Correcto — las categorías llegan por prop, no hace fetch propio.
- ⚠️ Parcial — visualmente cumple bastante, pero el dropdown está montado dentro de un `<li>` suelto dentro de `<nav>` y el navbar usa algo de estilo hardcodeado en sombras y transparencias. No bloquea 4.3, pero no está 100% “limpio” respecto al criterio de tokens.

#### `CartPanel.tsx`
- ✅ Correcto — usa `useCart()` para `incrementQuantity`, `decrementQuantity`, `removeItem`.
- ✅ Correcto — usa `useCartSummary()` para `total`, `totalItems`, `isEmpty`.
- ✅ Correcto — el botón a checkout es un `Link` a `/checkout` y además cierra el panel.
- ✅ Correcto — implementa cierre por clic fuera y por `Escape`.

#### `Footer.tsx`
- ✅ Correcto — hace fetch efectivo a `/api/landing/banners?position=footer_illustration` usando base URL construida con `NEXT_PUBLIC_APP_URL` o `headers()`.
- ✅ Correcto — tiene valores por defecto:
  - `opacity: 0.8`
  - `fadeStart: 40`
  - `fadeEnd: 70`
  - `imgWidth: 72`
  - `artSpaceWidth: 36`
- ✅ Correcto — si no hay banner o metadata, cae a defaults.
- ✅ Correcto — `getBanners()` en `src/features/catalogo/services/landing-service.ts` ya devuelve `metadata`.
- ⚠️ Parcial — el footer sí consume metadata, pero su implementación mezcla tokens con varios `rgba(...)` hardcodeados en overlays y bordes.

### 3. Layout de la tienda pública
- ✅ Correcto — existe `src/app/(store)/layout.tsx`.
- ✅ Correcto — carga categorías directo con Drizzle, no vía fetch a la API.
- ✅ Correcto — el import usa `@/integrations/drizzle` (barrel), concretamente `import { db, schema } from "@/integrations/drizzle"`.
- ✅ Correcto — renderiza `<Navbar categories={categories} />`, luego `{children}` y al final `<Footer />`.

### 4. Layout del panel admin
- ✅ Correcto — el archivo está en `src/app/admin/(panel)/layout.tsx`.
- ✅ Correcto — no existe `src/app/admin/layout.tsx` haciendo el trabajo del panel.
- ✅ Correcto — el layout incluye `AdminSidebar` y `AdminTopbar`.
- ⚠️ Parcial — el prompt pedía explícitamente que este layout fuera client component; el archivo actual es **server component**.  
  En la práctica esto tiene sentido porque conserva la validación server-side de sesión con cookies/JWT, pero **no coincide exactamente** con lo pedido en el documento.

### 5. `AdminSidebar`
- ✅ Correcto — las rutas están escritas con los paths esperados:
  - `/admin/landing/banners`
  - `/admin/landing/hero`
  - `/admin/landing/seleccion`
  - `/admin/landing/footer`
- ✅ Correcto — usa `usePathname()` y compara con `startsWith` para rutas anidadas.
- ✅ Correcto — el logout se hace mediante `AdminLogoutButton`, y ese componente sí llama a `POST /api/admin/auth/logout`.
- ⚠️ Parcial — dos rutas del sidebar hoy no existen como páginas reales:
  - `/admin/landing/footer`
  - `/admin/cupones`
  Entonces el sidebar está “correcto” respecto a lo que querían construir, pero **no coincide con el estado real actual del proyecto** y hoy esos links llevarían a 404.

### 6. Página de login
- ✅ Correcto — existe `src/app/admin/login/page.tsx`.
- ✅ Correcto — está fuera del route group `(panel)`.
- ✅ Correcto — no importa ni hereda el layout del panel.
- ⚠️ Parcial — esto ya entra más en 4.5 que en 4.2, pero la UI del login sigue siendo la básica vieja (`admin-login-form.tsx`), no el diseño nuevo del prompt 4.5.

---

## Resumen general

### Bloqueantes
- Ninguno realmente bloqueante para arrancar la **Tarea 4.3**.  
  La base necesaria sí está:
  - tokens globales
  - componentes atómicos
  - hooks
  - `Navbar`
  - `CartPanel`
  - `Footer`
  - layout público `(store)`
  - migración `banners.metadata`

### Importantes
- ⚠️ `Textarea.tsx` no existe como archivo separado; el componente vive dentro de `Input.tsx`. Funcionalmente está, pero si quieres apego estricto al checklist, esto no coincide.
- ⚠️ El layout admin de `src/app/admin/(panel)/layout.tsx` quedó como server component, no client component como decía el prompt.
- ⚠️ Hay rutas en `AdminSidebar` que hoy no existen:
  - `/admin/landing/footer`
  - `/admin/cupones`
- ⚠️ El criterio de “sin colores hardcodeados en componentes” no se cumple al 100% en `shared/ui` porque en 4.2 aparecen `rgba(...)`, `white/70`, sombras y overlays embebidos.

### Menores
- ⚠️ `Footer`, `Navbar` y `CartPanel` mezclan tokens con transparencias y sombras hardcodeadas; es más un tema de consistencia de design system que un fallo funcional.
- ⚠️ El login sigue con UI vieja, pero eso pertenece realmente a 4.5, no a 4.2.
- ⚠️ Algunos textos están sin acentos (`Libreria`, `Coleccion`, `Vacio`, etc.); es cosmético.
- ⚠️ Estructura HTML del navbar mejorable (`<li>` dentro de `<nav>` sin `<ul>`), pero no bloquea nada.

Si quieres, el siguiente paso puede ser un **reporte solo de discrepancias** entre lo pedido y lo implementado, sin repetir lo correcto, para que tengas una checklist corta de correcciones antes de entrar a la 4.3.

