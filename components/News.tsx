"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useRef } from "react";
import NewsCard from "./NewsCard";
import { getNewsDetailHref } from "./news/newsData";
import { newsItems } from "./newsItems";
import {
  motion,
  fadeUp,
  staggerContainer,
  smoothTransition,
  viewport,
} from "./motion";

const GAP_PX = 28;

export default function News() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByStep = useCallback((direction: -1 | 1) => {
    const root = scrollRef.current;
    if (!root) return;
    const card = root.querySelector<HTMLElement>("[data-news-card]");
    const step = (card?.offsetWidth ?? 300) + GAP_PX;
    root.scrollBy({ left: direction * step, behavior: "smooth" });
  }, []);

  return (
    <section className="bg-primary relative isolate min-h-[665px] w-full py-20" id="news">
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
          aria-label="Previous"
          onClick={() => scrollByStep(-1)}
          className="text-accent border-accent inline-flex h-[34px] w-[57px] cursor-pointer items-center justify-center rounded-full border-2 bg-transparent hover:text-black hover:bg-accent hover:scale-110 transition-all duration-300"
        >
          <ChevronLeft className="size-5 shrink-0" aria-hidden />
        </button>
        <h2 className="m-0 text-[28px] leading-[1.2] font-bold uppercase">Latest news</h2>
        <button
          type="button"
          aria-label="Next"
          onClick={() => scrollByStep(1)}
          className="text-accent border-accent inline-flex h-[34px] w-[57px] cursor-pointer items-center justify-center rounded-full border-2 bg-transparent hover:text-black hover:bg-accent hover:scale-110 transition-all duration-300"
        >
          <ChevronRight className="size-5 shrink-0" aria-hidden />
        </button>
      </motion.div>
      <motion.div
        ref={scrollRef}
        className="flex items-start gap-7 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [padding-inline:max(clamp(20px,4vw,48px),calc(50vw-min(150px,39vw)))]"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {newsItems.map((item, idx) => (
          <motion.div
            key={`${item.slug}-${idx}`}
            variants={fadeUp}
            transition={smoothTransition}
            className="shrink-0"
          >
            <NewsCard item={item} href={getNewsDetailHref(item.slug)} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
