"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  motion,
  fadeUp,
  slideInLeft,
  slideInRight,
  staggerContainer,
  smoothTransition,
  viewport,
} from "../motion";

const COME_MAILTO = "mailto:come.ensemble@comemaisonfinanciere.com";

type AboutAccelereFollowProps = {
  description?: string | null;
  quote?: string | null;
  quoteAuthor?: string | null;
  quoteRole?: string | null;
  quoteTitle?: string | null;
  instagramHandle?: string | null;
  instagramUrl?: string | null;
  instagramImages: string[];
  portraitImage?: string | null;
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
  portraitImage,
}: AboutAccelereFollowProps) {
  const t = useTranslations("about.follow");
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
            <p className="body-lg m-0 whitespace-pre-line text-white/84">
              {description}
            </p>
            <a
              href={COME_MAILTO}
              aria-label={t("getInTouchAria")}
              className="pill-button pill-button-accent-outline mx-auto w-fit"
            >
              {t("getInTouch")}
            </a>
          </motion.div>

          <div className="grid items-center gap-7 min-[900px]:grid-cols-[432px_1fr]">
            <motion.div
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              transition={smoothTransition}
              className="surface-card-soft overflow-hidden"
            >
              <Image
                src={portraitImage || "/assets/v2/about/accelere-portrait.webp"}
                alt={quoteAuthor || t("portraitFallback")}
                width={432}
                height={500}
                sizes="(max-width: 900px) 100vw, 432px"
                className="h-auto w-full object-cover"
              />
            </motion.div>
            <motion.div
              className="relative border-l border-white/18 pl-7"
              variants={slideInRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              transition={{ ...smoothTransition, delay: 0.2 }}
            >
              <span className="text-accent absolute -left-2 top-1 text-[120px] leading-none opacity-30">&ldquo;</span>
              <p className="body-lg m-0 italic text-white/88">
                {quote}
              </p>
              <p className="body-md mt-5 mb-0 text-white/72">
                <span className="display-card text-[18px] text-white">{quoteAuthor}</span>
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
            className="display-section m-0"
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={smoothTransition}
          >
            <span className="text-muted">{t("heading")} </span>{t("headingAccent")}
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
              <p className="display-card m-0 text-[clamp(22px,2.4vw,28px)] text-white">{instagramHandle}</p>
              <Link
                href={instagramUrl || "https://instagram.com"}
                target="_blank"
                rel="noreferrer"
                className="pill-button pill-button-accent-outline"
              >
                {t("instagramCta")}
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
                      alt={t("gridAlt")}
                      width={269}
                      height={360}
                      loading="lazy"
                      sizes="(max-width: 900px) 50vw, 20vw"
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
