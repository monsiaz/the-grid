import Image from "next/image";
import type { NewsItem } from "./newsItems";

export default function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="bg-primary border-secondary w-[300px] shrink-0 overflow-hidden rounded-[32px] border max-[900px]:w-[min(78vw,300px)]">
      <Image
        src={item.image}
        alt={item.title}
        width={300}
        height={301}
        className="h-[301px] w-[300px] object-cover max-[900px]:h-auto max-[900px]:w-full max-[900px]:aspect-[300/301]"
      />
      <div className="grid gap-2 p-6">
        <h3 className="m-0 text-base leading-[1.2] font-medium uppercase">{item.title}</h3>
        <p className="text-soft m-0 text-base leading-[1.4] font-light italic">{item.excerpt}</p>
      </div>
    </article>
  );
}
