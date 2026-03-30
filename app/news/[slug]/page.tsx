import NewsDetailPage from "@/components/news/detail/NewsDetailPage";
import { getPayloadClient } from "@/lib/payload";
import { notFound } from "next/navigation";

export const revalidate = 60;

type NewsDetailRouteProps = {
  params: Promise<{ slug: string }>;
};

export default async function NewsDetailRoute({ params }: NewsDetailRouteProps) {
  const { slug } = await params;
  const payload = await getPayloadClient();

  const result = await payload.find({
    collection: "news",
    where: { slug: { equals: slug } },
    limit: 1,
  });

  if (result.docs.length === 0) {
    notFound();
  }

  const newsDoc = result.docs[0];

  const detail = {
    slug: newsDoc.slug,
    title: newsDoc.title,
    date: newsDoc.date || "",
    heroImage: newsDoc.heroImage || newsDoc.listImage,
    introParagraphs: newsDoc.introParagraphs?.split("\n") || [],
    bodyParagraphs: newsDoc.bodyParagraphs?.split("\n") || [],
    galleryImages: newsDoc.galleryImages?.map((g: { image: string }) => g.image) || [],
  };

  return <NewsDetailPage detail={detail} />;
}
