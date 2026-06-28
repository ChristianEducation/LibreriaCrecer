# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin — Autenticación >> credenciales incorrectas muestran mensaje de error
- Location: tests\admin.spec.ts:36:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('div').filter({ hasText: /invalid credentials|no se pudo|incorrecto/i }).first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('div').filter({ hasText: /invalid credentials|no se pudo|incorrecto/i }).first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - link "Volver al sitio" [ref=e5] [cursor=pointer]:
      - /url: /
    - generic [ref=e6]:
      - img "Crecer Librería" [ref=e7]
      - generic [ref=e8]:
        - heading "Ingresar" [level=1] [ref=e9]
        - paragraph [ref=e10]: Acceso restringido al equipo interno
        - generic [ref=e11]:
          - img [ref=e12]
          - generic [ref=e15]: Invalid credentials.
        - generic [ref=e16]:
          - generic [ref=e17]:
            - generic [ref=e18]: Correo Electrónico
            - generic [ref=e19]:
              - textbox "Correo Electrónico" [ref=e20]:
                - /placeholder: admin@crecerlibreria.cl
                - text: noexiste@test.com
              - generic:
                - img
          - generic [ref=e21]:
            - generic [ref=e22]: Contraseña
            - generic [ref=e23]:
              - textbox "Contraseña Mostrar contraseña" [ref=e24]:
                - /placeholder: ••••••••
                - text: contraseñaincorrecta
              - button "Mostrar contraseña" [ref=e25] [cursor=pointer]:
                - img [ref=e26]
          - generic [ref=e29]:
            - generic [ref=e30]:
              - checkbox "Recordarme" [ref=e31]
              - generic [ref=e32]: Recordarme
            - generic [ref=e33]: Acceso seguro
          - button "Ingresar" [ref=e34] [cursor=pointer]
        - paragraph [ref=e35]: Acceso seguro · SSL
  - status [ref=e38]:
    - img [ref=e39]
    - generic [ref=e42]: Invalid credentials.
    - button "Cerrar notificacion" [ref=e43]: ×
  - button "Open Next.js Dev Tools" [ref=e49] [cursor=pointer]:
    - img [ref=e50]
  - alert [ref=e53]
```

# Test source

```ts
  1  | /**
  2  |  * Tests del panel admin
  3  |  * Verifica protección de rutas, login y manejo de errores de autenticación.
  4  |  * No requiere datos en la BD para estos tests.
  5  |  */
  6  | import { test, expect } from "@playwright/test";
  7  | 
  8  | test.describe("Admin — Autenticación", () => {
  9  |   test("acceder a /admin sin sesión redirige a /admin/login", async ({ page }) => {
  10 |     await page.goto("/admin");
  11 |     await expect(page).toHaveURL(/\/admin\/login/);
  12 |   });
  13 | 
  14 |   test("acceder a /admin/pedidos sin sesión redirige a /admin/login", async ({ page }) => {
  15 |     await page.goto("/admin/pedidos");
  16 |     await expect(page).toHaveURL(/\/admin\/login/);
  17 |   });
  18 | 
  19 |   test("la página de login carga con el formulario correcto", async ({ page }) => {
  20 |     await page.goto("/admin/login");
  21 | 
  22 |     // Título de la sección
  23 |     await expect(page.getByRole("heading", { name: /ingresar/i })).toBeVisible();
  24 | 
  25 |     // Campos del formulario
  26 |     await expect(page.locator("#email")).toBeVisible();
  27 |     await expect(page.locator("#password")).toBeVisible();
  28 | 
  29 |     // Botón de submit
  30 |     await expect(page.getByRole("button", { name: /ingresar/i })).toBeVisible();
  31 | 
  32 |     // Link para volver al sitio
  33 |     await expect(page.getByRole("link", { name: /volver al sitio/i })).toBeVisible();
  34 |   });
  35 | 
  36 |   test("credenciales incorrectas muestran mensaje de error", async ({ page }) => {
  37 |     await page.goto("/admin/login");
  38 | 
  39 |     await page.locator("#email").fill("noexiste@test.com");
  40 |     await page.locator("#password").fill("contraseñaincorrecta");
  41 |     await page.getByRole("button", { name: /ingresar/i }).click();
  42 | 
  43 |     // El formulario muestra un error (el div de error aparece)
  44 |     // El API devuelve "Invalid credentials." y el form lo muestra
  45 |     await expect(
  46 |       page.locator("div").filter({ hasText: /invalid credentials|no se pudo|incorrecto/i }).first()
> 47 |     ).toBeVisible({ timeout: 10_000 });
     |       ^ Error: expect(locator).toBeVisible() failed
  48 |   });
  49 | 
  50 |   test("no se puede acceder a /admin/login si ya hay sesión activa", async ({ page, context }) => {
  51 |     // Simular un escenario sin sesión — la cookie admin-session no existe
  52 |     // Este test verifica que sin cookie, la página de login NO redirige al panel
  53 |     await context.clearCookies();
  54 |     await page.goto("/admin/login");
  55 |     await expect(page).toHaveURL(/\/admin\/login/);
  56 |     await expect(page.getByRole("heading", { name: /ingresar/i })).toBeVisible();
  57 |   });
  58 | 
  59 |   test("validación del formulario — email vacío muestra error de campo", async ({ page }) => {
  60 |     await page.goto("/admin/login");
  61 | 
  62 |     // Intentar enviar con email vacío
  63 |     await page.locator("#password").fill("alguna-clave");
  64 |     await page.getByRole("button", { name: /ingresar/i }).click();
  65 | 
  66 |     // El campo email debería mostrar error de validación (Zod/RHF)
  67 |     // O el browser valida type="email" required
  68 |     // Verificamos que NO se navega fuera de login
  69 |     await expect(page).toHaveURL(/\/admin\/login/);
  70 |   });
  71 | });
  72 | 
```