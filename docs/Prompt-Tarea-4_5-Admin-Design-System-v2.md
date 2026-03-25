# Tarea 4.5 — Admin con Design System

## Contexto
Este es el quinto y último paso de la Fase 4 del proyecto Crecer Librería Cristiana. Las tareas anteriores dejaron:
- **4.1–4.4:** Design system completo, layouts, home, listado de productos, detalle, carrito y checkout
- **Fases 1–3:** Todo el backend funcional con UI básica de andamiaje (botones azules/rojos genéricos, sin design system)

**El objetivo de esta tarea es exclusivamente visual** — reemplazar la UI básica del admin con los componentes y tokens del design system. La lógica de negocio, las APIs, los servicios y los schemas de Zod ya existen y NO se tocan.

## Estructura del admin en el proyecto

El panel admin usa un route group `(panel)`. Las páginas viven en `src/app/admin/(panel)/`. Las URLs públicas siguen siendo `/admin`, `/admin/productos`, etc. — el route group no afecta las rutas.

La página de **login** está **fuera** del route group: `src/app/admin/login/page.tsx`. No hereda el layout del panel.

## Lo que se reemplaza
La UI actual del admin usa clases Tailwind genéricas (azul, rojo, gris) aplicadas directamente en las páginas. Esta tarea las reemplaza por los tokens del proyecto (moss, gold, beige) y los componentes de `shared/ui/`.

---

## Lo que necesito que hagas

### 1. Página de Login — `src/app/admin/login/page.tsx`

Reemplazar completamente la UI con el diseño del `admin-login.html`. Esta página está **fuera** del route group `(panel)` y no tiene sidebar.

**Especificación visual:**

```
Página standalone (sin sidebar, sin topbar):
  background: var(--moss)
  display: flex | align-items: center | justify-content: center | min-height: 100vh
  position: relative | overflow: hidden

Fondo decorativo:
  3 gradientes radiales superpuestos en gold sutil (opacity muy baja)
  2 cruces decorativas en esquinas (top-left 48x48px, bottom-right 32x32px):
    opacity: 0.06 | líneas en var(--gold)

Card de login:
  width: 100% | max-width: 400px
  background: var(--white) | border-radius: 2px
  box-shadow: 0 32px 80px rgba(0,0,0,0.35)
  animación: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) al montar

  Header del card (fondo moss):
    padding: 32px 40px 28px | text-align: center | position: relative
    Línea decorativa inferior: gradient gold transparente (::after)
    Cruz: 36x36px centrada, líneas en var(--gold)
    Nombre "Crecer Librería": EB Garamond, 20px, weight 400, color white
    Sub "Panel de Administración": DM Sans, 9px, letter-spacing 0.28em, uppercase, color var(--gold)

  Cuerpo del card:
    padding: 36px 40px 40px

    Título "Ingresar": EB Garamond, 22px, weight 400, color var(--moss)
    Hint "Acceso restringido al equipo interno": 12px, color var(--text-light), weight 300
    margin-bottom: 28px

    Banner de error (oculto por defecto, visible cuando hay error 401):
      background: rgba(192,57,43,0.08)
      border: 1px solid rgba(192,57,43,0.2)
      border-radius: 2px | padding: 10px 14px | margin-bottom: 16px
      font-size: 12px | color: var(--error) #C0392B
      SVG alerta (16px) + "Correo o contraseña incorrectos"

    Campo Email:
      Label: 10px, letter-spacing 0.18em, uppercase, color var(--text-light)
      Input: padding 11px 40px 11px 14px, border-radius: 2px
        background: var(--beige) | border: 1px solid var(--border)
        focus: border-color var(--gold), box-shadow 0 0 0 3px rgba(200,168,48,0.1)
        error: border-color var(--error)
        Ícono sobre (SVG): posición absoluta derecha, 16px, color var(--text-light)

    Campo Contraseña:
      Mismo estilo que email
      Botón toggle ojo (posición absoluta derecha):
        hover: color var(--moss)
        Alterna SVG entre ojo abierto y cerrado

    Fila meta (display flex, justify-content space-between, margin-bottom 24px):
      "Recordarme": checkbox personalizado
        Box 16x16px, border-radius 1px, border 1px solid var(--border)
        checked: background var(--moss), border-color var(--moss), check SVG blanco
        Label: 12px, color var(--text-mid)
      "¿Olvidaste tu contraseña?": 12px, color var(--gold), hover opacity 0.7

    Botón "Ingresar":
      width: 100% | padding: 13px | border-radius: 2px
      background: var(--moss) | color: white
      font-size: 12px | font-weight: 500 | letter-spacing: 0.12em | uppercase
      hover: var(--moss-mid), translateY(-1px)
      loading: opacity 0.7, SVG spin + "Verificando..."

    Nota footer "Acceso seguro · SSL":
      centrado, 11px, color var(--text-light), margin-top 20px
      Líneas decorativas a los lados (flex con ::before/::after en var(--border))
```

