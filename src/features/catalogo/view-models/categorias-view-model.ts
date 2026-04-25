import {
  type SectionCopyViewModel,
  getSectionCopyViewModel,
} from "./section-copy-view-model";

export type CategoriasViewModel = SectionCopyViewModel;

export async function getCategoriasViewModel(): Promise<CategoriasViewModel> {
  return getSectionCopyViewModel("categorias");
}
