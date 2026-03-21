import Hero from "@/components/Hero";
import { ChevronDown } from "lucide-react";

export default function DriversHero() {
  return (
    <Hero
      backgroundImage="/images/drivers/hero-collage.webp"
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
        ariaLabel: "Scroll to drivers grid",
        label: <ChevronDown className="h-5 w-5 shrink-0" aria-hidden />,
        className: "h-[34px] w-[57px] px-0 py-0",
      }}
    />
  );
}
