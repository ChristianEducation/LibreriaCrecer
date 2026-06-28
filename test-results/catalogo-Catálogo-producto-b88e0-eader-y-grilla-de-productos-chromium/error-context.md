# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: catalogo.spec.ts >> Catálogo /productos >> carga con header y grilla de productos
- Location: tests\catalogo.spec.ts:13:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('FILTRAR')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('FILTRAR')

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
          - link "La Santa Misa Nuevo Agregar ordinario de la misa La Santa Misa $3.500" [ref=e114] [cursor=pointer]:
            - generic [ref=e115]:
              - img "La Santa Misa" [ref=e116]
              - generic [ref=e118]: Nuevo
              - generic:
                - button "Agregar"
            - generic [ref=e119]:
              - paragraph [ref=e120]: ordinario de la misa
              - heading "La Santa Misa" [level=3] [ref=e121]
              - paragraph [ref=e122]: $3.500
          - link "Recuerdo de mi Primera Comunión Nuevo Agregar san Pablo Recuerdo de mi Primera Comunión $12.500" [ref=e123] [cursor=pointer]:
            - generic [ref=e124]:
              - img "Recuerdo de mi Primera Comunión" [ref=e125]
              - generic [ref=e127]: Nuevo
              - generic:
                - button "Agregar"
            - generic [ref=e128]:
              - paragraph [ref=e129]: san Pablo
              - heading "Recuerdo de mi Primera Comunión" [level=3] [ref=e130]
              - paragraph [ref=e131]: $12.500
          - link "Para Qué Leer Nuevo Últimas unidades Agregar Marco Antonio de la Parra Para Qué Leer $13.000" [ref=e132] [cursor=pointer]:
            - generic [ref=e133]:
              - img "Para Qué Leer" [ref=e134]
              - generic [ref=e135]:
                - generic [ref=e136]: Nuevo
                - generic [ref=e137]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e138]:
              - paragraph [ref=e139]: Marco Antonio de la Parra
              - heading "Para Qué Leer" [level=3] [ref=e140]
              - paragraph [ref=e141]: $13.000
          - link "Bailar con el Tiempo Nuevo Agregar José María Rodríguez Olaizola, SJ Bailar con el Tiempo $22.000" [ref=e142] [cursor=pointer]:
            - generic [ref=e143]:
              - img "Bailar con el Tiempo" [ref=e144]
              - generic [ref=e146]: Nuevo
              - generic:
                - button "Agregar"
            - generic [ref=e147]:
              - paragraph [ref=e148]: José María Rodríguez Olaizola, SJ
              - heading "Bailar con el Tiempo" [level=3] [ref=e149]
              - paragraph [ref=e150]: $22.000
          - link "¿Por Qué Temo Decirte Quién Soy? John Powell, SJ Nuevo Últimas unidades Agregar John Powell ¿Por Qué Temo Decirte Quién Soy? John Powell, SJ $13.000" [ref=e151] [cursor=pointer]:
            - generic [ref=e152]:
              - img "¿Por Qué Temo Decirte Quién Soy? John Powell, SJ" [ref=e153]
              - generic [ref=e154]:
                - generic [ref=e155]: Nuevo
                - generic [ref=e156]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e157]:
              - paragraph [ref=e158]: John Powell
              - heading "¿Por Qué Temo Decirte Quién Soy? John Powell, SJ" [level=3] [ref=e159]
              - paragraph [ref=e160]: $13.000
          - link "100 Promesas de Oro para tu Vida Nuevo Últimas unidades Agregar caja metálica ovejita 100 Promesas de Oro para tu Vida $14.900" [ref=e161] [cursor=pointer]:
            - generic [ref=e162]:
              - img "100 Promesas de Oro para tu Vida" [ref=e163]
              - generic [ref=e164]:
                - generic [ref=e165]: Nuevo
                - generic [ref=e166]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e167]:
              - paragraph [ref=e168]: caja metálica ovejita
              - heading "100 Promesas de Oro para tu Vida" [level=3] [ref=e169]
              - paragraph [ref=e170]: $14.900
          - link "Breve Guía para Leer la Biblia Nuevo Últimas unidades Agregar Scott Hahn Breve Guía para Leer la Biblia $16.900" [ref=e171] [cursor=pointer]:
            - generic [ref=e172]:
              - img "Breve Guía para Leer la Biblia" [ref=e173]
              - generic [ref=e174]:
                - generic [ref=e175]: Nuevo
                - generic [ref=e176]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e177]:
              - paragraph [ref=e178]: Scott Hahn
              - heading "Breve Guía para Leer la Biblia" [level=3] [ref=e179]
              - paragraph [ref=e180]: $16.900
          - link "La Oración, Oxígeno del Creyente Nuevo Últimas unidades Agregar Jacques Philippe La Oración, Oxígeno del Creyente $16.900" [ref=e181] [cursor=pointer]:
            - generic [ref=e182]:
              - img "La Oración, Oxígeno del Creyente" [ref=e183]
              - generic [ref=e184]:
                - generic [ref=e185]: Nuevo
                - generic [ref=e186]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e187]:
              - paragraph [ref=e188]: Jacques Philippe
              - heading "La Oración, Oxígeno del Creyente" [level=3] [ref=e189]
              - paragraph [ref=e190]: $16.900
          - link "Adiós Tristeza Cómo Superar la Depresión según Santa Hildegarda Nuevo Últimas unidades Agregar Adiós Tristeza Cómo Superar la Depresión según Santa Hildegarda $29.900" [ref=e191] [cursor=pointer]:
            - generic [ref=e192]:
              - img "Adiós Tristeza Cómo Superar la Depresión según Santa Hildegarda" [ref=e193]
              - generic [ref=e194]:
                - generic [ref=e195]: Nuevo
                - generic [ref=e196]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e197]:
              - heading "Adiós Tristeza Cómo Superar la Depresión según Santa Hildegarda" [level=3] [ref=e198]
              - paragraph [ref=e199]: $29.900
          - link "Espiritualidad, para que mi Vida Tenga Sentido Nuevo Últimas unidades Agregar Anselm Grun Espiritualidad, para que mi Vida Tenga Sentido $12.900" [ref=e200] [cursor=pointer]:
            - generic [ref=e201]:
              - img "Espiritualidad, para que mi Vida Tenga Sentido" [ref=e202]
              - generic [ref=e203]:
                - generic [ref=e204]: Nuevo
                - generic [ref=e205]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e206]:
              - paragraph [ref=e207]: Anselm Grun
              - heading "Espiritualidad, para que mi Vida Tenga Sentido" [level=3] [ref=e208]
              - paragraph [ref=e209]: $12.900
          - link "Abuelo ¿Cuál Es tu Historia? Un Diario Guiado para que tu Abuelo Comparta Nuevo Últimas unidades Agregar Abuelo ¿Cuál Es tu Historia? Un Diario Guiado para que tu Abuelo Comparta $20.000" [ref=e210] [cursor=pointer]:
            - generic [ref=e211]:
              - img "Abuelo ¿Cuál Es tu Historia? Un Diario Guiado para que tu Abuelo Comparta" [ref=e212]
              - generic [ref=e213]:
                - generic [ref=e214]: Nuevo
                - generic [ref=e215]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e216]:
              - heading "Abuelo ¿Cuál Es tu Historia? Un Diario Guiado para que tu Abuelo Comparta" [level=3] [ref=e217]
              - paragraph [ref=e218]: $20.000
          - link "¿Hay Razones para Creer en Jesús? Nuevo Últimas unidades Agregar Sergio Silva Gatica ¿Hay Razones para Creer en Jesús? $16.000" [ref=e219] [cursor=pointer]:
            - generic [ref=e220]:
              - img "¿Hay Razones para Creer en Jesús?" [ref=e221]
              - generic [ref=e222]:
                - generic [ref=e223]: Nuevo
                - generic [ref=e224]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e225]:
              - paragraph [ref=e226]: Sergio Silva Gatica
              - heading "¿Hay Razones para Creer en Jesús?" [level=3] [ref=e227]
              - paragraph [ref=e228]: $16.000
          - link "La Pasión de Cristo Nuevo Últimas unidades Agregar José Miguel Ibáñez Langlois La Pasión de Cristo $17.900" [ref=e229] [cursor=pointer]:
            - generic [ref=e230]:
              - img "La Pasión de Cristo" [ref=e231]
              - generic [ref=e232]:
                - generic [ref=e233]: Nuevo
                - generic [ref=e234]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e235]:
              - paragraph [ref=e236]: José Miguel Ibáñez Langlois
              - heading "La Pasión de Cristo" [level=3] [ref=e237]
              - paragraph [ref=e238]: $17.900
          - link "Marco - Aparición de Nuestra Señora de Lourdes Nuevo Últimas unidades Agregar Marco - Aparición de Nuestra Señora de Lourdes $15.000" [ref=e239] [cursor=pointer]:
            - generic [ref=e240]:
              - img "Marco - Aparición de Nuestra Señora de Lourdes" [ref=e241]
              - generic [ref=e242]:
                - generic [ref=e243]: Nuevo
                - generic [ref=e244]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e245]:
              - heading "Marco - Aparición de Nuestra Señora de Lourdes" [level=3] [ref=e246]
              - paragraph [ref=e247]: $15.000
          - link "Pieza Magnética - Virgen de la Ternura Nuevo Últimas unidades Agregar Pieza Magnética - Virgen de la Ternura $7.990" [ref=e248] [cursor=pointer]:
            - generic [ref=e249]:
              - img "Pieza Magnética - Virgen de la Ternura" [ref=e250]
              - generic [ref=e251]:
                - generic [ref=e252]: Nuevo
                - generic [ref=e253]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e254]:
              - heading "Pieza Magnética - Virgen de la Ternura" [level=3] [ref=e255]
              - paragraph [ref=e256]: $7.990
          - link "Perspectivas Teológico Pastorales Chilenas; Iglesia Sinodal Nuevo Últimas unidades Agregar José Ignacio F Perspectivas Teológico Pastorales Chilenas; Iglesia Sinodal $8.000" [ref=e257] [cursor=pointer]:
            - generic [ref=e258]:
              - img "Perspectivas Teológico Pastorales Chilenas; Iglesia Sinodal" [ref=e259]
              - generic [ref=e260]:
                - generic [ref=e261]: Nuevo
                - generic [ref=e262]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e263]:
              - paragraph [ref=e264]: José Ignacio F
              - heading "Perspectivas Teológico Pastorales Chilenas; Iglesia Sinodal" [level=3] [ref=e265]
              - paragraph [ref=e266]: $8.000
          - link "Derecho Eclesiástico del Estado de Chile Nuevo Últimas unidades Agregar Jorge Precht Pizarro Derecho Eclesiástico del Estado de Chile $16.000" [ref=e267] [cursor=pointer]:
            - generic [ref=e268]:
              - img "Derecho Eclesiástico del Estado de Chile" [ref=e269]
              - generic [ref=e270]:
                - generic [ref=e271]: Nuevo
                - generic [ref=e272]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e273]:
              - paragraph [ref=e274]: Jorge Precht Pizarro
              - heading "Derecho Eclesiástico del Estado de Chile" [level=3] [ref=e275]
              - paragraph [ref=e276]: $16.000
          - link "Antonio Rendic, Itinerario Espiritual de un Poeta Nuevo Agregar Eva Reyes Gacitúa Antonio Rendic, Itinerario Espiritual de un Poeta $15.000" [ref=e277] [cursor=pointer]:
            - generic [ref=e278]:
              - img "Antonio Rendic, Itinerario Espiritual de un Poeta" [ref=e279]
              - generic [ref=e281]: Nuevo
              - generic:
                - button "Agregar"
            - generic [ref=e282]:
              - paragraph [ref=e283]: Eva Reyes Gacitúa
              - heading "Antonio Rendic, Itinerario Espiritual de un Poeta" [level=3] [ref=e284]
              - paragraph [ref=e285]: $15.000
          - link "Antropologia del Dolor Nuevo Últimas unidades Agregar DAVID LE BRETON Antropologia del Dolor $24.000" [ref=e286] [cursor=pointer]:
            - generic [ref=e287]:
              - img "Antropologia del Dolor" [ref=e288]
              - generic [ref=e289]:
                - generic [ref=e290]: Nuevo
                - generic [ref=e291]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e292]:
              - paragraph [ref=e293]: DAVID LE BRETON
              - heading "Antropologia del Dolor" [level=3] [ref=e294]
              - paragraph [ref=e295]: $24.000
          - link "Héroes de Babilonia - Pequeños Héroes de la Biblia Nuevo Últimas unidades Agregar Héroes de Babilonia - Pequeños Héroes de la Biblia $5.500" [ref=e296] [cursor=pointer]:
            - generic [ref=e297]:
              - img "Héroes de Babilonia - Pequeños Héroes de la Biblia" [ref=e298]
              - generic [ref=e299]:
                - generic [ref=e300]: Nuevo
                - generic [ref=e301]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e302]:
              - heading "Héroes de Babilonia - Pequeños Héroes de la Biblia" [level=3] [ref=e303]
              - paragraph [ref=e304]: $5.500
          - link "Aprendizaje en Profundidad Nuevo Últimas unidades Agregar Kieran Egan Aprendizaje en Profundidad $12.000" [ref=e305] [cursor=pointer]:
            - generic [ref=e306]:
              - img "Aprendizaje en Profundidad" [ref=e307]
              - generic [ref=e308]:
                - generic [ref=e309]: Nuevo
                - generic [ref=e310]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e311]:
              - paragraph [ref=e312]: Kieran Egan
              - heading "Aprendizaje en Profundidad" [level=3] [ref=e313]
              - paragraph [ref=e314]: $12.000
          - link "Aqui y Ahora Nuevo Últimas unidades Agregar Henry J M Nouwen Aqui y Ahora $27.800" [ref=e315] [cursor=pointer]:
            - generic [ref=e316]:
              - img "Aqui y Ahora" [ref=e317]
              - generic [ref=e318]:
                - generic [ref=e319]: Nuevo
                - generic [ref=e320]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e321]:
              - paragraph [ref=e322]: Henry J M Nouwen
              - heading "Aqui y Ahora" [level=3] [ref=e323]
              - paragraph [ref=e324]: $27.800
          - link "Así de Profundo Es el Logos Nuevo Últimas unidades Agregar Andrea Potestà Así de Profundo Es el Logos $13.600" [ref=e325] [cursor=pointer]:
            - generic [ref=e326]:
              - img "Así de Profundo Es el Logos" [ref=e327]
              - generic [ref=e328]:
                - generic [ref=e329]: Nuevo
                - generic [ref=e330]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e331]:
              - paragraph [ref=e332]: Andrea Potestà
              - heading "Así de Profundo Es el Logos" [level=3] [ref=e333]
              - paragraph [ref=e334]: $13.600
          - link "Atrévete a Ser Quien Eres (Aunque Nos Gustes) Nuevo Últimas unidades Agregar Walter Riso Atrévete a Ser Quien Eres (Aunque Nos Gustes) $21.900" [ref=e335] [cursor=pointer]:
            - generic [ref=e336]:
              - img "Atrévete a Ser Quien Eres (Aunque Nos Gustes)" [ref=e337]
              - generic [ref=e338]:
                - generic [ref=e339]: Nuevo
                - generic [ref=e340]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e341]:
              - paragraph [ref=e342]: Walter Riso
              - heading "Atrévete a Ser Quien Eres (Aunque Nos Gustes)" [level=3] [ref=e343]
              - paragraph [ref=e344]: $21.900
          - link "¿Quién Eres? Nuevo Últimas unidades Agregar Enrique Rojas ¿Quién Eres? $16.900" [ref=e345] [cursor=pointer]:
            - generic [ref=e346]:
              - img "¿Quién Eres?" [ref=e347]
              - generic [ref=e348]:
                - generic [ref=e349]: Nuevo
                - generic [ref=e350]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e351]:
              - paragraph [ref=e352]: Enrique Rojas
              - heading "¿Quién Eres?" [level=3] [ref=e353]
              - paragraph [ref=e354]: $16.900
          - link "Aprender el Arte de Acompañar Nuevo Últimas unidades Agregar Manuel Sánchez Monge Aprender el Arte de Acompañar $35.000" [ref=e355] [cursor=pointer]:
            - generic [ref=e356]:
              - img "Aprender el Arte de Acompañar" [ref=e357]
              - generic [ref=e358]:
                - generic [ref=e359]: Nuevo
                - generic [ref=e360]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e361]:
              - paragraph [ref=e362]: Manuel Sánchez Monge
              - heading "Aprender el Arte de Acompañar" [level=3] [ref=e363]
              - paragraph [ref=e364]: $35.000
          - link "Bailarines en el Desierto, Tres Sociedades de Baile Nuevo Últimas unidades Agregar Juan Van Kessel Bailarines en el Desierto, Tres Sociedades de Baile $22.400" [ref=e365] [cursor=pointer]:
            - generic [ref=e366]:
              - img "Bailarines en el Desierto, Tres Sociedades de Baile" [ref=e367]
              - generic [ref=e368]:
                - generic [ref=e369]: Nuevo
                - generic [ref=e370]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e371]:
              - paragraph [ref=e372]: Juan Van Kessel
              - heading "Bailarines en el Desierto, Tres Sociedades de Baile" [level=3] [ref=e373]
              - paragraph [ref=e374]: $22.400
          - link "Por Qué Sufrir, el Sentido Trascendente del Dolor Nuevo Agregar José Miguel Ibánez Langlois Por Qué Sufrir, el Sentido Trascendente del Dolor $19.000" [ref=e375] [cursor=pointer]:
            - generic [ref=e376]:
              - img "Por Qué Sufrir, el Sentido Trascendente del Dolor" [ref=e377]
              - generic [ref=e379]: Nuevo
              - generic:
                - button "Agregar"
            - generic [ref=e380]:
              - paragraph [ref=e381]: José Miguel Ibánez Langlois
              - heading "Por Qué Sufrir, el Sentido Trascendente del Dolor" [level=3] [ref=e382]
              - paragraph [ref=e383]: $19.000
          - link "Biblia de la Iglesia en América Nuevo Últimas unidades Agregar Varios autores Biblia de la Iglesia en América $44.200" [ref=e384] [cursor=pointer]:
            - generic [ref=e385]:
              - img "Biblia de la Iglesia en América" [ref=e386]
              - generic [ref=e387]:
                - generic [ref=e388]: Nuevo
                - generic [ref=e389]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e390]:
              - paragraph [ref=e391]: Varios autores
              - heading "Biblia de la Iglesia en América" [level=3] [ref=e392]
              - paragraph [ref=e393]: $44.200
          - link "Biblia del Peregrino - Creer Creando Nuevo Agregar Luis Alonso Schokel Biblia del Peregrino - Creer Creando $42.000" [ref=e394] [cursor=pointer]:
            - generic [ref=e395]:
              - img "Biblia del Peregrino - Creer Creando" [ref=e396]
              - generic [ref=e398]: Nuevo
              - generic:
                - button "Agregar"
            - generic [ref=e399]:
              - paragraph [ref=e400]: Luis Alonso Schokel
              - heading "Biblia del Peregrino - Creer Creando" [level=3] [ref=e401]
              - paragraph [ref=e402]: $42.000
          - link "Bioética y Vulnerabilidad Nuevo Últimas unidades Agregar Carolina Montero Orphanopoulos Bioética y Vulnerabilidad $16.000" [ref=e403] [cursor=pointer]:
            - generic [ref=e404]:
              - img "Bioética y Vulnerabilidad" [ref=e405]
              - generic [ref=e406]:
                - generic [ref=e407]: Nuevo
                - generic [ref=e408]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e409]:
              - paragraph [ref=e410]: Carolina Montero Orphanopoulos
              - heading "Bioética y Vulnerabilidad" [level=3] [ref=e411]
              - paragraph [ref=e412]: $16.000
          - link "Judíos y Cristianos Nuevo Últimas unidades Agregar Benedicto XVI Judíos y Cristianos $24.500" [ref=e413] [cursor=pointer]:
            - generic [ref=e414]:
              - img "Judíos y Cristianos" [ref=e415]
              - generic [ref=e416]:
                - generic [ref=e417]: Nuevo
                - generic [ref=e418]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e419]:
              - paragraph [ref=e420]: Benedicto XVI
              - heading "Judíos y Cristianos" [level=3] [ref=e421]
              - paragraph [ref=e422]: $24.500
          - link "Al Partir el Pan Bendecimos la Mesa Nuevo Últimas unidades Agregar Fredy Peña Al Partir el Pan Bendecimos la Mesa $10.000" [ref=e423] [cursor=pointer]:
            - generic [ref=e424]:
              - img "Al Partir el Pan Bendecimos la Mesa" [ref=e425]
              - generic [ref=e426]:
                - generic [ref=e427]: Nuevo
                - generic [ref=e428]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e429]:
              - paragraph [ref=e430]: Fredy Peña
              - heading "Al Partir el Pan Bendecimos la Mesa" [level=3] [ref=e431]
              - paragraph [ref=e432]: $10.000
          - link "Buscando el Reino de Dios Nuevo Últimas unidades Agregar Celso López, Eduardo Pérez Cotapos y Ana María Vicuña Buscando el Reino de Dios $17.000" [ref=e433] [cursor=pointer]:
            - generic [ref=e434]:
              - img "Buscando el Reino de Dios" [ref=e435]
              - generic [ref=e436]:
                - generic [ref=e437]: Nuevo
                - generic [ref=e438]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e439]:
              - paragraph [ref=e440]: Celso López, Eduardo Pérez Cotapos y Ana María Vicuña
              - heading "Buscando el Reino de Dios" [level=3] [ref=e441]
              - paragraph [ref=e442]: $17.000
          - link "Caminando con María Nuevo Últimas unidades Agregar Francisco Caminando con María $23.000" [ref=e443] [cursor=pointer]:
            - generic [ref=e444]:
              - img "Caminando con María" [ref=e445]
              - generic [ref=e446]:
                - generic [ref=e447]: Nuevo
                - generic [ref=e448]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e449]:
              - paragraph [ref=e450]: Francisco
              - heading "Caminando con María" [level=3] [ref=e451]
              - paragraph [ref=e452]: $23.000
          - link "Diario Ana Frank Nuevo Últimas unidades Agregar Diario Ana Frank $13.900" [ref=e453] [cursor=pointer]:
            - generic [ref=e454]:
              - img "Diario Ana Frank" [ref=e455]
              - generic [ref=e456]:
                - generic [ref=e457]: Nuevo
                - generic [ref=e458]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e459]:
              - heading "Diario Ana Frank" [level=3] [ref=e460]
              - paragraph [ref=e461]: $13.900
          - link "Padre Pío Nuevo Últimas unidades Agregar el santo de los estigmas Padre Pío $4.000" [ref=e462] [cursor=pointer]:
            - generic [ref=e463]:
              - img "Padre Pío" [ref=e464]
              - generic [ref=e465]:
                - generic [ref=e466]: Nuevo
                - generic [ref=e467]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e468]:
              - paragraph [ref=e469]: el santo de los estigmas
              - heading "Padre Pío" [level=3] [ref=e470]
              - paragraph [ref=e471]: $4.000
          - link "Por Si un Día Volvemos Nuevo Últimas unidades Agregar María Dueñas Por Si un Día Volvemos $31.000" [ref=e472] [cursor=pointer]:
            - generic [ref=e473]:
              - img "Por Si un Día Volvemos" [ref=e474]
              - generic [ref=e475]:
                - generic [ref=e476]: Nuevo
                - generic [ref=e477]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e478]:
              - paragraph [ref=e479]: María Dueñas
              - heading "Por Si un Día Volvemos" [level=3] [ref=e480]
              - paragraph [ref=e481]: $31.000
          - link "Caminos de Reparación Nuevo Últimas unidades Agregar Ricardo Capponi Caminos de Reparación $16.000" [ref=e482] [cursor=pointer]:
            - generic [ref=e483]:
              - img "Caminos de Reparación" [ref=e484]
              - generic [ref=e485]:
                - generic [ref=e486]: Nuevo
                - generic [ref=e487]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e488]:
              - paragraph [ref=e489]: Ricardo Capponi
              - heading "Caminos de Reparación" [level=3] [ref=e490]
              - paragraph [ref=e491]: $16.000
          - link "La Crisis de la Iglesia en Chile; Mirar las Heridas Nuevo Últimas unidades Agregar Sofía Brahm, Eduardo V La Crisis de la Iglesia en Chile; Mirar las Heridas $15.300" [ref=e492] [cursor=pointer]:
            - generic [ref=e493]:
              - img "La Crisis de la Iglesia en Chile; Mirar las Heridas" [ref=e494]
              - generic [ref=e495]:
                - generic [ref=e496]: Nuevo
                - generic [ref=e497]: Últimas unidades
              - generic:
                - button "Agregar"
            - generic [ref=e498]:
              - paragraph [ref=e499]: Sofía Brahm, Eduardo V
              - heading "La Crisis de la Iglesia en Chile; Mirar las Heridas" [level=3] [ref=e500]
              - paragraph [ref=e501]: $15.300
        - navigation "Paginacion" [ref=e502]:
          - button "Anterior" [disabled] [ref=e503]
          - generic [ref=e504]: Página 1 de 23
          - button "1" [ref=e506]
          - button "2" [ref=e508]
          - generic [ref=e509]:
            - generic [ref=e510]: ...
            - button "23" [ref=e511]
          - button "Siguiente" [ref=e512]
  - contentinfo [ref=e513]:
    - generic [ref=e521]:
      - generic [ref=e522]:
        - img "Crecer Librería" [ref=e523]
        - paragraph [ref=e524]: Crecer Libreria
        - paragraph [ref=e525]: Fe, lectura y formación
        - paragraph [ref=e526]: Una librería católica pensada para acompañar el estudio, la devoción y la vida diaria con una selección curada de títulos.
      - generic [ref=e527]:
        - heading "Catálogo" [level=4] [ref=e528]
        - generic [ref=e529]:
          - link "Coleccion completa" [ref=e530] [cursor=pointer]:
            - /url: /productos
          - link "Novedades" [ref=e531] [cursor=pointer]:
            - /url: /productos?filter=nuevo
      - generic [ref=e532]:
        - heading "Información" [level=4] [ref=e533]
        - generic [ref=e534]:
          - link "Mi carrito" [ref=e535] [cursor=pointer]:
            - /url: /carrito
          - link "Checkout" [ref=e536] [cursor=pointer]:
            - /url: /checkout
      - generic [ref=e537]:
        - heading "Ubicación" [level=4] [ref=e538]
        - generic [ref=e539]:
          - img [ref=e540]
          - paragraph [ref=e543]: Arturo Prat 470 / Antofagasta, Chile
        - link "Ver en el mapa →" [ref=e544] [cursor=pointer]:
          - /url: https://maps.google.com/?q=Arturo+Prat+470+Antofagasta
    - generic [ref=e545]:
      - paragraph [ref=e546]: © 2026 Crecer Libreria. Todos los derechos reservados.
      - generic [ref=e547]:
        - paragraph [ref=e548]: "Diseño: Hultur Studios"
        - link "·" [ref=e549] [cursor=pointer]:
          - /url: /admin/login
  - button "Open Next.js Dev Tools" [ref=e555] [cursor=pointer]:
    - img [ref=e556]
  - alert [ref=e559]
