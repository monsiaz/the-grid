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

export type NewsFilterTag = {
  slug: string;
  label: string;
};

type NewsHeadingProps = {
  activeFilter: string | null;
  tags: NewsFilterTag[];
};

const activeClass =
  "inline-flex h-[40px] items-center rounded-full border-2 border-accent bg-accent px-4 text-[12px] leading-[1.2] font-semibold tracking-[0.04em] text-white uppercase transition-all duration-300 hover:bg-white hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white whitespace-nowrap";

const inactiveClass =
  "inline-flex h-[40px] items-center rounded-full border-2 border-secondary bg-transparent px-4 text-[12px] leading-[1.2] font-semibold tracking-[0.04em] text-secondary uppercase transition-all duration-300 hover:bg-secondary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white whitespace-nowrap";

export default function NewsHeading({ activeFilter, tags }: NewsHeadingProps) {
  const t = useTranslations("news");
  return (
    <div className="flex w-full flex-col items-start gap-4 min-[900px]:flex-row min-[900px]:items-center min-[900px]:justify-between">
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
        className="flex shrink-0 flex-wrap items-center gap-2"
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
        {tags.map((tag) => (
          <motion.div
            key={tag.slug}
            variants={fadeUp}
            transition={smoothTransition}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              href={`/news?filter=${encodeURIComponent(tag.slug)}`}
              className={activeFilter === tag.slug ? activeClass : inactiveClass}
            >
              {tag.label}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
