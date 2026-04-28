import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import DriverFlags from "./DriverFlags";
import type { DriverCardData } from "./driversData";

type DriverCardProps = {
  driver: DriverCardData;
};

export default async function DriverCard({ driver }: DriverCardProps) {
  const t = await getTranslations("drivers.card");
  return (
    <article className="group relative aspect-[16/7] w-full overflow-hidden rounded-lg max-[500px]:aspect-[16/10]">
      {/* Background photo */}
      <Image
        src={driver.image}
        alt={driver.name}
        fill
        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        sizes="(max-width: 700px) 100vw, (max-width: 1400px) 50vw, 660px"
      />

      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

      {/* Flags — top right */}
      <ul
        className="absolute right-5 top-5 m-0 flex list-none items-center gap-1 p-0"
        aria-label={t("nationalities")}
      >
        <DriverFlags
          codes={driver.flags}
          keyPrefix={`${driver.slug}-flag`}
          className="h-4 w-[26px] shrink-0 overflow-hidden rounded-sm"
          wrapper="li"
        />
      </ul>

      {/* Content — bottom overlay */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-6 max-[500px]:p-4">
        <div className="min-w-0">
          {driver.teamLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={driver.teamLogo}
              alt=""
              aria-hidden
              className="mb-2 h-5 w-auto max-w-[72px] object-contain"
              style={{ filter: "brightness(0) invert(1)", opacity: 0.8 }}
            />
          ) : null}
          <h2 className="display-card m-0 truncate text-[clamp(20px,2.2vw,32px)] leading-none text-white">
            {driver.name}
          </h2>
          <p className="ui-label m-0 mt-1.5 line-clamp-2 text-white/65 max-[500px]:hidden">
            {driver.role}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={`/drivers/${driver.slug}`}
            className="pill-button pill-button-accent-outline whitespace-nowrap"
          >
            {t("learnMore")}
            <span className="sr-only">{t("learnMoreSr", { name: driver.name })}</span>
          </Link>
          <Link
            href={driver.instagramUrl}
            target="_blank"
            rel="noreferrer me"
            aria-label={t("instagramLabel", { name: driver.name })}
            className="pill-button pill-button-outline h-11 min-h-11 w-11 px-0 text-lg no-underline"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              style={{ width: 20, height: 20, display: "block", flexShrink: 0 }}
              fill="none"
              stroke="white"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="white" stroke="none" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
