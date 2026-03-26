import {
  CategoryCarousel,
  HeroSlider,
  InstagramSection,
  LibrosMesSection,
  QuoteSection,
  RecentProductsCarousel,
} from "@/features/catalogo/components";
import { getCuratedProducts, getFeaturedCategories, getHeroIntermedio, getHeroSlides, getNewProducts } from "@/features/catalogo";
export default async function HomePage() {
  const [heroSlides, novedades, categorias, seleccion, heroIntermedio] = await Promise.all([
    getHeroSlides(),
    getNewProducts(10),
    getFeaturedCategories(),
    getCuratedProducts(),
    getHeroIntermedio(),
  ]);

  return (
    <main className="bg-beige">
      <HeroSlider slides={heroSlides} />

      <LibrosMesSection items={seleccion} />

      <CategoryCarousel categories={categorias} />

      <RecentProductsCarousel products={novedades} />

      <QuoteSection
        author={heroIntermedio?.description ?? "Crecer Librería Cristiana"}
        backgroundImageUrl={heroIntermedio?.imageUrl ?? heroSlides[0]?.imageUrl ?? null}
        quote={heroIntermedio?.title ?? "Creemos en libros que no solo informan, sino que acompañan. Textos que permanecen abiertos sobre la mesa, vuelven a la conversación y se convierten en hábito."}
      />

      <InstagramSection />
    </main>
  );
}

