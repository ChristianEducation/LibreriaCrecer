import { asc, eq } from "drizzle-orm";

import { getActiveGiftOccasions } from "@/features/catalogo/services/landing-service";
import { db, schema } from "@/integrations/drizzle";
import { areStorePurchasesEnabled } from "@/shared/config/store-purchases";
import { PurchaseAvailabilityProvider } from "@/shared/providers/PurchaseAvailabilityProvider";
import { FloatingCartButton, Navbar } from "@/shared/ui";
import { Footer } from "@/shared/ui/Footer";
import { PurchasesPausedBanner } from "@/shared/ui/PurchasesPausedBanner";
import { TopBanner } from "@/shared/ui/TopBanner";

type StoreLayoutProps = {
  children: React.ReactNode;
};

export default async function StoreLayout({ children }: StoreLayoutProps) {
  const purchasesEnabled = areStorePurchasesEnabled();
  let categories: { id: string; name: string; slug: string; imageUrl: string | null }[] = [];
  try {
    categories = await db
      .select({
        id: schema.categories.id,
        name: schema.categories.name,
        slug: schema.categories.slug,
        imageUrl: schema.categories.imageUrl,
      })
      .from(schema.categories)
      .where(eq(schema.categories.isActive, true))
      .orderBy(asc(schema.categories.displayOrder), asc(schema.categories.name));
  } catch (error) {
    console.error("StoreLayout: failed to load categories", error);
  }

  let giftOccasions: { slug: string; label: string; imageUrl: string | null }[] = [];
  try {
    giftOccasions = (await getActiveGiftOccasions()).map(({ slug, label, imageUrl }) => ({ slug, label, imageUrl }));
  } catch (error) {
    console.error("StoreLayout: failed to load gift occasions", error);
  }

  return (
    <PurchaseAvailabilityProvider purchasesEnabled={purchasesEnabled}>
      <TopBanner />
      <Navbar categories={categories} giftOccasions={giftOccasions} />
      {!purchasesEnabled && <PurchasesPausedBanner />}
      {children}
      <Footer />
      <FloatingCartButton />
    </PurchaseAvailabilityProvider>
  );
}