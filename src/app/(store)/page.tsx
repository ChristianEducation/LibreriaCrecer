import type { Metadata } from "next";

import {
  CategoryCarousel,
  GiftOccasions,
  HeroSlider,
  InstagramSection,
  LibrosMesSection,
  ProductsTabsSection,
  QuoteSection,
  TrustStrip,
} from "@/features/catalogo/components";
import {
  getActiveGiftOccasions,
  getBestSellingProducts,
  getCategories,
  getCuratedProducts,
  getHeroIntermedio,
  getHeroViewModel,
  getLibrosMesViewModel,
  getNewProducts,
} from "@/features/catalogo";
import { MONTHLY_SELECTION_SECTION } from "@/shared/config/landing";

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Bienvenido a Crecer Librería Católica en Antofagasta. Descubre nuestra selección de libros católicos, Biblias, recursos de espiritualidad y formación con despacho a todo Chile.",
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const [hero, novedades, masBuscados, categorias, seleccion, librosMesCopy, heroIntermedio, ocasiones] =
    await Promise.all([
      getHeroViewModel(),
      getNewProducts(10),
      getBestSellingProducts(10),
      getCategories(),
      getCuratedProducts(MONTHLY_SELECTION_SECTION),
      getLibrosMesViewModel(),
      getHeroIntermedio(),
      getActiveGiftOccasions(),
    ]);

  return (
    <main className="bg-beige">
      <HeroSlider data={hero} />

      <TrustStrip />

      <GiftOccasions occasions={ocasiones} />

      <LibrosMesSection copy={librosMesCopy} items={seleccion} />

      <CategoryCarousel categories={categorias} />

      <ProductsTabsSection popular={masBuscados} recent={novedades} />

      <QuoteSection
        author={heroIntermedio?.description ?? "Crecer Librería Católica"}
        backgroundImageUrl={heroIntermedio?.imageUrl ?? hero.slides[0]?.imageUrl ?? null}
        brightness={heroIntermedio?.metadata?.brightness}
        imageOnly={Boolean(heroIntermedio?.imageUrl && heroIntermedio.metadata?.imageOnly)}
        overlayOpacity={heroIntermedio?.metadata?.overlay}
        quote={heroIntermedio?.title ?? "Creemos en libros que no solo informan, sino que acompañan. Textos que permanecen abiertos sobre la mesa, vuelven a la conversación y se convierten en hábito."}
      />

      <InstagramSection />
    </main>
  );
}
