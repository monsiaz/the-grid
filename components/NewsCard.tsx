"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "./motion";
type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
};

export default function NewsCard({ item, href }: { item: NewsItem; href: string }) {
  return (
    <motion.div
      data-news-card
      className="w-[300px] shrink-0 max-[900px]:w-[min(78vw,300px)]"
      whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
    >
      <Link
        href={href}
        className="text-secondary focus-visible:ring-accent block rounded-[32px] no-underline outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
      >
        <article className="bg-primary border-secondary overflow-hidden rounded-[32px] border">
          <div className="overflow-hidden">
            <motion.div
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Image
                src={item.image}
                alt={item.title}
                width={300}
                height={301}
                className="h-[301px] w-[300px] object-cover max-[900px]:h-auto max-[900px]:w-full max-[900px]:aspect-[300/301]"
              />
            </motion.div>
          </div>
          <div className="grid gap-2 p-6">
            <h3 className="m-0 text-base leading-[1.2] font-medium uppercase">{item.title}</h3>
            <p className="text-soft m-0 text-base leading-[1.4] font-light italic">{item.excerpt}</p>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
