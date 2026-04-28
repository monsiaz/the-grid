"use client";

import Hero from "@/components/Hero";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

type ServicesHeroProps = {
  title?: string | null;
  description?: string | null;
  backgroundImage?: string | null;
  heroCta?: "large" | "slim";
  stickyHeader?: boolean;
  menuStyle?: "default" | "liquid";
  menuTextSize?: "regular" | "large";
  heroTextBackdropOpacity?: number;
  heroTextBackdropBlur?: number;
  parallaxIntensity?: number;
  heroGradientIntensity?: number;
};

function renderServicesTitle(raw: string): React.ReactNode {
  const value = raw.trim();
  const idx = value.toLowerCase().lastIndexOf(" ");
  if (idx > 0) {
    return (
      <>
        {value.slice(0, idx)}
        <span className="text-muted"> {value.slice(idx + 1)}</span>
      </>
    );
  }
  return value;
}

export default function ServicesHero({
  title,
  description,
  backgroundImage,
  heroCta = "large",
  stickyHeader = false,
  menuStyle = "default",
  menuTextSize = "large",
  heroTextBackdropOpacity = 1,
  heroTextBackdropBlur = 56,
  parallaxIntensity = 15,
  heroGradientIntensity = 1,
}: ServicesHeroProps) {
  const t = useTranslations("services.hero");
  const effectiveTitle = title || t("titleFallback");
  const ctaClassName = heroCta === "slim"
    ? "mt-0 h-[40px] min-h-[40px] px-3 py-2"
    : "mt-0 h-[52px] min-h-[52px] w-[52px] px-0";
  return (
    <Hero
      backgroundImage={backgroundImage || "/assets/v2/services/hero.webp"}
      minHeightClassName="min-h-[clamp(560px,90svh,800px)]"
      overlayClassName="bg-[linear-gradient(180deg,rgba(15,15,15,0.02)_0%,rgba(15,15,15,0.06)_60%,rgba(15,15,15,0.18)_100%)]"
      backdropAt="50% 55%"
      backdropScale="65% 82%"
      headerAnchorPrefix="/"
      activeHeaderItem="services"
      stickyHeader={stickyHeader}
      menuStyle={menuStyle}
      menuTextSize={menuTextSize}
      backdropOpacity={heroTextBackdropOpacity}
      backdropBlur={heroTextBackdropBlur}
      parallaxIntensity={parallaxIntensity}
      heroGradientIntensity={heroGradientIntensity}
      contentClassName="mx-auto flex w-full max-w-[960px] flex-col items-center justify-center gap-8 py-16 text-center min-[900px]:min-h-[640px] min-[900px]:py-0"
      titleClassName="display-hero mx-auto whitespace-nowrap text-center max-[600px]:whitespace-normal"
      title={renderServicesTitle(effectiveTitle)}
      description={description || undefined}
      descriptionClassName="body-lg m-0 text-center text-white/84 [text-shadow:0_2px_12px_rgba(0,0,0,0.55)]"
      cta={{
        href: "#services-value",
        ariaLabel: t("cta"),
        label: <ChevronDown className="h-5 w-5 shrink-0" aria-hidden />,
        className: ctaClassName,
      }}
    />
  );
}
