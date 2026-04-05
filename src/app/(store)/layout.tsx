import { asc, eq } from "drizzle-orm";

import { db, schema } from "@/integrations/drizzle";
import { Footer } from "@/shared/ui/Footer";
import { Navbar } from "@/shared/ui";
import { TopBanner } from "@/shared/ui/TopBanner";

type StoreLayoutProps = {
  children: React.ReactNode;
};

export default async function StoreLayout({ children }: StoreLayoutProps) {
  let categories: { id: string; name: string; slug: string }[] = [];
  try {
    categories = await db
      .select({
        id: schema.categories.id,
        name: schema.categories.name,
        slug: schema.categories.slug,
      })
      .from(schema.categories)
      .where(eq(schema.categories.isActive, true))
      .orderBy(asc(schema.categories.displayOrder), asc(schema.categories.name));
  } catch (error) {
    console.error("StoreLayout: failed to load categories", error);
  }

  return (
    <>
      <TopBanner />
      <Navbar categories={categories} />
      {children}
      <Footer />
    </>
  );
}
