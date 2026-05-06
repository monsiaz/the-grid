import Footer from "@/components/Footer";
import Header from "@/components/Header";

type FooterSiteProps = {
  instagramUrl?: string;
  linkedinUrl?: string;
  copyright?: string;
  privacyPolicyUrl?: string;
};

import type { NewsBlock } from "./NewsContentBlocks";

type NewsDetailData = {
  slug: string;
  title: string;
  date: string;
  heroImage: string;
  heroImageFocalPoint?: string | null;
  heroImageCredit?: string | null;
  introParagraphs: string[];
  bodyParagraphs: string[];
  galleryImages: { image: string; imageFocalPoint?: string | null; credit?: string | null }[];
  /** Modular content blocks (Payload `blocks` field). Takes precedence over
   *  bodyParagraphs + galleryImages when populated. */
  contentBlocks: NewsBlock[];
};
import NewsDetailBody from "./NewsDetailBody";
import NewsDetailGallery from "./NewsDetailGallery";
import NewsDetailTop from "./NewsDetailTop";
import NewsContentBlocks from "./NewsContentBlocks";

type NewsDetailPageProps = {
  detail: NewsDetailData;
  siteProps?: FooterSiteProps;
};

export default function NewsDetailPage({ detail, siteProps }: NewsDetailPageProps) {
  const useBlocks = detail.contentBlocks.length > 0;
  return (
    <main id="main" className="bg-primary text-secondary w-full ">
      <Header activeItem="news" />
      <section className="mx-auto w-full max-w-[1344px] px-[clamp(20px,4vw,48px)] pt-20 pb-24">
        <div className="grid gap-10">
          <NewsDetailTop detail={detail} heroImageCredit={detail.heroImageCredit} />
          {useBlocks ? (
            <NewsContentBlocks blocks={detail.contentBlocks} title={detail.title} />
          ) : (
            <>
              <NewsDetailBody paragraphs={detail.bodyParagraphs} />
              <NewsDetailGallery images={detail.galleryImages} title={detail.title} />
            </>
          )}
        </div>
      </section>
      <Footer
        instagramUrl={siteProps?.instagramUrl}
        linkedinUrl={siteProps?.linkedinUrl}
        copyright={siteProps?.copyright}
        privacyPolicyUrl={siteProps?.privacyPolicyUrl}
      />
    </main>
  );
}

