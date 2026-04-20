"use client";

import { motion, fadeUp, smoothTransition, viewport } from "./motion";

type ExperienceProps = {
  text: string;
};

function parseHighlightText(text: string) {
  const parts = text.split(/\[highlight\]|\[\/highlight\]/);
  const elements: React.ReactNode[] = [];
  let isHighlight = false;

  for (let i = 0; i < parts.length; i++) {
    if (parts[i]) {
      if (isHighlight) {
        elements.push(
          <span key={i} className="text-muted">
            {parts[i]}
          </span>
        );
      } else {
        elements.push(parts[i]);
      }
    }
    isHighlight = !isHighlight;
  }

  return elements;
}

export default function Experience({ text }: ExperienceProps) {
  return (
    <section className="bg-primary relative isolate flex min-h-[clamp(220px,40vh,277px)] w-full items-center">
      <div className="relative z-20 mx-auto w-full max-w-[1344px] px-[clamp(20px,4vw,48px)] text-center">
        <motion.p
          className="mx-auto my-20 max-w-[888px] text-[28px] leading-[1.4] uppercase max-[1200px]:text-[clamp(20px,2.2vw,28px)] max-[900px]:my-14"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ ...smoothTransition, duration: 0.9 }}
        >
          {parseHighlightText(text)}
        </motion.p>
      </div>
    </section>
  );
}