**Lógica de formulario (React Hook Form + Zod):**
```typescript
// Endpoint: POST /api/admin/auth/login
// Body: { email: string, password: string }
// Al éxito: redirigir a /admin
// Al error 401: mostrar banner de error
// Loading state mientras se procesa
```

---

### 2. Componentes reutilizables del admin — `src/features/admin/components/`

#### `AdminTable.tsx`

Componente genérico de tabla para todas las secciones.

```
Contenedor:
  background: var(--white) | border: 1px solid var(--border) | border-radius: 2px
  overflow: hidden

Header de tabla (si title existe):
  padding: 16px 20px | border-bottom: 1px solid var(--border)
  display: flex | align-items: center | justify-content: space-between
  Título: 0.82rem, font-weight 600, color var(--text)

th:
  padding: 11px 16px | text-align: left
  font-size: 0.65rem | font-weight: 600 | letter-spacing: 1.5px | uppercase
  color: var(--text-light) | border-bottom: 1px solid var(--border)
  background: var(--beige-warm)

td:
  padding: 13px 16px | font-size: 0.8rem | color: var(--text-mid)
  border-bottom: 1px solid var(--border) | vertical-align: middle

tr:last-child td: border-bottom: none
tr:hover td: background: var(--beige)
td primaria (className "td-main"): color var(--text), font-weight 500
```

```typescript
interface AdminTableProps {
  headers: string[]
  children: React.ReactNode
  title?: string
  actions?: React.ReactNode
}
```

#### `AdminMetricCard.tsx`

Tarjeta de métrica para el dashboard.

```
background: var(--white) | border: 1px solid var(--border) | border-radius: 2px
padding: 20px | position: relative | overflow: hidden

Decoración esquina superior derecha:
  width: 60px | height: 60px | border-radius: 0 2px 0 60px
  opacity: 0.15 | background según variante:
    gold → var(--gold) | green → #27AE60 | blue → #2980B9 | purple → #8B5CF6

Icono: SVG 22px, color según variante, margin-bottom 10px
Valor: EB Garamond, 2rem, weight 600, color var(--text), line-height 1
Label: DM Sans, 0.72rem, color var(--text-mid), margin-top 4px

Delta:
  0.68rem | font-weight: 600 | padding: 2px 7px | border-radius: 10px
  up: background rgba(39,174,96,0.1), color #27AE60
  down: background rgba(192,57,43,0.08), color #C0392B
  margin-top: 8px
```

```typescript
interface AdminMetricCardProps {
  icon: React.ReactNode
  value: string
  label: string
  delta?: string
  deltaType?: 'up' | 'down'
  variant?: 'gold' | 'green' | 'blue' | 'purple'
}
```

#### `AdminStatusPill.tsx`

Badge de estado para pedidos y otros elementos.

```
display: inline-flex | align-items: center | gap: 4px
padding: 3px 9px | border-radius: 20px   ← excepción intencional al sistema 2px
font-size: 0.68rem | font-weight: 600

Variantes según estado de pedido:
  pending:   background rgba(230,126,34,0.08), color #E67E22
  paid:      background rgba(39,174,96,0.10),  color #27AE60
  preparing: background rgba(41,128,185,0.08), color #2980B9
  shipped:   background rgba(139,92,246,0.08), color #8B5CF6
  delivered: background rgba(39,174,96,0.10),  color #27AE60
  cancelled: background rgba(192,57,43,0.08),  color #C0392B

Variantes genéricas:
  active:   mismo que paid (verde)
  inactive: background rgba(115,96,2,0.08), color var(--text-light)

Punto de color: 5px, border-radius 50%, background currentColor
```

