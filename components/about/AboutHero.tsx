"use client";

import Hero from "@/components/Hero";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

type AboutHeroProps = {
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

export default function AboutHero({
  description,
  backgroundImage,
  heroCta = "large",
  stickyHeader = false,
  menuStyle = "default",
  menuTextSize = "large",
  heroTextBackdropOpacity = 1,
  heroTextBackdropBlur = 56,
}: AboutHeroProps) {
  const t = useTranslations("about.hero");
  const titleMain = t("title");
  const titleAccent = t("titleAccent");
  const ctaClassName = heroCta === "slim"
    ? "mt-0 h-[40px] min-h-[40px] px-3 py-2"
    : "mt-0 h-[52px] min-h-[52px] w-[52px] px-0";
  return (
    <Hero
      backgroundImage={backgroundImage || "/images/about/hero.webp"}
      backgroundObjectPosition="50% 24%"
      minHeightClassName="min-h-[clamp(560px,90svh,800px)]"
      overlayClassName="bg-[linear-gradient(180deg,rgba(15,15,15,0.02)_0%,rgba(15,15,15,0.06)_60%,rgba(15,15,15,0.18)_100%)]"
      backdropAt="50% 55%"
      backdropScale="70% 85%"
      headerAnchorPrefix="/"
      activeHeaderItem="about"
      stickyHeader={stickyHeader}
      menuStyle={menuStyle}
      menuTextSize={menuTextSize}
      backdropOpacity={heroTextBackdropOpacity}
      backdropBlur={heroTextBackdropBlur}
      contentClassName="mx-auto flex w-full max-w-[760px] flex-col items-center justify-center gap-5 py-16 text-center min-[900px]:min-h-[640px] min-[900px]:py-0 min-[900px]:pt-12"
      ctaMarginTopClass="mt-0"
      titleClassName="display-hero mx-auto whitespace-nowrap text-center max-[600px]:whitespace-normal"
      title={
        <>
          {titleMain} <span className="text-muted">{titleAccent}</span>
        </>
      }
      description={description || undefined}
      descriptionClassName="body-lg m-0 text-center text-white/84 [text-shadow:0_2px_12px_rgba(0,0,0,0.55)]"
      cta={{
        href: "#about-core",
        ariaLabel: t("cta"),
        label: <ChevronDown className="h-5 w-5 shrink-0" aria-hidden />,
        className: ctaClassName,
      }}
    />
  );
}
