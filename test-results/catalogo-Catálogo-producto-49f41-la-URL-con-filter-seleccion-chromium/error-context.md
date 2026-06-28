# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: catalogo.spec.ts >> Catálogo /productos >> chip 'Selección del mes' actualiza la URL con filter=seleccion
- Location: tests\catalogo.spec.ts:37:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /filter=seleccion/
Received string:  "http://localhost:3000/productos"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    9 × unexpected value "http://localhost:3000/productos"

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "Crecer Librería Crecer Librería C A T Ó L I C A" [ref=e4] [cursor=pointer]:
        - /url: /
        - img "Crecer Librería" [ref=e5]
        - generic [ref=e6]:
          - generic [ref=e7]: Crecer Librería
          - generic [ref=e8]: C A T Ó L I C A
      - generic [ref=e9]:
        - searchbox "Buscar libros, autores..." [ref=e10]
        - button "Buscar" [ref=e11]:
          - img [ref=e12]
      - navigation [ref=e15]:
        - link "Colección" [ref=e16] [cursor=pointer]:
          - /url: /productos
        - listitem [ref=e17]:
          - button "Categorías" [ref=e18]
        - link "Selección del mes" [ref=e19] [cursor=pointer]:
          - /url: /productos?filter=seleccion
        - link "Recién llegados" [ref=e20] [cursor=pointer]:
          - /url: /productos?filter=nuevo
        - link "Conócenos" [ref=e21] [cursor=pointer]:
          - /url: /nosotros
      - button "Abrir carrito" [ref=e23] [cursor=pointer]:
        - img [ref=e24]
  - main [ref=e28]:
    - generic [ref=e29]:
      - generic [ref=e30]:
        - generic [ref=e31]:
          - link "Inicio" [ref=e32] [cursor=pointer]:
            - /url: /
          - generic [ref=e33]: /
          - link "Colección" [ref=e34] [cursor=pointer]:
            - /url: /productos
        - heading "Nuestra colección" [level=1] [ref=e35]:
          - text: Nuestra
          - emphasis [ref=e36]: colección
        - paragraph [ref=e37]: Libros, biblias y artículos religiosos para el crecimiento espiritual.
      - generic [ref=e39]:
        - generic:
          - button "Desplazar a la izquierda":
            - img
        - button "Desplazar a la derecha" [ref=e41]:
          - img [ref=e42]
        - generic [ref=e44]:
          - button "Todos" [ref=e45]: Todos
          - button "Tarjetas" [ref=e47]: Tarjetas
          - button "Vida de Santos" [ref=e48]: Vida de Santos
          - button "Espiritualidad" [ref=e49]: Espiritualidad
          - button "Eclesial" [ref=e50]: Eclesial
          - button "Teología, filosofía, antropología" [ref=e51]: Teología, filosofía, antropología
          - button "Virgen María" [ref=e52]: Virgen María
          - button "Pastoral y Sacramentos" [ref=e53]: Pastoral y Sacramentos
          - button "Psicología y autoayuda" [ref=e54]: Psicología y autoayuda
          - button "Biblia, Liturgia" [ref=e55]: Biblia, Liturgia
          - button "Narrativa y testimonios" [ref=e56]: Narrativa y testimonios
          - button "Educación / Familia" [ref=e57]: Educación / Familia
          - button "Historia" [ref=e58]: Historia
          - button "Artesanía religiosa" [ref=e59]: Artesanía religiosa
          - button "Artículos religiosos" [ref=e60]: Artículos religiosos
    - generic [ref=e62]:
      - complementary [ref=e63]:
        - generic [ref=e64]:
          - generic [ref=e65]:
            - heading "Buscar" [level=3] [ref=e66]
            - generic [ref=e67]:
              - searchbox "Título, autor..." [ref=e68]
              - button "Buscar" [ref=e69]:
                - img [ref=e70]
          - generic [ref=e73]:
            - heading "Filtros Especiales" [level=3] [ref=e74]
            - generic [ref=e75]:
              - button "Todos" [ref=e76]:
                - generic [ref=e79]: Todos
              - button "Nuevos" [ref=e80]:
                - generic [ref=e83]: Nuevos
              - button "Selección del mes" [active] [ref=e84]:
                - generic [ref=e87]: Selección del mes
          - generic [ref=e88]:
            - heading "Ordenar por" [level=3] [ref=e89]
            - generic [ref=e90]:
              - generic [ref=e91] [cursor=pointer]:
                - img [ref=e93]
                - generic [ref=e95]: Más recientes
              - generic [ref=e96] [cursor=pointer]:
                - img [ref=e98]
                - generic [ref=e100]: Menor a mayor precio
              - generic [ref=e101] [cursor=pointer]:
                - img [ref=e103]
                - generic [ref=e105]: Mayor a menor precio
              - generic [ref=e106] [cursor=pointer]:
                - img [ref=e108]
                - generic [ref=e110]: Orden alfabético
      - generic [ref=e111]:
        - generic [ref=e112]: 0 productos
        - generic [ref=e114]:
          - paragraph [ref=e115]: Sin resultados
          - heading "Aún no hay libros para este filtro" [level=3] [ref=e116]:
            - text: Aún no hay libros
            - emphasis [ref=e117]: para este filtro
          - paragraph [ref=e118]: Prueba otra categoría u orden para descubrir más títulos disponibles.
  - contentinfo [ref=e119]:
    - generic [ref=e127]:
      - generic [ref=e128]:
        - img "Crecer Librería" [ref=e129]
        - paragraph [ref=e130]: Crecer Libreria
        - paragraph [ref=e131]: Fe, lectura y formación
        - paragraph [ref=e132]: Una librería católica pensada para acompañar el estudio, la devoción y la vida diaria con una selección curada de títulos.
      - generic [ref=e133]:
        - heading "Catálogo" [level=4] [ref=e134]
        - generic [ref=e135]:
          - link "Coleccion completa" [ref=e136] [cursor=pointer]:
            - /url: /productos
          - link "Novedades" [ref=e137] [cursor=pointer]:
            - /url: /productos?filter=nuevo
      - generic [ref=e138]:
        - heading "Información" [level=4] [ref=e139]
        - generic [ref=e140]:
          - link "Mi carrito" [ref=e141] [cursor=pointer]:
            - /url: /carrito
          - link "Checkout" [ref=e142] [cursor=pointer]:
            - /url: /checkout
      - generic [ref=e143]:
        - heading "Ubicación" [level=4] [ref=e144]
        - generic [ref=e145]:
          - img [ref=e146]
          - paragraph [ref=e149]: Arturo Prat 470 / Antofagasta, Chile
        - link "Ver en el mapa →" [ref=e150] [cursor=pointer]:
          - /url: https://maps.google.com/?q=Arturo+Prat+470+Antofagasta
    - generic [ref=e151]:
      - paragraph [ref=e152]: © 2026 Crecer Libreria. Todos los derechos reservados.
      - generic [ref=e153]:
        - paragraph [ref=e154]: "Diseño: Hultur Studios"
        - link "·" [ref=e155] [cursor=pointer]:
          - /url: /admin/login
  - button "Open Next.js Dev Tools" [ref=e161] [cursor=pointer]:
    - img [ref=e162]
  - alert [ref=e165]
