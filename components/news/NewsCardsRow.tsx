"use client";

import NewsCard from "./NewsCard";
import { getNewsDetailHref, type NewsCardItem } from "./newsData";
import { motion, staggerContainer, viewport } from "../motion";

type NewsCardsRowProps = {
  cards: NewsCardItem[];
};

export default function NewsCardsRow({ cards }: NewsCardsRowProps) {
  return (
    <motion.div
      className="grid w-full grid-cols-1 gap-7 sm:grid-cols-2 min-[1280px]:grid-cols-4"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {cards.map((card) => (
        <NewsCard
          key={card.slug}
          href={getNewsDetailHref(card.slug)}
          title={card.title}
          image={card.image}
          cardClassName="h-[300px]"
        />
      ))}
    </motion.div>
  );
}
