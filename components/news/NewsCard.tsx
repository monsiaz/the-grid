"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, fadeUp, smoothTransition } from "../motion";

type NewsCardProps = {
  href: string;
  title: string;
  image: string;
  cardClassName?: string;
  imageWrapClassName?: string;
  titleClassName?: string;
};

export default function NewsCard({
  href,
  title,
  image,
  cardClassName,
  imageWrapClassName = "h-[200px]",
  titleClassName,
}: NewsCardProps) {
  return (
    <motion.article
      className={`overflow-hidden rounded-[32px] border border-secondary ${cardClassName ?? ""}`}
      variants={fadeUp}
      transition={smoothTransition}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
    >
      <Link href={href} className="group flex h-full flex-col bg-primary text-secondary no-underline">
        <div className={`relative w-full shrink-0 overflow-hidden ${imageWrapClassName}`}>
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          />
        </div>
        <div className="flex flex-1 flex-col gap-4 bg-primary p-6">
          <h3
            className={`m-0 overflow-hidden text-[15px] leading-[1.2] font-medium uppercase ${titleClassName ?? ""}`}
          >
            {title}
          </h3>
          <span className="text-[14px] leading-[1.2] font-bold uppercase underline underline-offset-2 transition-colors duration-300 group-hover:text-accent">
            Learn more
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
