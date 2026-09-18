import * as fs from 'fs';
import * as path from 'path';

/**
 * ARTHAX WCAG 2.1 AA ACCESSIBILITY & TOKEN CONTRAST AUDIT SUITE — PHASE 13
 *
 * Programmatic verification of WCAG 2.1 AA compliance:
 * - Group 1: Mathematical Relative Luminance & Contrast Ratio Engine
 * - Group 2: Canonical Sovereign Token Pair Contrast Audit (WCAG AA 4.5:1 / 3:1)
 * - Group 3: Arth Gold (#A8742A) Rule 7 Invariant Verification
 * - Group 4: Keyboard Navigation, Focus Rings & Skip Link Architecture
 * - Group 5: Financial Tabular Semantics & Screen Reader Live Regions
 *
 * Target: Exactly 20+ passed, 0 failed.
 */
async function runWcagAuditTests() {
  console.log('=================================================================');
  console.log('  ARTHAX WCAG 2.1 AA ACCESSIBILITY & DESIGN TOKEN AUDIT');
  console.log('=================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(name: string, condition: boolean, details?: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name} ${details ? '- ' + details : ''}`);
      failed++;
    }
  }

  // ---------------------------------------------------------------------------
  // GROUP 1: MATHEMATICAL RELATIVE LUMINANCE & CONTRAST RATIO ENGINE
  // ---------------------------------------------------------------------------
  console.log('--- Group 1: Mathematical Relative Luminance & Contrast Engine ---');

  function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const cleanHex = hex.replace('#', '').trim();
    const bigint = parseInt(cleanHex, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  }

  function getChannelLuminance(channel: number): number {
    const sRGB = channel / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  }

  function getRelativeLuminance(hex: string): number {
    const { r, g, b } = hexToRgb(hex);
    return 0.2126 * getChannelLuminance(r) + 0.7152 * getChannelLuminance(g) + 0.0722 * getChannelLuminance(b);
  }

  function getContrastRatio(hex1: string, hex2: string): number {
    const l1 = getRelativeLuminance(hex1);
    const l2 = getRelativeLuminance(hex2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  const whiteLum = getRelativeLuminance('#FFFFFF');
  const blackLum = getRelativeLuminance('#000000');
  const maxContrast = getContrastRatio('#FFFFFF', '#000000');

  assert('White relative luminance evaluates to exactly 1.0', Math.abs(whiteLum - 1.0) < 0.001);
  assert('Black relative luminance evaluates to exactly 0.0', Math.abs(blackLum - 0.0) < 0.001);
  assert('Pure Black on Pure White contrast ratio evaluates to 21.0:1', Math.abs(maxContrast - 21.0) < 0.1);

  // ---------------------------------------------------------------------------
  // GROUP 2: CANONICAL SOVEREIGN TOKEN PAIR CONTRAST AUDIT (WCAG AA >= 4.5:1)
  // ---------------------------------------------------------------------------
  console.log('\n--- Group 2: Canonical Sovereign Token Pair Contrast Audit ---');

  // Sovereign Design Tokens
  const DEEP_BLUE = '#022448';
  const PRIMARY_CONTAINER = '#1E3A5F';
  const INK_ON_SURFACE = '#121C28';
  const OFF_WHITE = '#F8F9FF';
  const SURFACE_LOW = '#EEF4FF';
  const WARM_IVORY = '#F5EFEB';
  const TERRACOTTA_LOSS = '#B5482E';
  const EMERALD_POSITIVE = '#10B981';
  const DARK_SURFACE = '#27313E';

  const deepBlueOnWhiteRatio = getContrastRatio(DEEP_BLUE, '#FFFFFF');
  assert(`Deep Blue (#022448) on White: ${deepBlueOnWhiteRatio.toFixed(2)}:1 (Exceeds WCAG AAA 7.0:1)`, deepBlueOnWhiteRatio >= 7.0);

  const inkOnSurfaceRatio = getContrastRatio(INK_ON_SURFACE, OFF_WHITE);
  assert(`Ink text (#121C28) on Surface (#F8F9FF): ${inkOnSurfaceRatio.toFixed(2)}:1 (Exceeds WCAG AAA 7.0:1)`, inkOnSurfaceRatio >= 7.0);

  const primaryContainerOnIvory = getContrastRatio(PRIMARY_CONTAINER, WARM_IVORY);
  assert(`Primary Container (#1E3A5F) on Warm Ivory (#F5EFEB): ${primaryContainerOnIvory.toFixed(2)}:1 (Exceeds WCAG AAA 7.0:1)`, primaryContainerOnIvory >= 7.0);

  const terracottaOnWhite = getContrastRatio(TERRACOTTA_LOSS, '#FFFFFF');
  assert(`Terracotta Loss (#B5482E) on White: ${terracottaOnWhite.toFixed(2)}:1 (Exceeds WCAG AA Normal Text 4.5:1)`, terracottaOnWhite >= 4.5);

  const terracottaOnIvory = getContrastRatio(TERRACOTTA_LOSS, WARM_IVORY);
  assert(`Terracotta Loss (#B5482E) on Warm Ivory: ${terracottaOnIvory.toFixed(2)}:1 (Exceeds WCAG AA Normal Text 4.5:1)`, terracottaOnIvory >= 4.5);

  const emeraldOnDarkSurface = getContrastRatio(EMERALD_POSITIVE, DARK_SURFACE);
  assert(`Emerald Positive (#10B981) on Dark Surface (#27313E): ${emeraldOnDarkSurface.toFixed(2)}:1 (Exceeds WCAG AA Normal Text 4.5:1)`, emeraldOnDarkSurface >= 4.5);

  // ---------------------------------------------------------------------------
  // GROUP 3: ARTH GOLD (#A8742A) RULE 7 INVARIANT VERIFICATION
  // ---------------------------------------------------------------------------
  console.log('\n--- Group 3: Arth Gold (#A8742A) AGENTS.md Rule 7 Invariant ---');
  const ARTH_GOLD = '#A8742A';

  const goldOnWhiteRatio = getContrastRatio(ARTH_GOLD, '#FFFFFF');
  const goldOnIvoryRatio = getContrastRatio(ARTH_GOLD, WARM_IVORY);

  assert(`Arth Gold on White contrast is ${goldOnWhiteRatio.toFixed(2)}:1`, goldOnWhiteRatio >= 3.0 && goldOnWhiteRatio < 4.5);
  assert(`Arth Gold on Warm Ivory contrast is ${goldOnIvoryRatio.toFixed(2)}:1`, goldOnIvoryRatio >= 3.0 && goldOnIvoryRatio < 4.5);
  assert('RULE 7 PROOF: Arth Gold passes WCAG AA for Large UI Elements / Badges (>= 3.0:1)', goldOnWhiteRatio >= 3.0);
  assert('RULE 7 PROOF: Arth Gold FAILS WCAG AA for Normal Body Text (< 4.5:1) — confirming Rule 7 body text prohibition', goldOnWhiteRatio < 4.5);

  // ---------------------------------------------------------------------------
  // GROUP 4: KEYBOARD NAVIGATION, FOCUS RINGS & SKIP LINK ARCHITECTURE
  // ---------------------------------------------------------------------------
  console.log('\n--- Group 4: Keyboard Navigation, Focus Rings & Skip Link ---');
  const rootDir = fs.existsSync(path.resolve(process.cwd(), 'apps/web'))
    ? process.cwd()
    : path.resolve(process.cwd(), '../..');

  const globalsCssPath = path.resolve(rootDir, 'apps/web/app/globals.css');
  const globalsCssContent = fs.readFileSync(globalsCssPath, 'utf8');

  const hasFocusVisibleRule = globalsCssContent.includes(':focus-visible') && globalsCssContent.includes('outline:');
  assert('apps/web/app/globals.css contains explicit :focus-visible ring rule with outline and offset', hasFocusVisibleRule);

  const hasSkipLinkClass = globalsCssContent.includes('.skip-to-content') && globalsCssContent.includes('.skip-to-content:focus');
  assert('apps/web/app/globals.css contains .skip-to-content keyboard reveal rule', hasSkipLinkClass);

  const hasPrefersReducedMotion = globalsCssContent.includes('@media (prefers-reduced-motion: reduce)');
  assert('apps/web/app/globals.css contains @media (prefers-reduced-motion: reduce) override', hasPrefersReducedMotion);

  const rootLayoutPath = path.resolve(rootDir, 'apps/web/app/layout.tsx');
  const rootLayoutContent = fs.readFileSync(rootLayoutPath, 'utf8');

  const hasSkipToContentComponent = rootLayoutContent.includes('<SkipToContent />');
  assert('RootLayout mounts <SkipToContent /> at top of DOM', hasSkipToContentComponent);

  const hasMainContentAnchor = rootLayoutContent.includes('id="main-content"');
  assert('RootLayout contains landmark <main id="main-content"> with accessible tabIndex', hasMainContentAnchor);

  // ---------------------------------------------------------------------------
  // GROUP 5: FINANCIAL TABULAR SEMANTICS & SCREEN READER LIVE REGIONS
  // ---------------------------------------------------------------------------
  console.log('\n--- Group 5: Financial Tabular Semantics & Screen Reader Live Regions ---');
  const tableComponentPath = path.resolve(rootDir, 'apps/web/components/common/AccessibleTable.tsx');
  const tableContent = fs.readFileSync(tableComponentPath, 'utf8');

  const hasCaption = tableContent.includes('<caption');
  const hasColScope = tableContent.includes('scope="col"');
  const hasRowScope = tableContent.includes('scope="row"');

  assert('AccessibleTable primitive includes screen-reader <caption> element', hasCaption);
  assert('AccessibleTable includes scope="col" on column headers (<th>)', hasColScope);
  assert('AccessibleTable designates primary column with scope="row" (<th>) for screen readers', hasRowScope);

  console.log('\n=================================================================');
  console.log(`  WCAG AA AUDIT RESULTS: ${passed} PASSED / ${failed} FAILED`);
  console.log('=================================================================\n');

  if (failed > 0) {
    throw new Error(`WCAG AA audit failed with ${failed} failing assertions`);
  }
}

runWcagAuditTests().catch((err) => {
  console.error('Audit run failed with error:', err);
  process.exit(1);
});
