# Tarea 4.4 — Detalle de Producto, Carrito y Checkout

## Contexto
Este es el cuarto paso de la Fase 4 del proyecto Crecer Librería Cristiana. Las tareas anteriores dejaron:
- **4.1:** Tokens en `globals.css` (Tailwind v4), componentes atómicos en `shared/ui/`, `useScrollReveal`
- **4.2:** Navbar, CartPanel, Footer, layout tienda `(store)/layout.tsx`, layout panel admin `admin/(panel)/layout.tsx`
- **4.3:** ProductCard, CategoryCard, PageHeader, FilterBar, HeroSlider, páginas home y listado de productos (`/productos`)

Ahora construimos el flujo crítico de compra: detalle del producto → carrito → checkout → confirmación. Al terminar esta tarea, un usuario puede ver un producto, agregarlo al carrito y completar una compra real con Getnet.

## Prerequisitos
- Tareas 4.1, 4.2 y 4.3 completadas
- APIs funcionando: `/api/productos/[slug]`, `/api/ordenes`, `/api/pagos/crear-sesion`, `/api/cupones/validar`
- Store de Zustand completo en `src/features/carrito/store.ts`, hooks en `src/features/carrito/hooks.ts`
- Schema de Zod del checkout en `src/features/checkout/schemas.ts` (`CreateOrderSchema`)

---

## Lo que necesito que hagas

### 1. ProductGallery — `src/features/catalogo/components/ProductGallery.tsx`

Client Component (`'use client'`). Galería de imágenes con thumbnails y lightbox.

**Especificación visual** (del `producto.html`):

```
Galería sticky:
  position: sticky | top: 88px

Imagen principal:
  aspect-ratio: 3/4 | border-radius: 2px | overflow: hidden   ← 2px, consistente con el sistema
  cursor: zoom-in | margin-bottom: 12px
  box-shadow: 0 8px 40px rgba(58,48,1,0.1)
  Al hacer clic: abrir lightbox

  Con imagen real: next/image con object-fit cover

  Placeholder sin imagen (diseño editorial):
    background: linear-gradient(160deg, #3A2A20 0%, #5C3A28 40%, #3A2A20 100%)
    hover: scale(1.02) suave
    Interior con borde sutil rgba(255,255,255,0.12):
      - Autor en mayúsculas: DM Sans, 11px, letter-spacing 0.18em, color rgba(255,255,255,0.55)
      - Línea decorativa: 40% ancho, 1px, rgba(255,255,255,0.15)
      - Título en cursiva: EB Garamond, 26px, color rgba(255,255,255,0.92)
      - Subtítulo: EB Garamond, 13px, italic, rgba(255,255,255,0.45)
      - Línea decorativa
      - Editorial: DM Sans, 9px, letter-spacing 0.2em, uppercase, rgba(255,255,255,0.3)

  Botón zoom (esquina inferior derecha):
    32x32px | border-radius: 2px
    background: rgba(58,48,1,0.6) | border: 1px solid rgba(255,255,255,0.15)
    backdrop-filter: blur(8px)
    SVG expand: 14px, color white

Thumbnails:
  display: flex | gap: 8px
  Thumb: 64px wide, aspect-ratio 2/3, border-radius: 2px
    border: 2px solid transparent | opacity: 0.55
    hover: opacity 0.85
    active: border-color var(--gold), opacity 1
    Fallback: gradient beige-warm → beige-mid

Lightbox:
  position: fixed | inset: 0 | z-index: 9000
  background: rgba(46,38,1,0.92) | backdrop-filter: blur(8px)
  opacity: 0 → 1 al abrir | visibility hidden → visible
  transition: opacity 0.3s, visibility 0.3s

  Al hacer clic fuera: cerrar
  Escape key: cerrar

  Imagen/placeholder ampliado centrado
  Botón cerrar ×: posición absoluta top-right
```

**Props:**
```typescript
interface ProductGalleryProps {
  images: { id: string; url: string; altText?: string | null }[]
  productTitle: string
  productAuthor?: string | null
  mainImageUrl?: string | null
}
```

---

### 2. AddToCartButton — `src/features/catalogo/components/AddToCartButton.tsx`

Client Component (`'use client'`). Botón principal de agregar al carrito con selector de cantidad.

**Especificación visual** (del `producto.html`):

