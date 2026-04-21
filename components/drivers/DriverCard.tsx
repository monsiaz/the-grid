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
      className={`bg-primary border-secondary group flex flex-col overflow-hidden rounded-[32px] border transition-transform duration-300 ease-out hover:-translate-y-2 ${
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
            <h2 className="m-0 text-xl leading-[1.2] font-bold uppercase">{driver.name}</h2>
            <p className="m-0 mt-0.5 text-[12px] leading-[1.2] uppercase">{driver.role}</p>
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
            className="text-accent border-accent inline-flex items-center justify-center rounded-full border-2 bg-black/20 px-5 py-3 text-base leading-[1.2] uppercase no-underline transition-all duration-300 hover:bg-accent hover:text-black hover:scale-105"
          >
            {t("learnMore")}<span className="sr-only">{t("learnMoreSr", { name: driver.name })}</span>
          </Link>
          <Link
            href={driver.instagramUrl}
            target="_blank"
            rel="noreferrer me"
            aria-label={t("instagramLabel", { name: driver.name })}
            className="inline-flex h-11 w-11 items-center justify-center text-lg uppercase no-underline transition-transform duration-300 hover:scale-110"
          >
            <Image src="/images/instagram.svg" alt="" width={24} height={24} aria-hidden unoptimized loading="lazy" />
          </Link>
        </div>
      </div>
    </article>
  );
}
