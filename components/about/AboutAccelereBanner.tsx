"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform, scaleIn, smoothTransition, viewport } from "../motion";

const THE_GRID_LOGO = "/assets/grid-agency-white.png";
const COME_LOGO = "/assets/come-logo-white.png";

type AboutAccelereBannerProps = {
  bannerImage?: string | null;
};

export default function AboutAccelereBanner({ bannerImage }: AboutAccelereBannerProps = {}) {
  const t = useTranslations("about.accelere");
  const bg = bannerImage || "/assets/accelere-bg.jpg";
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  return (
    <motion.section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black aspect-[16/9] max-[640px]:aspect-auto max-[640px]:min-h-[56vw]"
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      transition={{ ...smoothTransition, duration: 1 }}
    >
      {/* Background photo with subtle parallax */}
      <motion.div style={{ y: parallaxY }} className="absolute inset-0 scale-[1.06]">
        <Image
          src={bg}
          alt={t("bannerAlt")}
          fill
          sizes="100vw"
          priority
          className="object-cover object-center"
        />
      </motion.div>

      {/* Dark gradient: strong at bottom for text legibility, subtle at top */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/10" />

      {/* Centre: "ACCÉLÈRE" headline */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <h2
          className="m-0 font-black text-white text-center leading-none select-none"
          style={{ fontSize: "clamp(72px, 14vw, 195px)", letterSpacing: "-0.02em" }}
        >
          &ldquo;ACCÉLÈRE&rdquo;
        </h2>
      </div>

      {/* Bottom: tagline + logos */}
      <div className="absolute bottom-[6%] left-0 right-0 flex flex-col items-center gap-[clamp(8px,1.5vw,20px)]">
        <p
          className="m-0 text-white/80 uppercase text-center leading-snug"
          style={{ fontFamily: "var(--font-poppins), sans-serif", fontSize: "clamp(11px,1.2vw,18px)", letterSpacing: "0.22em" }}
        >
          BEHIND EVERY GREAT DRIVER,<br />SOMEONE BELIEVED FIRST.
        </p>
        <div className="flex items-center gap-[clamp(14px,2vw,30px)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={THE_GRID_LOGO}
            alt="The Grid Agency"
            style={{ height: "clamp(25px,2.5vw,42px)" }}
            className="w-auto object-contain"
            draggable={false}
          />
          <span className="text-white/40" style={{ fontSize: "clamp(17px,1.5vw,25px)" }}>×</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={COME_LOGO}
            alt="Côme Ensemble"
            style={{ height: "clamp(25px,2.5vw,42px)" }}
            className="w-auto object-contain"
            draggable={false}
          />
        </div>
      </div>
    </motion.section>
  );
}
