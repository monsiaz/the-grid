"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  motion,
  useScroll,
  useTransform,
  slideInLeft,
  fadeUp,
  staggerContainer,
  smoothTransition,
  viewport,
} from "./motion";

type ServicesProps = {
  labels: string[];
  backgroundImage?: string | null;
};

export default function Services({ labels, backgroundImage }: ServicesProps) {
  const t = useTranslations("home.services");
  const bg = backgroundImage || "/assets/v2/home/about.webp";
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      /* Image ratio is 16:9 (1600×900). Use aspect-ratio on desktop so the full photo fits
         with minimal crop; cap between 420px and 720px to avoid being too tall on large screens. */
      style={{ height: "clamp(420px, 56.25vw, 720px)" }}
      id="services"
    >
      {/* Background image: contain-like fit via object-cover + centred position so as little is cropped as possible */}
      <motion.div
        style={{ y: parallaxY, position: "absolute", left: 0, right: 0, top: "-3%", bottom: "-3%" }}
      >
        <Image
          src={bg}
          alt=""
          fill
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1200px) 100vw, (max-width: 1920px) 1920px, 2560px"
          quality={100}
          /* Center horizontally and vertically so the whole scene stays visible */
          className="object-cover object-[62%_28%] min-[640px]:object-center"
          aria-hidden
        />
      </motion.div>

      {/* Vignette */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: [
            "linear-gradient(180deg, rgba(15,15,15,0) 30%, rgba(15,15,15,0.72) 68%, rgba(15,15,15,0.88) 100%)",
            "linear-gradient(90deg, rgba(15,15,15,0.76) 0%, rgba(15,15,15,0.34) 18%, rgba(15,15,15,0.06) 36%, rgba(15,15,15,0) 55%, rgba(15,15,15,0.18) 78%, rgba(15,15,15,0.45) 100%)",
          ].join(","),
        }}
      />

      {/* Content */}
      <div
        className="relative z-20 flex h-full w-full items-end min-[640px]:items-center"
      >
        <div className="flex w-full flex-col items-start gap-5 px-6 pb-10 min-[640px]:max-w-[620px] min-[640px]:gap-7 min-[640px]:px-[clamp(32px,5vw,80px)] min-[640px]:pb-0">
          <motion.div
            className="flex flex-col gap-1 min-[640px]:gap-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {labels.map((label) => (
              <motion.p
                key={label}
                className="m-0 font-[family-name:var(--font-league-spartan)] font-bold uppercase text-white leading-[1.04] tracking-[0.01em] [text-shadow:0_2px_18px_rgba(0,0,0,0.6)] text-[clamp(18px,4.8vw,26px)] min-[640px]:text-[clamp(28px,3.2vw,46px)] min-[640px]:whitespace-nowrap"
                variants={slideInLeft}
                transition={smoothTransition}
              >
                {label}
              </motion.p>
            ))}
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={{ ...smoothTransition, delay: 0.4 }}
          >
            <Link
              href="/services"
              className="pill-button pill-button-accent-outline text-[11px] min-[640px]:text-[12px]"
            >
              {t("cta")}<span className="sr-only">{t("ctaSr")}</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
