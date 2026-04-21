"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  motion,
  fadeUp,
  slideInLeft,
  staggerContainer,
  smoothTransition,
  viewport,
} from "../motion";

type NewsHeadingProps = {
  activeFilter: "sporting" | "commercial" | null;
};

const activeClass =
  "inline-flex h-[44px] items-center rounded-full border-2 border-accent bg-accent px-7 text-[13px] leading-[1.2] font-semibold tracking-[0.02em] text-white uppercase transition-all duration-300 hover:bg-white hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const inactiveClass =
  "inline-flex h-[44px] items-center rounded-full border-2 border-secondary bg-transparent px-7 text-[13px] leading-[1.2] font-semibold tracking-[0.02em] text-secondary uppercase transition-all duration-300 hover:bg-secondary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export default function NewsHeading({ activeFilter }: NewsHeadingProps) {
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
        <motion.div
          variants={fadeUp}
          transition={smoothTransition}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link
            href="/news"
            className={activeFilter === null ? activeClass : inactiveClass}
          >
            {t("filters.all")}
          </Link>
        </motion.div>
        <motion.div
          variants={fadeUp}
          transition={smoothTransition}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link
            href="/news?filter=sporting"
            className={activeFilter === "sporting" ? activeClass : inactiveClass}
          >
            {t("filters.sporting")}
          </Link>
        </motion.div>
        <motion.div
          variants={fadeUp}
          transition={smoothTransition}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link
            href="/news?filter=commercial"
            className={activeFilter === "commercial" ? activeClass : inactiveClass}
          >
            {t("filters.commercial")}
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