```
Row principal: display flex, gap 12px, align-items center, margin-bottom 16px

Control de cantidad:
  display: flex | border: 1px solid var(--border) | border-radius: 2px | overflow: hidden

  Botón − y +:
    width: 36px | height: 48px
    background: var(--beige-warm) | border: none
    font-size: 16px | color: var(--text-mid)
    hover: background var(--beige-mid), color var(--moss)

  Input número:
    width: 44px | height: 48px | border: none
    border-left/right: 1px solid var(--border)
    text-align: center | font-size: 14px | font-weight: 500
    color: var(--text) | background: white | outline: none
    Sin flechas nativas (appearance: none)
    min: 1 | max: stockQuantity

Botón "Añadir al carrito":
  flex: 1 | height: 48px | border-radius: 2px
  background: var(--moss) | color: white
  font-size: 12px | font-weight: 500 | letter-spacing: 0.1em | uppercase
  display: flex | align-items: center | justify-content: center | gap: 10px
  SVG carrito: 16px
  hover: var(--moss-mid), translateY(-1px)

  Estado "Agregado":
    Cambia texto a "✓ Agregado"
    Mantiene fondo moss pero más oscuro
    Dura 2000ms luego vuelve al estado original

Botones icono (favorito, compartir):
  width: 48px | height: 48px | border-radius: 2px
  border: 1px solid var(--border) | background: transparent
  SVG: 17px | color: var(--text-light)
  hover: border-color var(--moss), color var(--moss)

Items de confianza (bajo el botón):
  display: flex | gap: 20px | flex-wrap: wrap
  padding-top: 20px | border-top: 1px solid var(--border)

  Item: display flex, gap 7px, 11px, color var(--text-light)
  SVG: 15px, color var(--gold)

  Los 3 items:
  - "Envío a todo Chile" (SVG camión)
  - "Compra segura" (SVG escudo)
  - "Retiro en tienda · Antofagasta" (SVG ubicación)
```

**Conexión con Zustand — manejo de cantidad:**

El store actual (`src/features/carrito/store.ts`) expone `addItem(item)` que siempre suma 1 unidad (o incrementa en 1 si ya existe). Para agregar con la cantidad seleccionada en el selector, usar la siguiente estrategia:

```typescript
const handleAddToCart = () => {
  // 1. Agregar el item (suma 1 o crea con quantity: 1)
  addItem({
    productId: product.id,
    title: product.title,
    slug: product.slug,
    author: product.author,
    price: product.salePrice ?? product.price,
    originalPrice: product.salePrice ? product.price : null,
    imageUrl: product.mainImageUrl,
    sku: product.sku,
  })

  // 2. Si el usuario eligió más de 1, ajustar la cantidad
  if (qty > 1) {
    updateQuantity(product.id, qty)
  }
}
```

Importar `useCart` de `src/features/carrito/hooks.ts` para acceder a `addItem` y `updateQuantity`.

**Props:**
```typescript
interface AddToCartButtonProps {
  product: {
    id: string
    slug: string
    title: string
    author: string | null
    price: number
    salePrice?: number | null
    mainImageUrl?: string | null
    sku?: string | null
    stockQuantity: number
    inStock: boolean
  }
}
```

---

### 3. Página Detalle de Producto — `src/app/(store)/productos/[slug]/page.tsx`

Server Component. Carga el producto por slug y renderiza la página completa.

```typescript
export default async function ProductoPage({ params }) {
  const [productRes, relatedRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/productos/${params.slug}`),
    // Los relacionados se cargan después de conocer la categoría —
    // si no se puede paralelizar, hacer fetch secuencial
  ])

  const { data: product } = await productRes.json()
  if (!product) notFound()

  const firstCategorySlug = product.categories?.[0]?.slug
  const related = firstCategorySlug
    ? await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/productos?category=${firstCategorySlug}&limit=5`)
        .then(r => r.json())
    : { data: [] }

  return (
    <>
      {/* Breadcrumb */}
      {/* Sección principal: grid 2 columnas */}
      <ProductGallery ... />
      <ProductInfo ... />    {/* columna derecha, incluye AddToCartButton */}

      {/* Sección de relacionados */}
      <RelatedProducts products={related.data} />
    </>
  )
}
```

**Especificación visual del layout** (del `producto.html`):

