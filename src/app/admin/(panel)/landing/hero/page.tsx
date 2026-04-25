import { LandingEditorShell } from "@/features/admin/components";
import { HeroAdminEditor } from "@/features/admin/components/landing/HeroAdminEditor";
import { HeroPreview } from "@/features/catalogo/components";
import { getHeroViewModel } from "@/features/catalogo/view-models/hero-view-model";

export default async function AdminLandingHeroPage() {
  const hero = await getHeroViewModel();

  return (
    <LandingEditorShell
      title="Hero principal"
      description="Edita el contenido visual del hero del sitio"
    >
      <HeroAdminEditor preview={<HeroPreview data={hero} />} />
    </LandingEditorShell>
  );
}
