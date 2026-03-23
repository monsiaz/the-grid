"use client";

import { motion, fadeUp, smoothTransition, viewport } from "./motion";

export default function Experience() {
  return (
    <section className="bg-primary relative isolate flex min-h-[277px] w-full items-center">
      <div className="relative z-20 mx-auto w-full max-w-[1344px] px-[clamp(20px,4vw,48px)] text-center">
        <motion.p
          className="mx-auto my-20 max-w-[888px] text-[28px] leading-[1.4] uppercase max-[1200px]:text-[clamp(20px,2.2vw,28px)] max-[900px]:my-14"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ ...smoothTransition, duration: 0.9 }}
        >
          We leverage over <span className="text-muted">20 years of experience</span>, operating globally{" "}
          <span className="text-muted">on and beyond the track</span> - connecting talent, teams, brands and investors{" "}
          <span className="text-muted">AT every level</span> of the sport.
        </motion.p>
      </div>
    </section>
  );
}
