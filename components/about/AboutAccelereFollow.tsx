"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  fadeUp,
  slideInLeft,
  slideInRight,
  staggerContainer,
  smoothTransition,
  viewport,
} from "../motion";

const socialImages = [
  "/images/about/instagram-1.webp",
  "/images/about/instagram-2.webp",
  "/images/about/instagram-3.webp",
  "/images/about/instagram-4.webp",
  "/images/about/instagram-5.webp",
];

const gridOrder = [
  ...socialImages,
  socialImages[3],
  socialImages[2],
  socialImages[4],
  socialImages[0],
  socialImages[1],
];

export default function AboutAccelereFollow() {
  return (
    <section className="bg-primary pb-20">
      <div className="mx-auto grid w-full max-w-[1344px] gap-20 px-[clamp(20px,4vw,48px)] pt-10">
        <div className="mx-auto grid w-full max-w-[1002px] gap-12">
          <motion.div
            className="mx-auto grid w-full max-w-[1004px] gap-7 text-center"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={smoothTransition}
          >
            <p className="m-0 text-[clamp(16px,1.8vw,20px)] leading-[1.4] font-light uppercase">
              ACCÉLÈRE is an initiative by Côme Ensemble, the endowment fund of Côme Maison Financière. Its mission is
              simple: to empower and structure the next generation of French motorsport talent, regardless of
              background.
              <br />
              <br />
              Sponsored by Formula 1 driver Pierre Gasly, and developed in partnership with The Grid Agency, ACCÉLÈRE
              brings together those who understand the system and are committed to making it fairer.
            </p>
            <Link
              href="#contact"
              className="text-accent border-accent mx-auto inline-flex w-fit items-center justify-center rounded-full border-2 bg-black/20 px-9 py-4 text-base leading-[1.2] no-underline uppercase transition-all duration-300 hover:bg-accent hover:text-black hover:scale-105"
            >
              Get in touch
            </Link>
          </motion.div>

          <div className="grid items-center gap-7 min-[900px]:grid-cols-[432px_1fr]">
            <motion.div
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              transition={smoothTransition}
              className="overflow-hidden"
            >
              <Image
                src="/images/about/accelere-portrait.webp"
                alt="Pierre Gasly"
                width={432}
                height={500}
                className="h-auto w-full object-cover"
              />
            </motion.div>
            <motion.div
              className="border-secondary relative border-l pl-7"
              variants={slideInRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              transition={{ ...smoothTransition, delay: 0.2 }}
            >
              <span className="text-accent absolute -left-2 top-1 text-[120px] leading-none opacity-30">"</span>
              <p className="m-0 text-[clamp(16px,1.8vw,20px)] leading-[1.4] font-light italic">
                Behind every driver, there is a team, supporters, people who believed in them. This program is my way
                of giving back what I received, and of proving that talent and hard work can open every door.
              </p>
              <p className="mt-5 mb-0 text-base leading-[1.2]">
                <span className="font-semibold">Pierre Gasly</span>
                <br />
                BWT Alpine F1 Team Driver
                <br />
                Program Sponsor
              </p>
            </motion.div>
          </div>
        </div>

        <div className="grid gap-6">
          <motion.h2
            className="m-0 font-[var(--font-league-spartan)] text-[64px] leading-none font-bold uppercase max-[1200px]:text-[clamp(44px,6vw,64px)]"
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={smoothTransition}
          >
            <span className="text-muted">Follow </span>us
          </motion.h2>
          <div className="grid gap-2">
            <motion.div
              className="flex items-center justify-between gap-4 max-[900px]:flex-col max-[900px]:items-start"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              transition={smoothTransition}
            >
              <p className="m-0 text-xl leading-[1.2] font-bold uppercase">@THEGRID.AGENCY</p>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-accent border-accent inline-flex items-center justify-center rounded-full border-2 bg-black/20 px-9 py-4 text-base leading-[1.2] no-underline uppercase transition-all duration-300 hover:bg-accent hover:text-black hover:scale-105"
              >
                Instagram
              </Link>
            </motion.div>
            <motion.div
              className="grid grid-cols-2 gap-1 min-[900px]:grid-cols-5"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              {gridOrder.map((src, idx) => (
                <motion.div
                  key={`${src}-${idx}`}
                  variants={fadeUp}
                  transition={smoothTransition}
                  className="overflow-hidden"
                >
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <Image
                      src={src}
                      alt="The Grid Instagram"
                      width={269}
                      height={360}
                      className="aspect-[269/360] h-auto w-full object-cover"
                    />
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
