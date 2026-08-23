/**
 * ARTHAX design tokens — single source of truth.
 * Values from arthax-design-tokens (sampled from assets/Color_Palette.png)
 * and material-rounded-smooth (shape/motion). Consumed via tokens.css.
 */

export const PALETTE = {
  deepBlue: "#3368A0",
  softBlue: "#66A3BF",
  sageMint: "#C8DFDB",
  warmIvory: "#F2EFE7",
  arthGold: "#A8742A",
  arthGoldSoft: "#E9D9BE",
  charcoal: "#252624",
  loss: "#B5482E",
} as const;

/** Per-portal leading accent (rule 11: portals distinguishable in one screenshot). */
export const PORTAL_ACCENTS = {
  central_guide: { accent: PALETTE.deepBlue, secondary: PALETTE.softBlue },
  central_bank: { accent: PALETTE.deepBlue, secondary: PALETTE.charcoal },
  bank: { accent: PALETTE.softBlue, secondary: PALETTE.deepBlue },
  user: { accent: PALETTE.deepBlue, secondary: PALETTE.arthGold },
  stocks: { accent: PALETTE.softBlue, secondary: PALETTE.sageMint },
  shop: { accent: PALETTE.arthGold, secondary: PALETTE.sageMint },
} as const;

export type PortalKey = keyof typeof PORTAL_ACCENTS;

/** Radius scale — hierarchical by component role, never one value everywhere. */
export const RADIUS = {
  none: "0px",
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "28px",
  full: "9999px",
} as const;

/** Elevation capped at 1–2 (3–4 licensed for Shop only). */
export const ELEVATION = {
  1: "0 1px 2px rgba(37,38,36,0.06), 0 1px 1px rgba(37,38,36,0.04)",
  2: "0 2px 6px rgba(37,38,36,0.08), 0 1px 2px rgba(37,38,36,0.04)",
  3: "0 4px 12px rgba(37,38,36,0.10), 0 2px 4px rgba(37,38,36,0.05)",
  4: "0 8px 24px rgba(37,38,36,0.12), 0 4px 8px rgba(37,38,36,0.06)",
} as const;

export const MOTION = {
  easeStandard: "cubic-bezier(0.2, 0, 0, 1)",
  easeDecelerate: "cubic-bezier(0, 0, 0, 1)",
  easeAccelerate: "cubic-bezier(0.3, 0, 1, 1)",
  easeEmphasized: "cubic-bezier(0.3, 0, 0.1, 1)",
  durationShort: "100ms",
  durationMedium: "200ms",
  durationLong: "350ms",
  durationXlong: "500ms",
} as const;
