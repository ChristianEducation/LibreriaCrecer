# Crecer Librería Cristiana — Handoff v01
**Última actualización:** Abril 2026 — cierre de jornada: buscador/Navbar actualizado, `publisher` agregado a productos, admin de envíos validado con tablas Supabase manuales y diagnóstico Chilexpress checkout/fallback.
**Estado resumido:** **Hero principal**, **Top banner**, **Selección del mes**, **Categorías del landing**, **Hero final** y **Footer** completos con pantallas admin dedicadas y previews en vivo donde aplica. **Footer público** lee datos frescos desde servicios/BD con `noStore()`. **SEO:** metadata, JSON-LD, sitemap y robots implementados. **Catálogo:** Navbar con `Conócenos` al final y autocomplete de productos; búsqueda textual en `title`, `author`, `coverType` y `publisher` (**no** `description`). **Chilexpress:** infraestructura, cotización en checkout con fallback, admin de envíos y generación de OT implementados; `shipping_config`, `shipping_packages` y columnas `chilexpress_*` fueron aplicadas/validadas manualmente en Supabase, pero faltan credenciales reales y alinear la cotización pública con config/empaques admin. **Automáticos / externos:** recién llegados (últimos productos), Instagram (Elfsight). **Pendiente global:** primer preview Vercel para clienta, credenciales Chilexpress, VESSI, Resend/emails, QA final, posibles E2E/Playwright admin→storefront y mejoras opcionales de Top Banner vía `metadata`.
**Stack:** Next.js 15.2.4 (App Router) · TypeScript · Drizzle ORM · Supabase PostgreSQL + Storage · Zustand 5 · Tailwind v4 · Getnet · lottie-react · framer-motion  
**Build / calidad:** verificar en el clon con `npx tsc --noEmit`, `npm run lint` y `npm run build` antes de entregar; no asumir verde sin ejecutarlos.  
**Tamaño del repo:** orden de magnitud — ver `git` o herramientas de conteo para cifras actuales (no fijar métricas exactas aquí)

---

## 📋 INSTRUCCIÓN DE INICIO OBLIGATORIA

> Lee este handoff completo antes de escribir cualquier línea de código.
> Luego lee `docs/agentes/CLAUDE.md` para las reglas globales.
> Si tocas archivos de UI → lee `docs/agentes/frontend.md` primero.
> Si tocas API Routes o servicios → lee `docs/agentes/backend.md` primero.

---

## Estado actual real

- **Hecho:** E-commerce end-to-end operativo; backend y APIs; Getnet (TEST); storefront responsive; catálogo, checkout, admin CRUD; `/nosotros` con CMS; **SEO completo**; **Chilexpress Fase 1–3**; reglas técnicas del repo (R1–R14, bugs históricos, migraciones vía R13). **Panel Admin Landing cerrado funcional y visualmente**: las secciones principales tienen rutas directas desde el sidebar y la entrada general **Landing** (`/admin/landing`) fue removida del sidebar para evitar navegación duplicada al hall/intermedio. `/admin/landing/page.tsx` puede seguir existiendo por compatibilidad, pero no es la navegación principal.
- **Sidebar / Contenido:** rutas visibles actuales: **Top Banner**, **Hero principal**, **Selección del mes**, **Categorías del landing**, **Hero final**, **Footer** y **Página Conócenos**. El admin también incluye **Envíos** (`/admin/envios`) en la zona de pedidos/operación.
- **SEO:** metadata global y por páginas principales, metadata dinámica en productos, JSON-LD `WebSite`, `BookStore`, `Product` y breadcrumb, `sitemap.ts` y `robots.ts`. Open Graph global usa `/images/Logo-Crecer.png` como fallback; falta una imagen OG ideal 1200x630 para producción.
- **Catálogo / Navbar:** `Conócenos` quedó al final del menú público en desktop y drawer mobile. El buscador del header usa `NavbarSearch` como componente separado, con autocomplete simple de productos: mínimo 2 caracteres, debounce aprox. 280 ms, máximo 8 resultados, dropdown visual coherente con Categorías, una fila con ícono de lupa + título, click a `/productos/{slug}` y Enter a `/productos?search=...`. No muestra miniatura, precio, autor, editorial, descripción ni stock.
- **Productos / Editorial:** se agregó `publisher` como columna propia en `products`; no se reutilizó `pages`. El admin crear/editar producto ya incluye campo Editorial opcional, tipos/servicios públicos y admin fueron ajustados, y el detalle de producto muestra Editorial en especificaciones solo si existe.
- **Chilexpress:** integración base, `/api/shipping/cotizar`, cotización desde checkout cuando hay comuna, fallback sin bloquear compra si faltan credenciales, recálculo server-side al crear orden, admin de configuración/empaques y generación de OT/etiqueta desde detalle de pedido. `shipping_config`, `shipping_packages` y columnas `chilexpress_*` ya fueron aplicadas/validadas manualmente en Supabase para el entorno actual; el admin `/admin/envios` permite guardar configuración y crear empaques.
- **Hero principal:** completo. Preview en vivo antes de guardar. Patrón vigente: estado local del formulario → `ViewModel` local → `HeroPreview` → guardar → `router.refresh`. Tipografía de hero alineada al diseño (**Castoro** + **Inter** vía `globals.css`).
- **Top Banner:** completo. Ruta admin `/admin/landing/top-banner`. Usa `banners.position = "top_banner"`, formulario propio y preview en vivo. El Top Banner público se renderiza sobre el `Navbar`; `Navbar` usa `sticky top-0` para evitar solapamiento y el botón X funciona. Pendiente opcional: marquee/colores usando `metadata` jsonb si se decide más adelante.
- **Selección del mes:** completo. Ruta admin `/admin/landing/seleccion`. Permite buscar y agregar libros, activar/desactivar, quitar y reordenar desde la lista. El formulario se simplificó: sin descripción editorial por producto visible y sin orden manual visible. El título y descripción general del bloque se editan usando `landing_section_copy` con key `"libros_mes"`. `featured_products.description` sigue siendo descripción por producto, no copy general del bloque. Storefront usa fallback si no hay copy en BD.
- **Categorías del landing:** completo. Ruta admin `/admin/landing/categorias`. Usa `banners.position = "categories_panorama"`. Tiene preview en vivo de la imagen panorámica dividida usando `CategoryCard`; el preview usa categorías reales si están disponibles y fallback visual si no.
- **Hero final:** completo. Ruta admin `/admin/landing/hero-final`. Usa técnicamente `banners.position = "hero_intermedio"`; en UI se llama **Hero final**. Tiene formulario propio y preview en vivo usando `QuoteSection`.
- **Footer:** completo. Ruta admin `/admin/landing/footer`. Estructura visual: bloque superior en 2 columnas (**Contenido de texto** + **Imagen ilustrativa**), preview live full-width y parámetros visuales full-width debajo del preview. El contenido de texto se guarda en `footer_content` (`brandDescription`, `catalogLinks`, `infoLinks`, `address`, `mapsUrl`, `copyrightText`, `designCredit`). La imagen y composición visual se guardan en `banners.position = "footer_illustration"`. Metadata visual: `opacity`, `fadeStart`, `fadeEnd`, `imgWidth`, `artSpaceWidth`, `textTone: "current" | "dark"`. `textTone` permite mantener colores actuales o usar `var(--text)` / tono oscuro en el footer público. Preview live aplica cambios al instante. El Footer público ya no hace self-fetch HTTP con fallback silencioso; lee datos frescos desde servicios/BD y usa `noStore()`. La API pública `/api/landing/footer` se mantiene, usa el mismo servicio y `force-dynamic`. Quedó corregido el problema de cambios admin no reflejados en storefront.
- **Servicios/footer:** `src/features/catalogo/services/landing-service.ts` centraliza `getFooterIllustration()` y `getFooterContent()`. `src/shared/ui/Footer.tsx` consume esos servicios directamente como Server Component. `src/app/api/landing/footer/route.ts` queda como endpoint público compatible usando el mismo servicio.
- **Automáticos / externos:** **Recién llegados** no requiere admin y muestra últimos productos. **Instagram** es externo y no requiere admin por ahora.
- **Pendiente (producto / infra):** credenciales Chilexpress reales, migración manual Supabase de tablas/campos de envíos, **VESSI**, **Resend/emails**, **QA final**, posible marquee/colores para Top Banner usando `metadata`, y posibles pruebas E2E/Playwright para verificar admin → storefront.

## Cambios recientes importantes

- **Admin:** el **layout del panel** se apoya en **sidebar** (eje visual y navegación: secciones, oscuro, colapsable, cierre de sesión). Existe **Topbar** como componente, pero **no es estructural** ni obligatorio en todas las vistas: **no** asumir que el panel “depende” del topbar.
- **Dashboard** y listado de **Productos** siguen siendo la referencia de layout; **AdminMetricCard** y **AdminTable** como base reutilizable.
- **Hero / landing:** BD y modelos alineados; editores dedicados cerrados por sección (hero, top banner, selección, categorías panorámica, hero final, footer); **`HeroPreview`** en hero con estado local → VM en vivo; **`HeroSlider` público** desde **`HeroViewModel`**; top banner, imagen panorámica de categorías y footer illustration como **`banners`** por `position`.
- **Landing admin cerrado:** el sidebar de Contenido expone solo rutas directas a secciones editables; `/admin/landing/page.tsx` permanece por compatibilidad, fuera de la navegación principal.
- **Footer dinámico:** `footer_content` + `banners.position="footer_illustration"` gobiernan el pie público; `Footer.tsx` consume `getFooterContent()` / `getFooterIllustration()` directamente con `noStore()` y `/api/landing/footer` queda como endpoint compatible dinámico.
- **SEO completo:** layout global, home, productos, categorías, nosotros y detalle de producto tienen metadata/JSON-LD según corresponda; `sitemap.ts` incluye rutas estáticas y entradas dinámicas de productos/categorías cuando los servicios responden; `robots.ts` permite `/`, bloquea `/admin` y `/api`, y apunta a `/sitemap.xml`.
- **Chilexpress Fase 1–3:** agregada infraestructura de integración (`config`, `types`, `client`), schema de envíos, servicio de cotización, endpoint público de cotización, checkout conectado con fallback, admin de envíos y generación de OT/etiqueta desde detalle de pedido.
- **Bug corregido:** `POST /api/shipping/cotizar` maneja body vacío o JSON inválido con 400 controlado; no cae al `catch` genérico por `Unexpected end of JSON input`.
- **Buscador / Navbar:** `src/shared/ui/NavbarSearch.tsx` extrae la búsqueda del header. Autocomplete: mínimo 2 caracteres, debounce aprox. 280 ms, máximo 8 productos, dropdown beige con borde/sombra suave, muestra solo lupa + título. Enter mantiene navegación general a `/productos?search=...`; click navega directo al producto. El search del catálogo/autocomplete busca en `title`, `author`, `coverType` y `publisher`; **no busca en `description`** para evitar sugerencias cuyo título no parece coincidir.
- **Editorial / publisher:** nueva columna `products.publisher` (`text("publisher")`) en Drizzle, campo Editorial en crear/editar producto admin, tipos y servicios públicos/admin actualizados, detalle de producto muestra Editorial cuando existe. Migración generada: `src/integrations/drizzle/migrations/0007_add_product_publisher.sql`. `db:migrate` no es confiable ahora mismo: falló por migraciones históricas ya aplicadas manualmente (`footer_content already exists`). En Supabase se aplicó manualmente: `ALTER TABLE products ADD COLUMN IF NOT EXISTS publisher text;`.
- **Chilexpress / envíos:** admin `/admin/envios` ya funciona en el entorno actual después de aplicar manualmente `shipping_config`, `shipping_packages` y columnas `chilexpress_*` en `orders`. El checkout público sí llama `POST /api/shipping/cotizar`; si no cotiza deja `shippingQuote.status === "unavailable"`, muestra "Envío pendiente de confirmar" / "Por confirmar" y permite continuar con `shippingCost = 0`. Causas probables: faltan credenciales, cobertura origen/destino, payload inválido o endpoint externo. Pendiente recomendado: hacer que la cotización pública use `shipping_config` y `shipping_packages` para evitar desalineación con admin.

