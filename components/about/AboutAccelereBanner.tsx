"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform, scaleIn, smoothTransition, viewport } from "../motion";

type AboutAccelereBannerProps = {
  bannerImage?: string | null;
};

/**
 * ACCÉLÈRE banner.
 *
 * The source asset (`/assets/v2/about/accelere.webp`, 2400×1350) is a fully
 * composited 16:9 artwork: "ACCÉLÈRE" headline, F1 car photo, tagline and
 * partner logos (THE GRID × CÔME) are baked into the image. Any `object-cover`
 * crop or `scale-[1.x]` wrapper therefore clips meaningful content (previously
 * the logos at the bottom and the edges of the headline on narrow viewports).
 *
 * The template locks the section to the native 16:9 aspect so the whole
 * artwork is always visible, and applies a very subtle parallax that stays
 * within a 6 % safety margin (`scale-[1.06]` + ±3 % translate) so the outer
 * pixels never enter the visible frame — the full composition stays intact
 * while the banner still animates on scroll.
 *
 * On very narrow viewports (<640 px) a 16:9 frame would become too short to
 * read the baked tagline, so we also enforce a reasonable minimum height and
 * switch the image to `object-contain` against the page background, letting
 * the artwork letterbox rather than crop.
 */
export default function AboutAccelereBanner({ bannerImage }: AboutAccelereBannerProps = {}) {
  const t = useTranslations("about.accelere");
  const bg = bannerImage || "/assets/v2/about/accelere.webp";
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // Restrained parallax: ±3% translate on a 106%-tall image → no edge reveal.
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  return (
    <motion.section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-primary aspect-[16/9] max-[640px]:aspect-auto max-[640px]:min-h-[240px] max-[640px]:h-[62vw]"
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      transition={{ ...smoothTransition, duration: 1 }}
    >
      <motion.div style={{ y: parallaxY }} className="absolute inset-0 scale-[1.06]">
        <Image
          src={bg}
          alt={t("bannerAlt")}
          fill
          sizes="100vw"
          className="object-cover object-center max-[640px]:object-contain"
        />
      </motion.div>
    </motion.section>
  );
}
