import Hero from "@/components/Hero";

export default function AboutHeroFrame() {
  return (
    <Hero
      backgroundImage="/figma-assets/about/frame-hero.jpg"
      minHeightClassName="min-h-[800px]"
      overlayClassName="bg-black/30"
      headerAnchorPrefix="/"
      activeHeaderItem="about"
      contentClassName="mx-auto flex min-h-[640px] max-w-[432px] flex-col items-center justify-center gap-8 text-center"
      titleClassName="font-[var(--font-league-spartan)] text-[64px] leading-none font-bold uppercase drop-shadow-[4px_4px_8px_rgba(0,0,0,0.1)] max-[1200px]:text-[clamp(44px,6vw,64px)]"
      title={
        <>
          Who we <span className="text-muted">are</span>
        </>
      }
      description="We are a 360° motorsport management and marketing agency operating globally. We build elite careers for deserving drivers and develop strategic partnerships across the ecosystem."
      descriptionClassName="m-0 text-center text-base leading-[1.4] uppercase"
      cta={{ href: "#about-core", label: "↓", className: "mt-0 px-3 py-2" }}
    />
  );
}
