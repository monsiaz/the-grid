"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
type DriverDetailData = {
  slug: string;
  profileTitle: string;
  profileParagraphs: string[];
  careerTitle: string;
  careerParagraphs: string[];
  transitionTitle: string;
  transitionParagraph: string;
  agencyTitle: string;
  agencyParagraphs: string[];
  highestFinish: string;
  careerPoints: string;
  grandPrixEntered: string;
  careerPodiums: string;
};

const detailImages = {
  profile: "/images/drivers/detail-profile-gasly.webp",
  career: "/images/drivers/detail-career-image.webp",
  agency: "/images/drivers/detail-agency-image.webp",
};
import {
  motion,
  fadeUp,
  slideInLeft,
  slideInRight,
  smoothTransition,
  viewport,
} from "../../motion";

type DriverDetailAgencyProps = {
  detail: DriverDetailData;
};

export default function DriverDetailAgency({ detail }: DriverDetailAgencyProps) {
  const t = useTranslations("drivers.detail.agency");
  return (
    <section className="grid grid-cols-[888px_1fr] gap-10 max-[1200px]:grid-cols-1">
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
          <Image src={detailImages.agency} alt={t("imageAlt")} fill className="object-cover" sizes="(max-width: 1200px) 100vw, 888px" />
        </motion.div>
      </motion.div>
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
