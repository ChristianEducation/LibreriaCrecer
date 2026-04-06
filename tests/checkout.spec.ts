/**
 * Tests E2E del flujo completo de compra
 *
 * Requisitos para correr este archivo:
 *   1. `npm run dev` corriendo en otra terminal
 *   2. BD con al menos un producto activo (`npm run seed:products`)
 *   3. Variables de entorno configuradas (.env.local)
 *      — Getnet usa credenciales TEST hardcodeadas como fallback si las env vars
 *        no están, así que el test debería funcionar sin configuración extra.
 *
 * Notas:
 *   - El test de flujo completo crea una orden REAL en la BD (estado: pending).
 *     El cron job la cancela automáticamente después de 24h.
 *   - El test verifica la redirección a Getnet TEST; no completa el pago.
 */
import { test, expect, type Page } from "@playwright/test";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Agrega el primer producto del catálogo al carrito desde su página de detalle. */
async function addFirstProductToCart(page: Page) {
  await page.goto("/productos");

  const firstProduct = page.locator('article[role="link"]').first();
  await expect(firstProduct).toBeVisible({ timeout: 10_000 });
  await firstProduct.click();

  await expect(page).toHaveURL(/\/productos\/.+/);

  const addBtn = page.getByRole("button", { name: /añadir al carrito/i });
  await expect(addBtn).toBeVisible();
  await addBtn.click();

  // Esperar confirmación visual antes de continuar
  await expect(addBtn).toContainText(/agregado/i, { timeout: 4_000 });
}

// ─── Suite: carrito vacío ────────────────────────────────────────────────────

test.describe("Checkout — carrito vacío", () => {
  test("navegar a /checkout con carrito vacío redirige a /carrito", async ({ page }) => {
    // Contexto limpio = sin items en localStorage
    await page.goto("/checkout");

    // CheckoutPage detecta items.length === 0 tras hidratación y hace router.replace
    await expect(page).toHaveURL(/\/carrito/, { timeout: 8_000 });
  });

  test("en /carrito vacío el botón Ir al checkout está deshabilitado", async ({ page }) => {
    await page.goto("/carrito");
    await expect(page.getByRole("heading", { name: /mi carrito/i })).toBeVisible();

    const checkoutLink = page.getByRole("link", { name: /ir al checkout/i });
    await expect(checkoutLink).toHaveCSS("pointer-events", "none");
  });
});

// ─── Suite: flujo completo ───────────────────────────────────────────────────

