import { notFound } from "next/navigation";

import { CategoryAdminForm } from "@/features/admin/components/category-admin-form";
import { getCategoryAdmin } from "@/features/admin/services/category-admin-service";

type EditCategoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditarCategoriaPage({ params }: EditCategoryPageProps) {
  const { id } = await params;
  const category = await getCategoryAdmin(id);

  if (!category) {
    notFound();
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="font-serif text-[2rem] leading-none text-text">Editar categoria</h1>
        <p className="mt-2 text-sm font-light text-text-light">
          Modifica orden, visibilidad y los recursos visuales que usa la tienda.
        </p>
      </div>
      <CategoryAdminForm mode="edit" categoryId={id} initialData={category} />
    </section>
  );
}
