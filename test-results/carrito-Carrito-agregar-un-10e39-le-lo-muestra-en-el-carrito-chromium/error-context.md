# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: carrito.spec.ts >> Carrito >> agregar un producto desde el detalle lo muestra en el carrito
- Location: tests\carrito.spec.ts:28:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  getByText('Ejercicios Espirituales de San Ignacio').first()
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Ejercicios Espirituales de San Ignacio').first()
    9 × locator resolved to <p class="truncate font-serif text-[13px] font-medium text-text">Ejercicios Espirituales de San Ignacio</p>
      - unexpected value "hidden"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "Crecer Libreria Libreria cristiana" [ref=e4] [cursor=pointer]:
        - /url: /
        - generic [ref=e8]:
          - generic [ref=e9]: Crecer Libreria
          - generic [ref=e10]: Libreria cristiana
      - generic [ref=e11]:
        - searchbox "Buscar libros, autores..." [ref=e12]
        - button "Buscar" [ref=e13]:
          - img [ref=e14]
      - navigation [ref=e17]:
        - link "Colección" [ref=e18] [cursor=pointer]:
          - /url: /productos
        - listitem [ref=e19]:
          - button "Categorías" [ref=e20]
        - link "Selección del mes" [ref=e21] [cursor=pointer]:
          - /url: /#libros-mes
        - link "Recién llegados" [ref=e22] [cursor=pointer]:
          - /url: /#recien-llegados
      - button "1" [ref=e24]:
        - img [ref=e25]
        - generic [ref=e29]: "1"
  - main [ref=e30]:
    - generic [ref=e31]:
      - heading "Mi carrito" [level=1] [ref=e32]
      - generic [ref=e33]:
        - generic [ref=e34]:
          - generic [ref=e37]:
            - img [ref=e39]
            - generic [ref=e42]:
              - link "Ejercicios Espirituales de San Ignacio" [ref=e43] [cursor=pointer]:
                - /url: /productos/ejercicios-espirituales-san-ignacio
                - paragraph [ref=e44]: Ejercicios Espirituales de San Ignacio
              - paragraph [ref=e45]: San Ignacio de Loyola
              - generic [ref=e46]:
                - generic [ref=e47]:
                  - button "−" [ref=e48] [cursor=pointer]
                  - generic [ref=e49]: "1"
                  - button "+" [ref=e50] [cursor=pointer]
                - button "Eliminar" [ref=e51] [cursor=pointer]
            - paragraph [ref=e53]: $31.000
          - generic [ref=e54]:
            - paragraph [ref=e55]: Código de descuento
            - generic [ref=e56]:
              - textbox "CRECER10" [ref=e57]
              - button "Aplicar" [ref=e58] [cursor=pointer]
        - complementary [ref=e59]:
          - generic [ref=e61]: Resumen
          - generic [ref=e62]:
            - generic [ref=e63]:
              - generic [ref=e64]: Subtotal
              - generic [ref=e65]: $31.000
            - generic [ref=e66]:
              - generic [ref=e67]: Envío
              - generic [ref=e68]: Se calcula al checkout
            - generic [ref=e69]:
              - generic [ref=e70]: Total
              - generic [ref=e71]: $31.000
          - generic [ref=e72]:
            - link "Ir al checkout" [ref=e73] [cursor=pointer]:
              - /url: /checkout
            - generic [ref=e74]: Compra 100% segura · SSL
            - link "Seguir comprando" [ref=e76] [cursor=pointer]:
              - /url: /productos
  - contentinfo [ref=e77]:
    - generic [ref=e84]:
      - generic [ref=e85]:
        - generic [ref=e90]:
          - paragraph [ref=e91]: Crecer Libreria
          - paragraph [ref=e92]: Fe, lectura y formacion
        - paragraph [ref=e93]: Una libreria cristiana pensada para acompanar el estudio, la devocion y la vida diaria con una seleccion curada de titulos.
      - generic [ref=e94]:
        - heading "Catalogo" [level=4] [ref=e95]
        - generic [ref=e96]:
          - link "Coleccion completa" [ref=e97] [cursor=pointer]:
            - /url: /productos
          - link "Novedades" [ref=e98] [cursor=pointer]:
            - /url: /productos?filter=nuevo
          - link "Ofertas" [ref=e99] [cursor=pointer]:
            - /url: /productos?filter=oferta
      - generic [ref=e100]:
        - heading "Informacion" [level=4] [ref=e101]
        - generic [ref=e102]:
          - link "Mi carrito" [ref=e103] [cursor=pointer]:
            - /url: /carrito
          - link "Checkout" [ref=e104] [cursor=pointer]:
            - /url: /checkout
      - generic [ref=e105]:
        - heading "Ubicacion" [level=4] [ref=e106]
        - generic [ref=e107]:
          - img [ref=e108]
          - paragraph [ref=e111]: Arturo Prat 470 / Antofagasta, Chile
        - link "Ver en el mapa →" [ref=e112] [cursor=pointer]:
          - /url: https://maps.google.com/?q=Arturo+Prat+470+Antofagasta
    - generic [ref=e113]:
      - paragraph [ref=e114]: © 2026 Crecer Libreria. Todos los derechos reservados.
      - paragraph [ref=e115]: "Diseño: Hultur Studio"
  - generic [ref=e120] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e121]:
      - img [ref=e122]
    - generic [ref=e125]:
      - button "Open issues overlay" [ref=e126]:
        - generic [ref=e127]:
          - generic [ref=e128]: "0"
          - generic [ref=e129]: "1"
        - generic [ref=e130]: Issue
      - button "Collapse issues badge" [ref=e131]:
        - img [ref=e132]
  - alert [ref=e134]
