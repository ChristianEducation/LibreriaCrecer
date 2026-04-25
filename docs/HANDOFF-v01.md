# Crecer Librería Cristiana — Handoff v01
**Última actualización:** Abril 2026 — post–Hero/Landing: ViewModels, editor y storefront alineados  
**Estado resumido:** **Hero** conectado end-to-end (admin → BD → `HeroViewModel` → `HeroSlider`); patrón listo para extender al resto del landing. **En curso:** preview en vivo al editar, pulido de layout del editor. **Pendiente:** replicar patrón a otras secciones, SEO, Chilexpress, VESSI, Resend, deploy.  
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

- **Hecho:** E-commerce end-to-end operativo; backend y APIs; Getnet (TEST); storefront responsive; catálogo, checkout, admin CRUD; landing en gran parte CMS; `/nosotros` con CMS; reglas técnicas del repo (R1–R14, bugs históricos, migraciones vía R13). **Hero del landing:** flujo completo **admin → BD → servicios Drizzle → `HeroViewModel` → `HeroSlider` público**; tipografía de hero alineada al diseño (**Castoro** + cuerpo **Inter** / sistema editorial en `globals.css`). **Modelo de datos** ampliado: `hero_slides` (CTA, overlay, tema, alineación, `showContent`, etc.), `banners` con `eyebrow` y `cta_label`, tabla **`landing_section_copy`**. **ViewModels** en `src/features/catalogo/view-models/`: `HeroViewModel`, `BannersViewModel`, `SectionCopyViewModel` (y derivados `LibrosMesViewModel`, `CategoriasViewModel`, `NosotrosViewModel`). **Admin:** `LandingEditorShell`, `HeroAdminEditor`, `HeroPreview` (preview reutilizable como parte del sistema de edición; no es un “mock” desconectado del modelo).
- **En progreso:** **Preview en vivo** mientras se edita (reflejo instantáneo de cambios **antes** de guardar, si se implementa end-to-end). **Optimización de layout** del `HeroAdminEditor` (vista compacta / densidad) si aún no está cerrada al leer esto. Micro-pulido del **resto** de pantallas admin al mismo lenguaje visual que las vistas piloto.
- **Pendiente (producto / infra):** **Replicar** el patrón ViewModel + editor + API al **resto de secciones** del landing que aún sigan en CRUD “clásico”. **SEO** (metadata, OG, sitemap). **Chilexpress** (cuando haya credenciales). **VESSI** (según definición del negocio). **Resend / emails** transaccionales. **Credenciales Getnet** producción, variables y seed en Vercel, **deploy y QA** (ver checklist final).

## Cambios recientes importantes

- **Admin:** el **layout del panel** se apoya en **sidebar** (eje visual y navegación: secciones, oscuro, colapsable, cierre de sesión). Existe **Topbar** como componente, pero **no es estructural** ni obligatorio en todas las vistas: **no** asumir que el panel “depende” del topbar.
- **Dashboard** y listado de **Productos** siguen siendo la referencia de layout; **AdminMetricCard** y **AdminTable** como base reutilizable.
- **Hero / landing:** fase de **BD y modelos** alineada con Drizzle; **banners** extendidos; **`landing_section_copy`**; **view models** y **`HeroPreview`**; **`HeroAdminEditor`** y shell de edición; **`HeroSlider` público** alimentado por **`HeroViewModel`** (sin depender de copy/overlay fijos relevantes en código).

## Decisiones vigentes

- **Landing / CMS:** arquitectura **ViewModel-first**: datos de BD → funciones de mapeo → tipos de presentación; el **storefront y la preview** comparten criterio visual (misma familia de componentes/estilos, no un HTML paralelo). La **preview** (`HeroPreview`, y análogos futuros) es **parte del sistema de edición**, no un adorno aislado.
- **HTML / diseños externos** (p. ej. *Hero Principal Crecer*): solo **blueprint** de jerarquía, ritmo y look — **nunca** se pega como código de producción; la implementación vive en componentes, `globals.css` y tokens.
- **Hero** es el **patrón de referencia** a **replicar** en otras secciones del landing (misma separación: schema + servicio + ViewModel + editor + superficie pública).
- **Migraciones SQL:** flujo **R13** — SQL versionado en repo, **aplicación manual** en Supabase SQL Editor; mantener **alineado** el SQL aplicado con `src/integrations/drizzle/schema/` (y archivos bajo `drizzle/` en la raíz si se usan como complemento). **No** asumir que `drizzle-kit push` / migrate funciona con Session Pooler. **No** afirmar desde el handoff qué migraciones están ya aplicadas en un entorno remoto.
- **Código:** mismas reglas inmutables del repo (Drizzle en servicios, no queries desde el cliente, etc. — R1–R14).

