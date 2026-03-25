import {
  CategoryCard,
  HeroSlider,
  InstagramSection,
  LibrosMesSection,
  ProductGrid,
  QuoteSection,
} from "@/features/catalogo/components";
import { getCuratedProducts, getFeaturedCategories, getHeroSlides, getNewProducts } from "@/features/catalogo";
import { Button, SectionHeader } from "@/shared/ui";

export default async function HomePage() {
  const [heroSlides, novedades, categorias, seleccion] = await Promise.all([
    getHeroSlides(),
    getNewProducts(6),
    getFeaturedCategories(),
    getCuratedProducts(),
  ]);

  return (
    <main className="bg-beige">
      <HeroSlider slides={heroSlides} />

      <LibrosMesSection items={seleccion} />

      <section className="bg-beige px-5 py-16 md:px-10 md:py-20 lg:px-14">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            description="Cada categoria funciona como una puerta de entrada a una mesa distinta: estudio, familia, devocion y formacion."
            eyebrow="Categorias"
            title="Una libreria pensada"
            titleEm="por recorridos"
          />
          <Button as="a" href="/productos" size="sm" variant="ghost">
            Ver todo el catalogo
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {categorias.map((category, index) => (
            <CategoryCard
              imageUrl={category.imageUrl}
              index={index}
              key={category.id}
              name={category.name}
              slug={category.slug}
            />
          ))}
        </div>
      </section>

      <section className="bg-white px-5 py-16 md:px-10 md:py-20 lg:px-14">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            description="Novedades editoriales seleccionadas para quienes buscan lectura contemporanea sin perder densidad teologica y belleza material."
            eyebrow="Novedades"
            title="Titulos recien"
            titleEm="llegados"
          />
          <Button as="a" href="/productos" size="sm" variant="ghost">
            Ver todos
          </Button>
        </div>

        <ProductGrid products={novedades} />
      </section>

      <QuoteSection
        author="Crecer Libreria Cristiana"
        backgroundImageUrl={heroSlides[0]?.imageUrl ?? null}
        quote="Creemos en libros que no solo informan, sino que acompanan. Textos que permanecen abiertos sobre la mesa, vuelven a la conversacion y se convierten en habito."
      />

      <InstagramSection />
    </main>
  );
}

