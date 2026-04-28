/**
 * Server component — injects CSS custom-property overrides based on DesignSettings.
 * Rendered once per page in the layout <head> area via a <style> tag.
 * This lets all components pick up accent color, radius, font, spacing, etc.
 * from CSS vars without any client-side JS or context.
 */
import type { DesignSettings } from "@/lib/designSettings";
import { ACCENT_HEX } from "@/lib/designSettings";

const RADIUS: Record<DesignSettings["cardBorderRadius"], string> = {
  default: "22px",
  sharp: "6px",
  round: "36px",
};

const SECTION_PY: Record<DesignSettings["sectionSpacing"], string> = {
  compact: "48px",
  normal: "80px",
  spacious: "128px",
};

const HERO_FONT_SIZE: Record<DesignSettings["heroTitleSize"], string> = {
  normal: "clamp(44px, 7vw, 96px)",
  large: "clamp(52px, 8.5vw, 116px)",
  xl: "clamp(60px, 10.5vw, 140px)",
};

const FONT_HEADING: Record<DesignSettings["globalFont"], string> = {
  spartan: "var(--font-league-spartan), sans-serif",
  inter: "var(--font-inter), sans-serif",
  syne: "var(--font-syne), sans-serif",
};

const FONT_BODY: Record<DesignSettings["globalFont"], string> = {
  spartan: "var(--font-poppins), sans-serif",
  inter: "var(--font-inter), sans-serif",
  syne: "var(--font-syne), sans-serif",
};

export default function DesignVars({ ds }: { ds: DesignSettings }) {
  const css = `
:root {
  --accent: ${ACCENT_HEX[ds.accentColor] ?? ACCENT_HEX.red};
  --ds-card-radius: ${RADIUS[ds.cardBorderRadius] ?? RADIUS.default};
  --ds-section-py: ${SECTION_PY[ds.sectionSpacing] ?? SECTION_PY.normal};
  --ds-hero-font-size: ${HERO_FONT_SIZE[ds.heroTitleSize] ?? HERO_FONT_SIZE.normal};
  --ds-font-heading: ${FONT_HEADING[ds.globalFont] ?? FONT_HEADING.spartan};
  --ds-font-body: ${FONT_BODY[ds.globalFont] ?? FONT_BODY.spartan};
}
.display-hero { font-size: var(--ds-hero-font-size); font-family: var(--ds-font-heading); }
h1, h2, h3, h4, h5, h6 { font-family: var(--ds-font-heading); }
body { font-family: var(--ds-font-body); }
p, li, label, input, textarea, button, figcaption { font-family: var(--ds-font-body); }
`.trim();

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
