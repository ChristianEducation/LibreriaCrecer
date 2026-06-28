# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout.spec.ts >> Checkout — flujo completo de compra >> el summary del checkout muestra los items del carrito
- Location: tests\checkout.spec.ts:141:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: /añadir al carrito/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('button', { name: /añadir al carrito/i })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "Crecer Librería Crecer Librería C A T Ó L I C A" [ref=e4] [cursor=pointer]:
        - /url: /
        - img "Crecer Librería" [ref=e5]
        - generic [ref=e6]:
          - generic [ref=e7]: Crecer Librería
          - generic [ref=e8]: C A T Ó L I C A
      - generic [ref=e9]:
        - button "Abrir carrito" [ref=e10] [cursor=pointer]:
          - img [ref=e11]
        - button "Abrir menú" [ref=e15]:
          - img [ref=e16]
  - main [ref=e18]:
    - generic [ref=e20]:
      - paragraph [ref=e21]:
        - link "Inicio" [ref=e22] [cursor=pointer]:
          - /url: /
        - generic [ref=e23]: /
        - link "Colección" [ref=e24] [cursor=pointer]:
          - /url: /productos
        - generic [ref=e25]: /
        - link "Pastoral y Sacramentos" [ref=e26] [cursor=pointer]:
          - /url: /productos?cat=pastoral-y-sacramentos
        - generic [ref=e27]: /
        - generic [ref=e28]: La Santa Misa
      - generic [ref=e29]:
        - button "La Santa Misa" [ref=e31]:
          - img "La Santa Misa" [ref=e32]
          - img [ref=e34]
        - generic [ref=e36]:
          - paragraph [ref=e37]: Pastoral y Sacramentos
          - heading "La Santa Misa" [level=1] [ref=e39]
          - paragraph [ref=e40]:
            - text: por
            - emphasis [ref=e41]: ordinario de la misa
          - paragraph [ref=e42]:
            - text: Referencia
            - strong [ref=e43]: "0802000018241"
          - generic [ref=e44]:
            - text: $3.500
            - paragraph [ref=e45]: Impuestos incluidos · Envío calculado al checkout
          - generic [ref=e47]: Contiene toda la parte común de la Santa Misa en la forma extraordinaria, o también llamada Misa tridentina junto a su traducción al español. Se trata, por tanto, de la parte de la Misa que los fieles oirán repetidamente en todas las Misas y que, por ello, conviene aprender mejor que ninguna otra, así como conocer su significado. Además enseña lo que el fiel ha de decir, su postura en cada momento, sus gestos (como los golpes de pecho, santiguarse o signarse) que hay que realizar. También los gestos que realiza el sacerdote, su volumen cambiante de voz...etc.Un Ordinario de Misa detallado para cualquiera que quiera conocer mejor y comprender esta Misa. Podríamos decir que es la descripción detallada y precisa de la mayor obra de arte divina.
          - generic [ref=e51]:
            - text: Editorial
            - strong [ref=e52]: San Pablo
          - generic [ref=e54]:
            - generic [ref=e55]:
              - button "−" [ref=e56] [cursor=pointer]
              - spinbutton [ref=e57]: "1"
              - button "+" [ref=e58] [cursor=pointer]
            - button "Añadir al carrito" [ref=e59] [cursor=pointer]:
              - img [ref=e60]
              - text: Añadir al carrito
          - generic [ref=e64]:
            - generic [ref=e65]:
              - img [ref=e66]
              - text: Envío a todo Chile
            - generic [ref=e71]:
              - img [ref=e72]
              - text: Compra segura
            - generic [ref=e74]:
              - img [ref=e75]
              - text: Retiro en tienda · Antofagasta
    - generic [ref=e79]:
      - generic [ref=e80]:
        - generic [ref=e81]:
          - paragraph [ref=e82]: También podría interesarte
          - heading "Títulos relacionados" [level=2] [ref=e84]:
            - text: Títulos
            - emphasis [ref=e85]: relacionados
        - link "Ver más →" [ref=e86] [cursor=pointer]:
          - /url: /productos?cat=pastoral-y-sacramentos
      - generic [ref=e87]:
        - link "100 Promesas de Oro para tu Vida Agregar caja metálica ovejita 100 Promesas de Oro para tu Vida $14.900" [ref=e88] [cursor=pointer]:
          - generic [ref=e89]:
            - img "100 Promesas de Oro para tu Vida" [ref=e90]
            - generic:
              - button "Agregar"
          - generic [ref=e91]:
            - paragraph [ref=e92]: caja metálica ovejita
            - heading "100 Promesas de Oro para tu Vida" [level=3] [ref=e93]
            - paragraph [ref=e94]: $14.900
        - link "La Misa para los Niños Agregar Lawrence Lovasik La Misa para los Niños $16.000" [ref=e95] [cursor=pointer]:
          - generic [ref=e96]:
            - img "La Misa para los Niños" [ref=e97]
            - generic:
              - button "Agregar"
          - generic [ref=e98]:
            - paragraph [ref=e99]: Lawrence Lovasik
            - heading "La Misa para los Niños" [level=3] [ref=e100]
            - paragraph [ref=e101]: $16.000
        - link "Youcat Agregar Varios autores Youcat $18.000" [ref=e102] [cursor=pointer]:
          - generic [ref=e103]:
            - img "Youcat" [ref=e104]
            - generic:
              - button "Agregar"
          - generic [ref=e105]:
            - paragraph [ref=e106]: Varios autores
            - heading "Youcat" [level=3] [ref=e107]
            - paragraph [ref=e108]: $18.000
        - link "Youcat para la Infancia Agregar Youcat para la Infancia $18.000" [ref=e109] [cursor=pointer]:
          - generic [ref=e110]:
            - img "Youcat para la Infancia" [ref=e111]
            - generic:
              - button "Agregar"
          - generic [ref=e112]:
            - heading "Youcat para la Infancia" [level=3] [ref=e113]
            - paragraph [ref=e114]: $18.000
        - link "100 Promesas de Oro para Ti Agregar caja metalica 100 Promesas de Oro para Ti $14.900" [ref=e115] [cursor=pointer]:
          - generic [ref=e116]:
            - img "100 Promesas de Oro para Ti" [ref=e117]
            - generic:
              - button "Agregar"
          - generic [ref=e118]:
            - paragraph [ref=e119]: caja metalica
            - heading "100 Promesas de Oro para Ti" [level=3] [ref=e120]
            - paragraph [ref=e121]: $14.900
  - contentinfo [ref=e122]:
    - generic [ref=e130]:
      - generic [ref=e131]:
        - img "Crecer Librería" [ref=e132]
        - paragraph [ref=e133]: Crecer Libreria
        - paragraph [ref=e134]: Fe, lectura y formación
        - paragraph [ref=e135]: Una librería católica pensada para acompañar el estudio, la devoción y la vida diaria con una selección curada de títulos.
      - generic [ref=e136]:
        - heading "Catálogo" [level=4] [ref=e137]
        - generic [ref=e138]:
          - link "Coleccion completa" [ref=e139] [cursor=pointer]:
            - /url: /productos
          - link "Novedades" [ref=e140] [cursor=pointer]:
            - /url: /productos?filter=nuevo
      - generic [ref=e141]:
        - heading "Información" [level=4] [ref=e142]
        - generic [ref=e143]:
          - link "Mi carrito" [ref=e144] [cursor=pointer]:
            - /url: /carrito
          - link "Checkout" [ref=e145] [cursor=pointer]:
            - /url: /checkout
      - generic [ref=e146]:
        - heading "Ubicación" [level=4] [ref=e147]
        - generic [ref=e148]:
          - img [ref=e149]
          - paragraph [ref=e152]: Arturo Prat 470 / Antofagasta, Chile
        - link "Ver en el mapa →" [ref=e153] [cursor=pointer]:
          - /url: https://maps.google.com/?q=Arturo+Prat+470+Antofagasta
    - generic [ref=e154]:
      - paragraph [ref=e155]: © 2026 Crecer Libreria. Todos los derechos reservados.
      - generic [ref=e156]:
        - paragraph [ref=e157]: "Diseño: Hultur Studios"
        - link "·" [ref=e158] [cursor=pointer]:
          - /url: /admin/login
  - button "Open Next.js Dev Tools" [ref=e164] [cursor=pointer]:
    - img [ref=e165]
  - alert [ref=e168]
