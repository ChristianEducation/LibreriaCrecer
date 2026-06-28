# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: carrito.spec.ts >> Carrito >> agregar un producto desde el detalle lo muestra en el carrito
- Location: tests\carrito.spec.ts:28:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/productos\/.+/
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
        - button "Abrir carrito" [ref=e10] [cursor=pointer]:
          - img [ref=e11]
        - button "Abrir menú" [ref=e15]:
          - img [ref=e16]
  - main [ref=e18]:
    - generic [ref=e20]:
      - generic [ref=e21]:
        - link "Inicio" [ref=e22] [cursor=pointer]:
          - /url: /
        - generic [ref=e23]: /
        - link "Colección" [ref=e24] [cursor=pointer]:
          - /url: /productos
      - heading "Nuestra colección" [level=1] [ref=e25]:
        - text: Nuestra
        - emphasis [ref=e26]: colección
      - paragraph [ref=e27]: Libros, biblias y artículos religiosos para el crecimiento espiritual.
    - generic [ref=e28]:
      - generic [ref=e29]:
        - button "Buscar" [ref=e30]:
          - img [ref=e31]
        - button "Categoría" [ref=e36]:
          - generic [ref=e37]: Categoría
          - img [ref=e38]
        - button "Filtro" [ref=e41]:
          - generic [ref=e42]: Filtro
          - img [ref=e43]
        - button "Recientes" [ref=e46]:
          - generic [ref=e47]: Recientes
          - img [ref=e48]
        - generic [ref=e51]: "890"
      - generic [ref=e52]:
        - searchbox "Título, autor..." [ref=e54]
        - button "Buscar" [ref=e55] [cursor=pointer]:
          - img [ref=e56]
    - generic [ref=e61]:
      - generic [ref=e62]:
        - link "La Santa Misa Nuevo Agregar ordinario de la misa La Santa Misa $3.500" [active] [ref=e63] [cursor=pointer]:
          - generic [ref=e64]:
            - img "La Santa Misa" [ref=e65]
            - generic [ref=e67]: Nuevo
            - button "Agregar" [ref=e69]
          - generic [ref=e70]:
            - paragraph [ref=e71]: ordinario de la misa
            - heading "La Santa Misa" [level=3] [ref=e72]
            - paragraph [ref=e73]: $3.500
        - link "Recuerdo de mi Primera Comunión Nuevo Agregar san Pablo Recuerdo de mi Primera Comunión $12.500" [ref=e74] [cursor=pointer]:
          - generic [ref=e75]:
            - img "Recuerdo de mi Primera Comunión" [ref=e76]
            - generic [ref=e78]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e79]:
            - paragraph [ref=e80]: san Pablo
            - heading "Recuerdo de mi Primera Comunión" [level=3] [ref=e81]
            - paragraph [ref=e82]: $12.500
        - link "Para Qué Leer Nuevo Últimas unidades Agregar Marco Antonio de la Parra Para Qué Leer $13.000" [ref=e83] [cursor=pointer]:
          - generic [ref=e84]:
            - img "Para Qué Leer" [ref=e85]
            - generic [ref=e86]:
              - generic [ref=e87]: Nuevo
              - generic [ref=e88]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e89]:
            - paragraph [ref=e90]: Marco Antonio de la Parra
            - heading "Para Qué Leer" [level=3] [ref=e91]
            - paragraph [ref=e92]: $13.000
        - link "Bailar con el Tiempo Nuevo Agregar José María Rodríguez Olaizola, SJ Bailar con el Tiempo $22.000" [ref=e93] [cursor=pointer]:
          - generic [ref=e94]:
            - img "Bailar con el Tiempo" [ref=e95]
            - generic [ref=e97]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e98]:
            - paragraph [ref=e99]: José María Rodríguez Olaizola, SJ
            - heading "Bailar con el Tiempo" [level=3] [ref=e100]
            - paragraph [ref=e101]: $22.000
        - link "¿Por Qué Temo Decirte Quién Soy? John Powell, SJ Nuevo Últimas unidades Agregar John Powell ¿Por Qué Temo Decirte Quién Soy? John Powell, SJ $13.000" [ref=e102] [cursor=pointer]:
          - generic [ref=e103]:
            - img "¿Por Qué Temo Decirte Quién Soy? John Powell, SJ" [ref=e104]
            - generic [ref=e105]:
              - generic [ref=e106]: Nuevo
              - generic [ref=e107]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e108]:
            - paragraph [ref=e109]: John Powell
            - heading "¿Por Qué Temo Decirte Quién Soy? John Powell, SJ" [level=3] [ref=e110]
            - paragraph [ref=e111]: $13.000
        - link "100 Promesas de Oro para tu Vida Nuevo Últimas unidades Agregar caja metálica ovejita 100 Promesas de Oro para tu Vida $14.900" [ref=e112] [cursor=pointer]:
          - generic [ref=e113]:
            - img "100 Promesas de Oro para tu Vida" [ref=e114]
            - generic [ref=e115]:
              - generic [ref=e116]: Nuevo
              - generic [ref=e117]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e118]:
            - paragraph [ref=e119]: caja metálica ovejita
            - heading "100 Promesas de Oro para tu Vida" [level=3] [ref=e120]
            - paragraph [ref=e121]: $14.900
        - link "Breve Guía para Leer la Biblia Nuevo Últimas unidades Agregar Scott Hahn Breve Guía para Leer la Biblia $16.900" [ref=e122] [cursor=pointer]:
          - generic [ref=e123]:
            - img "Breve Guía para Leer la Biblia" [ref=e124]
            - generic [ref=e125]:
              - generic [ref=e126]: Nuevo
              - generic [ref=e127]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e128]:
            - paragraph [ref=e129]: Scott Hahn
            - heading "Breve Guía para Leer la Biblia" [level=3] [ref=e130]
            - paragraph [ref=e131]: $16.900
        - link "La Oración, Oxígeno del Creyente Nuevo Últimas unidades Agregar Jacques Philippe La Oración, Oxígeno del Creyente $16.900" [ref=e132] [cursor=pointer]:
          - generic [ref=e133]:
            - img "La Oración, Oxígeno del Creyente" [ref=e134]
            - generic [ref=e135]:
              - generic [ref=e136]: Nuevo
              - generic [ref=e137]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e138]:
            - paragraph [ref=e139]: Jacques Philippe
            - heading "La Oración, Oxígeno del Creyente" [level=3] [ref=e140]
            - paragraph [ref=e141]: $16.900
        - link "Adiós Tristeza Cómo Superar la Depresión según Santa Hildegarda Nuevo Últimas unidades Agregar Adiós Tristeza Cómo Superar la Depresión según Santa Hildegarda $29.900" [ref=e142] [cursor=pointer]:
          - generic [ref=e143]:
            - img "Adiós Tristeza Cómo Superar la Depresión según Santa Hildegarda" [ref=e144]
            - generic [ref=e145]:
              - generic [ref=e146]: Nuevo
              - generic [ref=e147]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e148]:
            - heading "Adiós Tristeza Cómo Superar la Depresión según Santa Hildegarda" [level=3] [ref=e149]
            - paragraph [ref=e150]: $29.900
        - link "Espiritualidad, para que mi Vida Tenga Sentido Nuevo Últimas unidades Agregar Anselm Grun Espiritualidad, para que mi Vida Tenga Sentido $12.900" [ref=e151] [cursor=pointer]:
          - generic [ref=e152]:
            - img "Espiritualidad, para que mi Vida Tenga Sentido" [ref=e153]
            - generic [ref=e154]:
              - generic [ref=e155]: Nuevo
              - generic [ref=e156]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e157]:
            - paragraph [ref=e158]: Anselm Grun
            - heading "Espiritualidad, para que mi Vida Tenga Sentido" [level=3] [ref=e159]
            - paragraph [ref=e160]: $12.900
        - link "Abuelo ¿Cuál Es tu Historia? Un Diario Guiado para que tu Abuelo Comparta Nuevo Últimas unidades Agregar Abuelo ¿Cuál Es tu Historia? Un Diario Guiado para que tu Abuelo Comparta $20.000" [ref=e161] [cursor=pointer]:
          - generic [ref=e162]:
            - img "Abuelo ¿Cuál Es tu Historia? Un Diario Guiado para que tu Abuelo Comparta" [ref=e163]
            - generic [ref=e164]:
              - generic [ref=e165]: Nuevo
              - generic [ref=e166]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e167]:
            - heading "Abuelo ¿Cuál Es tu Historia? Un Diario Guiado para que tu Abuelo Comparta" [level=3] [ref=e168]
            - paragraph [ref=e169]: $20.000
        - link "¿Hay Razones para Creer en Jesús? Nuevo Últimas unidades Agregar Sergio Silva Gatica ¿Hay Razones para Creer en Jesús? $16.000" [ref=e170] [cursor=pointer]:
          - generic [ref=e171]:
            - img "¿Hay Razones para Creer en Jesús?" [ref=e172]
            - generic [ref=e173]:
              - generic [ref=e174]: Nuevo
              - generic [ref=e175]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e176]:
            - paragraph [ref=e177]: Sergio Silva Gatica
            - heading "¿Hay Razones para Creer en Jesús?" [level=3] [ref=e178]
            - paragraph [ref=e179]: $16.000
        - link "La Pasión de Cristo Nuevo Últimas unidades Agregar José Miguel Ibáñez Langlois La Pasión de Cristo $17.900" [ref=e180] [cursor=pointer]:
          - generic [ref=e181]:
            - img "La Pasión de Cristo" [ref=e182]
            - generic [ref=e183]:
              - generic [ref=e184]: Nuevo
              - generic [ref=e185]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e186]:
            - paragraph [ref=e187]: José Miguel Ibáñez Langlois
            - heading "La Pasión de Cristo" [level=3] [ref=e188]
            - paragraph [ref=e189]: $17.900
        - link "Marco - Aparición de Nuestra Señora de Lourdes Nuevo Últimas unidades Agregar Marco - Aparición de Nuestra Señora de Lourdes $15.000" [ref=e190] [cursor=pointer]:
          - generic [ref=e191]:
            - img "Marco - Aparición de Nuestra Señora de Lourdes" [ref=e192]
            - generic [ref=e193]:
              - generic [ref=e194]: Nuevo
              - generic [ref=e195]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e196]:
            - heading "Marco - Aparición de Nuestra Señora de Lourdes" [level=3] [ref=e197]
            - paragraph [ref=e198]: $15.000
        - link "Pieza Magnética - Virgen de la Ternura Nuevo Últimas unidades Agregar Pieza Magnética - Virgen de la Ternura $7.990" [ref=e199] [cursor=pointer]:
          - generic [ref=e200]:
            - img "Pieza Magnética - Virgen de la Ternura" [ref=e201]
            - generic [ref=e202]:
              - generic [ref=e203]: Nuevo
              - generic [ref=e204]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e205]:
            - heading "Pieza Magnética - Virgen de la Ternura" [level=3] [ref=e206]
            - paragraph [ref=e207]: $7.990
        - link "Perspectivas Teológico Pastorales Chilenas; Iglesia Sinodal Nuevo Últimas unidades Agregar José Ignacio F Perspectivas Teológico Pastorales Chilenas; Iglesia Sinodal $8.000" [ref=e208] [cursor=pointer]:
          - generic [ref=e209]:
            - img "Perspectivas Teológico Pastorales Chilenas; Iglesia Sinodal" [ref=e210]
            - generic [ref=e211]:
              - generic [ref=e212]: Nuevo
              - generic [ref=e213]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e214]:
            - paragraph [ref=e215]: José Ignacio F
            - heading "Perspectivas Teológico Pastorales Chilenas; Iglesia Sinodal" [level=3] [ref=e216]
            - paragraph [ref=e217]: $8.000
        - link "Derecho Eclesiástico del Estado de Chile Nuevo Últimas unidades Agregar Jorge Precht Pizarro Derecho Eclesiástico del Estado de Chile $16.000" [ref=e218] [cursor=pointer]:
          - generic [ref=e219]:
            - img "Derecho Eclesiástico del Estado de Chile" [ref=e220]
            - generic [ref=e221]:
              - generic [ref=e222]: Nuevo
              - generic [ref=e223]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e224]:
            - paragraph [ref=e225]: Jorge Precht Pizarro
            - heading "Derecho Eclesiástico del Estado de Chile" [level=3] [ref=e226]
            - paragraph [ref=e227]: $16.000
        - link "Antonio Rendic, Itinerario Espiritual de un Poeta Nuevo Agregar Eva Reyes Gacitúa Antonio Rendic, Itinerario Espiritual de un Poeta $15.000" [ref=e228] [cursor=pointer]:
          - generic [ref=e229]:
            - img "Antonio Rendic, Itinerario Espiritual de un Poeta" [ref=e230]
            - generic [ref=e232]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e233]:
            - paragraph [ref=e234]: Eva Reyes Gacitúa
            - heading "Antonio Rendic, Itinerario Espiritual de un Poeta" [level=3] [ref=e235]
            - paragraph [ref=e236]: $15.000
        - link "Antropologia del Dolor Nuevo Últimas unidades Agregar DAVID LE BRETON Antropologia del Dolor $24.000" [ref=e237] [cursor=pointer]:
          - generic [ref=e238]:
            - img "Antropologia del Dolor" [ref=e239]
            - generic [ref=e240]:
              - generic [ref=e241]: Nuevo
              - generic [ref=e242]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e243]:
            - paragraph [ref=e244]: DAVID LE BRETON
            - heading "Antropologia del Dolor" [level=3] [ref=e245]
            - paragraph [ref=e246]: $24.000
        - link "Héroes de Babilonia - Pequeños Héroes de la Biblia Nuevo Últimas unidades Agregar Héroes de Babilonia - Pequeños Héroes de la Biblia $5.500" [ref=e247] [cursor=pointer]:
          - generic [ref=e248]:
            - img "Héroes de Babilonia - Pequeños Héroes de la Biblia" [ref=e249]
            - generic [ref=e250]:
              - generic [ref=e251]: Nuevo
              - generic [ref=e252]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e253]:
            - heading "Héroes de Babilonia - Pequeños Héroes de la Biblia" [level=3] [ref=e254]
            - paragraph [ref=e255]: $5.500
        - link "Aprendizaje en Profundidad Nuevo Últimas unidades Agregar Kieran Egan Aprendizaje en Profundidad $12.000" [ref=e256] [cursor=pointer]:
          - generic [ref=e257]:
            - img "Aprendizaje en Profundidad" [ref=e258]
            - generic [ref=e259]:
              - generic [ref=e260]: Nuevo
              - generic [ref=e261]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e262]:
            - paragraph [ref=e263]: Kieran Egan
            - heading "Aprendizaje en Profundidad" [level=3] [ref=e264]
            - paragraph [ref=e265]: $12.000
        - link "Aqui y Ahora Nuevo Últimas unidades Agregar Henry J M Nouwen Aqui y Ahora $27.800" [ref=e266] [cursor=pointer]:
          - generic [ref=e267]:
            - img "Aqui y Ahora" [ref=e268]
            - generic [ref=e269]:
              - generic [ref=e270]: Nuevo
              - generic [ref=e271]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e272]:
            - paragraph [ref=e273]: Henry J M Nouwen
            - heading "Aqui y Ahora" [level=3] [ref=e274]
            - paragraph [ref=e275]: $27.800
        - link "Así de Profundo Es el Logos Nuevo Últimas unidades Agregar Andrea Potestà Así de Profundo Es el Logos $13.600" [ref=e276] [cursor=pointer]:
          - generic [ref=e277]:
            - img "Así de Profundo Es el Logos" [ref=e278]
            - generic [ref=e279]:
              - generic [ref=e280]: Nuevo
              - generic [ref=e281]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e282]:
            - paragraph [ref=e283]: Andrea Potestà
            - heading "Así de Profundo Es el Logos" [level=3] [ref=e284]
            - paragraph [ref=e285]: $13.600
        - link "Atrévete a Ser Quien Eres (Aunque Nos Gustes) Nuevo Últimas unidades Agregar Walter Riso Atrévete a Ser Quien Eres (Aunque Nos Gustes) $21.900" [ref=e286] [cursor=pointer]:
          - generic [ref=e287]:
            - img "Atrévete a Ser Quien Eres (Aunque Nos Gustes)" [ref=e288]
            - generic [ref=e289]:
              - generic [ref=e290]: Nuevo
              - generic [ref=e291]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e292]:
            - paragraph [ref=e293]: Walter Riso
            - heading "Atrévete a Ser Quien Eres (Aunque Nos Gustes)" [level=3] [ref=e294]
            - paragraph [ref=e295]: $21.900
        - link "¿Quién Eres? Nuevo Últimas unidades Agregar Enrique Rojas ¿Quién Eres? $16.900" [ref=e296] [cursor=pointer]:
          - generic [ref=e297]:
            - img "¿Quién Eres?" [ref=e298]
            - generic [ref=e299]:
              - generic [ref=e300]: Nuevo
              - generic [ref=e301]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e302]:
            - paragraph [ref=e303]: Enrique Rojas
            - heading "¿Quién Eres?" [level=3] [ref=e304]
            - paragraph [ref=e305]: $16.900
        - link "Aprender el Arte de Acompañar Nuevo Últimas unidades Agregar Manuel Sánchez Monge Aprender el Arte de Acompañar $35.000" [ref=e306] [cursor=pointer]:
          - generic [ref=e307]:
            - img "Aprender el Arte de Acompañar" [ref=e308]
            - generic [ref=e309]:
              - generic [ref=e310]: Nuevo
              - generic [ref=e311]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e312]:
            - paragraph [ref=e313]: Manuel Sánchez Monge
            - heading "Aprender el Arte de Acompañar" [level=3] [ref=e314]
            - paragraph [ref=e315]: $35.000
        - link "Bailarines en el Desierto, Tres Sociedades de Baile Nuevo Últimas unidades Agregar Juan Van Kessel Bailarines en el Desierto, Tres Sociedades de Baile $22.400" [ref=e316] [cursor=pointer]:
          - generic [ref=e317]:
            - img "Bailarines en el Desierto, Tres Sociedades de Baile" [ref=e318]
            - generic [ref=e319]:
              - generic [ref=e320]: Nuevo
              - generic [ref=e321]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e322]:
            - paragraph [ref=e323]: Juan Van Kessel
            - heading "Bailarines en el Desierto, Tres Sociedades de Baile" [level=3] [ref=e324]
            - paragraph [ref=e325]: $22.400
        - link "Por Qué Sufrir, el Sentido Trascendente del Dolor Nuevo Agregar José Miguel Ibánez Langlois Por Qué Sufrir, el Sentido Trascendente del Dolor $19.000" [ref=e326] [cursor=pointer]:
          - generic [ref=e327]:
            - img "Por Qué Sufrir, el Sentido Trascendente del Dolor" [ref=e328]
            - generic [ref=e330]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e331]:
            - paragraph [ref=e332]: José Miguel Ibánez Langlois
            - heading "Por Qué Sufrir, el Sentido Trascendente del Dolor" [level=3] [ref=e333]
            - paragraph [ref=e334]: $19.000
        - link "Biblia de la Iglesia en América Nuevo Últimas unidades Agregar Varios autores Biblia de la Iglesia en América $44.200" [ref=e335] [cursor=pointer]:
          - generic [ref=e336]:
            - img "Biblia de la Iglesia en América" [ref=e337]
            - generic [ref=e338]:
              - generic [ref=e339]: Nuevo
              - generic [ref=e340]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e341]:
            - paragraph [ref=e342]: Varios autores
            - heading "Biblia de la Iglesia en América" [level=3] [ref=e343]
            - paragraph [ref=e344]: $44.200
        - link "Biblia del Peregrino - Creer Creando Nuevo Agregar Luis Alonso Schokel Biblia del Peregrino - Creer Creando $42.000" [ref=e345] [cursor=pointer]:
          - generic [ref=e346]:
            - img "Biblia del Peregrino - Creer Creando" [ref=e347]
            - generic [ref=e349]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e350]:
            - paragraph [ref=e351]: Luis Alonso Schokel
            - heading "Biblia del Peregrino - Creer Creando" [level=3] [ref=e352]
            - paragraph [ref=e353]: $42.000
        - link "Bioética y Vulnerabilidad Nuevo Últimas unidades Agregar Carolina Montero Orphanopoulos Bioética y Vulnerabilidad $16.000" [ref=e354] [cursor=pointer]:
          - generic [ref=e355]:
            - img "Bioética y Vulnerabilidad" [ref=e356]
            - generic [ref=e357]:
              - generic [ref=e358]: Nuevo
              - generic [ref=e359]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e360]:
            - paragraph [ref=e361]: Carolina Montero Orphanopoulos
            - heading "Bioética y Vulnerabilidad" [level=3] [ref=e362]
            - paragraph [ref=e363]: $16.000
        - link "Judíos y Cristianos Nuevo Últimas unidades Agregar Benedicto XVI Judíos y Cristianos $24.500" [ref=e364] [cursor=pointer]:
          - generic [ref=e365]:
            - img "Judíos y Cristianos" [ref=e366]
            - generic [ref=e367]:
              - generic [ref=e368]: Nuevo
              - generic [ref=e369]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e370]:
            - paragraph [ref=e371]: Benedicto XVI
            - heading "Judíos y Cristianos" [level=3] [ref=e372]
            - paragraph [ref=e373]: $24.500
        - link "Al Partir el Pan Bendecimos la Mesa Nuevo Últimas unidades Agregar Fredy Peña Al Partir el Pan Bendecimos la Mesa $10.000" [ref=e374] [cursor=pointer]:
          - generic [ref=e375]:
            - img "Al Partir el Pan Bendecimos la Mesa" [ref=e376]
            - generic [ref=e377]:
              - generic [ref=e378]: Nuevo
              - generic [ref=e379]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e380]:
            - paragraph [ref=e381]: Fredy Peña
            - heading "Al Partir el Pan Bendecimos la Mesa" [level=3] [ref=e382]
            - paragraph [ref=e383]: $10.000
        - link "Buscando el Reino de Dios Nuevo Últimas unidades Agregar Celso López, Eduardo Pérez Cotapos y Ana María Vicuña Buscando el Reino de Dios $17.000" [ref=e384] [cursor=pointer]:
          - generic [ref=e385]:
            - img "Buscando el Reino de Dios" [ref=e386]
            - generic [ref=e387]:
              - generic [ref=e388]: Nuevo
              - generic [ref=e389]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e390]:
            - paragraph [ref=e391]: Celso López, Eduardo Pérez Cotapos y Ana María Vicuña
            - heading "Buscando el Reino de Dios" [level=3] [ref=e392]
            - paragraph [ref=e393]: $17.000
        - link "Caminando con María Nuevo Últimas unidades Agregar Francisco Caminando con María $23.000" [ref=e394] [cursor=pointer]:
          - generic [ref=e395]:
            - img "Caminando con María" [ref=e396]
            - generic [ref=e397]:
              - generic [ref=e398]: Nuevo
              - generic [ref=e399]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e400]:
            - paragraph [ref=e401]: Francisco
            - heading "Caminando con María" [level=3] [ref=e402]
            - paragraph [ref=e403]: $23.000
        - link "Diario Ana Frank Nuevo Últimas unidades Agregar Diario Ana Frank $13.900" [ref=e404] [cursor=pointer]:
          - generic [ref=e405]:
            - img "Diario Ana Frank" [ref=e406]
            - generic [ref=e407]:
              - generic [ref=e408]: Nuevo
              - generic [ref=e409]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e410]:
            - heading "Diario Ana Frank" [level=3] [ref=e411]
            - paragraph [ref=e412]: $13.900
        - link "Padre Pío Nuevo Últimas unidades Agregar el santo de los estigmas Padre Pío $4.000" [ref=e413] [cursor=pointer]:
          - generic [ref=e414]:
            - img "Padre Pío" [ref=e415]
            - generic [ref=e416]:
              - generic [ref=e417]: Nuevo
              - generic [ref=e418]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e419]:
            - paragraph [ref=e420]: el santo de los estigmas
            - heading "Padre Pío" [level=3] [ref=e421]
            - paragraph [ref=e422]: $4.000
        - link "Por Si un Día Volvemos Nuevo Últimas unidades Agregar María Dueñas Por Si un Día Volvemos $31.000" [ref=e423] [cursor=pointer]:
          - generic [ref=e424]:
            - img "Por Si un Día Volvemos" [ref=e425]
            - generic [ref=e426]:
              - generic [ref=e427]: Nuevo
              - generic [ref=e428]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e429]:
            - paragraph [ref=e430]: María Dueñas
            - heading "Por Si un Día Volvemos" [level=3] [ref=e431]
            - paragraph [ref=e432]: $31.000
        - link "Caminos de Reparación Nuevo Últimas unidades Agregar Ricardo Capponi Caminos de Reparación $16.000" [ref=e433] [cursor=pointer]:
          - generic [ref=e434]:
            - img "Caminos de Reparación" [ref=e435]
            - generic [ref=e436]:
              - generic [ref=e437]: Nuevo
              - generic [ref=e438]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e439]:
            - paragraph [ref=e440]: Ricardo Capponi
            - heading "Caminos de Reparación" [level=3] [ref=e441]
            - paragraph [ref=e442]: $16.000
        - link "La Crisis de la Iglesia en Chile; Mirar las Heridas Nuevo Últimas unidades Agregar Sofía Brahm, Eduardo V La Crisis de la Iglesia en Chile; Mirar las Heridas $15.300" [ref=e443] [cursor=pointer]:
          - generic [ref=e444]:
            - img "La Crisis de la Iglesia en Chile; Mirar las Heridas" [ref=e445]
            - generic [ref=e446]:
              - generic [ref=e447]: Nuevo
              - generic [ref=e448]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e449]:
            - paragraph [ref=e450]: Sofía Brahm, Eduardo V
            - heading "La Crisis de la Iglesia en Chile; Mirar las Heridas" [level=3] [ref=e451]
            - paragraph [ref=e452]: $15.300
      - navigation "Paginacion" [ref=e453]:
        - button "Anterior" [disabled] [ref=e454]
        - generic [ref=e455]: Página 1 de 23
        - button "1" [ref=e457]
        - button "2" [ref=e459]
        - generic [ref=e460]:
          - generic [ref=e461]: ...
          - button "23" [ref=e462]
        - button "Siguiente" [ref=e463]
  - contentinfo [ref=e464]:
    - generic [ref=e472]:
      - generic [ref=e473]:
        - img "Crecer Librería" [ref=e474]
        - paragraph [ref=e475]: Crecer Libreria
        - paragraph [ref=e476]: Fe, lectura y formación
        - paragraph [ref=e477]: Una librería católica pensada para acompañar el estudio, la devoción y la vida diaria con una selección curada de títulos.
      - generic [ref=e478]:
        - heading "Catálogo" [level=4] [ref=e479]
        - generic [ref=e480]:
          - link "Coleccion completa" [ref=e481] [cursor=pointer]:
            - /url: /productos
          - link "Novedades" [ref=e482] [cursor=pointer]:
            - /url: /productos?filter=nuevo
      - generic [ref=e483]:
        - heading "Información" [level=4] [ref=e484]
        - generic [ref=e485]:
          - link "Mi carrito" [ref=e486] [cursor=pointer]:
            - /url: /carrito
          - link "Checkout" [ref=e487] [cursor=pointer]:
            - /url: /checkout
      - generic [ref=e488]:
        - heading "Ubicación" [level=4] [ref=e489]
        - generic [ref=e490]:
          - img [ref=e491]
          - paragraph [ref=e494]: Arturo Prat 470 / Antofagasta, Chile
        - link "Ver en el mapa →" [ref=e495] [cursor=pointer]:
          - /url: https://maps.google.com/?q=Arturo+Prat+470+Antofagasta
    - generic [ref=e496]:
      - paragraph [ref=e497]: © 2026 Crecer Libreria. Todos los derechos reservados.
      - generic [ref=e498]:
        - paragraph [ref=e499]: "Diseño: Hultur Studios"
        - link "·" [ref=e500] [cursor=pointer]:
          - /url: /admin/login
  - button "Open Next.js Dev Tools" [ref=e506] [cursor=pointer]:
    - img [ref=e507]
  - alert [ref=e510]
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
> 32 |     await expect(page).toHaveURL(/\/productos\/.+/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
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
  52 |     // 7. El título del producto aparece en el carrito — scope a main para evitar CartPanel oculto
  53 |     if (productTitle) {
  54 |       await expect(
  55 |         page.locator("main").getByText(productTitle.trim(), { exact: false }).first()
  56 |       ).toBeVisible();
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