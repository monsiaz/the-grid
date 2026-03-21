import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DriverCardData, DriverDetailData } from "../driversData";
import { detailGallery, detailImages, detailNews } from "../driversData";
import DetailProfileCard from "./DetailProfileCard";

type DriverDetailTopProps = {
  driver: DriverCardData;
  detail: DriverDetailData;
};

export default function DriverDetailTop({ driver, detail }: DriverDetailTopProps) {
  return (
    <section className="grid grid-cols-2 gap-10 max-[1200px]:grid-cols-1">
      <div className="grid grid-cols-[318px_1fr] gap-10 max-[700px]:grid-cols-1">
        <DetailProfileCard driver={driver} image={detailImages.profile} />
        <div className="grid grid-cols-[1fr_2px] gap-3 overflow-hidden max-[700px]:grid-cols-1">
          <div>
            <h2 className="m-0 text-2xl leading-[1.2] font-bold uppercase">{detail.profileTitle}</h2>
            <div className="mt-4 space-y-4 text-base leading-[1.4] font-light">
              {detail.profileParagraphs.map((paragraph, index) => (
                <p key={`${detail.slug}-profile-${index}`} className="m-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <div className="bg-white/10 max-[700px]:hidden">
            <div className="bg-soft h-[200px] w-full" />
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="grid grid-cols-[120px_1fr_120px] items-center max-[700px]:grid-cols-1">
            <div className="relative h-[173px] opacity-50 max-[700px]:hidden">
              <Image
                src={detailGallery.left}
                alt="Driver gallery left"
                fill
                className="object-cover"
                sizes="120px"
              />
            </div>
            <div className="relative h-[317px]">
              <Image
                src={detailGallery.center}
                alt="Driver gallery center"
                fill
                className="object-cover"
                sizes="(max-width: 700px) 100vw, 420px"
              />
            </div>
            <div className="relative h-[173px] opacity-50 max-[700px]:hidden">
              <Image
                src={detailGallery.right}
                alt="Driver gallery right"
                fill
                className="object-cover"
                sizes="120px"
              />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-[22px] leading-[1.2]" aria-hidden>
            <ChevronLeft className="h-[1em] w-[1em] shrink-0" />
            <ChevronRight className="h-[1em] w-[1em] shrink-0" />
          </div>
        </div>

        <div>
          <h3 className="m-0 text-xl leading-[1.2] font-bold uppercase">Latest news</h3>
          <div className="mt-4 grid grid-cols-3 gap-5 max-[900px]:grid-cols-1">
            {detailNews.map((item) => (
              <article
                key={item.title}
                className="bg-primary border-secondary flex flex-col overflow-hidden rounded-[32px] border max-[900px]:min-h-[220px]"
              >
                <div className="relative min-h-[216px] flex-1">
                  <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width: 900px) 100vw, 204px" />
                </div>
                <div className="bg-primary p-5">
                  <h4 className="m-0 text-base leading-[1.2] font-medium uppercase">{item.title}</h4>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
