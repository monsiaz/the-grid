"use client";

import Image from "next/image";
import {
  motion,
  fadeUp,
  staggerContainer,
  smoothTransition,
  viewport,
} from "../../motion";

type NewsDetailGalleryProps = {
  images: string[];
  title: string;
};

export default function NewsDetailGallery({ images, title }: NewsDetailGalleryProps) {
  return (
    <motion.div
      className="grid grid-cols-2 gap-5 min-[900px]:grid-cols-5"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {images.map((image, index) => (
        <motion.div
          key={`${image}-${index}`}
          className="relative aspect-[321/380] w-full overflow-hidden"
          variants={fadeUp}
          transition={smoothTransition}
        >
          <motion.div
            className="relative h-full w-full"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Image
              src={image}
              alt={`${title} gallery image ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 899px) 50vw, 20vw"
            />
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}
