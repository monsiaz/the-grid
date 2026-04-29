"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  motion,
  slideInRight,
  fadeUp,
  smoothTransition,
  viewport,
} from "./motion";

type AboutProps = {
  text: string;
  buttonLabel?: string;
  backgroundImage?: string | null;
  /** Image + gradient only (no pitch text / CTA). Used on the homepage strip with the F1 visual. */
  visualOnly?: boolean;
};

/**
 * HeadlightBeam — a single cone of light sweeping left→right.
 *
 * Two instances are rendered side-by-side (like a car's two headlights).
 * The opacity keyframes create the realistic flicker (clignotement) effect.
 * mixBlendMode:"screen" naturally brightens whatever is underneath.
 */
function HeadlightBeam({
  delay,
  xOffset = 0,
}: {
  delay: number;
  xOffset?: number;
}) {
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 w-[180px]"
      style={{
        left: xOffset,
        background:
          "linear-gradient(90deg, transparent 0%, rgba(239,237,237,0.06) 18%, rgba(255,255,255,0.42) 50%, rgba(239,237,237,0.06) 82%, transparent 100%)",
        mixBlendMode: "screen",
        transform: "skewX(-5deg)",
        willChange: "transform, opacity",
      }}
      initial={{ x: -2400, opacity: 0 }}
      animate={{
        // full left-to-right sweep, well past both edges
        x: [-2400, 2800],
        // flicker pattern: surge → dim → surge → dim → surge → fade out
        opacity: [0, 0, 0.92, 0.48, 1, 0.38, 0.88, 0.55, 0.82, 0],
      }}
      transition={{
        duration: 2.8,
        delay,
        repeat: Infinity,
        repeatDelay: 8,
        // X moves at constant speed
        x: { ease: "linear", duration: 2.8 },
        // Opacity follows its own keyframe timing
        opacity: {
          ease: "linear",
          duration: 2.8,
          times: [0, 0.03, 0.08, 0.18, 0.32, 0.48, 0.62, 0.75, 0.88, 1],
        },
      }}
    />
  );
}

export default function About({
  text,
  buttonLabel,
  backgroundImage,
  visualOnly = false,
}: AboutProps) {
  const t = useTranslations("home");
  const label = buttonLabel || t("explore");
  const bg = backgroundImage || "/images/about.webp";
  return (
    <section
      className="relative flex min-h-[clamp(360px,55vh,413px)] w-full items-center overflow-hidden"
      id="about"
    >
      <Image
        src={bg}
        alt=""
        fill
        loading="lazy"
        sizes="(max-width: 640px) 100vw, (max-width: 1200px) 100vw, (max-width: 1600px) 1600px, 1920px"
        quality={85}
        className="absolute inset-0 object-cover"
        style={{ objectPosition: "38% 78%" }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(270deg,rgba(15,15,15,0.36)_0%,rgba(15,15,15,0.14)_55%,transparent_100%)]" />
      {!visualOnly ? (
        <>
          <div aria-hidden className="pointer-events-none absolute inset-0 z-[11] overflow-hidden">
            <div
              style={{
                position: "absolute",
                inset: "-80px",
                background:
                  "radial-gradient(ellipse 55% 90% at 84% 58%, rgba(15,15,15,0.9) 0%, rgba(15,15,15,0.62) 36%, rgba(15,15,15,0.18) 58%, transparent 72%)",
                filter: "blur(48px)",
              }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 z-[11]" aria-hidden>
            <HeadlightBeam delay={2} xOffset={0} />
            <HeadlightBeam delay={2.15} xOffset={90} />
          </div>
        </>
      ) : null}

      {!visualOnly ? (
      <div className="relative z-20 mx-auto my-16 flex w-full max-w-[1344px] flex-col items-end justify-center gap-7 px-[clamp(20px,4vw,48px)] max-[900px]:items-start max-[900px]:gap-5">
        <motion.p
          className="body-lg m-0 max-w-[660px] text-right text-white/84 max-[900px]:max-w-full max-[900px]:text-left"
          variants={slideInRight}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={smoothTransition}
        >
          {text}
        </motion.p>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ ...smoothTransition, delay: 0.2 }}
        >
          <Link
            href="/about"
            className="pill-button pill-button-outline"
          >
            {label}
          </Link>
        </motion.div>
      </div>
      ) : null}
    </section>
  );
}
