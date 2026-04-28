import type { CSSProperties } from "react";

/** Matches globals/Homepage.ts → heroTitleLayout */
export type HomeHeroTitleLayout = {
  marginTopMinPx?: number | null;
  marginTopMidVh?: number | null;
  marginTopMaxPx?: number | null;
  marginTopMobileMinPx?: number | null;
  marginTopMobileMidVh?: number | null;
  marginTopMobileMaxPx?: number | null;
  fontSizeMinPx?: number | null;
  fontSizeMidVw?: number | null;
  fontSizeMaxPx?: number | null;
  fontSizeMobileMinPx?: number | null;
  fontSizeMobileMidVw?: number | null;
  fontSizeMobileMaxPx?: number | null;
  lineGapEm?: number | null;
  lineHeight?: number | null;
  trackingEm?: number | null;
  backdropXPercent?: number | null;
  backdropYPercent?: number | null;
};

const DEFAULT_HERO_LAYOUT = {
  marginTopMinPx: 88,
  marginTopMidVh: 17.5,
  marginTopMaxPx: 168,
  marginTopMobileMinPx: 72,
  marginTopMobileMidVh: 15,
  marginTopMobileMaxPx: 132,
  fontSizeMinPx: 26,
  fontSizeMidVw: 4.1,
  fontSizeMaxPx: 76,
  fontSizeMobileMinPx: 24,
  fontSizeMobileMidVw: 7.5,
  fontSizeMobileMaxPx: 38,
  lineGapEm: 0.08,
  lineHeight: 0.93,
  trackingEm: -0.028,
  backdropXPercent: 21,
  backdropYPercent: 54,
} as const;

export type ResolvedHomeHeroTitleLayout = {
  [K in keyof typeof DEFAULT_HERO_LAYOUT]: number;
};

function pick(
  v: number | null | undefined,
  d: number,
): number {
  return typeof v === "number" && !Number.isNaN(v) ? v : d;
}

export function resolveHomeHeroTitleLayout(
  layout: HomeHeroTitleLayout | null | undefined,
): ResolvedHomeHeroTitleLayout {
  const l = layout ?? {};
  return {
    marginTopMinPx: pick(l.marginTopMinPx, DEFAULT_HERO_LAYOUT.marginTopMinPx),
    marginTopMidVh: pick(l.marginTopMidVh, DEFAULT_HERO_LAYOUT.marginTopMidVh),
    marginTopMaxPx: pick(l.marginTopMaxPx, DEFAULT_HERO_LAYOUT.marginTopMaxPx),
    marginTopMobileMinPx: pick(l.marginTopMobileMinPx, DEFAULT_HERO_LAYOUT.marginTopMobileMinPx),
    marginTopMobileMidVh: pick(l.marginTopMobileMidVh, DEFAULT_HERO_LAYOUT.marginTopMobileMidVh),
    marginTopMobileMaxPx: pick(l.marginTopMobileMaxPx, DEFAULT_HERO_LAYOUT.marginTopMobileMaxPx),
    fontSizeMinPx: pick(l.fontSizeMinPx, DEFAULT_HERO_LAYOUT.fontSizeMinPx),
    fontSizeMidVw: pick(l.fontSizeMidVw, DEFAULT_HERO_LAYOUT.fontSizeMidVw),
    fontSizeMaxPx: pick(l.fontSizeMaxPx, DEFAULT_HERO_LAYOUT.fontSizeMaxPx),
    fontSizeMobileMinPx: pick(l.fontSizeMobileMinPx, DEFAULT_HERO_LAYOUT.fontSizeMobileMinPx),
    fontSizeMobileMidVw: pick(l.fontSizeMobileMidVw, DEFAULT_HERO_LAYOUT.fontSizeMobileMidVw),
    fontSizeMobileMaxPx: pick(l.fontSizeMobileMaxPx, DEFAULT_HERO_LAYOUT.fontSizeMobileMaxPx),
    lineGapEm: pick(l.lineGapEm, DEFAULT_HERO_LAYOUT.lineGapEm),
    lineHeight: pick(l.lineHeight, DEFAULT_HERO_LAYOUT.lineHeight),
    trackingEm: pick(l.trackingEm, DEFAULT_HERO_LAYOUT.trackingEm),
    backdropXPercent: pick(l.backdropXPercent, DEFAULT_HERO_LAYOUT.backdropXPercent),
    backdropYPercent: pick(l.backdropYPercent, DEFAULT_HERO_LAYOUT.backdropYPercent),
  };
}

export function homeHeroTitleLayoutToCss(
  layout: HomeHeroTitleLayout | null | undefined,
): {
  contentStyle: CSSProperties;
  titleStyle: CSSProperties;
  backdropAt: string;
} {
  const r = resolveHomeHeroTitleLayout(layout);
  const contentStyle = {
    "--hero-mt-min": `${r.marginTopMinPx}px`,
    "--hero-mt-mid": `${r.marginTopMidVh}vh`,
    "--hero-mt-max": `${r.marginTopMaxPx}px`,
    "--hero-mt-mob-min": `${r.marginTopMobileMinPx}px`,
    "--hero-mt-mob-mid": `${r.marginTopMobileMidVh}vh`,
    "--hero-mt-mob-max": `${r.marginTopMobileMaxPx}px`,
  } as CSSProperties;

  const titleStyle = {
    "--hero-fs-min": `${r.fontSizeMinPx}px`,
    "--hero-fs-mid": `${r.fontSizeMidVw}vw`,
    "--hero-fs-max": `${r.fontSizeMaxPx}px`,
    "--hero-fs-mob-min": `${r.fontSizeMobileMinPx}px`,
    "--hero-fs-mob-mid": `${r.fontSizeMobileMidVw}vw`,
    "--hero-fs-mob-max": `${r.fontSizeMobileMaxPx}px`,
    "--hero-gap": `${r.lineGapEm}em`,
    "--hero-lh": String(r.lineHeight),
    "--hero-track": `${r.trackingEm}em`,
  } as CSSProperties;

  return {
    contentStyle,
    titleStyle,
    backdropAt: `${r.backdropXPercent}% ${r.backdropYPercent}%`,
  };
}
