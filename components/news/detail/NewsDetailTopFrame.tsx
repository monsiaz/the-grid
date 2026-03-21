import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { NewsDetailData } from "../newsData";

type NewsDetailTopFrameProps = {
  detail: NewsDetailData;
};

export default function NewsDetailTopFrame({ detail }: NewsDetailTopFrameProps) {
  return (
    <div className="grid items-start gap-10 min-[1100px]:grid-cols-[433px_minmax(0,1fr)]">
      <div className="relative h-[512px] w-full overflow-hidden">
        <Image src={detail.heroImage} alt={detail.title} fill className="object-cover" sizes="(max-width: 1099px) 100vw, 433px" />
      </div>

      <div className="grid gap-10">
        <Link
          href="/news"
          aria-label="Back to news"
          className="text-accent border-accent inline-flex h-[34px] w-[57px] items-center justify-center rounded-full border-2 no-underline transition-all duration-300 hover:bg-accent hover:text-black"
        >
          <ChevronLeft className="h-5 w-5 shrink-0" aria-hidden />
        </Link>

        <div className="grid gap-4">
          <h1 className="m-0 font-[var(--font-league-spartan)] text-[clamp(42px,7vw,64px)] leading-none font-bold uppercase">
            {detail.title}
          </h1>
          <p className="text-accent m-0 text-[14px] leading-none font-bold uppercase">{detail.date}</p>
          <div className="grid gap-4 text-base leading-[1.4] font-light">
            {detail.introParagraphs.map((paragraph) => (
              <p key={paragraph} className="m-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

