import NewsCardFrame from "./NewsCardFrame";
import { getNewsDetailHref, type NewsCardItem } from "./newsData";

type NewsCardsRowFrameProps = {
  cards: NewsCardItem[];
};

export default function NewsCardsRowFrame({ cards }: NewsCardsRowFrameProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-7 sm:grid-cols-2 min-[1280px]:grid-cols-4">
      {cards.map((card) => (
        <NewsCardFrame
          key={card.slug}
          href={getNewsDetailHref(card.slug)}
          title={card.title}
          image={card.image}
          cardClassName="h-[300px]"
        />
      ))}
    </div>
  );
}
