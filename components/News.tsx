"use client";

import NewsCard from "./NewsCard";
import { newsItems } from "./newsItems";
import {
  motion,
  fadeUp,
  staggerContainer,
  smoothTransition,
  viewport,
} from "./motion";

export default function News() {
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
          className="text-accent border-accent h-[34px] w-[57px] cursor-pointer rounded-full border-2 bg-transparent text-[18px] leading-none hover:text-black hover:bg-accent hover:scale-110 transition-all duration-300"
        >
          &larr;
        </button>
        <h2 className="m-0 text-[28px] leading-[1.2] font-bold uppercase">Latest news</h2>
        <button
          type="button"
          aria-label="Next"
          className="text-accent border-accent h-[34px] w-[57px] cursor-pointer rounded-full border-2 bg-transparent text-[18px] leading-none hover:text-black hover:bg-accent hover:scale-110 transition-all duration-300"
        >
          &rarr;
        </button>
      </motion.div>
      <motion.div
        className="flex items-start gap-7 overflow-x-auto pr-7 pl-[max(clamp(20px,4vw,48px),calc((100vw-1344px)/2))] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden max-[900px]:pl-[clamp(20px,4vw,48px)]"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {newsItems.map((item, idx) => (
          <motion.div
            key={`${item.title}-${idx}`}
            variants={fadeUp}
            transition={smoothTransition}
          >
            <NewsCard item={item} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
