"use client";

import { useTranslations } from "next-intl";
import SafeNewsImage from "../SafeNewsImage";
import {
  motion,
  fadeUp,
  staggerContainer,
  smoothTransition,
  viewport,
} from "../../motion";

type NewsDetailGalleryProps = {
  images: { image: string; imageFocalPoint?: string | null }[];
  title: string;
};

export default function NewsDetailGallery({ images, title }: NewsDetailGalleryProps) {
  const t = useTranslations("news.detail");
  return (
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
        </motion.div>
      ))}
    </motion.div>
  );
}
