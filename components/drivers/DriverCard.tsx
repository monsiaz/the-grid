import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import DriverFlags from "./DriverFlags";
import TeamLogo from "./TeamLogo";
import type { DriverCardData } from "./driversData";
import { resolveTeamLogos } from "./driversData";

type DriverCardProps = {
  driver: DriverCardData;
  compact?: boolean;
};

export default async function DriverCard({ driver, compact = false }: DriverCardProps) {
  const t = await getTranslations("drivers.card");
  const logos = resolveTeamLogos(driver);
  return (
    <article
      className={`surface-card-soft group flex flex-col overflow-hidden transition-transform duration-300 ease-out hover:-translate-y-2 ${
        compact ? "min-h-[460px]" : "min-h-[488px]"
      } max-[900px]:min-h-0`}
    >
      <Link
        href={`/drivers/${driver.slug}`}
        aria-label={t("learnMoreSr", { name: driver.name })}
        className="relative block aspect-square w-full overflow-hidden"
      >
        <Image
          src={driver.image}
          alt={driver.name}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          style={driver.imageFocalPoint ? { objectPosition: driver.imageFocalPoint } : undefined}
          sizes="(max-width: 700px) 100vw, (max-width: 1200px) 50vw, (max-width: 1440px) 33vw, 336px"
        />
      </Link>
      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 flex flex-col">
            <h2
              className="display-card m-0 line-clamp-2 text-white"
              style={{ fontSize: "clamp(22px,2vw,28px)", lineHeight: 1.15 }}
            >
              {driver.name}
            </h2>
            <p className="m-0 mt-1.5 text-white/60 uppercase line-clamp-2" style={{ fontFamily: "var(--font-poppins), sans-serif", fontSize: "clamp(10px, 0.9vw, 12px)", letterSpacing: "0.15em", lineHeight: 1.4, minHeight: "2.8em" }}>{driver.role}</p>
            <div className="mt-4 flex items-center justify-start gap-2 h-[24px]">
              {logos.map((src, i) => (
                <TeamLogo key={`${driver.slug}-logo-${i}`} src={src} variant="card" />
              ))}
            </div>
          </div>
          <ul className="flex list-none items-center gap-1 p-0 m-0 shrink-0 mt-1.5" aria-label={t("nationalities")}>
            <DriverFlags
              codes={driver.flags}
              keyPrefix={`${driver.slug}-flag`}
              className="h-[18px] w-[28px] overflow-hidden rounded-sm"
              wrapper="li"
            />
          </ul>
        </div>
        <div className="mt-6 flex items-center justify-between gap-3">
          {driver.instagramUrl ? (
            <Link
              href={driver.instagramUrl}
              target="_blank"
              rel="noreferrer me"
              aria-label={t("instagramLabel", { name: driver.name })}
              className="text-white hover:text-white/80 transition-colors shrink-0"
            >
              <svg aria-hidden viewBox="0 0 24 24" style={{ width: 22, height: 22, display: "block" }} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
              </svg>
            </Link>
          ) : <div />}
          <Link
            href={`/drivers/${driver.slug}`}
            className="pill-button pill-button-accent-outline"
          >
            {t("learnMore")}
            <span className="sr-only">{t("learnMoreSr", { name: driver.name })}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
