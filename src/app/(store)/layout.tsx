import { asc, eq } from "drizzle-orm";

import { db, schema } from "@/integrations/drizzle";
import { Footer } from "@/shared/ui/Footer";
import { Navbar } from "@/shared/ui";

type StoreLayoutProps = {
  children: React.ReactNode;
};

export default async function StoreLayout({ children }: StoreLayoutProps) {
  const categories = await db
    .select({
      id: schema.categories.id,
      name: schema.categories.name,
      slug: schema.categories.slug,
    })
    .from(schema.categories)
    .where(eq(schema.categories.isActive, true))
    .orderBy(asc(schema.categories.displayOrder), asc(schema.categories.name));

  return (
    <>
      <Navbar categories={categories} />
      {children}
      <Footer />
    </>
  );
}
