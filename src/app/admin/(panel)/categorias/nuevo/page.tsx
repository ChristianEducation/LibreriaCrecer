import { CategoryAdminForm } from "@/features/admin/components/category-admin-form";

export default function AdminNuevaCategoriaPage() {
  return (
    <section className="space-y-5">
      <div>
        <h1 className="font-serif text-[2rem] leading-none text-text">Nueva categoria</h1>
        <p className="mt-2 text-sm font-light text-text-light">
          Configura jerarquia, visibilidad e imagenes para tarjetas y header.
        </p>
      </div>
      <CategoryAdminForm mode="create" />
    </section>
  );
}
