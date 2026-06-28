import { EncounterAdminForm } from "@/features/admin/components/encounter-admin-form";

export default function AdminNuevoEncuentroPage() {
  return (
    <section className="space-y-5">
      <div>
        <h1 className="font-serif text-[2rem] leading-none text-text">Nuevo encuentro</h1>
        <p className="mt-2 text-sm font-light text-text-light">
          Crea una nueva crónica de evento con galería, detalles y video.
        </p>
      </div>
      <EncounterAdminForm mode="create" />
    </section>
  );
}
