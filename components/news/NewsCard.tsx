"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion, fadeUp, smoothTransition } from "../motion";

type NewsCardProps = {
  href: string;
  title: string;
  image: string;
  excerpt?: string | null;
  cardClassName?: string;
  imageWrapClassName?: string;
  titleClassName?: string;
};

export default function NewsCard({
  href,
  title,
  image,
  excerpt,
  cardClassName,
  imageWrapClassName = "h-[200px]",
  titleClassName,
}: NewsCardProps) {
  const t = useTranslations("news.card");
  return (
    <motion.article
      className={`overflow-hidden rounded-[32px] border border-secondary ${cardClassName ?? ""}`}
      variants={fadeUp}
      transition={smoothTransition}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
    >
      <Link
        href={href}
        aria-label={t("readAria", { title })}
        className="group flex h-full flex-col bg-primary text-secondary no-underline"
      >
        <div className={`relative w-full shrink-0 overflow-hidden ${imageWrapClassName}`}>
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 320px"
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 bg-primary p-6">
          <h2
            className={`m-0 overflow-hidden text-[15px] leading-[1.2] font-medium uppercase ${titleClassName ?? ""}`}
          >
            {title}
          </h2>
          {excerpt ? (
            <p className="m-0 line-clamp-3 text-[13px] leading-[1.4] font-light text-secondary/80 normal-case">
              {excerpt}
            </p>
          ) : null}
          <span className="mt-auto text-[14px] leading-[1.2] font-bold uppercase underline underline-offset-2 transition-colors duration-300 group-hover:text-accent">
            {t("learnMore")}<span className="sr-only">{t("learnMoreSr")}</span>
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
