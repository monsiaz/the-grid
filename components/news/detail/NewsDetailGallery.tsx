"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import SafeNewsImage from "../SafeNewsImage";
import {
  motion,
  fadeUp,
  staggerContainer,
  smoothTransition,
  viewport,
} from "../../motion";
import NewsGalleryLightbox from "./NewsGalleryLightbox";

type NewsDetailGalleryProps = {
  images: { image: string; imageFocalPoint?: string | null; credit?: string | null }[];
  title: string;
};

export default function NewsDetailGallery({ images, title }: NewsDetailGalleryProps) {
  const t = useTranslations("news.detail");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images.length) return null;

  const lightboxImages = images.map((item, index) => ({
    src: item.image,
    alt: t("galleryImageAlt", { title, index: index + 1 }),
    credit: item.credit ?? null,
  }));

  return (
    <>
      <motion.div
        className="grid grid-cols-2 gap-5 min-[900px]:grid-cols-5"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {images.map((item, index) => (
          <motion.div
            key={`${item.image}-${index}`}
            className="relative aspect-[321/380] w-full overflow-hidden"
            variants={fadeUp}
            transition={smoothTransition}
          >
            <button
              type="button"
              aria-label={t("galleryImageAlt", { title, index: index + 1 })}
              className="relative block h-full w-full cursor-zoom-in"
              onClick={() => setLightboxIndex(index)}
            >
              <motion.div
                className="relative h-full w-full"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <SafeNewsImage
                  src={item.image}
                  alt={t("galleryImageAlt", { title, index: index + 1 })}
                  fill
                  className="object-cover"
                  style={item.imageFocalPoint ? { objectPosition: item.imageFocalPoint } : undefined}
                  sizes="(max-width: 899px) 50vw, 20vw"
                />
              </motion.div>
            </button>
          </motion.div>
        ))}
      </motion.div>
      <NewsGalleryLightbox
        images={lightboxImages}
        openIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  );
}