## Decisiones vigentes

- **Landing / CMS:** arquitectura **ViewModel-first**: datos de BD → funciones de mapeo → tipos de presentación; el **storefront y la preview** comparten criterio visual (misma familia de componentes/estilos, no un HTML paralelo). La **preview** (`HeroPreview`, y análogos futuros) es **parte del sistema de edición**, no un adorno aislado.
- **HTML / diseños externos** (p. ej. *Hero Principal Crecer*): solo **blueprint** de jerarquía, ritmo y look — **nunca** se pega como código de producción; la implementación vive en componentes, `globals.css` y tokens.
- **Hero** sigue siendo el **patrón de referencia** para **preview fiel + ViewModel** donde aplique; el resto del landing ya usa **pantallas admin dedicadas** (top banner, hero final, panorámica categorías, selección, footer) con criterios propios pero misma regla: datos en BD → componente público real o espejo en preview.
- **Migraciones SQL:** flujo **R13** — SQL versionado en repo, **aplicación manual** en Supabase SQL Editor; mantener **alineado** el SQL aplicado con `src/integrations/drizzle/schema/` (y archivos bajo `drizzle/` en la raíz si se usan como complemento). **No** asumir que `drizzle-kit push` / migrate funciona con Session Pooler. Estado actual observado: `npm run db:migrate` intentó aplicar migraciones antiguas ya existentes en Supabase y falló con `footer_content already exists`; para cambios recientes se usó Supabase SQL Editor.
- **Visual / marca:** no cambiar globalmente el token `moss` todavía. La clienta reaccionó mal al moss oscuro cuando se usa como fondo grande en headers/heros/fallbacks. Mantener moss como acento pequeño por ahora y revisar más adelante fondos grandes (`header` de colección, hero de Conócenos, fallbacks sin imagen, overlays sobre imágenes) hacia beige claro, crema, dorado suave u overlays cálidos menos oscuros.
- **Código:** mismas reglas inmutables del repo (Drizzle en servicios, no queries desde el cliente, etc. — R1–R14).

## Próxima tarea (orden sugerido)

