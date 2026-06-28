# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: catalogo.spec.ts >> Catálogo /productos >> chip 'En oferta' actualiza la URL con filter=oferta
- Location: tests\catalogo.spec.ts:32:7

# Error details

```
TimeoutError: locator.click: Timeout 10000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'En oferta' }).first()

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
        - link "La Santa Misa Nuevo Agregar ordinario de la misa La Santa Misa $3.500" [ref=e63] [cursor=pointer]:
          - generic [ref=e64]:
            - img "La Santa Misa" [ref=e65]
            - generic [ref=e67]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e68]:
            - paragraph [ref=e69]: ordinario de la misa
            - heading "La Santa Misa" [level=3] [ref=e70]
            - paragraph [ref=e71]: $3.500
        - link "Recuerdo de mi Primera Comunión Nuevo Agregar san Pablo Recuerdo de mi Primera Comunión $12.500" [ref=e72] [cursor=pointer]:
          - generic [ref=e73]:
            - img "Recuerdo de mi Primera Comunión" [ref=e74]
            - generic [ref=e76]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e77]:
            - paragraph [ref=e78]: san Pablo
            - heading "Recuerdo de mi Primera Comunión" [level=3] [ref=e79]
            - paragraph [ref=e80]: $12.500
        - link "Para Qué Leer Nuevo Últimas unidades Agregar Marco Antonio de la Parra Para Qué Leer $13.000" [ref=e81] [cursor=pointer]:
          - generic [ref=e82]:
            - img "Para Qué Leer" [ref=e83]
            - generic [ref=e84]:
              - generic [ref=e85]: Nuevo
              - generic [ref=e86]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e87]:
            - paragraph [ref=e88]: Marco Antonio de la Parra
            - heading "Para Qué Leer" [level=3] [ref=e89]
            - paragraph [ref=e90]: $13.000
        - link "Bailar con el Tiempo Nuevo Agregar José María Rodríguez Olaizola, SJ Bailar con el Tiempo $22.000" [ref=e91] [cursor=pointer]:
          - generic [ref=e92]:
            - img "Bailar con el Tiempo" [ref=e93]
            - generic [ref=e95]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e96]:
            - paragraph [ref=e97]: José María Rodríguez Olaizola, SJ
            - heading "Bailar con el Tiempo" [level=3] [ref=e98]
            - paragraph [ref=e99]: $22.000
        - link "¿Por Qué Temo Decirte Quién Soy? John Powell, SJ Nuevo Últimas unidades Agregar John Powell ¿Por Qué Temo Decirte Quién Soy? John Powell, SJ $13.000" [ref=e100] [cursor=pointer]:
          - generic [ref=e101]:
            - img "¿Por Qué Temo Decirte Quién Soy? John Powell, SJ" [ref=e102]
            - generic [ref=e103]:
              - generic [ref=e104]: Nuevo
              - generic [ref=e105]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e106]:
            - paragraph [ref=e107]: John Powell
            - heading "¿Por Qué Temo Decirte Quién Soy? John Powell, SJ" [level=3] [ref=e108]
            - paragraph [ref=e109]: $13.000
        - link "100 Promesas de Oro para tu Vida Nuevo Últimas unidades Agregar caja metálica ovejita 100 Promesas de Oro para tu Vida $14.900" [ref=e110] [cursor=pointer]:
          - generic [ref=e111]:
            - img "100 Promesas de Oro para tu Vida" [ref=e112]
            - generic [ref=e113]:
              - generic [ref=e114]: Nuevo
              - generic [ref=e115]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e116]:
            - paragraph [ref=e117]: caja metálica ovejita
            - heading "100 Promesas de Oro para tu Vida" [level=3] [ref=e118]
            - paragraph [ref=e119]: $14.900
        - link "Breve Guía para Leer la Biblia Nuevo Últimas unidades Agregar Scott Hahn Breve Guía para Leer la Biblia $16.900" [ref=e120] [cursor=pointer]:
          - generic [ref=e121]:
            - img "Breve Guía para Leer la Biblia" [ref=e122]
            - generic [ref=e123]:
              - generic [ref=e124]: Nuevo
              - generic [ref=e125]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e126]:
            - paragraph [ref=e127]: Scott Hahn
            - heading "Breve Guía para Leer la Biblia" [level=3] [ref=e128]
            - paragraph [ref=e129]: $16.900
        - link "La Oración, Oxígeno del Creyente Nuevo Últimas unidades Agregar Jacques Philippe La Oración, Oxígeno del Creyente $16.900" [ref=e130] [cursor=pointer]:
          - generic [ref=e131]:
            - img "La Oración, Oxígeno del Creyente" [ref=e132]
            - generic [ref=e133]:
              - generic [ref=e134]: Nuevo
              - generic [ref=e135]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e136]:
            - paragraph [ref=e137]: Jacques Philippe
            - heading "La Oración, Oxígeno del Creyente" [level=3] [ref=e138]
            - paragraph [ref=e139]: $16.900
        - link "Adiós Tristeza Cómo Superar la Depresión según Santa Hildegarda Nuevo Últimas unidades Agregar Adiós Tristeza Cómo Superar la Depresión según Santa Hildegarda $29.900" [ref=e140] [cursor=pointer]:
          - generic [ref=e141]:
            - img "Adiós Tristeza Cómo Superar la Depresión según Santa Hildegarda" [ref=e142]
            - generic [ref=e143]:
              - generic [ref=e144]: Nuevo
              - generic [ref=e145]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e146]:
            - heading "Adiós Tristeza Cómo Superar la Depresión según Santa Hildegarda" [level=3] [ref=e147]
            - paragraph [ref=e148]: $29.900
        - link "Espiritualidad, para que mi Vida Tenga Sentido Nuevo Últimas unidades Agregar Anselm Grun Espiritualidad, para que mi Vida Tenga Sentido $12.900" [ref=e149] [cursor=pointer]:
          - generic [ref=e150]:
            - img "Espiritualidad, para que mi Vida Tenga Sentido" [ref=e151]
            - generic [ref=e152]:
              - generic [ref=e153]: Nuevo
              - generic [ref=e154]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e155]:
            - paragraph [ref=e156]: Anselm Grun
            - heading "Espiritualidad, para que mi Vida Tenga Sentido" [level=3] [ref=e157]
            - paragraph [ref=e158]: $12.900
        - link "Abuelo ¿Cuál Es tu Historia? Un Diario Guiado para que tu Abuelo Comparta Nuevo Últimas unidades Agregar Abuelo ¿Cuál Es tu Historia? Un Diario Guiado para que tu Abuelo Comparta $20.000" [ref=e159] [cursor=pointer]:
          - generic [ref=e160]:
            - img "Abuelo ¿Cuál Es tu Historia? Un Diario Guiado para que tu Abuelo Comparta" [ref=e161]
            - generic [ref=e162]:
              - generic [ref=e163]: Nuevo
              - generic [ref=e164]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e165]:
            - heading "Abuelo ¿Cuál Es tu Historia? Un Diario Guiado para que tu Abuelo Comparta" [level=3] [ref=e166]
            - paragraph [ref=e167]: $20.000
        - link "¿Hay Razones para Creer en Jesús? Nuevo Últimas unidades Agregar Sergio Silva Gatica ¿Hay Razones para Creer en Jesús? $16.000" [ref=e168] [cursor=pointer]:
          - generic [ref=e169]:
            - img "¿Hay Razones para Creer en Jesús?" [ref=e170]
            - generic [ref=e171]:
              - generic [ref=e172]: Nuevo
              - generic [ref=e173]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e174]:
            - paragraph [ref=e175]: Sergio Silva Gatica
            - heading "¿Hay Razones para Creer en Jesús?" [level=3] [ref=e176]
            - paragraph [ref=e177]: $16.000
        - link "La Pasión de Cristo Nuevo Últimas unidades Agregar José Miguel Ibáñez Langlois La Pasión de Cristo $17.900" [ref=e178] [cursor=pointer]:
          - generic [ref=e179]:
            - img "La Pasión de Cristo" [ref=e180]
            - generic [ref=e181]:
              - generic [ref=e182]: Nuevo
              - generic [ref=e183]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e184]:
            - paragraph [ref=e185]: José Miguel Ibáñez Langlois
            - heading "La Pasión de Cristo" [level=3] [ref=e186]
            - paragraph [ref=e187]: $17.900
        - link "Marco - Aparición de Nuestra Señora de Lourdes Nuevo Últimas unidades Agregar Marco - Aparición de Nuestra Señora de Lourdes $15.000" [ref=e188] [cursor=pointer]:
          - generic [ref=e189]:
            - img "Marco - Aparición de Nuestra Señora de Lourdes" [ref=e190]
            - generic [ref=e191]:
              - generic [ref=e192]: Nuevo
              - generic [ref=e193]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e194]:
            - heading "Marco - Aparición de Nuestra Señora de Lourdes" [level=3] [ref=e195]
            - paragraph [ref=e196]: $15.000
        - link "Pieza Magnética - Virgen de la Ternura Nuevo Últimas unidades Agregar Pieza Magnética - Virgen de la Ternura $7.990" [ref=e197] [cursor=pointer]:
          - generic [ref=e198]:
            - img "Pieza Magnética - Virgen de la Ternura" [ref=e199]
            - generic [ref=e200]:
              - generic [ref=e201]: Nuevo
              - generic [ref=e202]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e203]:
            - heading "Pieza Magnética - Virgen de la Ternura" [level=3] [ref=e204]
            - paragraph [ref=e205]: $7.990
        - link "Perspectivas Teológico Pastorales Chilenas; Iglesia Sinodal Nuevo Últimas unidades Agregar José Ignacio F Perspectivas Teológico Pastorales Chilenas; Iglesia Sinodal $8.000" [ref=e206] [cursor=pointer]:
          - generic [ref=e207]:
            - img "Perspectivas Teológico Pastorales Chilenas; Iglesia Sinodal" [ref=e208]
            - generic [ref=e209]:
              - generic [ref=e210]: Nuevo
              - generic [ref=e211]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e212]:
            - paragraph [ref=e213]: José Ignacio F
            - heading "Perspectivas Teológico Pastorales Chilenas; Iglesia Sinodal" [level=3] [ref=e214]
            - paragraph [ref=e215]: $8.000
        - link "Derecho Eclesiástico del Estado de Chile Nuevo Últimas unidades Agregar Jorge Precht Pizarro Derecho Eclesiástico del Estado de Chile $16.000" [ref=e216] [cursor=pointer]:
          - generic [ref=e217]:
            - img "Derecho Eclesiástico del Estado de Chile" [ref=e218]
            - generic [ref=e219]:
              - generic [ref=e220]: Nuevo
              - generic [ref=e221]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e222]:
            - paragraph [ref=e223]: Jorge Precht Pizarro
            - heading "Derecho Eclesiástico del Estado de Chile" [level=3] [ref=e224]
            - paragraph [ref=e225]: $16.000
        - link "Antonio Rendic, Itinerario Espiritual de un Poeta Nuevo Agregar Eva Reyes Gacitúa Antonio Rendic, Itinerario Espiritual de un Poeta $15.000" [ref=e226] [cursor=pointer]:
          - generic [ref=e227]:
            - img "Antonio Rendic, Itinerario Espiritual de un Poeta" [ref=e228]
            - generic [ref=e230]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e231]:
            - paragraph [ref=e232]: Eva Reyes Gacitúa
            - heading "Antonio Rendic, Itinerario Espiritual de un Poeta" [level=3] [ref=e233]
            - paragraph [ref=e234]: $15.000
        - link "Antropologia del Dolor Nuevo Últimas unidades Agregar DAVID LE BRETON Antropologia del Dolor $24.000" [ref=e235] [cursor=pointer]:
          - generic [ref=e236]:
            - img "Antropologia del Dolor" [ref=e237]
            - generic [ref=e238]:
              - generic [ref=e239]: Nuevo
              - generic [ref=e240]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e241]:
            - paragraph [ref=e242]: DAVID LE BRETON
            - heading "Antropologia del Dolor" [level=3] [ref=e243]
            - paragraph [ref=e244]: $24.000
        - link "Héroes de Babilonia - Pequeños Héroes de la Biblia Nuevo Últimas unidades Agregar Héroes de Babilonia - Pequeños Héroes de la Biblia $5.500" [ref=e245] [cursor=pointer]:
          - generic [ref=e246]:
            - img "Héroes de Babilonia - Pequeños Héroes de la Biblia" [ref=e247]
            - generic [ref=e248]:
              - generic [ref=e249]: Nuevo
              - generic [ref=e250]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e251]:
            - heading "Héroes de Babilonia - Pequeños Héroes de la Biblia" [level=3] [ref=e252]
            - paragraph [ref=e253]: $5.500
        - link "Aprendizaje en Profundidad Nuevo Últimas unidades Agregar Kieran Egan Aprendizaje en Profundidad $12.000" [ref=e254] [cursor=pointer]:
          - generic [ref=e255]:
            - img "Aprendizaje en Profundidad" [ref=e256]
            - generic [ref=e257]:
              - generic [ref=e258]: Nuevo
              - generic [ref=e259]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e260]:
            - paragraph [ref=e261]: Kieran Egan
            - heading "Aprendizaje en Profundidad" [level=3] [ref=e262]
            - paragraph [ref=e263]: $12.000
        - link "Aqui y Ahora Nuevo Últimas unidades Agregar Henry J M Nouwen Aqui y Ahora $27.800" [ref=e264] [cursor=pointer]:
          - generic [ref=e265]:
            - img "Aqui y Ahora" [ref=e266]
            - generic [ref=e267]:
              - generic [ref=e268]: Nuevo
              - generic [ref=e269]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e270]:
            - paragraph [ref=e271]: Henry J M Nouwen
            - heading "Aqui y Ahora" [level=3] [ref=e272]
            - paragraph [ref=e273]: $27.800
        - link "Así de Profundo Es el Logos Nuevo Últimas unidades Agregar Andrea Potestà Así de Profundo Es el Logos $13.600" [ref=e274] [cursor=pointer]:
          - generic [ref=e275]:
            - img "Así de Profundo Es el Logos" [ref=e276]
            - generic [ref=e277]:
              - generic [ref=e278]: Nuevo
              - generic [ref=e279]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e280]:
            - paragraph [ref=e281]: Andrea Potestà
            - heading "Así de Profundo Es el Logos" [level=3] [ref=e282]
            - paragraph [ref=e283]: $13.600
        - link "Atrévete a Ser Quien Eres (Aunque Nos Gustes) Nuevo Últimas unidades Agregar Walter Riso Atrévete a Ser Quien Eres (Aunque Nos Gustes) $21.900" [ref=e284] [cursor=pointer]:
          - generic [ref=e285]:
            - img "Atrévete a Ser Quien Eres (Aunque Nos Gustes)" [ref=e286]
            - generic [ref=e287]:
              - generic [ref=e288]: Nuevo
              - generic [ref=e289]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e290]:
            - paragraph [ref=e291]: Walter Riso
            - heading "Atrévete a Ser Quien Eres (Aunque Nos Gustes)" [level=3] [ref=e292]
            - paragraph [ref=e293]: $21.900
        - link "¿Quién Eres? Nuevo Últimas unidades Agregar Enrique Rojas ¿Quién Eres? $16.900" [ref=e294] [cursor=pointer]:
          - generic [ref=e295]:
            - img "¿Quién Eres?" [ref=e296]
            - generic [ref=e297]:
              - generic [ref=e298]: Nuevo
              - generic [ref=e299]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e300]:
            - paragraph [ref=e301]: Enrique Rojas
            - heading "¿Quién Eres?" [level=3] [ref=e302]
            - paragraph [ref=e303]: $16.900
        - link "Aprender el Arte de Acompañar Nuevo Últimas unidades Agregar Manuel Sánchez Monge Aprender el Arte de Acompañar $35.000" [ref=e304] [cursor=pointer]:
          - generic [ref=e305]:
            - img "Aprender el Arte de Acompañar" [ref=e306]
            - generic [ref=e307]:
              - generic [ref=e308]: Nuevo
              - generic [ref=e309]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e310]:
            - paragraph [ref=e311]: Manuel Sánchez Monge
            - heading "Aprender el Arte de Acompañar" [level=3] [ref=e312]
            - paragraph [ref=e313]: $35.000
        - link "Bailarines en el Desierto, Tres Sociedades de Baile Nuevo Últimas unidades Agregar Juan Van Kessel Bailarines en el Desierto, Tres Sociedades de Baile $22.400" [ref=e314] [cursor=pointer]:
          - generic [ref=e315]:
            - img "Bailarines en el Desierto, Tres Sociedades de Baile" [ref=e316]
            - generic [ref=e317]:
              - generic [ref=e318]: Nuevo
              - generic [ref=e319]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e320]:
            - paragraph [ref=e321]: Juan Van Kessel
            - heading "Bailarines en el Desierto, Tres Sociedades de Baile" [level=3] [ref=e322]
            - paragraph [ref=e323]: $22.400
        - link "Por Qué Sufrir, el Sentido Trascendente del Dolor Nuevo Agregar José Miguel Ibánez Langlois Por Qué Sufrir, el Sentido Trascendente del Dolor $19.000" [ref=e324] [cursor=pointer]:
          - generic [ref=e325]:
            - img "Por Qué Sufrir, el Sentido Trascendente del Dolor" [ref=e326]
            - generic [ref=e328]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e329]:
            - paragraph [ref=e330]: José Miguel Ibánez Langlois
            - heading "Por Qué Sufrir, el Sentido Trascendente del Dolor" [level=3] [ref=e331]
            - paragraph [ref=e332]: $19.000
        - link "Biblia de la Iglesia en América Nuevo Últimas unidades Agregar Varios autores Biblia de la Iglesia en América $44.200" [ref=e333] [cursor=pointer]:
          - generic [ref=e334]:
            - img "Biblia de la Iglesia en América" [ref=e335]
            - generic [ref=e336]:
              - generic [ref=e337]: Nuevo
              - generic [ref=e338]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e339]:
            - paragraph [ref=e340]: Varios autores
            - heading "Biblia de la Iglesia en América" [level=3] [ref=e341]
            - paragraph [ref=e342]: $44.200
        - link "Biblia del Peregrino - Creer Creando Nuevo Agregar Luis Alonso Schokel Biblia del Peregrino - Creer Creando $42.000" [ref=e343] [cursor=pointer]:
          - generic [ref=e344]:
            - img "Biblia del Peregrino - Creer Creando" [ref=e345]
            - generic [ref=e347]: Nuevo
            - generic:
              - button "Agregar"
          - generic [ref=e348]:
            - paragraph [ref=e349]: Luis Alonso Schokel
            - heading "Biblia del Peregrino - Creer Creando" [level=3] [ref=e350]
            - paragraph [ref=e351]: $42.000
        - link "Bioética y Vulnerabilidad Nuevo Últimas unidades Agregar Carolina Montero Orphanopoulos Bioética y Vulnerabilidad $16.000" [ref=e352] [cursor=pointer]:
          - generic [ref=e353]:
            - img "Bioética y Vulnerabilidad" [ref=e354]
            - generic [ref=e355]:
              - generic [ref=e356]: Nuevo
              - generic [ref=e357]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e358]:
            - paragraph [ref=e359]: Carolina Montero Orphanopoulos
            - heading "Bioética y Vulnerabilidad" [level=3] [ref=e360]
            - paragraph [ref=e361]: $16.000
        - link "Judíos y Cristianos Nuevo Últimas unidades Agregar Benedicto XVI Judíos y Cristianos $24.500" [ref=e362] [cursor=pointer]:
          - generic [ref=e363]:
            - img "Judíos y Cristianos" [ref=e364]
            - generic [ref=e365]:
              - generic [ref=e366]: Nuevo
              - generic [ref=e367]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e368]:
            - paragraph [ref=e369]: Benedicto XVI
            - heading "Judíos y Cristianos" [level=3] [ref=e370]
            - paragraph [ref=e371]: $24.500
        - link "Al Partir el Pan Bendecimos la Mesa Nuevo Últimas unidades Agregar Fredy Peña Al Partir el Pan Bendecimos la Mesa $10.000" [ref=e372] [cursor=pointer]:
          - generic [ref=e373]:
            - img "Al Partir el Pan Bendecimos la Mesa" [ref=e374]
            - generic [ref=e375]:
              - generic [ref=e376]: Nuevo
              - generic [ref=e377]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e378]:
            - paragraph [ref=e379]: Fredy Peña
            - heading "Al Partir el Pan Bendecimos la Mesa" [level=3] [ref=e380]
            - paragraph [ref=e381]: $10.000
        - link "Buscando el Reino de Dios Nuevo Últimas unidades Agregar Celso López, Eduardo Pérez Cotapos y Ana María Vicuña Buscando el Reino de Dios $17.000" [ref=e382] [cursor=pointer]:
          - generic [ref=e383]:
            - img "Buscando el Reino de Dios" [ref=e384]
            - generic [ref=e385]:
              - generic [ref=e386]: Nuevo
              - generic [ref=e387]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e388]:
            - paragraph [ref=e389]: Celso López, Eduardo Pérez Cotapos y Ana María Vicuña
            - heading "Buscando el Reino de Dios" [level=3] [ref=e390]
            - paragraph [ref=e391]: $17.000
        - link "Caminando con María Nuevo Últimas unidades Agregar Francisco Caminando con María $23.000" [ref=e392] [cursor=pointer]:
          - generic [ref=e393]:
            - img "Caminando con María" [ref=e394]
            - generic [ref=e395]:
              - generic [ref=e396]: Nuevo
              - generic [ref=e397]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e398]:
            - paragraph [ref=e399]: Francisco
            - heading "Caminando con María" [level=3] [ref=e400]
            - paragraph [ref=e401]: $23.000
        - link "Diario Ana Frank Nuevo Últimas unidades Agregar Diario Ana Frank $13.900" [ref=e402] [cursor=pointer]:
          - generic [ref=e403]:
            - img "Diario Ana Frank" [ref=e404]
            - generic [ref=e405]:
              - generic [ref=e406]: Nuevo
              - generic [ref=e407]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e408]:
            - heading "Diario Ana Frank" [level=3] [ref=e409]
            - paragraph [ref=e410]: $13.900
        - link "Padre Pío Nuevo Últimas unidades Agregar el santo de los estigmas Padre Pío $4.000" [ref=e411] [cursor=pointer]:
          - generic [ref=e412]:
            - img "Padre Pío" [ref=e413]
            - generic [ref=e414]:
              - generic [ref=e415]: Nuevo
              - generic [ref=e416]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e417]:
            - paragraph [ref=e418]: el santo de los estigmas
            - heading "Padre Pío" [level=3] [ref=e419]
            - paragraph [ref=e420]: $4.000
        - link "Por Si un Día Volvemos Nuevo Últimas unidades Agregar María Dueñas Por Si un Día Volvemos $31.000" [ref=e421] [cursor=pointer]:
          - generic [ref=e422]:
            - img "Por Si un Día Volvemos" [ref=e423]
            - generic [ref=e424]:
              - generic [ref=e425]: Nuevo
              - generic [ref=e426]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e427]:
            - paragraph [ref=e428]: María Dueñas
            - heading "Por Si un Día Volvemos" [level=3] [ref=e429]
            - paragraph [ref=e430]: $31.000
        - link "Caminos de Reparación Nuevo Últimas unidades Agregar Ricardo Capponi Caminos de Reparación $16.000" [ref=e431] [cursor=pointer]:
          - generic [ref=e432]:
            - img "Caminos de Reparación" [ref=e433]
            - generic [ref=e434]:
              - generic [ref=e435]: Nuevo
              - generic [ref=e436]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e437]:
            - paragraph [ref=e438]: Ricardo Capponi
            - heading "Caminos de Reparación" [level=3] [ref=e439]
            - paragraph [ref=e440]: $16.000
        - link "La Crisis de la Iglesia en Chile; Mirar las Heridas Nuevo Últimas unidades Agregar Sofía Brahm, Eduardo V La Crisis de la Iglesia en Chile; Mirar las Heridas $15.300" [ref=e441] [cursor=pointer]:
          - generic [ref=e442]:
            - img "La Crisis de la Iglesia en Chile; Mirar las Heridas" [ref=e443]
            - generic [ref=e444]:
              - generic [ref=e445]: Nuevo
              - generic [ref=e446]: Últimas unidades
            - generic:
              - button "Agregar"
          - generic [ref=e447]:
            - paragraph [ref=e448]: Sofía Brahm, Eduardo V
            - heading "La Crisis de la Iglesia en Chile; Mirar las Heridas" [level=3] [ref=e449]
            - paragraph [ref=e450]: $15.300
      - navigation "Paginacion" [ref=e451]:
        - button "Anterior" [disabled] [ref=e452]
        - generic [ref=e453]: Página 1 de 23
        - button "1" [ref=e455]
        - button "2" [ref=e457]
        - generic [ref=e458]:
          - generic [ref=e459]: ...
          - button "23" [ref=e460]
        - button "Siguiente" [ref=e461]
  - contentinfo [ref=e462]:
    - generic [ref=e470]:
      - generic [ref=e471]:
        - img "Crecer Librería" [ref=e472]
        - paragraph [ref=e473]: Crecer Libreria
        - paragraph [ref=e474]: Fe, lectura y formación
        - paragraph [ref=e475]: Una librería católica pensada para acompañar el estudio, la devoción y la vida diaria con una selección curada de títulos.
      - generic [ref=e476]:
        - heading "Catálogo" [level=4] [ref=e477]
        - generic [ref=e478]:
          - link "Coleccion completa" [ref=e479] [cursor=pointer]:
            - /url: /productos
          - link "Novedades" [ref=e480] [cursor=pointer]:
            - /url: /productos?filter=nuevo
      - generic [ref=e481]:
        - heading "Información" [level=4] [ref=e482]
        - generic [ref=e483]:
          - link "Mi carrito" [ref=e484] [cursor=pointer]:
            - /url: /carrito
          - link "Checkout" [ref=e485] [cursor=pointer]:
            - /url: /checkout
      - generic [ref=e486]:
        - heading "Ubicación" [level=4] [ref=e487]
        - generic [ref=e488]:
          - img [ref=e489]
          - paragraph [ref=e492]: Arturo Prat 470 / Antofagasta, Chile
        - link "Ver en el mapa →" [ref=e493] [cursor=pointer]:
          - /url: https://maps.google.com/?q=Arturo+Prat+470+Antofagasta
    - generic [ref=e494]:
      - paragraph [ref=e495]: © 2026 Crecer Libreria. Todos los derechos reservados.
      - generic [ref=e496]:
        - paragraph [ref=e497]: "Diseño: Hultur Studios"
        - link "·" [ref=e498] [cursor=pointer]:
          - /url: /admin/login
  - button "Open Next.js Dev Tools" [ref=e504] [cursor=pointer]:
    - img [ref=e505]
  - alert [ref=e508]
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
  17 |     await expect(page.getByText("FILTRAR")).toBeVisible();
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
> 33 |     await page.getByRole("button", { name: "En oferta" }).first().click();
     |                                                                   ^ TimeoutError: locator.click: Timeout 10000ms exceeded.
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