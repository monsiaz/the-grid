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
  variant?: "editorial" | "magazine";
};

/**
 * Bento-style hero grid for /news.
 *
 * Desktop (≥1280px) — 6 × 2 grid, 8 slots:
 *   Row 1:  [tall-left] [small] [---- wide (3 cols) ----] [tall-right]
 *   Row 2:  [tall-left] [small] [small] [small] [small] [tall-right]
 *
 * The two outer columns are tall cards spanning both rows. The middle has
 * a wide "featured" card on top and 4 small cards underneath.
 *
 * Below 1280px the layout falls back to a responsive 1 / 2 / 3-column grid.
 */
export default function NewsFeaturedGrid({
  cards,
  variant = "editorial",
}: NewsFeaturedGridProps) {
  if (cards.length === 0) return null;

  // Desktop bento needs 8 cards to fill every slot; if fewer, we gracefully
  // fall back to the responsive grid so no "holes" appear.
  const canBento = cards.length >= 8;

  if (!canBento) {
    // Grid is col-1 / sm:col-2 / lg:col-3.
    // Card[0] spans 2 on sm/lg. The remaining N-1 cards fill a 3-col grid.
    // After card[0] spans 2 cols, card[1] fills col 3 (same row).
    // Remaining cards from index 2 onward fill rows of 3.
    // A "lonely last" occurs when (cards.length - 2) % 3 === 1 (i.e. cards.length ∈ {3,6,...} → no, cards.length ∈ {4,7,...}).
    // In that case the last card is alone in a row → span all 3.
    // Also handle sm (2-col): after card[0] spans 2, remaining N-1 fill rows of 2.
    // Lonely last on sm: (N-1) % 2 === 1 → N is even. But last card that's lonely on lg might be fine on sm.
    // Simplest: make the last card span full width whenever it would be alone.
    // Layout in lg (3-col): card[0] spans cols 1-2, card[1] fills col 3 (row 1).
    // Cards from idx 2 onward fill rows of 3. A lonely last card appears when
    // exactly 1 card remains on the final row, i.e. (cards.length - 2) % 3 === 1.
    const afterRow1 = cards.length - 2; // cards from index 2 onward
    const lgRemainder = afterRow1 > 0 ? afterRow1 % 3 : 0;
    const isLonelyOnLg = lgRemainder === 1; // 1 card in a row of 3 → last is lonely

    // On sm (2-col): card[0] spans the full row. Remaining N-1 fill rows of 2.
    const isLonelyOnSm = (cards.length - 1) % 2 === 1;

    return (
      <motion.div
        className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {cards.map((card, idx) => {
          const isFirst = idx === 0;
          const isTopRowSideCard = idx === 1;
          const isLast = idx === cards.length - 1;
          const lgSpan = isFirst ? "lg:col-span-2" : (isLonelyOnLg && isLast ? "lg:col-span-3" : "");
          const smSpan = isFirst ? "sm:col-span-2" : (isLonelyOnSm && isLast ? "sm:col-span-2" : "");
          return (
            <NewsCard
              key={card.slug}
              href={`/news/${card.slug}`}
              title={card.title}
              image={card.image}
              excerpt={card.excerpt}
              tag={card.tag}
              cardClassName={`${isFirst || isTopRowSideCard ? "h-[420px]" : "h-[360px]"} ${smSpan} ${lgSpan}`}
              titleClassName={isFirst ? "text-[clamp(24px,3vw,34px)]" : ""}
              showExcerpt={isFirst}
              priority={isFirst}
              imageClassName={isFirst ? "object-[center_24%]" : ""}
            />
          );
        })}
      </motion.div>
    );
  }

  if (variant === "magazine") {
    const [hero, secondary, tertiary, quaternary] = cards;
    return (
      <>
        <motion.div
          className="hidden w-full gap-5 min-[1280px]:grid min-[1280px]:grid-cols-12 min-[1280px]:grid-rows-[240px_240px_240px]"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <NewsCard
            href={`/news/${hero.slug}`}
            title={hero.title}
            image={hero.image}
            excerpt={hero.excerpt}
            tag={hero.tag}
            cardClassName="min-[1280px]:col-span-7 min-[1280px]:row-span-3"
            titleClassName="text-[clamp(28px,2.8vw,42px)]"
            showExcerpt
            priority
            sizes="(max-width: 1280px) 100vw, 760px"
            imageClassName="object-[center_26%]"
          />
          <NewsCard
            href={`/news/${secondary.slug}`}
            title={secondary.title}
            image={secondary.image}
            excerpt={secondary.excerpt}
            tag={secondary.tag}
            cardClassName="min-[1280px]:col-span-5 min-[1280px]:row-span-2"
            titleClassName="text-[clamp(20px,1.7vw,28px)]"
            showExcerpt
            sizes="(max-width: 1280px) 100vw, 500px"
            imageClassName="object-[center_22%]"
          />
          <NewsCard
            href={`/news/${tertiary.slug}`}
            title={tertiary.title}
            image={tertiary.image}
            tag={tertiary.tag}
            cardClassName="min-[1280px]:col-span-2"
            sizes="(max-width: 1280px) 100vw, 240px"
            imageClassName="object-[center_18%]"
          />
          <NewsCard
            href={`/news/${quaternary.slug}`}
            title={quaternary.title}
            image={quaternary.image}
            tag={quaternary.tag}
            cardClassName="min-[1280px]:col-span-3"
            sizes="(max-width: 1280px) 100vw, 320px"
            imageClassName="object-[center_22%]"
          />
        </motion.div>

        <motion.div
          className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 min-[1280px]:hidden"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {cards.map((card, idx) => (
            <NewsCard
              key={card.slug}
              href={`/news/${card.slug}`}
              title={card.title}
              image={card.image}
              excerpt={card.excerpt}
              tag={card.tag}
              cardClassName={idx === 0 ? "h-[420px] sm:col-span-2" : "h-[360px]"}
              titleClassName={idx === 0 ? "text-[clamp(24px,3vw,34px)]" : ""}
              showExcerpt={idx < 2}
              priority={idx === 0}
              imageClassName={idx === 0 ? "object-[center_24%]" : ""}
            />
          ))}
        </motion.div>

      </>
    );
  }

  const [hero, secondaryTop, secondaryBottom, third, fourth, fifth] = cards;

  return (
    <>
      <motion.div
        className="hidden w-full gap-5 min-[1280px]:grid min-[1280px]:grid-cols-12 min-[1280px]:grid-rows-[240px_240px_180px]"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <NewsCard
          href={`/news/${hero.slug}`}
          title={hero.title}
          image={hero.image}
          excerpt={hero.excerpt}
          tag={hero.tag}
          cardClassName="min-[1280px]:col-span-8 min-[1280px]:row-span-2"
          titleClassName="text-[clamp(28px,2.8vw,42px)]"
          showExcerpt
          priority
          sizes="(max-width: 1280px) 100vw, 760px"
          imageClassName="object-[center_24%]"
        />

        <NewsCard
          href={`/news/${secondaryTop.slug}`}
          title={secondaryTop.title}
          image={secondaryTop.image}
          excerpt={secondaryTop.excerpt}
          tag={secondaryTop.tag}
          cardClassName="min-[1280px]:col-span-4"
          titleClassName="text-[clamp(18px,1.65vw,26px)]"
          showExcerpt
          sizes="(max-width: 1280px) 100vw, 420px"
          imageClassName="object-[center_20%]"
        />

        <NewsCard
          href={`/news/${secondaryBottom.slug}`}
          title={secondaryBottom.title}
          image={secondaryBottom.image}
          excerpt={secondaryBottom.excerpt}
          tag={secondaryBottom.tag}
          cardClassName="min-[1280px]:col-span-4"
          titleClassName="text-[clamp(18px,1.65vw,26px)]"
          showExcerpt
          sizes="(max-width: 1280px) 100vw, 420px"
          imageClassName="object-[center_24%]"
        />

        <NewsCard
          href={`/news/${third.slug}`}
          title={third.title}
          image={third.image}
          tag={third.tag}
          cardClassName="min-[1280px]:col-span-4"
          sizes="(max-width: 1280px) 100vw, 360px"
          imageClassName="object-[center_18%]"
        />

        <NewsCard
          href={`/news/${fourth.slug}`}
          title={fourth.title}
          image={fourth.image}
          tag={fourth.tag}
          cardClassName="min-[1280px]:col-span-4"
          sizes="(max-width: 1280px) 100vw, 360px"
          imageClassName="object-[center_22%]"
        />

        <NewsCard
          href={`/news/${fifth.slug}`}
          title={fifth.title}
          image={fifth.image}
          tag={fifth.tag}
          cardClassName="min-[1280px]:col-span-4"
          sizes="(max-width: 1280px) 100vw, 360px"
          imageClassName="object-[center_18%]"
        />
      </motion.div>

      <motion.div
        className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 min-[1280px]:hidden"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {cards.map((card, idx) => (
          <NewsCard
            key={card.slug}
            href={`/news/${card.slug}`}
            title={card.title}
            image={card.image}
            excerpt={card.excerpt}
            tag={card.tag}
            cardClassName={idx === 0 ? "h-[420px] sm:col-span-2" : "h-[360px]"}
            titleClassName={idx === 0 ? "text-[clamp(24px,3vw,34px)]" : ""}
            showExcerpt={idx < 3}
            priority={idx === 0}
            imageClassName={idx === 0 ? "object-[center_24%]" : ""}
          />
        ))}
      </motion.div>
    </>
  );
}
