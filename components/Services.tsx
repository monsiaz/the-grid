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
  const bg = backgroundImage || "/images/services.webp";
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[clamp(480px,70vh,575px)] w-full items-center overflow-hidden"
      id="services"
    >
      <motion.div style={{ y: parallaxY }} className="absolute inset-0 scale-[1.16]">
        <Image
          src={bg}
          alt=""
          fill
          loading="lazy"
          sizes="(max-width: 480px) 480px, (max-width: 900px) 900px, (max-width: 1440px) 1440px, 1920px"
          quality={65}
          className="object-cover"
          aria-hidden
        />
      </motion.div>
      <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(0,0,0,0.9),rgba(0,0,0,0)_75%)]" />
      <div className="relative z-20 mx-auto my-32 flex w-full max-w-[1344px] flex-col items-start gap-14 px-[clamp(20px,4vw,48px)] max-[900px]:my-[88px] max-[900px]:gap-8">
        <motion.div
          className="text-soft grid gap-7 text-[40px] leading-[1.3] uppercase max-[1200px]:text-[clamp(32px,4vw,40px)]"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {labels.map((label) => (
            <motion.p key={label} className="m-0" variants={slideInLeft} transition={smoothTransition}>
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
            className="text-accent border-accent inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-full border-2 bg-black/20 px-9 py-3 text-base leading-[1.2] no-underline uppercase hover:text-black hover:bg-accent hover:scale-105 transition-all duration-300"
          >
            {t("cta")}<span className="sr-only">{t("ctaSr")}</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
