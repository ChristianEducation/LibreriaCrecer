import { notFound } from "next/navigation";

import { ProductAdminForm } from "@/features/admin/components/product-admin-form";
import { getProductAdmin } from "@/features/admin/services/product-admin-service";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditarProductoPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await getProductAdmin(id);

  if (!product) {
    notFound();
  }

  return (
    <section>
      <ProductAdminForm mode="edit" productId={id} initialData={product} />
    </section>
  );
}