#### `AdminUploadZone.tsx`

Zona de upload de imágenes.

```
border: 2px dashed var(--border) | border-radius: 2px
padding: 28px | text-align: center | cursor: pointer
transition: all 0.2s | background: var(--beige)
hover: border-color var(--gold), background rgba(200,168,48,0.06)

Con preview de imagen:
  Imagen: width 100%, height 120px, border-radius 2px, object-fit cover
  Botón "Cambiar imagen" superpuesto (bottom center, semitransparente)

Sin imagen:
  SVG subir: 32px, opacity 0.4, color var(--text-light)
  Texto principal: 0.78rem, color var(--text-mid)
  Subtexto: 0.68rem, color var(--text-light) — "JPG, PNG, WEBP · Máx. {maxMB}MB"
```

```typescript
interface AdminUploadZoneProps {
  onFileSelect: (file: File) => void
  currentImageUrl?: string | null
  maxMB?: number   // default 5
  label?: string
}
```

#### `AdminToggle.tsx`

Toggle switch para activar/desactivar campos booleanos.

```
Fila: display flex, align-items center, justify-content space-between, padding 10px 0
Label: DM Sans, 0.8rem, color var(--text-mid)

Switch:
  width: 36px | height: 20px | position: relative | border-radius: 20px
  background: var(--beige-mid) cuando off → var(--gold) cuando on
  transition: 0.25s

  Círculo:
    width: 14px | height: 14px | border-radius: 50%
    position: absolute | left: 3px | bottom: 3px
    background: white | transition: 0.25s
    on: translateX(16px)
```

```typescript
interface AdminToggleProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}
```

---

### 3. Dashboard — `src/app/admin/(panel)/page.tsx`

Reemplazar el dashboard básico con el diseño del `crecer-admin.html`.

**Datos:** cargar con `GET /api/admin/pedidos/stats` al montar el componente.

```
Encabezado:
  Título: EB Garamond, 1.8rem, weight 600, color var(--text)
  Subtítulo: "Resumen de hoy · {fecha en español}" — 0.78rem, color var(--text-mid)
  display: flex | justify-content: space-between | margin-bottom: 24px

Grid de 4 AdminMetricCard:
  grid-template-columns: repeat(4,1fr) | gap: 14px | margin-bottom: 24px

  1. Ventas del mes (gold) — suma totales de pedidos paid/preparing/shipped/delivered del mes
  2. Pedidos del mes (green) — count total del mes
  3. Productos activos (blue) — count de productos con is_active=true
  4. Pedidos pendientes (purple) — count de pedidos con status=pending

Grid 2 columnas:
  1. AdminTable "Pedidos recientes" — últimos 5 pedidos
     Columnas: #Orden, Cliente, Total (formatCLP), Estado (AdminStatusPill)
     Link "Ver todos" → /admin/pedidos

  2. AdminTable "Stock crítico" — productos con stock_quantity ≤ 5
     Columnas: Libro, Quedan, Estado
     Link "Ver inventario" → /admin/productos?filter=low-stock

Gráfico de ventas de los últimos 7 días:
  Barras CSS simples (no librería)
  Altura proporcional al total de ventas de ese día
  background: linear-gradient(to top, var(--gold), rgba(200,168,48,0.3))
  Labels de días bajo cada barra: L M X J V S D
```

---

### 4. Gestión de Productos — `src/app/admin/(panel)/productos/`

Aplicar design system a las páginas existentes de la Fase 3.

**Listado** (`page.tsx`):
```
Encabezado: título "Catálogo de libros" + Button variante moss "Nuevo producto"
             subtítulo con count total

Fila de filtros:
  Input búsqueda: "Buscar título, autor..."
  Select categoría
  Select estado (Activo / Inactivo / Todos)

AdminTable, columnas:
  Miniatura (36x50px, border-radius 2px, gradient fallback)
  Libro (título td-main + ISBN/código debajo en 0.68rem var(--text-light))
  Categoría (AdminStatusPill con nombre)
  Precio (var(--gold), font-weight 600) + precio tachado si hay descuento
  Stock (número + barra de progreso CSS:
    verde >10 | gold 5-10 | rojo ≤5)
  Estado (AdminStatusPill active/inactive)
  Acciones (botón "Editar" + botón papelera)
```