1. **Preview Vercel para clienta:** preparar primer link, configurar variables, verificar Storage/imágenes y usuario admin del entorno.
2. **QA previo a preview:** correr `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `npm run build` y smoke manual storefront/admin.
3. **Chilexpress:** ingresar credenciales reales, probar cotización, y evaluar fix mínimo para que `/api/shipping/cotizar` use `shipping_config` + `shipping_packages`.
4. **Resend / emails:** configurar correo temporal/no oficial; email interno nueva compra + email cliente gracias por tu compra con HTML simple alineado a marca.
5. **Página Conócenos:** revisar/ajustar visualmente si cabe en una pasada rápida.
6. **Buscador:** agregar pequeña mejora pendiente a definir mañana.
7. **VESSI:** integración según definición pendiente.
8. **Top banner / visual (opcional):** variantes normal/marquee/colores vía `metadata` y revisión de fondos moss grandes.

**Migraciones en repo (referencia; aplicación en Supabase: manual y verificada en cada entorno):** además de las históricas `0000`–`0004`, suelen aparecer en el proyecto `0005_extend_banners.sql` y `0006_create_landing_section_copy.sql` bajo `src/integrations/drizzle/migrations/`, y SQL de extensión de `hero_slides` (p. ej. en `drizzle/0005_extend_hero_slides.sql` en la raíz). **Cruzar siempre** con el schema y el journal de Drizzle; no listar un número fijo de migración “aplicada” sin comprobarlo en la instancia.

## Flujo de trabajo con Claude Code (y editores en terminal)

- Mismo criterio de calidad que en IDE: leer `docs/HANDOFF-v01.md` y `docs/agentes/*` según toque; no acortar R1–R14.
- Antes de dar por cerrada una tarea: **`npx tsc --noEmit`**, **`npm run lint`** y, cuando toque, **`npm run build`** en el clon; no asumir éxito sin ejecutarlos.
- Commits: mensajes claros; **no** inventar historial ni SHAs — usar `git log` / `git status` en el entorno.

---

## 🗂 STACK Y RUTAS

```
Framework:  Next.js 15.2.4 (App Router + Turbopack)
Lenguaje:   TypeScript strict (sin `any`)
DB:         Supabase PostgreSQL vía Drizzle ORM (conexión directa, Session Pooler)
Storage:    Supabase Storage (solo imágenes — nunca para queries a BD)
Estado:     Zustand 5 con persist a localStorage
Formularios: React Hook Form 7 + Zod 4
Auth admin: jose (JWT) + bcryptjs — Edge Runtime compatible
Pagos:      Getnet Web Checkout (actualmente en ambiente TEST)
Animaciones: lottie-react (BrandLoader — public/animations/Loader_16.json) + framer-motion
Emails:     Resend (pendiente — integrations/email/index.ts es placeholder vacío)
Inventario: VESSI (pendiente — integrations/inventory/index.ts es placeholder vacío)
Instagram:  Elfsight widget externo
Estilos:    Tailwind CSS v4 (sin tailwind.config.ts — tokens y clases globales en globals.css)
Testing:    Playwright (E2E — 32 passing, 1 skipped known issue)
Deploy:     Vercel
```

### Scripts principales
```bash
npm run dev          # Desarrollo con Turbopack
npm run build        # Build de producción
npm run lint         # ESLint
npx tsc --noEmit     # Verificar tipos sin compilar (SIEMPRE correr antes de entregar)
npm run db:generate  # Generar migración Drizzle
npm run db:migrate   # Aplicar migraciones
npm run seed:admin   # Crear primer usuario admin
npm run seed:products # Poblar catálogo (pendiente de ejecutar en producción)
npm run test:e2e          # Correr todos los tests E2E (requiere dev server en :3000)
npm run test:e2e:ui       # Playwright con interfaz gráfica interactiva
npm run test:e2e:report   # Abrir reporte HTML del último run
```

### Path aliases (tsconfig)
```
@/app/*          → src/app/*
@/features/*     → src/features/*
@/shared/*       → src/shared/*
@/integrations/* → src/integrations/*
@/lib/*          → src/lib/*
```

---

## 🗺 ESTRUCTURA DE CARPETAS

```
src/
├── app/
│   ├── (store)/              # Tienda pública — StoreLayout con Navbar + Footer
│   │   ├── page.tsx          # Home ✅ (LandingWithSplash wrapper — splash 3.5s)
│   │   ├── productos/        # /productos (listado) y /productos/[slug] (detalle) ✅
│   │   ├── categorias/       # /categorias ✅ Grid real con header visual y breadcrumb
│   │   ├── carrito/          # /carrito ✅
│   │   └── nosotros/         # /nosotros ✅ Secciones alternadas texto+imagen (CMS)
│   ├── (checkout)/           # Layout propio sin Navbar/Footer de la tienda
│   │   └── checkout/
│   │       ├── page.tsx      # Formulario de compra ✅
│   │       └── confirmacion/ # Página post-pago ✅ (polling 3s/30s activo, usa BrandLoader)
│   ├── admin/
│   │   ├── login/            # Pública — no protegida por middleware ✅
│   │   └── (panel)/          # Protegido — layout con sidebar como eje; topbar no estructural ✅
│   │       ├── page.tsx      # Dashboard con stats reales ✅ (acceso rápido a /nosotros)
│   │       ├── productos/    # CRUD completo ✅
│   │       ├── categorias/   # CRUD completo ✅
│   │       ├── pedidos/      # Listado + detalle + cambio de estado + OT Chilexpress ✅
│   │       ├── envios/       # Configuración Chilexpress + empaques ✅
│   │       ├── nosotros/     # CRUD secciones de /nosotros ✅
│   │       └── landing/      # Editores dedicados cerrados: hero, top-banner, seleccion, categorias, hero-final, footer; `page.tsx` existe por compatibilidad, fuera del sidebar ✅
│   └── api/
│       ├── shipping/         # POST cotizar Chilexpress ✅
│       ├── productos/        # GET público ✅
│       ├── categorias/       # GET público ✅
│       ├── landing/          # GET público hero, banners, selección, footer ✅
│       ├── nosotros/         # GET público secciones activas ✅
│       ├── ordenes/          # POST crear orden, GET por número ✅
│       ├── cupones/          # POST validar cupón ✅
│       ├── stock/            # POST validar stock ✅
│       ├── pagos/            # crear-sesion, retorno, notificacion ✅
│       └── admin/            # Rutas protegidas del admin ✅ (incluye /nosotros CRUD, /shipping y generar-ot)
│
├── features/
│   ├── catalogo/             # Servicios, componentes, `view-models/`, `components/hero/`, tipos del catálogo ✅
│   ├── carrito/              # Zustand store + hooks + tipos ✅
│   ├── checkout/             # Servicios de orden, cupón, stock, pago y cotización shipping ✅
│   ├── admin/                # Auth, CRUD, schemas, `components/landing/`, `LandingEditorShell` ✅
│   ├── landing/              # ✅ LandingWithSplash.tsx (splash screen 3.5s)
│   └── pedidos/              # ⚠️ Solo index.ts vacío — lógica en checkout/ y admin/
│
├── shared/
│   ├── ui/                   # Button, Input, Badge, Navbar, Footer, CartPanel, Toast...
│   │   ├── Logo.tsx          # ✅ Logo real SVG + texto "Crecer" con cruz dorada
│   │   ├── BrandLoader.tsx   # ✅ Spinner Lottie con colores gold del proyecto
│   │   └── BlurFade.tsx      # ✅ Wrapper visual con framer-motion
│   ├── hooks/                # useScrollReveal, useToast
│   ├── utils/                # formatters.ts (formatCLP, formatDate)
│   └── config/               # brand.ts + landing.ts
│
├── DESIGNER.md               # ✅ Referencia visual integrada del storefront
│
├── public/
│   ├── animations/
│   │   └── Loader_16.json    # ✅ Animación Lottie del BrandLoader (colores gold #c8a830 [0.788,0.659,0.298,1])
│   └── images/
│       ├── logo.png          # Logo PNG de reserva
│       ├── Logo-Crecer.png   # ✅ Asset principal del logo del storefront
│       └── Logo-Crecer1.png  # ✅ Variante adicional del logo entregada por diseño
│
└── integrations/
    ├── drizzle/              # Cliente + schema (`schema/`) + migraciones en `migrations/` (ver sección BD) ✅
    ├── supabase/             # Storage client + helpers ✅
    ├── payments/getnet/      # Auth, client, config, types ✅
    ├── shipping/chilexpress/ # Config, types y client Chilexpress ✅
    ├── email/                # ⚠️ Placeholder vacío — Resend pendiente
    └── inventory/            # ⚠️ Placeholder vacío — VESSI pendiente

tests/
├── home.spec.ts        # 6 tests ✅
├── catalogo.spec.ts    # 9 tests (8 passing, 1 skipped known issue) ✅
├── producto.spec.ts    # 7 tests ✅
├── carrito.spec.ts     # 5 tests ✅
├── admin.spec.ts       # 5 tests ✅
└── checkout.spec.ts    # 6 tests ⚠️ PENDIENTE DE CORREGIR — requiere Getnet TEST activo
```

---

## 🎯 CARACTERÍSTICAS PRINCIPALES

### Feature 1: Catálogo público
**Estado:** ✅ Completa  
**Archivos clave:**
- `src/features/catalogo/services/product-service.ts`
- `src/features/catalogo/services/category-service.ts`
- `src/features/catalogo/services/landing-service.ts`
- `src/app/(store)/page.tsx` — Home
- `src/app/(store)/productos/page.tsx` — Listado con filtros URL
- `src/app/(store)/productos/[slug]/page.tsx` — Detalle
- `src/app/(store)/categorias/page.tsx` — Grid de categorías con header

**Cómo funciona:**
Las páginas son Server Components que llaman directamente a los servicios de Drizzle (no vía fetch a la API pública). La API pública existe para uso externo. El listado usa `searchParams` de Next.js para filtro por categoría, ordenamiento y paginación — todo URL-based. La búsqueda textual tiene input en el `FilterBar` y en el header vía `NavbarSearch`, conectados al parámetro `?search=` en la URL. El backend resuelve con `ilike` en `title`, `author`, `coverType` y `publisher`; **no** busca en `description`.

**Detalles de UI del catálogo:**
- `ProductGrid`: 2 columnas en móvil, 5 en desktop (`grid-cols-2 lg:grid-cols-5`)
- `FilterBar`: chips de filtro en desktop (`hidden md:flex`) y fila scroll horizontal en móvil (`.filter-bar-chips-mobile`)
- `Pagination`: muestra "Página X de Y" y botones prev/next
- `ProductCard`: stepper respeta `stock_quantity` real del producto, badge "Últimas unidades" si `stock_quantity ≤ 5`

---

### Feature 2: Carrito
**Estado:** ✅ Completa  
**Archivos clave:**
- `src/features/carrito/store.ts` — Zustand con persist
- `src/features/carrito/hooks.ts` — useCart, useCartSummary, useCartItem
- `src/features/carrito/useCartHydration.ts` — evita hydration mismatch SSR

**Cómo funciona:**
Store en `localStorage` (`crecer-cart`). La hidratación usa `useCartHydration()` que retorna `hydrated: boolean` — los componentes que dependen del carrito deben esperar a que sea `true` antes de renderizar. `addItem()` siempre agrega 1 unidad — para cantidades mayores llamar `updateQuantity()` por separado.

---

### Feature 3: Checkout y Pagos
**Estado:** ✅ Completa (en ambiente TEST — flujo end-to-end verificado)  
**Archivos clave:**
- `src/features/checkout/services/order-service.ts` — transacción atómica
- `src/features/checkout/services/payment-service.ts` — flujo Getnet
- `src/integrations/payments/getnet/` — auth, client, config, types
- `src/app/(checkout)/checkout/page.tsx`
- `src/app/(checkout)/checkout/confirmacion/page.tsx`

**Cómo funciona:**
1. Usuario completa el formulario → `POST /api/ordenes` crea la orden en `pending` (transacción atómica: valida stock, snapshot de precios)
2. Siempre usa Getnet → `POST /api/pagos/crear-sesion` → redirige a Getnet Web Checkout
3. Getnet redirige a `GET /api/pagos/retorno` (tanto en aprobación como en cancelación) → actualiza estado en BD → redirige a `/checkout/confirmacion?order=...&status=...`
4. Getnet también envía `POST /api/pagos/notificacion` (webhook async) — tiene guard idempotente
5. `/checkout/confirmacion` hace polling a `GET /api/ordenes/[orderNumber]` cada 3s si el estado inicial es `pending`, hasta 10 intentos (30s), luego muestra mensaje de timeout
6. Si el pago fue cancelado, la página muestra un botón "Agregar al carrito y reintentar" que recarga los items desde el snapshot de la orden

**Opciones de entrega disponibles:**
- Retiro en tienda (Arturo Prat 470) — sin costo
- Despacho a domicilio vía Chilexpress — el checkout cotiza con `/api/shipping/cotizar` cuando hay comuna; si Chilexpress no está disponible o faltan credenciales, el checkout muestra despacho pendiente/por confirmar y no bloquea la compra. En creación de orden, `createOrder` recalcula cotización en servidor y guarda `shippingCost` si hay costo válido; si no, mantiene el fallback actual (`shippingCost: 0`).

**IMPORTANTE:** El stock se descuenta únicamente cuando el estado pasa de `pending` a `paid`. El guard AND `status = 'pending'` evita doble procesamiento entre retorno y webhook.

---

### Feature 3B: SEO y Chilexpress
**Estado:** ✅ SEO completo / ✅ Chilexpress Fase 1–3 implementada / ⚠️ pendiente credenciales y migración manual Supabase

**SEO implementado:**
- `src/app/layout.tsx` define metadata global, Open Graph/Twitter, robots, `metadataBase`, `lang="es-CL"` y JSON-LD `WebSite` + `BookStore`.
- Páginas públicas principales tienen metadata propia: home, `/productos`, `/categorias`, `/nosotros`.
- `src/app/(store)/productos/[slug]/page.tsx` genera metadata dinámica por producto y JSON-LD `Product` + breadcrumb.
- `src/app/sitemap.ts` incluye rutas estáticas y, cuando los servicios responden, productos activos y URLs de categorías/filtros.
- `src/app/robots.ts` permite `/`, bloquea `/admin` y `/api`, y apunta al sitemap.
- Open Graph global usa `/images/Logo-Crecer.png` como fallback. Falta asset OG ideal 1200x630 para producción.

**Chilexpress implementado:**
- Integración: `src/integrations/shipping/chilexpress/config.ts`, `types.ts`, `client.ts`.
- Servicio checkout: `src/features/checkout/services/shipping-service.ts` con `calculateShippingCost`.
- Endpoint público: `POST /api/shipping/cotizar`; valida con Zod y responde 400 controlado si el body viene vacío o inválido.
- Admin envíos: `src/app/admin/(panel)/envios/page.tsx` + APIs `/api/admin/shipping/config`, `/api/admin/shipping/packages`, `/api/admin/shipping/packages/[id]`.
- OT desde admin: `POST /api/admin/pedidos/[id]/generar-ot`; visible en el detalle de pedido solo para `deliveryMethod="shipping"`.

**Flujo crítico checkout → orden → OT:**
1. Checkout: si el método es despacho y hay comuna, llama a `/api/shipping/cotizar` usando cantidad total real de libros.
2. Si la cotización responde costo, la UI muestra envío calculado y el total lo incluye; si no hay credenciales o Chilexpress falla, muestra envío pendiente/por confirmar y permite continuar.
3. `POST /api/ordenes` recalcula la cotización server-side. Si hay costo válido, guarda `orders.shippingCost`; si no, mantiene el comportamiento fallback actual.
4. Admin: al abrir un pedido de despacho, el bloque Chilexpress permite generar OT solo si el pedido está `paid` o `preparing` y aún no tiene OT.
5. Generación OT: el servicio calcula cantidad total real del pedido, selecciona empaque activo compatible, obtiene cobertura/tarifa, llama `createShipment()` y guarda OT/label/coberturas/costo en `orders`.
6. Si ya existe `chilexpressTransportOrderNumber`, no genera una segunda OT.

**Campos Chilexpress reales usados en `orders`:**
- `chilexpress_service_type_code`
- `chilexpress_service_description`
- `chilexpress_origin_coverage_code`
- `chilexpress_destination_coverage_code`
- `chilexpress_transport_order_number`
- `chilexpress_label_url`
- `shipping_cost`

**Notas operativas:**
- Sin credenciales Chilexpress, cotización y OT devuelven errores controlados; el checkout no se rompe y el admin muestra mensaje claro.
- `chilexpress_label_url` puede contener URL de etiqueta o data URI PDF base64 según respuesta del proveedor.
- No hay generación de OT automática; se hace desde el detalle del pedido en admin.
- No se implementó búsqueda de sucursales.

---

### Feature 4: Panel Admin
**Estado:** ✅ Funcional / 🔄 Alineación visual **parcial** (shell + vistas piloto listos; resto en micro-pulido)  
**Archivos clave:**
- `src/middleware.ts` — protege `/admin/*` y `/api/admin/*`
- `src/app/admin/(panel)/layout.tsx` — **sidebar** como eje del panel; `main` con canvas admin (p. ej. `admin-main-canvas` en `globals.css`)
- `src/features/admin/components/AdminSidebar.tsx` — navegación por secciones, colapsable, logout integrado
- `src/features/admin/components/AdminTopbar.tsx` — existe; **no** es estructural ni requerido en el layout; algunas vistas pueden usarlo, otras no
- `src/features/admin/services/auth-service.ts`
- `src/features/admin/services/product-admin-service.ts`
- `src/features/admin/services/category-admin-service.ts`
- `src/features/admin/services/order-admin-service.ts`
- `src/features/admin/services/shipping-admin-service.ts`
- `src/features/admin/services/landing-admin-service.ts`

**Cómo funciona:**
JWT en cookie HTTP-only `admin-session` (24h, firmado con `jose`). Middleware Edge Runtime verifica el token en cada request. El admin puede gestionar: productos (CRUD + imágenes), categorías, pedidos (cambio de estado + notas internas + bloque Chilexpress para OT/etiqueta), **envíos** (`/admin/envios`: configuración Chilexpress y empaques), **landing** (hero, top banner, hero final, panorámica categorías, selección del mes, footer — ver Feature 5; ruta `banners` legado si aplica), `/nosotros` y resto de contenido.

**Shell y vistas piloto (estado reciente):**
- **Sidebar** agrupada por secciones (Dashboard, Catálogo, Pedidos, Contenido, etc.); estilo **oscuro** “app”; **anchos expandido/colapsado** con transición; **logout** en la zona inferior — **eje principal** de navegación.
- **Topbar:** componente disponible, pero **el panel no depende** de un topbar global para funcionar; no asumir topbar en todas las pantallas.
- **Dashboard** (`/admin`) y listado de **Productos** reconstruidos visualmente y usados como referencia; **AdminMetricCard** y **AdminTable** son la base reutilizable para otras listas.
- **Envíos** (`/admin/envios`): configuración global Chilexpress, peso estimado por libro, código de cobertura origen y CRUD de empaques con desactivación lógica (`isActive=false`).
- **Resto** de pantallas admin fuera del Landing (categorías catálogo, pedidos, nosotros, etc.): **micro-pulido progresivo** al mismo lenguaje visual — no asumir que todas tengan ya el mismo nivel de pulido que Dashboard/Productos.
- **Navegación Landing en sidebar** (`AdminSidebar`, sección Contenido): orden **Top Banner** → **Hero principal** → **Selección del mes** → **Categorías del landing** → **Hero final** → **Footer** → **Página Conócenos**. La entrada general `/admin/landing` fue removida del sidebar; `/admin/landing/page.tsx` puede existir por compatibilidad. La ruta **`/admin/landing/banners`** puede existir por compatibilidad/legado; **no** forma parte del flujo principal listado en sidebar.

---

### Feature 5: Landing editable
**Estado:** ✅ **Hero principal**, **Top banner**, **Selección del mes**, **Categorías del landing** (panorámica), **Hero final** (Quote) y **Footer** con flujos admin dedicados y preview en vivo donde aplica. **Recién llegados** automático (`getNewProducts` en home). **Instagram** externo (Elfsight), sin pantalla admin. Tipografía hero: **Castoro** + **Inter** (`globals.css`).  
**Archivos clave (Hero / landing reciente):**
- `src/features/catalogo/view-models/hero-view-model.ts` — `getHeroViewModel()` → `HeroViewModel` / `HeroSlideViewModel`
- `src/features/catalogo/view-models/banners-view-model.ts`, `section-copy-view-model.ts` — `BannersViewModel`, `SectionCopyViewModel` (+ `libros-mes-`, `categorias-`, `nosotros-view-model.ts`)
- `src/features/catalogo/components/HeroSlider.tsx` — recibe `data: HeroViewModel` (storefront)
- `src/features/catalogo/components/hero/HeroPreview.tsx` — **preview reutilizable** (admin; mismo criterio visual que el home)
- `src/features/admin/components/LandingEditorShell.tsx` — contenedor de edición de landing
- `src/features/admin/components/landing/HeroAdminEditor.tsx` — formulario y layout de edición del hero
- `src/app/(store)/layout.tsx` — **`TopBanner`** antes de **`Navbar`** (fila superior pública)
- `src/app/(store)/page.tsx` — compone el home; hero desde view model; novedades, selección, categorías + panorámica, quote, Instagram
- `src/shared/config/landing.ts` — constantes y tipos (defaults de overlay, tema, alineación, `MONTHLY_SELECTION_SECTION`, etc.)

**También:** `LibrosMesSection`, `CategoryCarousel`, `RecentProductsCarousel`, `QuoteSection`, `CategoryCard`, `InstagramSection`, `TopBanner` + `TopBannerClient`, `LandingWithSplash`.

**Patrón Hero (admin):** estado local del formulario → derivación de **`HeroViewModel` en vivo** (`liveViewModel`) → **`HeroPreview`** → persistencia (API/servicios) → **`router.refresh`** (`HeroAdminEditor.tsx`).

**Secciones y su fuente de datos:**
- **Hero** → `hero_slides`. **Admin** `/admin/landing/hero` — `LandingEditorShell` + **`HeroAdminEditor`** + **`HeroPreview`**. **Storefront:** `getHeroViewModel()` → `HeroSlider`.
- **Top banner** → `banners` con **`position="top_banner"`** (título obligatorio en servidor para renderizar). **Admin** `/admin/landing/top-banner` — formulario propio + preview en vivo (espejo visual de la franja). API dedicada **`/api/admin/landing/top-banner`**. Público: `TopBanner` → `TopBannerClient`; **Navbar** `sticky top-0` + `z-[100]`. Cierre local con X. **Opcional futuro:** variantes normal/marquee y colores vía **metadata** jsonb.
- **Hero final (etiqueta UI)** → mismo concepto que antes “hero intermedio”: **`banners`** con **`position="hero_intermedio"`** (frase → `title`, autor/subtexto → `description`, imagen, enlace opcional). **Admin** `/admin/landing/hero-final` — preview con **`QuoteSection`** real. Storefront: `getHeroIntermedio()` en `page.tsx` alimenta `QuoteSection`.
- **Categorías del landing (panorámica)** → **`banners.position="categories_panorama"`** + listado real de categorías. **Admin** `/admin/landing/categorias` — preview con **`CategoryCard`** y `GET /api/categorias` si hay datos; si no, placeholders mock en preview.
- **Selección del mes** → **`featured_products`** sección canónica `monthly_selection` + `?filter=seleccion`. **Admin** `/admin/landing/seleccion` — búsqueda, agregar libros, activar/desactivar, quitar y reordenar desde la lista. El formulario visible está simplificado: sin descripción editorial por producto y sin orden manual. **`featured_products.description`** es texto **por producto** en admin; **no** sirve como título ni copy general del bloque. El **título / párrafo intro** del bloque se editan con **`landing_section_copy`** usando key **`"libros_mes"`**; storefront usa fallback si no hay copy en BD.
- **Recién llegados** → `getNewProducts` en home — **sin** admin.
- **Instagram** → widget Elfsight — **sin** admin por ahora.
- **Copy por sección (landing)** → **`landing_section_copy`** disponible en schema; **Selección del mes** ya consume key `"libros_mes"` para copy general.
- **Footer** → texto **`footer_content`** + ilustración **`banners.position="footer_illustration"`** + metadata visual. **Admin** `/admin/landing/footer` con estructura: contenido de texto + imagen ilustrativa en 2 columnas, preview live full-width y parámetros visuales debajo. Campos de `footer_content`: `brandDescription`, `catalogLinks`, `infoLinks`, `address`, `mapsUrl`, `copyrightText`, `designCredit`. Metadata visual: `opacity`, `fadeStart`, `fadeEnd`, `imgWidth`, `artSpaceWidth`, `textTone: "current" | "dark"`. `textTone` permite mantener colores actuales o usar `var(--text)` / tono oscuro en el footer público. Preview live aplica cambios al instante.

**Imagen panorámica en categorías (CAT3):**
`CategoryCarousel` acepta `panoramaUrl?: string | null`. Cuando está presente, cada `CategoryCard` usa CSS `background-image` con `background-position` calculado: `(index / (total-1)) * 100% 50%`. Efecto: la imagen panorámica se distribuye horizontalmente entre todas las tarjetas. Sin panorama, las tarjetas usan su `imageUrl` individual o el gradiente de fallback. Configurable desde `/admin/landing/categorias`.

**Padding vertical corregido (CAT2):**
`RecentProductsCarousel`, `LibrosMesSection`, `CategoryCarousel` usan `paddingTop/Bottom: "5rem"` (antes 2.5rem). `QuoteSection` usa `paddingTop/Bottom: "6.25rem"` + overlay con div separado `rgba(30,24,0,0.62)`. Buscador Navbar: `maxWidth: "300px"` inline.

**Footer dinámico (CAT4):**
`src/features/catalogo/services/landing-service.ts` centraliza `getFooterIllustration()` y `getFooterContent()`. `src/shared/ui/Footer.tsx` consume esos servicios directamente como Server Component, llama `noStore()` y ya no hace self-fetch HTTP con fallback silencioso. `src/app/api/landing/footer/route.ts` queda como endpoint público compatible, usa el mismo servicio y `force-dynamic`. Links del footer se guardan como `"label::href|||label::href"` en BD. La imagen y metadata visual del footer se leen desde `banners.position = "footer_illustration"`.

**Estado visual posterior a `6f39d2b`:**
- Se integró la propuesta visual del storefront del diseñador directamente sobre la base funcional existente
- `src/app/globals.css` consolidó la nueva dirección visual aceptada para la tienda pública: fuentes, espaciados, radios, overlays y clases globales
- Navbar, home, footer, catálogo, detalle de producto, carrito, checkout y `/nosotros` quedaron alineados con ese lenguaje visual
- Se añadieron assets nuevos de marca en `public/images/Logo-Crecer.png` y `public/images/Logo-Crecer1.png`
- Se añadió `src/shared/ui/BlurFade.tsx` como wrapper visual reutilizable
- Se añadió `src/shared/config/landing.ts` para centralizar constantes del storefront y de la selección editorial

---

### Feature 8: Logo real + BrandLoader + Splash screen (CAT1)
**Estado:** ✅ Completa  
**Archivos clave:**
- `src/shared/ui/Logo.tsx` — Logo SVG + texto "Crecer" con cruz dorada (reemplaza BrandMark hardcodeado en Navbar y Footer)
- `src/shared/ui/BrandLoader.tsx` — Spinner Lottie usando `lottie-react`, carga `public/animations/Loader_16.json`
- `public/animations/Loader_16.json` — Animación Lottie con colores gold `[0.788, 0.659, 0.298, 1]` (#c8a830)
- `src/features/landing/LandingWithSplash.tsx` — Client Component, muestra `BrandLoader` por 3.5s antes de renderizar el home
- `src/app/(store)/page.tsx` — envuelto en `LandingWithSplash` (solo primera visita o navegación directa al home)
- `src/app/(checkout)/checkout/confirmacion/page.tsx` — usa `BrandLoader` en lugar del spinner SVG genérico

**Cómo funciona:**
`BrandLoader` importa la animación Lottie y la renderiza con `lottie-react`. `LandingWithSplash` mantiene estado `showSplash` con `setTimeout(3500)`; mientras `showSplash=true` muestra el loader centrado en pantalla completa, luego monta el contenido real. La confirmación de pago usa `BrandLoader` en el estado de polling `pending`.

**Nota (footer / admin):** un acceso discreto a login admin puede existir; **no** es parte relevante del flujo público — no priorizarlo en el diseño de narrativa del handoff.

---

### Feature 9: Página /nosotros con CMS (CAT5)
**Estado:** ✅ Completa  
**Archivos clave:**
- `src/app/(store)/nosotros/page.tsx` — Server Component, hero moss, secciones alternadas, CTA
- `src/app/admin/(panel)/nosotros/page.tsx` — Client Component CRUD con `AdminUploadZone`
- `src/app/api/nosotros/route.ts` — GET público secciones activas ordenadas por `displayOrder`
- `src/app/api/admin/nosotros/route.ts` — GET all + POST crear (con auto-incremento de `displayOrder`)
- `src/app/api/admin/nosotros/[id]/route.ts` — PUT actualizar + DELETE soft (isActive=false)
- `src/app/api/admin/nosotros/[id]/imagen/route.ts` — POST imagen via `uploadBannerImage(file, "promo")`
- `src/integrations/drizzle/schema/landing.ts` — tabla `aboutSections`

**Cómo funciona:**
Las secciones tienen `title`, `content`, `imageUrl`, `imagePosition` ("right"|"left"), `displayOrder`, `isActive`. La página pública alterna fondo beige/white por índice par/impar. Cuando hay imagen, usa grid 2 columnas con orden CSS según `imagePosition`. Sin imagen, el texto ocupa `maxWidth: 720px`. El admin permite crear, editar, activar/desactivar y eliminar (soft) cada sección. Las imágenes se suben a bucket `banners` con subcarpeta `promo`.

**Navbar (CAT5):**
- Link "Conócenos" agregado en desktop y drawer móvil; hoy va al final del menú público
- `navLinksAfterCategories` actualizado: `?filter=seleccion` (Selección del mes) y `?filter=nuevo` (Recién llegados)
- La selección editorial del sitio es única: home, header, catálogo y admin apuntan a `monthly_selection`
- `NavbarSearch` separado de `Navbar`: autocomplete simple desde `/api/productos?search=...&limit=8`, solo productos, solo ícono de lupa + título; no muestra miniatura, precio, autor, editorial, descripción ni stock. Escape/click fuera cierra; Enter va al listado general; click en sugerencia va al detalle.

---

### Feature 10: Integración visual del storefront
**Estado:** ✅ Tienda pública alineada al diseño / ✅ **Admin Landing:** sidebar como eje y editores por sección cerrados (ver Feature 5); 🔄 micro-pulido progresivo del resto del panel fuera del Landing.  
**Referencia de hito histórico** (no sustituye el log de git): `6f39d2b` — integración de cambios visuales del storefront en tienda pública

**Alcance integrado (tienda pública):**
- Home (hero, top banner sobre navbar sticky, selección del mes, categorías con panorámica opcional, recién llegados, quote/hero final, Instagram, Footer); catálogo, detalle, carrito, checkout; `/nosotros` con CMS; responsive.

**Alcance admin (situación actual):**
- **Listo:** shell (**sidebar** colapsable, logout), clases de layout en `globals.css`, **Dashboard** y **Productos** como referencia; **AdminMetricCard** y **AdminTable**; **Topbar** opcional por vista, no dependencia estructural; **flujo Landing** con rutas directas en sidebar (orden en Feature 4 / Feature 5).
- **Siguiente capa:** micro-pulido de otras pantallas fuera del Landing; mejoras opcionales de Top Banner (metadata/marquee/colores) y posibles E2E/Playwright admin → storefront.

**Importante:**
- **SEO y Chilexpress Fase 1–3** ya están implementados en código; no interpretar esto como credenciales Chilexpress configuradas ni migración Supabase aplicada. VESSI y Resend siguen pendientes; ver backlog y checklist final.

---

### Feature 6: Mobile responsive + menú hamburguesa
**Estado:** ✅ Completa  
**Archivos modificados:**
- `src/shared/ui/Navbar.tsx` — hamburger button + drawer móvil + búsqueda + categorías accordion
- `src/shared/ui/Footer.tsx` — grid responsive 1/4 columnas
- `src/shared/ui/CartPanel.tsx` — zona central fija 182px (vacío e items)
- `src/features/catalogo/components/FilterBar.tsx` — chips móvil scroll horizontal
- `src/features/catalogo/components/ProductGallery.tsx` — thumbnails con flex-wrap
- `src/features/catalogo/components/RecentProductsCarousel.tsx` — clase `.recent-products-grid`
- `src/features/checkout/components/CheckoutForm.tsx` — `.form-grid-2col`, `.form-grid-street`
- `src/app/globals.css` — clases CSS: `.form-grid-2col`, `.form-grid-street`, `.filter-bar-chips-mobile`, `.recent-products-grid`

**Comportamiento del drawer móvil (`<lg`):**
- Botón hamburger en Navbar, oculto en `lg:hidden`
- Drawer fijo desde `top: 64px`, z-index 99, anima con opacity + translateY
- Backdrop con z-index 98 — cierra al hacer click
- Cierra al presionar Escape, al navegar a otra ruta
- Body scroll-lock mientras está abierto
- Incluye: input de búsqueda, links de nav, accordion de categorías

---

### Feature 7: Tests E2E con Playwright
**Estado:** ✅ Instalado y configurado — **correr** `npm run test:e2e` en el entorno para resultados al día (había ~32 passing y 1 skipped known issue en configuraciones anteriores).  
**Archivos:**
- `playwright.config.ts` — baseURL `:3000`, Chromium + Pixel 5 mobile
- `tests/home.spec.ts` — 6 tests
- `tests/catalogo.spec.ts` — 9 tests (1 skipped: chip "Todos" router.push known issue)
- `tests/producto.spec.ts` — 7 tests
- `tests/carrito.spec.ts` — 5 tests
- `tests/admin.spec.ts` — 5 tests
- `tests/checkout.spec.ts` — 6 tests ⚠️ PENDIENTE DE CORREGIR

**Known issue — chip "Todos" en catálogo:**
`router.push("/productos")` en Next.js 15 App Router no dispara eventos de navegación detectables por Playwright cuando la URL actual ya tiene `?filter=`. Confirmado con `waitForFunction` en `window.location.href`. Funciona correctamente en browser real. Marcado como `test.skip` con comentario en `catalogo.spec.ts:37`.

**Para correr los tests:**
```bash
# Asegurarse de que el dev server esté corriendo en :3000
npm run dev
# En otra terminal:
npm run test:e2e                                           # todos
npm run test:e2e -- --project=chromium                    # solo desktop
npx playwright test home.spec.ts catalogo.spec.ts ...     # archivos específicos
```

---

## ⚙️ REGLAS CRÍTICAS DE CÓDIGO

### R1 — TopBanner: importar SIEMPRE directo, nunca por barrel
**Por qué:** Importa Drizzle (Node.js `fs`). Si entra al barrel `shared/ui/index.ts`, los Client Components lo arrastran al bundle del cliente → `Module not found: Can't resolve 'fs'`

```typescript
// ✅ CORRECTO
import { TopBanner } from "@/shared/ui/TopBanner";

// ❌ INCORRECTO
import { TopBanner } from "@/shared/ui"; // barrel — rompe el build
```

---

### R2 — DATABASE_URL: parseo manual obligatorio
**Por qué:** El username de Supabase tiene un punto (`postgres.projectref`). `postgres.js` lo parsea mal si recibe la URL directa.

```typescript
// ✅ CORRECTO — client.ts ya lo hace con new URL() manual
// No cambiar el código de parseo en src/integrations/drizzle/client.ts

// ❌ INCORRECTO
const db = drizzle(process.env.DATABASE_URL); // el punto en el username se pierde
```

---

### R3 — SSL siempre requerido en Drizzle
**Por qué:** Supabase siempre requiere SSL. Sin él las conexiones cuelgan indefinidamente.

```typescript
// ✅ CORRECTO
postgres({ ssl: "require", connect_timeout: 10, ... })

// ❌ INCORRECTO
postgres({ ssl: dbConfig.useSsl ? "require" : undefined }) // condicional → cuelga
```

---

### R4 — Login admin: window.location.href, no router.push
**Por qué:** `router.push()` + `router.refresh()` se cancelan mutuamente en App Router. La navegación no ocurre.

```typescript
// ✅ CORRECTO
window.location.href = nextPath ?? "/admin";

// ❌ INCORRECTO
router.push("/admin");
router.refresh(); // cancela el push
```

---

### R5 — addItem en el carrito: siempre agrega 1
**Por qué:** La firma de `addItem` no acepta `quantity`. Para agregar más de 1, usar `updateQuantity` después.

```typescript
// ✅ CORRECTO
addItem(cartItem);               // agrega con quantity: 1
updateQuantity(productId, 3);    // si necesitas 3

// ❌ INCORRECTO
addItem({ ...cartItem, quantity: 3 }); // el tipo no lo acepta
```

---

### R6 — Tailwind v4: sin tailwind.config.ts
**Por qué:** Tailwind v4 configura tokens en `globals.css` vía `@theme inline`. No existe `tailwind.config.ts`.

```css
/* ✅ CORRECTO — en globals.css */
@theme inline {
  --color-gold: #c8a830;
}

