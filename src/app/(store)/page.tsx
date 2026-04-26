import {
  CategoryCarousel,
  HeroSlider,
  InstagramSection,
  LibrosMesSection,
  QuoteSection,
  RecentProductsCarousel,
} from "@/features/catalogo/components";
import {
  getCategories,
  getCategoriesPanorama,
  getCuratedProducts,
  getHeroIntermedio,
  getHeroViewModel,
  getLibrosMesViewModel,
  getNewProducts,
} from "@/features/catalogo";
import { LandingWithSplash } from "@/features/landing/components/LandingWithSplash";
import { MONTHLY_SELECTION_SECTION } from "@/shared/config/landing";

export default async function HomePage() {
  const [hero, novedades, categorias, seleccion, librosMesCopy, heroIntermedio, categoriasPanorama] = await Promise.all([
    getHeroViewModel(),
    getNewProducts(10),
    getCategories(),
    getCuratedProducts(MONTHLY_SELECTION_SECTION),
    getLibrosMesViewModel(),
    getHeroIntermedio(),
    getCategoriesPanorama(),
  ]);

  return (
    <LandingWithSplash>
      <main className="bg-beige">
        <HeroSlider data={hero} />

        <LibrosMesSection copy={librosMesCopy} items={seleccion} />

        <CategoryCarousel categories={categorias} panoramaUrl={categoriasPanorama?.imageUrl ?? null} />

        <RecentProductsCarousel products={novedades} />

        <QuoteSection
          author={heroIntermedio?.description ?? "Crecer Librería Católica"}
          backgroundImageUrl={heroIntermedio?.imageUrl ?? hero.slides[0]?.imageUrl ?? null}
          quote={heroIntermedio?.title ?? "Creemos en libros que no solo informan, sino que acompañan. Textos que permanecen abiertos sobre la mesa, vuelven a la conversación y se convierten en hábito."}
        />

        <InstagramSection />
      </main>
    </LandingWithSplash>
  );
}
