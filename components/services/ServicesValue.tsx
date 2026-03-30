"use client";

import Image from "next/image";
import ServicesCardGrid from "./ServicesCardGrid";
import {
  motion,
  fadeUp,
  staggerContainer,
  smoothTransition,
  viewport,
} from "../motion";

type CaseStudy = {
  title?: string | null;
  image: string;
  description?: string | null;
  dimmed?: boolean | null;
};

type ServicesValueProps = {
  heading?: string | null;
  headingAccent?: string | null;
  description?: string | null;
  introText?: string | null;
  cards: { title: string; image: string; alt: string }[];
  caseStudies: CaseStudy[];
};

function CaseStudyCard({ card }: { card: CaseStudy }) {
  return (
    <motion.article
      className={`grid w-[786px] shrink-0 gap-4 ${card.dimmed ? "opacity-30" : ""}`}
      variants={fadeUp}
      transition={smoothTransition}
    >
      <div className="relative h-[440px] w-full overflow-hidden">
        <motion.div
          className="relative h-full w-full"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Image src={card.image} alt={card.title || ""} fill sizes="(max-width: 1200px) 100vw, 786px" className="object-cover" />
        </motion.div>
      </div>
      <h3 className="m-0 text-xl leading-[1.2] font-bold uppercase">{card.title || " "}</h3>
      <motion.div
        className="bg-accent h-1 w-full origin-left"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={viewport}
        transition={{ ...smoothTransition, duration: 0.8, delay: 0.1 }}
      />
      {card.description ? <p className="m-0 text-base leading-[1.4] font-light">{card.description}</p> : null}
    </motion.article>
  );
}

export default function ServicesValue({ heading, headingAccent, description, introText, cards, caseStudies }: ServicesValueProps) {
  return (
    <section className="bg-primary py-20" id="services-value">
      <div className="mx-auto grid w-full max-w-[1728px] gap-20">
        <ServicesCardGrid
          heading={
            <>
              {heading || "WHERE PERFORMANCE"}
              <br />
              CREATES <span className="text-muted">{headingAccent || "VALUE"}</span>
            </>
          }
          description={description || ""}
          introText={introText || ""}
          cards={cards}
          gridClassName="px-[clamp(20px,4vw,48px)] min-[1200px]:grid-cols-[297.6px_repeat(4,minmax(0,1fr))]"
          imageHeightClassName="h-[280px]"
          bodyPaddingClassName="p-6"
        />

        <motion.div
          className="w-full overflow-x-auto pb-2"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <div className="flex w-max gap-7 px-[clamp(20px,4vw,48px)] min-[1200px]:pl-0 min-[1200px]:pr-0 min-[1200px]:ml-[-343px]">
            {caseStudies.map((card, idx) => (
              <CaseStudyCard card={card} key={`${card.title}-${card.image}-${idx}`} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
