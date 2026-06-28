# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home.spec.ts >> Home >> muestra el hero con slider
- Location: tests\home.spec.ts:17:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.hero-wrapper')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.hero-wrapper')

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
      - img "Al servicio de la fe, la educación y la cultura" [ref=e21]
      - generic [ref=e25]:
        - heading "Al servicio de la fe, la educación y la cultura" [level=1] [ref=e27]:
          - text: Al servicio de la fe,
          - emphasis [ref=e28]: la educación y la cultura
        - paragraph [ref=e30]: Una cuidada selección de libros y textos para el crecimiento personal y comunitario en la sociedad actual
      - link "Ver Coleccion" [ref=e33] [cursor=pointer]:
        - /url: /productos
        - text: Ver Coleccion
        - img [ref=e34]
      - generic:
        - img
    - generic [ref=e37]:
      - generic [ref=e38]:
        - paragraph [ref=e39]: SELECCIÓN ESPECIAL
        - heading "Seleccion del mes" [level=2] [ref=e41]
        - paragraph [ref=e42]: "Una selección de obras particularmente relevantes e inspiradoras: desde estudios bíblicos y devocionales hasta biografías de figuras católicas."
      - generic [ref=e45]:
        - img [ref=e46]
        - paragraph [ref=e49]: Sin selección este mes
        - paragraph [ref=e50]: Próximamente una curaduría especial de títulos seleccionados.
    - generic [ref=e52]:
      - generic [ref=e53]:
        - paragraph [ref=e54]: Explorar
        - heading "Categorías" [level=2] [ref=e56]
      - generic [ref=e58]:
        - link "Tarjetas 0 títulos" [ref=e59] [cursor=pointer]:
          - /url: /productos?cat=tarjetas
          - generic [ref=e63]:
            - paragraph [ref=e64]: Tarjetas
            - paragraph [ref=e65]: 0 títulos
        - link "Vida de Santos 10 títulos" [ref=e66] [cursor=pointer]:
          - /url: /productos?cat=vida-de-santos
          - generic [ref=e70]:
            - paragraph [ref=e71]: Vida de Santos
            - paragraph [ref=e72]: 10 títulos
        - link "Espiritualidad 275 títulos" [ref=e73] [cursor=pointer]:
          - /url: /productos?cat=espiritualidad
          - generic [ref=e77]:
            - paragraph [ref=e78]: Espiritualidad
            - paragraph [ref=e79]: 275 títulos
        - link "Eclesial 57 títulos" [ref=e80] [cursor=pointer]:
          - /url: /productos?cat=eclesial
          - generic [ref=e84]:
            - paragraph [ref=e85]: Eclesial
            - paragraph [ref=e86]: 57 títulos
        - link "Teología, filosofía, antropología 122 títulos" [ref=e87] [cursor=pointer]:
          - /url: /productos?cat=teologia-filosofia-antropologia
          - generic [ref=e91]:
            - paragraph [ref=e92]: Teología, filosofía, antropología
            - paragraph [ref=e93]: 122 títulos
        - link "Virgen María 133 títulos" [ref=e94] [cursor=pointer]:
          - /url: /productos?cat=virgen-maria
          - generic [ref=e98]:
            - paragraph [ref=e99]: Virgen María
            - paragraph [ref=e100]: 133 títulos
        - link "Pastoral y Sacramentos 115 títulos" [ref=e101] [cursor=pointer]:
          - /url: /productos?cat=pastoral-y-sacramentos
          - generic [ref=e105]:
            - paragraph [ref=e106]: Pastoral y Sacramentos
            - paragraph [ref=e107]: 115 títulos
        - link "Psicología y autoayuda 57 títulos" [ref=e108] [cursor=pointer]:
          - /url: /productos?cat=psicologia-y-autoayuda
          - generic [ref=e112]:
            - paragraph [ref=e113]: Psicología y autoayuda
            - paragraph [ref=e114]: 57 títulos
        - link "Biblia, Liturgia 105 títulos" [ref=e115] [cursor=pointer]:
          - /url: /productos?cat=biblia-liturgia
          - generic [ref=e119]:
            - paragraph [ref=e120]: Biblia, Liturgia
            - paragraph [ref=e121]: 105 títulos
        - link "Narrativa y testimonios 106 títulos" [ref=e122] [cursor=pointer]:
          - /url: /productos?cat=narrativa-y-testimonios
          - generic [ref=e126]:
            - paragraph [ref=e127]: Narrativa y testimonios
            - paragraph [ref=e128]: 106 títulos
        - link "Educación / Familia 65 títulos" [ref=e129] [cursor=pointer]:
          - /url: /productos?cat=educacion-familia
          - generic [ref=e133]:
            - paragraph [ref=e134]: Educación / Familia
            - paragraph [ref=e135]: 65 títulos
        - link "Historia 65 títulos" [ref=e136] [cursor=pointer]:
          - /url: /productos?cat=historia
          - generic [ref=e140]:
            - paragraph [ref=e141]: Historia
            - paragraph [ref=e142]: 65 títulos
        - link "Artesanía religiosa 0 títulos" [ref=e143] [cursor=pointer]:
          - /url: /productos?cat=artesania-religiosa
          - generic [ref=e147]:
            - paragraph [ref=e148]: Artesanía religiosa
            - paragraph [ref=e149]: 0 títulos
        - link "Artículos religiosos 0 títulos" [ref=e150] [cursor=pointer]:
          - /url: /productos?cat=articulos-religiosos
          - generic [ref=e154]:
            - paragraph [ref=e155]: Artículos religiosos
            - paragraph [ref=e156]: 0 títulos
    - generic [ref=e158]:
      - generic [ref=e159]:
        - generic [ref=e160]:
          - paragraph [ref=e161]: Recién llegados
          - heading "Lo último en tienda" [level=2] [ref=e163]
        - link "Ver todos →" [ref=e165] [cursor=pointer]:
          - /url: /productos
      - generic [ref=e166]:
        - link "La Santa Misa Nuevo Agregar ordinario de la misa La Santa Misa $3.500" [ref=e167] [cursor=pointer]:
          - generic [ref=e168]:
            - img "La Santa Misa" [ref=e169]
            - generic [ref=e171]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e172]:
            - paragraph [ref=e173]: ordinario de la misa
            - heading "La Santa Misa" [level=3] [ref=e174]
            - paragraph [ref=e175]: $3.500
        - link "Recuerdo de mi Primera Comunión Nuevo Agregar san Pablo Recuerdo de mi Primera Comunión $12.500" [ref=e176] [cursor=pointer]:
          - generic [ref=e177]:
            - img "Recuerdo de mi Primera Comunión" [ref=e178]
            - generic [ref=e180]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e181]:
            - paragraph [ref=e182]: san Pablo
            - heading "Recuerdo de mi Primera Comunión" [level=3] [ref=e183]
            - paragraph [ref=e184]: $12.500
        - link "Para Qué Leer Nuevo Agregar Marco Antonio de la Parra Para Qué Leer $13.000" [ref=e185] [cursor=pointer]:
          - generic [ref=e186]:
            - img "Para Qué Leer" [ref=e187]
            - generic [ref=e189]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e190]:
            - paragraph [ref=e191]: Marco Antonio de la Parra
            - heading "Para Qué Leer" [level=3] [ref=e192]
            - paragraph [ref=e193]: $13.000
        - link "Bailar con el Tiempo Nuevo Agregar José María Rodríguez Olaizola, SJ Bailar con el Tiempo $22.000" [ref=e194] [cursor=pointer]:
          - generic [ref=e195]:
            - img "Bailar con el Tiempo" [ref=e196]
            - generic [ref=e198]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e199]:
            - paragraph [ref=e200]: José María Rodríguez Olaizola, SJ
            - heading "Bailar con el Tiempo" [level=3] [ref=e201]
            - paragraph [ref=e202]: $22.000
        - link "¿Por Qué Temo Decirte Quién Soy? John Powell, SJ Nuevo Agregar John Powell ¿Por Qué Temo Decirte Quién Soy? John Powell, SJ $13.000" [ref=e203] [cursor=pointer]:
          - generic [ref=e204]:
            - img "¿Por Qué Temo Decirte Quién Soy? John Powell, SJ" [ref=e205]
            - generic [ref=e207]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e208]:
            - paragraph [ref=e209]: John Powell
            - heading "¿Por Qué Temo Decirte Quién Soy? John Powell, SJ" [level=3] [ref=e210]
            - paragraph [ref=e211]: $13.000
        - link "100 Promesas de Oro para tu Vida Nuevo Agregar caja metálica ovejita 100 Promesas de Oro para tu Vida $14.900" [ref=e212] [cursor=pointer]:
          - generic [ref=e213]:
            - img "100 Promesas de Oro para tu Vida" [ref=e214]
            - generic [ref=e216]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e217]:
            - paragraph [ref=e218]: caja metálica ovejita
            - heading "100 Promesas de Oro para tu Vida" [level=3] [ref=e219]
            - paragraph [ref=e220]: $14.900
        - link "Breve Guía para Leer la Biblia Nuevo Agregar Scott Hahn Breve Guía para Leer la Biblia $16.900" [ref=e221] [cursor=pointer]:
          - generic [ref=e222]:
            - img "Breve Guía para Leer la Biblia" [ref=e223]
            - generic [ref=e225]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e226]:
            - paragraph [ref=e227]: Scott Hahn
            - heading "Breve Guía para Leer la Biblia" [level=3] [ref=e228]
            - paragraph [ref=e229]: $16.900
        - link "La Oración, Oxígeno del Creyente Nuevo Agregar Jacques Philippe La Oración, Oxígeno del Creyente $16.900" [ref=e230] [cursor=pointer]:
          - generic [ref=e231]:
            - img "La Oración, Oxígeno del Creyente" [ref=e232]
            - generic [ref=e234]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e235]:
            - paragraph [ref=e236]: Jacques Philippe
            - heading "La Oración, Oxígeno del Creyente" [level=3] [ref=e237]
            - paragraph [ref=e238]: $16.900
        - link "Adiós Tristeza Cómo Superar la Depresión según Santa Hildegarda Nuevo Agregar Adiós Tristeza Cómo Superar la Depresión según Santa Hildegarda $29.900" [ref=e239] [cursor=pointer]:
          - generic [ref=e240]:
            - img "Adiós Tristeza Cómo Superar la Depresión según Santa Hildegarda" [ref=e241]
            - generic [ref=e243]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e244]:
            - heading "Adiós Tristeza Cómo Superar la Depresión según Santa Hildegarda" [level=3] [ref=e245]
            - paragraph [ref=e246]: $29.900
        - link "La Crisis de la Iglesia en Chile; Mirar las Heridas Nuevo Agregar Sofía Brahm, Eduardo V La Crisis de la Iglesia en Chile; Mirar las Heridas $15.300" [ref=e247] [cursor=pointer]:
          - generic [ref=e248]:
            - img "La Crisis de la Iglesia en Chile; Mirar las Heridas" [ref=e249]
            - generic [ref=e251]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e252]:
            - paragraph [ref=e253]: Sofía Brahm, Eduardo V
            - heading "La Crisis de la Iglesia en Chile; Mirar las Heridas" [level=3] [ref=e254]
            - paragraph [ref=e255]: $15.300
    - generic [ref=e260]:
      - generic [ref=e261]: “
      - blockquote [ref=e262]: Creemos en libros que no solo informan, sino que acompañan. Textos que permanecen abiertos sobre la mesa, vuelven a la conversación y se convierten en hábito.
      - paragraph [ref=e263]: Crecer Librería
    - generic [ref=e264]:
      - paragraph [ref=e265]: Sé parte de nuestra comunidad
      - heading "Síguenos" [level=2] [ref=e267]
      - generic [ref=e268]:
        - generic [ref=e270]:
          - generic [ref=e273]:
            - generic [ref=e274]:
              - link "crecer.libreria" [ref=e276] [cursor=pointer]:
                - /url: https://www.instagram.com/crecer.libreria
                - img "crecer.libreria" [ref=e277]
              - link "Crecer Librería Católica" [ref=e280] [cursor=pointer]:
                - /url: https://www.instagram.com/crecer.libreria
                - generic [ref=e281]: Crecer Librería Católica
            - link "Seguir" [ref=e283] [cursor=pointer]:
              - /url: https://www.instagram.com/crecer.libreria
              - img [ref=e284]
              - generic [ref=e286]: Seguir
          - generic [ref=e290]:
            - link "Creemos que el “Encuentro” sigue siendo un acto profundamente humano. Un esp... Post with video" [ref=e292] [cursor=pointer]:
              - /url: https://www.instagram.com/p/DZ-ygbrJMwc
              - generic [ref=e294]:
                - img "Creemos que el “Encuentro” sigue siendo un acto profundamente humano. Un esp..." [ref=e295]
                - img "Post with video" [ref=e297]
            - link "📚✨✨El pasado sábado vivimos nuestro Tercer Encuentro “Diálogo, fe y cultura ... Post with multiple images" [ref=e302] [cursor=pointer]:
              - /url: https://www.instagram.com/p/DZ8QR2tgS_X
              - generic [ref=e304]:
                - img "📚✨✨El pasado sábado vivimos nuestro Tercer Encuentro “Diálogo, fe y cultura ..." [ref=e305]
                - img "Post with multiple images" [ref=e307]
            - link "✨Siempre hay algo nuevo por descubrir. 📖 Cada libro que llega a nuestra lib... Post with multiple images" [ref=e311] [cursor=pointer]:
              - /url: https://www.instagram.com/p/DZxAeBrjhgd
              - generic [ref=e313]:
                - img "✨Siempre hay algo nuevo por descubrir. 📖 Cada libro que llega a nuestra lib..." [ref=e314]
                - img "Post with multiple images" [ref=e316]
            - link "III Encuentro diálogo, fe y cultura ¡Te esperamos ! 🇨🇱Bailes religiosos d... Post with video" [ref=e320] [cursor=pointer]:
              - /url: https://www.instagram.com/p/DZq5aTZu3yP
              - generic [ref=e322]:
                - img "III Encuentro diálogo, fe y cultura ¡Te esperamos ! 🇨🇱Bailes religiosos d..." [ref=e323]
                - img "Post with video" [ref=e325]
            - link "... Post with video" [ref=e330] [cursor=pointer]:
              - /url: https://www.instagram.com/p/DZio9oYhfy_
              - generic [ref=e332]:
                - img "..." [ref=e333]
                - img "Post with video" [ref=e335]
            - link "En la era de la inteligencia artificial, el papa León XIV alza una voz clara ..." [ref=e340] [cursor=pointer]:
              - /url: https://www.instagram.com/p/DZaMqNwu__H
              - img "En la era de la inteligencia artificial, el papa León XIV alza una voz clara ..." [ref=e343]
        - link "Free Instagram Feed Widget" [ref=e344] [cursor=pointer]:
          - /url: https://elfsight.com/instagram-feed-instashow/?utm_source=websites&utm_medium=clients&utm_content=instashow&utm_term=localhost&utm_campaign=free-widget
          - img [ref=e345]
          - text: Free Instagram Feed Widget
  - contentinfo [ref=e347]:
    - generic [ref=e355]:
      - generic [ref=e356]:
        - img "Crecer Librería" [ref=e357]
        - paragraph [ref=e358]: Crecer Libreria
        - paragraph [ref=e359]: Fe, lectura y formación
        - paragraph [ref=e360]: Una librería católica pensada para acompañar el estudio, la devoción y la vida diaria con una selección curada de títulos.
      - generic [ref=e361]:
        - heading "Catálogo" [level=4] [ref=e362]
        - generic [ref=e363]:
          - link "Coleccion completa" [ref=e364] [cursor=pointer]:
            - /url: /productos
          - link "Novedades" [ref=e365] [cursor=pointer]:
            - /url: /productos?filter=nuevo
      - generic [ref=e366]:
        - heading "Información" [level=4] [ref=e367]
        - generic [ref=e368]:
          - link "Mi carrito" [ref=e369] [cursor=pointer]:
            - /url: /carrito
          - link "Checkout" [ref=e370] [cursor=pointer]:
            - /url: /checkout
      - generic [ref=e371]:
        - heading "Ubicación" [level=4] [ref=e372]
        - generic [ref=e373]:
          - img [ref=e374]
          - paragraph [ref=e377]: Arturo Prat 470 / Antofagasta, Chile
        - link "Ver en el mapa →" [ref=e378] [cursor=pointer]:
          - /url: https://maps.google.com/?q=Arturo+Prat+470+Antofagasta
    - generic [ref=e379]:
      - paragraph [ref=e380]: © 2026 Crecer Libreria. Todos los derechos reservados.
      - generic [ref=e381]:
        - paragraph [ref=e382]: "Diseño: Hultur Studios"
        - link "·" [ref=e383] [cursor=pointer]:
          - /url: /admin/login
  - button "Open Next.js Dev Tools" [ref=e389] [cursor=pointer]:
    - img [ref=e390]
  - alert [ref=e393]
