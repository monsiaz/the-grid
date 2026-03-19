import NewsCard from "./NewsCard";
import { newsItems } from "./newsItems";

export default function Frame6LatestNews() {
  return (
    <section className="bg-primary relative isolate min-h-[665px] w-full py-20" id="news">
      <div className="mx-auto mb-8 flex w-full max-w-[1344px] items-center justify-center gap-16 px-[clamp(20px,4vw,48px)] max-[900px]:justify-start max-[900px]:gap-[22px]">
        <button
          type="button"
          aria-label="Previous"
          className="text-accent border-accent h-[34px] w-[57px] cursor-pointer rounded-full border-2 bg-transparent text-[18px] leading-none"
        >
          &larr;
        </button>
        <h2 className="m-0 text-[28px] leading-[1.2] font-bold uppercase">LATEST NEWS</h2>
        <button
          type="button"
          aria-label="Next"
          className="text-accent border-accent h-[34px] w-[57px] cursor-pointer rounded-full border-2 bg-transparent text-[18px] leading-none"
        >
          &rarr;
        </button>
      </div>
      <div className="flex items-start gap-7 overflow-x-auto pr-7 pl-[max(clamp(20px,4vw,48px),calc((100vw-1344px)/2))] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden max-[900px]:pl-[clamp(20px,4vw,48px)]">
        {newsItems.map((item, idx) => (
          <NewsCard item={item} key={`${item.title}-${idx}`} />
        ))}
      </div>
    </section>
  );
}
