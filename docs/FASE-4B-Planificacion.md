# Fase 4B — Landing impecable

## Contexto general

Las Fases 1–4 están completas y validadas (`npx tsc --noEmit` y `npm run lint` pasan limpio). El backend, APIs, admin y frontend público están implementados. Esta Fase 4B es una segunda iteración sobre el landing page con un objetivo concreto: **dejarlo lo más fiel posible al diseño entregado por el diseñador en `docs/index.html`**, corrigiendo proporciones, secciones faltantes y comportamientos que quedaron incompletos en la Fase 4 original.

El archivo de referencia del diseñador está en `docs/index.html`. Antes de cada tarea, leer ese archivo para entender la intención visual.

## Regla absoluta de colores

**Los colores del proyecto NO se tocan bajo ninguna circunstancia.** El diseñador usó `--gold: #D9BA1E` pero el proyecto tiene aprobado `--color-gold: #c8a830`. Esta decisión está tomada y es definitiva. Lo mismo para todos los demás tokens de color en `src/app/globals.css`. Nunca modificar colores.

## Stack relevante para esta fase

- Next.js 15 App Router + TypeScript strict
- Tailwind CSS v4 — tokens en `src/app/globals.css` vía `@theme inline`. **No existe `tailwind.config.ts`**
- Zustand 5 para el carrito
- Drizzle ORM para todas las queries — nunca usar el cliente de Supabase para BD
- Supabase Storage para imágenes

## Estructura del landing (orden de arriba a abajo)

```
Banner superior          ← banda encima del Navbar (anuncios, ofertas), editable desde admin
Navbar (Header)
Hero                     ← slides rotatorios desde hero_slides
Selección del mes        ← productos curados desde featured_products
Categorías               ← categorías con featured=true, una fila con navegación
Recién llegados          ← últimos 10 productos, carrusel automático
Hero intermedio          ← frase + imagen editable desde banners (position="hero_intermedio")
Instagram                ← embed oficial @crecerlibreria
Footer                   ← con ilustración Atacama, parámetros desde banners.metadata
```

## Datos y BD

La BD está vacía en este momento (solo hay 1 producto de prueba). Cada sección debe manejar dos estados:

1. **Con contenido** → se muestra lo más fiel al diseñador posible
2. **Sin contenido** → placeholder elegante, visible solo cuando no hay nada que mostrar. Debe verse bien para la presentación al cliente, no como un error.

Al finalizar todas las tareas se hará un seed con 10 libros de prueba para validar todo.

## Tablas relevantes de la BD

```
hero_slides         → Hero principal
banners             → Banner superior (position="top_banner"), Hero intermedio (position="hero_intermedio"), Footer (position="footer_illustration")
featured_products   → Selección del mes
categories          → Categorías (featured=true aparecen en landing)
products            → Recién llegados (últimos 10 por created_at)
```

La tabla `banners` tiene campo `metadata` (jsonb) con tipo `FooterBannerMetadata` para los parámetros visuales del footer. El hero intermedio usa `title`, `description` e `image_url` del mismo registro.

## Archivos principales del landing

```
src/app/(store)/page.tsx                              ← Home page
src/app/(store)/layout.tsx                            ← Layout con Navbar y Footer
src/features/catalogo/components/HeroSlider.tsx       ← Hero
src/features/catalogo/components/LibrosMesSection.tsx ← Selección del mes
src/features/catalogo/components/CategoryCard.tsx     ← Tarjeta de categoría
src/features/catalogo/components/ProductCard.tsx      ← Tarjeta de producto
src/features/catalogo/components/QuoteSection.tsx     ← Hero intermedio (actualmente hardcodeado)
src/features/catalogo/components/InstagramSection.tsx ← Instagram (actualmente placeholders)
src/features/catalogo/services/landing-service.ts     ← Servicios de datos del landing
src/shared/ui/Navbar.tsx                              ← Navbar
src/shared/ui/Footer.tsx                              ← Footer
src/app/globals.css                                   ← Tokens de diseño y estilos custom
```

## Tareas de la Fase 4B

### 4B.1 — LibrosMesSection fiel al diseñador
Corregir proporciones, alturas y espaciado de la sección "Selección del mes" para que se vea como el diseño del diseñador. Eliminar el wrapper doble (panel beige redondeado sobre fondo blanco) que hace que la sección se vea como una caja dentro de otra caja. Las portadas deben verse grandes y con aire, fiel a `docs/index.html`. Incluir placeholder elegante cuando no hay productos curados.

### 4B.2 — Carrusel "Recién llegados"
Implementar la sección "Recién llegados" con lógica de carrusel automático:
- Carga los últimos 10 productos por `created_at` descendente
- Si hay **≤ 5 productos**: se muestran estáticos, sin movimiento, sin carrusel
- Si hay **6-10 productos**: carrusel automático que muestra siempre 5 a la vez, rota de a 1 cada 4 segundos en bucle continuo
- Placeholder elegante cuando no hay productos

### 4B.3 — Categorías en carrusel de una fila
Rediseñar la sección de categorías del landing para que muestre los elementos en una sola fila horizontal con navegación (prev/next), mostrando 6 categorías visibles a la vez. Mismo patrón visual que la referencia de una tienda mostrada por el cliente. Placeholder cuando no hay categorías con `featured=true`.

### 4B.4 — Banner superior + Hero intermedio desde BD
Dos implementaciones:
1. **Banner superior**: banda fina encima del Navbar (anuncios, ofertas, eventos). Texto centrado con botón X para cerrarlo (el cierre es solo visual, no persiste en BD). Se muestra solo si hay un banner activo con `position="top_banner"` en la tabla `banners`. Editable desde el admin existente.
2. **Hero intermedio**: conectar el `QuoteSection` actual (que tiene texto hardcodeado) a la tabla `banners` con `position="hero_intermedio"`, para que la frase y la imagen sean editables desde el admin.

### 4B.5 — Instagram embed + Placeholders bonitos
Reemplazar los 4 cuadrados de colores placeholder por el embed oficial de Instagram para `@crecerlibreria`. Si el embed no carga o la cuenta no está disponible, mostrar un fallback elegante. Revisar y pulir todos los placeholders de secciones vacías del landing para que se vean bien en la presentación al cliente.

## Convenciones a mantener

- Todos los componentes nuevos como Client Components si usan estado o efectos (`"use client"`)
- No hacer queries directas desde componentes — todo pasa por los servicios en `src/features/catalogo/services/`
- No instalar dependencias nuevas sin revisar si ya existe algo que lo resuelva
- Soft delete siempre en el admin — nunca eliminar físicamente
- Precios siempre como enteros CLP
- Después de cada tarea: `npx tsc --noEmit` y `npm run lint` deben pasar sin errores
