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

export default function About({ text, buttonLabel, backgroundImage }: AboutProps) {
  const t = useTranslations("home");
  const label = buttonLabel || t("explore");
  const bg = backgroundImage || "/images/about.webp";
  return (
    <section
      className="relative flex min-h-[clamp(360px,55vh,413px)] w-full items-center"
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
      <div className="absolute inset-0 z-10 bg-[linear-gradient(270deg,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.4)_45%,rgba(0,0,0,0.1)_100%)]" />
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
