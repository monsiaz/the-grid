"use client";

import Image from "next/image";
import { ArrowRight, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
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
      className="border-secondary h-full rounded-[32px] border p-6"
      variants={fadeUp}
      transition={smoothTransition}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
    >
      <p className="m-0 text-sm leading-[1.4] font-light">{text}</p>
    </motion.article>
  );
}

function ServiceFlipCard({
  card,
  imageHeightClassName,
  bodyPaddingClassName,
}: {
  card: ServiceCard;
  imageHeightClassName: string;
  bodyPaddingClassName: string;
}) {
  const t = useTranslations("services.grid");
  const [flipped, setFlipped] = useState(false);
  const hasDescription = Boolean(card.description && card.description.trim());

  return (
    <motion.div
      className="h-full [perspective:1200px]"
      variants={fadeUp}
      transition={smoothTransition}
    >
      <button
        type="button"
        onClick={() => setFlipped((v) => !v)}
        aria-pressed={flipped}
        aria-label={
          flipped
            ? t("hideDetails", { name: card.alt })
            : t("showDetails", { name: card.alt })
        }
        className="group relative block h-full w-full cursor-pointer rounded-[32px] text-left [transform-style:preserve-3d] transition-transform duration-700 ease-[cubic-bezier(0.4,0.2,0.2,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <span
          className="absolute inset-0 border-secondary overflow-hidden rounded-[32px] border bg-primary [backface-visibility:hidden] transition-transform duration-300 group-hover:-translate-y-1.5"
        >
          <span className={`relative block w-full overflow-hidden ${imageHeightClassName}`}>
            <Image
              src={card.image}
              alt={card.alt}
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, (max-width: 1200px) 33vw, 240px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            />
          </span>
          <span className={`block bg-primary ${bodyPaddingClassName}`}>
            <span className="flex items-center justify-between gap-4">
              <span className="m-0 text-base leading-[1.2] font-bold uppercase whitespace-pre-line">{card.title}</span>
              <span className="text-accent border-accent inline-flex rounded-full border-2 px-3 py-1 text-base leading-[1.2] transition-all duration-300 group-hover:bg-accent group-hover:text-black" aria-hidden>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </span>
            </span>
          </span>
        </span>

        <span
          className="absolute inset-0 flex flex-col justify-between border-secondary rounded-[32px] border bg-primary p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          <span className="flex items-start justify-between gap-3">
            <span className="m-0 text-base leading-[1.2] font-bold uppercase whitespace-pre-line text-accent">{card.title}</span>
            <span className="text-accent border-accent inline-flex rounded-full border-2 px-2 py-2 text-base leading-[1.2]" aria-hidden>
              <RotateCcw className="h-4 w-4 shrink-0" />
            </span>
          </span>
          <span className="m-0 block text-[14px] leading-[1.5] font-light text-secondary/90">
            {hasDescription ? card.description : t("descriptionFallback")}
          </span>
          <span className="mt-4 block text-[11px] uppercase tracking-[0.12em] text-muted">{t("flipBack")}</span>
        </span>
      </button>
    </motion.div>
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
      <div className="mx-auto grid w-full max-w-[1344px] gap-20 px-[clamp(20px,4vw,48px)]">
        <div className="mx-auto grid w-full max-w-[1344px] gap-8 text-center uppercase">
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
            className="m-0 mx-auto max-w-[888px] text-[clamp(16px,1.8vw,20px)] leading-[1.4] font-light"
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
          className={`grid items-stretch gap-7 ${gridClassName}`}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <ServiceIntroCard text={introText} />
          {cards.map((card) => (
            <ServiceFlipCard
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
