import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import DriverFlags from "./DriverFlags";
import type { DriverCardData } from "./driversData";

type DriverCardProps = {
  driver: DriverCardData;
  compact?: boolean;
};

export default async function DriverCard({ driver, compact = false }: DriverCardProps) {
  const t = await getTranslations("drivers.card");
  return (
    <article
      className={`surface-card-soft group flex flex-col overflow-hidden transition-transform duration-300 ease-out hover:-translate-y-2 ${
        compact ? "min-h-[460px]" : "min-h-[488px]"
      } max-[900px]:min-h-0`}
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={driver.image}
          alt={driver.name}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          sizes="(max-width: 700px) 100vw, (max-width: 1200px) 50vw, (max-width: 1440px) 33vw, 336px"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="display-card m-0 text-[clamp(24px,2vw,30px)] text-white">{driver.name}</h2>
            <p className="ui-label m-0 mt-1 text-secondary/70">{driver.role}</p>
          </div>
          <ul className="mt-1 flex list-none items-center gap-1 p-0" aria-label={t("nationalities")}>
            <DriverFlags
              codes={driver.flags}
              keyPrefix={`${driver.slug}-flag`}
              className="h-4 w-[26px] shrink-0 overflow-hidden rounded-sm"
              wrapper="li"
            />
          </ul>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Link
            href={`/drivers/${driver.slug}`}
            className="pill-button pill-button-accent-outline"
          >
            {t("learnMore")}<span className="sr-only">{t("learnMoreSr", { name: driver.name })}</span>
          </Link>
          <Link
            href={driver.instagramUrl}
            target="_blank"
            rel="noreferrer me"
            aria-label={t("instagramLabel", { name: driver.name })}
            className="pill-button pill-button-outline h-11 min-h-11 w-11 px-0 text-lg no-underline"
          >
            <svg aria-hidden viewBox="0 0 24 24" style={{width:20,height:20,display:"block",flexShrink:0}} fill="none" stroke="white" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="0.5" fill="white" stroke="none"/>
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
