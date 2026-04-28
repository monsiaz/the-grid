"use client";

import Hero from "@/components/Hero";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

type DriversHeroProps = {
  title?: string | null;
  description?: string | null;
  backgroundImage?: string | null;
  heroCta?: "large" | "slim";
  stickyHeader?: boolean;
  menuStyle?: "default" | "liquid";
  menuTextSize?: "regular" | "large";
  heroTextBackdropOpacity?: number;
  heroTextBackdropBlur?: number;
};

export default function DriversHero({
  description,
  backgroundImage,
  heroCta = "large",
  stickyHeader = false,
  menuStyle = "default",
  menuTextSize = "large",
  heroTextBackdropOpacity = 1,
  heroTextBackdropBlur = 56,
}: DriversHeroProps) {
  const t = useTranslations("drivers.hero");
  const ctaClassName = heroCta === "slim"
    ? "h-[40px] min-h-[40px] px-3 py-2"
    : "h-[52px] min-h-[52px] w-[52px] px-0";
  return (
    <Hero
      backgroundImage={backgroundImage || "/assets/v2/drivers/hero-collage.webp"}
      title={
        <>
          {t("titleFor")} <span className="text-muted">{t("titleDeserving")}</span> {t("titleDrivers")}
        </>
      }
      description={description || t("descriptionFallback")}
      minHeightClassName="min-h-[clamp(560px,90svh,800px)]"
      contentClassName="mx-auto flex w-full max-w-[820px] flex-col items-center justify-center gap-5 py-14 text-center min-[900px]:gap-5 min-[900px]:py-0"
      titleClassName="display-hero mx-auto max-w-[18ch] text-center"
      ctaMarginTopClass="mt-0"
      descriptionClassName="body-lg m-0 mx-auto max-w-[54ch] text-center text-white/84 [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]"
      overlayClassName="bg-[linear-gradient(180deg,rgba(15,15,15,0.04)_0%,rgba(15,15,15,0.1)_60%,rgba(15,15,15,0.28)_100%)]"
      backdropAt="50% 52%"
      backdropScale="72% 88%"
      activeHeaderItem="drivers"
      stickyHeader={stickyHeader}
      menuStyle={menuStyle}
      menuTextSize={menuTextSize}
      backdropOpacity={heroTextBackdropOpacity}
      backdropBlur={heroTextBackdropBlur}
      cta={{
        href: "#drivers-grid",
        ariaLabel: t("cta"),
        label: <ChevronDown className="h-5 w-5 shrink-0" aria-hidden />,
        className: ctaClassName,
      }}
    />
  );
}
