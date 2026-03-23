import Footer from "@/components/Footer";
import Header from "@/components/Header";
import type { NewsDetailData } from "../newsData";
import NewsDetailBody from "./NewsDetailBody";
import NewsDetailGallery from "./NewsDetailGallery";
import NewsDetailTop from "./NewsDetailTop";

type NewsDetailPageProps = {
  detail: NewsDetailData;
};

export default function NewsDetailPage({ detail }: NewsDetailPageProps) {
  return (
    <main className="bg-primary text-secondary w-full ">
      <Header activeItem="news" />
      <section className="mx-auto w-full max-w-[1344px] px-[clamp(20px,4vw,48px)] pt-20 pb-24">
        <div className="grid gap-10">
          <NewsDetailTop detail={detail} />
          <NewsDetailBody paragraphs={detail.bodyParagraphs} />
          <NewsDetailGallery images={detail.galleryImages} title={detail.title} />
        </div>
      </section>
      <Footer />
    </main>
  );
}

