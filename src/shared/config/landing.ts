export const MONTHLY_SELECTION_SECTION = "monthly_selection";

const legacyMonthlySelectionSections = ["libros_mes", "liturgical_reading"] as const;

export const MONTHLY_SELECTION_SECTION_ALIASES = [
  MONTHLY_SELECTION_SECTION,
  ...legacyMonthlySelectionSections,
] as const;

export function isMonthlySelectionAlias(section: string) {
  return MONTHLY_SELECTION_SECTION_ALIASES.includes(
    section as (typeof MONTHLY_SELECTION_SECTION_ALIASES)[number],
  );
}

export function normalizeCuratedSection(section?: string) {
  if (!section) {
    return MONTHLY_SELECTION_SECTION;
  }

  return isMonthlySelectionAlias(section) ? MONTHLY_SELECTION_SECTION : section;
}
