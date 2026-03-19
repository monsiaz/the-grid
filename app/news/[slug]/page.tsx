import NewsDetailPage from "@/components/news/detail/NewsDetailPage";
import { newsDetailBySlug } from "@/components/news/newsData";
import { notFound } from "next/navigation";

type NewsDetailRouteProps = {
  params: Promise<{ slug: string }>;
};

export default async function NewsDetailRoute({ params }: NewsDetailRouteProps) {
  const { slug } = await params;
  const detail = newsDetailBySlug[slug];

  if (!detail) {
    notFound();
  }

  return <NewsDetailPage detail={detail} />;
}
