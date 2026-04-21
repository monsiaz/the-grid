"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
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
  cards: ServiceCard[];
  gridClassName: string;
  imageHeightClassName: string;
  bodyPaddingClassName: string;
};

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
 * Card without flip:
 * - Image fills the card (cover, object-top for portraits)
 * - Title + arrow overlaid at bottom with dark gradient
 * - On hover, a description panel slides up from the bottom
 */
function ServiceCard({
  card,
  imageHeightClassName,
}: {
  card: ServiceCard;
  imageHeightClassName: string;
  bodyPaddingClassName: string;
}) {
  const hasDescription = Boolean(card.description?.trim());

  return (
    <motion.article
      className="group relative overflow-hidden rounded-[32px]"
      variants={fadeUp}
      transition={smoothTransition}
    >
      {/* Image */}
      <div className={`relative w-full ${imageHeightClassName}`}>
        <Image
          src={card.image}
          alt={card.alt}
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, (max-width: 1200px) 33vw, 240px"
          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />

        {/* Permanent dark gradient at bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Title + arrow — always visible at bottom */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 transition-all duration-400 ease-out group-hover:opacity-0">
          <span className="text-sm leading-[1.2] font-bold uppercase tracking-[0.06em] text-white whitespace-pre-line">
            {card.title}
          </span>
          <span
            className="text-accent border-accent inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 bg-black/30 transition-all duration-300 group-hover:bg-accent group-hover:text-black"
            aria-hidden
          >
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>

        {/* Hover overlay with description */}
        {hasDescription && (
          <div className="absolute inset-0 flex flex-col justify-end gap-3 bg-black/80 p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="text-sm leading-[1.2] font-bold uppercase tracking-[0.06em] text-accent whitespace-pre-line">
              {card.title}
            </span>
            <p className="m-0 text-[13px] leading-[1.55] text-white/90 font-light line-clamp-[8]">
              {card.description}
            </p>
          </div>
        )}
      </div>
    </motion.article>
  );
}

export default function ServicesCardGrid({
  id,
  heading,
  description,
  introText,
  cards,
  gridClassName,
  imageHeightClassName,
  bodyPaddingClassName,
}: ServicesCardGridProps) {
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
          <ServiceIntroCard text={introText} />
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
