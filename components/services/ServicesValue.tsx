"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
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
  cards: { title: string; image: string; alt: string; description?: string | null }[];
  caseStudies: CaseStudy[];
};

function CaseStudyCard({ card, active }: { card: CaseStudy; active: boolean }) {
  const opacity = card.dimmed
    ? "opacity-20 scale-[0.96]"
    : active
      ? "opacity-100 scale-100"
      : "opacity-30 scale-[0.96]";

  return (
    <motion.article
      className={`grid w-[min(80vw,720px)] shrink-0 snap-center gap-4 transition-all duration-400 ease-out ${opacity}`}
      variants={fadeUp}
      transition={smoothTransition}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
        <Image
          src={card.image}
          alt={card.title || ""}
          fill
          sizes="(max-width: 900px) 80vw, 720px"
          className="object-cover object-center"
        />
      </div>
      <h3 className="m-0 text-xl leading-[1.2] font-bold uppercase">{card.title || "\u00a0"}</h3>
      <motion.div
        className="bg-accent h-[3px] w-full origin-left"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: active ? 1 : 0 }}
        viewport={viewport}
        transition={{ ...smoothTransition, duration: 0.6 }}
      />
      {card.description ? (
        <p className="m-0 text-[15px] leading-[1.6] font-light text-secondary/80">
          {card.description}
        </p>
      ) : null}
    </motion.article>
  );
}

