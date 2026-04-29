"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { DriverDetailData } from "../driversData";
import {
  motion,
  slideInLeft,
  slideInRight,
  smoothTransition,
  viewport,
} from "../../motion";

const LEGACY_AGENCY_IMAGE = "/images/drivers/detail-agency-image.webp";

type DriverDetailAgencyProps = {
  detail: DriverDetailData;
};

export default function DriverDetailAgency({ detail }: DriverDetailAgencyProps) {
  const t = useTranslations("drivers.detail.agency");

  const agencyImage =
    detail.agencyImage ||
    (detail.slug === "pierre-gasly" ? LEGACY_AGENCY_IMAGE : null);

  return (
    <section
      className={`grid gap-10 max-[1200px]:grid-cols-1 ${
        agencyImage ? "grid-cols-[888px_1fr]" : "grid-cols-1"
      }`}
    >
      {agencyImage ? (
        <motion.div
          className="relative min-h-[clamp(360px,55vh,546px)] overflow-hidden"
          variants={slideInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={smoothTransition}
        >
          <motion.div
            className="relative h-full w-full"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Image
              src={agencyImage}
              alt={t("imageAlt")}
              fill
              className="object-cover"
              style={detail.agencyImageFocalPoint ? { objectPosition: detail.agencyImageFocalPoint } : undefined}
              sizes="(max-width: 1200px) 100vw, 888px"
            />
          </motion.div>
        </motion.div>
      ) : null}
      <motion.div
        variants={slideInRight}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        transition={{ ...smoothTransition, delay: 0.15 }}
      >
        <h2 className="m-0 text-2xl leading-[1.2] font-bold uppercase">{detail.agencyTitle}</h2>
        <div className="mt-4 space-y-4 text-base leading-[1.4] font-light">
          {detail.agencyParagraphs.map((paragraph, index) => (
            <p key={`${detail.slug}-agency-${index}`} className="m-0">
              {paragraph}
            </p>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