**Formulario crear/editar** (`nuevo/page.tsx` y `[id]/editar/page.tsx`):
```
Grid 2 columnas: columna info (2fr) + columna imagen (1fr)

Bloques de formulario:
  background: var(--white) | border: 1px solid var(--border) | border-radius: 2px
  padding: 22px | margin-bottom: 16px
  Título del bloque: 0.78rem, font-weight 600, color var(--text)
    padding-bottom: 10px | border-bottom: 1px solid var(--border)

  Labels: 0.68rem, font-weight 600, letter-spacing 1px, uppercase, color var(--text-light)
  Inputs: componente Input de shared/ui/
  Textareas: componente Textarea de shared/ui/
  Selects: mismos estilos que Input

Bloques:
  "Información básica": título, autor, descripción, categorías (checkboxes o multiselect)
  "Precio y stock": precio, precio oferta, stock (número), en stock (AdminToggle)
  "Detalles": código interno, SKU, tipo de tapa, páginas
  "Configuración": es destacado (AdminToggle), activo (AdminToggle)

Columna imagen:
  AdminUploadZone para imagen principal (aspect-ratio 2/3)
  Lista de imágenes adicionales (galería) — thumbnails con botón eliminar

Botones footer: Button moss "Guardar" + Button outline "Cancelar"
```

---

### 5. Gestión de Categorías — `src/app/admin/(panel)/categorias/`

**Listado** (`page.tsx`):
```
AdminTable, columnas:
  Imagen (thumbnail 36x48px, border-radius 2px)
  Nombre (td-main)
  Productos asociados (número)
  Destacada (estrella ★ gold si true, gris si false)
  Orden (número)
  Activa (AdminStatusPill active/inactive)
  Acciones (Editar + Eliminar)
```

**Formulario** (`nuevo/page.tsx` y `[id]/editar/page.tsx`):
```
Campos: nombre, descripción, categoría padre (select), orden (número)
AdminToggle para: destacada, activa

Dos zonas de upload (AdminUploadZone):
  1. "Imagen de card" — aspect-ratio vertical 3:4 — para el grid de categorías del home
  2. "Imagen de header" — aspect-ratio horizontal 16:5 — para el PageHeader del listado
     (se guarda en el campo header_image_url agregado en la Tarea 4.3)
```

---

### 6. Gestión de Pedidos — `src/app/admin/(panel)/pedidos/`

**Listado** (`page.tsx`):
```
Filtros sobre la tabla:
  Input búsqueda por #orden o email del cliente
  Select estado (todos | pending | paid | preparing | shipped | delivered | cancelled)
  Select método entrega (todos | pickup | shipping)
  Rango de fechas (opcional)

AdminTable, columnas:
  #Orden (td-main)
  Fecha (formatDate de src/shared/utils/formatters.ts)
  Cliente (nombre)
  Email
  Entrega (pill "Retiro" o "Envío")
  Total (formatCLP de src/shared/utils/formatters.ts, color var(--gold))
  Estado (AdminStatusPill)
  Acciones (botón "Ver detalle")

Paginación al pie con el componente de paginación o botones simples
```

