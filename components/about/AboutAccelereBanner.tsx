"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform, scaleIn, smoothTransition, viewport } from "../motion";

type AboutAccelereBannerProps = {
  bannerImage?: string | null;
};

export default function AboutAccelereBanner({ bannerImage }: AboutAccelereBannerProps = {}) {
  const t = useTranslations("about.accelere");
  const bg = bannerImage || "/assets/v2/about/accelere.webp";
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <motion.section
      ref={sectionRef}
      className="relative min-h-[clamp(420px,70vh,800px)] w-full overflow-hidden"
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      transition={{ ...smoothTransition, duration: 1 }}
    >
      <motion.div style={{ y: parallaxY }} className="absolute inset-0 scale-[1.2]">
        <Image
          src={bg}
          alt={t("bannerAlt")}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
    </motion.section>
  );
}
