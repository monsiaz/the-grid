"use client";

import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
type NewsDetailData = {
  slug: string;
  title: string;
  date: string;
  heroImage: string;
  introParagraphs: string[];
};
import {
  motion,
  slideInLeft,
  slideInRight,
  smoothTransition,
} from "../../motion";

type NewsDetailTopProps = {
  detail: NewsDetailData;
};

export default function NewsDetailTop({ detail }: NewsDetailTopProps) {
  const t = useTranslations("news.detail");
  return (
    <div className="grid items-start gap-10 min-[1100px]:grid-cols-[433px_minmax(0,1fr)]">
      <motion.div
        className="surface-card-soft relative aspect-[4/5] w-full overflow-hidden min-[700px]:h-[512px] min-[700px]:aspect-auto"
        variants={slideInLeft}
        initial="hidden"
        animate="visible"
        transition={smoothTransition}
      >
        <motion.div
          className="relative h-full w-full"
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Image src={detail.heroImage} alt={detail.title} fill className="object-cover" sizes="(max-width: 1099px) 100vw, 433px" />
        </motion.div>
      </motion.div>

      <motion.div
        className="grid gap-10"
        variants={slideInRight}
        initial="hidden"
        animate="visible"
        transition={{ ...smoothTransition, delay: 0.15 }}
      >
        <Link
          href="/news"
          aria-label={t("back")}
          className="pill-button pill-button-accent-outline h-[34px] min-h-[34px] w-[57px] px-0"
        >
          <ChevronLeft className="h-5 w-5 shrink-0" aria-hidden />
        </Link>

        <div className="grid gap-4">
          <h1 className="display-section m-0 text-[clamp(42px,7vw,64px)] text-white">
            {detail.title}
          </h1>
          <p className="ui-label text-accent m-0">{detail.date}</p>
          <div className="body-md grid gap-4 text-white/84">
            {detail.introParagraphs.map((paragraph) => (
              <p key={paragraph} className="m-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
