"use client";

import {
  motion,
  fadeUp,
  slideInLeft,
  staggerContainer,
  smoothTransition,
  viewport,
} from "../motion";

export default function NewsHeading() {
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
        <span className="text-muted">Latest </span>
        <span className="text-secondary">News</span>
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
          className="h-[40px] rounded-full border-2 border-accent px-7 text-[12px] leading-[1.2] font-medium tracking-[0.01em] text-accent uppercase transition-all duration-300 hover:bg-accent hover:text-black"
          variants={fadeUp}
          transition={smoothTransition}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Sporting News
        </motion.button>
        <motion.button
          type="button"
          className="h-[40px] rounded-full border-2 border-accent px-7 text-[12px] leading-[1.2] font-medium tracking-[0.01em] text-accent uppercase transition-all duration-300 hover:bg-accent hover:text-black"
          variants={fadeUp}
          transition={smoothTransition}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Commercial News
        </motion.button>
      </motion.div>
    </div>
  );
}
