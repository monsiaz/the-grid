import Hero from "@/components/Hero";

export default function DriversHeroFrame() {
  return (
    <Hero
      backgroundImage="/images/drivers/hero-collage.jpg"
      title={
        <>
          FOR <span className="text-muted">DESERVING</span> DRIVERS
        </>
      }
      description="Learn about them"
      minHeightClassName="min-h-[800px]"
      contentClassName="my-32 max-w-[658px] text-center"
      descriptionClassName="mt-2 text-base leading-[1.4] uppercase"
      overlayClassName="bg-black/70"
      activeHeaderItem="drivers"
      cta={{
        href: "#drivers-grid",
        label: "↓",
        className: "h-[34px] w-[57px] px-0 py-0 text-[20px]",
      }}
    />
  );
}
