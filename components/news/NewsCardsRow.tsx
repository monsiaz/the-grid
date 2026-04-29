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
  const desktopGridClass =
    cards.length === 1
      ? "grid-cols-1 min-[1280px]:grid-cols-1"
      : variant === "magazine"
        ? "min-[1280px]:grid-cols-2"
        : "min-[1280px]:grid-cols-3";

  return (
    <motion.div
      className={`grid w-full grid-cols-1 gap-5 sm:grid-cols-2 ${desktopGridClass}`}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {cards.map((card, index) => (
        <NewsCard
          key={card.slug}
          href={`/news/${card.slug}`}
          title={card.title}
          image={card.image}
          imageFocalPoint={card.imageFocalPoint}
          excerpt={card.excerpt}
          tag={card.tag}
          cardClassName={
            variant === "magazine"
              ? `h-[380px] ${cards.length === 1 ? "min-[1280px]:col-span-2 min-[1280px]:h-[420px] sm:col-span-2" : ""}`
              : `h-[360px] ${index === 0 && cards.length === 2 ? "min-[1280px]:col-span-2" : ""}`
          }
          titleClassName={variant === "magazine" ? "text-[clamp(20px,1.7vw,28px)]" : ""}
          showExcerpt={variant === "magazine"}
        />
      ))}
    </motion.div>
  );
}
