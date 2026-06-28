# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: producto.spec.ts >> Detalle de producto >> muestra el botón 'Añadir al carrito'
- Location: tests\producto.spec.ts:29:7

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
              - button "Selección del mes" [ref=e84]:
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
        - generic [ref=e112]: 890 productos
        - generic [ref=e113]:
          - link "La Santa Misa Nuevo Agregar ordinario de la misa La Santa Misa $3.500" [active] [ref=e114] [cursor=pointer]:
            - generic [ref=e115]:
              - img "La Santa Misa" [ref=e116]
              - generic [ref=e118]: Nuevo
              - button "Agregar" [ref=e120]
            - generic [ref=e121]:
              - paragraph [ref=e122]: ordinario de la misa
              - heading "La Santa Misa" [level=3] [ref=e123]
              - paragraph [ref=e124]: $3.500
          - link "Recuerdo de mi Primera Comunión Nuevo Agregar san Pablo Recuerdo de mi Primera Comunión $12.500" [ref=e125] [cursor=pointer]:
            - generic [ref=e126]:
              - img "Recuerdo de mi Primera Comunión" [ref=e127]
              - generic [ref=e129]: Nuevo
              - generic:
                - button "Agregar"
            - generic [ref=e130]:
              - paragraph [ref=e131]: san Pablo
              - heading "Recuerdo de mi Primera Comunión" [level=3] [ref=e132]
              - paragraph [ref=e133]: $12.500
          - link "Para Qué Leer Nuevo Últimas unidades Agregar Marco Antonio de la Parra Para Qué Leer $13.000" [ref=e134] [cursor=pointer]:
            - generic [ref=e135]:
              - img "Para Qué Leer" [ref=e136]
              - generic [ref=e137]:
                - generic [ref=e138]: Nuevo
                - generic [ref=e139]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e140]:
              - paragraph [ref=e141]: Marco Antonio de la Parra
              - heading "Para Qué Leer" [level=3] [ref=e142]
              - paragraph [ref=e143]: $13.000
          - link "Bailar con el Tiempo Nuevo Agregar José María Rodríguez Olaizola, SJ Bailar con el Tiempo $22.000" [ref=e144] [cursor=pointer]:
            - generic [ref=e145]:
              - img "Bailar con el Tiempo" [ref=e146]
              - generic [ref=e148]: Nuevo
              - generic:
                - button "Agregar"
            - generic [ref=e149]:
              - paragraph [ref=e150]: José María Rodríguez Olaizola, SJ
              - heading "Bailar con el Tiempo" [level=3] [ref=e151]
              - paragraph [ref=e152]: $22.000
          - link "¿Por Qué Temo Decirte Quién Soy? John Powell, SJ Nuevo Últimas unidades Agregar John Powell ¿Por Qué Temo Decirte Quién Soy? John Powell, SJ $13.000" [ref=e153] [cursor=pointer]:
            - generic [ref=e154]:
              - img "¿Por Qué Temo Decirte Quién Soy? John Powell, SJ" [ref=e155]
              - generic [ref=e156]:
                - generic [ref=e157]: Nuevo
                - generic [ref=e158]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e159]:
              - paragraph [ref=e160]: John Powell
              - heading "¿Por Qué Temo Decirte Quién Soy? John Powell, SJ" [level=3] [ref=e161]
              - paragraph [ref=e162]: $13.000
          - link "100 Promesas de Oro para tu Vida Nuevo Últimas unidades Agregar caja metálica ovejita 100 Promesas de Oro para tu Vida $14.900" [ref=e163] [cursor=pointer]:
            - generic [ref=e164]:
              - img "100 Promesas de Oro para tu Vida" [ref=e165]
              - generic [ref=e166]:
                - generic [ref=e167]: Nuevo
                - generic [ref=e168]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e169]:
              - paragraph [ref=e170]: caja metálica ovejita
              - heading "100 Promesas de Oro para tu Vida" [level=3] [ref=e171]
              - paragraph [ref=e172]: $14.900
          - link "Breve Guía para Leer la Biblia Nuevo Últimas unidades Agregar Scott Hahn Breve Guía para Leer la Biblia $16.900" [ref=e173] [cursor=pointer]:
            - generic [ref=e174]:
              - img "Breve Guía para Leer la Biblia" [ref=e175]
              - generic [ref=e176]:
                - generic [ref=e177]: Nuevo
                - generic [ref=e178]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e179]:
              - paragraph [ref=e180]: Scott Hahn
              - heading "Breve Guía para Leer la Biblia" [level=3] [ref=e181]
              - paragraph [ref=e182]: $16.900
          - link "La Oración, Oxígeno del Creyente Nuevo Últimas unidades Agregar Jacques Philippe La Oración, Oxígeno del Creyente $16.900" [ref=e183] [cursor=pointer]:
            - generic [ref=e184]:
              - img "La Oración, Oxígeno del Creyente" [ref=e185]
              - generic [ref=e186]:
                - generic [ref=e187]: Nuevo
                - generic [ref=e188]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e189]:
              - paragraph [ref=e190]: Jacques Philippe
              - heading "La Oración, Oxígeno del Creyente" [level=3] [ref=e191]
              - paragraph [ref=e192]: $16.900
          - link "Adiós Tristeza Cómo Superar la Depresión según Santa Hildegarda Nuevo Últimas unidades Agregar Adiós Tristeza Cómo Superar la Depresión según Santa Hildegarda $29.900" [ref=e193] [cursor=pointer]:
            - generic [ref=e194]:
              - img "Adiós Tristeza Cómo Superar la Depresión según Santa Hildegarda" [ref=e195]
              - generic [ref=e196]:
                - generic [ref=e197]: Nuevo
                - generic [ref=e198]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e199]:
              - heading "Adiós Tristeza Cómo Superar la Depresión según Santa Hildegarda" [level=3] [ref=e200]
              - paragraph [ref=e201]: $29.900
          - link "Espiritualidad, para que mi Vida Tenga Sentido Nuevo Últimas unidades Agregar Anselm Grun Espiritualidad, para que mi Vida Tenga Sentido $12.900" [ref=e202] [cursor=pointer]:
            - generic [ref=e203]:
              - img "Espiritualidad, para que mi Vida Tenga Sentido" [ref=e204]
              - generic [ref=e205]:
                - generic [ref=e206]: Nuevo
                - generic [ref=e207]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e208]:
              - paragraph [ref=e209]: Anselm Grun
              - heading "Espiritualidad, para que mi Vida Tenga Sentido" [level=3] [ref=e210]
              - paragraph [ref=e211]: $12.900
          - link "Abuelo ¿Cuál Es tu Historia? Un Diario Guiado para que tu Abuelo Comparta Nuevo Últimas unidades Agregar Abuelo ¿Cuál Es tu Historia? Un Diario Guiado para que tu Abuelo Comparta $20.000" [ref=e212] [cursor=pointer]:
            - generic [ref=e213]:
              - img "Abuelo ¿Cuál Es tu Historia? Un Diario Guiado para que tu Abuelo Comparta" [ref=e214]
              - generic [ref=e215]:
                - generic [ref=e216]: Nuevo
                - generic [ref=e217]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e218]:
              - heading "Abuelo ¿Cuál Es tu Historia? Un Diario Guiado para que tu Abuelo Comparta" [level=3] [ref=e219]
              - paragraph [ref=e220]: $20.000
          - link "¿Hay Razones para Creer en Jesús? Nuevo Últimas unidades Agregar Sergio Silva Gatica ¿Hay Razones para Creer en Jesús? $16.000" [ref=e221] [cursor=pointer]:
            - generic [ref=e222]:
              - img "¿Hay Razones para Creer en Jesús?" [ref=e223]
              - generic [ref=e224]:
                - generic [ref=e225]: Nuevo
                - generic [ref=e226]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e227]:
              - paragraph [ref=e228]: Sergio Silva Gatica
              - heading "¿Hay Razones para Creer en Jesús?" [level=3] [ref=e229]
              - paragraph [ref=e230]: $16.000
          - link "La Pasión de Cristo Nuevo Últimas unidades Agregar José Miguel Ibáñez Langlois La Pasión de Cristo $17.900" [ref=e231] [cursor=pointer]:
            - generic [ref=e232]:
              - img "La Pasión de Cristo" [ref=e233]
              - generic [ref=e234]:
                - generic [ref=e235]: Nuevo
                - generic [ref=e236]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e237]:
              - paragraph [ref=e238]: José Miguel Ibáñez Langlois
              - heading "La Pasión de Cristo" [level=3] [ref=e239]
              - paragraph [ref=e240]: $17.900
          - link "Marco - Aparición de Nuestra Señora de Lourdes Nuevo Últimas unidades Agregar Marco - Aparición de Nuestra Señora de Lourdes $15.000" [ref=e241] [cursor=pointer]:
            - generic [ref=e242]:
              - img "Marco - Aparición de Nuestra Señora de Lourdes" [ref=e243]
              - generic [ref=e244]:
                - generic [ref=e245]: Nuevo
                - generic [ref=e246]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e247]:
              - heading "Marco - Aparición de Nuestra Señora de Lourdes" [level=3] [ref=e248]
              - paragraph [ref=e249]: $15.000
          - link "Pieza Magnética - Virgen de la Ternura Nuevo Últimas unidades Agregar Pieza Magnética - Virgen de la Ternura $7.990" [ref=e250] [cursor=pointer]:
            - generic [ref=e251]:
              - img "Pieza Magnética - Virgen de la Ternura" [ref=e252]
              - generic [ref=e253]:
                - generic [ref=e254]: Nuevo
                - generic [ref=e255]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e256]:
              - heading "Pieza Magnética - Virgen de la Ternura" [level=3] [ref=e257]
              - paragraph [ref=e258]: $7.990
          - link "Perspectivas Teológico Pastorales Chilenas; Iglesia Sinodal Nuevo Últimas unidades Agregar José Ignacio F Perspectivas Teológico Pastorales Chilenas; Iglesia Sinodal $8.000" [ref=e259] [cursor=pointer]:
            - generic [ref=e260]:
              - img "Perspectivas Teológico Pastorales Chilenas; Iglesia Sinodal" [ref=e261]
              - generic [ref=e262]:
                - generic [ref=e263]: Nuevo
                - generic [ref=e264]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e265]:
              - paragraph [ref=e266]: José Ignacio F
              - heading "Perspectivas Teológico Pastorales Chilenas; Iglesia Sinodal" [level=3] [ref=e267]
              - paragraph [ref=e268]: $8.000
          - link "Derecho Eclesiástico del Estado de Chile Nuevo Últimas unidades Agregar Jorge Precht Pizarro Derecho Eclesiástico del Estado de Chile $16.000" [ref=e269] [cursor=pointer]:
            - generic [ref=e270]:
              - img "Derecho Eclesiástico del Estado de Chile" [ref=e271]
              - generic [ref=e272]:
                - generic [ref=e273]: Nuevo
                - generic [ref=e274]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e275]:
              - paragraph [ref=e276]: Jorge Precht Pizarro
              - heading "Derecho Eclesiástico del Estado de Chile" [level=3] [ref=e277]
              - paragraph [ref=e278]: $16.000
          - link "Antonio Rendic, Itinerario Espiritual de un Poeta Nuevo Agregar Eva Reyes Gacitúa Antonio Rendic, Itinerario Espiritual de un Poeta $15.000" [ref=e279] [cursor=pointer]:
            - generic [ref=e280]:
              - img "Antonio Rendic, Itinerario Espiritual de un Poeta" [ref=e281]
              - generic [ref=e283]: Nuevo
              - generic:
                - button "Agregar"
            - generic [ref=e284]:
              - paragraph [ref=e285]: Eva Reyes Gacitúa
              - heading "Antonio Rendic, Itinerario Espiritual de un Poeta" [level=3] [ref=e286]
              - paragraph [ref=e287]: $15.000
          - link "Antropologia del Dolor Nuevo Últimas unidades Agregar DAVID LE BRETON Antropologia del Dolor $24.000" [ref=e288] [cursor=pointer]:
            - generic [ref=e289]:
              - img "Antropologia del Dolor" [ref=e290]
              - generic [ref=e291]:
                - generic [ref=e292]: Nuevo
                - generic [ref=e293]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e294]:
              - paragraph [ref=e295]: DAVID LE BRETON
              - heading "Antropologia del Dolor" [level=3] [ref=e296]
              - paragraph [ref=e297]: $24.000
          - link "Héroes de Babilonia - Pequeños Héroes de la Biblia Nuevo Últimas unidades Agregar Héroes de Babilonia - Pequeños Héroes de la Biblia $5.500" [ref=e298] [cursor=pointer]:
            - generic [ref=e299]:
              - img "Héroes de Babilonia - Pequeños Héroes de la Biblia" [ref=e300]
              - generic [ref=e301]:
                - generic [ref=e302]: Nuevo
                - generic [ref=e303]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e304]:
              - heading "Héroes de Babilonia - Pequeños Héroes de la Biblia" [level=3] [ref=e305]
              - paragraph [ref=e306]: $5.500
          - link "Aprendizaje en Profundidad Nuevo Últimas unidades Agregar Kieran Egan Aprendizaje en Profundidad $12.000" [ref=e307] [cursor=pointer]:
            - generic [ref=e308]:
              - img "Aprendizaje en Profundidad" [ref=e309]
              - generic [ref=e310]:
                - generic [ref=e311]: Nuevo
                - generic [ref=e312]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e313]:
              - paragraph [ref=e314]: Kieran Egan
              - heading "Aprendizaje en Profundidad" [level=3] [ref=e315]
              - paragraph [ref=e316]: $12.000
          - link "Aqui y Ahora Nuevo Últimas unidades Agregar Henry J M Nouwen Aqui y Ahora $27.800" [ref=e317] [cursor=pointer]:
            - generic [ref=e318]:
              - img "Aqui y Ahora" [ref=e319]
              - generic [ref=e320]:
                - generic [ref=e321]: Nuevo
                - generic [ref=e322]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e323]:
              - paragraph [ref=e324]: Henry J M Nouwen
              - heading "Aqui y Ahora" [level=3] [ref=e325]
              - paragraph [ref=e326]: $27.800
          - link "Así de Profundo Es el Logos Nuevo Últimas unidades Agregar Andrea Potestà Así de Profundo Es el Logos $13.600" [ref=e327] [cursor=pointer]:
            - generic [ref=e328]:
              - img "Así de Profundo Es el Logos" [ref=e329]
              - generic [ref=e330]:
                - generic [ref=e331]: Nuevo
                - generic [ref=e332]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e333]:
              - paragraph [ref=e334]: Andrea Potestà
              - heading "Así de Profundo Es el Logos" [level=3] [ref=e335]
              - paragraph [ref=e336]: $13.600
          - link "Atrévete a Ser Quien Eres (Aunque Nos Gustes) Nuevo Últimas unidades Agregar Walter Riso Atrévete a Ser Quien Eres (Aunque Nos Gustes) $21.900" [ref=e337] [cursor=pointer]:
            - generic [ref=e338]:
              - img "Atrévete a Ser Quien Eres (Aunque Nos Gustes)" [ref=e339]
              - generic [ref=e340]:
                - generic [ref=e341]: Nuevo
                - generic [ref=e342]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e343]:
              - paragraph [ref=e344]: Walter Riso
              - heading "Atrévete a Ser Quien Eres (Aunque Nos Gustes)" [level=3] [ref=e345]
              - paragraph [ref=e346]: $21.900
          - link "¿Quién Eres? Nuevo Últimas unidades Agregar Enrique Rojas ¿Quién Eres? $16.900" [ref=e347] [cursor=pointer]:
            - generic [ref=e348]:
              - img "¿Quién Eres?" [ref=e349]
              - generic [ref=e350]:
                - generic [ref=e351]: Nuevo
                - generic [ref=e352]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e353]:
              - paragraph [ref=e354]: Enrique Rojas
              - heading "¿Quién Eres?" [level=3] [ref=e355]
              - paragraph [ref=e356]: $16.900
          - link "Aprender el Arte de Acompañar Nuevo Últimas unidades Agregar Manuel Sánchez Monge Aprender el Arte de Acompañar $35.000" [ref=e357] [cursor=pointer]:
            - generic [ref=e358]:
              - img "Aprender el Arte de Acompañar" [ref=e359]
              - generic [ref=e360]:
                - generic [ref=e361]: Nuevo
                - generic [ref=e362]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e363]:
              - paragraph [ref=e364]: Manuel Sánchez Monge
              - heading "Aprender el Arte de Acompañar" [level=3] [ref=e365]
              - paragraph [ref=e366]: $35.000
          - link "Bailarines en el Desierto, Tres Sociedades de Baile Nuevo Últimas unidades Agregar Juan Van Kessel Bailarines en el Desierto, Tres Sociedades de Baile $22.400" [ref=e367] [cursor=pointer]:
            - generic [ref=e368]:
              - img "Bailarines en el Desierto, Tres Sociedades de Baile" [ref=e369]
              - generic [ref=e370]:
                - generic [ref=e371]: Nuevo
                - generic [ref=e372]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e373]:
              - paragraph [ref=e374]: Juan Van Kessel
              - heading "Bailarines en el Desierto, Tres Sociedades de Baile" [level=3] [ref=e375]
              - paragraph [ref=e376]: $22.400
          - link "Por Qué Sufrir, el Sentido Trascendente del Dolor Nuevo Agregar José Miguel Ibánez Langlois Por Qué Sufrir, el Sentido Trascendente del Dolor $19.000" [ref=e377] [cursor=pointer]:
            - generic [ref=e378]:
              - img "Por Qué Sufrir, el Sentido Trascendente del Dolor" [ref=e379]
              - generic [ref=e381]: Nuevo
              - generic:
                - button "Agregar"
            - generic [ref=e382]:
              - paragraph [ref=e383]: José Miguel Ibánez Langlois
              - heading "Por Qué Sufrir, el Sentido Trascendente del Dolor" [level=3] [ref=e384]
              - paragraph [ref=e385]: $19.000
          - link "Biblia de la Iglesia en América Nuevo Últimas unidades Agregar Varios autores Biblia de la Iglesia en América $44.200" [ref=e386] [cursor=pointer]:
            - generic [ref=e387]:
              - img "Biblia de la Iglesia en América" [ref=e388]
              - generic [ref=e389]:
                - generic [ref=e390]: Nuevo
                - generic [ref=e391]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e392]:
              - paragraph [ref=e393]: Varios autores
              - heading "Biblia de la Iglesia en América" [level=3] [ref=e394]
              - paragraph [ref=e395]: $44.200
          - link "Biblia del Peregrino - Creer Creando Nuevo Agregar Luis Alonso Schokel Biblia del Peregrino - Creer Creando $42.000" [ref=e396] [cursor=pointer]:
            - generic [ref=e397]:
              - img "Biblia del Peregrino - Creer Creando" [ref=e398]
              - generic [ref=e400]: Nuevo
              - generic:
                - button "Agregar"
            - generic [ref=e401]:
              - paragraph [ref=e402]: Luis Alonso Schokel
              - heading "Biblia del Peregrino - Creer Creando" [level=3] [ref=e403]
              - paragraph [ref=e404]: $42.000
          - link "Bioética y Vulnerabilidad Nuevo Últimas unidades Agregar Carolina Montero Orphanopoulos Bioética y Vulnerabilidad $16.000" [ref=e405] [cursor=pointer]:
            - generic [ref=e406]:
              - img "Bioética y Vulnerabilidad" [ref=e407]
              - generic [ref=e408]:
                - generic [ref=e409]: Nuevo
                - generic [ref=e410]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e411]:
              - paragraph [ref=e412]: Carolina Montero Orphanopoulos
              - heading "Bioética y Vulnerabilidad" [level=3] [ref=e413]
              - paragraph [ref=e414]: $16.000
          - link "Judíos y Cristianos Nuevo Últimas unidades Agregar Benedicto XVI Judíos y Cristianos $24.500" [ref=e415] [cursor=pointer]:
            - generic [ref=e416]:
              - img "Judíos y Cristianos" [ref=e417]
              - generic [ref=e418]:
                - generic [ref=e419]: Nuevo
                - generic [ref=e420]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e421]:
              - paragraph [ref=e422]: Benedicto XVI
              - heading "Judíos y Cristianos" [level=3] [ref=e423]
              - paragraph [ref=e424]: $24.500
          - link "Al Partir el Pan Bendecimos la Mesa Nuevo Últimas unidades Agregar Fredy Peña Al Partir el Pan Bendecimos la Mesa $10.000" [ref=e425] [cursor=pointer]:
            - generic [ref=e426]:
              - img "Al Partir el Pan Bendecimos la Mesa" [ref=e427]
              - generic [ref=e428]:
                - generic [ref=e429]: Nuevo
                - generic [ref=e430]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e431]:
              - paragraph [ref=e432]: Fredy Peña
              - heading "Al Partir el Pan Bendecimos la Mesa" [level=3] [ref=e433]
              - paragraph [ref=e434]: $10.000
          - link "Buscando el Reino de Dios Nuevo Últimas unidades Agregar Celso López, Eduardo Pérez Cotapos y Ana María Vicuña Buscando el Reino de Dios $17.000" [ref=e435] [cursor=pointer]:
            - generic [ref=e436]:
              - img "Buscando el Reino de Dios" [ref=e437]
              - generic [ref=e438]:
                - generic [ref=e439]: Nuevo
                - generic [ref=e440]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e441]:
              - paragraph [ref=e442]: Celso López, Eduardo Pérez Cotapos y Ana María Vicuña
              - heading "Buscando el Reino de Dios" [level=3] [ref=e443]
              - paragraph [ref=e444]: $17.000
          - link "Caminando con María Nuevo Últimas unidades Agregar Francisco Caminando con María $23.000" [ref=e445] [cursor=pointer]:
            - generic [ref=e446]:
              - img "Caminando con María" [ref=e447]
              - generic [ref=e448]:
                - generic [ref=e449]: Nuevo
                - generic [ref=e450]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e451]:
              - paragraph [ref=e452]: Francisco
              - heading "Caminando con María" [level=3] [ref=e453]
              - paragraph [ref=e454]: $23.000
          - link "Diario Ana Frank Nuevo Últimas unidades Agregar Diario Ana Frank $13.900" [ref=e455] [cursor=pointer]:
            - generic [ref=e456]:
              - img "Diario Ana Frank" [ref=e457]
              - generic [ref=e458]:
                - generic [ref=e459]: Nuevo
                - generic [ref=e460]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e461]:
              - heading "Diario Ana Frank" [level=3] [ref=e462]
              - paragraph [ref=e463]: $13.900
          - link "Padre Pío Nuevo Últimas unidades Agregar el santo de los estigmas Padre Pío $4.000" [ref=e464] [cursor=pointer]:
            - generic [ref=e465]:
              - img "Padre Pío" [ref=e466]
              - generic [ref=e467]:
                - generic [ref=e468]: Nuevo
                - generic [ref=e469]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e470]:
              - paragraph [ref=e471]: el santo de los estigmas
              - heading "Padre Pío" [level=3] [ref=e472]
              - paragraph [ref=e473]: $4.000
          - link "Por Si un Día Volvemos Nuevo Últimas unidades Agregar María Dueñas Por Si un Día Volvemos $31.000" [ref=e474] [cursor=pointer]:
            - generic [ref=e475]:
              - img "Por Si un Día Volvemos" [ref=e476]
              - generic [ref=e477]:
                - generic [ref=e478]: Nuevo
                - generic [ref=e479]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e480]:
              - paragraph [ref=e481]: María Dueñas
              - heading "Por Si un Día Volvemos" [level=3] [ref=e482]
              - paragraph [ref=e483]: $31.000
          - link "Caminos de Reparación Nuevo Últimas unidades Agregar Ricardo Capponi Caminos de Reparación $16.000" [ref=e484] [cursor=pointer]:
            - generic [ref=e485]:
              - img "Caminos de Reparación" [ref=e486]
              - generic [ref=e487]:
                - generic [ref=e488]: Nuevo
                - generic [ref=e489]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e490]:
              - paragraph [ref=e491]: Ricardo Capponi
              - heading "Caminos de Reparación" [level=3] [ref=e492]
              - paragraph [ref=e493]: $16.000
          - link "La Crisis de la Iglesia en Chile; Mirar las Heridas Nuevo Últimas unidades Agregar Sofía Brahm, Eduardo V La Crisis de la Iglesia en Chile; Mirar las Heridas $15.300" [ref=e494] [cursor=pointer]:
            - generic [ref=e495]:
              - img "La Crisis de la Iglesia en Chile; Mirar las Heridas" [ref=e496]
              - generic [ref=e497]:
                - generic [ref=e498]: Nuevo
                - generic [ref=e499]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e500]:
              - paragraph [ref=e501]: Sofía Brahm, Eduardo V
              - heading "La Crisis de la Iglesia en Chile; Mirar las Heridas" [level=3] [ref=e502]
              - paragraph [ref=e503]: $15.300
        - navigation "Paginacion" [ref=e504]:
          - button "Anterior" [disabled] [ref=e505]
          - generic [ref=e506]: Página 1 de 23
          - button "1" [ref=e508]
          - button "2" [ref=e510]
          - generic [ref=e511]:
            - generic [ref=e512]: ...
            - button "23" [ref=e513]
          - button "Siguiente" [ref=e514]
  - contentinfo [ref=e515]:
    - generic [ref=e523]:
      - generic [ref=e524]:
        - img "Crecer Librería" [ref=e525]
        - paragraph [ref=e526]: Crecer Libreria
        - paragraph [ref=e527]: Fe, lectura y formación
        - paragraph [ref=e528]: Una librería católica pensada para acompañar el estudio, la devoción y la vida diaria con una selección curada de títulos.
      - generic [ref=e529]:
        - heading "Catálogo" [level=4] [ref=e530]
        - generic [ref=e531]:
          - link "Coleccion completa" [ref=e532] [cursor=pointer]:
            - /url: /productos
          - link "Novedades" [ref=e533] [cursor=pointer]:
            - /url: /productos?filter=nuevo
      - generic [ref=e534]:
        - heading "Información" [level=4] [ref=e535]
        - generic [ref=e536]:
          - link "Mi carrito" [ref=e537] [cursor=pointer]:
            - /url: /carrito
          - link "Checkout" [ref=e538] [cursor=pointer]:
            - /url: /checkout
      - generic [ref=e539]:
        - heading "Ubicación" [level=4] [ref=e540]
        - generic [ref=e541]:
          - img [ref=e542]
          - paragraph [ref=e545]: Arturo Prat 470 / Antofagasta, Chile
        - link "Ver en el mapa →" [ref=e546] [cursor=pointer]:
          - /url: https://maps.google.com/?q=Arturo+Prat+470+Antofagasta
    - generic [ref=e547]:
      - paragraph [ref=e548]: © 2026 Crecer Libreria. Todos los derechos reservados.
      - generic [ref=e549]:
        - paragraph [ref=e550]: "Diseño: Hultur Studios"
        - link "·" [ref=e551] [cursor=pointer]:
          - /url: /admin/login
  - button "Open Next.js Dev Tools" [ref=e557] [cursor=pointer]:
    - img [ref=e558]
  - alert [ref=e561]
