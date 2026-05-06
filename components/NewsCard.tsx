"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "./motion";
type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  imageFocalPoint?: string | null;
};

export default function NewsCard({ item, href }: { item: NewsItem; href: string }) {
  const t = useTranslations("news.card");
  return (
    <motion.div
      data-news-card
      className="w-[300px] shrink-0 max-[900px]:w-[min(72vw,280px)]"
      whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
    >
      <Link
        href={href}
        aria-label={t("readAria", { title: item.title })}
        className="text-secondary focus-visible:ring-accent block rounded-[32px] no-underline outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
      >
        <article className="surface-card-soft overflow-hidden">
          <div className="relative aspect-[300/301] w-full overflow-hidden">
            <motion.div
              className="absolute inset-0"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Image
                src={item.image}
                alt=""
                fill
                sizes="(max-width: 900px) 78vw, 300px"
                className="object-cover"
                style={item.imageFocalPoint ? { objectPosition: item.imageFocalPoint } : undefined}
              />
            </motion.div>
          </div>
          <div className="grid gap-2 p-6">
            <h3 className="display-card m-0 text-white line-clamp-3" style={{ minHeight: "calc(1.15em * 3)" }}>{item.title}</h3>
            <p className="body-md text-soft m-0 italic line-clamp-2">{item.excerpt}</p>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
