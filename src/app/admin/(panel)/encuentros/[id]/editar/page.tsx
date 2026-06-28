import { notFound } from "next/navigation";

import { EncounterAdminForm } from "@/features/admin/components/encounter-admin-form";
import { getEncounterByIdAdmin } from "@/features/admin/services/encounter-admin-service";

type EditEncounterPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditarEncuentroPage({ params }: EditEncounterPageProps) {
  const { id } = await params;
  const encounter = await getEncounterByIdAdmin(id);

  if (!encounter) {
    notFound();
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="font-serif text-[2rem] leading-none text-text">Editar encuentro</h1>
        <p className="mt-2 text-sm font-light text-text-light">
          Ajusta contenido, estado, portada y galería de fotos.
        </p>
      </div>
      <EncounterAdminForm mode="edit" encounterId={id} initialData={encounter} />
    </section>
  );
}