```

# Test source

```ts
  1  | /**
  2  |  * Tests del Carrito (/carrito)
  3  |  * Verifica el estado vacío y el flujo de agregar un producto al carrito.
  4  |  * Requiere datos en la BD — correr `npm run seed:products` antes.
  5  |  */
  6  | import { test, expect } from "@playwright/test";
  7  | 
  8  | test.describe("Carrito", () => {
  9  |   test("muestra estado vacío cuando no hay items", async ({ page }) => {
  10 |     await page.goto("/carrito");
  11 | 
  12 |     // Esperar hidratación de Zustand (skeleton desaparece)
  13 |     await expect(page.getByRole("heading", { name: /mi carrito/i })).toBeVisible();
  14 | 
  15 |     // Estado vacío — scope a main para evitar el CartPanel (que también tiene este texto)
  16 |     await expect(page.locator("main").getByText("Tu carrito está vacío")).toBeVisible();
  17 |     await expect(page.getByRole("link", { name: /ver colección/i })).toBeVisible();
  18 |   });
  19 | 
  20 |   test("el botón Ir al checkout está deshabilitado con carrito vacío", async ({ page }) => {
  21 |     await page.goto("/carrito");
  22 |     await expect(page.getByRole("heading", { name: /mi carrito/i })).toBeVisible();
  23 | 
  24 |     const checkoutLink = page.getByRole("link", { name: /ir al checkout/i });
  25 |     await expect(checkoutLink).toHaveCSS("pointer-events", "none");
  26 |   });
  27 | 
  28 |   test("agregar un producto desde el detalle lo muestra en el carrito", async ({ page }) => {
  29 |     // 1. Navegar al catálogo y clickear el primer producto
  30 |     await page.goto("/productos");
  31 |     await page.locator('article[role="link"]').first().click();
  32 |     await expect(page).toHaveURL(/\/productos\/.+/);
  33 | 
  34 |     // 2. Capturar título del producto
  35 |     const productTitle = await page.getByRole("heading", { level: 1 }).textContent();
  36 | 
  37 |     // 3. Agregar al carrito y esperar confirmación visual
  38 |     const addBtn = page.getByRole("button", { name: /añadir al carrito/i });
  39 |     await expect(addBtn).toBeVisible();
  40 |     await addBtn.click();
  41 | 
  42 |     // 4. El botón cambia a "Agregado" — verificar con locator separado
  43 |     await expect(page.getByText(/agregado/i).first()).toBeVisible({ timeout: 3000 });
  44 | 
  45 |     // 5. Navegar al carrito
  46 |     await page.goto("/carrito");
  47 |     await expect(page.getByRole("heading", { name: /mi carrito/i })).toBeVisible();
  48 | 
  49 |     // 6. El estado vacío NO debe aparecer (scoped a main)
  50 |     await expect(page.locator("main").getByText("Tu carrito está vacío")).not.toBeVisible({ timeout: 5000 });
  51 | 
  52 |     // 7. El título del producto aparece en el carrito
  53 |     if (productTitle) {
  54 |       await expect(
  55 |         page.getByText(productTitle.trim(), { exact: false }).first()
> 56 |       ).toBeVisible();
     |         ^ Error: expect(locator).toBeVisible() failed
  57 |     }
  58 |   });
  59 | 
  60 |   test("el subtotal del resumen muestra el precio formateado", async ({ page }) => {
  61 |     // Agregar un producto primero
  62 |     await page.goto("/productos");
  63 |     await page.locator('article[role="link"]').first().click();
  64 |     await page.getByRole("button", { name: /añadir al carrito/i }).click();
  65 | 
  66 |     // Ir al carrito
  67 |     await page.goto("/carrito");
  68 |     await expect(page.getByRole("heading", { name: /mi carrito/i })).toBeVisible();
  69 |     await expect(page.locator("main").getByText("Tu carrito está vacío")).not.toBeVisible({ timeout: 5000 });
  70 | 
  71 |     // Resumen muestra Subtotal con precio CLP — scope a main para evitar CartPanel oculto
  72 |     await expect(page.getByText("Subtotal")).toBeVisible();
  73 |     await expect(page.locator("main").getByText(/^\$[\d.]+/).first()).toBeVisible();
  74 |   });
  75 | 
  76 |   test("se puede aumentar la cantidad de un item con el stepper", async ({ page }) => {
  77 |     // Agregar producto
  78 |     await page.goto("/productos");
  79 |     await page.locator('article[role="link"]').first().click();
  80 |     await page.getByRole("button", { name: /añadir al carrito/i }).click();
  81 | 
  82 |     await page.goto("/carrito");
  83 |     await expect(page.locator("main").getByText("Tu carrito está vacío")).not.toBeVisible({ timeout: 5000 });
  84 | 
  85 |     // Click en botón "+"
  86 |     await page.getByRole("button", { name: "+" }).first().click();
  87 | 
  88 |     // La cantidad debe ser 2
  89 |     await expect(page.getByText("2").first()).toBeVisible();
  90 |   });
  91 | });
  92 | 
```