import Hero from "@/components/Hero";
import { ChevronDown } from "lucide-react";

type AboutHeroProps = {
  title: string;
  description?: string | null;
  backgroundImage?: string | null;
};

export default function AboutHero({ title, description, backgroundImage }: AboutHeroProps) {
  return (
    <Hero
      backgroundImage={backgroundImage || "/images/about/hero.webp"}
      minHeightClassName="min-h-[clamp(560px,90vh,800px)]"
      overlayClassName="bg-black/30"
      headerAnchorPrefix="/"
      activeHeaderItem="about"
      contentClassName="mx-auto flex w-full max-w-[480px] flex-col items-center justify-center gap-8 py-16 text-center min-[900px]:min-h-[640px] min-[900px]:py-0"
      titleClassName="font-[var(--font-league-spartan)] text-[64px] leading-none font-bold uppercase drop-shadow-[4px_4px_8px_rgba(0,0,0,0.1)] max-[1200px]:text-[clamp(44px,6vw,64px)]"
      title={
        <>
          Who we <span className="text-muted">are</span>
        </>
      }
      description={description || undefined}
      descriptionClassName="m-0 text-center text-base leading-[1.55] font-light"
      cta={{
        href: "#about-core",
        ariaLabel: "Scroll to who we are",
        label: <ChevronDown className="h-5 w-5 shrink-0" aria-hidden />,
        className: "mt-0 px-3 py-2",
      }}
    />
  );
}
