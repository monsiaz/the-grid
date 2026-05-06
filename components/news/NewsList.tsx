"use client";

import { useMemo, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { motion, AnimatePresence, smoothTransition } from "../motion";
import NewsCard from "./NewsCard";
import type { NewsCardData } from "@/app/(frontend)/[locale]/news/page";

export type NewsFilterTag = {
  slug: string;
  label: string;
};

type NewsListProps = {
  initialFilter: string | null;
  tags: NewsFilterTag[];
  cards: NewsCardData[];
};

const activeClass =
  "pill-button pill-button-accent h-10 min-h-10 px-5 whitespace-nowrap";
const inactiveClass =
  "pill-button pill-button-accent-outline h-10 min-h-10 px-5 whitespace-nowrap";

export default function NewsList({ initialFilter, tags, cards }: NewsListProps) {
  const t = useTranslations("news");
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [activeFilter, setActiveFilter] = useState<string | null>(initialFilter);

  const filteredCards = useMemo(
    () =>
      activeFilter
        ? cards.filter((c) => c.tagSlug === activeFilter)
        : cards,
    [cards, activeFilter],
  );

  const selectFilter = (slug: string | null) => {
    if (slug === activeFilter) return;
    setActiveFilter(slug);
    const url = slug ? `${pathname}?filter=${encodeURIComponent(slug)}` : pathname;
    startTransition(() => {
      router.replace(url, { scroll: false });
    });
  };

  return (
    <div className="grid gap-10">
      <div className="flex w-full flex-col items-start gap-4 min-[900px]:flex-row min-[900px]:items-center min-[900px]:justify-between">
        <h1 className="display-section m-0">
          <span className="text-secondary">{t("heading.muted")}</span>
          <span className="text-muted">{t("heading.accent")}</span>
        </h1>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => selectFilter(null)}
            className={activeFilter === null ? activeClass : inactiveClass}
          >
            {t("filters.all")}
          </button>
          {tags.map((tag) => (
            <button
              key={tag.slug}
              type="button"
              onClick={() => selectFilter(tag.slug)}
              className={activeFilter === tag.slug ? activeClass : inactiveClass}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        layout
        className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredCards.map((card) => (
            <motion.div
              key={card.slug}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={smoothTransition}
            >
              <NewsCard
                href={`/news/${card.slug}`}
                title={card.title}
                image={card.image}
                imageFocalPoint={card.imageFocalPoint}
                excerpt={card.excerpt}
                tag={card.tag}
                cardClassName="h-[380px] w-full"
                titleClassName="text-[clamp(20px,1.7vw,28px)]"
                showExcerpt
                sizes="(max-width:700px) 100vw, (max-width:1024px) 50vw, 380px"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
