import {
  type SectionCopyViewModel,
  getSectionCopyViewModel,
} from "./section-copy-view-model";

export type NosotrosHeroViewModel = SectionCopyViewModel;

export type NosotrosManifestoViewModel = Pick<
  SectionCopyViewModel,
  "eyebrow" | "title" | "body"
>;

export type NosotrosCtaViewModel = SectionCopyViewModel;

export type NosotrosViewModel = {
  hero: NosotrosHeroViewModel;
  manifesto: NosotrosManifestoViewModel;
  cta: NosotrosCtaViewModel;
};

export async function getNosotrosViewModel(): Promise<NosotrosViewModel> {
  const [hero, manifestoCopy, cta] = await Promise.all([
    getSectionCopyViewModel("nosotros.hero"),
    getSectionCopyViewModel("nosotros.manifesto"),
    getSectionCopyViewModel("nosotros.cta"),
  ]);

  const manifesto: NosotrosManifestoViewModel = {
    eyebrow: manifestoCopy.eyebrow,
    title: manifestoCopy.title,
    body: manifestoCopy.body,
  };

  return { hero, manifesto, cta };
}