```

# Test source

```ts
  1  | /**
  2  |  * Tests de página de detalle de producto (/productos/[slug])
  3  |  * Requiere datos en la BD — correr `npm run seed:products` antes.
  4  |  * Navega desde el catálogo al primer producto y verifica el contenido.
  5  |  */
  6  | import { test, expect } from "@playwright/test";
  7  | 
  8  | test.describe("Detalle de producto", () => {
  9  |   // Navegar al primer producto desde el catálogo antes de cada test
  10 |   test.beforeEach(async ({ page }) => {
  11 |     await page.goto("/productos");
  12 |     await page.locator('article[role="link"]').first().click();
> 13 |     await expect(page).toHaveURL(/\/productos\/.+/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  14 |   });
  15 | 
  16 |   test("muestra el título del producto en un h1", async ({ page }) => {
  17 |     const heading = page.getByRole("heading", { level: 1 });
  18 |     await expect(heading).toBeVisible();
  19 |     // El título no debe estar vacío
  20 |     const text = await heading.textContent();
  21 |     expect(text?.trim().length).toBeGreaterThan(0);
  22 |   });
  23 | 
  24 |   test("muestra el precio formateado en CLP", async ({ page }) => {
  25 |     // Scope a main para evitar el CartPanel oculto que también tiene precios ($0)
  26 |     await expect(page.locator("main").getByText(/^\$[\d.]+/).first()).toBeVisible();
  27 |   });
  28 | 
  29 |   test("muestra el botón 'Añadir al carrito'", async ({ page }) => {
  30 |     const addBtn = page.getByRole("button", { name: /añadir al carrito/i });
  31 |     await expect(addBtn).toBeVisible();
  32 |   });
  33 | 
  34 |   test("el botón 'Añadir al carrito' muestra confirmación al hacer click", async ({ page }) => {
  35 |     const addBtn = page.getByRole("button", { name: /añadir al carrito/i });
  36 |     await addBtn.click();
  37 |     // El botón cambia texto a "Agregado" — usar locator separado para evitar stale reference
  38 |     await expect(page.getByText(/agregado/i).first()).toBeVisible({ timeout: 3000 });
  39 |   });
  40 | 
  41 |   test("muestra la imagen o el placeholder del libro", async ({ page }) => {
  42 |     // La galería tiene un botón principal (click abre lightbox)
  43 |     const galleryBtn = page.locator("button.group").first();
  44 |     await expect(galleryBtn).toBeVisible();
  45 |   });
  46 | 
  47 |   test("muestra breadcrumb con enlace a Colección", async ({ page }) => {
  48 |     // Scope a main para evitar el link "Colección" del Navbar
  49 |     await expect(page.locator("main").getByRole("link", { name: "Colección" })).toBeVisible();
  50 |   });
  51 | 
  52 |   test("muestra sección de productos relacionados si existen", async ({ page }) => {
  53 |     // La sección podría no existir si no hay relacionados
  54 |     const related = page.getByRole("heading", { name: /relacionados/i });
  55 |     const count = await related.count();
  56 |     if (count > 0) {
  57 |       await expect(related).toBeVisible();
  58 |     }
  59 |   });
  60 | });
  61 | 
```