test.describe("Checkout — flujo completo de compra", () => {
  // Los tests de esta suite tardan más por las llamadas a la BD y Getnet
  test.setTimeout(60_000);

  test("flujo completo: producto → carrito → checkout → datos → pagar → Getnet", async ({ page }) => {
    // ── Paso 1 & 2: ir al catálogo y clickear el primer producto ─────────────
    await page.goto("/productos");

    const firstProduct = page.locator('article[role="link"]').first();
    await expect(firstProduct).toBeVisible({ timeout: 10_000 });
    await firstProduct.click();
    await expect(page).toHaveURL(/\/productos\/.+/);

    // Capturar el título para verificarlo en el carrito
    const productTitle = await page.getByRole("heading", { level: 1 }).textContent();

    // ── Paso 3: agregar al carrito ────────────────────────────────────────────
    const addBtn = page.getByRole("button", { name: /añadir al carrito/i });
    await expect(addBtn).toBeVisible();
    await addBtn.click();
    await expect(addBtn).toContainText(/agregado/i, { timeout: 4_000 });

    // ── Paso 4: ir a /carrito y verificar el producto ─────────────────────────
    await page.goto("/carrito");
    await expect(page.getByRole("heading", { name: /mi carrito/i })).toBeVisible();

    // Esperar que el carrito hidrate (skeleton → contenido real)
    await expect(page.getByText("Tu carrito está vacío")).not.toBeVisible({ timeout: 8_000 });

    // El título del producto debe aparecer en el listado del carrito
    if (productTitle?.trim()) {
      await expect(
        page.getByText(productTitle.trim(), { exact: false }).first()
      ).toBeVisible();
    }

    // El resumen muestra el total formateado en CLP
    await expect(page.getByText(/^\$[\d.]+/).first()).toBeVisible();

    // ── Paso 5: ir al checkout ────────────────────────────────────────────────
    const checkoutLink = page.getByRole("link", { name: /ir al checkout/i });
    await expect(checkoutLink).not.toHaveCSS("pointer-events", "none");
    await checkoutLink.click();
    await expect(page).toHaveURL(/\/checkout/);

    // Esperar que el formulario esté visible (skeleton desaparece tras hidratación)
    await expect(page.getByText("Informacion de contacto")).toBeVisible({ timeout: 10_000 });

    // ── Paso 6: llenar los datos del comprador ────────────────────────────────
    // Los labels están vinculados con htmlFor/id gracias al componente Input
    await page.getByLabel("Nombre").fill("Test");
    await page.getByLabel("Apellido").fill("Usuario");
    await page.getByLabel("Correo electronico").fill("test@crecerlibreria.cl");
    await page.getByLabel("Telefono").fill("912345678");

    // Verificar que la opción "Retiro en tienda" está disponible y seleccionada por defecto
    await expect(page.getByText("Retiro en tienda")).toBeVisible();
    await expect(page.getByText("Gratis")).toBeVisible();

    // Hacer click en la opción para confirmar la selección (ya es la default)
    await page.getByText("Retiro en tienda").click();

    // ── Paso 7: verificar que el botón de confirmar está habilitado ───────────
    // Hay dos botones "Confirmar pedido" (columna izq y aside derecho);
    // usamos el del aside derecho que es el más prominente al usuario
    const confirmBtn = page.getByRole("button", { name: /confirmar pedido/i }).last();
    await expect(confirmBtn).toBeEnabled();
    await expect(confirmBtn).not.toHaveAttribute("disabled");

    // También verificar el del aside lateral
    const confirmBtnSidebar = page.getByRole("button", { name: /confirmar pedido/i }).last();
    await expect(confirmBtnSidebar).toBeEnabled();

    // ── Paso 8 & 9: enviar el formulario y verificar redirección a Getnet ─────
    await confirmBtn.click();

    // El servidor crea la orden, luego crea la sesión de pago en Getnet TEST.
    // window.location.href redirige al checkout de Getnet.
    await expect(page).toHaveURL(/checkout\.test\.getnet\.cl/, { timeout: 30_000 });
  });

  test("el summary del checkout muestra los items del carrito", async ({ page }) => {
    await addFirstProductToCart(page);

    await page.goto("/checkout");
    await expect(page.getByText("Informacion de contacto")).toBeVisible({ timeout: 10_000 });

    // El aside "Tu pedido" muestra el subtotal
    await expect(page.getByText("Tu pedido")).toBeVisible();
    await expect(page.getByText("Subtotal")).toBeVisible();
    await expect(page.getByText(/^\$[\d.]+/).first()).toBeVisible();
  });

  test("seleccionar Despacho muestra el formulario de dirección", async ({ page }) => {
    await addFirstProductToCart(page);

    await page.goto("/checkout");
    await expect(page.getByText("Informacion de contacto")).toBeVisible({ timeout: 10_000 });

    // Hacer click en la opción de despacho
    await page.getByText("Despacho a domicilio vía Chilexpress").click();

    // Debe aparecer el formulario de dirección
    await expect(page.getByLabel("Calle")).toBeVisible();
    await expect(page.getByLabel("Numero")).toBeVisible();
    await expect(page.getByLabel("Comuna")).toBeVisible();
  });

  test("formulario incompleto no redirige a Getnet", async ({ page }) => {
    await addFirstProductToCart(page);

    await page.goto("/checkout");
    await expect(page.getByText("Informacion de contacto")).toBeVisible({ timeout: 10_000 });

    // Intentar enviar sin llenar los datos
    const confirmBtn = page.getByRole("button", { name: /confirmar pedido/i }).first();
    await confirmBtn.click();

    // Debe seguir en /checkout (validación de RHF evita el submit)
    await expect(page).toHaveURL(/\/checkout/);

    // Los campos inválidos muestran errores de validación
    await expect(page.getByText(/requerido|obligatorio|required/i).first()).toBeVisible({ timeout: 3_000 });
  });
});
