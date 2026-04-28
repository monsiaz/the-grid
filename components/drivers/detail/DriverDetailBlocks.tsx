"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { motion, fadeUp, slideInLeft, slideInRight, smoothTransition } from "../../motion";

export default function DriverDetailBlocks({ blocks, relatedNews }: { blocks: any[], relatedNews?: any[] }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="grid gap-16">
      {blocks.map((block, i) => {
        if (block.blockType === "textMedia") {
          return (
            <section key={i} className="grid grid-cols-2 gap-12 max-[1200px]:grid-cols-1 items-center">
              <motion.div
                variants={block.mediaPosition === "right" ? slideInLeft : slideInRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10%" }}
                transition={smoothTransition}
                className={block.mediaPosition === "left" ? "order-2 max-[1200px]:order-1" : "order-1"}
              >
                {block.textSections?.map((section: any, j: number) => (
                  <div key={j} className="mb-10 last:mb-0">
                    <h2 className="display-card m-0 text-[clamp(26px,2.6vw,34px)] text-white">{section.title}</h2>
                    <div className="body-md mt-4 space-y-3 text-white/82 whitespace-pre-wrap">
                      {section.text}
                    </div>
                  </div>
                ))}
              </motion.div>
              
              {block.mediaType !== "none" && (
                <motion.div
                  variants={block.mediaPosition === "right" ? slideInRight : slideInLeft}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-10%" }}
                  transition={smoothTransition}
                  className={block.mediaPosition === "left" ? "order-1 max-[1200px]:order-2" : "order-2"}
                >
                  {block.mediaType === "image" && block.image && typeof block.image === 'object' && (
                    <div className="relative h-[600px] w-full overflow-hidden max-[900px]:h-[400px]">
                      <Image src={block.image.url} alt={block.image.alt || ""} fill className="object-cover" />
                    </div>
                  )}
                  {block.mediaType === "gallery" && block.gallery && (
                    <div className="grid grid-cols-3 gap-2 h-[400px]">
                      {block.gallery.map((g: any, gIndex: number) => (
                        g?.image && typeof g.image === 'object' ? (
                          <div key={gIndex} className={`relative h-full w-full overflow-hidden ${gIndex === 1 ? 'scale-110 z-10' : 'opacity-60'}`}>
                            <Image src={g.image.url} alt="" fill className="object-cover" />
                          </div>
                        ) : <div key={gIndex} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </section>
          );
        }

        if (block.blockType === "textStats") {
          return (
            <section key={i} className="grid grid-cols-2 gap-12 max-[1200px]:grid-cols-1 items-center">
              <motion.div
                variants={block.statsPosition === "right" ? slideInLeft : slideInRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10%" }}
                transition={smoothTransition}
                className={block.statsPosition === "left" ? "order-2 max-[1200px]:order-1" : "order-1"}
              >
                {block.textSections?.map((section: any, j: number) => (
                  <div key={j} className="mb-10 last:mb-0">
                    <h2 className="display-card m-0 text-[clamp(26px,2.6vw,34px)] text-white">{section.title}</h2>
                    <div className="body-md mt-4 space-y-3 text-white/82 whitespace-pre-wrap">
                      {section.text}
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div
                variants={block.statsPosition === "right" ? slideInRight : slideInLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10%" }}
                transition={smoothTransition}
                className={`grid grid-cols-2 gap-6 content-center ${block.statsPosition === "left" ? "order-1 max-[1200px]:order-2" : "order-2"}`}
              >
                {block.stats?.map((stat: any, j: number) => (
                  <div key={j} className="flex flex-col items-center justify-center bg-white/5 p-8 text-center border border-white/10">
                    <span className="display-hero text-accent text-[clamp(40px,5vw,64px)] leading-none">{stat.value}</span>
                    <span className="ui-label mt-3 text-white/70 tracking-widest uppercase">{stat.label}</span>
                  </div>
                ))}
              </motion.div>
            </section>
          );
        }

        if (block.blockType === "latestNews") {
          return (
            <section key={i} className="w-full">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10%" }}
                transition={smoothTransition}
              >
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="display-card m-0 text-[clamp(22px,2vw,30px)] text-white">{block.title || "LATEST NEWS"}</h3>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                {relatedNews && relatedNews.length > 0 && (
                  <div className="grid gap-4 min-[900px]:grid-cols-3">
                    {relatedNews.slice(0, 3).map((item, idx) => (
                      <Link key={idx} href={`/news/${item.slug}`} className="group relative h-[320px] overflow-hidden">
                        <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-[700ms] group-hover:scale-105" />
                        <div className="image-overlay-card pointer-events-none" />
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <h4 className="display-card m-0 text-white text-[clamp(16px,1.25vw,20px)]">{item.title}</h4>
                          <span className="ui-label mt-2 inline-block text-accent">LEARN MORE →</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
}