```

# Test source

```ts
  1  | /**
  2  |  * Tests del Catálogo (/productos)
  3  |  * Requiere datos en la BD — correr `npm run seed:products` antes.
  4  |  * Verifica carga de la página, filtros, orden y búsqueda.
  5  |  */
  6  | import { test, expect } from "@playwright/test";
  7  | 
  8  | test.describe("Catálogo /productos", () => {
  9  |   test.beforeEach(async ({ page }) => {
  10 |     await page.goto("/productos");
  11 |   });
  12 | 
  13 |   test("carga con header y grilla de productos", async ({ page }) => {
  14 |     // PageHeader con "Nuestra colección"
  15 |     await expect(page.getByRole("heading", { name: /colecci/i }).first()).toBeVisible();
  16 |     // FilterBar con label FILTRAR
  17 |     await expect(page.getByText("FILTRAR")).toBeVisible();
  18 |     // Al menos un producto en la grilla
  19 |     await expect(page.locator('article[role="link"]').first()).toBeVisible();
  20 |   });
  21 | 
  22 |   test("muestra el contador de resultados", async ({ page }) => {
  23 |     // FilterBar muestra "N productos"
  24 |     await expect(page.getByText(/productos?/)).toBeVisible();
  25 |   });
  26 | 
  27 |   test("chip 'Nuevos' actualiza la URL con filter=nuevo", async ({ page }) => {
  28 |     await page.getByRole("button", { name: "Nuevos" }).first().click();
  29 |     await expect(page).toHaveURL(/filter=nuevo/);
  30 |   });
  31 | 
  32 |   test("chip 'En oferta' actualiza la URL con filter=oferta", async ({ page }) => {
  33 |     await page.getByRole("button", { name: "En oferta" }).first().click();
  34 |     await expect(page).toHaveURL(/filter=oferta/);
  35 |   });
  36 | 
  37 |   test("chip 'Selección del mes' actualiza la URL con filter=seleccion", async ({ page }) => {
  38 |     await page.getByRole("button", { name: "Selección del mes" }).first().click();
> 39 |     await expect(page).toHaveURL(/filter=seleccion/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  40 |   });
  41 | 
  42 |   test.skip("chip 'Todos' limpia el filtro en la URL", async () => {
  43 |     // SKIP: El chip "Todos" usa router.push("/productos") de Next.js App Router,
  44 |     // que no dispara eventos de navegación detectables por Playwright cuando
  45 |     // la URL actual ya tiene un filter= (viene de navegación client-side previa).
  46 |     // waitForURL y waitForFunction en window.location.href confirman que el URL
  47 |     // genuinamente no cambia en el contexto de Playwright, aunque funciona
  48 |     // correctamente en el browser real.
  49 |     // Known issue: Next.js 15 + Turbopack + App Router pushState desde misma ruta.
  50 |   });
  51 | 
  52 |   test("botón de orden 'Precio: menor a mayor' actualiza URL", async ({ page }) => {
  53 |     await page.getByRole("button", { name: /menor a mayor/i }).first().click();
  54 |     await expect(page).toHaveURL(/sort=price_asc/);
  55 |   });
  56 | 
  57 |   test("búsqueda actualiza la URL con el parámetro search", async ({ page }) => {
  58 |     const searchInput = page.getByPlaceholder("Buscar...").first();
  59 |     await searchInput.fill("biblia");
  60 |     await searchInput.press("Enter");
  61 |     await expect(page).toHaveURL(/search=biblia/);
  62 |   });
  63 | 
  64 |   test("buscar un término vacío no agrega search a la URL", async ({ page }) => {
  65 |     const searchInput = page.getByPlaceholder("Buscar...").first();
  66 |     await searchInput.fill("  ");
  67 |     await searchInput.press("Enter");
  68 |     await expect(page).not.toHaveURL(/search=/);
  69 |   });
  70 | 
  71 |   test("hacer click en un producto navega al detalle", async ({ page }) => {
  72 |     const firstProduct = page.locator('article[role="link"]').first();
  73 |     await expect(firstProduct).toBeVisible();
  74 |     // Registrar listener antes del click para evitar race condition con router.push
  75 |     const navPromise = page.waitForURL(/\/productos\/.+/, { timeout: 10_000 });
  76 |     await firstProduct.click();
  77 |     await navPromise;
  78 |   });
  79 | });
  80 | 
```