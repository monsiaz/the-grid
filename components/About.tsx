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
        // Conical gradient — bright white core, soft warm edges
        background:
          "linear-gradient(90deg, transparent 0%, rgba(255,252,230,0.07) 18%, rgba(255,255,245,0.48) 50%, rgba(255,252,230,0.07) 82%, transparent 100%)",
        mixBlendMode: "screen",
        // Slight negative skew → makes the beam look like a forward-slanting cone
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

export default function About({ text, buttonLabel, backgroundImage }: AboutProps) {
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
        sizes="(max-width: 480px) 480px, (max-width: 900px) 900px, (max-width: 1440px) 1440px, 1920px"
        quality={65}
        className="absolute inset-0 object-cover object-[35%_center]"
        aria-hidden
      />
      {/* Light global tint */}
      <div className="absolute inset-0 z-10 bg-[linear-gradient(270deg,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.06)_55%,transparent_100%)]" />
      {/* Blurred radial shadow on the RIGHT where text lives */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[11] overflow-hidden">
        <div
          style={{
            position: "absolute",
            inset: "-80px",
            background:
              "radial-gradient(ellipse 55% 90% at 84% 58%, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.58) 36%, rgba(0,0,0,0.18) 58%, transparent 72%)",
            filter: "blur(48px)",
          }}
        />
      </div>

      {/* ── Headlight sweep ────────────────────────────────────────────────
          Two beams ~90px apart simulate the two headlights of a single car
          passing from left to right. The second beam is slightly delayed so
          the pair arrives as a compact unit rather than two separate events.
      ──────────────────────────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-[11]" aria-hidden>
        {/* Left headlight */}
        <HeadlightBeam delay={2} xOffset={0} />
        {/* Right headlight — 90px to the right, 0.15s later */}
        <HeadlightBeam delay={2.15} xOffset={90} />
      </div>

      <div className="relative z-20 mx-auto my-16 flex w-full max-w-[1344px] flex-col items-end justify-center gap-7 px-[clamp(20px,4vw,48px)] max-[900px]:items-start max-[900px]:gap-5">
        <motion.p
          className="m-0 max-w-[660px] text-right text-xl leading-[1.35] font-light max-[900px]:max-w-full max-[900px]:text-left max-[900px]:text-[17px]"
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
            className="text-secondary border-secondary inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-full border-2 bg-black/20 px-9 py-3 text-base leading-[1.2] no-underline uppercase hover:text-black hover:bg-white hover:scale-105 transition-all duration-300"
          >
            {label}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
