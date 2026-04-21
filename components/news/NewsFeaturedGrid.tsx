"use client";

import NewsCard from "./NewsCard";
import { motion, staggerContainer, viewport } from "../motion";

type NewsCardData = {
  slug: string;
  title: string;
  image: string;
  excerpt?: string | null;
  tag?: { label: string; accent?: boolean } | null;
};

type NewsFeaturedGridProps = {
  cards: NewsCardData[];
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
          href={`/news/${first.slug}`}
          title={first.title}
          image={first.image}
          excerpt={first.excerpt}
          tag={first.tag}
          cardClassName="h-[628px]"
          imageWrapClassName="relative min-h-0 flex-1"
        />

        <motion.div
          className="grid gap-7"
          variants={staggerContainer}
        >
          <NewsCard href={`/news/${second.slug}`} title={second.title} image={second.image} excerpt={second.excerpt} tag={second.tag} cardClassName="min-h-[300px]" />
          <NewsCard href={`/news/${third.slug}`} title={third.title} image={third.image} excerpt={third.excerpt} tag={third.tag} cardClassName="min-h-[300px]" />
        </motion.div>

        <motion.div
          className="grid gap-7"
          variants={staggerContainer}
        >
          <NewsCard href={`/news/${fourth.slug}`} title={fourth.title} image={fourth.image} excerpt={fourth.excerpt} tag={fourth.tag} cardClassName="min-h-[300px]" />
          <div className="grid grid-cols-2 gap-7">
            <NewsCard href={`/news/${fifth.slug}`} title={fifth.title} image={fifth.image} excerpt={fifth.excerpt} tag={fifth.tag} cardClassName="min-h-[300px]" />
            <NewsCard href={`/news/${sixth.slug}`} title={sixth.title} image={sixth.image} excerpt={sixth.excerpt} tag={sixth.tag} cardClassName="min-h-[300px]" />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="grid w-full grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 min-[1280px]:hidden"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {cards.map((card) => (
          <NewsCard
            key={card.slug}
            href={`/news/${card.slug}`}
            title={card.title}
            image={card.image}
            excerpt={card.excerpt}
            tag={card.tag}
            cardClassName="min-h-[300px]"
          />
        ))}
      </motion.div>
    </>
  );
}