/* ❌ INCORRECTO — no existe este archivo */
/* tailwind.config.ts */
```

**Clases arbitrarias / responsivas complejas no confiables con Turbopack + Tailwind v4. Usar:**
- `.page-px` para padding horizontal (definido en globals.css)
- `style={{ }}` para valores de padding vertical específicos
- Clases utilitarias definidas en `globals.css` para texto custom

---

### R7 — Soft delete siempre
**Por qué:** Los registros nunca se eliminan físicamente para mantener trazabilidad de pedidos.

```typescript
// ✅ CORRECTO
await db.update(products).set({ isActive: false }).where(eq(products.id, id));

// ❌ INCORRECTO
await db.delete(products).where(eq(products.id, id));
```

---

### R8 — Precios siempre como integer CLP
**Por qué:** Nunca usar float para dinero. Los precios en CLP no tienen decimales.

```typescript
// ✅ CORRECTO
price: integer("price").notNull()  // en el schema
subtotal: item.price * item.quantity  // math con integers

// ❌ INCORRECTO
price: real("price")  // float → errores de redondeo
```

---

### R9 — jose, no jsonwebtoken
**Por qué:** El middleware corre en Edge Runtime. `jsonwebtoken` usa APIs de Node.js que no están disponibles en Edge.

```typescript
// ✅ CORRECTO
import { jwtVerify, SignJWT } from "jose";

