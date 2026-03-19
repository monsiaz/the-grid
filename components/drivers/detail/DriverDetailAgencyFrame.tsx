import Image from "next/image";
import type { DriverDetailData } from "../driversData";
import { detailImages } from "../driversData";

type DriverDetailAgencyFrameProps = {
  detail: DriverDetailData;
};

export default function DriverDetailAgencyFrame({ detail }: DriverDetailAgencyFrameProps) {
  return (
    <section className="grid grid-cols-[888px_1fr] gap-10 max-[1200px]:grid-cols-1">
      <div className="relative min-h-[546px] max-[1200px]:min-h-[420px]">
        <Image src={detailImages.agency} alt="Driver and agency" fill className="object-cover" sizes="(max-width: 1200px) 100vw, 888px" />
      </div>
      <div>
        <h2 className="m-0 text-2xl leading-[1.2] font-bold uppercase">{detail.agencyTitle}</h2>
        <div className="mt-4 space-y-4 text-base leading-[1.4] font-light">
          {detail.agencyParagraphs.map((paragraph, index) => (
            <p key={`${detail.slug}-agency-${index}`} className="m-0">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
