"use client";

import Image from "next/image";
import {
  motion,
  fadeUp,
  scaleIn,
  smoothTransition,
  viewport,
} from "../motion";

export default function ServicesPartner() {
  return (
    <section className="relative min-h-[800px] w-full overflow-hidden">
      <Image src="/images/services.webp" alt="The Grid x Hintsa partnership" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 mx-auto flex min-h-[800px] w-full max-w-[1344px] items-center justify-center px-[clamp(20px,4vw,48px)] py-32">
        <div className="grid w-full max-w-[1002px] gap-7 text-center uppercase">
          <motion.div
            className="mx-auto flex items-center justify-center gap-8 max-[900px]:flex-col"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={{ ...smoothTransition, duration: 0.9 }}
          >
            <Image
              src="/images/logo.svg"
              alt="The Grid"
              width={248}
              height={56}
              className="h-auto w-[248px]"
            />
            <span className="bg-secondary h-14 w-px max-[900px]:h-px max-[900px]:w-14" />
            <Image
              src="/images/services/hintsa-white-logo.svg"
              alt="Hintsa"
              width={248}
              height={44}
              className="h-auto w-[248px]"
            />
          </motion.div>
          <motion.p
            className="m-0 mx-auto max-w-[1004px] text-[clamp(16px,1.8vw,20px)] leading-[1.4] font-light"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={{ ...smoothTransition, delay: 0.2 }}
          >
            The Grid Agency partners with Hintsa Performance, a global leader in human performance coaching. Built on
            a shared belief that performance is won off-track, this collaboration strengthens our commitment to
            preparing drivers for the highest level of the sport.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
