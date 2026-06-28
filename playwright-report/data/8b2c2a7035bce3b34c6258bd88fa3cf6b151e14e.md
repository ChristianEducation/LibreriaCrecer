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
    - generic [ref=e30]:
      - img "Al servicio de la fe, la educación y la cultura" [ref=e31]
      - generic [ref=e35]:
        - heading "Al servicio de la fe, la educación y la cultura" [level=1] [ref=e37]:
          - text: Al servicio de la fe,
          - emphasis [ref=e38]: la educación y la cultura
        - paragraph [ref=e40]: Una cuidada selección de libros y textos para el crecimiento personal y comunitario en la sociedad actual
      - link "Ver Coleccion" [ref=e43] [cursor=pointer]:
        - /url: /productos
        - text: Ver Coleccion
        - img [ref=e44]
      - generic:
        - img
    - generic [ref=e47]:
      - generic [ref=e48]:
        - paragraph [ref=e49]: SELECCIÓN ESPECIAL
        - heading "Seleccion del mes" [level=2] [ref=e51]
        - paragraph [ref=e52]: "Una selección de obras particularmente relevantes e inspiradoras: desde estudios bíblicos y devocionales hasta biografías de figuras católicas."
      - generic [ref=e55]:
        - img [ref=e56]
        - paragraph [ref=e59]: Sin selección este mes
        - paragraph [ref=e60]: Próximamente una curaduría especial de títulos seleccionados.
    - generic [ref=e62]:
      - generic [ref=e63]:
        - paragraph [ref=e64]: Explorar
        - heading "Categorías" [level=2] [ref=e66]
      - generic [ref=e68]:
        - link "Tarjetas 0 títulos" [ref=e69] [cursor=pointer]:
          - /url: /productos?cat=tarjetas
          - generic [ref=e73]:
            - paragraph [ref=e74]: Tarjetas
            - paragraph [ref=e75]: 0 títulos
        - link "Vida de Santos 10 títulos" [ref=e76] [cursor=pointer]:
          - /url: /productos?cat=vida-de-santos
          - generic [ref=e80]:
            - paragraph [ref=e81]: Vida de Santos
            - paragraph [ref=e82]: 10 títulos
        - link "Espiritualidad 275 títulos" [ref=e83] [cursor=pointer]:
          - /url: /productos?cat=espiritualidad
          - generic [ref=e87]:
            - paragraph [ref=e88]: Espiritualidad
            - paragraph [ref=e89]: 275 títulos
        - link "Eclesial 57 títulos" [ref=e90] [cursor=pointer]:
          - /url: /productos?cat=eclesial
          - generic [ref=e94]:
            - paragraph [ref=e95]: Eclesial
            - paragraph [ref=e96]: 57 títulos
        - link "Teología, filosofía, antropología 122 títulos" [ref=e97] [cursor=pointer]:
          - /url: /productos?cat=teologia-filosofia-antropologia
          - generic [ref=e101]:
            - paragraph [ref=e102]: Teología, filosofía, antropología
            - paragraph [ref=e103]: 122 títulos
        - link "Virgen María 133 títulos" [ref=e104] [cursor=pointer]:
          - /url: /productos?cat=virgen-maria
          - generic [ref=e108]:
            - paragraph [ref=e109]: Virgen María
            - paragraph [ref=e110]: 133 títulos
        - link "Pastoral y Sacramentos 115 títulos" [ref=e111] [cursor=pointer]:
          - /url: /productos?cat=pastoral-y-sacramentos
          - generic [ref=e115]:
            - paragraph [ref=e116]: Pastoral y Sacramentos
            - paragraph [ref=e117]: 115 títulos
        - link "Psicología y autoayuda 57 títulos" [ref=e118] [cursor=pointer]:
          - /url: /productos?cat=psicologia-y-autoayuda
          - generic [ref=e122]:
            - paragraph [ref=e123]: Psicología y autoayuda
            - paragraph [ref=e124]: 57 títulos
        - link "Biblia, Liturgia 105 títulos" [ref=e125] [cursor=pointer]:
          - /url: /productos?cat=biblia-liturgia
          - generic [ref=e129]:
            - paragraph [ref=e130]: Biblia, Liturgia
            - paragraph [ref=e131]: 105 títulos
        - link "Narrativa y testimonios 106 títulos" [ref=e132] [cursor=pointer]:
          - /url: /productos?cat=narrativa-y-testimonios
          - generic [ref=e136]:
            - paragraph [ref=e137]: Narrativa y testimonios
            - paragraph [ref=e138]: 106 títulos
        - link "Educación / Familia 65 títulos" [ref=e139] [cursor=pointer]:
          - /url: /productos?cat=educacion-familia
          - generic [ref=e143]:
            - paragraph [ref=e144]: Educación / Familia
            - paragraph [ref=e145]: 65 títulos
        - link "Historia 65 títulos" [ref=e146] [cursor=pointer]:
          - /url: /productos?cat=historia
          - generic [ref=e150]:
            - paragraph [ref=e151]: Historia
            - paragraph [ref=e152]: 65 títulos
        - link "Artesanía religiosa 0 títulos" [ref=e153] [cursor=pointer]:
          - /url: /productos?cat=artesania-religiosa
          - generic [ref=e157]:
            - paragraph [ref=e158]: Artesanía religiosa
            - paragraph [ref=e159]: 0 títulos
        - link "Artículos religiosos 0 títulos" [ref=e160] [cursor=pointer]:
          - /url: /productos?cat=articulos-religiosos
          - generic [ref=e164]:
            - paragraph [ref=e165]: Artículos religiosos
            - paragraph [ref=e166]: 0 títulos
    - generic [ref=e168]:
      - generic [ref=e169]:
        - generic [ref=e170]:
          - paragraph [ref=e171]: Recién llegados
          - heading "Lo último en tienda" [level=2] [ref=e173]
        - generic [ref=e174]:
          - generic [ref=e175]:
            - button "Anterior" [ref=e176] [cursor=pointer]:
              - img [ref=e177]
            - button "Siguiente" [ref=e179] [cursor=pointer]:
              - img [ref=e180]
          - link "Ver todos →" [ref=e182] [cursor=pointer]:
            - /url: /productos
      - generic [ref=e183]:
        - link "La Santa Misa Nuevo Agregar ordinario de la misa La Santa Misa $3.500" [ref=e184] [cursor=pointer]:
          - generic [ref=e185]:
            - img "La Santa Misa" [ref=e186]
            - generic [ref=e188]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e189]:
            - paragraph [ref=e190]: ordinario de la misa
            - heading "La Santa Misa" [level=3] [ref=e191]
            - paragraph [ref=e192]: $3.500
        - link "Recuerdo de mi Primera Comunión Nuevo Agregar san Pablo Recuerdo de mi Primera Comunión $12.500" [ref=e193] [cursor=pointer]:
          - generic [ref=e194]:
            - img "Recuerdo de mi Primera Comunión" [ref=e195]
            - generic [ref=e197]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e198]:
            - paragraph [ref=e199]: san Pablo
            - heading "Recuerdo de mi Primera Comunión" [level=3] [ref=e200]
            - paragraph [ref=e201]: $12.500
        - link "Para Qué Leer Nuevo Agregar Marco Antonio de la Parra Para Qué Leer $13.000" [ref=e202] [cursor=pointer]:
          - generic [ref=e203]:
            - img "Para Qué Leer" [ref=e204]
            - generic [ref=e206]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e207]:
            - paragraph [ref=e208]: Marco Antonio de la Parra
            - heading "Para Qué Leer" [level=3] [ref=e209]
            - paragraph [ref=e210]: $13.000
        - link "Bailar con el Tiempo Nuevo Agregar José María Rodríguez Olaizola, SJ Bailar con el Tiempo $22.000" [ref=e211] [cursor=pointer]:
          - generic [ref=e212]:
            - img "Bailar con el Tiempo" [ref=e213]
            - generic [ref=e215]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e216]:
            - paragraph [ref=e217]: José María Rodríguez Olaizola, SJ
            - heading "Bailar con el Tiempo" [level=3] [ref=e218]
            - paragraph [ref=e219]: $22.000
        - link "¿Por Qué Temo Decirte Quién Soy? John Powell, SJ Nuevo Agregar John Powell ¿Por Qué Temo Decirte Quién Soy? John Powell, SJ $13.000" [ref=e220] [cursor=pointer]:
          - generic [ref=e221]:
            - img "¿Por Qué Temo Decirte Quién Soy? John Powell, SJ" [ref=e222]
            - generic [ref=e224]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e225]:
            - paragraph [ref=e226]: John Powell
            - heading "¿Por Qué Temo Decirte Quién Soy? John Powell, SJ" [level=3] [ref=e227]
            - paragraph [ref=e228]: $13.000
        - link "100 Promesas de Oro para tu Vida Nuevo Agregar caja metálica ovejita 100 Promesas de Oro para tu Vida $14.900" [ref=e229] [cursor=pointer]:
          - generic [ref=e230]:
            - img "100 Promesas de Oro para tu Vida" [ref=e231]
            - generic [ref=e233]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e234]:
            - paragraph [ref=e235]: caja metálica ovejita
            - heading "100 Promesas de Oro para tu Vida" [level=3] [ref=e236]
            - paragraph [ref=e237]: $14.900
        - link "Breve Guía para Leer la Biblia Nuevo Agregar Scott Hahn Breve Guía para Leer la Biblia $16.900" [ref=e238] [cursor=pointer]:
          - generic [ref=e239]:
            - img "Breve Guía para Leer la Biblia" [ref=e240]
            - generic [ref=e242]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e243]:
            - paragraph [ref=e244]: Scott Hahn
            - heading "Breve Guía para Leer la Biblia" [level=3] [ref=e245]
            - paragraph [ref=e246]: $16.900
        - link "La Oración, Oxígeno del Creyente Nuevo Agregar Jacques Philippe La Oración, Oxígeno del Creyente $16.900" [ref=e247] [cursor=pointer]:
          - generic [ref=e248]:
            - img "La Oración, Oxígeno del Creyente" [ref=e249]
            - generic [ref=e251]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e252]:
            - paragraph [ref=e253]: Jacques Philippe
            - heading "La Oración, Oxígeno del Creyente" [level=3] [ref=e254]
            - paragraph [ref=e255]: $16.900
        - link "Adiós Tristeza Cómo Superar la Depresión según Santa Hildegarda Nuevo Agregar Adiós Tristeza Cómo Superar la Depresión según Santa Hildegarda $29.900" [ref=e256] [cursor=pointer]:
          - generic [ref=e257]:
            - img "Adiós Tristeza Cómo Superar la Depresión según Santa Hildegarda" [ref=e258]
            - generic [ref=e260]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e261]:
            - heading "Adiós Tristeza Cómo Superar la Depresión según Santa Hildegarda" [level=3] [ref=e262]
            - paragraph [ref=e263]: $29.900
        - link "La Crisis de la Iglesia en Chile; Mirar las Heridas Nuevo Agregar Sofía Brahm, Eduardo V La Crisis de la Iglesia en Chile; Mirar las Heridas $15.300" [ref=e264] [cursor=pointer]:
          - generic [ref=e265]:
            - img "La Crisis de la Iglesia en Chile; Mirar las Heridas" [ref=e266]
            - generic [ref=e268]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e269]:
            - paragraph [ref=e270]: Sofía Brahm, Eduardo V
            - heading "La Crisis de la Iglesia en Chile; Mirar las Heridas" [level=3] [ref=e271]
            - paragraph [ref=e272]: $15.300
    - generic [ref=e277]:
      - generic [ref=e278]: “
      - blockquote [ref=e279]: Creemos en libros que no solo informan, sino que acompañan. Textos que permanecen abiertos sobre la mesa, vuelven a la conversación y se convierten en hábito.
      - paragraph [ref=e280]: Crecer Librería
    - generic [ref=e281]:
      - paragraph [ref=e282]: Sé parte de nuestra comunidad
      - heading "Síguenos" [level=2] [ref=e284]
      - generic [ref=e285]:
        - generic [ref=e287]:
          - generic [ref=e290]:
            - generic [ref=e291]:
              - link "crecer.libreria" [ref=e293] [cursor=pointer]:
                - /url: https://www.instagram.com/crecer.libreria
                - img "crecer.libreria" [ref=e294]
              - link "Crecer Librería Católica" [ref=e297] [cursor=pointer]:
                - /url: https://www.instagram.com/crecer.libreria
                - generic [ref=e298]: Crecer Librería Católica
            - link "Seguir" [ref=e300] [cursor=pointer]:
              - /url: https://www.instagram.com/crecer.libreria
              - img [ref=e301]
              - generic [ref=e303]: Seguir
          - generic [ref=e307]:
            - link "Creemos que el “Encuentro” sigue siendo un acto profundamente humano. Un esp... Post with video" [ref=e309] [cursor=pointer]:
              - /url: https://www.instagram.com/p/DZ-ygbrJMwc
              - generic [ref=e311]:
                - img "Creemos que el “Encuentro” sigue siendo un acto profundamente humano. Un esp..." [ref=e312]
                - img "Post with video" [ref=e314]
            - link "📚✨✨El pasado sábado vivimos nuestro Tercer Encuentro “Diálogo, fe y cultura ... Post with multiple images" [ref=e319] [cursor=pointer]:
              - /url: https://www.instagram.com/p/DZ8QR2tgS_X
              - generic [ref=e321]:
                - img "📚✨✨El pasado sábado vivimos nuestro Tercer Encuentro “Diálogo, fe y cultura ..." [ref=e322]
                - img "Post with multiple images" [ref=e324]
            - link "✨Siempre hay algo nuevo por descubrir. 📖 Cada libro que llega a nuestra lib... Post with multiple images" [ref=e328] [cursor=pointer]:
              - /url: https://www.instagram.com/p/DZxAeBrjhgd
              - generic [ref=e330]:
                - img "✨Siempre hay algo nuevo por descubrir. 📖 Cada libro que llega a nuestra lib..." [ref=e331]
                - img "Post with multiple images" [ref=e333]
            - link "III Encuentro diálogo, fe y cultura ¡Te esperamos ! 🇨🇱Bailes religiosos d... Post with video" [ref=e337] [cursor=pointer]:
              - /url: https://www.instagram.com/p/DZq5aTZu3yP
              - generic [ref=e339]:
                - img "III Encuentro diálogo, fe y cultura ¡Te esperamos ! 🇨🇱Bailes religiosos d..." [ref=e340]
                - img "Post with video" [ref=e342]
            - link "... Post with video" [ref=e347] [cursor=pointer]:
              - /url: https://www.instagram.com/p/DZio9oYhfy_
              - generic [ref=e349]:
                - img "..." [ref=e350]
                - img "Post with video" [ref=e352]
        - link "Free Instagram Feed Widget" [ref=e356] [cursor=pointer]:
          - /url: https://elfsight.com/instagram-feed-instashow/?utm_source=websites&utm_medium=clients&utm_content=instashow&utm_term=localhost&utm_campaign=free-widget
          - img [ref=e357]
          - text: Free Instagram Feed Widget
  - contentinfo [ref=e359]:
    - generic [ref=e367]:
      - generic [ref=e368]:
        - img "Crecer Librería" [ref=e369]
        - paragraph [ref=e370]: Crecer Libreria
        - paragraph [ref=e371]: Fe, lectura y formación
        - paragraph [ref=e372]: Una librería católica pensada para acompañar el estudio, la devoción y la vida diaria con una selección curada de títulos.
      - generic [ref=e373]:
        - heading "Catálogo" [level=4] [ref=e374]
        - generic [ref=e375]:
          - link "Coleccion completa" [ref=e376] [cursor=pointer]:
            - /url: /productos
          - link "Novedades" [ref=e377] [cursor=pointer]:
            - /url: /productos?filter=nuevo
      - generic [ref=e378]:
        - heading "Información" [level=4] [ref=e379]
        - generic [ref=e380]:
          - link "Mi carrito" [ref=e381] [cursor=pointer]:
            - /url: /carrito
          - link "Checkout" [ref=e382] [cursor=pointer]:
            - /url: /checkout
      - generic [ref=e383]:
        - heading "Ubicación" [level=4] [ref=e384]
        - generic [ref=e385]:
          - img [ref=e386]
          - paragraph [ref=e389]: Arturo Prat 470 / Antofagasta, Chile
        - link "Ver en el mapa →" [ref=e390] [cursor=pointer]:
          - /url: https://maps.google.com/?q=Arturo+Prat+470+Antofagasta
    - generic [ref=e391]:
      - paragraph [ref=e392]: © 2026 Crecer Libreria. Todos los derechos reservados.
      - generic [ref=e393]:
        - paragraph [ref=e394]: "Diseño: Hultur Studios"
        - link "·" [ref=e395] [cursor=pointer]:
          - /url: /admin/login
  - button "Open Next.js Dev Tools" [ref=e401] [cursor=pointer]:
    - img [ref=e402]
  - alert [ref=e405]
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