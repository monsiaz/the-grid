import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NewsCardsRow from "./NewsCardsRow";
import NewsFeaturedGrid from "./NewsFeaturedGrid";
import NewsHeading from "./NewsHeading";
import { newsCards } from "./newsData";

export default function NewsListingPage() {
  const featuredCards = newsCards.slice(0, 6);
  const rowCards = [newsCards.slice(6, 10), newsCards.slice(10, 14), newsCards.slice(14, 18), newsCards.slice(18, 22)];

  return (
    <main className="bg-primary text-secondary w-full overflow-x-hidden">
      <Header activeItem="news" />
      <section className="mx-auto w-full max-w-[1344px] px-[clamp(20px,4vw,48px)] pt-20 pb-24">
        <div className="grid gap-16">
          <NewsHeading />
          <div className="grid gap-7">
            <NewsFeaturedGrid cards={featuredCards} />
            {rowCards.map((row, index) => (
              <NewsCardsRow key={index} cards={row} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

