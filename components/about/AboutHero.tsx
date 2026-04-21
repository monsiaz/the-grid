"use client";

import Hero from "@/components/Hero";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

type AboutHeroProps = {
  title?: string | null;
  description?: string | null;
  backgroundImage?: string | null;
};

export default function AboutHero({ description, backgroundImage }: AboutHeroProps) {
  const t = useTranslations("about.hero");
  const titleMain = t("title");
  const titleAccent = t("titleAccent");
  return (
    <Hero
      backgroundImage={backgroundImage || "/images/about/hero.webp"}
      minHeightClassName="min-h-[clamp(560px,90svh,800px)]"
      overlayClassName="bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.1)_60%,rgba(0,0,0,0.25)_100%)]"
      backdropAt="50% 55%"
      backdropScale="70% 85%"
      headerAnchorPrefix="/"
      activeHeaderItem="about"
      contentClassName="mx-auto flex w-full max-w-[480px] flex-col items-center justify-center gap-8 py-16 text-center min-[900px]:min-h-[640px] min-[900px]:py-0"
      titleClassName="font-[var(--font-league-spartan)] text-[64px] leading-none font-bold uppercase [text-shadow:0_4px_24px_rgba(0,0,0,0.55),0_2px_8px_rgba(0,0,0,0.4)] max-[1200px]:text-[clamp(44px,6vw,64px)]"
      title={
        <>
          {titleMain} <span className="text-muted">{titleAccent}</span>
        </>
      }
      description={description || undefined}
      descriptionClassName="m-0 text-center text-base leading-[1.55] font-light uppercase [text-shadow:0_2px_12px_rgba(0,0,0,0.55)]"
      cta={{
        href: "#about-core",
        ariaLabel: t("cta"),
        label: <ChevronDown className="h-5 w-5 shrink-0" aria-hidden />,
        className: "mt-0 px-3 py-2",
      }}
    />
  );
}