## Próxima tarea (orden sugerido)

1. Cerrar o validar: **preview en vivo** en admin y **layout compacto** del `HeroAdminEditor` (según deuda al momento de leer el repo).  
2. **Replicar** el patrón Hero (ViewModel + editor + API + superficie pública) al **resto** de secciones de landing acordadas.  
3. Después, según negocio: **SEO** → **Chilexpress** → **VESSI** → **Resend** → **deploy/QA** (más P0 de variables y credenciales al acercar producción).

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
│   │       ├── pedidos/      # Listado + detalle + cambio de estado ✅
│   │       ├── nosotros/     # CRUD secciones de /nosotros ✅
│   │       └── landing/      # hero/, banners/, seleccion/, footer/, categorias/ ✅
│   └── api/
│       ├── productos/        # GET público ✅
│       ├── categorias/       # GET público ✅
│       ├── landing/          # GET público hero, banners, selección, footer ✅
│       ├── nosotros/         # GET público secciones activas ✅
│       ├── ordenes/          # POST crear orden, GET por número ✅
│       ├── cupones/          # POST validar cupón ✅
│       ├── stock/            # POST validar stock ✅
│       ├── pagos/            # crear-sesion, retorno, notificacion ✅
│       └── admin/            # Rutas protegidas del admin ✅ (incluye /nosotros CRUD)
│
├── features/
│   ├── catalogo/             # Servicios, componentes, `view-models/`, `components/hero/`, tipos del catálogo ✅
│   ├── carrito/              # Zustand store + hooks + tipos ✅
│   ├── checkout/             # Servicios de orden, cupón, stock, pago ✅
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
Las páginas son Server Components que llaman directamente a los servicios de Drizzle (no vía fetch a la API pública). La API pública existe para uso externo. El listado usa `searchParams` de Next.js para filtro por categoría, ordenamiento y paginación — todo URL-based. La búsqueda textual tiene input en el `FilterBar` (desktop) y en el `Navbar` móvil, ambos conectados al parámetro `?search=` en la URL, que el backend resuelve con `ilike` en title y author.

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
- Despacho a domicilio vía Chilexpress — costo se paga al recibir (`shippingCost: 0` en BD)

**IMPORTANTE:** El stock se descuenta únicamente cuando el estado pasa de `pending` a `paid`. El guard AND `status = 'pending'` evita doble procesamiento entre retorno y webhook.

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
- `src/features/admin/services/landing-admin-service.ts`

**Cómo funciona:**
JWT en cookie HTTP-only `admin-session` (24h, firmado con `jose`). Middleware Edge Runtime verifica el token en cada request. El admin puede gestionar: productos (CRUD + imágenes), categorías, pedidos (cambio de estado + notas internas), **landing** (incl. hero con campos avanzados, banners, selección, footer, etc. según rutas), `/nosotros` y resto de contenido.

**Shell y vistas piloto (estado reciente):**
- **Sidebar** agrupada por secciones (Dashboard, Catálogo, Pedidos, Contenido, etc.); estilo **oscuro** “app”; **anchos expandido/colapsado** con transición; **logout** en la zona inferior — **eje principal** de navegación.
- **Topbar:** componente disponible, pero **el panel no depende** de un topbar global para funcionar; no asumir topbar en todas las pantallas.
- **Dashboard** (`/admin`) y listado de **Productos** reconstruidos visualmente y usados como referencia; **AdminMetricCard** y **AdminTable** son la base reutilizable para otras listas.
- **Resto** de pantallas admin (categorías, pedidos, landing, nosotros, etc.): **micro-pulido progresivo** al mismo lenguaje visual — no asumir que todas tengan ya el mismo nivel de pulido que Dashboard/Productos.

