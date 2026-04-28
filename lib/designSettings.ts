import { getPayloadClient } from "./payload";

export type DesignSettings = {
  heroCta: "large" | "slim";
  stickyHeader: boolean;
  headerMenuStyle: "default" | "liquid";
  headerMenuTextSize: "regular" | "large";
  heroTextBackdropOpacity: number;
  heroTextBackdropBlur: number;
  servicesArrowStyle: "default" | "slim";
  sliderSpeed: number;
  // New
  accentColor: "red" | "white" | "gold" | "navy";
  parallaxIntensity: number;
  cardHoverStyle: "zoom" | "lift" | "flat";
  cardBorderRadius: "default" | "sharp" | "round";
  sectionSpacing: "compact" | "normal" | "spacious";
  heroGradientIntensity: number;
  heroTitleSize: "normal" | "large" | "xl";
  globalFont: "spartan" | "inter" | "syne";
};

const DEFAULTS: DesignSettings = {
  heroCta: "large",
  stickyHeader: false,
  headerMenuStyle: "default",
  headerMenuTextSize: "large",
  heroTextBackdropOpacity: 1,
  heroTextBackdropBlur: 56,
  servicesArrowStyle: "default",
  sliderSpeed: 0.5,
  accentColor: "red",
  parallaxIntensity: 15,
  cardHoverStyle: "zoom",
  cardBorderRadius: "default",
  sectionSpacing: "normal",
  heroGradientIntensity: 1,
  heroTitleSize: "normal",
  globalFont: "spartan",
};

/** Maps accent color option to hex value used as CSS --accent var override. */
export const ACCENT_HEX: Record<DesignSettings["accentColor"], string> = {
  red: "#b6483f",
  white: "#f0f0f0",
  gold: "#c9a84c",
  navy: "#2b4a8a",
};

export async function getDesignSettings(): Promise<DesignSettings> {
  try {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({ slug: "design-settings" });
    return {
      heroCta: (doc?.heroCta as "large" | "slim") ?? DEFAULTS.heroCta,
      stickyHeader: Boolean(doc?.stickyHeader ?? DEFAULTS.stickyHeader),
      headerMenuStyle: (doc?.headerMenuStyle as "default" | "liquid") ?? DEFAULTS.headerMenuStyle,
      headerMenuTextSize: (doc?.headerMenuTextSize as "regular" | "large") ?? DEFAULTS.headerMenuTextSize,
      heroTextBackdropOpacity: Number(doc?.heroTextBackdropOpacity ?? DEFAULTS.heroTextBackdropOpacity) || DEFAULTS.heroTextBackdropOpacity,
      heroTextBackdropBlur: Number(doc?.heroTextBackdropBlur ?? DEFAULTS.heroTextBackdropBlur) || DEFAULTS.heroTextBackdropBlur,
      servicesArrowStyle: (doc?.servicesArrowStyle as "default" | "slim") ?? DEFAULTS.servicesArrowStyle,
      sliderSpeed: Number(doc?.sliderSpeed ?? DEFAULTS.sliderSpeed) || DEFAULTS.sliderSpeed,
      accentColor: (doc?.accentColor as DesignSettings["accentColor"]) ?? DEFAULTS.accentColor,
      parallaxIntensity: Number(doc?.parallaxIntensity ?? DEFAULTS.parallaxIntensity),
      cardHoverStyle: (doc?.cardHoverStyle as DesignSettings["cardHoverStyle"]) ?? DEFAULTS.cardHoverStyle,
      cardBorderRadius: (doc?.cardBorderRadius as DesignSettings["cardBorderRadius"]) ?? DEFAULTS.cardBorderRadius,
      sectionSpacing: (doc?.sectionSpacing as DesignSettings["sectionSpacing"]) ?? DEFAULTS.sectionSpacing,
      heroGradientIntensity: Number(doc?.heroGradientIntensity ?? DEFAULTS.heroGradientIntensity),
      heroTitleSize: (doc?.heroTitleSize as DesignSettings["heroTitleSize"]) ?? DEFAULTS.heroTitleSize,
      globalFont: (doc?.globalFont as DesignSettings["globalFont"]) ?? DEFAULTS.globalFont,
    };
  } catch {
    return DEFAULTS;
  }
}
