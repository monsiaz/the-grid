"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  motion,
  fadeUp,
  scaleIn,
  smoothTransition,
  viewport,
} from "./motion";

type DriversProps = {
  heading?: string;
  headingAccent?: string;
  backgroundImage?: string | null;
  backgroundImageFocalPoint?: string | null;
};

export default function Drivers({ heading, headingAccent, backgroundImage, backgroundImageFocalPoint }: DriversProps) {
  const t = useTranslations("home.drivers");
  const headingValue = heading ?? t("headingFallback");
  const headingAccentValue = headingAccent ?? t("headingAccentFallback");
  const bg = backgroundImage || "/images/drivers.webp";
  return (
    <section
      className="relative flex min-h-[clamp(560px,85vh,800px)] w-full items-center justify-center"
      id="drivers"
    >
      <Image
        src={bg}
        alt=""
        fill
        loading="lazy"
        sizes="(max-width: 480px) 480px, (max-width: 900px) 900px, (max-width: 1440px) 1440px, 1600px"
        quality={85}
        className="absolute inset-0 object-cover"
        style={backgroundImageFocalPoint ? { objectPosition: backgroundImageFocalPoint } : undefined}
        aria-hidden
      />
      {/* Very light global tint — decorative only; must not steal clicks (footer locale menu overlaps this band when open). */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-black/15" />
      {/* Soft blob shadow concentrated on the text — same technique as Hero */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[11] overflow-hidden">
        <div
          style={{
            position: "absolute",
            inset: "-80px",
            background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.52) 38%, rgba(0,0,0,0.16) 60%, transparent 74%)",
            filter: "blur(52px)",
          }}
        />
      </div>
      <div className="relative z-20 mx-auto my-32 grid w-full max-w-[1344px] justify-items-center gap-14 px-[clamp(20px,4vw,48px)] text-center max-[900px]:my-[88px] max-[900px]:gap-[38px]">
        <motion.h2
          className="display-section m-0 text-balance drop-shadow-[0_8px_24px_rgba(0,0,0,0.22)]"
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ ...smoothTransition, duration: 0.9 }}
        >
          {headingValue}
          <br />
          {headingAccentValue}
        </motion.h2>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ ...smoothTransition, delay: 0.3 }}
        >
          <Link
            href="/drivers"
            className="pill-button pill-button-accent-outline"
          >
            {t("cta")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
