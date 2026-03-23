"use client";

import NewsCard from "./NewsCard";
import { getNewsDetailHref, type NewsCardItem } from "./newsData";
import { motion, staggerContainer, viewport } from "../motion";

type NewsFeaturedGridProps = {
  cards: NewsCardItem[];
};

export default function NewsFeaturedGrid({ cards }: NewsFeaturedGridProps) {
  if (cards.length < 6) {
    return null;
  }

  const [first, second, third, fourth, fifth, sixth] = cards;

  return (
    <>
      <motion.div
        className="hidden w-full gap-7 min-[1280px]:grid min-[1280px]:grid-cols-[315px_315px_minmax(0,1fr)]"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <NewsCard
          href={getNewsDetailHref(first.slug)}
          title={first.title}
          image={first.image}
          cardClassName="h-[628px]"
          imageWrapClassName="relative min-h-0 flex-1"
        />

        <motion.div
          className="grid gap-7"
          variants={staggerContainer}
        >
          <NewsCard href={getNewsDetailHref(second.slug)} title={second.title} image={second.image} cardClassName="h-[300px]" />
          <NewsCard href={getNewsDetailHref(third.slug)} title={third.title} image={third.image} cardClassName="h-[300px]" />
        </motion.div>

        <motion.div
          className="grid gap-7"
          variants={staggerContainer}
        >
          <NewsCard href={getNewsDetailHref(fourth.slug)} title={fourth.title} image={fourth.image} cardClassName="h-[300px]" />
          <div className="grid grid-cols-2 gap-7">
            <NewsCard href={getNewsDetailHref(fifth.slug)} title={fifth.title} image={fifth.image} cardClassName="h-[300px]" />
            <NewsCard href={getNewsDetailHref(sixth.slug)} title={sixth.title} image={sixth.image} cardClassName="h-[300px]" />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="grid w-full grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 min-[1280px]:hidden"
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
    </>
  );
}
