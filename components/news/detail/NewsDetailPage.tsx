import Footer from "@/components/Footer";
import Header from "@/components/Header";
import type { NewsDetailData } from "../newsData";
import NewsDetailBodyFrame from "./NewsDetailBodyFrame";
import NewsDetailGalleryFrame from "./NewsDetailGalleryFrame";
import NewsDetailTopFrame from "./NewsDetailTopFrame";

type NewsDetailPageProps = {
  detail: NewsDetailData;
};

export default function NewsDetailPage({ detail }: NewsDetailPageProps) {
  return (
    <main className="bg-primary text-secondary w-full overflow-x-hidden">
      <Header activeItem="news" />
      <section className="mx-auto w-full max-w-[1344px] px-[clamp(20px,4vw,48px)] pt-20 pb-24">
        <div className="grid gap-10">
          <NewsDetailTopFrame detail={detail} />
          <NewsDetailBodyFrame paragraphs={detail.bodyParagraphs} />
          <NewsDetailGalleryFrame images={detail.galleryImages} title={detail.title} />
        </div>
      </section>
      <Footer />
    </main>
  );
}

