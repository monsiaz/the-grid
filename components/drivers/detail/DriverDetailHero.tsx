"use client";

import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import DriverFlags from "../DriverFlags";
import type { DriverCardData } from "../driversData";

type DriverDetailHeroProps = {
  driver: DriverCardData;
};

export default function DriverDetailHero({ driver }: DriverDetailHeroProps) {
  const t = useTranslations("drivers.detail");
  return (
    <div className="relative w-full overflow-hidden bg-black" style={{ height: "clamp(320px, 55vh, 560px)" }}>
      {/* Full-width photo */}
      <Image
        src={driver.image}
        alt={driver.name}
        fill
        priority
        className="object-cover object-top"
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
            <ul className="mb-2 flex list-none items-center gap-1.5 p-0 m-0">
              <DriverFlags
                codes={driver.flags}
                keyPrefix={`${driver.slug}-hero-flag`}
                className="h-4 w-[26px] shrink-0 overflow-hidden rounded-sm"
                wrapper="li"
              />
            </ul>
            <h1
              className="display-hero m-0 text-white leading-none"
              style={{ fontSize: "clamp(36px, 5.5vw, 80px)", letterSpacing: "-0.02em" }}
            >
              {driver.name}
            </h1>
            <p
              className="m-0 mt-2 text-white/70 uppercase"
              style={{ fontFamily: "var(--font-poppins), sans-serif", fontSize: "clamp(10px, 1vw, 14px)", letterSpacing: "0.15em" }}
            >
              {driver.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
