import Image from "next/image";
import Link from "next/link";
import DriverFlags from "../DriverFlags";
import type { DriverCardData } from "../driversData";

type DetailProfileCardFrameProps = {
  driver: DriverCardData;
  image: string;
};

export default function DetailProfileCardFrame({ driver, image }: DetailProfileCardFrameProps) {
  return (
    <article className="bg-primary border-secondary flex h-full w-full max-w-[318px] flex-col overflow-hidden rounded-[32px] border">
      <div className="relative flex-1">
        <Image src={image} alt={driver.name} fill className="object-cover" sizes="(max-width: 900px) 100vw, 318px" />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="m-0 text-xl leading-[1.2] font-bold uppercase">{driver.name}</h2>
            <p className="m-0 mt-0.5 text-[12px] leading-[1.2] uppercase">{driver.role}</p>
          </div>
          <div className="mt-1 flex items-center gap-1" aria-label="Nationalities">
            <DriverFlags
              codes={driver.flags}
              keyPrefix={`${driver.slug}-detail-flag`}
              className="h-4 w-[26px] shrink-0 overflow-hidden rounded-sm"
            />
          </div>
        </div>
        <Link
          href={driver.instagramUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`${driver.name} Instagram`}
          className="mt-4 inline-flex h-8 w-8 items-center justify-center text-lg uppercase no-underline"
        >
          IG
        </Link>
      </div>
    </article>
  );
}
