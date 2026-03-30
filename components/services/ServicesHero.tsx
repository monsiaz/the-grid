import Hero from "@/components/Hero";
import { ChevronDown } from "lucide-react";

type ServicesHeroProps = {
  title?: string | null;
  description?: string | null;
  backgroundImage?: string | null;
};

export default function ServicesHero({ title, description, backgroundImage }: ServicesHeroProps) {
  return (
    <Hero
      backgroundImage={backgroundImage || "/images/hero.webp"}
      minHeightClassName="min-h-[800px]"
      overlayClassName="bg-black/30"
      headerAnchorPrefix="/"
      activeHeaderItem="services"
      contentClassName="mx-auto flex min-h-[640px] max-w-[432px] flex-col items-center justify-center gap-8 text-center"
      titleClassName="font-[var(--font-league-spartan)] text-[64px] leading-none font-bold uppercase drop-shadow-[4px_4px_8px_rgba(0,0,0,0.1)] max-[1200px]:text-[clamp(44px,6vw,64px)]"
      title={
        <>
          {title || "One-stop"} <span className="text-muted">shop</span>
        </>
      }
      description={description || undefined}
      descriptionClassName="m-0 text-center text-base leading-[1.4] uppercase"
      cta={{
        href: "#services-talent",
        ariaLabel: "Scroll to services",
        label: <ChevronDown className="h-5 w-5 shrink-0" aria-hidden />,
        className: "mt-0 px-3 py-2",
      }}
    />
  );
}
