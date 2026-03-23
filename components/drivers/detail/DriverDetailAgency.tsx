"use client";

import Image from "next/image";
import type { DriverDetailData } from "../driversData";
import { detailImages } from "../driversData";
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
  return (
    <section className="grid grid-cols-[888px_1fr] gap-10 max-[1200px]:grid-cols-1">
      <motion.div
        className="relative min-h-[546px] overflow-hidden max-[1200px]:min-h-[420px]"
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
          <Image src={detailImages.agency} alt="Driver and agency" fill className="object-cover" sizes="(max-width: 1200px) 100vw, 888px" />
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