```
Sección principal:
  background: var(--white) | padding: 28px 56px 72px

  Breadcrumb:
    font-size: 11px | color: var(--text-light) | margin-bottom: 32px
    "Inicio / Colección / {categoría} / {título del producto}"
    Links: color var(--text-light), hover color var(--moss)
    Separador: "/" con opacity 0.3

  Grid layout:
    display: grid | grid-template-columns: 1fr 1fr | gap: 72px
    max-width: 1100px | margin: 0 auto | align-items: start

ProductInfo (columna derecha):
  Eyebrow de categoría:
    font-size: 9px | letter-spacing: 0.3em | uppercase | color: var(--gold)
    ::before línea 20px dorada

  Título:
    EB Garamond | clamp(28px,3vw,40px) | weight 400 | color: var(--moss)
    line-height: 1.1 | letter-spacing: -0.01em | margin-bottom: 4px

  Autor:
    DM Sans, 14px, color var(--text-light), weight 300
    Link al autor: color var(--text-mid), hover color var(--gold)

  Referencia: 11px, color var(--text-light), letter-spacing 0.06em

  Badge de stock (cuando quedan pocas unidades ≤5):
    inline-flex | padding: 4px 12px | border-radius: 2px
    background: rgba(200,168,48,0.15) | color: var(--gold)
    border: 1px solid var(--border-gold)
    Punto 6px gold + texto "Últimas unidades en stock"

  Precio:
    EB Garamond | 38px | weight 500 | color: var(--moss) | line-height: 1
    Nota: "Impuestos incluidos · Envío calculado al checkout" — 12px, var(--text-light)
    Con descuento: precio original tachado (arriba, smaller) + precio oferta principal

  Divisor: 1px, var(--border), margin 24px 0

  Descripción:
    14px | line-height: 1.85 | color: var(--text-mid) | weight 300
    Párrafos con margin-top: 14px entre ellos

  Especificaciones (lista con puntos dorados):
    display: flex | flex-direction: column | gap: 8px
    Item: flex, gap 10px, 13px, color var(--text-mid)
    Punto: 4px, border-radius 50%, background var(--gold)
    Mostrar: tipo de tapa, páginas, editorial si existen

  Divisor

  AddToCartButton (componente creado arriba)
```

**Sección de relacionados:**
```
background: var(--beige) | padding: 72px 56px 80px

Header: eyebrow "También podría interesarte" + título "Títulos relacionados"
        + link "Ver más →" a /productos?cat={slug}

Grid de 5 ProductCard: repeat(5,1fr), gap 24px 18px
```

---

### 4. Página Carrito — `src/app/(store)/carrito/page.tsx`

Client Component (`'use client'`). Página completa del carrito, distinta al CartPanel dropdown.

**Layout:**
```
background: var(--beige) | min-height: 60vh
max-width: 1100px | margin: 0 auto | padding: 48px 56px 80px
display: grid | grid-template-columns: 1fr 380px | gap: 48px | align-items: start
```

**Lista de items (columna izquierda):**
```
Título: EB Garamond, 28px, weight 400, color var(--moss), margin-bottom 32px

Por cada item:
  display: flex | align-items: center | gap: 20px | padding: 20px 0
  border-bottom: 1px solid var(--border)

  Imagen: width 72px, aspect-ratio 2/3, border-radius 2px
    Si hay imagen: next/image | Si no: placeholder degradado

  Info (flex: 1):
    Título: EB Garamond, 16px, weight 500, color var(--text)
    Autor: 12px, color var(--text-light)
    Código/SKU (si existe): 10px, color var(--text-light), letter-spacing 0.06em

  Controles cantidad (mismos estilos que CartPanel, botones algo más grandes):
    Botones 24x24px | border: 1px solid var(--border) | border-radius: 1px
    hover: background var(--moss), color white

  Precio total del item: EB Garamond, 18px, weight 500, color var(--moss)

  Botón eliminar:
    color: var(--text-light) | hover: color var(--error)
    SVG papelera: 16px

Carrito vacío:
  Centrado, padding 80px
  Cruz decorativa: opacity 0.15
  "Tu carrito está vacío" — EB Garamond, 28px, color var(--moss)
  Link "Explorar colección →" — Button variante ghost → /productos
```