---

### Feature 5: Landing editable
**Estado:** ✅ Catálogo de secciones y CMS en conjunto; **Hero** = **hecho** a nivel **end-to-end** (admin → BD → `HeroViewModel` → `HeroSlider`) con tipografía de hero alineada al diseño (**Castoro** + cuerpo **Inter** vía clases en `globals.css`). **En progreso / revisión:** preview en vivo mientras se edita (sin depender de “Guardar”), pulido de layout del editor. **Pendiente:** replicar el patrón ViewModel + preview + admin al **resto** de piezas de landing que aún no lo tengan.  
**Archivos clave (Hero / landing reciente):**
- `src/features/catalogo/view-models/hero-view-model.ts` — `getHeroViewModel()` → `HeroViewModel` / `HeroSlideViewModel`
- `src/features/catalogo/view-models/banners-view-model.ts`, `section-copy-view-model.ts` — `BannersViewModel`, `SectionCopyViewModel` (+ `libros-mes-`, `categorias-`, `nosotros-view-model.ts`)
- `src/features/catalogo/components/HeroSlider.tsx` — recibe `data: HeroViewModel` (storefront)
- `src/features/catalogo/components/hero/HeroPreview.tsx` — **preview reutilizable** (admin; mismo criterio visual que el home)
- `src/features/admin/components/LandingEditorShell.tsx` — contenedor de edición de landing
- `src/features/admin/components/landing/HeroAdminEditor.tsx` — formulario y layout de edición del hero
- `src/app/(store)/page.tsx` — compone el home; hero desde view model
- `src/shared/config/landing.ts` — constantes y tipos (defaults de overlay, tema, alineación, etc.)

**También:** `LibrosMesSection`, `CategoryCarousel`, `RecentProductsCarousel`, `QuoteSection`, `CategoryCard`, `InstagramSection`, `TopBanner` + `TopBannerClient`, `LandingWithSplash`.

**Secciones y su fuente de datos:**
- **Hero** → `hero_slides` (campos enriquecidos: CTA, `showContent`, posición/alineación de texto, variante y opacidad de overlay, `contentTheme`, etc. — ver `schema/landing.ts`). **Admin** `/admin/landing/hero` con **`HeroAdminEditor`** + **`HeroPreview`**. **Storefront:** `getHeroViewModel()` → `HeroSlider`. Referencias HTML externas (*Hero Principal Crecer*, etc.): **solo blueprint** visual/comportamental; la implementación vive en componentes y CSS del repo.
- **Copy por sección (landing)** → tabla **`landing_section_copy`** (`section_key`, eyebrow, título, cuerpo, CTA) — alimenta ViewModels de secciones (p. ej. libros del mes, categorías, textos reutilizables) según evolución del admin
- Selección del mes → `featured_products` / `monthly_selection` + `?filter=seleccion`
- Categorías → `categories` + admin `/admin/landing/categorias` (panorama opcional)
- Recién llegados → productos recientes (automático)
- Hero intermedio → `banners` con `position="hero_intermedio"`; banners con **eyebrow** y **cta_label** donde aplique
- Footer texto → `footer_content` · Footer ilustración → `banners` `footer_illustration`
- Instagram → Elfsight (`NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_ID`)

**Imagen panorámica en categorías (CAT3):**
`CategoryCarousel` acepta `panoramaUrl?: string | null`. Cuando está presente, cada `CategoryCard` usa CSS `background-image` con `background-position` calculado: `(index / (total-1)) * 100% 50%`. Efecto: la imagen panorámica se distribuye horizontalmente entre todas las tarjetas. Sin panorama, las tarjetas usan su `imageUrl` individual o el gradiente de fallback. Configurable desde `/admin/landing/categorias`.

**Padding vertical corregido (CAT2):**
`RecentProductsCarousel`, `LibrosMesSection`, `CategoryCarousel` usan `paddingTop/Bottom: "5rem"` (antes 2.5rem). `QuoteSection` usa `paddingTop/Bottom: "6.25rem"` + overlay con div separado `rgba(30,24,0,0.62)`. Buscador Navbar: `maxWidth: "300px"` inline.

