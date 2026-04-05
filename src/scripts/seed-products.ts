import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });

async function run() {
  const [{ db }, { products, categories, productCategories, featuredProducts, heroSlides }] =
    await Promise.all([
      import("../integrations/drizzle"),
      import("../integrations/drizzle/schema"),
    ]);

  // ── 1. Categorías ─────────────────────────────────────────────────────────
  console.warn("Insertando categorías...");

  const categoryData = [
    { name: "Biblia", slug: "biblia", description: "Textos bíblicos, comentarios y guías de lectura del Antiguo y Nuevo Testamento.", featured: true, displayOrder: 1, isActive: true },
    { name: "Espiritualidad", slug: "espiritualidad", description: "Libros de oración, vida interior y crecimiento espiritual.", featured: true, displayOrder: 2, isActive: true },
    { name: "Espiritualidad Ignaciana", slug: "espiritualidad-ignaciana", description: "Obras inspiradas en el carisma de San Ignacio de Loyola y los Ejercicios Espirituales.", featured: true, displayOrder: 3, isActive: true },
    { name: "Santos y Biografías", slug: "santos-y-biografias", description: "Vidas y testimonios de los santos y beatos de la Iglesia.", featured: true, displayOrder: 4, isActive: true },
    { name: "Liturgia", slug: "liturgia", description: "Recursos litúrgicos, devocionarios y guías de celebración.", featured: true, displayOrder: 5, isActive: true },
    { name: "Teología", slug: "teologia", description: "Estudios teológicos, doctrina y pensamiento cristiano.", featured: true, displayOrder: 6, isActive: true },
    { name: "Psicología y Fe", slug: "psicologia-y-fe", description: "Integración entre psicología, espiritualidad y vida cristiana.", featured: false, displayOrder: 7, isActive: true },
    { name: "Familia y Vida Cristiana", slug: "familia-y-vida-cristiana", description: "Libros para el hogar, la familia y el vivir cotidiano desde la fe.", featured: false, displayOrder: 8, isActive: true },
    { name: "Devocionario", slug: "devocionario", description: "Novenas, oraciones y libros de devoción popular.", featured: false, displayOrder: 9, isActive: true },
  ];

  const insertedCategories = await db
    .insert(categories)
    .values(categoryData)
    .onConflictDoNothing({ target: categories.slug })
    .returning({ id: categories.id, slug: categories.slug });

  console.warn("  → " + insertedCategories.length + " categorías insertadas");

  const categoryMap = new Map(insertedCategories.map((c) => [c.slug, c.id]));

  // ── 2. Productos ──────────────────────────────────────────────────────────
  console.warn("Insertando productos...");

  const productData = [
    { title: "La Sagrada Biblia — Edición Latinoamericana", slug: "sagrada-biblia-edicion-latinoamericana", sku: "CRECER-001", author: "Varios autores", description: "La edición latinoamericana de la Biblia católica, ampliamente utilizada en comunidades de fe de toda América Latina. Incluye notas pastorales y referencias cruzadas.", price: 30000, coverType: "Tapa dura", pages: 1800, inStock: true, stockQuantity: 12, mainImageUrl: null, isFeatured: true, isActive: true, categorySlug: "biblia" },
    { title: "Biblia Latinoamérica — Letra Grande", slug: "biblia-latinoamerica-letra-grande", sku: "CRECER-002", author: "Varios autores", description: "Edición de letra grande pensada para facilitar la lectura en grupos y comunidades. Texto íntegro con notas pastorales.", price: 26000, coverType: "Tapa blanda", pages: 1800, inStock: true, stockQuantity: 8, mainImageUrl: null, isFeatured: false, isActive: true, categorySlug: "biblia" },
    { title: "Biblia Católica para Jóvenes", slug: "biblia-catolica-para-jovenes", sku: "CRECER-003", author: "Varios autores", description: "Una Biblia pensada para jóvenes, con lenguaje accesible, ilustraciones y comentarios que conectan el mensaje bíblico con la vida cotidiana.", price: 29000, salePrice: 26000, coverType: "Tapa blanda", pages: 1600, inStock: true, stockQuantity: 10, mainImageUrl: null, isFeatured: false, isActive: true, categorySlug: "biblia" },
    { title: "La Liturgia Cotidiana 2026", slug: "liturgia-cotidiana-2026", sku: "CRECER-004", author: "Equipo San Pablo", description: "Guía litúrgica completa para el año 2026. Incluye lecturas del día, reflexiones, santoral y celebraciones del calendario litúrgico romano.", price: 4700, coverType: "Tapa blanda", pages: 380, inStock: true, stockQuantity: 30, mainImageUrl: null, isFeatured: false, isActive: true, categorySlug: "liturgia" },
    { title: "Liturgia de las Horas del Pueblo", slug: "liturgia-de-las-horas-del-pueblo", sku: "CRECER-005", author: "Varios autores", description: "Versión popular de la Liturgia de las Horas para uso comunitario. Incluye Laudes, Vísperas y Completas con cantos y oraciones adaptadas para asambleas.", price: 22000, coverType: "Tapa blanda", pages: 450, inStock: true, stockQuantity: 7, mainImageUrl: null, isFeatured: false, isActive: true, categorySlug: "liturgia" },
    { title: "La Belleza de la Liturgia", slug: "la-belleza-de-la-liturgia", sku: "CRECER-006", author: "Varios autores", description: "Una reflexión sobre el sentido profundo de la celebración litúrgica: sus gestos, símbolos y la participación activa del pueblo de Dios.", price: 22500, coverType: "Tapa blanda", pages: 210, inStock: true, stockQuantity: 6, mainImageUrl: null, isFeatured: false, isActive: true, categorySlug: "liturgia" },
    { title: "El Alma de Todo Apostolado", slug: "el-alma-de-todo-apostolado", sku: "CRECER-007", author: "J.-B. Chautard", description: "Un clásico de la espiritualidad cristiana que muestra cómo la vida interior es el fundamento de toda obra apostólica. Lectura indispensable para quienes sirven en la Iglesia.", price: 46000, coverType: "Tapa blanda", pages: 320, inStock: true, stockQuantity: 5, mainImageUrl: null, isFeatured: true, isActive: true, categorySlug: "espiritualidad" },
    { title: "Ejercicios Espirituales de San Ignacio", slug: "ejercicios-espirituales-san-ignacio", sku: "CRECER-008", author: "San Ignacio de Loyola", description: "El texto fundacional de la espiritualidad ignaciana. Una guía para el discernimiento, la oración y el encuentro personal con Dios a través de cuatro semanas de meditación.", price: 31000, coverType: "Tapa blanda", pages: 280, inStock: true, stockQuantity: 9, mainImageUrl: null, isFeatured: true, isActive: true, categorySlug: "espiritualidad-ignaciana" },
    { title: "La Espiritualidad Ignaciana", slug: "la-espiritualidad-ignaciana", sku: "CRECER-009", author: "Varios autores", description: "Introducción completa al carisma ignaciano: su historia, sus métodos de oración y su influencia en la vida espiritual contemporánea.", price: 22000, coverType: "Tapa blanda", pages: 240, inStock: true, stockQuantity: 8, mainImageUrl: null, isFeatured: false, isActive: true, categorySlug: "espiritualidad-ignaciana" },
    { title: "Amar y Servir a Cristo", slug: "amar-y-servir-a-cristo", sku: "CRECER-010", author: "Varios autores", description: "Reflexiones ignacianas sobre el seguimiento de Cristo en la vida ordinaria. Una guía práctica para vivir el magis en el trabajo, la familia y la oración.", price: 16000, coverType: "Tapa blanda", pages: 190, inStock: true, stockQuantity: 10, mainImageUrl: null, isFeatured: false, isActive: true, categorySlug: "espiritualidad-ignaciana" },
    { title: "Discernimiento Espiritual Ignaciano", slug: "discernimiento-espiritual-ignaciano", sku: "CRECER-011", author: "Varios autores", description: "Una guía práctica para aprender a discernir la voluntad de Dios según el método ignaciano. Ideal para retiros, grupos de oración y dirección espiritual.", price: 9500, coverType: "Tapa blanda", pages: 120, inStock: true, stockQuantity: 15, mainImageUrl: null, isFeatured: false, isActive: true, categorySlug: "espiritualidad-ignaciana" },
    { title: "Experiencia de Dios en San Ignacio", slug: "experiencia-de-dios-san-ignacio", sku: "CRECER-012", author: "Varios autores", description: "Exploración de cómo San Ignacio experimentó a Dios y cómo esa experiencia dio forma a sus Ejercicios y a la Compañía de Jesús.", price: 9500, coverType: "Tapa blanda", pages: 130, inStock: true, stockQuantity: 12, mainImageUrl: null, isFeatured: false, isActive: true, categorySlug: "espiritualidad-ignaciana" },
    { title: "Padre Pío — Siete Años de Misterio", slug: "padre-pio-siete-anos-de-misterio", sku: "CRECER-013", author: "Donato Calabrese", description: "Una mirada íntima a los años más intensos del Padre Pío: sus estigmas, sus penitentes, sus visiones y su entrega total a Dios como confesor y místico.", price: 24000, coverType: "Tapa blanda", pages: 260, inStock: true, stockQuantity: 7, mainImageUrl: null, isFeatured: false, isActive: true, categorySlug: "santos-y-biografias" },
    { title: "El Gran Libro de los Santos Protectores", slug: "gran-libro-santos-protectores", sku: "CRECER-014", author: "Rino Cammilleri", description: "Una enciclopedia devocional que presenta a los santos patronos de cada día, oficio, enfermedad y necesidad. Referencia esencial para la devoción popular.", price: 35000, coverType: "Tapa dura", pages: 480, inStock: true, stockQuantity: 4, mainImageUrl: null, isFeatured: false, isActive: true, categorySlug: "santos-y-biografias" },
    { title: "Teología Espiritual", slug: "teologia-espiritual", sku: "CRECER-015", author: "Varios autores", description: "Un estudio sistemático de la vida espiritual cristiana desde la perspectiva teológica. Aborda la oración, los carismas, la mística y el camino hacia la santidad.", price: 25500, coverType: "Tapa blanda", pages: 340, inStock: true, stockQuantity: 6, mainImageUrl: null, isFeatured: false, isActive: true, categorySlug: "teologia" },
    { title: "Espiritualidad Ignaciana y Educación", slug: "espiritualidad-ignaciana-y-educacion", sku: "CRECER-016", author: "Varios autores", description: "Reflexión sobre cómo la pedagogía ignaciana transforma la educación: el cuidado de la persona, el discernimiento y el servicio como valores formativos.", price: 9500, coverType: "Tapa blanda", pages: 140, inStock: true, stockQuantity: 10, mainImageUrl: null, isFeatured: false, isActive: true, categorySlug: "teologia" },
    { title: "Psicología y Espiritualidad Ignaciana", slug: "psicologia-y-espiritualidad-ignaciana", sku: "CRECER-017", author: "Varios autores", description: "Un diálogo fructífero entre la psicología moderna y la tradición ignaciana. Explora cómo el autoconocimiento psicológico puede enriquecer el discernimiento espiritual.", price: 9500, coverType: "Tapa blanda", pages: 160, inStock: true, stockQuantity: 8, mainImageUrl: null, isFeatured: false, isActive: true, categorySlug: "psicologia-y-fe" },
    { title: "Psicología y Fe Cristiana", slug: "psicologia-y-fe-cristiana", sku: "CRECER-018", author: "Gary R. Collins", description: "Una integración profunda entre la psicología contemporánea y la fe cristiana. Collins muestra cómo ambas disciplinas se complementan en el servicio a la persona humana.", price: 20000, coverType: "Tapa blanda", pages: 290, inStock: true, stockQuantity: 7, mainImageUrl: null, isFeatured: false, isActive: true, categorySlug: "psicologia-y-fe" },
    { title: "Familia, enciende en tu seno la luz de Cristo", slug: "familia-enciende-la-luz-de-cristo", sku: "CRECER-019", author: "Ricardo E. Facci", description: "Una propuesta concreta para que el hogar sea escuela de fe: oración familiar, testimonio, los sacramentos y la misión de los padres como primeros evangelizadores.", price: 9000, coverType: "Tapa blanda", pages: 160, inStock: true, stockQuantity: 15, mainImageUrl: null, isFeatured: false, isActive: true, categorySlug: "familia-y-vida-cristiana" },
    { title: "Novena a la Madre Tres Veces Admirable de Schoenstatt", slug: "novena-madre-tres-veces-admirable-schoenstatt", sku: "CRECER-020", author: "Hna. Gunthildis", description: "Novena tradicional a la Mater de Schoenstatt, con oraciones, meditaciones y actos de consagración para rezar durante nueve días consecutivos.", price: 4500, coverType: "Tapa blanda", pages: 48, inStock: true, stockQuantity: 25, mainImageUrl: null, isFeatured: false, isActive: true, categorySlug: "devocionario" },
  ];

  const insertedProducts = await db
    .insert(products)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .values(productData.map(({ categorySlug, ...rest }) => rest))
    .onConflictDoNothing({ target: products.slug })
    .returning({ id: products.id, slug: products.slug });

  console.warn("  → " + insertedProducts.length + " productos insertados");

  // ── 3. Relaciones producto ↔ categoría ────────────────────────────────────
  if (insertedProducts.length > 0) {
    console.warn("Asignando categorías a productos...");
    const slugToId = new Map(insertedProducts.map((p) => [p.slug, p.id]));
    const relations = productData
      .filter((p) => slugToId.has(p.slug) && categoryMap.has(p.categorySlug))
      .map((p) => ({ productId: slugToId.get(p.slug)!, categoryId: categoryMap.get(p.categorySlug)! }));
    if (relations.length > 0) {
      await db.insert(productCategories).values(relations).onConflictDoNothing();
      console.warn("  → " + relations.length + " relaciones producto-categoría insertadas");
    }
  }

  // ── 4. Hero slide ─────────────────────────────────────────────────────────
  console.warn("Insertando hero slide...");
  const existingSlide = await db.select({ id: heroSlides.id }).from(heroSlides).limit(1);
  if (existingSlide.length === 0) {
    await db.insert(heroSlides).values({ title: "Crecer Librería Cristiana", subtitle: "Librería Católica · Antofagasta", imageUrl: "", linkUrl: "/productos", displayOrder: 0, isActive: true });
    console.warn("  → Hero slide insertado");
  } else {
    console.warn("  → Hero slide ya existe, omitido");
  }

  // ── 5. Selección del mes ──────────────────────────────────────────────────
  if (insertedProducts.length === 0) {
    console.warn("  → Productos ya existían, omitiendo selección del mes");
    console.warn("\nSeed completado.");
    return;
  }

  console.warn("Insertando selección del mes...");
  const slugsSeleccion = ["ejercicios-espirituales-san-ignacio", "el-alma-de-todo-apostolado", "psicologia-y-espiritualidad-ignaciana"];
  const slugToProductId = new Map(insertedProducts.map((p) => [p.slug, p.id]));
  const seleccion = slugsSeleccion.filter((s) => slugToProductId.has(s)).map((s) => slugToProductId.get(s)!);

  if (seleccion.length > 0) {
    const existingFeatured = await db.select({ id: featuredProducts.id }).from(featuredProducts).limit(1);
    if (existingFeatured.length === 0) {
      await db.insert(featuredProducts).values(seleccion.map((productId, i) => ({ productId, section: "monthly_selection", displayOrder: i, isActive: true })));
      console.warn("  → " + seleccion.length + " productos en selección del mes");
    } else {
      console.warn("  → featured_products ya existe, omitido");
    }
  }

  console.warn("\nSeed completado. Ejecuta: npm run dev");
}

run()
  .then(() => { process.exit(0); })
  .catch((error) => { console.error("Error en seed:", error); process.exit(1); });
