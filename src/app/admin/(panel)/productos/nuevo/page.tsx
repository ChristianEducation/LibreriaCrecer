import { ProductAdminForm } from "@/features/admin/components/product-admin-form";

export default function AdminNuevoProductoPage() {
  return (
    <section className="space-y-5">
      <div>
        <h1 className="font-serif text-[2rem] leading-none text-text">Nuevo producto</h1>
        <p className="mt-2 text-sm font-light text-text-light">
          Crea una nueva ficha con imagen principal, galeria y metadatos editoriales.
        </p>
      </div>
      <ProductAdminForm mode="create" />
    </section>
  );
}
