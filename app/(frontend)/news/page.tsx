import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NewsCardsRow from "@/components/news/NewsCardsRow";
import NewsFeaturedGrid from "@/components/news/NewsFeaturedGrid";
import NewsHeading from "@/components/news/NewsHeading";
import { getPayloadClient } from "@/lib/payload";

export const revalidate = 60;

export type NewsCardData = {
  slug: string;
  title: string;
  image: string;
  category: "sporting" | "commercial";
};

export default async function NewsPage() {
  const payload = await getPayloadClient();
  const siteSettings = await payload.findGlobal({ slug: "site-settings" });
  const news = await payload.find({
    collection: "news",
    sort: "-createdAt",
    limit: 100,
  });

  const newsCards: NewsCardData[] = news.docs.map((n) => ({
    slug: n.slug,
    title: n.title,
    image: n.listImage,
    category: n.category as "sporting" | "commercial",
  }));

  const featuredCards = newsCards.slice(0, 6);
  const rowCards = [newsCards.slice(6, 10), newsCards.slice(10, 14), newsCards.slice(14, 18), newsCards.slice(18, 22)];

  return (
    <main id="main" className="bg-primary text-secondary w-full ">
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
      <Footer
        copyright={siteSettings.footerCopyright}
        instagramUrl={siteSettings.instagramUrl}
        linkedinUrl={siteSettings.linkedinUrl}
        email={siteSettings.email}
        privacyPolicyUrl={siteSettings.privacyPolicyUrl}
      />
    </main>
  );
}
