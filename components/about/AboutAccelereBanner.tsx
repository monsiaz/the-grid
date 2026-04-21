"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, scaleIn, smoothTransition, viewport } from "../motion";

const COME_MAILTO = "mailto:come.ensemble@comemaisonfinanciere.com";

export default function AboutAccelereBanner() {
  const t = useTranslations("about.accelere");
  return (
    <motion.section
      className="relative min-h-[clamp(420px,70vh,800px)] w-full overflow-hidden"
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      transition={{ ...smoothTransition, duration: 1 }}
    >
      <Image
        src="/assets/v2/about/accelere.webp"
        alt={t("bannerAlt")}
        fill
        sizes="100vw"
        className="object-cover"
      />
      <Link
        href={COME_MAILTO}
        aria-label={t("contactComeAria")}
        className="group absolute bottom-[4%] right-[4%] z-10 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/40 bg-black/40 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-white no-underline backdrop-blur-sm transition-all duration-300 hover:border-accent hover:text-accent hover:bg-black/60"
      >
        <span className="h-2 w-2 rounded-full bg-accent transition-transform duration-300 group-hover:scale-125" aria-hidden />
        {t("contactCome")}
      </Link>
    </motion.section>
  );
}