**Detalle de pedido** (`[id]/page.tsx`):
```
Layout: grid 2 columnas (info 2fr + acciones 1fr), align-items start

Columna izquierda:
  Encabezado: "#ORD-0001" (EB Garamond grande) + fecha + AdminStatusPill
  
  Card "Datos del cliente":
    background: var(--white) | border | border-radius: 2px | padding: 20px
    Nombre, email, teléfono — solo lectura
  
  Card "Dirección de envío" (solo si delivery_method = "shipping"):
    Dirección completa formateada
  
  Card "Items del pedido":
    AdminTable: producto (snapshot del título), SKU, precio unit (formatCLP), cantidad, subtotal (formatCLP)
  
  Card "Notas del admin":
    Textarea (Textarea de shared/ui) para agregar/editar admin_notes
    Botón "Guardar notas" → PUT /api/admin/pedidos/[id]/estado con adminNotes

Columna derecha (sticky):
  Card "Resumen financiero":
    Subtotal, descuento (si hay cupón + código), costo envío, total
    Todos con formatCLP
    Método de pago + referencia si existe
  
  Card "Cambiar estado":
    Mostrar solo transiciones válidas desde el estado actual:
      pending   → [paid, cancelled]
      paid      → [preparing, cancelled]
      preparing → [shipped (si shipping), delivered (si pickup)]
      shipped   → [delivered]
    
    Botón por cada transición válida con color del estado destino
    Modal de confirmación simple antes de ejecutar el cambio
    Llama a PUT /api/admin/pedidos/[id]/estado con { status, adminNotes? }
```

---

### 7. Gestión del Landing — `src/app/admin/(panel)/landing/`

#### `page.tsx` — Índice del landing

```
Grid de 4 cards:
  background: var(--white) | border | border-radius: 2px | padding: 20px
  Ícono + nombre de sección + descripción breve + botón "Editar" → ruta del editor

Secciones:
  Hero Slides    → /admin/landing/hero
  Banners        → /admin/landing/banners
  Selección curada → /admin/landing/seleccion
  Footer         → /admin/landing/footer
```

#### `hero/page.tsx` — Editor de slides

Patrón: preview arriba + panel editor abajo. Sidebar siempre visible (heredado del layout `admin/(panel)/layout.tsx`).

```
Preview (arriba):
  Renderizar HeroSlider con los datos actuales desde GET /api/landing/hero
  Muestra cómo se verá el hero en la tienda

Panel editor (abajo):
  border-top: 3px solid var(--gold) | padding: 32px 40px
  
  Header: "Slides del Hero" (EB Garamond) + acciones "Guardar cambios" | "Añadir slide"
  
  Lista de slides (acordeón):
    Cada slide es una card colapsable:
      Header: número circular (fondo moss/gold si activo) + thumbnail 60x38px
              + título + AdminStatusPill activo/inactivo + botones subir/bajar/eliminar
      Body expandido:
        AdminUploadZone para imagen (bucket "banners/hero/")
        Input: título del slide
        Input: subtítulo
        Input: eyebrow (el tag superior pequeño)
        Input: link URL del CTA
        AdminToggle: activo
  
  Botón "Añadir slide": borde punteado gold, hover gold
  
  Guardar llama a PUT /api/admin/landing/hero/[id] por cada slide modificado
```

#### `banners/page.tsx` — Editor de banners intermedios

```
Preview del banner con la imagen y cita actuales

Panel editor:
  AdminUploadZone para imagen de fondo (bucket "banners/promo/")
  Textarea: cita o texto del banner (el blockquote de QuoteSection)
  Input: autor de la cita
  AdminToggle: activo

Guardar → PUT /api/admin/landing/banners/[id]
```

#### `seleccion/page.tsx` — Editor de selección curada

```
Tabs por sección: "Selección del mes" | "Lectura litúrgica" | ...
  (las secciones disponibles se cargan desde GET /api/admin/landing/seleccion y se agrupan)

Lista de productos en la sección activa:
  Fila por producto:
    Thumbnail 40x60px | Título + autor | Descripción editorial | Orden | Eliminar
  Reordenar arrastrando o con botones ↑ ↓

Botón "Agregar producto":
  Abre modal con buscador de productos (TanStack Query → GET /api/admin/productos?search=...)
  Al seleccionar un producto: campo para descripción editorial + selector de sección
  Confirmar → POST /api/admin/landing/seleccion
```

#### `footer/page.tsx` — Editor del footer

```
Preview del Footer con los valores actuales de los sliders

Panel editor:
  AdminUploadZone para ilustración (bucket "banners", posición "footer_illustration")
  
  4 controles range (input type="range", min=1, max=100) con etiquetas y valor numérico:
    Opacidad de imagen (0.01–1.00, paso 0.01)
    Inicio del desvanecimiento (%)
    Fin del desvanecimiento (%)
    Ancho de la imagen (%)
  
  Los valores se leen/guardan en banners.metadata (jsonb):
    { opacity, fadeStart, fadeEnd, imgWidth, artSpaceWidth }
  
  Preview se actualiza en tiempo real al mover cada slider (state local)
  
  Botón "Guardar cambios" → PUT /api/admin/landing/banners/[id]
    body: { metadata: { opacity, fadeStart, fadeEnd, imgWidth, artSpaceWidth } }
```

