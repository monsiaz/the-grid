"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, fadeUp, smoothTransition, viewport } from "../motion";

type CaseStudy = {
  title?: string | null;
  image: string;
  description?: string | null;
  dimmed?: boolean | null;
};

type ServicesCaseStudiesProps = {
  caseStudies: CaseStudy[];
  sliderSpeed?: number;
};

function CaseStudyCard({ card }: { card: CaseStudy }) {
  const hasFaceAtTop = /gasly|givenchy|portrait|pilote|driver/i.test(card.title || "") ||
    /gasly|givenchy|portrait|pilote|driver/i.test(card.image || "");
  const objectPosition = hasFaceAtTop ? "object-top" : "object-center";
  return (
    <motion.article
      className={`grid w-[min(86vw,360px)] shrink-0 gap-4 transition-opacity duration-500 min-[900px]:w-[420px] min-[1280px]:w-[470px] ${
        card.dimmed ? "opacity-65" : "opacity-100"
      }`}
      variants={fadeUp}
      transition={smoothTransition}
      whileHover={{ y: -6 }}
    >
      <div className="surface-card-soft relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={card.image}
          alt={card.title || ""}
          fill
          quality={100}
          sizes="(max-width: 900px) 86vw, (max-width: 1280px) 420px, 470px"
          className={`object-cover ${objectPosition} transition-transform duration-700 ease-out hover:scale-[1.03]`}
        />
      </div>
      <h3 className="display-card m-0 text-white min-[900px]:text-[18px]">
        {card.title || "\u00a0"}
      </h3>
      <div className="section-divider" aria-hidden />
      {card.description ? (
        <p className="body-md m-0 text-secondary/78 min-[900px]:text-[15px]">
          {card.description}
        </p>
      ) : null}
    </motion.article>
  );
}

export default function ServicesCaseStudies({ caseStudies, sliderSpeed = 0.5 }: ServicesCaseStudiesProps) {
  const t = useTranslations("services.caseStudies");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const autoScrollPos = useRef(0);

  const shouldLoop = caseStudies.length > 1;

  // Detect desktop (≥900px) to toggle between modes
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Sync arrow button state from scroll position (mobile only)
  const syncButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  // Mobile: native scroll – just sync button visibility
  useEffect(() => {
    if (isDesktop) return;
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", syncButtons, { passive: true });
    syncButtons();
    return () => el.removeEventListener("scroll", syncButtons);
  }, [isDesktop, syncButtons]);

  // Desktop auto-scroll marquee via rAF
  useEffect(() => {
    if (!isDesktop || !shouldLoop) return;
    const el = scrollRef.current;
    if (!el) return;

    const SPEED = sliderSpeed; // px per frame — configurable via BO Design Settings

    const tick = () => {
      if (!paused) {
        autoScrollPos.current += SPEED;
        const half = el.scrollWidth / 2;
        if (autoScrollPos.current >= half) autoScrollPos.current -= half;
        el.scrollLeft = autoScrollPos.current;
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isDesktop, shouldLoop, paused, sliderSpeed]);

  // Desktop arrow navigation: advance/retreat by one card width
  const scrollBy = useCallback(
    (dir: 1 | -1) => {
      const el = scrollRef.current;
      if (!el) return;
      setPaused(true);

      const cardWidth = el.querySelector("article")?.offsetWidth ?? 470;
      const gap = 32;
      const step = cardWidth + gap;

      autoScrollPos.current = Math.max(
        0,
        autoScrollPos.current + dir * step,
      );
      el.scrollTo({ left: autoScrollPos.current, behavior: "smooth" });

      // Resume auto-scroll after 3 s of inactivity
      const timer = setTimeout(() => setPaused(false), 3000);
      return () => clearTimeout(timer);
    },
    [],
  );

  // Mobile arrow navigation
  const scrollMobile = useCallback((dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("article")?.offsetWidth ?? 320;
    const gap = 24;
    el.scrollBy({ left: dir * (cardWidth + gap), behavior: "smooth" });
  }, []);

  if (caseStudies.length === 0) return null;

  return (
    <section
      id="services-case-studies"
      className="bg-primary overflow-hidden py-20"
      aria-label={t("tabs")}
    >
      <div className="relative mx-auto w-full max-w-[1728px]">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-primary via-primary/80 to-transparent max-[700px]:w-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-primary via-primary/80 to-transparent max-[700px]:w-10" />

        {/* Desktop arrows – vertically centred on the image area (~236px ≈ aspect 16/9 of 420px card) */}
        <div className="pointer-events-none absolute left-0 right-0 top-[calc(50%-22px)] z-20 hidden -translate-y-1/2 items-center justify-between px-[clamp(4px,1.5vw,16px)] min-[900px]:flex">
          <button
            type="button"
            aria-label="Précédent"
            onClick={() => scrollBy(-1)}
            className="pill-button pill-button-accent-outline pointer-events-auto h-11 w-11 px-0 transition-all duration-300 hover:scale-105"
          >
            <ChevronLeft className="h-5 w-5 shrink-0" />
          </button>
          <button
            type="button"
            aria-label="Suivant"
            onClick={() => scrollBy(1)}
            className="pill-button pill-button-accent-outline pointer-events-auto h-11 w-11 px-0 transition-all duration-300 hover:scale-105"
          >
            <ChevronRight className="h-5 w-5 shrink-0" />
          </button>
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={smoothTransition}
          onMouseEnter={() => { if (isDesktop) setPaused(true); }}
          onMouseLeave={() => { if (isDesktop) setPaused(false); }}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div
            ref={scrollRef}
            className={[
              "pb-2",
              // Mobile: native scroll, no scrollbar
              "overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              // Desktop: overflow hidden (auto-scroll handles position)
              "min-[900px]:overflow-x-hidden",
            ].join(" ")}
            style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
          >
            <div
              className="inline-flex min-w-max gap-6 px-[clamp(20px,4vw,48px)] min-[900px]:gap-8"
            >
              {/* First group */}
              {caseStudies.map((card, index) => (
                <CaseStudyCard
                  key={`a-${card.title || "case-study"}-${index}`}
                  card={card}
                />
              ))}
              {/* Duplicate for infinite loop on desktop */}
              {shouldLoop && caseStudies.map((card, index) => (
                <CaseStudyCard
                  key={`b-${card.title || "case-study"}-${index}`}
                  card={card}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Mobile arrows – rendered after the track so they sit below */}
        <div className="mt-6 flex items-center justify-center gap-3 min-[900px]:hidden">
          <button
            type="button"
            aria-label="Précédent"
            onClick={() => scrollMobile(-1)}
            disabled={!canPrev}
            className="pill-button pill-button-accent-outline h-10 w-10 px-0 transition-all duration-300 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4 shrink-0" />
          </button>
          <button
            type="button"
            aria-label="Suivant"
            onClick={() => scrollMobile(1)}
            disabled={!canNext}
            className="pill-button pill-button-accent-outline h-10 w-10 px-0 transition-all duration-300 disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4 shrink-0" />
          </button>
        </div>
      </div>
    </section>
  );
}
