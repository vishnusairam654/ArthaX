/**
 * ARTHAX design token infrastructure.
 *
 * NOTE: values are intentionally empty until Phase 4 (Design System), where the
 * official palette from assets/Color_Palette.png is mapped to these roles.
 * Do not hardcode colors elsewhere — consume them from this package only.
 */

export interface PortalThemeRole {
  surface: string;
  textPrimary: string;
  accent: string;
}

/** Populated in Phase 4 from assets/Color_Palette.png — do not guess values. */
export const PORTAL_THEMES: Record<string, PortalThemeRole> = {};