---

### 8. Toast — `src/shared/ui/Toast.tsx` y hook `useToast`

```
position: fixed | bottom: 22px | right: 22px | z-index: 999
background: var(--moss) | color: white
padding: 11px 17px | border-radius: 2px
font-size: 0.79rem | font-weight: 500
display: flex | align-items: center | gap: 8px
box-shadow: 0 6px 24px rgba(58,48,1,0.25)
Animación: translateY(60px)→0, opacity 0→1 en 0.3s

Variantes:
  success: fondo var(--moss)
  error:   fondo var(--error) #C0392B
  info:    fondo #2980B9

Auto-dismiss: 3000ms
```

Crear hook `useToast()` en `src/shared/hooks/useToast.ts`:
```typescript
const { toast } = useToast()
toast({ message: 'Cambios guardados', variant: 'success' })
```

Actualizar `src/shared/ui/index.ts` y `src/shared/hooks/index.ts` con los nuevos exports.

---

## Mapa de equivalencias — UI básica → design system

| Elemento actual (Fase 3) | Reemplazar por |
|---|---|
| Botones azules `bg-blue-600` | `Button` variante `moss` |
| Botones rojos `bg-red-600` | `Button` variante `outline` con texto en `var(--error)` |
| Botones grises `bg-gray-200` | `Button` variante `outline` |
| Badges de estado inline | `AdminStatusPill` |
| Tablas con `border border-gray-*` | `AdminTable` |
| Inputs con `border border-gray-300` | `Input` de `shared/ui/` |
| Cards con `bg-white rounded-lg shadow` | card con `border-radius: 2px`, `border: 1px solid var(--border)`, `background: var(--white)` |
| Texto `text-gray-600` | `color: var(--text-light)` o `var(--text-mid)` |
| Texto `text-gray-900` / `text-black` | `color: var(--text)` |
| Títulos `font-bold text-xl` | EB Garamond, weight 400-600 |
| Fondos `bg-gray-50` / `bg-gray-100` | `background: var(--beige)` o `var(--beige-warm)` |

---

## Reglas importantes

- **Todas las páginas del panel admin están en `src/app/admin/(panel)/`**, no en `src/app/admin/` directamente. El route group `(panel)` no afecta las URLs públicas.
- **La página de login está en `src/app/admin/login/page.tsx`** — fuera del route group, sin sidebar ni topbar.
- **NO tocar ninguna lógica** — servicios, API Routes, schemas de Zod, store de Zustand. Solo se modifica el JSX y los estilos de las páginas y componentes existentes.
- **Los formularios React Hook Form + Zod** se mantienen intactos. Solo se reemplaza el JSX de los campos por los componentes `Input` y `Textarea` de `shared/ui/`.
- **`border-radius: 2px` en todo el admin** — incluyendo cards, inputs, botones y tablas. El HTML del diseñador usaba 7-12px pero el sistema del proyecto es 2px.
- **Única excepción al `border-radius`:** `AdminStatusPill` usa `border-radius: 20px` — es una píldora redondeada por diseño intencional.
- **`formatCLP` y `formatDate`** ya existen en `src/shared/utils/formatters.ts` — importar siempre desde ahí, nunca redefinir.
- **Los editores del landing** heredan el sidebar visible del layout `src/app/admin/(panel)/layout.tsx`. El preview de cada editor usa los mismos componentes de la tienda pública (HeroSlider, Footer, etc.) con datos reales desde las APIs.
- **API de pedidos del admin:** `GET /api/admin/pedidos`, `GET /api/admin/pedidos/stats`, `PUT /api/admin/pedidos/[id]/estado`. Verificar que las rutas coincidan con las implementadas en la Fase 3.
- Verificar que `tsc --noEmit` pase sin errores al finalizar.
