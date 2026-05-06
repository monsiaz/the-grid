"use client";

import NewsCard from "./NewsCard";
import { motion, staggerContainer } from "../motion";

type NewsCardData = {
  slug: string;
  title: string;
  image: string;
  imageFocalPoint?: string | null;
  excerpt?: string | null;
  tag?: { label: string; accent?: boolean } | null;
};

type NewsCardsRowProps = {
  cards: NewsCardData[];
  variant?: "editorial" | "magazine";
};

export default function NewsCardsRow({
  cards,
  variant = "editorial",
}: NewsCardsRowProps) {
  const total = cards.length;
  const remainder = total % 3;

  return (
    <motion.div
      className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {cards.map((card, idx) => {
        const isLast = idx === total - 1;
        const isSecondLast = idx === total - 2;

        // Default desktop: each card spans 2 of 6 cols → 3 per row.
        let desktopSpan = "lg:col-span-2";
        // Default tablet (2-col): each card spans 1.
        let tabletSpan = "";

        if (remainder === 1 && isLast) {
          // Lone trailing card → fill the whole row on every breakpoint.
          desktopSpan = "lg:col-span-6";
          tabletSpan = "sm:col-span-2";
        } else if (remainder === 2 && (isLast || isSecondLast)) {
          // Two trailing cards → split the row 50/50 on desktop (no gap).
          desktopSpan = "lg:col-span-3";
        }

        // Tablet odd-tail handling: if total is odd, the very last card spans both cols.
        if (total % 2 === 1 && isLast) {
          tabletSpan = "sm:col-span-2";
        }

        return (
          <NewsCard
            key={card.slug}
            href={`/news/${card.slug}`}
            title={card.title}
            image={card.image}
            imageFocalPoint={card.imageFocalPoint}
            excerpt={card.excerpt}
            tag={card.tag}
            cardClassName={`h-[380px] ${tabletSpan} ${desktopSpan}`.trim()}
            titleClassName={variant === "magazine" ? "text-[clamp(20px,1.7vw,28px)]" : ""}
            showExcerpt={variant === "magazine"}
            sizes="(max-width:700px) 100vw, (max-width:1200px) 50vw, 380px"
          />
        );
      })}
    </motion.div>
  );
}
