import {
  CategoryCarousel,
  HeroSlider,
  InstagramSection,
  LibrosMesSection,
  QuoteSection,
  RecentProductsCarousel,
} from "@/features/catalogo/components";
import { getCategories, getCategoriesPanorama, getCuratedProducts, getHeroIntermedio, getHeroSlides, getNewProducts } from "@/features/catalogo";
import { LandingWithSplash } from "@/features/landing/components/LandingWithSplash";

export default async function HomePage() {
  const [heroSlides, novedades, categorias, seleccion, heroIntermedio, categoriasPanorama] = await Promise.all([
    getHeroSlides(),
    getNewProducts(10),
    getCategories(),
    getCuratedProducts(),
    getHeroIntermedio(),
    getCategoriesPanorama(),
  ]);

  return (
    <LandingWithSplash>
      <main className="bg-beige">
        <HeroSlider slides={heroSlides} />

        <LibrosMesSection items={seleccion} />

        <CategoryCarousel categories={categorias} panoramaUrl={categoriasPanorama?.imageUrl ?? null} />

        <RecentProductsCarousel products={novedades} />

        <QuoteSection
          author={heroIntermedio?.description ?? "Crecer Librería Cristiana"}
          backgroundImageUrl={heroIntermedio?.imageUrl ?? heroSlides[0]?.imageUrl ?? null}
          quote={heroIntermedio?.title ?? "Creemos en libros que no solo informan, sino que acompañan. Textos que permanecen abiertos sobre la mesa, vuelven a la conversación y se convierten en hábito."}
        />

        <InstagramSection />
      </main>
    </LandingWithSplash>
  );
}

