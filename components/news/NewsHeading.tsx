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
  "pill-button pill-button-accent h-10 min-h-10 px-5 whitespace-nowrap";

const inactiveClass =
  "pill-button pill-button-accent-outline h-10 min-h-10 px-5 whitespace-nowrap";

export default function NewsHeading({ activeFilter, tags }: NewsHeadingProps) {
  const t = useTranslations("news");
  return (
    <div className="flex w-full flex-col items-start gap-4 min-[900px]:flex-row min-[900px]:items-center min-[900px]:justify-between">
      <motion.h1
        className="display-section m-0"
        variants={slideInLeft}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        transition={smoothTransition}
      >
        <span className="text-secondary">{t("heading.muted")}</span>
        <span className="text-muted">{t("heading.accent")}</span>
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
