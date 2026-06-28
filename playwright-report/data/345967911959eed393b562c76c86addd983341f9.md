# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout.spec.ts >> Checkout — carrito vacío >> navegar a /checkout con carrito vacío redirige a /carrito
- Location: tests\checkout.spec.ts:41:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/carrito/
Received string:  "http://localhost:3000/checkout"
Timeout: 8000ms

Call log:
  - Expect "toHaveURL" with timeout 8000ms
    11 × unexpected value "http://localhost:3000/checkout"

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
      - link "← Volver al carrito" [ref=e9] [cursor=pointer]:
        - /url: /carrito
  - main [ref=e10]
  - button "Open Next.js Dev Tools" [ref=e19] [cursor=pointer]:
    - img [ref=e20]
  - alert [ref=e23]
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
> 46  |     await expect(page).toHaveURL(/\/carrito/, { timeout: 8_000 });
      |                        ^ Error: expect(page).toHaveURL(expected) failed
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
  136 |     // El servidor crea la orden, luego crea la sesión de pago en Getnet TEST.
  137 |     // window.location.href redirige al checkout de Getnet.
  138 |     await expect(page).toHaveURL(/checkout\.test\.getnet\.cl/, { timeout: 30_000 });
  139 |   });
  140 | 
  141 |   test("el summary del checkout muestra los items del carrito", async ({ page }) => {
  142 |     await addFirstProductToCart(page);
  143 | 
  144 |     await page.goto("/checkout");
  145 |     await expect(page.getByText("Informacion de contacto")).toBeVisible({ timeout: 10_000 });
  146 | 
```