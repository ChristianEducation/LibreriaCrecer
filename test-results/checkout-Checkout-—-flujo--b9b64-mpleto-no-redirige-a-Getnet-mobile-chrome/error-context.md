# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout.spec.ts >> Checkout — flujo completo de compra >> formulario incompleto no redirige a Getnet
- Location: tests\checkout.spec.ts:168:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByRole('button', { name: /añadir al carrito/i })
Expected pattern: /agregado/i
Received string:  " Añadir al carrito"
Timeout: 4000ms

Call log:
  - Expect "toContainText" with timeout 4000ms
  - waiting for getByRole('button', { name: /añadir al carrito/i })
    2 × locator resolved to <button type="button">…</button>
      - unexpected value " Añadir al carrito"

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
        - button "Abrir carrito" [ref=e10] [cursor=pointer]:
          - img [ref=e11]
          - generic [ref=e15]: "1"
        - button "Abrir menú" [ref=e16]:
          - img [ref=e17]
  - main [ref=e19]:
    - generic [ref=e21]:
      - paragraph [ref=e22]:
        - link "Inicio" [ref=e23] [cursor=pointer]:
          - /url: /
        - generic [ref=e24]: /
        - link "Colección" [ref=e25] [cursor=pointer]:
          - /url: /productos
        - generic [ref=e26]: /
        - link "Pastoral y Sacramentos" [ref=e27] [cursor=pointer]:
          - /url: /productos?cat=pastoral-y-sacramentos
        - generic [ref=e28]: /
        - generic [ref=e29]: La Santa Misa
      - generic [ref=e30]:
        - button "La Santa Misa" [ref=e32]:
          - img "La Santa Misa" [ref=e33]
          - img [ref=e35]
        - generic [ref=e37]:
          - paragraph [ref=e38]: Pastoral y Sacramentos
          - heading "La Santa Misa" [level=1] [ref=e40]
          - paragraph [ref=e41]:
            - text: por
            - emphasis [ref=e42]: ordinario de la misa
          - paragraph [ref=e43]:
            - text: Referencia
            - strong [ref=e44]: "0802000018241"
          - generic [ref=e45]:
            - text: $3.500
            - paragraph [ref=e46]: Impuestos incluidos · Envío calculado al checkout
          - generic [ref=e48]: Contiene toda la parte común de la Santa Misa en la forma extraordinaria, o también llamada Misa tridentina junto a su traducción al español. Se trata, por tanto, de la parte de la Misa que los fieles oirán repetidamente en todas las Misas y que, por ello, conviene aprender mejor que ninguna otra, así como conocer su significado. Además enseña lo que el fiel ha de decir, su postura en cada momento, sus gestos (como los golpes de pecho, santiguarse o signarse) que hay que realizar. También los gestos que realiza el sacerdote, su volumen cambiante de voz...etc.Un Ordinario de Misa detallado para cualquiera que quiera conocer mejor y comprender esta Misa. Podríamos decir que es la descripción detallada y precisa de la mayor obra de arte divina.
          - generic [ref=e52]:
            - text: Editorial
            - strong [ref=e53]: San Pablo
          - generic [ref=e55]:
            - generic [ref=e56]:
              - button "−" [ref=e57] [cursor=pointer]
              - spinbutton [ref=e58]: "1"
              - button "+" [ref=e59] [cursor=pointer]
            - button "Añadir al carrito" [active] [ref=e60] [cursor=pointer]:
              - img [ref=e61]
              - text: Añadir al carrito
          - generic [ref=e65]:
            - generic [ref=e66]:
              - img [ref=e67]
              - text: Envío a todo Chile
            - generic [ref=e72]:
              - img [ref=e73]
              - text: Compra segura
            - generic [ref=e75]:
              - img [ref=e76]
              - text: Retiro en tienda · Antofagasta
    - generic [ref=e80]:
      - generic [ref=e81]:
        - generic [ref=e82]:
          - paragraph [ref=e83]: También podría interesarte
          - heading "Títulos relacionados" [level=2] [ref=e85]:
            - text: Títulos
            - emphasis [ref=e86]: relacionados
        - link "Ver más →" [ref=e87] [cursor=pointer]:
          - /url: /productos?cat=pastoral-y-sacramentos
      - generic [ref=e88]:
        - link "100 Promesas de Oro para tu Vida Agregar caja metálica ovejita 100 Promesas de Oro para tu Vida $14.900" [ref=e89] [cursor=pointer]:
          - generic [ref=e90]:
            - img "100 Promesas de Oro para tu Vida" [ref=e91]
            - generic:
              - button "Agregar"
          - generic [ref=e92]:
            - paragraph [ref=e93]: caja metálica ovejita
            - heading "100 Promesas de Oro para tu Vida" [level=3] [ref=e94]
            - paragraph [ref=e95]: $14.900
        - link "La Misa para los Niños Agregar Lawrence Lovasik La Misa para los Niños $16.000" [ref=e96] [cursor=pointer]:
          - generic [ref=e97]:
            - img "La Misa para los Niños" [ref=e98]
            - generic:
              - button "Agregar"
          - generic [ref=e99]:
            - paragraph [ref=e100]: Lawrence Lovasik
            - heading "La Misa para los Niños" [level=3] [ref=e101]
            - paragraph [ref=e102]: $16.000
        - link "Youcat Agregar Varios autores Youcat $18.000" [ref=e103] [cursor=pointer]:
          - generic [ref=e104]:
            - img "Youcat" [ref=e105]
            - generic:
              - button "Agregar"
          - generic [ref=e106]:
            - paragraph [ref=e107]: Varios autores
            - heading "Youcat" [level=3] [ref=e108]
            - paragraph [ref=e109]: $18.000
        - link "Youcat para la Infancia Agregar Youcat para la Infancia $18.000" [ref=e110] [cursor=pointer]:
          - generic [ref=e111]:
            - img "Youcat para la Infancia" [ref=e112]
            - generic:
              - button "Agregar"
          - generic [ref=e113]:
            - heading "Youcat para la Infancia" [level=3] [ref=e114]
            - paragraph [ref=e115]: $18.000
        - link "100 Promesas de Oro para Ti Agregar caja metalica 100 Promesas de Oro para Ti $14.900" [ref=e116] [cursor=pointer]:
          - generic [ref=e117]:
            - img "100 Promesas de Oro para Ti" [ref=e118]
            - generic:
              - button "Agregar"
          - generic [ref=e119]:
            - paragraph [ref=e120]: caja metalica
            - heading "100 Promesas de Oro para Ti" [level=3] [ref=e121]
            - paragraph [ref=e122]: $14.900
  - contentinfo [ref=e123]:
    - generic [ref=e131]:
      - generic [ref=e132]:
        - img "Crecer Librería" [ref=e133]
        - paragraph [ref=e134]: Crecer Libreria
        - paragraph [ref=e135]: Fe, lectura y formación
        - paragraph [ref=e136]: Una librería católica pensada para acompañar el estudio, la devoción y la vida diaria con una selección curada de títulos.
      - generic [ref=e137]:
        - heading "Catálogo" [level=4] [ref=e138]
        - generic [ref=e139]:
          - link "Coleccion completa" [ref=e140] [cursor=pointer]:
            - /url: /productos
          - link "Novedades" [ref=e141] [cursor=pointer]:
            - /url: /productos?filter=nuevo
      - generic [ref=e142]:
        - heading "Información" [level=4] [ref=e143]
        - generic [ref=e144]:
          - link "Mi carrito" [ref=e145] [cursor=pointer]:
            - /url: /carrito
          - link "Checkout" [ref=e146] [cursor=pointer]:
            - /url: /checkout
      - generic [ref=e147]:
        - heading "Ubicación" [level=4] [ref=e148]
        - generic [ref=e149]:
          - img [ref=e150]
          - paragraph [ref=e153]: Arturo Prat 470 / Antofagasta, Chile
        - link "Ver en el mapa →" [ref=e154] [cursor=pointer]:
          - /url: https://maps.google.com/?q=Arturo+Prat+470+Antofagasta
    - generic [ref=e155]:
      - paragraph [ref=e156]: © 2026 Crecer Libreria. Todos los derechos reservados.
      - generic [ref=e157]:
        - paragraph [ref=e158]: "Diseño: Hultur Studios"
        - link "·" [ref=e159] [cursor=pointer]:
          - /url: /admin/login
  - link "Ver carrito (1 producto)" [ref=e160] [cursor=pointer]:
    - /url: /carrito
    - img [ref=e161]
    - generic [ref=e164]: "1"
  - button "Open Next.js Dev Tools" [ref=e170] [cursor=pointer]:
    - img [ref=e171]
  - alert [ref=e174]
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
  31  |   await expect(addBtn).toBeVisible();
  32  |   await addBtn.click();
  33  | 
  34  |   // Esperar confirmación visual antes de continuar
> 35  |   await expect(addBtn).toContainText(/agregado/i, { timeout: 4_000 });
      |                        ^ Error: expect(locator).toContainText(expected) failed
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
  132 | 
  133 |     // ── Paso 8 & 9: enviar el formulario y verificar redirección a Getnet ─────
  134 |     await confirmBtn.click();
  135 | 
```