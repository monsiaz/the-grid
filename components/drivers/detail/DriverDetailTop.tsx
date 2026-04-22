"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { DriverCardData, DriverDetailData, DriverRelatedNews } from "../driversData";
import DetailProfileCard from "./DetailProfileCard";
import {
  motion,
  fadeUp,
  slideInLeft,
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

  const [featuredItem, ...secondaryItems] = items;

  if (secondaryItems.length === 0) {
    return (
      <div className="grid gap-4">
        <div className="flex items-center gap-4">
          <h3 className="display-card m-0 text-[clamp(22px,2vw,30px)] text-white">{heading}</h3>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <motion.div
          className="grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <RelatedNewsShowcaseCard item={featuredItem} featured learnMoreLabel={learnMoreLabel} />
        </motion.div>
      </div>
    );
  }

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

  // Gallery: only show the inline gallery when the CMS has at least a center image.
  const hasGallery = Boolean(
    detail.galleryCenter || detail.galleryLeft || detail.galleryRight,
  );
  const galleryCenter =
    detail.galleryCenter ||
    (driver.slug === "pierre-gasly" ? LEGACY_GASLY_IMAGES.galleryCenter : null);
  const galleryLeft =
    detail.galleryLeft ||
    (driver.slug === "pierre-gasly" ? LEGACY_GASLY_IMAGES.galleryLeft : null);
  const galleryRight =
    detail.galleryRight ||
    (driver.slug === "pierre-gasly" ? LEGACY_GASLY_IMAGES.galleryRight : null);

  const relatedNews = detail.relatedNews ?? [];
  const hasRelatedNews = relatedNews.length > 0;

  // Featured split view (gallery + latest news) only when the driver is featured
  // AND the CMS has media to show. Otherwise fall back to the compact two-column layout.
  const showFeaturedSplit = isFeatured && (hasGallery || hasRelatedNews);

  if (!showFeaturedSplit) {
    return (
      <section className="grid gap-8">
        <div className="grid grid-cols-[300px_1fr] items-start gap-8 max-[900px]:grid-cols-1">
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            animate="visible"
            transition={smoothTransition}
            className="max-[900px]:mx-auto"
          >
            <DetailProfileCard driver={driver} image={profileImage} compact />
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ ...smoothTransition, delay: 0.2 }}
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
        </div>
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
    <section className="grid grid-cols-2 gap-6 max-[1200px]:grid-cols-1">
      <div className="grid grid-cols-[260px_1fr] gap-6 max-[700px]:grid-cols-1">
        <motion.div
          variants={slideInLeft}
          initial="hidden"
          animate="visible"
          transition={smoothTransition}
        >
          <DetailProfileCard driver={driver} image={profileImage} />
        </motion.div>
        <motion.div
          className="grid grid-cols-[1fr_2px] gap-3 overflow-hidden max-[700px]:grid-cols-1"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ ...smoothTransition, delay: 0.2 }}
        >
          <div>
            <h2 className="display-card m-0 text-[clamp(26px,2.6vw,34px)] text-white">{detail.profileTitle}</h2>
            <div className="body-md mt-4 space-y-3 text-white/82">
              {detail.profileParagraphs.map((paragraph, index) => (
                <p key={`${detail.slug}-profile-${index}`} className="m-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <div className="bg-white/10 max-[700px]:hidden">
            <div className="bg-soft h-[140px] w-full" />
          </div>
        </motion.div>
      </div>

      <motion.div
        className="grid gap-5"
        variants={slideInRight}
        initial="hidden"
        animate="visible"
        transition={{ ...smoothTransition, delay: 0.15 }}
      >
        {hasGallery && galleryCenter ? (
          <div className="grid gap-2">
            <div className="grid grid-cols-[90px_1fr_90px] items-center max-[700px]:grid-cols-1">
              <div className="relative h-[120px] opacity-50 max-[700px]:hidden">
                {galleryLeft ? (
                  <Image
                    src={galleryLeft}
                    alt={t("gallery.left")}
                    fill
                    className="object-cover"
                    sizes="90px"
                  />
                ) : null}
              </div>
              <div className="relative h-[220px] overflow-hidden">
                <motion.div
                  className="relative h-full w-full"
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Image
                    src={galleryCenter}
                    alt={t("gallery.center")}
                    fill
                    className="object-cover"
                    sizes="(max-width: 700px) 100vw, 420px"
                  />
                </motion.div>
              </div>
              <div className="relative h-[120px] opacity-50 max-[700px]:hidden">
                {galleryRight ? (
                  <Image
                    src={galleryRight}
                    alt={t("gallery.right")}
                    fill
                    className="object-cover"
                    sizes="90px"
                  />
                ) : null}
              </div>
            </div>
            <div
              className="flex items-center justify-center gap-2 text-[20px] leading-[1.2]"
              aria-hidden
            >
              <ChevronLeft className="h-[1em] w-[1em] shrink-0" />
              <ChevronRight className="h-[1em] w-[1em] shrink-0" />
            </div>
          </div>
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