**Footer dinámico (CAT4):**
`Footer.tsx` llama `Promise.all([getFooterBanner(), getFooterContent()])`. `getFooterContent()` fetch a `/api/landing/footer`; si falla, cae al objeto `defaultFooterContent` hardcodeado. Links del footer se guardan como `"label::href|||label::href"` en BD. La imagen del footer usa `object-left` (no `object-left-center mix-blend-multiply`).

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
- Link "Conócenos" agregado en desktop (antes del dropdown Categorías) y en el drawer móvil
- `navLinksAfterCategories` actualizado: `?filter=seleccion` (Selección del mes) y `?filter=nuevo` (Recién llegados)
- La selección editorial del sitio es única: home, header, catálogo y admin apuntan a `monthly_selection`

---

### Feature 10: Integración visual del storefront
**Estado:** ✅ Tienda pública alineada al diseño / 🔄 **Admin:** sidebar como eje, vistas piloto alineadas, **resto** en micro-pulido; **Hero** con patrón ViewModel + preview en curso de extender al resto del landing.  
**Referencia de hito histórico** (no sustituye el log de git): `6f39d2b` — integración de cambios visuales del storefront en tienda pública

**Alcance integrado (tienda pública):**
- Home (hero con datos y tipografía de diseño), selección del mes, categorías, recién llegados, Navbar y Footer; catálogo, detalle, carrito, checkout; `/nosotros` con CMS; responsive.

**Alcance admin (situación actual):**
- **Listo:** shell (**sidebar** colapsable, logout), clases de layout en `globals.css`, **Dashboard** y **Productos** como referencia; **AdminMetricCard** y **AdminTable**; **Topbar** opcional por vista, no dependencia estructural.
- **En progreso / siguiente capa:** preview en vivo en edición, pulido de **Hero** admin; **replicar** el patrón a otras secciones de landing; micro-pulido del resto de pantallas.

**Importante:**
- **No** interpretar esto como cierre de SEO, Chilexpress, VESSI ni Resend; ver backlog y checklist final.

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
- [ ] **Variables de entorno en Vercel** — `DATABASE_URL`, `ADMIN_JWT_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_ID`

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
- [x] **Footer dinámico** — texto editable vía `footer_content` en BD, fallback hardcodeado (CAT4)
- [x] **Filtro Selección del mes** — `?filter=seleccion` en catálogo vía subquery `featured_products` (CAT5)
- [x] **Página /nosotros** — CMS completo: secciones alternadas, admin CRUD, imágenes (CAT5)
- [x] **Navbar Conócenos** — link en desktop y drawer móvil; links actualizados a `?filter=seleccion` y `?filter=nuevo` (CAT5)
- [🔄] **UI/UX del panel admin (parcial)**  
  - [x] Shell: **sidebar** como eje, oscuro, colapsable; logout; canvas admin; **Topbar** existe pero no es estructural global  
  - [x] Vistas piloto: Dashboard + Productos (listado); **AdminMetricCard** + **AdminTable** como base  
  - [ ] **Micro-pulido** del resto de pantallas admin al mismo lenguaje visual  
- [x] **Hero / landing (núcleo)** — `hero_slides` extendido, `HeroViewModel` + `HeroSlider` en storefront, `HeroPreview` + `HeroAdminEditor` + `LandingEditorShell`, `landing_section_copy` y `banners` (eyebrow/cta) en schema; tipografía Castoro/Inter en hero  
- [🔄] **Hero / landing (refinamiento)** — preview en vivo mientras se edita (antes de guardar); optimización de layout del editor (compacto) según cierre al leer el repo  
- [ ] **Replicar patrón** ViewModel + preview + admin al **resto** de secciones de landing aún en CRUD “clásico”  
- [ ] **API Chilexpress** — cotización de despacho en tiempo real y búsqueda de sucursales (pendiente de credenciales del cliente)
- [ ] **VESSI** — implementar según la definición/respuesta ya recibida. Integración base en `src/integrations/inventory/`

