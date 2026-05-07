"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { DriverCardData, DriverDetailData, DriverRelatedNews } from "../driversData";
import { resolveGalleryImages } from "../driversData";
import DriverGalleryCarousel from "./DriverGalleryCarousel";
import {
  motion,
  fadeUp,
  slideInRight,
  staggerContainer,
  smoothTransition,
  viewport,
} from "../../motion";

const LEGACY_GASLY_IMAGES = {
  profile: "/images/drivers/detail-profile-gasly.webp",
  galleryLeft: "/images/drivers/detail-gallery-left.webp",
  galleryCenter: "/images/drivers/detail-gallery-main.webp",
  galleryRight: "/images/drivers/detail-gallery-right.webp",
};

type DriverDetailTopProps = {
  driver: DriverCardData;
  detail: DriverDetailData;
};

const FEATURED_SLUGS = new Set(["pierre-gasly", "isack-hadjar"]);

type RelatedNewsShowcaseProps = {
  items: DriverRelatedNews[];
  heading: string;
  learnMoreLabel: string;
};

function RelatedNewsShowcaseCard({
  item,
  featured = false,
  learnMoreLabel,
}: {
  item: DriverRelatedNews;
  featured?: boolean;
  learnMoreLabel: string;
}) {
  const content = (
    <>
      <div className="absolute inset-0">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className={`object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.05] ${featured ? "object-[center_26%]" : "object-[center_22%]"}`}
          style={item.imageFocalPoint ? { objectPosition: item.imageFocalPoint } : undefined}
          sizes={featured ? "(max-width: 900px) 100vw, 760px" : "(max-width: 900px) 100vw, 420px"}
          priority={featured}
          loading={featured ? "eager" : "lazy"}
        />
      </div>
      <div className="image-overlay-card pointer-events-none" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5">
        <h4
          className={`display-card m-0 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)] ${
            featured ? "text-[clamp(24px,2.3vw,34px)]" : "text-[clamp(16px,1.25vw,20px)]"
          }`}
        >
          {item.title}
        </h4>
        <span className="ui-label mt-1 inline-flex w-fit items-center gap-1.5 text-accent transition-all duration-300 group-hover:gap-2.5">
          {learnMoreLabel}
          <span
            aria-hidden
            className="inline-block translate-y-[-0.5px] transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </>
  );

  const cardClassName = `surface-card-soft group relative overflow-hidden transition-colors duration-300 hover:border-white/40 ${
    featured ? "h-[320px] min-[900px]:h-[420px]" : "h-[220px]"
  }`;

  if (item.slug) {
    return (
      <motion.article
        className={cardClassName}
        variants={fadeUp}
        transition={smoothTransition}
        whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
      >
        <Link
          href={`/news/${item.slug}`}
          aria-label={item.title}
          className="relative block h-full w-full text-secondary no-underline"
        >
          {content}
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      className={cardClassName}
      variants={fadeUp}
      transition={smoothTransition}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
    >
      {content}
    </motion.article>
  );
}

function RelatedNewsShowcase({
  items,
  heading,
  learnMoreLabel,
}: RelatedNewsShowcaseProps) {
  if (items.length === 0) return null;

  // 1–2 items: render as normal-sized cards in a max-width grid so the section
  // doesn't blow up into a single huge banner. Keeps a consistent reading
  // rhythm whether the driver has 1, 2, or many attached articles.
  if (items.length <= 2) {
    return (
      <div className="grid gap-4">
        <div className="flex items-center gap-4">
          <h3 className="display-card m-0 text-[clamp(22px,2vw,30px)] text-white">{heading}</h3>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <motion.div
          className={`grid gap-4 ${items.length === 2 ? "min-[680px]:grid-cols-2" : "max-w-[480px]"}`}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {items.map((item) => (
            <RelatedNewsShowcaseCard
              key={item.slug || item.title}
              item={item}
              learnMoreLabel={learnMoreLabel}
            />
          ))}
        </motion.div>
      </div>
    );
  }

  const [featuredItem, ...secondaryItems] = items;

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-4">
        <h3 className="display-card m-0 text-[clamp(22px,2vw,30px)] text-white">{heading}</h3>
        <div className="h-px flex-1 bg-white/10" />
      </div>
      <motion.div
        className="grid gap-4 min-[900px]:grid-cols-12"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <div className="min-[900px]:col-span-7">
          <RelatedNewsShowcaseCard item={featuredItem} featured learnMoreLabel={learnMoreLabel} />
        </div>
        <div className="grid gap-4 min-[900px]:col-span-5">
          {secondaryItems.map((item) => (
            <RelatedNewsShowcaseCard
              key={item.slug || item.title}
              item={item}
              learnMoreLabel={learnMoreLabel}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function DriverDetailTop({ driver, detail }: DriverDetailTopProps) {
  const t = useTranslations("drivers.detail");
  const tNewsCard = useTranslations("news.card");
  const isFeatured = FEATURED_SLUGS.has(driver.slug);

  // Profile image: CMS field first, then driver grid image, then (only for Gasly) the legacy asset.
  const profileImage =
    detail.profileImage ||
    driver.image ||
    (driver.slug === "pierre-gasly" ? LEGACY_GASLY_IMAGES.profile : driver.image);

  // Gallery: resolve carousel images (new array field + legacy 3-col fallback + Gasly hard-coded fallback).
  const detailWithGaslyFallback =
    driver.slug === "pierre-gasly" &&
    !detail.galleryImages?.length &&
    !detail.galleryLeft &&
    !detail.galleryCenter &&
    !detail.galleryRight
      ? {
          ...detail,
          galleryLeft: LEGACY_GASLY_IMAGES.galleryLeft,
          galleryCenter: LEGACY_GASLY_IMAGES.galleryCenter,
          galleryRight: LEGACY_GASLY_IMAGES.galleryRight,
        }
      : detail;
  const galleryImages = resolveGalleryImages(detailWithGaslyFallback);
  const hasGallery = galleryImages.length > 0;

  const relatedNews = detail.relatedNews ?? [];
  const hasRelatedNews = relatedNews.length > 0;

  // Featured split view (gallery + latest news) only when the driver is featured
  // AND the CMS has media to show. Otherwise fall back to the compact two-column layout.
  const showFeaturedSplit = isFeatured && (hasGallery || hasRelatedNews);

  if (!showFeaturedSplit) {
    return (
      <section className="grid gap-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ ...smoothTransition, delay: 0.2 }}
          className="max-w-3xl"
        >
          <h2 className="display-card m-0 text-[clamp(26px,2.6vw,34px)] text-white">{detail.profileTitle}</h2>
          <div className="body-md mt-4 space-y-3 text-white/82">
            {detail.profileParagraphs.map((paragraph, index) => (
              <p key={`${detail.slug}-profile-${index}`} className="m-0">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>
        {hasRelatedNews ? (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ ...smoothTransition, delay: 0.25 }}
          >
            <RelatedNewsShowcase
              items={relatedNews}
              heading={t("latestNews")}
              learnMoreLabel={tNewsCard("learnMore")}
            />
          </motion.div>
        ) : null}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-2 gap-12 max-[1200px]:grid-cols-1">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ ...smoothTransition, delay: 0.2 }}
        className="pr-8 max-[1200px]:pr-0"
      >
        <h2 className="display-card m-0 text-[clamp(26px,2.6vw,34px)] text-white">{detail.profileTitle}</h2>
        <div className="body-md mt-4 space-y-3 text-white/82">
          {detail.profileParagraphs.map((paragraph, index) => (
            <p key={`${detail.slug}-profile-${index}`} className="m-0">
              {paragraph}
            </p>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="grid gap-5"
        variants={slideInRight}
        initial="hidden"
        animate="visible"
        transition={{ ...smoothTransition, delay: 0.15 }}
      >
        {hasGallery ? (
          <DriverGalleryCarousel
            images={galleryImages}
            prevLabel={t("gallery.prev")}
            nextLabel={t("gallery.next")}
          />
        ) : null}

        {hasRelatedNews ? (
          <RelatedNewsShowcase
            items={relatedNews}
            heading={t("latestNews")}
            learnMoreLabel={tNewsCard("learnMore")}
          />
        ) : null}
      </motion.div>
    </section>
  );
}
