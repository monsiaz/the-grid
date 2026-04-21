"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { DriverCardData, DriverDetailData } from "../driversData";

const detailImages = {
  profile: "/images/drivers/detail-profile-gasly.webp",
  career: "/images/drivers/detail-career-image.webp",
  agency: "/images/drivers/detail-agency-image.webp",
};

const detailGallery = {
  left: "/images/drivers/detail-gallery-left.webp",
  center: "/images/drivers/detail-gallery-main.webp",
  right: "/images/drivers/detail-gallery-right.webp",
};

const detailNews = [
  { title: "PIERRE GASLY'S ABU DHABI SPECIAL HELMET", image: "/images/drivers/detail-news-1.webp" },
  { title: "SPECIAL HELMET DESIGN FOR PIERRE GASLY IN BRAZIL", image: "/images/drivers/detail-news-2.webp" },
  { title: "PIERRE GASLY X H. MOSER & CIE: AN EXCLUSIVE TIMEPIECE", image: "/images/drivers/detail-news-3.webp" },
];
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

type DriverDetailTopProps = {
  driver: DriverCardData;
  detail: DriverDetailData;
};

const FEATURED_SLUGS = new Set(["pierre-gasly", "isack-hadjar"]);

export default function DriverDetailTop({ driver, detail }: DriverDetailTopProps) {
  const t = useTranslations("drivers.detail");
  const isFeatured = FEATURED_SLUGS.has(driver.slug);

  if (!isFeatured) {
    return (
      <section className="grid grid-cols-[320px_1fr] gap-10 max-[900px]:grid-cols-1">
        <motion.div
          variants={slideInLeft}
          initial="hidden"
          animate="visible"
          transition={smoothTransition}
          className="max-[900px]:mx-auto"
        >
          <DetailProfileCard driver={driver} image={driver.image} compact />
        </motion.div>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ ...smoothTransition, delay: 0.2 }}
        >
          <h2 className="m-0 text-xl leading-[1.2] font-bold uppercase">{detail.profileTitle}</h2>
          <div className="mt-3 space-y-3 text-[15px] leading-[1.45] font-light">
            {detail.profileParagraphs.map((paragraph, index) => (
              <p key={`${detail.slug}-profile-${index}`} className="m-0">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-2 gap-8 max-[1200px]:grid-cols-1">
      <div className="grid grid-cols-[280px_1fr] gap-8 max-[700px]:grid-cols-1">
        <motion.div
          variants={slideInLeft}
          initial="hidden"
          animate="visible"
          transition={smoothTransition}
        >
          <DetailProfileCard driver={driver} image={detailImages.profile} />
        </motion.div>
        <motion.div
          className="grid grid-cols-[1fr_2px] gap-3 overflow-hidden max-[700px]:grid-cols-1"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ ...smoothTransition, delay: 0.2 }}
        >
          <div>
            <h2 className="m-0 text-xl leading-[1.2] font-bold uppercase">{detail.profileTitle}</h2>
            <div className="mt-3 space-y-3 text-[15px] leading-[1.45] font-light">
              {detail.profileParagraphs.map((paragraph, index) => (
                <p key={`${detail.slug}-profile-${index}`} className="m-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <div className="bg-white/10 max-[700px]:hidden">
            <div className="bg-soft h-[160px] w-full" />
          </div>
        </motion.div>
      </div>

      <motion.div
        className="grid gap-6"
        variants={slideInRight}
        initial="hidden"
        animate="visible"
        transition={{ ...smoothTransition, delay: 0.15 }}
      >
        <div className="grid gap-2">
          <div className="grid grid-cols-[100px_1fr_100px] items-center max-[700px]:grid-cols-1">
            <div className="relative h-[140px] opacity-50 max-[700px]:hidden">
              <Image
                src={detailGallery.left}
                alt={t("gallery.left")}
                fill
                className="object-cover"
                sizes="100px"
              />
            </div>
            <div className="relative h-[260px] overflow-hidden">
              <motion.div
                className="relative h-full w-full"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <Image
                  src={detailGallery.center}
                  alt={t("gallery.center")}
                  fill
                  className="object-cover"
                  sizes="(max-width: 700px) 100vw, 420px"
                />
              </motion.div>
            </div>
            <div className="relative h-[140px] opacity-50 max-[700px]:hidden">
              <Image
                src={detailGallery.right}
                alt={t("gallery.right")}
                fill
                className="object-cover"
                sizes="100px"
              />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-[22px] leading-[1.2]" aria-hidden>
            <ChevronLeft className="h-[1em] w-[1em] shrink-0" />
            <ChevronRight className="h-[1em] w-[1em] shrink-0" />
          </div>
        </div>

        <div>
          <h3 className="m-0 text-xl leading-[1.2] font-bold uppercase">{t("latestNews")}</h3>
          <motion.div
            className="mt-4 grid grid-cols-3 gap-5 max-[900px]:grid-cols-1"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {detailNews.map((item) => (
              <motion.article
                key={item.title}
                className="bg-primary border-secondary flex flex-col overflow-hidden rounded-[32px] border max-[900px]:min-h-[220px]"
                variants={fadeUp}
                transition={smoothTransition}
                whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
              >
                <div className="relative min-h-[216px] flex-1 overflow-hidden">
                  <motion.div
                    className="relative h-full w-full"
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width: 900px) 100vw, 204px" />
                  </motion.div>
                </div>
                <div className="bg-primary p-5">
                  <h4 className="m-0 text-base leading-[1.2] font-medium uppercase">{item.title}</h4>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