**Resumen (columna derecha, sticky):**
```
background: var(--white) | border: 1px solid var(--border) | border-radius: 2px
position: sticky | top: 80px
padding: 20px 24px

Header: "Resumen del pedido" — EB Garamond, 18px, color var(--moss)
margin-bottom: 20px

Líneas de totales:
  Subtotal: label 12px var(--text-light) | valor 14px var(--text-mid)
  Descuento (si hay cupón): label en gold + "−$X.XXX" en gold
  Envío: "Calculado al checkout" — 12px, var(--text-light)
  Divisor: 1px, var(--border), margin 14px 0
  Total: label EB Garamond 16px color var(--moss)
         valor EB Garamond 28px weight 500 color var(--moss)

Campo de cupón:
  display: flex | gap: 8px
  Input: Input de shared/ui, placeholder "Código de cupón"
  Botón "Aplicar": Button variante outline, pequeño
  Llama a POST /api/cupones/validar con { code, subtotal }
  Si válido: applyCoupon(code, discount) en el store de Zustand
             mostrar "Cupón aplicado: −$X.XXX" en gold
  Si inválido: mensaje de error bajo el input

Botón "Ir al checkout":
  Button variante moss, width 100%, padding 14px
  Link a /checkout
  Deshabilitado si carrito vacío

Nota seguridad: "🔒 Compra segura · SSL"
  10px, color var(--text-light), centrado, margin-top 12px
```

---

### 5. CheckoutForm — `src/features/checkout/components/CheckoutForm.tsx`

Client Component (`'use client'`). Formulario completo del checkout con React Hook Form + Zod.

**Schema de validación:**

Usar el schema `CreateOrderSchema` que ya existe en `src/features/checkout/schemas.ts`. Este schema tiene:
- `items`: array de `{ productId, quantity }`
- `customer`: `{ firstName, lastName, email, phone }`
- `deliveryMethod`: `"pickup" | "shipping"`
- `address`: objeto de dirección (requerido solo si `deliveryMethod === "shipping"`)
- `couponCode`: string opcional

**El schema NO incluye `paymentMethod`** — el método de pago es lógica exclusiva del frontend para decidir el flujo post-confirmación y no se envía al backend.

**Barra de progreso visual:**
```
background: var(--white) | border-bottom: 1px solid var(--border)
padding: 0 56px | height: 52px | centrado

Steps: 1. Datos  2. Entrega  3. Pago
  Número circular: 20px, border-radius 50%, border 1px solid currentColor
  done: background var(--gold), border-color var(--gold), color white
  active: background var(--moss), border-color var(--moss), color white
  Separador: 40px wide, 1px, var(--border)
  Label: 11px, letter-spacing 0.08em, uppercase
```

**Layout principal:**
```
max-width: 1100px | margin: 0 auto
padding: 48px 56px 80px
display: grid | grid-template-columns: 1fr 380px | gap: 48px
```

**Sección 1 — Información de contacto:**
```
Título sección: EB Garamond, 20px, weight 400, color var(--moss)
  Número circular 24px (fondo moss, texto white, 11px)
  border-bottom: 1px solid var(--border) | padding-bottom: 12px

Campos (usando Input de shared/ui):
  Nombre + Apellido: grid 2 columnas, gap 14px
  Email (validación email)
  Teléfono
```

**Sección 2 — Método de entrega:**
```
Opciones (radio buttons estilizados — NO usar <input type="radio"> nativo):
  Contenedor: flex, gap 10px, flex-direction column

  Opción:
    padding: 14px 16px | border: 1px solid var(--border) | border-radius: 2px
    cursor: pointer | background: var(--white)
    hover: border-color var(--gold)
    selected: border-color var(--gold), background rgba(200,168,48,0.05)

    Radio circular: 16px, border 1.5px
    selected: border-color var(--gold), punto interno 10px gold

    Info: nombre (13px, weight 500) + descripción (11px, var(--text-light))
    Precio: 14px, weight 500, color var(--gold)

  Opciones hardcodeadas:
    - "Retiro en tienda" — Arturo Prat 470 · Lun–Sáb 9:00–19:00 — Gratis — value: "pickup"
    - "Starken" — 3–5 días hábiles · Todo Chile — $3.990 — value: "shipping"
    - "Chilexpress" — 2–3 días hábiles · Todo Chile — $4.990 — value: "shipping"

  Si deliveryMethod = "shipping" → mostrar campos de dirección:
    Calle/número, Depto/oficina (opcional), Comuna, Ciudad
    Región (select con las 16 regiones de Chile), Código postal (opcional)
    Instrucciones de despacho (textarea, opcional)
```

