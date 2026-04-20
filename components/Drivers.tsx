"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  fadeUp,
  scaleIn,
  smoothTransition,
  viewport,
} from "./motion";

type DriversProps = {
  heading: string;
  headingAccent: string;
};

export default function Drivers({ heading, headingAccent }: DriversProps) {
  return (
    <section
      className="relative flex min-h-[clamp(560px,85vh,800px)] w-full items-center justify-center"
      id="drivers"
    >
      <Image
        src="/images/drivers.webp"
        alt=""
        fill
        loading="lazy"
        sizes="(max-width: 480px) 480px, (max-width: 900px) 900px, (max-width: 1440px) 1440px, 1920px"
        quality={65}
        className="absolute inset-0 object-cover"
        aria-hidden
      />
      <div className="absolute inset-0 z-10 bg-black/40" />
      <div className="relative z-20 mx-auto my-32 grid w-full max-w-[1344px] justify-items-center gap-14 px-[clamp(20px,4vw,48px)] text-center max-[900px]:my-[88px] max-[900px]:gap-[38px]">
        <motion.h2
          className="m-0 font-[var(--font-league-spartan)] text-[64px] leading-none font-bold uppercase drop-shadow-[4px_4px_8px_rgba(0,0,0,0.1)] max-[1200px]:text-[clamp(44px,6vw,64px)]"
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ ...smoothTransition, duration: 0.9 }}
        >
          {heading}
          <br />
          {headingAccent}
        </motion.h2>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ ...smoothTransition, delay: 0.3 }}
        >
          <Link
            href="/drivers"
            className="text-accent border-accent inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-full border-2 bg-black/20 px-9 py-3 text-base leading-[1.2] no-underline uppercase hover:text-black hover:bg-accent hover:scale-105 transition-all duration-300"
          >
            Meet our drivers
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
