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

function ServiceImageCard({ card, imageHeightClassName, bodyPaddingClassName }: { card: ServiceCard; imageHeightClassName: string; bodyPaddingClassName: string }) {
  return (
    <motion.article
      className="border-secondary overflow-hidden rounded-[32px] border"
      variants={fadeUp}
      transition={smoothTransition}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
    >
      <div className={`relative w-full overflow-hidden ${imageHeightClassName}`}>
        <motion.div
          className="relative h-full w-full"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Image src={card.image} alt={card.alt} fill sizes="(max-width: 1024px) 100vw, 20vw" className="object-cover" />
        </motion.div>
      </div>
      <div className={`bg-primary ${bodyPaddingClassName}`}>
        <div className="flex items-center justify-between gap-4">
          <h3 className="m-0 text-base leading-[1.2] font-bold uppercase whitespace-pre-line">{card.title}</h3>
          <span className="text-accent border-accent inline-flex rounded-full border-2 px-3 py-1 text-base leading-[1.2] transition-all duration-300 hover:bg-accent hover:text-black" aria-hidden>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </span>
        </div>
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
          className={`grid gap-7 ${gridClassName}`}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <ServiceIntroCard text={introText} />
          {cards.map((card) => (
            <ServiceImageCard
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
