"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { motion, fadeUp, smoothTransition } from "../motion";

type NewsTagBadge = {
  label: string;
  accent?: boolean;
};

type NewsCardProps = {
  href: string;
  title: string;
  image: string;
  excerpt?: string | null;
  tag?: NewsTagBadge | null;
  /** Tailwind classes on the outer <article>. Typically used to control size / grid-area. */
  cardClassName?: string;
  /**
   * Legacy prop, no longer used — kept so existing callers (`imageWrapClassName="flex-1 min-h-0"`)
   * keep compiling. The new editorial design makes the image fill the entire card, so the
   * wrapper class is always the card itself.
   */
  imageWrapClassName?: string;
  /** Tailwind classes applied to the title. */
  titleClassName?: string;
  /** Hide the tag badge. Default: show when a tag is present. */
  hideTag?: boolean;
  /** Show the short excerpt under the title (editorial mode, off by default). */
  showExcerpt?: boolean;
  /** Image priority for LCP candidates (first tall card). */
  priority?: boolean;
  sizes?: string;
  imageClassName?: string;
  /** Controls hover effect: zoom (default), lift (translateY), flat (none) */
  cardHoverStyle?: "zoom" | "lift" | "flat";
};

/**
 * Editorial news card.
 *
 * Image fills the full card, a bottom-anchored gradient carries the title and
 * a red-accent "LEARN MORE" pill. This design keeps the site's signature black
 * + accent DA while eliminating the empty "body panel" that was consuming up
 * to half the card height (image 299 px / body 339 px on the 640 px tall
 * bento card before this change). Hover lifts the card, deepens the gradient
 * and subtly zooms the photo.
 */
export default function NewsCard({
  href,
  title,
  image,
  excerpt,
  tag,
  cardClassName,
  titleClassName,
  hideTag = false,
  showExcerpt = false,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 320px",
  imageClassName,
  cardHoverStyle = "zoom",
}: NewsCardProps) {
  const t = useTranslations("news.card");
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const showTag = !hideTag && !!tag;
  const imageSrc = typeof image === "string" ? image.trim() : "";
  const hasImage = imageSrc.length > 0 && failedImage !== imageSrc;
  const hoverMotion =
    cardHoverStyle === "flat"
      ? undefined
      : cardHoverStyle === "lift"
        ? { y: -10 }
        : { y: -6 };

  return (
    <motion.article
      className={`surface-card-soft group relative overflow-hidden transition-colors duration-300 hover:border-accent/60 ${cardClassName ?? ""}`}
      variants={fadeUp}
      transition={smoothTransition}
      whileHover={hoverMotion}
    >
      <Link
        href={href}
        aria-label={t("readAria", { title })}
        className="relative block h-full w-full text-secondary no-underline"
      >
        {hasImage ? (
          <Image
            src={imageSrc}
            alt={title}
            fill
            className={`object-cover transition-transform duration-[600ms] ease-out ${cardHoverStyle === "zoom" ? "group-hover:scale-[1.06]" : ""} ${imageClassName ?? ""}`}
            sizes={sizes}
            priority={priority}
            onError={() => setFailedImage(imageSrc)}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(182,72,63,0.32),transparent_42%),linear-gradient(180deg,rgba(35,35,35,1)_0%,rgba(12,12,12,1)_100%)]" />
        )}

        {/*
          Dual-gradient: a gentle top wash so the tag stays legible against bright
          skies, and a deeper bottom wash anchoring the title + CTA. `from-black/95`
          stops short of opaque so a hint of the photo still reads through.
        */}
        <div className="image-overlay-card pointer-events-none" />
        {showTag ? (
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/60 to-transparent" />
        ) : null}

        {showTag && tag ? (
          <span
            className={`absolute left-4 top-4 inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] backdrop-blur-sm ${
              tag.accent
                ? "border-accent/60 bg-accent/20 text-accent"
                : "border-white/20 bg-black/45 text-white"
            }`}
          >
            {tag.label}
          </span>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5">
          <h2
            className={`display-card m-0 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)] ${titleClassName ?? ""}`}
          >
            {title}
          </h2>
          {showExcerpt && excerpt ? (
            <p className="body-sm m-0 line-clamp-2 text-white/80 normal-case">
              {excerpt}
            </p>
          ) : null}
          <span className="ui-label mt-1 inline-flex w-fit items-center gap-1.5 text-accent transition-all duration-300 group-hover:gap-2.5">
            {t("learnMore")}
            <span aria-hidden className="inline-block translate-y-[-0.5px] transition-transform duration-300 group-hover:translate-x-1">→</span>
            <span className="sr-only">{t("learnMoreSr")}</span>
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
