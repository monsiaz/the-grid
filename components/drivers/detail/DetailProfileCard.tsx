"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import DriverFlags from "../DriverFlags";
import type { DriverCardData } from "../driversData";
import { motion } from "../../motion";

type DetailProfileCardProps = {
  driver: DriverCardData;
  image: string;
  compact?: boolean;
};

const FALLBACK_AGENCY_INSTAGRAM = "https://www.instagram.com/thegrid.agency";

export default function DetailProfileCard({ driver, image, compact = false }: DetailProfileCardProps) {
  const t = useTranslations("drivers.card");
  // compact → fixed 260px media (listing + non-featured layouts).
  // non-compact → `flex-1` to fill the outer grid row on desktop, plus a
  // `min-h-[320px]` floor so the image still shows up on mobile/tablet where
  // the parent grid row collapses to the card's intrinsic height (otherwise
  // `flex-1` resolves to 0 and the profile photo disappears). The floor is
  // lifted above 700px so the desktop flex-fill behaviour is preserved.
  const mediaHeight = compact
    ? "h-[260px]"
    : "min-h-[320px] flex-1 min-[700px]:min-h-0";

  const instagramHref =
    (driver.instagramUrl && driver.instagramUrl.trim()) || FALLBACK_AGENCY_INSTAGRAM;
  const isOwnInstagram = instagramHref !== FALLBACK_AGENCY_INSTAGRAM;

  return (
    <article
      className={`surface-card-soft flex w-full max-w-[318px] flex-col overflow-hidden ${compact ? "" : "h-full"}`}
    >
      <div className={`relative ${mediaHeight} overflow-hidden`}>
        <motion.div
          className="relative h-full w-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Image
            src={image}
            alt={driver.name}
            fill
            className="object-cover"
            sizes="(max-width: 900px) 100vw, 318px"
            priority
          />
        </motion.div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="display-card m-0 text-lg text-white">{driver.name}</h2>
            <p className="ui-label m-0 mt-1 text-secondary/70">{driver.role}</p>
          </div>
          <ul className="mt-1 flex list-none items-center gap-1 p-0" aria-label={t("nationalities")}>
            <DriverFlags
              codes={driver.flags}
              keyPrefix={`${driver.slug}-detail-flag`}
              className="h-4 w-[26px] shrink-0 overflow-hidden rounded-sm"
              wrapper="li"
            />
          </ul>
        </div>
        {isOwnInstagram ? (
          <Link
            href={instagramHref}
            target="_blank"
            rel="noreferrer me"
            aria-label={t("instagramLabel", { name: driver.name })}
            className="pill-button pill-button-outline mt-3 h-10 min-h-10 w-10 px-0 text-secondary"
          >
            <svg aria-hidden viewBox="0 0 24 24" style={{width:18,height:18,display:"block",flexShrink:0}} fill="none" stroke="white" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="0.5" fill="white" stroke="none"/>
            </svg>
          </Link>
        ) : null}
      </div>
    </article>
  );
}
