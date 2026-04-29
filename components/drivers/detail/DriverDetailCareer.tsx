"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { DriverDetailData } from "../driversData";
import {
  motion,
  fadeUp,
  slideInLeft,
  slideInRight,
  scaleIn,
  staggerContainer,
  smoothTransition,
  viewport,
} from "../../motion";

const LEGACY_CAREER_IMAGE = "/images/drivers/detail-career-image.webp";

type DriverDetailCareerProps = {
  detail: DriverDetailData;
};

const FEATURED_SLUGS = new Set(["pierre-gasly", "isack-hadjar"]);

function StatItem({ value, label, compact = false }: { value: string; label: string; compact?: boolean }) {
  const trimmedValue = value.trim();
  const compactValueClass =
    trimmedValue.length <= 2
      ? "text-[clamp(40px,12vw,96px)]"
      : trimmedValue.length <= 3
        ? "text-[clamp(36px,10vw,82px)]"
        : "text-[clamp(30px,8vw,64px)]";
  return (
    <motion.div variants={fadeUp} transition={smoothTransition}>
      <p
        className={`display-stat text-accent m-0 tabular-nums ${
          compact ? compactValueClass : "text-[clamp(48px,8vw,64px)]"
        }`}
      >
        {value}
      </p>
      <p className={`display-card m-0 mt-2 whitespace-pre-line text-white ${compact ? "text-[clamp(16px,3.2vw,20px)] leading-[1.12]" : "text-xl leading-[1.2]"}`}>
        {label}
      </p>
    </motion.div>
  );
}

function hasStat(value: string): boolean {
  const v = (value ?? "").trim();
  return v !== "" && v !== "--";
}

export default function DriverDetailCareer({ detail }: DriverDetailCareerProps) {
  const t = useTranslations("drivers.detail.career");
  const legacyFeaturedStats =
    FEATURED_SLUGS.has(detail.slug) &&
    hasStat(detail.highestFinish) &&
    hasStat(detail.careerPoints) &&
    hasStat(detail.grandPrixEntered) &&
    hasStat(detail.careerPodiums);
  const customStats = (detail.statsCards ?? []).filter(
    (item) => hasStat(item.value) && hasStat(item.label),
  );
  const showStats = legacyFeaturedStats || customStats.length > 0;

  const careerImage =
    detail.careerImage ||
    (detail.slug === "pierre-gasly" ? LEGACY_CAREER_IMAGE : null);

  return (
    <section className="grid grid-cols-3 gap-10 max-[1200px]:grid-cols-1">
      <motion.div
        variants={slideInLeft}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        transition={smoothTransition}
      >
        <h2 className="display-card m-0 text-[clamp(26px,2.8vw,34px)] text-white">{detail.careerTitle}</h2>
        <div className="body-md mt-4 space-y-4 text-white/82">
          {detail.careerParagraphs.map((paragraph, index) => (
            <p key={`${detail.slug}-career-${index}`} className="m-0">
              {paragraph}
            </p>
          ))}
        </div>
      </motion.div>

      {careerImage ? (
        <motion.div
          className="relative min-h-[clamp(420px,70vh,730px)] overflow-hidden"
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ ...smoothTransition, duration: 0.9 }}
        >
          <Image
            src={careerImage}
            alt={t("imageAlt")}
            fill
            className="rounded-[28px] object-cover"
            style={detail.careerImageFocalPoint ? { objectPosition: detail.careerImageFocalPoint } : undefined}
            sizes="(max-width: 1200px) 100vw, 33vw"
          />
        </motion.div>
      ) : (
        <div className="max-[1200px]:hidden" aria-hidden />
      )}

      <motion.div
        variants={slideInRight}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        transition={smoothTransition}
      >
        <h2 className="display-card m-0 text-[clamp(26px,2.8vw,34px)] text-white">{detail.transitionTitle}</h2>
        <p className="body-md m-0 mt-4 text-white/82">{detail.transitionParagraph}</p>
        {showStats ? (
          legacyFeaturedStats ? (
            <motion.div
              className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <StatItem value={detail.highestFinish} label={t("stats.highestFinish")} />
              <StatItem value={detail.careerPoints} label={t("stats.careerPoints")} />
              <StatItem value={detail.grandPrixEntered} label={t("stats.grandPrixEntered")} />
              <StatItem value={detail.careerPodiums} label={t("stats.careerPodiums")} />
            </motion.div>
          ) : (
            <motion.div
              className="surface-outline mt-8 p-6 min-[700px]:p-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <div className="grid grid-cols-2 gap-x-6 gap-y-8 min-[700px]:gap-x-10 min-[700px]:gap-y-10">
                {customStats.map((item) => (
                  <StatItem key={`${detail.slug}-${item.value}-${item.label}`} value={item.value} label={item.label} compact />
                ))}
              </div>
            </motion.div>
          )
        ) : null}
      </motion.div>
    </section>
  );
}
