"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, X } from "lucide-react";
import {
  motion,
  fadeUp,
  scaleIn,
  staggerContainer,
  smoothTransition,
  viewport,
} from "../motion";

type ServiceCard = {
  title: string;
  image: string;
  alt: string;
  description?: string | null;
};

type ServicesCardGridProps = {
  id?: string;
  heading: React.ReactNode;
  description: string;
  introText: string;
  /** Optional: when provided, the intro card becomes a flip card with image + title */
  introImage?: string | null;
  introTitle?: string | null;
  cards: ServiceCard[];
  gridClassName: string;
  imageHeightClassName: string;
  bodyPaddingClassName: string;
};

/** Text-only intro card (fallback when no intro image is provided). */
function ServiceIntroCard({ text }: { text: string }) {
  return (
    <motion.article
      className="border-secondary flex h-full min-h-[280px] items-end rounded-[32px] border p-6"
      variants={fadeUp}
      transition={smoothTransition}
    >
      <p className="m-0 text-sm leading-[1.55] font-light text-secondary/80">{text}</p>
    </motion.article>
  );
}

/**
 * Flip card:
 * - FRONT: image + title + arrow button (click to flip)
 * - BACK: title (accent) + full description + X close button
 */
function ServiceCard({
  card,
  imageHeightClassName,
}: {
  card: ServiceCard;
  imageHeightClassName: string;
  bodyPaddingClassName: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const hasDescription = Boolean(card.description?.trim());

  return (
    <motion.div
      className={`relative ${imageHeightClassName} [perspective:1000px]`}
      variants={fadeUp}
      transition={smoothTransition}
    >
      <div
        className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* ── FRONT ── */}
        <article className="absolute inset-0 overflow-hidden rounded-[32px] [backface-visibility:hidden]">
          {/* Image — slightly zoomed to clip any white borders */}
          <div className="absolute inset-0 scale-[1.05] overflow-hidden rounded-[32px]">
            <Image
              src={card.image}
              alt={card.alt}
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, (max-width: 1200px) 33vw, 240px"
              className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
          </div>

          {/* Permanent dark gradient at bottom */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Title + arrow — always visible */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
            <span className="text-sm leading-[1.2] font-bold uppercase tracking-[0.06em] text-white whitespace-pre-line">
              {card.title}
            </span>
            {hasDescription ? (
              <button
                type="button"
                onClick={() => setFlipped(true)}
                aria-label={`Learn more about ${card.title}`}
                className="text-accent border-accent inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 bg-black/40 transition-all duration-300 hover:bg-accent hover:text-black"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <span
                className="text-accent border-accent inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 bg-black/40"
                aria-hidden
              >
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </div>
        </article>

        {/* ── BACK ── */}
        <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[32px] border border-accent/20 bg-[#0e0e0e] p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="scroll-soft flex flex-col gap-3 overflow-y-auto pr-2">
            <p className="m-0 text-sm font-bold uppercase tracking-[0.08em] text-accent whitespace-pre-line leading-[1.2]">
              {card.title}
            </p>
            <p className="m-0 text-[13px] leading-[1.6] text-secondary/85 font-light">
              {card.description}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFlipped(false)}
            aria-label="Close"
            className="mt-4 self-end inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-secondary/20 text-secondary/50 transition-all duration-300 hover:border-accent hover:text-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ServicesCardGrid({
  id,
  heading,
  description,
  introText,
  introImage,
  introTitle,
  cards,
  gridClassName,
  imageHeightClassName,
  bodyPaddingClassName,
}: ServicesCardGridProps) {
  // When an intro image is provided, the intro becomes a proper flip card
  // (same style as the other ServiceCards) with `introTitle` on the front
  // and `introText` as the back-face description.
  const introAsFlipCard: ServiceCard | null =
    introImage && introImage.trim()
      ? {
          title: (introTitle || "").trim() || "PERFORMANCE",
          image: introImage,
          alt: (introTitle || "Performance").trim(),
          description: introText,
        }
      : null;
  return (
    <section className="bg-primary py-20" id={id}>
      <div className="mx-auto grid w-full max-w-[1344px] gap-16 px-[clamp(20px,4vw,48px)]">
        <div className="mx-auto grid w-full max-w-[888px] gap-6 text-center uppercase">
          <motion.h2
            className="m-0 font-[var(--font-league-spartan)] text-[64px] leading-none font-bold max-[1200px]:text-[clamp(44px,6vw,64px)]"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={{ ...smoothTransition, duration: 0.9 }}
          >
            {heading}
          </motion.h2>
          <motion.p
            className="m-0 mx-auto max-w-[888px] text-[clamp(15px,1.5vw,18px)] leading-[1.5] font-light normal-case text-secondary/80"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={{ ...smoothTransition, delay: 0.15 }}
          >
            {description}
          </motion.p>
        </div>

        <motion.div
          className={`grid items-stretch gap-5 ${gridClassName}`}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {introAsFlipCard ? (
            <ServiceCard
              card={introAsFlipCard}
              imageHeightClassName={imageHeightClassName}
              bodyPaddingClassName={bodyPaddingClassName}
            />
          ) : (
            <ServiceIntroCard text={introText} />
          )}
          {cards.map((card) => (
            <ServiceCard
              key={card.title}
              card={card}
              imageHeightClassName={imageHeightClassName}
              bodyPaddingClassName={bodyPaddingClassName}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
