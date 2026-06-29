export const ABOUT_OFFERING_ICONS = [
  "books",
  "users",
  "book",
  "heart",
  "bulb",
  "cross",
  "calendar",
  "message",
  "star",
  "gift",
] as const;

export type AboutOfferingIcon = (typeof ABOUT_OFFERING_ICONS)[number];