// ❌ INCORRECTO
import jwt from "jsonwebtoken"; // incompatible con Edge Runtime
```

> **Nota actual:** puede aparecer un warning no bloqueante relacionado con `jose` y Edge Runtime durante `npm run build`. No está rompiendo el build actual.

---

### R10 — .env.local: una variable por línea
**Por qué:** Si múltiples variables están en la misma línea, los valores se corrompen silenciosamente.

```bash
# ✅ CORRECTO
DATABASE_URL=postgresql://...
ADMIN_JWT_SECRET=...

# ❌ INCORRECTO
DATABASE_URL=postgresql://... ADMIN_JWT_SECRET=...
```

---

### R11 — no-console: solo warn y error
**Por qué:** El proyecto tiene ESLint configurado con la regla `no-console` que bloquea `console.log`.

```typescript
// ✅ CORRECTO
console.warn("Algo inesperado:", detail);
console.error("Error crítico:", err);

// ❌ INCORRECTO
console.log("debug"); // falla ESLint
```

---

### R12 — Playwright: scope locators a `main` para evitar CartPanel
**Por qué:** El `CartPanel` está siempre en el DOM con `opacity-0` cuando está cerrado. Locators como `getByText("Tu carrito está vacío")` o `getByText(/^\$[\d.]+/)` lo encuentran antes que el contenido principal → strict mode violations o matches de elementos ocultos.

```typescript
// ✅ CORRECTO en tests E2E
await expect(page.locator("main").getByText("Tu carrito está vacío")).toBeVisible();
await expect(page.locator("main").getByText(/^\$[\d.]+/).first()).toBeVisible();

