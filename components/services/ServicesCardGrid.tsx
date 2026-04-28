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
  servicesArrowStyle?: "default" | "slim";
  gridClassName: string;
  imageHeightClassName: string;
  bodyPaddingClassName: string;
};

/** Text-only intro card (fallback when no intro image is provided). */
function ServiceIntroCard({ text }: { text: string }) {
  return (
    <motion.article
      className="surface-card-soft flex h-full min-h-[280px] items-end p-6"
      variants={fadeUp}
      transition={smoothTransition}
    >
      <p className="body-md m-0 text-secondary/80">{text}</p>
    </motion.article>
  );
}

/**
 * Card with two stacked blocks:
 *   1. Image (rounded on all sides) — on top
 *   2. Title + arrow pill (rounded dark surface) — below, separated by a visible gap
 * Clicking the arrow flips the whole card to reveal the full description on the back.
 */
function ServiceCard({
  card,
  imageHeightClassName,
  servicesArrowStyle,
}: {
  card: ServiceCard;
  imageHeightClassName: string;
  servicesArrowStyle: "default" | "slim";
  bodyPaddingClassName: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const hasDescription = Boolean(card.description?.trim());
  const needsMicroZoom = /branding/i.test(card.title) || /branding/i.test(card.image);
  const objectPosition = /private/i.test(card.title) || /private/i.test(card.image) ? "object-center" : "object-top";
  const isSlimArrow = servicesArrowStyle === "slim";
  const arrowWrapperClassName = isSlimArrow
    ? "ml-1.5 flex h-6 w-10 shrink-0 items-center justify-center rounded-full border border-accent/70 bg-transparent text-accent transition-colors duration-200 hover:bg-accent hover:text-primary"
    : "ml-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent/70 bg-transparent text-accent transition-colors duration-200 hover:bg-accent hover:text-primary";
  const arrowIconClassName = isSlimArrow ? "h-2.5 w-5" : "h-3 w-3";
  const arrowStrokeWidth = isSlimArrow ? 1.6 : 1.75;

  return (
    <motion.div
      className="relative flex h-full flex-col [perspective:1200px]"
      variants={fadeUp}
      transition={smoothTransition}
    >
      <div
        className={`relative flex h-full flex-col transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* ── FRONT ──
            NO overflow-hidden on the outer card → footer/button never clipped.
            overflow-hidden goes only on the image div to round the top corners. */}
        <div className="relative flex h-full flex-col border border-white/12 bg-[#111] [backface-visibility:hidden]" style={{ borderRadius: "var(--ds-card-radius, 22px)" }}>
          {/* Image: overflow-hidden + rounded top so image corners are clipped correctly */}
          <div className={`relative w-full shrink-0 overflow-hidden ${imageHeightClassName}`} style={{ borderRadius: "var(--ds-card-radius, 22px) var(--ds-card-radius, 22px) 0 0" }}>
            <Image
              src={card.image}
              alt={card.alt}
              fill
              quality={100}
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, (max-width: 1400px) 20vw, 280px"
              className={`object-cover ${objectPosition} transition-transform duration-500 ease-out ${
                needsMicroZoom ? "scale-[1.035] hover:scale-[1.06]" : "hover:scale-[1.03]"
              }`}
            />
          </div>
          {/* Footer: always fully visible, never clipped */}
          <div className="flex shrink-0 min-h-[56px] items-center gap-2 border-t border-white/8 bg-[#111] px-4 py-3">
            <span className="display-card min-w-0 flex-1 overflow-hidden break-words text-white leading-[1.12] text-[clamp(7.8px,0.72vw,10px)] uppercase tracking-[0.04em] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
              {card.title}
            </span>
            {hasDescription ? (
              <button
                type="button"
                onClick={() => setFlipped(true)}
                aria-label={`Learn more about ${card.title}`}
                className={arrowWrapperClassName}
              >
                <ArrowRight className={arrowIconClassName} strokeWidth={arrowStrokeWidth} />
              </button>
            ) : (
              <span
                className={arrowWrapperClassName.replace("hover:bg-accent hover:text-primary", "")}
                aria-hidden
              >
                <ArrowRight className={arrowIconClassName} strokeWidth={arrowStrokeWidth} />
              </span>
            )}
          </div>
        </div>

        {/* ── BACK ── (covers the whole card when flipped) */}
        <div className="absolute inset-0 flex flex-col justify-between overflow-hidden border border-white/10 bg-[#111] p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]" style={{ borderRadius: "var(--ds-card-radius, 22px)" }}>
          <div className="scroll-soft flex flex-col gap-3 overflow-y-auto pr-2">
            <p className="display-card m-0 whitespace-pre-line text-accent">
              {card.title}
            </p>
            <p className="body-sm m-0 text-secondary/85">
              {card.description}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFlipped(false)}
            aria-label="Close"
            className="mt-4 flex h-7 w-7 shrink-0 items-center justify-center self-end rounded-full border border-white/25 bg-transparent text-secondary/70 transition-colors duration-200 hover:border-white/60 hover:text-white"
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.75} />
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
  servicesArrowStyle = "default",
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
    <section className="bg-primary" style={{ paddingTop: "var(--ds-section-py, 80px)", paddingBottom: "var(--ds-section-py, 80px)" }} id={id}>
      <div className="mx-auto grid w-full max-w-[1660px] gap-16 px-[clamp(10px,2.2vw,32px)]">
        <div className="mx-auto grid w-full max-w-[888px] gap-6 text-center uppercase">
          <motion.h2
            className="display-section m-0"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={{ ...smoothTransition, duration: 0.9 }}
          >
            {heading}
          </motion.h2>
          <motion.p
            className="body-lg m-0 mx-auto max-w-[888px] normal-case text-secondary/80"
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
              servicesArrowStyle={servicesArrowStyle}
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
              servicesArrowStyle={servicesArrowStyle}
              bodyPaddingClassName={bodyPaddingClassName}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
