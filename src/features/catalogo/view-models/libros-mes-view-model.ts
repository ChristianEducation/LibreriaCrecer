import {
  type SectionCopyViewModel,
  getSectionCopyViewModel,
} from "./section-copy-view-model";

export type LibrosMesViewModel = SectionCopyViewModel;

export async function getLibrosMesViewModel(): Promise<LibrosMesViewModel> {
  return getSectionCopyViewModel("libros_mes");
}