// ❌ INCORRECTO
await expect(page.getByText("Tu carrito está vacío")).toBeVisible(); // puede encontrar CartPanel
```

---

### R13 — Migraciones Drizzle: generar SQL, aplicar manualmente en Supabase
**Por qué:** `drizzle-kit push` y `drizzle-kit migrate` fallan con el Session Pooler de Supabase. El username tiene un punto (`postgres.projectref`) que `postgres.js` parsea mal al recibir la URL directa, sin importar los flags SSL o `connect_timeout`. Las conexiones cuelgan indefinidamente.

```bash
# ✅ FLUJO CORRECTO para cambios de schema
npm run db:generate       # genera SQL en src/integrations/drizzle/migrations/
# → copiar el SQL generado
# → pegarlo en Supabase SQL Editor → "Run without RLS"

# ❌ INCORRECTO — cuelga siempre con Session Pooler
npx drizzle-kit push
npx drizzle-kit migrate
```

**Migraciones versionadas en el repo (referencia; aplicación en Supabase: manual, entorno por entorno — R13):**
- `0000`–`0002` — evolución inicial del schema
- `0003_add_footer_content.sql` — `footer_content`
- `0004_add_about_sections.sql` — `about_sections`
- `0005_extend_banners.sql` — columnas `eyebrow`, `cta_label` en `banners`
- `0006_create_landing_section_copy.sql` — tabla `landing_section_copy`
- Extensión de `hero_slides` (CTA, overlay, tema, alineación, etc.): ver SQL en el repo (p. ej. `drizzle/0005_extend_hero_slides.sql` en la raíz) y el estado actual de `src/integrations/drizzle/schema/landing.ts`

**Alineación:** el SQL aplicado en Supabase debe reflejarse en el **schema Drizzle** y en la **carpeta de migraciones**; evitar “schema adelantado” sin script correspondiente o viceversa.

---

### R14 — BrandLoader en lugar de spinners genéricos
**Por qué:** El proyecto tiene una animación Lottie con los colores exactos del sistema de diseño (`gold #c8a830`). Usar SVG spinner genérico o `animate-spin` rompe la consistencia visual.

```typescript
// ✅ CORRECTO
import { BrandLoader } from "@/shared/ui/BrandLoader";

// En JSX:
<BrandLoader className="h-8 w-8" />   // tamaño configurable vía className

// ❌ INCORRECTO
<svg className="animate-spin h-8 w-8 text-gold" ...>   // spinner genérico
```

`BrandLoader` acepta `className` para controlar el tamaño. Importar directo (no desde barrel si hay conflictos de Server/Client).

---

## 🐛 BUGS RESUELTOS — HISTORIAL COMPLETO