```

# Test source

```ts
  1   | /**
  2   |  * Tests E2E del flujo completo de compra
  3   |  *
  4   |  * Requisitos para correr este archivo:
  5   |  *   1. `npm run dev` corriendo en otra terminal
  6   |  *   2. BD con al menos un producto activo (`npm run seed:products`)
  7   |  *   3. Variables de entorno configuradas (.env.local)
  8   |  *      — Getnet usa credenciales TEST hardcodeadas como fallback si las env vars
  9   |  *        no están, así que el test debería funcionar sin configuración extra.
  10  |  *
  11  |  * Notas:
  12  |  *   - El test de flujo completo crea una orden REAL en la BD (estado: pending).
  13  |  *     El cron job la cancela automáticamente después de 24h.
  14  |  *   - El test verifica la redirección a Getnet TEST; no completa el pago.
  15  |  */
  16  | import { test, expect, type Page } from "@playwright/test";
  17  | 
  18  | // ─── Helpers ────────────────────────────────────────────────────────────────
  19  | 
  20  | /** Agrega el primer producto del catálogo al carrito desde su página de detalle. */
  21  | async function addFirstProductToCart(page: Page) {
  22  |   await page.goto("/productos");
  23  | 
  24  |   const firstProduct = page.locator('article[role="link"]').first();
  25  |   await expect(firstProduct).toBeVisible({ timeout: 10_000 });
  26  |   await firstProduct.click();
  27  | 
  28  |   await expect(page).toHaveURL(/\/productos\/.+/);
  29  | 
  30  |   const addBtn = page.getByRole("button", { name: /añadir al carrito/i });
> 31  |   await expect(addBtn).toBeVisible();
      |                        ^ Error: expect(locator).toBeVisible() failed
  32  |   await addBtn.click();
  33  | 
  34  |   // Esperar confirmación visual antes de continuar
  35  |   await expect(addBtn).toContainText(/agregado/i, { timeout: 4_000 });
  36  | }
  37  | 
  38  | // ─── Suite: carrito vacío ────────────────────────────────────────────────────
  39  | 
  40  | test.describe("Checkout — carrito vacío", () => {
  41  |   test("navegar a /checkout con carrito vacío redirige a /carrito", async ({ page }) => {
  42  |     // Contexto limpio = sin items en localStorage
  43  |     await page.goto("/checkout");
  44  | 
  45  |     // CheckoutPage detecta items.length === 0 tras hidratación y hace router.replace
  46  |     await expect(page).toHaveURL(/\/carrito/, { timeout: 8_000 });
  47  |   });
  48  | 
  49  |   test("en /carrito vacío el botón Ir al checkout está deshabilitado", async ({ page }) => {
  50  |     await page.goto("/carrito");
  51  |     await expect(page.getByRole("heading", { name: /mi carrito/i })).toBeVisible();
  52  | 
  53  |     const checkoutLink = page.getByRole("link", { name: /ir al checkout/i });
  54  |     await expect(checkoutLink).toHaveCSS("pointer-events", "none");
  55  |   });
  56  | });
  57  | 
  58  | // ─── Suite: flujo completo ───────────────────────────────────────────────────
  59  | 
  60  | test.describe("Checkout — flujo completo de compra", () => {
  61  |   // Los tests de esta suite tardan más por las llamadas a la BD y Getnet
  62  |   test.setTimeout(60_000);
  63  | 
  64  |   test("flujo completo: producto → carrito → checkout → datos → pagar → Getnet", async ({ page }) => {
  65  |     // ── Paso 1 & 2: ir al catálogo y clickear el primer producto ─────────────
  66  |     await page.goto("/productos");
  67  | 
  68  |     const firstProduct = page.locator('article[role="link"]').first();
  69  |     await expect(firstProduct).toBeVisible({ timeout: 10_000 });
  70  |     await firstProduct.click();
  71  |     await expect(page).toHaveURL(/\/productos\/.+/);
  72  | 
  73  |     // Capturar el título para verificarlo en el carrito
  74  |     const productTitle = await page.getByRole("heading", { level: 1 }).textContent();
  75  | 
  76  |     // ── Paso 3: agregar al carrito ────────────────────────────────────────────
  77  |     const addBtn = page.getByRole("button", { name: /añadir al carrito/i });
  78  |     await expect(addBtn).toBeVisible();
  79  |     await addBtn.click();
  80  |     await expect(addBtn).toContainText(/agregado/i, { timeout: 4_000 });
  81  | 
  82  |     // ── Paso 4: ir a /carrito y verificar el producto ─────────────────────────
  83  |     await page.goto("/carrito");
  84  |     await expect(page.getByRole("heading", { name: /mi carrito/i })).toBeVisible();
  85  | 
  86  |     // Esperar que el carrito hidrate (skeleton → contenido real)
  87  |     await expect(page.getByText("Tu carrito está vacío")).not.toBeVisible({ timeout: 8_000 });
  88  | 
  89  |     // El título del producto debe aparecer en el listado del carrito
  90  |     if (productTitle?.trim()) {
  91  |       await expect(
  92  |         page.getByText(productTitle.trim(), { exact: false }).first()
  93  |       ).toBeVisible();
  94  |     }
  95  | 
  96  |     // El resumen muestra el total formateado en CLP
  97  |     await expect(page.getByText(/^\$[\d.]+/).first()).toBeVisible();
  98  | 
  99  |     // ── Paso 5: ir al checkout ────────────────────────────────────────────────
  100 |     const checkoutLink = page.getByRole("link", { name: /ir al checkout/i });
  101 |     await expect(checkoutLink).not.toHaveCSS("pointer-events", "none");
  102 |     await checkoutLink.click();
  103 |     await expect(page).toHaveURL(/\/checkout/);
  104 | 
  105 |     // Esperar que el formulario esté visible (skeleton desaparece tras hidratación)
  106 |     await expect(page.getByText("Informacion de contacto")).toBeVisible({ timeout: 10_000 });
  107 | 
  108 |     // ── Paso 6: llenar los datos del comprador ────────────────────────────────
  109 |     // Los labels están vinculados con htmlFor/id gracias al componente Input
  110 |     await page.getByLabel("Nombre").fill("Test");
  111 |     await page.getByLabel("Apellido").fill("Usuario");
  112 |     await page.getByLabel("Correo electronico").fill("test@crecerlibreria.cl");
  113 |     await page.getByLabel("Telefono").fill("912345678");
  114 | 
  115 |     // Verificar que la opción "Retiro en tienda" está disponible y seleccionada por defecto
  116 |     await expect(page.getByText("Retiro en tienda")).toBeVisible();
  117 |     await expect(page.getByText("Gratis")).toBeVisible();
  118 | 
  119 |     // Hacer click en la opción para confirmar la selección (ya es la default)
  120 |     await page.getByText("Retiro en tienda").click();
  121 | 
  122 |     // ── Paso 7: verificar que el botón de confirmar está habilitado ───────────
  123 |     // Hay dos botones "Confirmar pedido" (columna izq y aside derecho);
  124 |     // usamos el del aside derecho que es el más prominente al usuario
  125 |     const confirmBtn = page.getByRole("button", { name: /confirmar pedido/i }).last();
  126 |     await expect(confirmBtn).toBeEnabled();
  127 |     await expect(confirmBtn).not.toHaveAttribute("disabled");
  128 | 
  129 |     // También verificar el del aside lateral
  130 |     const confirmBtnSidebar = page.getByRole("button", { name: /confirmar pedido/i }).last();
  131 |     await expect(confirmBtnSidebar).toBeEnabled();
```