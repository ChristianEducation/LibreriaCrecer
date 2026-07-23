# PROMPT — Auditoría general del proyecto (UI/UX + consistencia)

## Objetivo
Hacer un repaso completo del proyecto Crecer Librería Católica: UI/UX, consistencia visual,
inconsistencias de datos/contenido tras los cambios recientes en el catálogo, y cualquier
problema técnico o de experiencia que valga la pena corregir.

**Esta es una tarea de AUDITORÍA, no de implementación.** No modificar código todavía — el
resultado es un reporte estructurado (Bloqueantes / Importantes / Menores) para decidir qué se
corrige y en qué orden.

## Lectura obligatoria antes de empezar
- `CLAUDE.md` (raíz)
- `docs/agentes/design-system.md`
- `docs/agentes/frontend.md`
- `docs/agentes/schema.md`

## 1. UI/UX y consistencia visual
- Revisar todas las páginas públicas (home, catálogo, ficha de producto, categorías, carrito,
  checkout, "nosotros", contacto) contra el design system: tipografía, colores, espaciados,
  botones, sombras de tarjetas.
- **Tarjetas de producto con título largo**: hoy hay productos con títulos más largos de lo
  habitual (ej. "BENDICIONAL - ritual de Bendiciones", "LECCIONARIO IV - Misa de Santos",
  títulos de la serie "Pequeños héroes de la Biblia" con sufijo añadido). Verificar que no
  rompan el layout de la tarjeta (truncamiento, line-clamp, altura de tarjeta).
- **Productos sin `main_image_url`** (~556, mayormente artículos religiosos/artesanía):
  confirmar que el placeholder/estado vacío se vea bien y no rompa el grid.
- **Productos sin `author`** (varios quedaron `NULL` tras la limpieza de hoy): confirmar que
  la ficha y la tarjeta no muestren "por " vacío, espacios raros, o un guión suelto cuando no
  hay autor.
- Responsive: probar mobile, tablet, desktop en las páginas principales.
- Accesibilidad básica: contraste de texto, tamaños de tap target, alt text en imágenes de
  producto (usar `title` del producto).
- Estados de carga e imágenes: lazy loading, dimensiones reservadas (evitar layout shift)
  ahora que ~1.140 productos tienen imagen real.

## 2. Bug conocido a confirmar y corregir
- El botón "Ver Colección" del hero apunta a `http://192.168.1.112:3000/productos` (IP local
  de desarrollo). Debe ser una ruta relativa (`/productos`) o la URL pública. Verificar el
  origen (hero slide en BD vs. hardcodeado) y corregirlo.

## 3. Catálogo — filtros y categorías
- Con las 12 categorías y la reasignación de hoy (35 libros movidos desde "Artículos
  religiosos"/"Artesanía religiosa" a categorías reales), revisar:
  - Que cada categoría en el menú/filtro muestre conteos coherentes.
  - Que ningún libro real siga apareciendo bajo "Artículos religiosos" o "Artesanía
    religiosa" en la navegación pública.
  - Que los 72 artículos pasados a `is_active=false` no aparezcan en ningún listado público
    (catálogo, búsqueda, "novedades").

## 4. Ficha de producto
- Campo "Referencia" (`sku ?? code`): confirmar que se muestre correctamente para los ~296
  productos que usan `code` (códigos internos tipo "Marcador 15", "SP80") y para los ~877 con
  ISBN real.
- Descripción: con las reescrituras en curso, confirmar que el bloque de descripción maneje
  bien textos de distinta longitud (2-3 frases) sin verse cortado ni con demasiado espacio
  vacío.
- Precio / precio de oferta: revisar formato CLP (sin decimales, separador de miles).

## 5. SEO y metadata
- Confirmar que `generateMetadata` siga funcionando con los títulos/descripciones nuevos
  (algunos títulos cambiaron de longitud tras las correcciones de hoy).
- Revisar que el JSON-LD de producto (`Product`, `BreadcrumbList`) refleje categoría y
  descripción actualizadas.

## 6. Admin panel
- Revisar el formulario de edición de producto: que los campos `code`, `sku`, `author`
  (ahora opcional/NULL), `publisher` se vean y editen bien.
- Confirmar que un admin pueda activar manualmente (`is_active=true`) los artículos
  religiosos/artesanía cuando se les suba foto, sin fricción.

## 7. Seguridad (pendiente conocido, solo confirmar estado)
- Verificar si `src/integrations/supabase/client.ts` sigue usando
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` para subir a Storage desde el servidor. No corregir en esta
  pasada (es tarea aparte), solo confirmar si sigue así y anotarlo en el reporte.

## 8. Benchmarking con e-commerce moderno
Además de bugs/consistencia, identificar **funcionalidades o patrones de UX estándar en
e-commerce actual que falten o estén poco desarrollados**, comparando con librerías online
como Buscalibre, Antártica o Amazon. No se trata de copiar features enterprise — priorizar lo
realista para el tamaño de esta tienda. Revisar específicamente:

- **Catálogo**: ordenar por (relevancia/precio/novedad), filtros combinables (categoría +
  precio + disponibilidad), breadcrumbs en categorías y fichas.
- **Búsqueda**: autocompletado/sugerencias mientras se escribe, manejo de "sin resultados"
  con sugerencias alternativas.
- **Ficha de producto**: zoom/lightbox de portada, productos relacionados ("también te puede
  interesar" — mismo autor/categoría), indicador de stock ("últimas unidades", "agotado"
  cuando `stock_quantity = 0`).
- **Carrito**: mini-carrito/drawer al agregar (sin salir de la página), edición de cantidad
  inline, mensaje de envío gratis sobre cierto monto si aplica.
- **Checkout**: indicador de pasos (progreso), resumen de pedido visible durante todo el
  proceso, validación de formulario en tiempo real.
- **Confianza**: badges de pago seguro (Getnet/Webpay), información de envío (Chilexpress)
  visible antes del checkout, política de cambios/devoluciones accesible.
- **Estados vacíos**: carrito vacío, categoría sin productos, búsqueda sin resultados — con
  mensaje + acción sugerida (no solo texto plano).
- **Loading**: skeletons/placeholders mientras cargan imágenes y listados, no solo spinners.
- **Navegación**: menú mobile (hamburguesa), botón "volver arriba" en listados largos,
  paginación o scroll infinito en catálogo.
- **Engagement**: "vistos recientemente", newsletter/suscripción (si aplica a futuro).

Para cada hallazgo de esta sección: indicar si es algo **ausente** (no existe) o **presente
pero mejorable**, y dar una sugerencia concreta y acotada al alcance de esta tienda.


```
## Bloqueantes
- [ ] ...

## Importantes
- [ ] ...

## Menores
- [ ] ...
```
Para cada item: página/componente afectado, descripción del problema, y sugerencia de fix
(sin aplicarlo todavía).
