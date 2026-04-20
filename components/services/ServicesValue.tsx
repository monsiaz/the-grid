"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
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
      className={`grid w-[min(86vw,786px)] shrink-0 snap-center gap-4 ${card.dimmed ? "opacity-30" : ""}`}
      variants={fadeUp}
      transition={smoothTransition}
    >
      <div className="relative aspect-[786/440] w-full overflow-hidden max-[900px]:aspect-[4/3]">
        <motion.div
          className="relative h-full w-full"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Image src={card.image} alt={card.title || ""} fill sizes="(max-width: 900px) 86vw, 786px" className="object-cover" />
        </motion.div>
      </div>
      <h3 className="m-0 text-xl leading-[1.2] font-bold uppercase">{card.title || "\u00a0"}</h3>
      <motion.div
        className="bg-accent h-1 w-full origin-left"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={viewport}
        transition={{ ...smoothTransition, duration: 0.8, delay: 0.1 }}
      />
      {card.description ? <p className="m-0 text-base leading-[1.55] font-light">{card.description}</p> : null}
    </motion.article>
  );
}

export default function ServicesValue({ heading, headingAccent, description, introText, cards, caseStudies }: ServicesValueProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = useCallback((index: number) => {
    const root = scrollRef.current;
    if (!root) return;
    const children = root.querySelectorAll<HTMLElement>("[data-case-study-card]");
    const target = children[index];
    if (!target) return;
    root.scrollTo({ left: target.offsetLeft - root.offsetLeft, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const handler = () => {
      const children = Array.from(root.querySelectorAll<HTMLElement>("[data-case-study-card]"));
      const center = root.scrollLeft + root.clientWidth / 2;
      let closest = 0;
      let closestDist = Infinity;
      children.forEach((child, idx) => {
        const childCenter = child.offsetLeft + child.clientWidth / 2;
        const dist = Math.abs(childCenter - center);
        if (dist < closestDist) {
          closestDist = dist;
          closest = idx;
        }
      });
      setActiveIndex(closest);
    };
    root.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => root.removeEventListener("scroll", handler);
  }, [caseStudies.length]);

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
          gridClassName="px-[clamp(20px,4vw,48px)] min-[600px]:grid-cols-2 min-[900px]:grid-cols-3 min-[1200px]:grid-cols-[297.6px_repeat(4,minmax(0,1fr))]"
          imageHeightClassName="h-[240px] min-[900px]:h-[280px]"
          bodyPaddingClassName="p-6"
        />

        <div className="grid gap-4">
          <motion.div
            ref={scrollRef}
            className="w-full snap-x snap-mandatory overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <div className="flex w-max gap-7 px-[clamp(20px,4vw,48px)] min-[1200px]:pl-0 min-[1200px]:pr-0 min-[1200px]:ml-[-343px]">
              {caseStudies.map((card, idx) => (
                <div key={`${card.title}-${card.image}-${idx}`} data-case-study-card>
                  <CaseStudyCard card={card} />
                </div>
              ))}
            </div>
          </motion.div>
          {caseStudies.length > 1 ? (
            <div className="flex items-center justify-center gap-1 px-[clamp(20px,4vw,48px)]" role="tablist" aria-label="Case studies">
              {caseStudies.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={activeIndex === idx}
                  aria-label={`Go to case study ${idx + 1}`}
                  onClick={() => scrollToIndex(idx)}
                  className="group inline-flex h-11 w-11 items-center justify-center p-0"
                >
                  <span
                    aria-hidden
                    className={`block h-2 rounded-full transition-all duration-300 ${
                      activeIndex === idx ? "w-8 bg-accent" : "w-2 bg-white/30 group-hover:bg-white/60"
                    }`}
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