### P2 — Lanzamiento / Fase 5
- [ ] SEO: `generateMetadata` en producto y categoría, Open Graph, sitemap.xml
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
| `products` | Catálogo con price/sale_price (integer CLP), stock, is_featured, is_active |
| `product_categories` | Relación muchos-a-muchos productos ↔ categorías |
| `product_images` | Galería de imágenes por producto (display_order) |
| `orders` | Órdenes con status (pending→paid→preparing→shipped→delivered→cancelled) |
| `order_items` | Items con snapshot de título, precio y SKU al momento de compra |
| `order_customers` | Datos del comprador invitado (nombre, email, teléfono) |
| `order_addresses` | Dirección de despacho (solo si delivery_method = "shipping") |
| `coupons` | Cupones de descuento (percentage o fixed), vigencia, usos |
| `hero_slides` | Slides del hero: imagen, copy, CTA, overlay (variante/opacidad), alineación, tema, `showContent`, órden y activo — **ver columnas en schema** |
| `banners` | Banners por `position` + **eyebrow**, **cta_label** donde aplique, metadata JSON en footer, etc. |
| `featured_products` | Selección editorial (`monthly_selection` → home + `?filter=seleccion`) |
| `admin_users` | Usuarios del panel admin con password_hash |
| `footer_content` | Texto editable del footer: descripción, links, dirección, copyright, etc. |
| `about_sections` | Secciones de /nosotros |
| `landing_section_copy` | Textos reutilizables por `section_key` (eyebrow, título, body, CTA) — **Abril 2026 en schema** |

**Migraciones en repo:** `src/integrations/drizzle/migrations/` (incl. `0005`, `0006` y anteriores) y, si aplica, SQL complementario p. ej. bajo `drizzle/` en la raíz. **Aplicación en Supabase:** siempre **manual** según R13; **no** afirmar desde el handoff qué script está aplicado en producción u otro entorno; quien despliega **verifica** y mantiene **paridad** schema ↔ SQL aplicado.

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

# Instagram
NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_ID=1e93ffdc-0e7e-4160-b103-98c5a444c896

# Cron job (Vercel — requerido para proteger el endpoint)
CRON_SECRET=
```

> **Crítico:** Usar Session Pooler (puerto 5432), NO Transaction Pooler (puerto 6543). El Transaction Pooler causó fallos de conexión previos.

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

**Contenido CMS — Hero:** conexión **end-to-end** **admin → BD → `HeroViewModel` → `HeroSlider`**, sin depender de copy/overlay fijos relevantes en código; `landing_section_copy` y `banners` enriquecidos en schema. **En curso o por cerrar:** preview en vivo al editar, layout compacto del editor. **Siguiente capa lógica:** replicar el patrón al **resto** del landing. Resto de secciones (selección del mes, categorías, footer, `/nosotros`, etc.): según Feature 5 y schema.

**Pendiente de producto/infra:** replicar patrón de landing → SEO → Chilexpress → VESSI → Resend → deploy/QA, más P0 (variables, credenciales, seed) al acercarse a producción — ver checklist.

**Calidad y tests:** **verificar** con `npx tsc --noEmit`, `npm run lint` y, cuando toque, `npm run build`; Playwright y `checkout.spec.ts` — **correr** en el entorno para estado al día; ver sección de warnings.

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

1. [ ] **Hero (refinamiento)** — preview en vivo mientras se edita (si aún no está); cerrar **layout compacto** del `HeroAdminEditor` si queda deuda.
2. [ ] **Replicar patrón** — ViewModel + preview + edición (como Hero) a **otras** secciones de landing acordadas.
3. [ ] **Micro-pulido admin** — resto de pantallas al estándar de Dashboard / Productos.
4. [ ] **SEO** — `generateMetadata`, Open Graph, sitemap, etc.
5. [ ] **Chilexpress** — integración (credenciales cliente).
6. [ ] **VESSI** — según definición; `src/integrations/inventory/`.
7. [ ] **Resend / emails** — confirmar estado de `integrations/email/`.
8. [ ] **Deploy + QA** — variables Vercel, Getnet producción, seed en prod, smoke tests, `checkout.spec.ts` si aplica. **Verificar** build con `npx tsc --noEmit`, `npm run lint`, `npm run build`.

*Handoff v01 — Abril 2026 · E-commerce + admin; Hero/landing con ViewModels; pendiente: refinar edición, replicar patrón, SEO, integraciones e infra (ver `git` y schema para detalle fino)*