**Sección 3 — Método de pago (solo UX, no va al backend):**
```
Botones de método (tabs visuales — estado local del componente, no parte del schema):
  padding: 8px 16px | border: 1px solid var(--border) | border-radius: 2px
  font-size: 12px | color: var(--text-mid)
  hover: border-color var(--moss)
  selected: border-color var(--moss), background var(--moss), color white

  Opciones: Tarjeta (default) | Transferencia | Efectivo

  Con "Tarjeta":
    Mostrar campos visuales: número (formato 4444 4444 4444 4444), vencimiento (MM/AA), CVV, nombre
    IMPORTANTE: Estos campos son solo decorativos — al confirmar, el backend crea la sesión
    de Getnet y el usuario paga en el entorno seguro de Getnet. No capturar datos reales.

  Con "Transferencia":
    Bloque informativo con datos bancarios (hardcodeado):
      "Crecer Librería SpA · RUT: 76.123.456-7 · Banco Estado
       Cta. corriente: 123-456789-0
       Envía el comprobante a pagos@crecerlibreria.cl"
    background: var(--beige), border: 1px solid var(--border), border-radius: 2px, padding 16px

  Con "Efectivo":
    Nota: "Pago disponible solo para retiro en tienda. Arturo Prat 470, Antofagasta"

Notas del pedido (opcional):
  Textarea (Textarea de shared/ui), min-height 80px, resize vertical
  placeholder: "Instrucciones especiales, dedicatorias, etc."
```

**Resumen sticky (columna derecha):**
```
Igual al de la página del carrito pero sin campo de cupón (ya se aplicó antes).
Incluye:
  - Lista de items con quantity badge superpuesto en la imagen
  - Subtotal, descuento (si hay cupón aplicado), costo envío, total
  - Botón "Confirmar pedido" con SVG escudo — Button variante moss, width 100%
  - "Compra 100% segura · SSL" centrado bajo el botón
```

**Errores de validación inline:**
```
font-size: 11px | color: var(--error) #C0392B
Mostrar bajo el campo correspondiente
```

---

### 6. Página Checkout — `src/app/(store)/checkout/page.tsx`

Client Component (`'use client'`). Orquesta el flujo completo.

```typescript
'use client'

export default function CheckoutPage() {
  const { items, clearCart } = useCart()   // useCart de src/features/carrito/hooks.ts
  const { couponCode, couponDiscount } = useCartSummary()
  const router = useRouter()

  // Si carrito vacío, redirigir al carrito
  useEffect(() => {
    if (items.length === 0) router.replace('/carrito')
  }, [items, router])

  const handleSubmit = async (formData, selectedPaymentMethod: 'tarjeta' | 'transferencia' | 'efectivo') => {
    // Construir el body según CreateOrderSchema (SIN paymentMethod)
    const orderBody = {
      items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
      customer: formData.customer,
      deliveryMethod: formData.deliveryMethod,
      address: formData.deliveryMethod === 'shipping' ? formData.address : undefined,
      couponCode: couponCode ?? undefined,
    }

    // 1. Crear la orden
    const orderRes = await fetch('/api/ordenes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderBody),
    })

    if (!orderRes.ok) {
      // Manejar errores de stock o cupón
      const err = await orderRes.json()
      // Mostrar error al usuario
      return
    }

    const { data: order } = await orderRes.json()

    // 2. Flujo según método de pago elegido por el usuario
    if (selectedPaymentMethod === 'tarjeta') {
      // Crear sesión de pago en Getnet y redirigir
      const payRes = await fetch('/api/pagos/crear-sesion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.orderId }),
      })
      const { data: { processUrl } } = await payRes.json()
      clearCart()
      window.location.href = processUrl   // redirigir al entorno seguro de Getnet
    } else {
      // Transferencia o efectivo: ir directo a confirmación
      clearCart()
      router.push(`/checkout/confirmacion?order=${order.orderNumber}&status=pending`)
    }
  }

  return (
    <>
      <Navbar variant="checkout" />
      <CheckoutForm onSubmit={handleSubmit} />
    </>
  )
}
```

---

### 7. Página Confirmación — `src/app/(store)/checkout/confirmacion/page.tsx`

