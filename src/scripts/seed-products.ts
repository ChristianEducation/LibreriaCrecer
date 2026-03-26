import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });

async function run() {
  const [{ db }, { products, categories, featuredProducts, heroSlides }] = await Promise.all([
    import("../integrations/drizzle"),
    import("../integrations/drizzle/schema"),
  ]);

  // ── 1. Categorías (6 destacadas) ─────────────────────────────────────────
  console.warn("Insertando categorías...");

  const categoryData = [
    {
      name: "Espiritualidad",
      slug: "espiritualidad",
      description: "Libros de oración, contemplación y vida espiritual.",
      featured: true,
      displayOrder: 1,
      isActive: true,
    },
    {
      name: "Teología",
      slug: "teologia",
      description: "Estudios sistemáticos de la fe católica.",
      featured: true,
      displayOrder: 2,
      isActive: true,
    },
    {
      name: "Biblia",
      slug: "biblia",
      description: "Textos bíblicos, comentarios y estudios del Antiguo y Nuevo Testamento.",
      featured: true,
      displayOrder: 3,
      isActive: true,
    },
    {
      name: "Santos y Beatos",
      slug: "santos-y-beatos",
      description: "Biografías e historias de vida de los santos de la Iglesia.",
      featured: true,
      displayOrder: 4,
      isActive: true,
    },
    {
      name: "Magisterio",
      slug: "magisterio",
      description: "Encíclicas, exhortaciones y documentos del Magisterio de la Iglesia.",
      featured: true,
      displayOrder: 5,
      isActive: true,
    },
    {
      name: "Filosofía Cristiana",
      slug: "filosofia-cristiana",
      description: "Pensamiento filosófico desde la perspectiva de la fe.",
      featured: true,
      displayOrder: 6,
      isActive: true,
    },
  ];

  const insertedCategories = await db
    .insert(categories)
    .values(categoryData)
    .onConflictDoNothing({ target: categories.slug })
    .returning({ id: categories.id, slug: categories.slug });

  console.warn(`  → ${insertedCategories.length} categorías insertadas`);

  // ── 2. Productos (10 libros, del menos al más reciente) ───────────────────
  console.warn("Insertando productos...");

  // Primero los menos relevantes, al final los que aparecerán como "recién llegados"
  const productData = [
    {
      title: "La Imitación de Cristo",
      slug: "la-imitacion-de-cristo",
      sku: "SEED-001",
      author: "Tomás de Kempis",
      description:
        "Una de las obras espirituales más leídas de la historia cristiana. Guía al lector hacia la vida interior y la unión con Dios a través de la humildad y la oración.",
      price: 7500,
      coverType: "rústica",
      pages: 280,
      inStock: true,
      stockQuantity: 15,
      mainImageUrl: null,
      isFeatured: false,
      isActive: true,
    },
    {
      title: "Redemptor Hominis",
      slug: "redemptor-hominis",
      sku: "SEED-002",
      author: "Juan Pablo II",
      description:
        "Primera encíclica del pontificado de Juan Pablo II. Una reflexión sobre la redención del ser humano en Cristo y la dignidad de la persona.",
      price: 5000,
      coverType: "rústica",
      pages: 96,
      inStock: true,
      stockQuantity: 20,
      mainImageUrl: null,
      isFeatured: false,
      isActive: true,
    },
    {
      title: "Confessiones",
      slug: "confessiones",
      sku: "SEED-003",
      author: "San Agustín",
      description:
        "La autobiografía espiritual del obispo de Hipona: un diálogo íntimo con Dios sobre la búsqueda de la verdad y la gracia de la conversión.",
      price: 12000,
      coverType: "tapa dura",
      pages: 390,
      inStock: true,
      stockQuantity: 8,
      mainImageUrl: null,
      isFeatured: false,
      isActive: true,
    },
    {
      title: "El Don y el Misterio",
      slug: "el-don-y-el-misterio",
      sku: "SEED-004",
      author: "Juan Pablo II",
      description:
        "Reflexiones personales de Juan Pablo II sobre el sacerdocio, escritas en el 50.° aniversario de su propia ordenación.",
      price: 8500,
      coverType: "rústica",
      pages: 140,
      inStock: true,
      stockQuantity: 12,
      mainImageUrl: null,
      isFeatured: false,
      isActive: true,
    },
    {
      title: "Camino",
      slug: "camino",
      sku: "SEED-005",
      author: "Josemaría Escrivá",
      description:
        "999 consideraciones para la formación espiritual del cristiano en medio del mundo ordinario, escritas por el fundador del Opus Dei.",
      price: 9500,
      coverType: "rústica",
      pages: 320,
      inStock: true,
      stockQuantity: 18,
      mainImageUrl: null,
      isFeatured: false,
      isActive: true,
    },
    {
      title: "El Señor",
      slug: "el-senor",
      sku: "SEED-006",
      author: "Romano Guardini",
      description:
        "Una meditación profunda sobre la figura de Jesucristo a través de los evangelios, considerada una obra cumbre de la teología del siglo XX.",
      price: 14500,
      salePrice: 11500,
      coverType: "tapa dura",
      pages: 560,
      inStock: true,
      stockQuantity: 6,
      mainImageUrl: null,
      isFeatured: false,
      isActive: true,
    },
    {
      title: "Teología del Cuerpo",
      slug: "teologia-del-cuerpo",
      sku: "SEED-007",
      author: "Juan Pablo II",
      description:
        "Las catequesis de Juan Pablo II sobre el amor humano en el plan divino, redefiniendo la visión cristiana del cuerpo, el matrimonio y la sexualidad.",
      price: 25000,
      coverType: "tapa dura",
      pages: 620,
      inStock: true,
      stockQuantity: 4,
      mainImageUrl: null,
      isFeatured: true,
      isActive: true,
    },
    {
      title: "La Divina Comedia",
      slug: "la-divina-comedia",
      sku: "SEED-008",
      author: "Dante Alighieri",
      description:
        "El viaje alegórico de Dante por el Infierno, el Purgatorio y el Paraíso: obra cumbre de la literatura cristiana medieval.",
      price: 22000,
      salePrice: 18000,
      coverType: "tapa dura",
      pages: 680,
      inStock: true,
      stockQuantity: 7,
      mainImageUrl: null,
      isFeatured: false,
      isActive: true,
    },
    {
      title: "Introducción al Cristianismo",
      slug: "introduccion-al-cristianismo",
      sku: "SEED-009",
      author: "Joseph Ratzinger",
      description:
        "El cardenal Ratzinger analiza el Credo apostólico mostrando la relevancia del pensamiento cristiano en el mundo contemporáneo.",
      price: 18000,
      salePrice: 15000,
      coverType: "rústica",
      pages: 340,
      inStock: true,
      stockQuantity: 10,
      mainImageUrl: null,
      isFeatured: true,
      isActive: true,
    },
    {
      title: "Catecismo de la Iglesia Católica",
      slug: "catecismo-de-la-iglesia-catolica",
      sku: "SEED-010",
      author: "Iglesia Católica",
      description:
        "La exposición completa y autorizada de la fe y la moral de la Iglesia Católica, promulgada por Juan Pablo II en 1992.",
      price: 15000,
      coverType: "tapa dura",
      pages: 760,
      inStock: true,
      stockQuantity: 25,
      mainImageUrl: null,
      isFeatured: false,
      isActive: true,
    },
  ];

  const insertedProducts = await db
    .insert(products)
    .values(productData)
    .onConflictDoNothing({ target: products.slug })
    .returning({ id: products.id, slug: products.slug });

  console.warn(`  → ${insertedProducts.length} productos insertados`);

  // ── 3. Hero slide (imageUrl vacío para probar el fallback) ────────────────
  console.warn("Insertando hero slide...");

  const existingSlide = await db.select({ id: heroSlides.id }).from(heroSlides).limit(1);
  if (existingSlide.length === 0) {
    await db.insert(heroSlides).values({
      title: "Crecer Librería Cristiana",
      subtitle: "Librería Católica · Antofagasta",
      imageUrl: "",
      linkUrl: "/productos",
      displayOrder: 0,
      isActive: true,
    });
    console.warn("  → Hero slide insertado (sin imagen — probando fallback)");
  } else {
    console.warn("  → Hero slide ya existe, omitido");
  }

  // ── 4. Selección del mes (3 productos en featured_products) ───────────────
  if (insertedProducts.length === 0) {
    console.warn("  → Productos ya existían, omitiendo featured_products");
    console.warn("\nSeed completado.");
    return;
  }

  console.warn("Insertando selección del mes...");

  const slugsSeleccion = [
    "catecismo-de-la-iglesia-catolica",
    "introduccion-al-cristianismo",
    "teologia-del-cuerpo",
  ];

  const seleccion = insertedProducts.filter((p) => slugsSeleccion.includes(p.slug));

  if (seleccion.length > 0) {
    const existingFeatured = await db
      .select({ id: featuredProducts.id })
      .from(featuredProducts)
      .limit(1);

    if (existingFeatured.length === 0) {
      await db.insert(featuredProducts).values(
        seleccion.map((p, i) => ({
          productId: p.id,
          section: "monthly_selection",
          displayOrder: i,
          isActive: true,
        })),
      );
      console.warn(`  → ${seleccion.length} productos en selección del mes`);
    } else {
      console.warn("  → featured_products ya existe, omitido");
    }
  }

  console.warn("\nSeed completado. Ejecutar: npm run dev");
}

run()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error en seed:", error);
    process.exit(1);
  });