export default function ServicesValue({ heading, headingAccent, description, introText, cards, caseStudies }: ServicesValueProps) {
  const t = useTranslations("services");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const autoplayPausedRef = useRef(false);

  /**
   * Center the target card in the viewport (not left-align as before).
   * Horizontally: root.scrollLeft = target center - viewport center
   */
  const scrollToIndex = useCallback((index: number, smooth = true) => {
    const root = scrollRef.current;
    if (!root) return;
    const children = root.querySelectorAll<HTMLElement>("[data-case-study-card]");
    const clamped = Math.max(0, Math.min(index, children.length - 1));
    const target = children[clamped];
    if (!target) return;
    const targetCenter = target.offsetLeft + target.clientWidth / 2;
    const rootCenter = root.clientWidth / 2;
    root.scrollTo({
      left: targetCenter - rootCenter,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  const scrollByStep = useCallback(
    (direction: -1 | 1) => {
      autoplayPausedRef.current = true;
      setIsUserInteracting(true);
      // Cycle around: -1 at index 0 goes to the last card, +1 at last goes to 0
      const total = caseStudies.length;
      const next = ((activeIndex + direction) % total + total) % total;
      scrollToIndex(next);
      // Resume autoplay after 8s of inactivity
      setTimeout(() => {
        autoplayPausedRef.current = false;
        setIsUserInteracting(false);
      }, 8000);
    },
    [activeIndex, scrollToIndex, caseStudies.length],
  );

  // Track active card based on scroll position
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

  // Center the first card on mount (fixes off-center initial render)
  useEffect(() => {
    const t = window.setTimeout(() => scrollToIndex(0, false), 60);
    return () => window.clearTimeout(t);
  }, [scrollToIndex, caseStudies.length]);

  // Auto-rotate every 5s — pauses when user interacts or hovers
  useEffect(() => {
    if (caseStudies.length <= 1) return;
    const id = window.setInterval(() => {
      if (autoplayPausedRef.current) return;
      setActiveIndex((prev) => {
        const next = (prev + 1) % caseStudies.length;
        scrollToIndex(next);
        return next;
      });
    }, 5000);
    return () => window.clearInterval(id);
  }, [caseStudies.length, scrollToIndex]);

  // Re-center when viewport resizes
  useEffect(() => {
    const onResize = () => scrollToIndex(activeIndex, false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeIndex, scrollToIndex]);

  return (
    <section className="bg-primary py-20" id="services-value">
      <div className="mx-auto grid w-full max-w-[1728px] gap-20">
        <ServicesCardGrid
          heading={
            <>
              {heading || t("value.headingFallback")}
              <br />
              <span className="text-muted">{headingAccent || t("value.headingAccentFallback")}</span>
            </>
          }
          description={description || ""}
          introText={introText || ""}
          cards={cards}
          gridClassName="px-[clamp(20px,4vw,48px)] min-[600px]:grid-cols-2 min-[900px]:grid-cols-3 min-[1200px]:grid-cols-[297.6px_repeat(4,minmax(0,1fr))]"
          imageHeightClassName="h-[240px] min-[900px]:h-[280px]"
          bodyPaddingClassName="p-6"
        />

        {/* Case study carousel — auto-rotates, centered, arrows + dots */}
        <div
          className="relative"
          onMouseEnter={() => { autoplayPausedRef.current = true; }}
          onMouseLeave={() => { if (!isUserInteracting) autoplayPausedRef.current = false; }}
        >
          {/* Left arrow — bigger, more visible, perfectly centered on card height */}
          {caseStudies.length > 1 && (
            <button
              type="button"
              aria-label={t("caseStudies.previous")}
              onClick={() => scrollByStep(-1)}
              className="absolute left-4 top-[40%] z-20 -translate-y-1/2 text-white border-white/30 inline-flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 bg-black/60 backdrop-blur-md transition-all duration-300 hover:bg-accent hover:border-accent hover:text-white hover:scale-110 max-[600px]:left-2 max-[600px]:h-11 max-[600px]:w-11"
            >
              <ChevronLeft className="size-6 shrink-0" aria-hidden />
            </button>
          )}

          <motion.div
            ref={scrollRef}
            className="w-full snap-x snap-mandatory overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {/*
              Padding = 50% of viewport minus half a card width, so the first
              and last card can fully center. "w-max" lets the flex row extend
              past the viewport for horizontal scroll.
            */}
            <div className="flex w-max gap-6 px-[max(20px,calc(50vw-380px))]">
              {caseStudies.map((card, idx) => (
                <button
                  key={`${card.title}-${card.image}-${idx}`}
                  type="button"
                  data-case-study-card
                  onClick={() => {
                    autoplayPausedRef.current = true;
                    setIsUserInteracting(true);
                    scrollToIndex(idx);
                    setTimeout(() => {
                      autoplayPausedRef.current = false;
                      setIsUserInteracting(false);
                    }, 8000);
                  }}
                  className="cursor-pointer text-left border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent rounded-2xl"
                >
                  <CaseStudyCard card={card} active={idx === activeIndex} />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right arrow */}
          {caseStudies.length > 1 && (
            <button
              type="button"
              aria-label={t("caseStudies.next")}
              onClick={() => scrollByStep(1)}
              className="absolute right-4 top-[40%] z-20 -translate-y-1/2 text-white border-white/30 inline-flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 bg-black/60 backdrop-blur-md transition-all duration-300 hover:bg-accent hover:border-accent hover:text-white hover:scale-110 max-[600px]:right-2 max-[600px]:h-11 max-[600px]:w-11"
            >
              <ChevronRight className="size-6 shrink-0" aria-hidden />
            </button>
          )}

          {/* Dot navigation below */}
          {caseStudies.length > 1 && (
            <div className="mt-6 flex items-center justify-center gap-1" role="tablist" aria-label={t("caseStudies.tabs")}>
              {caseStudies.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={activeIndex === idx}
                  aria-label={t("caseStudies.tabLabel", { index: idx + 1 })}
                  onClick={() => scrollToIndex(idx)}
                  className="group inline-flex h-8 w-8 items-center justify-center p-0"
                >
                  <span
                    aria-hidden
                    className={`block h-[6px] rounded-full transition-all duration-300 ${
                      activeIndex === idx ? "w-8 bg-accent" : "w-[6px] bg-white/25 group-hover:bg-white/50"
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
