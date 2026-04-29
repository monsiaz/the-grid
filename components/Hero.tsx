"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import Header from "./Header";
import StickyHeaderWrapper from "./StickyHeaderWrapper";
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
  /** Multiplier for text-backdrop gradient opacity. 1 = current default look. */
  backdropOpacity?: number;
  /** Blur radius in px for the text-backdrop. */
  backdropBlur?: number;
  headerAnchorPrefix?: string;
  activeHeaderItem?: "about" | "services" | "drivers" | "news" | "contact";
  footerSlot?: React.ReactNode;
  stickyHeader?: boolean;
  menuStyle?: "default" | "liquid";
  menuTextSize?: "regular" | "large";
  /** Parallax travel as a percentage string. Default "15%". Pass "0%" to disable. */
  parallaxIntensity?: number;
  /** Multiplier for the global overlay gradient darkness. 1 = default. */
  heroGradientIntensity?: number;
  /** Inline styles (e.g. CSS variables) merged onto the hero content wrapper */
  contentStyle?: CSSProperties;
  /** Inline styles merged onto the main title (h1) */
  titleStyle?: CSSProperties;
  /**
   * When true, omits the default `max-[900px]:mt-[82px]` block so CMS-driven
   * margins (e.g. `.hero-content-tunable`) apply on tablet/mobile.
   */
  skipDefaultContentMobileMargins?: boolean;
  cta?: {
    href: string;
    label: React.ReactNode;
    className?: string;
    ariaLabel?: string;
  };
  priorityBackground?: boolean;
  /** Passed to the background `next/image` when using object-cover (e.g. `50% 28%` to keep a face in frame). */
  backgroundObjectPosition?: string;
  /** Extra margin above the CTA link (chevron). Default a bit tight vs title block. */
  ctaMarginTopClass?: string;
  /**
   * When true (default), the content column fills space below the header and
   * uses flexbox to vertically centre the block — fixes About/Services/Drivers heroes.
   * Set false for layouts like /contact (footer anchored, explicit top padding).
   */
  centerContentVertically?: boolean;
};

export default function Hero({
  backgroundImage,
  title,
  description,
  children,
  minHeightClassName = "min-h-[clamp(420px,80svh,560px)]",
  contentClassName = "my-32 max-w-[680px] text-left",
  titleClassName = "display-hero max-w-[11ch]",
  descriptionClassName = "body-lg mt-4 max-w-[54ch] text-white/84 [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]",
  // Very light global overlay — the blurred text backdrop handles local contrast
  overlayClassName = "image-overlay-hero",
  backdropAt = "16% 62%",   // left-aligned text default
  backdropScale = "60% 90%",
  backdropOpacity = 1,
  backdropBlur = 56,
  headerAnchorPrefix,
  activeHeaderItem,
  footerSlot,
  cta,
  priorityBackground = true,
  backgroundObjectPosition,
  ctaMarginTopClass = "mt-5",
  centerContentVertically = true,
  stickyHeader = false,
  menuStyle = "default",
  menuTextSize = "large",
  parallaxIntensity = 15,
  heroGradientIntensity = 1,
  contentStyle,
  titleStyle,
  skipDefaultContentMobileMargins = false,
}: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const pct = Math.min(30, Math.max(0, parallaxIntensity));
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", `${pct}%`]);
  const clampedBackdropOpacity = Math.min(1.35, Math.max(0.5, backdropOpacity));
  const clampedBackdropBlur = Math.min(90, Math.max(24, backdropBlur));

  return (
    <section
      ref={sectionRef}
      className={`relative flex w-full flex-col overflow-hidden ${minHeightClassName}`}
    >
      {priorityBackground ? (
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 480px) 480px, (max-width: 900px) 900px, (max-width: 1440px) 1440px, 1600px"
          quality={85}
          className="absolute inset-0 -z-0 object-cover"
          style={backgroundObjectPosition ? { objectPosition: backgroundObjectPosition } : undefined}
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
            sizes="(max-width: 480px) 480px, (max-width: 900px) 900px, (max-width: 1440px) 1440px, 1600px"
            quality={85}
            className="object-cover"
            aria-hidden
          />
        </motion.div>
      )}
      {/* ── Global tint — intensity driven by heroGradientIntensity ─── */}
      <div
        className={`absolute inset-0 z-10 ${overlayClassName}`}
        style={heroGradientIntensity !== 1 ? { opacity: Math.min(2, Math.max(0, heroGradientIntensity)) } : undefined}
      />

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
              background: `radial-gradient(ellipse ${backdropScale} at ${backdropAt}, rgba(0,0,0,${(0.9 * clampedBackdropOpacity).toFixed(3)}) 0%, rgba(0,0,0,${(0.65 * clampedBackdropOpacity).toFixed(3)}) 32%, rgba(0,0,0,${(0.25 * clampedBackdropOpacity).toFixed(3)}) 54%, transparent 68%)`,
              filter: `blur(${clampedBackdropBlur}px)`,
            }}
          />
        </div>
      )}

      <StickyHeaderWrapper sticky={stickyHeader}>
        <Header
          activeItem={activeHeaderItem}
          anchorPrefix={headerAnchorPrefix}
          menuStyle={menuStyle}
          menuTextSize={menuTextSize}
        />
      </StickyHeaderWrapper>
      <div
        className={
          centerContentVertically
            ? "relative z-20 mx-auto flex w-full max-w-[1344px] flex-1 flex-col justify-center px-[clamp(20px,4vw,48px)] py-[clamp(28px,6vw,56px)]"
            : "relative z-20 mx-auto w-full max-w-[1344px] px-[clamp(20px,4vw,48px)]"
        }
      >
        <div
          className={
            skipDefaultContentMobileMargins
              ? `${contentClassName} max-[900px]:max-w-full`
              : `${contentClassName} max-[900px]:mt-[82px] max-[900px]:mb-[72px] max-[900px]:max-w-full`
          }
          style={contentStyle}
        >
          <motion.h1
            className={titleClassName}
            style={titleStyle}
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
                className={`pill-button pill-button-accent-outline ${ctaMarginTopClass} ${cta.className ?? ""}`}
              >
                {cta.label}
              </Link>
            </motion.div>
          ) : null}
          {children ? (
            <motion.div
              className="w-full"
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
