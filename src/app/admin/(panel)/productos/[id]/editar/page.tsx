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
    <section className="space-y-5">
      <div>
        <h1 className="font-serif text-[2rem] leading-none text-text">Editar producto</h1>
        <p className="mt-2 text-sm font-light text-text-light">
          Ajusta contenido, estado comercial, stock e imagenes sin alterar la logica del catalogo.
        </p>
      </div>
      <ProductAdminForm mode="edit" productId={id} initialData={product} />
    </section>
  );
}
