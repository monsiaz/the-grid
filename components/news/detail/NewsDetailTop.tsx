"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
type NewsDetailData = {
  slug: string;
  title: string;
  date: string;
  heroImage: string;
  introParagraphs: string[];
  bodyParagraphs: string[];
  galleryImages: string[];
};
import {
  motion,
  fadeUp,
  slideInLeft,
  slideInRight,
  smoothTransition,
} from "../../motion";

type NewsDetailTopProps = {
  detail: NewsDetailData;
};

export default function NewsDetailTop({ detail }: NewsDetailTopProps) {
  return (
    <div className="grid items-start gap-10 min-[1100px]:grid-cols-[433px_minmax(0,1fr)]">
      <motion.div
        className="relative aspect-[4/5] w-full overflow-hidden min-[700px]:h-[512px] min-[700px]:aspect-auto"
        variants={slideInLeft}
        initial="hidden"
        animate="visible"
        transition={smoothTransition}
      >
        <motion.div
          className="relative h-full w-full"
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Image src={detail.heroImage} alt={detail.title} fill className="object-cover" sizes="(max-width: 1099px) 100vw, 433px" />
        </motion.div>
      </motion.div>

      <motion.div
        className="grid gap-10"
        variants={slideInRight}
        initial="hidden"
        animate="visible"
        transition={{ ...smoothTransition, delay: 0.15 }}
      >
        <Link
          href="/news"
          aria-label="Back to news"
          className="text-accent border-accent inline-flex h-[34px] w-[57px] items-center justify-center rounded-full border-2 no-underline transition-all duration-300 hover:bg-accent hover:text-black hover:scale-110"
        >
          <ChevronLeft className="h-5 w-5 shrink-0" aria-hidden />
        </Link>

        <div className="grid gap-4">
          <h1 className="m-0 font-[var(--font-league-spartan)] text-[clamp(42px,7vw,64px)] leading-none font-bold uppercase">
            {detail.title}
          </h1>
          <p className="text-accent m-0 text-[14px] leading-none font-bold uppercase">{detail.date}</p>
          <div className="grid gap-4 text-base leading-[1.4] font-light">
            {detail.introParagraphs.map((paragraph) => (
              <p key={paragraph} className="m-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