```

# Test source

```ts
  1  | /**
  2  |  * Tests del Home (/)
  3  |  * Verifica que la página principal carga con los elementos estructurales esperados.
  4  |  */
  5  | import { test, expect } from "@playwright/test";
  6  | 
  7  | test.describe("Home", () => {
  8  |   test.beforeEach(async ({ page }) => {
  9  |     await page.goto("/");
  10 |   });
  11 | 
  12 |   test("carga sin errores y muestra la navbar con el logo", async ({ page }) => {
  13 |     await expect(page.getByText("Crecer Libreria").first()).toBeVisible();
  14 |     await expect(page.getByText("Libreria cristiana").first()).toBeVisible();
  15 |   });
  16 | 
  17 |   test("muestra el hero con slider", async ({ page }) => {
  18 |     const hero = page.locator(".hero-wrapper");
> 19 |     await expect(hero).toBeVisible();
     |                        ^ Error: expect(locator).toBeVisible() failed
  20 |   });
  21 | 
  22 |   test("muestra la sección Libros del mes", async ({ page }) => {
  23 |     const section = page.locator("#libros-mes");
  24 |     await section.scrollIntoViewIfNeeded();
  25 |     await expect(section).toBeVisible();
  26 |   });
  27 | 
  28 |   test("muestra la sección Recién llegados", async ({ page }) => {
  29 |     const section = page.locator("#recien-llegados");
  30 |     await section.scrollIntoViewIfNeeded();
  31 |     await expect(section).toBeVisible();
  32 |   });
  33 | 
  34 |   test("muestra el footer", async ({ page }) => {
  35 |     const footer = page.locator("footer");
  36 |     await footer.scrollIntoViewIfNeeded();
  37 |     await expect(footer).toBeVisible();
  38 |     await expect(footer.getByText("Crecer Libreria").first()).toBeVisible();
  39 |   });
  40 | 
  41 |   test("link Colección navega a /productos", async ({ page }) => {
  42 |     // Buscar en el nav desktop (visible en viewport ancho)
  43 |     await page.getByRole("link", { name: "Colección" }).first().click();
  44 |     await expect(page).toHaveURL(/\/productos/);
  45 |   });
  46 | });
  47 | 
```