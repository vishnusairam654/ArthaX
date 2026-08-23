/** The six ARTHAX portals. */
export const PORTAL_IDS = [
  "central_guide",
  "central_bank",
  "bank",
  "user",
  "stocks",
  "shop",
] as const;

export type PortalId = (typeof PORTAL_IDS)[number];
