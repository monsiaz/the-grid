"use client";

import Image from "next/image";
import { motion, scaleIn, smoothTransition, viewport } from "../motion";

export default function AboutAccelereBanner() {
  return (
    <motion.section
      className="relative min-h-[800px] w-full overflow-hidden"
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      transition={{ ...smoothTransition, duration: 1 }}
    >
      <Image
        src="/images/about/accelere-banner.webp"
        alt="ACCÉLÈRE motorsport initiative"
        fill
        sizes="100vw"
        className="object-cover"
      />
    </motion.section>
  );
}
