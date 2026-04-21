"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useRef } from "react";
import NewsCard from "./NewsCard";
import {
  motion,
  fadeUp,
  staggerContainer,
  smoothTransition,
  viewport,
} from "./motion";

type NewsItem = {
  newsSlug: string;
  title: string;
  excerpt: string;
  image: string;
};

type NewsProps = {
  items: NewsItem[];
};

const GAP_PX = 28;

export default function News({ items }: NewsProps) {
  const t = useTranslations("home.news");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Deduplicate by slug to avoid showing the same article twice
  const uniqueItems = items.filter(
    (item, idx, arr) => arr.findIndex((i) => i.newsSlug === item.newsSlug) === idx,
  );

  const scrollByStep = useCallback((direction: -1 | 1) => {
    const root = scrollRef.current;
    if (!root) return;
    const card = root.querySelector<HTMLElement>("[data-news-card]");
    const step = (card?.offsetWidth ?? 300) + GAP_PX;
    root.scrollBy({ left: direction * step, behavior: "smooth" });
  }, []);

  return (
    <section className="bg-primary relative isolate w-full py-16 min-[900px]:py-20" id="news">
      {/* Header row: arrows flank the title on all sizes */}
      <motion.div
        className="mx-auto mb-8 flex w-full max-w-[1344px] items-center justify-center gap-10 px-[clamp(20px,4vw,48px)] min-[900px]:gap-16"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        transition={smoothTransition}
      >
        <button
          type="button"
          aria-label={t("previous")}
          onClick={() => scrollByStep(-1)}
          className="pill-button pill-button-accent-outline h-11 min-h-11 w-11 shrink-0 px-0"
        >
          <ChevronLeft className="size-5 shrink-0" aria-hidden />
        </button>
        <h2 className="display-card m-0 text-[clamp(24px,3vw,38px)] text-secondary">{t("heading")}</h2>
        <button
          type="button"
          aria-label={t("next")}
          onClick={() => scrollByStep(1)}
          className="pill-button pill-button-accent-outline h-11 min-h-11 w-11 shrink-0 px-0"
        >
          <ChevronRight className="size-5 shrink-0" aria-hidden />
        </button>
      </motion.div>

      {/* Scrollable track — left-aligned, peek of next card on mobile */}
      <motion.div
        ref={scrollRef}
        className={[
          "flex snap-x snap-mandatory items-stretch gap-7 overflow-x-auto scroll-smooth",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          // Full-width on mobile with side padding so cards align with header
          "w-full px-[clamp(20px,4vw,48px)]",
          // Constrain to max-width on desktop (centred)
          "min-[900px]:mx-auto min-[900px]:max-w-[1344px]",
        ].join(" ")}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {uniqueItems.map((item, idx) => (
          <motion.div
            key={`${item.newsSlug}-${idx}`}
            variants={fadeUp}
            transition={smoothTransition}
            className="shrink-0 snap-start"
          >
            <NewsCard
              item={{
                slug: item.newsSlug,
                title: item.title,
                excerpt: item.excerpt,
                image: item.image,
              }}
              href={`/news/${item.newsSlug}`}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
