"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  fadeUp,
  slideInLeft,
  slideInRight,
  staggerContainer,
  smoothTransition,
  viewport,
} from "../motion";

type AboutAccelereFollowProps = {
  description?: string | null;
  quote?: string | null;
  quoteAuthor?: string | null;
  quoteRole?: string | null;
  quoteTitle?: string | null;
  instagramHandle?: string | null;
  instagramUrl?: string | null;
  instagramImages: string[];
};

export default function AboutAccelereFollow({
  description,
  quote,
  quoteAuthor,
  quoteRole,
  quoteTitle,
  instagramHandle,
  instagramUrl,
  instagramImages,
}: AboutAccelereFollowProps) {
  const gridOrder = [
    ...instagramImages,
    ...(instagramImages.length >= 5
      ? [instagramImages[3], instagramImages[2], instagramImages[4], instagramImages[0], instagramImages[1]]
      : []),
  ];

  return (
    <section className="bg-primary pb-20">
      <div className="mx-auto grid w-full max-w-[1344px] gap-20 px-[clamp(20px,4vw,48px)] pt-10">
        <div className="mx-auto grid w-full max-w-[1002px] gap-12">
          <motion.div
            className="mx-auto grid w-full max-w-[1004px] gap-7 text-center"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={smoothTransition}
          >
            <p className="m-0 text-[clamp(16px,1.8vw,20px)] leading-[1.55] font-light whitespace-pre-line">
              {description}
            </p>
            <Link
              href="#contact"
              className="text-accent border-accent mx-auto inline-flex w-fit items-center justify-center rounded-full border-2 bg-black/20 px-9 py-4 text-base leading-[1.2] no-underline uppercase transition-all duration-300 hover:bg-accent hover:text-black hover:scale-105"
            >
              Get in touch
            </Link>
          </motion.div>

          <div className="grid items-center gap-7 min-[900px]:grid-cols-[432px_1fr]">
            <motion.div
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              transition={smoothTransition}
              className="overflow-hidden"
            >
              <Image
                src="/images/about/accelere-portrait.webp"
                alt={quoteAuthor || "Pierre Gasly"}
                width={432}
                height={500}
                className="h-auto w-full object-cover"
              />
            </motion.div>
            <motion.div
              className="border-secondary relative border-l pl-7"
              variants={slideInRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              transition={{ ...smoothTransition, delay: 0.2 }}
            >
              <span className="text-accent absolute -left-2 top-1 text-[120px] leading-none opacity-30">&ldquo;</span>
              <p className="m-0 text-[clamp(16px,1.8vw,20px)] leading-[1.4] font-light italic">
                {quote}
              </p>
              <p className="mt-5 mb-0 text-base leading-[1.2]">
                <span className="font-semibold">{quoteAuthor}</span>
                <br />
                {quoteRole}
                <br />
                {quoteTitle}
              </p>
            </motion.div>
          </div>
        </div>

        <div className="grid gap-6">
          <motion.h2
            className="m-0 font-[var(--font-league-spartan)] text-[64px] leading-none font-bold uppercase max-[1200px]:text-[clamp(44px,6vw,64px)]"
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={smoothTransition}
          >
            <span className="text-muted">Follow </span>us
          </motion.h2>
          <div className="grid gap-2">
            <motion.div
              className="flex items-center justify-between gap-4 max-[900px]:flex-col max-[900px]:items-start"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              transition={smoothTransition}
            >
              <p className="m-0 text-xl leading-[1.2] font-bold uppercase">{instagramHandle}</p>
              <Link
                href={instagramUrl || "https://instagram.com"}
                target="_blank"
                rel="noreferrer"
                className="text-accent border-accent inline-flex items-center justify-center rounded-full border-2 bg-black/20 px-9 py-4 text-base leading-[1.2] no-underline uppercase transition-all duration-300 hover:bg-accent hover:text-black hover:scale-105"
              >
                Instagram
              </Link>
            </motion.div>
            <motion.div
              className="grid grid-cols-2 gap-1 min-[900px]:grid-cols-5"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              {gridOrder.map((src, idx) => (
                <motion.div
                  key={`${src}-${idx}`}
                  variants={fadeUp}
                  transition={smoothTransition}
                  className="overflow-hidden"
                >
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <Image
                      src={src}
                      alt="The Grid Instagram"
                      width={269}
                      height={360}
                      className="aspect-[269/360] h-auto w-full object-cover"
                    />
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
