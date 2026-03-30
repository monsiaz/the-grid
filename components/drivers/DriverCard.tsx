"use client";

import Image from "next/image";
import Link from "next/link";
import DriverFlags from "./DriverFlags";
import type { DriverCardData } from "./driversData";
import { motion, fadeUp, smoothTransition } from "../motion";

type DriverCardProps = {
  driver: DriverCardData;
  compact?: boolean;
};

export default function DriverCard({ driver, compact = false }: DriverCardProps) {
  return (
    <motion.article
      className={`bg-primary border-secondary flex flex-col overflow-hidden rounded-[32px] border ${
        compact ? "min-h-[460px]" : "min-h-[488px]"
      } max-[900px]:min-h-0`}
      variants={fadeUp}
      transition={smoothTransition}
      whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <motion.div
          className="relative h-full w-full"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Image src={driver.image} alt={driver.name} fill className="object-cover" sizes="(max-width: 900px) 100vw, 25vw" />
        </motion.div>
      </div>
      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="m-0 text-xl leading-[1.2] font-bold uppercase">{driver.name}</h3>
            <p className="m-0 mt-0.5 text-[12px] leading-[1.2] uppercase">{driver.role}</p>
          </div>
          <div className="mt-1 flex items-center gap-1" aria-label="Nationalities">
            <DriverFlags
              codes={driver.flags}
              keyPrefix={`${driver.slug}-flag`}
              className="h-4 w-[26px] shrink-0 overflow-hidden rounded-sm"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Link
            href={`/drivers/${driver.slug}`}
            className="text-accent border-accent inline-flex items-center justify-center rounded-full border-2 bg-black/20 px-5 py-3 text-base leading-[1.2] uppercase no-underline transition-all duration-300 hover:bg-accent hover:text-black hover:scale-105"
          >
            Learn more
          </Link>
          <Link
            href={driver.instagramUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`${driver.name} Instagram`}
            className="inline-flex h-8 w-8 items-center justify-center text-lg uppercase no-underline transition-transform duration-300 hover:scale-110"
          >
            <Image src="/images/instagram.svg" alt="Instagram" width={24} height={24} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
