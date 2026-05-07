"use client";

import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import DriverFlags from "../DriverFlags";
import TeamLogo from "../TeamLogo";
import type { DriverCardData } from "../driversData";
import { resolveTeamLogos } from "../driversData";

type DriverDetailHeroProps = {
  driver: DriverCardData;
};

export default function DriverDetailHero({ driver }: DriverDetailHeroProps) {
  const t = useTranslations("drivers.detail");
  const logos = resolveTeamLogos(driver);
  return (
    <div className="relative w-full overflow-hidden bg-black" style={{ height: "calc(100svh - 76px)", minHeight: 320 }}>
      {/* Full-width photo */}
      <Image
        src={driver.image}
        alt={driver.name}
        fill
        priority
        className="object-cover object-top"
        style={driver.imageFocalPoint ? { objectPosition: driver.imageFocalPoint } : undefined}
        sizes="100vw"
      />

      {/* Gradient for legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

      {/* Back button — top left */}
      <div className="absolute left-[clamp(20px,4vw,48px)] top-5">
        <Link
          href="/drivers"
          className="pill-button pill-button-outline h-9 min-h-9 w-9 px-0"
          aria-label={t("back")}
        >
          <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
        </Link>
      </div>

      {/* Driver info — bottom left */}
      <div className="absolute bottom-0 left-0 right-0 px-[clamp(20px,4vw,48px)] pb-8">
        <div className="flex items-end gap-4">
          <div className="flex-1 min-w-0">
            <ul className="mb-2 flex list-none items-center gap-2 p-0 m-0">
              <DriverFlags
                codes={driver.flags}
                keyPrefix={`${driver.slug}-hero-flag`}
                className="h-[22px] w-[36px] shrink-0 overflow-hidden rounded-sm"
                wrapper="li"
              />
            </ul>
            <h1
              className="display-hero m-0 text-white leading-none"
              style={{ fontSize: "clamp(50px, 7.6vw, 111px)", letterSpacing: "-0.02em" }}
            >
              {driver.name}
            </h1>
            <p
              className="m-0 mt-1 text-white/70 uppercase"
              style={{ fontFamily: "var(--font-poppins), sans-serif", fontSize: "clamp(14px, 1.4vw, 19px)", letterSpacing: "0.15em" }}
            >
              {driver.role}
            </p>
            {logos.length > 0 ? (
              <div className="mt-4 flex items-center justify-start gap-2 h-[32px]">
                {logos.map((src, i) => (
                  <TeamLogo key={`${driver.slug}-hero-logo-${i}`} src={src} variant="hero" />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
