"use client";

import { useTranslations } from "next-intl";
import {
  motion,
  fadeUp,
  slideInLeft,
  staggerContainer,
  smoothTransition,
  viewport,
} from "../motion";

export default function NewsHeading() {
  const t = useTranslations("news");
  return (
    <div className="flex w-full flex-col items-start gap-6 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:justify-between">
      <motion.h1
        className="m-0 font-[var(--font-league-spartan)] text-[clamp(40px,6vw,64px)] leading-none font-bold uppercase"
        variants={slideInLeft}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        transition={smoothTransition}
      >
        <span className="text-muted">{t("heading.muted")}</span>
        <span className="text-secondary">{t("heading.accent")}</span>
      </motion.h1>
      <motion.div
        className="flex flex-wrap items-center gap-3"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <motion.button
          type="button"
          className="h-[44px] rounded-full border-2 border-accent bg-accent px-7 text-[13px] leading-[1.2] font-semibold tracking-[0.02em] text-white uppercase transition-all duration-300 hover:bg-white hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          variants={fadeUp}
          transition={smoothTransition}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          {t("filters.sporting")}
        </motion.button>
        <motion.button
          type="button"
          className="h-[44px] rounded-full border-2 border-secondary bg-transparent px-7 text-[13px] leading-[1.2] font-semibold tracking-[0.02em] text-secondary uppercase transition-all duration-300 hover:bg-secondary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          variants={fadeUp}
          transition={smoothTransition}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          {t("filters.commercial")}
        </motion.button>
      </motion.div>
    </div>
  );
}
