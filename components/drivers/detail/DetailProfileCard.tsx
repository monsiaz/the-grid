"use client";

import Image from "next/image";
import Link from "next/link";
import DriverFlags from "../DriverFlags";
import type { DriverCardData } from "../driversData";
import { motion } from "../../motion";

type DetailProfileCardProps = {
  driver: DriverCardData;
  image: string;
};

export default function DetailProfileCard({ driver, image }: DetailProfileCardProps) {
  return (
    <article className="bg-primary border-secondary flex h-full w-full max-w-[318px] flex-col overflow-hidden rounded-[32px] border">
      <div className="relative flex-1 overflow-hidden">
        <motion.div
          className="relative h-full w-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Image src={image} alt={driver.name} fill className="object-cover" sizes="(max-width: 900px) 100vw, 318px" />
        </motion.div>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="m-0 text-xl leading-[1.2] font-bold uppercase">{driver.name}</h2>
            <p className="m-0 mt-0.5 text-[12px] leading-[1.2] uppercase">{driver.role}</p>
          </div>
          <ul className="mt-1 flex list-none items-center gap-1 p-0" aria-label="Nationalities">
            <DriverFlags
              codes={driver.flags}
              keyPrefix={`${driver.slug}-detail-flag`}
              className="h-4 w-[26px] shrink-0 overflow-hidden rounded-sm"
              wrapper="li"
            />
          </ul>
        </div>
        <Link
          href={driver.instagramUrl}
          target="_blank"
          rel="noreferrer me"
          aria-label={`Follow ${driver.name} on Instagram (opens in new tab)`}
          className="mt-4 inline-flex h-11 min-w-[44px] items-center justify-center rounded-full text-lg uppercase no-underline transition-transform duration-300 hover:scale-110"
        >
          <span aria-hidden>IG</span>
        </Link>
      </div>
    </article>
  );
}
