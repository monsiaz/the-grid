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

  const scrollByStep = useCallback((direction: -1 | 1) => {
    const root = scrollRef.current;
    if (!root) return;
    const card = root.querySelector<HTMLElement>("[data-news-card]");
    const step = (card?.offsetWidth ?? 300) + GAP_PX;
    root.scrollBy({ left: direction * step, behavior: "smooth" });
  }, []);

  return (
    <section className="bg-primary relative isolate min-h-[clamp(520px,70vh,665px)] w-full py-16 min-[900px]:py-20" id="news">
      <motion.div
        className="mx-auto mb-8 flex w-full max-w-[1344px] items-center justify-center gap-16 px-[clamp(20px,4vw,48px)] max-[900px]:justify-start max-[900px]:gap-[22px]"
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
          className="text-accent border-accent inline-flex h-[44px] w-[57px] cursor-pointer items-center justify-center rounded-full border-2 bg-transparent hover:text-black hover:bg-accent hover:scale-110 transition-all duration-300"
        >
          <ChevronLeft className="size-5 shrink-0" aria-hidden />
        </button>
        <h2 className="m-0 text-[28px] leading-[1.2] font-bold uppercase">{t("heading")}</h2>
        <button
          type="button"
          aria-label={t("next")}
          onClick={() => scrollByStep(1)}
          className="text-accent border-accent inline-flex h-[44px] w-[57px] cursor-pointer items-center justify-center rounded-full border-2 bg-transparent hover:text-black hover:bg-accent hover:scale-110 transition-all duration-300"
        >
          <ChevronRight className="size-5 shrink-0" aria-hidden />
        </button>
      </motion.div>
      <motion.div
        ref={scrollRef}
        className="mx-auto flex w-full max-w-[1344px] snap-x snap-mandatory items-start gap-7 overflow-x-auto scroll-smooth px-[clamp(20px,4vw,48px)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {items.map((item, idx) => (
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
