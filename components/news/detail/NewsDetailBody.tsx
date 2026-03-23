"use client";

import { motion, fadeUp, smoothTransition, viewport } from "../../motion";

type NewsDetailBodyProps = {
  paragraphs: string[];
};

export default function NewsDetailBody({ paragraphs }: NewsDetailBodyProps) {
  return (
    <motion.div
      className="grid gap-4 text-base leading-[1.4] font-light"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      transition={smoothTransition}
    >
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="m-0">
          {paragraph}
        </p>
      ))}
    </motion.div>
  );
}