```

# Test source

```ts
  1  | /**
  2  |  * Tests del Catálogo (/productos)
  3  |  * Requiere datos en la BD — correr `npm run seed:products` antes.
  4  |  * Verifica carga de la página, filtros, orden y búsqueda.
  5  |  */
  6  | import { test, expect } from "@playwright/test";
  7  | 
  8  | test.describe("Catálogo /productos", () => {
  9  |   test.beforeEach(async ({ page }) => {
  10 |     await page.goto("/productos");
  11 |   });
  12 | 
  13 |   test("carga con header y grilla de productos", async ({ page }) => {
  14 |     // PageHeader con "Nuestra colección"
  15 |     await expect(page.getByRole("heading", { name: /colecci/i }).first()).toBeVisible();
  16 |     // FilterBar con label FILTRAR
> 17 |     await expect(page.getByText("FILTRAR")).toBeVisible();
     |                                             ^ Error: expect(locator).toBeVisible() failed
  18 |     // Al menos un producto en la grilla
  19 |     await expect(page.locator('article[role="link"]').first()).toBeVisible();
  20 |   });
  21 | 
  22 |   test("muestra el contador de resultados", async ({ page }) => {
  23 |     // FilterBar muestra "N productos"
  24 |     await expect(page.getByText(/productos?/)).toBeVisible();
  25 |   });
  26 | 
  27 |   test("chip 'Nuevos' actualiza la URL con filter=nuevo", async ({ page }) => {
  28 |     await page.getByRole("button", { name: "Nuevos" }).first().click();
  29 |     await expect(page).toHaveURL(/filter=nuevo/);
  30 |   });
  31 | 
  32 |   test("chip 'En oferta' actualiza la URL con filter=oferta", async ({ page }) => {
  33 |     await page.getByRole("button", { name: "En oferta" }).first().click();
  34 |     await expect(page).toHaveURL(/filter=oferta/);
  35 |   });
  36 | 
  37 |   test("chip 'Selección del mes' actualiza la URL con filter=seleccion", async ({ page }) => {
  38 |     await page.getByRole("button", { name: "Selección del mes" }).first().click();
  39 |     await expect(page).toHaveURL(/filter=seleccion/);
  40 |   });
  41 | 
  42 |   test.skip("chip 'Todos' limpia el filtro en la URL", async () => {
  43 |     // SKIP: El chip "Todos" usa router.push("/productos") de Next.js App Router,
  44 |     // que no dispara eventos de navegación detectables por Playwright cuando
  45 |     // la URL actual ya tiene un filter= (viene de navegación client-side previa).
  46 |     // waitForURL y waitForFunction en window.location.href confirman que el URL
  47 |     // genuinamente no cambia en el contexto de Playwright, aunque funciona
  48 |     // correctamente en el browser real.
  49 |     // Known issue: Next.js 15 + Turbopack + App Router pushState desde misma ruta.
  50 |   });
  51 | 
  52 |   test("botón de orden 'Precio: menor a mayor' actualiza URL", async ({ page }) => {
  53 |     await page.getByRole("button", { name: /menor a mayor/i }).first().click();
  54 |     await expect(page).toHaveURL(/sort=price_asc/);
  55 |   });
  56 | 
  57 |   test("búsqueda actualiza la URL con el parámetro search", async ({ page }) => {
  58 |     const searchInput = page.getByPlaceholder("Buscar...").first();
  59 |     await searchInput.fill("biblia");
  60 |     await searchInput.press("Enter");
  61 |     await expect(page).toHaveURL(/search=biblia/);
  62 |   });
  63 | 
  64 |   test("buscar un término vacío no agrega search a la URL", async ({ page }) => {
  65 |     const searchInput = page.getByPlaceholder("Buscar...").first();
  66 |     await searchInput.fill("  ");
  67 |     await searchInput.press("Enter");
  68 |     await expect(page).not.toHaveURL(/search=/);
  69 |   });
  70 | 
  71 |   test("hacer click en un producto navega al detalle", async ({ page }) => {
  72 |     const firstProduct = page.locator('article[role="link"]').first();
  73 |     await expect(firstProduct).toBeVisible();
  74 |     // Registrar listener antes del click para evitar race condition con router.push
  75 |     const navPromise = page.waitForURL(/\/productos\/.+/, { timeout: 10_000 });
  76 |     await firstProduct.click();
  77 |     await navPromise;
  78 |   });
  79 | });
  80 | 
```