| # | Síntoma | Causa raíz | Fix permanente |
|---|---|---|---|
| 1 | `productId: string \| null` no asignable a `CreateOrderItemInput` | Schema Drizzle devuelve `string \| null`, el tipo espera `string` | Filtrar con type guard `(r): r is {...}` antes de `decrementStock` |
| 2 | `Module not found: Can't resolve 'fs'` en Client Components | `TopBanner` importado vía barrel `shared/ui/index.ts` arrastra Drizzle al cliente | Importar siempre directo: `@/shared/ui/TopBanner` |
| 3 | `jsonwebtoken` incompatible con Edge Runtime | Usa APIs de Node.js no disponibles en Edge | Usar `jose` en su lugar |
| 4 | `console.log` bloqueado por ESLint | Regla `no-console` del proyecto | Usar `console.warn` / `console.error` |
| 5 | `useRouter` importado sin usar tras cambiar a `window.location.href` | Se olvidó eliminar import y declaración | Eliminar import de `next/navigation` y el `const router` |
| 6 | SSL no activaba — conexiones colgando | `ssl` condicional a `?sslmode=require` en la URL; Supabase siempre requiere SSL | `ssl: "require"` siempre, sin condición |
| 7 | Páginas cargando indefinidamente sin error | Sin `connect_timeout` en el cliente postgres | Agregar `connect_timeout: 10` |
| 8 | Error de BD crasheaba toda la tienda | `StoreLayout` sin try/catch en la query de categorías | try/catch con fallback `categories = []` |
| 9 | Username de Supabase (`postgres.projectref`) — parseo incorrecto | `postgres.js` mal maneja el punto al recibir URL directa | Parseo manual con `new URL()` — no cambiar `client.ts` |
| 10 | Fallo silencioso de conexión en `.env.local` | Variables en una sola línea → valores corruptos | Una variable por línea sin excepción |
| 11 | Login admin no redirigía | `router.push()` + `router.refresh()` se cancelan mutuamente | `window.location.href = nextPath ?? "/admin"` |
| 12 | Stock descontado antes de confirmar pago | `decrementStock()` dentro de `createOrder()` (status `pending`) | Mover a `processPaymentResult()` al confirmar `paid` |
| 13 | Doble procesamiento: retorno + webhook simultáneos descontaban stock 2 veces | Ambos endpoints marcaban `paid` y descontaban stock | Guard `AND status = 'pending'` en la transacción — idempotente |
| 14 | Clases Tailwind arbitrarias/responsivas no compilaban | Turbopack + Tailwind v4 no detecta estas clases de forma confiable | `.page-px` en globals.css, `style={{}}` para valores únicos |
| 15 | Getnet rechazaba todas las sesiones de pago silenciosamente | `tranKey` calculado con `Base64(nonce)` como string en vez de bytes crudos — fórmula de producción es `SHA256(nonceBytes \|\| seed_utf8 \|\| secretKey_utf8)` → Base64 | `Buffer.concat([nonceBytes, Buffer.from(seed,"utf8"), Buffer.from(secretKey,"utf8")])` en `auth.ts` |
| 16 | `paymentStatus=[object Object]` en URL de retorno | `GetnetPaymentEntry.status` tipado como `string` pero Getnet devuelve objeto `{status, reason, message, date}` | Actualizar tipo a objeto anidado; acceder con `.status?.status` en `payment-service.ts` |
| 17 | Orden quedaba `pending` en BD cuando el cliente cancelaba el pago en Getnet | `cancelUrl` apuntaba directo a `/checkout/confirmacion` saltándose `/api/pagos/retorno` — el servidor nunca marcaba la orden como `cancelled` | `cancelUrl = appUrl/api/pagos/retorno?reference=...` (mismo endpoint que `returnUrl`) |
| 18 | UI del admin quedaba en estado loading permanente si el fetch lanzaba | `setLoading(false)` dentro del `try` — nunca se ejecutaba al ocurrir una excepción | `finally { setLoading(false) }` en todas las funciones de fetch de Client Components |
| 19 | Pool de conexiones agotado en desarrollo — queries del layout competían con API routes | `max: 1` conexión en desarrollo causaba que layout y API route se bloquearan mutuamente | `max: 3` en desarrollo, `max: 5` en producción en `client.ts` |
| 20 | Post-guardar en formulario de producto admin no navegaba | `router.push("/admin/productos")` + `router.refresh()` se cancelaban mutuamente (mismo patrón que bug #11) | `window.location.href = "/admin/productos"` en `product-admin-form.tsx` |
| 21 | Chip "Nuevos" en FilterBar no aplicaba filtro correcto | `filter=new` en lugar de `filter=nuevo` en la URL | Corregir valor del chip en `filterChips` array |
| 22 | Notas internas de pedido no se guardaban desde el admin | Campo `adminNotes` no incluido en el payload del PATCH `/api/admin/pedidos/[id]` | Agregar `adminNotes` al schema de actualización y al handler |
| 23 | Botón "Agregar al carrito y reintentar" en confirmación fallaba | `slug` del producto ausente en el snapshot de `order_items` — se usaba `productId` como fallback incorrecto | Incluir `slug` en `CreateOrderItemInput` y en el snapshot al crear la orden |
| 24 | Badge de cantidad del carrito no se actualizaba | `useCartHydration()` no estaba siendo respetado en `Navbar` — mostraba `0` hasta refresh | Envolver badge en condicional `hydrated &&` |
| 25 | Tarjetas de productos relacionados mostraban `price` en vez de `sale_price` | `effectivePrice` no calculado en el componente de relacionados | Usar `sale_price ?? price` consistente con el resto del catálogo |
| 26 | Link "/admin" visible en el footer para usuarios públicos | Footer incluía enlace admin sin restricción de visibilidad | Eliminar enlace admin del footer público |
| 27 | Búsqueda textual sin input en la UI | La API ya aceptaba `?search=` pero no había campo en `FilterBar` ni en el Navbar móvil | Agregar input de búsqueda en `FilterBar` (desktop) y en el drawer del menú hamburguesa (móvil) |
| 28 | `/categorias` mostraba solo `<h1>Categorias</h1>` placeholder | Página no implementada | Grid real con `CategoryCard`, header visual con breadcrumb, estado vacío con CTA |
| 29 | `ProductGrid` sin columnas responsive — 3 cols en mobile | `grid-cols-3` fijo | Cambiar a `grid-cols-2 lg:grid-cols-5` |
| 30 | Paginación sin número de página visible | Solo había botones prev/next sin indicador "Página X de Y" | Agregar indicador de página actual y total en `Pagination` |
| 31 | Stepper de cantidad ignoraba stock disponible | Botón `+` sin límite superior | Stepper respeta `product.stockQuantity` como máximo |
| 32 | Badge "Últimas unidades" ausente | No implementado | Badge en `ProductCard` cuando `stock_quantity ≤ 5` |
| 33 | Carrito, checkout y detalle de producto no eran responsive en mobile | Grids con `style={{ display: "grid", gridTemplateColumns: "1fr 380px" }}` fijos | Reemplazar con clases CSS (`.cart-layout-grid`, `.product-detail-grid`) en `globals.css` con media queries |
| 34 | `CartPanel` acumulaba height en mobile — no tenía zona central fija | Zona de items sin altura máxima constante | Zona central de 182px con overflow-y scroll, mantiene botones fijos |
| 35 | Catálogo, formularios de checkout, footer y galería sin responsive | Grids y layouts de 2 columnas fijos, thumbnails sin wrap | `.form-grid-2col`, `.form-grid-street`, `flex-wrap` en galería, `grid-cols-1 md:grid-cols-[...]` en footer |
| 36 | Menú de navegación inaccesible en mobile | Solo existía el nav desktop (`lg:hidden` para hamburger) | Drawer móvil en `Navbar` con búsqueda, links, accordion de categorías, body scroll-lock |
| 37 | Tests E2E fallaban por strict mode violations, stale locators y matches en elementos ocultos | `getByText("Tu carrito está vacío")` encontraba CartPanel oculto; `getByRole("button", { name: /añadir al carrito/i })` quedaba stale al cambiar texto a "Agregado"; `getByRole("link", { name: "Colección" })` encontraba Navbar + breadcrumb | Scope a `page.locator("main")`, locator separado para "Agregado", `.first()` en links duplicados |

---

## 🚀 BACKLOG PRIORIZADO

### P0 — Bloqueante para producción
- [ ] **Resend** — emails de confirmación de compra y cambio de estado de pedido
- [ ] **Seed de productos** — ejecutar `npm run seed:products` en producción
- [ ] **Credenciales Getnet producción** — obtener post-validación con Getnet, configurar en Vercel
- [ ] **Variables de entorno en Vercel** — `DATABASE_URL`, `ADMIN_JWT_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_ID`, variables Chilexpress si se activa despacho real

### P1 — Alta prioridad
- [x] **Página `/categorias`** — grid real con header visual implementado
- [x] **Búsqueda textual en UI** — input en FilterBar (desktop) y drawer hamburguesa (móvil), conectado a `?search=`
- [x] **Mobile responsive completo** — carrito, checkout, catálogo, detalle producto, CartPanel, footer
- [x] **Menú hamburguesa móvil** — drawer con búsqueda, links y categorías accordion
- [x] **Cron job de cancelación** — pedidos `pending` de +24h → `cancelled`, revertir cupones
- [x] **Polling en confirmación de pago** — ciclo 3s / 30s timeout hacia `GET /api/ordenes/[orderNumber]`
- [x] **Flujo completo de Getnet** — pago aprobado, rechazo, cancelación y botón "Agregar al carrito y reintentar" verificados en TEST
- [x] **Seed de productos actualizado** — 20 libros católicos reales y 9 categorías
- [x] **Checkout simplificado** — único método de pago (Getnet), dos opciones de entrega
- [x] **Auditoría de UX completa** — 6 bugs corregidos post-auditoría (filtro Nuevos, notas pedido, slug reintentar, badge carrito, salePrice relacionados, footer link admin)
- [x] **Logo real** — `Logo.tsx` reemplaza BrandMark hardcodeado en Navbar y Footer (CAT1)
- [x] **BrandLoader Lottie** — `BrandLoader.tsx` + `Loader_16.json` colores gold (CAT1)
- [x] **Splash screen 3.5s** — `LandingWithSplash.tsx` en home, `BrandLoader` en confirmación (CAT1)
- [x] **Espaciado landing** — secciones a 5rem, QuoteSection 6.25rem + overlay correcto (CAT2)
- [x] **Imagen panorámica categorías** — CSS background-position distribuida entre tarjetas, configurable desde admin (CAT3)
- [x] **Footer dinámico** — texto editable vía `footer_content`, ilustración/metadata vía `banners.footer_illustration`, consumo público desde servicios/BD con `noStore()` (CAT4)
- [x] **Filtro Selección del mes** — `?filter=seleccion` en catálogo vía subquery `featured_products` (CAT5)
- [x] **Página /nosotros** — CMS completo: secciones alternadas, admin CRUD, imágenes (CAT5)
- [x] **Navbar Conócenos** — link en desktop y drawer móvil; actualmente al final del menú; links actualizados a `?filter=seleccion` y `?filter=nuevo` (CAT5)
- [x] **NavbarSearch autocomplete** — componente separado, mínimo 2 caracteres, debounce aprox. 280 ms, máximo 8 productos, muestra solo lupa + título; búsqueda en `title`, `author`, `coverType`, `publisher`; no busca en `description`
- [x] **Editorial / publisher** — columna `products.publisher`, campo Editorial en admin crear/editar, tipos/servicios actualizados y detalle público muestra Editorial si existe
- [🔄] **UI/UX del panel admin (parcial)**  
  - [x] Shell: **sidebar** como eje, oscuro, colapsable; logout; canvas admin; **Topbar** existe pero no es estructural global  
  - [x] Vistas piloto: Dashboard + Productos (listado); **AdminMetricCard** + **AdminTable** como base  
  - [ ] **Micro-pulido** del resto de pantallas admin al mismo lenguaje visual  
- [x] **Hero / landing (núcleo)** — `hero_slides` extendido, `HeroViewModel` + `HeroSlider`, `HeroPreview` + `HeroAdminEditor` + `LandingEditorShell`; tipografía Castoro/Inter en hero  
- [x] **Landing — editores dedicados cerrados** — top banner (`top_banner`), hero principal, selección del mes, panorámica categorías (`categories_panorama`), hero final (`hero_intermedio`) y footer; sidebar con rutas directas a cada sección  
- [x] **Footer (admin + storefront)** — contenido en `footer_content`, ilustración/metadata en `footer_illustration`, preview live, `textTone` y `Footer` público vía servicios/BD con `noStore()`  
- [ ] **Landing — mejoras opcionales** — top banner variantes/colores/marquee vía `metadata`; posibles E2E/Playwright admin → storefront  
- [x] **SEO completo** — metadata global/páginas/productos, JSON-LD, Open Graph con fallback, sitemap.xml y robots.txt
- [x] **Chilexpress Fase 1–3** — infraestructura, cotización checkout con fallback, admin envíos, empaques y generación de OT/etiqueta desde pedido
- [ ] **Credenciales Chilexpress + prueba real** — configurar llaves/códigos del cliente y validar cotización/OT contra ambiente definido
- [x] **Migración manual Supabase para Chilexpress en entorno actual** — aplicadas/verificadas `shipping_config`, `shipping_packages` y columnas Chilexpress de `orders`; seguir verificando por entorno
- [ ] **Alinear cotización storefront con admin envíos** — `/api/shipping/cotizar` todavía no usa `shipping_config` ni `shipping_packages`
- [ ] **VESSI** — implementar según la definición/respuesta ya recibida. Integración base en `src/integrations/inventory/`

### P2 — Lanzamiento / Fase 5
- [ ] Optimización de imágenes: `priority` en LCP (HeroSlider), lazy en galería
- [x] **Playwright** — E2E instalado; **correr** `npm run test:e2e` en el entorno para conteos y estado al día
- [ ] **`checkout.spec.ts` pendiente** — 6 tests del flujo completo de compra escritos pero sin corregir; requieren Getnet TEST activo y datos en BD
- [ ] UI de admin para cupones (actualmente solo vía BD directa)
- [ ] UI de admin para usuarios admin adicionales (actualmente solo `seed:admin`)
- [ ] Páginas legales: política de privacidad, términos y condiciones
- [ ] **Resend / emails** — confirmaciones y comunicaciones transaccionales
- [ ] **Deploy final y checklist de lanzamiento** — variables, credenciales, smoke test y revisión final antes de publicar

---

## 🗄 BASE DE DATOS

El número exacto de tablas y el detalle al día **no** se fijan en este handoff: partir de `src/integrations/drizzle/schema/`. A grandes rasgos, además del núcleo de comercio, existen tablas de **contenido** entre las que figuran (no exhaustivo):

| Tabla | Descripción |
|---|---|
| `categories` | Categorías con jerarquía (parent_id), slug, featured, display_order |
| `products` | Catálogo con price/sale_price (integer CLP), stock, is_featured, is_active, `publisher` opcional para Editorial |
| `product_categories` | Relación muchos-a-muchos productos ↔ categorías |
| `product_images` | Galería de imágenes por producto (display_order) |
| `orders` | Órdenes con status (pending→paid→preparing→shipped→delivered→cancelled) |
| `order_items` | Items con snapshot de título, precio y SKU al momento de compra |
| `order_customers` | Datos del comprador invitado (nombre, email, teléfono) |
| `order_addresses` | Dirección de despacho (solo si delivery_method = "shipping") |
| `shipping_config` | Configuración Chilexpress: origen, cobertura, peso estimado por libro, TCC/RUT, tipo de servicio, producto/contenido, valor declarado y estado activo |
| `shipping_packages` | Empaques Chilexpress: dimensiones, peso máximo, peso propio, máximo de items, default y desactivación lógica |
| `coupons` | Cupones de descuento (percentage o fixed), vigencia, usos |
| `hero_slides` | Slides del hero: imagen, copy, CTA, overlay (variante/opacidad), alineación, tema, `showContent`, órden y activo — **ver columnas en schema** |
| `banners` | Banners por `position` (p. ej. `top_banner`, `hero_intermedio`, `categories_panorama`, `footer_illustration`, …) + **eyebrow**, **cta_label**, **metadata** jsonb (footer: `opacity`, `fadeStart`, `fadeEnd`, `imgWidth`, `artSpaceWidth`, `textTone`; extensiones futuras) |
| `featured_products` | Selección editorial (`monthly_selection` → home + `?filter=seleccion`) |
| `admin_users` | Usuarios del panel admin con password_hash |
| `footer_content` | Texto editable del footer: descripción, links, dirección, copyright, etc. |
| `about_sections` | Secciones de /nosotros |
| `landing_section_copy` | Textos reutilizables por `section_key` (eyebrow, título, body, CTA) — **Abril 2026 en schema** |

**Columnas Chilexpress en `orders`:** `chilexpress_service_type_code`, `chilexpress_service_description`, `chilexpress_origin_coverage_code`, `chilexpress_destination_coverage_code`, `chilexpress_transport_order_number`, `chilexpress_label_url`. Se reutilizan esos nombres reales; no crear campos duplicados para OT/label.

**Migraciones en repo:** `src/integrations/drizzle/migrations/` (incl. `0005`, `0006` y anteriores) y, si aplica, SQL complementario p. ej. bajo `drizzle/` en la raíz. **Aplicación en Supabase:** siempre **manual** según R13; **no** afirmar desde el handoff qué script está aplicado en producción u otro entorno; quien despliega **verifica** y mantiene **paridad** schema ↔ SQL aplicado.

**SQL manual reciente / referencia:** por inconsistencias del journal/migraciones Drizzle con cambios ya aplicados manualmente, `npm run db:migrate` no debe asumirse confiable ahora mismo. Falló intentando crear `footer_content` ya existente. Cambios recientes aplicados o a verificar por entorno desde Supabase SQL Editor:

```sql
ALTER TABLE products ADD COLUMN IF NOT EXISTS publisher text;
```

También verificar existencia de tablas `shipping_config`, `shipping_packages` y columnas en `orders`: `chilexpress_service_type_code`, `chilexpress_service_description`, `chilexpress_origin_coverage_code`, `chilexpress_destination_coverage_code`, `chilexpress_transport_order_number`, `chilexpress_label_url`.

**Nota Chilexpress / Supabase:** el schema Drizzle ya contiene `shipping_config`, `shipping_packages` y columnas Chilexpress en `orders`, pero la instancia remota debe verificarse/aplicarse manualmente. En particular, las columnas recientes usadas por admin son:

```sql
alter table shipping_config add column if not exists estimated_book_weight_grams integer not null default 300;
alter table shipping_packages add column if not exists max_weight_grams integer not null default 1000;
alter table shipping_packages add column if not exists package_weight_grams integer not null default 0;
```

---

## 🔑 VARIABLES DE ENTORNO

```bash
# Base de datos — Session Pooler (puerto 5432, NO Transaction Pooler en 6543)
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL=https://[ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Auth admin (mínimo 32 caracteres)
ADMIN_JWT_SECRET=...

# Getnet (dejar vacío en dev para usar credenciales TEST hardcodeadas)
GETNET_LOGIN=
GETNET_SECRET_KEY=
GETNET_ENDPOINT=
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Chilexpress (pendiente de credenciales reales del cliente)
CHILEXPRESS_COVERAGE_API_KEY=
CHILEXPRESS_RATING_API_KEY=
CHILEXPRESS_SHIPMENT_API_KEY=
CHILEXPRESS_COVERAGE_ENDPOINT=
CHILEXPRESS_RATING_ENDPOINT=
CHILEXPRESS_SHIPMENT_ENDPOINT=
CHILEXPRESS_ORIGIN_REGION_CODE=02
CHILEXPRESS_ORIGIN_COMMUNE=Antofagasta
CHILEXPRESS_ORIGIN_COVERAGE_CODE=
CHILEXPRESS_TCC=
CHILEXPRESS_SENDER_RUT=

# Instagram
NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_ID=1e93ffdc-0e7e-4160-b103-98c5a444c896

# Cron job (Vercel — requerido para proteger el endpoint)
CRON_SECRET=
```

> **Crítico:** Usar Session Pooler (puerto 5432), NO Transaction Pooler (puerto 6543). El Transaction Pooler causó fallos de conexión previos.

### Notas importantes Chilexpress

- El código ya está preparado, pero todavía no hay credenciales Chilexpress reales configuradas. Sin esas variables, `/api/shipping/cotizar` y generar OT responden errores controlados.
- Variables mínimas para cotizar: `CHILEXPRESS_COVERAGE_API_KEY` y `CHILEXPRESS_RATING_API_KEY`. Recomendadas: `CHILEXPRESS_ORIGIN_COVERAGE_CODE`, `CHILEXPRESS_ORIGIN_REGION_CODE=02`, `CHILEXPRESS_ORIGIN_COMMUNE=Antofagasta`. `CHILEXPRESS_SHIPMENT_API_KEY` se usa para generar OT/etiqueta, no para cotizar.
- Checkout no bloquea la compra si Chilexpress no cotiza: muestra despacho pendiente/por confirmar y `createOrder` conserva el fallback actual (`shippingCost: 0`) cuando no hay cotización válida. En UI corresponde a `shippingQuote.status === "unavailable"`.
- La OT se genera manualmente desde el detalle de pedido admin, solo para pedidos `shipping` con estado `paid` o `preparing`.
- La migración en Supabase es manual: en el entorno actual ya se aplicaron/validaron `shipping_config`, `shipping_packages` y columnas Chilexpress de `orders`; volver a verificar en cada entorno, especialmente Vercel/preview.
- Diagnóstico vigente: el storefront cotiza parcialmente, pero todavía no usa `shipping_config` ni `shipping_packages`; admin y checkout pueden quedar desalineados y el peso público actual no necesariamente usa `estimatedBookWeightGrams`.

---

## 📖 LECCIONES APRENDIDAS — RESUMEN DE REGLAS

| Síntoma que verás | Regla que aplica |
|---|---|
| `Can't resolve 'fs'` en Client Component | `TopBanner` importado vía barrel → usar import directo |
| Conexión a BD cuelga sin error | Falta `ssl: "require"` o `connect_timeout: 10` |
| Login admin no redirige | Usar `window.location.href`, no `router.push` + `router.refresh` |
| Error de tipos en items de orden | Type guard antes de `decrementStock` |
| ESLint falla con `console.log` | Solo `console.warn` / `console.error` |
| Clases Tailwind no aplican | Usar `.page-px` y `globals.css` — no clases arbitrarias con Turbopack |
| `.env.local` no carga variables | Una variable por línea — sin excepciones |
| Stock descontado doble | Guard `status = 'pending'` en transacción de pago |
| Test Playwright falla con "strict mode violation" | Scoped a `page.locator("main")` o usar `.first()` explícito |
| Test Playwright falla con "element not found" post-click | Usar locator separado después del click (no reusar el mismo si el DOM cambia) |
| `drizzle-kit push` o `migrate` cuelga con Supabase | Session Pooler incompatible con drizzle-kit CLI — usar `db:generate` + SQL manual en Supabase SQL Editor (R13) |
| Spinner genérico en vez del loader del sistema de diseño | Usar `BrandLoader` de `@/shared/ui/BrandLoader` — animación Lottie con colores gold del proyecto (R14) |

---

## 🟢 ESTADO ACTUAL DEL PROYECTO

**Resumen:** Fases funcionales 1–4C y auditorías previas cubiertas; **tienda pública** responsive e identidad alineada al diseño; **admin** operativo con **shell** basado en **sidebar** (oscuro, colapsable, logout) y **vistas piloto** (Dashboard, Productos) con **AdminMetricCard** y **AdminTable**. Existe **Topbar** como componente; **no** es eje estructural del panel. **No** asumir que *todas* las pantallas admin estén al mismo nivel de acabado.

**Comercio y pagos (sin cambio de reglas de negocio):** flujo de compra Getnet (TEST) verificado; stock al pasar a `paid`; idempotencia en retorno/webhook; cron de pendientes. Detalle en Feature 3.

**Contenido CMS — Landing:** Panel Admin Landing cerrado funcional y visualmente. **Hero**, **Top banner**, **Selección del mes**, **Categorías del landing**, **Hero final** y **Footer** tienen pantallas admin dedicadas y rutas directas desde el sidebar (ver Feature 5). **Recién llegados** e **Instagram** sin admin de contenido. **Footer:** texto en `footer_content`, ilustración/metadata en `banners.footer_illustration`, preview live y storefront conectado a servicios/BD con `noStore()`. **`/nosotros`:** CMS aparte.

**SEO, catálogo y Chilexpress:** SEO completo en código. Navbar/buscador actualizado: `Conócenos` al final, `NavbarSearch` con autocomplete de productos y búsqueda en `title`, `author`, `coverType`, `publisher` (**no** `description`). Chilexpress Fase 1–3 completa en código: cotización checkout con fallback, endpoint público, admin de envíos, empaques, OT/etiqueta desde pedido y campos reales en `orders`. En el entorno actual se validaron tablas/columnas de envíos aplicadas manualmente; pendiente: credenciales reales Chilexpress, prueba contra ambiente cliente y alinear cotización pública con config/empaques admin.

**Pendiente de producto/infra:** primer preview Vercel para clienta → credenciales/prueba Chilexpress → **Resend/emails** → **VESSI** → **QA final/deploy**, más P0 (variables, credenciales, seed) al acercarse a producción. Opcional landing: Top Banner con marquee/colores vía `metadata`, revisión de fondos moss grandes y pruebas E2E/Playwright admin → storefront — ver checklist.

**Calidad y tests:** tras buscador/publisher, `npx.cmd tsc --noEmit` pasó y `npm.cmd run lint` pasó con warnings preexistentes (`<img>`, `useScrollReveal`). Para preview, volver a verificar con `npx.cmd tsc --noEmit`, `npm.cmd run lint` y `npm run build`; Playwright y `checkout.spec.ts` — **correr** en el entorno para estado al día; ver sección de warnings.

### Pendientes inmediatos para preview Vercel

- [ ] Preparar primer preview link de Vercel para la clienta.
- [ ] Configurar variables de entorno en Vercel: BD, Supabase, admin, Getnet/NEXT_PUBLIC_APP_URL, Elfsight y Chilexpress si se probará despacho real.
- [ ] Verificar imágenes de Supabase Storage en preview.
- [ ] Verificar usuario admin en el entorno conectado a Vercel.
- [ ] Correr QA manual completo de storefront y admin.
- [ ] Correr `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `npm run build` y, si es posible, smoke/e2e.
- [ ] Configurar Resend con correo temporal/no oficial: email interno nueva compra + email cliente gracias por tu compra, HTML simple alineado a marca.
- [ ] Ingresar credenciales reales Chilexpress y probar cotización.
- [ ] Evaluar fix mínimo para que `/api/shipping/cotizar` use `shipping_config` y `shipping_packages`.
- [ ] Revisar que el checkout no comunique envío como gratis si Chilexpress no cotiza; mantener mensaje claro "Por confirmar".
- [ ] Revisar/ajustar `/nosotros` al inicio si es rápido.
- [ ] Agregar pequeña mejora pendiente del buscador, a definir mañana.

---

## 🧷 ÚLTIMO COMMIT RELEVANTE (referencia histórica)

- `6f39d2b` — `Integra cambios visuales del storefront`  
  Commits posteriores (incl. admin shell, hero plan): **ver `git log` en el clon** — no listar SHAs en el handoff sin verificar.

---

## ⚠️ WARNINGS CONOCIDOS NO BLOQUEANTES

Se han observado en integraciones recientes; **verificar** al correr `npm run build` en el clon (pueden variar con versiones):

- Uso de `<img>` en algunas vistas/componentes. Recomendación: migrar progresivamente a `next/image` donde aplique.
- Warning de cleanup/ref en `src/shared/hooks/useScrollReveal.ts` por referencias que pueden cambiar antes del cleanup del efecto.
- Warning asociado a `jose` en Edge Runtime durante el build (cuando aplica).

No asumir que sigan idénticos ni que bloqueen el build — **comprobar** en el entorno.

---

## ✅ CHECKLIST DE PRÓXIMOS PASOS (orden de trabajo sugerido)

1. [ ] **Preview Vercel para clienta** — variables, Storage, usuario admin, smoke manual y link compartible.
2. [ ] **Validación técnica previa** — `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `npm run build`; smoke/e2e si el tiempo alcanza.
3. [ ] **Credenciales Chilexpress** — configurar llaves/códigos reales y probar cotización + generación OT/etiqueta.
4. [ ] **Alinear cotización pública** — `/api/shipping/cotizar` debe usar `shipping_config` y `shipping_packages` para peso/empaque coherente con admin.
5. [ ] **Resend / emails** — correo interno de nueva compra + correo cliente gracias por tu compra, HTML simple de marca.
6. [ ] **Conócenos / visual moss** — ajuste rápido si aplica; revisar fondos grandes moss hacia beige/crema/dorado suave.
7. [ ] **VESSI** — según definición; `src/integrations/inventory/`.
8. [ ] **Deploy + QA producción** — variables Vercel, Getnet producción, seed en prod, smoke tests, `checkout.spec.ts` si aplica. **Verificar** build con `npx tsc --noEmit`, `npm run lint`, `npm run build`.

*Handoff v01 — Abril 2026 · E-commerce + admin; panel Landing cerrado con editores por sección, previews y Footer editable conectado al storefront; SEO completo; buscador/Navbar y publisher actualizados; Chilexpress Fase 1–3 en código con tablas/columnas validadas manualmente en el entorno actual; pendiente: preview Vercel, credenciales/prueba Chilexpress, Resend, VESSI, QA final e infra (ver `git` y schema para detalle fino)*
