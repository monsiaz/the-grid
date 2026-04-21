"use client";

import { useRef } from "react";
import Image from "next/image";
import Header from "./Header";
import { Link } from "@/i18n/navigation";
import {
  motion,
  useScroll,
  useTransform,
  heroTitle,
  heroDescription,
  fadeUp,
  smoothTransition,
} from "./motion";

type HeroProps = {
  backgroundImage: string;
  title: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
  minHeightClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  overlayClassName?: string;
  /**
   * Position of the blurred radial text-backdrop as CSS "x% y%".
   * Defaults to left-aligned text ("16% 62%").
   * Pass "50% 55%" for centred text, "82% 55%" for right-aligned.
   * Pass false to disable the backdrop entirely.
   */
  backdropAt?: string | false;
  /** Ellipse size of the backdrop as "w% h%". Default "60% 90%". */
  backdropScale?: string;
  headerAnchorPrefix?: string;
  activeHeaderItem?: "about" | "services" | "drivers" | "news" | "contact";
  footerSlot?: React.ReactNode;
  cta?: {
    href: string;
    label: React.ReactNode;
    className?: string;
    ariaLabel?: string;
  };
  priorityBackground?: boolean;
};

export default function Hero({
  backgroundImage,
  title,
  description,
  children,
  minHeightClassName = "min-h-[clamp(420px,80svh,560px)]",
  contentClassName = "my-32 max-w-[680px] text-left",
  titleClassName = "font-[var(--font-league-spartan)] text-[64px] leading-none font-bold uppercase [text-shadow:0_2px_16px_rgba(0,0,0,0.4),0_1px_6px_rgba(0,0,0,0.3)] max-[1200px]:text-[clamp(44px,6vw,64px)]",
  descriptionClassName = "mt-2 text-base leading-[1.4] uppercase [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]",
  // Very light global overlay — the blurred text backdrop handles local contrast
  overlayClassName = "bg-[linear-gradient(180deg,rgba(0,0,0,0.03)_0%,rgba(0,0,0,0.08)_60%,rgba(0,0,0,0.22)_100%)]",
  backdropAt = "16% 62%",   // left-aligned text default
  backdropScale = "60% 90%",
  headerAnchorPrefix,
  activeHeaderItem,
  footerSlot,
  cta,
  priorityBackground = true,
}: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section ref={sectionRef} className={`relative w-full overflow-hidden ${minHeightClassName}`}>
      {priorityBackground ? (
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 480px) 480px, (max-width: 900px) 900px, (max-width: 1440px) 1440px, 1920px"
          quality={70}
          className="absolute inset-0 -z-0 object-cover"
          aria-hidden
        />
      ) : (
        <motion.div
          style={{ y: parallaxY }}
          className="absolute inset-0 -z-0 scale-110"
        >
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority={false}
            fetchPriority="auto"
            sizes="(max-width: 480px) 480px, (max-width: 900px) 900px, (max-width: 1440px) 1440px, 1920px"
            quality={70}
            className="object-cover"
            aria-hidden
          />
        </motion.div>
      )}
      {/* ── Global tint (very light) ──────────────────────────────────── */}
      <div className={`absolute inset-0 z-10 ${overlayClassName}`} />

      {/* ── Blurred radial text backdrop ──────────────────────────────────
          A soft elliptical shadow positioned where the text lives.
          The inner div extends 80px beyond all edges so filter:blur doesn't
          get hard-clipped by overflow:hidden on the outer container.
          Result: a smooth "ink bleed" that makes text crisp while the rest
          of the image stays vivid — same technique as the PDF reference.
      ──────────────────────────────────────────────────────────────────── */}
      {backdropAt !== false && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[11] overflow-hidden"
        >
          <div
            style={{
              position: "absolute",
              inset: "-80px",
              background: `radial-gradient(ellipse ${backdropScale} at ${backdropAt}, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.58) 36%, rgba(0,0,0,0.18) 58%, transparent 72%)`,
              filter: "blur(48px)",
            }}
          />
        </div>
      )}

      <Header activeItem={activeHeaderItem} anchorPrefix={headerAnchorPrefix} />
      <div className="relative z-20 mx-auto w-full max-w-[1344px] px-[clamp(20px,4vw,48px)]">
        <div className={`${contentClassName} max-[900px]:mt-[82px] max-[900px]:mb-[72px] max-[900px]:max-w-full`}>
          <motion.h1
            className={titleClassName}
            variants={heroTitle}
            initial="hidden"
            animate="visible"
            transition={{ ...smoothTransition, duration: 0.9 }}
          >
            {title}
          </motion.h1>
          {description ? (
            <motion.p
              className={descriptionClassName}
              variants={heroDescription}
              initial="hidden"
              animate="visible"
              transition={{ ...smoothTransition, delay: 0.3 }}
            >
              {description}
            </motion.p>
          ) : null}
          {cta ? (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ ...smoothTransition, delay: 0.5 }}
            >
              <Link
                href={cta.href}
                aria-label={cta.ariaLabel}
                className={`mt-8 inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-accent px-5 py-3 text-[22px] leading-[1.2] text-accent no-underline transition-all duration-300 hover:bg-accent hover:text-black hover:scale-105 ${cta.className ?? ""}`}
              >
                {cta.label}
              </Link>
            </motion.div>
          ) : null}
          {children ? (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ ...smoothTransition, delay: 0.4 }}
            >
              {children}
            </motion.div>
          ) : null}
        </div>
      </div>
      {footerSlot}
    </section>
  );
}
