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
  titleClassName = "font-[var(--font-league-spartan)] text-[64px] leading-none font-bold uppercase [text-shadow:0_4px_24px_rgba(0,0,0,0.55),0_2px_8px_rgba(0,0,0,0.4)] max-[1200px]:text-[clamp(44px,6vw,64px)]",
  descriptionClassName = "mt-2 text-base leading-[1.4] uppercase [text-shadow:0_2px_12px_rgba(0,0,0,0.55)]",
  overlayClassName = "bg-[linear-gradient(180deg,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.2)_55%,rgba(0,0,0,0.55)_100%)]",
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
      <div className={`absolute inset-0 z-10 ${overlayClassName}`} />
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