Client Component. Página post-pago que se muestra tanto después de Getnet (tarjeta) como de confirmación manual (transferencia/efectivo).

**Especificación visual** (del `checkout.html` — sección success):

```
display: flex | flex-direction: column | align-items: center
justify-content: center | text-align: center
padding: 80px 40px | max-width: 560px | margin: 0 auto | min-height: 60vh

Cruz decorativa (✝):
  width: 60px | height: 60px | margin-bottom: 28px
  ::before/::after → background: var(--gold), border-radius: 1px, 2px wide

Título: EB Garamond, 36px, weight 400, color var(--moss)

Subtítulo: DM Sans, 14px, color var(--text-light), line-height 1.7
  max-width: 380px | weight 300

Número de orden: DM Sans, 11px, letter-spacing 0.2em, uppercase, color var(--gold)
  "Pedido #{orderNumber}"

Botón "Seguir explorando →":
  Button variante moss | padding 12px 28px
  Link a /productos   ← no /catalogo
```

**Lee los query params:**
- `?order=ORD-0001` → número de orden a mostrar
- `?status=paid|pending` → determina el mensaje

```
status=paid    → "¡Tu compra fue procesada con éxito!"
                 Subtítulo: "Recibirás un correo con los detalles a la brevedad."
status=pending → "Pedido recibido"
                 Subtítulo: "En cuanto confirmemos tu pago, prepararemos tu pedido."
```

**Después del mensaje:** mostrar sección de recomendaciones con 5 `ProductCard` obtenidos de `/api/productos/novedades?limit=5`. Fondo `var(--beige)`, mismo estilo que la sección de relacionados.

---

### 8. Página 404 — `src/app/not-found.tsx`

```
background: var(--beige)
display: flex | flex-direction: column | align-items: center
justify-content: center | min-height: 100vh | text-align: center

Cruz decorativa grande: 80px, opacity 0.08, color var(--moss)

"404" — EB Garamond, 120px, weight 400, color var(--beige-mid), line-height 1

"Página no encontrada" — EB Garamond, 28px, weight 400, color var(--moss)

"El contenido que buscas no existe o fue movido."
  DM Sans, 14px, color var(--text-light), weight 300, margin-top 12px

Botón "Volver al inicio" → /
  Button variante moss | margin-top: 32px

Link "Ver colección →" → /productos   ← no /catalogo
  Button variante ghost | margin-top: 8px
```

---

## Reglas importantes

- **`CreateOrderSchema` no incluye `paymentMethod`** — el schema del backend en `src/features/checkout/schemas.ts` no tiene ese campo y el body del `POST /api/ordenes` no debe incluirlo. El método de pago es estado local del formulario de frontend y solo determina el flujo post-confirmación (tarjeta → Getnet; transferencia/efectivo → confirmación directa).
- **`addItem` del store de Zustand no acepta cantidad** — siempre agrega 1. Para cantidad > 1, llamar `addItem(item)` seguido de `updateQuantity(productId, qty)`. Ver sección 2 para el patrón exacto.
- **El pago con tarjeta redirige a Getnet** — los campos de tarjeta en el formulario son solo decorativos. Al confirmar, el backend crea la sesión de Getnet y se redirige al usuario a `processUrl`.
- **Todos los links al listado de productos apuntan a `/productos`**, nunca a `/catalogo`. Esto incluye el botón "Ver colección" del 404 y el "Seguir explorando" de la confirmación.
- **`border-radius: 2px` en la galería** — la imagen principal y los thumbnails usan `2px`, consistente con el sistema. No usar el `4px` del HTML original del diseñador.
- **`clearCart()`** se llama solo después de una respuesta exitosa del backend, nunca antes.
- **`formatCLP`** ya existe en `src/shared/utils/formatters.ts` — importar desde ahí.
- **`ProductCard`** ya existe de la Tarea 4.3 — usar para los relacionados y las recomendaciones post-checkout.
- **El campo de cupón** en la página del carrito llama a `POST /api/cupones/validar` con `{ code, subtotal }` y guarda el resultado con `applyCoupon(code, discount)` del store de Zustand.
- **NO modificar** ningún archivo de las Fases 1–3 ni los componentes de las Tareas 4.1–4.3.
- Verificar que `tsc --noEmit` pase sin errores al finalizar.
