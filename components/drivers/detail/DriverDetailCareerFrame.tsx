import Image from "next/image";
import type { DriverDetailData } from "../driversData";
import { detailImages } from "../driversData";

type DriverDetailCareerFrameProps = {
  detail: DriverDetailData;
};

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-accent m-0 text-[100px] leading-none font-bold uppercase">{value}</p>
      <p className="m-0 mt-1 text-xl leading-[1.2] font-bold uppercase">{label}</p>
    </div>
  );
}

export default function DriverDetailCareerFrame({ detail }: DriverDetailCareerFrameProps) {
  return (
    <section className="grid grid-cols-3 gap-10 max-[1200px]:grid-cols-1">
      <div>
        <h2 className="m-0 text-2xl leading-[1.2] font-bold uppercase">{detail.careerTitle}</h2>
        <div className="mt-4 space-y-4 text-base leading-[1.4] font-light">
          {detail.careerParagraphs.map((paragraph, index) => (
            <p key={`${detail.slug}-career-${index}`} className="m-0">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="relative min-h-[730px] max-[1200px]:min-h-[520px]">
        <Image src={detailImages.career} alt="Career highlight" fill className="object-cover" sizes="(max-width: 1200px) 100vw, 33vw" />
      </div>

      <div>
        <h2 className="m-0 text-2xl leading-[1.2] font-bold uppercase">{detail.transitionTitle}</h2>
        <p className="m-0 mt-4 text-base leading-[1.4] font-light">{detail.transitionParagraph}</p>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8">
          <StatItem value={detail.highestFinish} label="Highest race finish" />
          <StatItem value={detail.careerPoints} label="Career points" />
          <StatItem value={detail.grandPrixEntered} label="Grand prix entered" />
          <StatItem value={detail.careerPodiums} label="Career podiums" />
        </div>
      </div>
    </section>
  );
}
