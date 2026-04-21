"use client";

import Hero from "@/components/Hero";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

type DriversHeroProps = {
  title?: string | null;
  description?: string | null;
  backgroundImage?: string | null;
};

export default function DriversHero({ description, backgroundImage }: DriversHeroProps) {
  const t = useTranslations("drivers.hero");
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
      contentClassName="mx-auto my-24 max-w-[820px] text-center min-[900px]:my-32"
      titleClassName="font-[var(--font-league-spartan)] text-[clamp(44px,7vw,80px)] leading-[1] font-bold uppercase [text-shadow:0_4px_24px_rgba(0,0,0,0.55)] drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
      descriptionClassName="mt-4 text-base leading-[1.4] uppercase [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]"
      overlayClassName="bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.1)_60%,rgba(0,0,0,0.28)_100%)]"
      backdropAt="50% 52%"
      backdropScale="72% 88%"
      activeHeaderItem="drivers"
      cta={{
        href: "#drivers-grid",
        ariaLabel: t("cta"),
        label: <ChevronDown className="h-5 w-5 shrink-0" aria-hidden />,
        className: "h-[34px] w-[57px] px-0 py-0",
      }}
    />
  );
}
