"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  motion,
  useScroll,
  useTransform,
  fadeUp,
  scaleIn,
  smoothTransition,
  viewport,
} from "../motion";

type ServicesPartnerProps = {
  description?: string | null;
  backgroundImage?: string | null;
};

export default function ServicesPartner({ description, backgroundImage }: ServicesPartnerProps) {
  const t = useTranslations("services.partner");
  const bg = backgroundImage || "/assets/v2/services/hintsa.webp";
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={sectionRef} className="relative min-h-[clamp(520px,80vh,800px)] w-full overflow-hidden">
      <motion.div style={{ y: parallaxY }} className="absolute inset-0 scale-[1.2]">
        <Image
          src={bg}
          alt=""
          fill
          loading="lazy"
          sizes="(max-width: 480px) 480px, (max-width: 900px) 900px, (max-width: 1440px) 1440px, 1600px"
          quality={85}
          className="object-cover"
          aria-hidden
        />
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,15,15,0.45)_0%,rgba(15,15,15,0.2)_45%,rgba(15,15,15,0.55)_100%)]" />
      <div className="relative z-10 mx-auto flex min-h-[inherit] w-full max-w-[1344px] items-center justify-center px-[clamp(20px,4vw,48px)] py-20 min-[900px]:py-32">
        <div className="grid w-full max-w-[1002px] gap-7 text-center [text-shadow:0_2px_16px_rgba(0,0,0,0.55)]">
          <motion.div
            className="mx-auto flex items-center justify-center gap-8 max-[900px]:flex-col"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={{ ...smoothTransition, duration: 0.9 }}
          >
            {/* The Grid logo — inlined SVG to avoid Vercel static file issues */}
            <svg viewBox="0 0 122 44" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:248,height:90,display:"block",flexShrink:0}} aria-label="The Grid">
              <g>
                <path d="M8.81899 0V3.70652H3.69444V40.2935H8.81899V44H0V0H8.81899Z" fill="white"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M30.2646 5.5C24.3337 8.91903 20.379 15.0565 20.379 22.0598C20.379 28.9026 24.1547 34.919 29.8603 38.3804H5.48207V5.5H30.2646ZM9.37821 30.8804C9.29717 30.8804 9.22423 30.9454 9.22423 31.0349V34.6447C9.22423 34.7342 9.29717 34.7992 9.37821 34.7992H10.2614C10.3425 34.7992 10.4154 34.7342 10.4154 34.6447V33.4821H14.743C14.824 33.4821 14.8969 33.4089 14.8969 33.3276V32.352C14.8969 32.2707 14.824 32.1975 14.743 32.1975H10.4154V31.0349C10.4154 30.9454 10.3425 30.8804 10.2614 30.8804H9.37821ZM9.37821 25.1909C9.29718 25.1909 9.22426 25.2641 9.22423 25.3454V26.313C9.22425 26.4024 9.29718 26.4675 9.37821 26.4675H11.4204V28.7927H9.37821C9.29718 28.7927 9.22426 28.8578 9.22423 28.9472V29.9148C9.22426 29.9961 9.29718 30.0693 9.37821 30.0693H14.743C14.824 30.0692 14.8969 29.9961 14.8969 29.9148V28.9472C14.8969 28.8578 14.824 28.7927 14.743 28.7927H12.6117V26.4675H14.743C14.824 26.4675 14.8969 26.4024 14.8969 26.313V25.3454C14.8969 25.2641 14.824 25.1909 14.743 25.1909H9.37821ZM9.37821 20.5921C9.29717 20.5921 9.22423 20.6571 9.22423 20.7466V24.1126C9.22425 24.202 9.29718 24.2671 9.37821 24.2671H14.743C14.824 24.2671 14.8969 24.202 14.8969 24.1126V20.7466C14.8969 20.6571 14.824 20.5921 14.743 20.5921H13.8596C13.7786 20.5921 13.7056 20.6571 13.7056 20.7466V22.9987H12.6117V21.1449C12.6117 21.0637 12.5468 20.9905 12.4577 20.9905H11.5743C11.4933 20.9905 11.4204 21.0636 11.4204 21.1449V22.9987H10.4154V20.7466C10.4154 20.6571 10.3425 20.5921 10.2614 20.5921H9.37821Z" fill="white"/>
                <path d="M38.2422 5.5C42.0663 5.5 46.2546 7.09862 49.3503 9.79337C49.76 10.1131 49.8056 10.6611 49.4414 11.0265L45.8449 14.8631C45.4807 15.1828 44.9799 15.1829 44.6158 14.9089C42.8858 13.3103 40.8827 12.7165 38.652 12.7165C33.6897 12.7165 29.6835 16.9185 29.6835 21.9427C29.6836 26.9211 33.7353 31.0317 38.6975 31.0317C40.0177 31.0317 41.3835 30.849 42.7492 30.3009V27.6519H39.8811C39.3803 27.6519 39.0161 27.2864 39.0161 26.8297V22.308C39.0161 21.8056 39.3803 21.4403 39.8811 21.4402H49.0316C49.4869 21.4402 49.8511 21.8513 49.8511 22.308L49.8966 34.5943C49.8966 34.8227 49.7145 35.1881 49.5324 35.3251C49.5217 35.3319 44.8357 38.2939 38.2422 38.2939C29.1827 38.2939 21.8988 31.0774 21.8987 21.9427C21.8987 12.8079 29.1827 5.50002 38.2422 5.5Z" fill="white"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M66.184 5.91112C71.647 5.91112 76.1085 10.3415 76.1085 15.7767C76.1085 19.9786 73.3314 23.3586 69.3707 24.9571L75.6077 36.5582C75.9263 37.152 75.6077 37.8828 74.8337 37.8828H68.7789C68.4148 37.8828 68.1416 37.6545 68.0505 37.4718L61.9957 25.3681H58.8544V37.015C58.8544 37.4717 58.4447 37.8828 57.9895 37.8828H52.572C52.0712 37.8828 51.707 37.4717 51.707 37.015V6.7789C51.707 6.32217 52.0712 5.91112 52.572 5.91112H66.184ZM58.8544 19.5676H65.5922C67.4587 19.5676 69.0521 17.8319 69.0521 15.9136C69.0521 13.9953 67.4587 12.4425 65.5922 12.4425H58.8544V19.5676Z" fill="white"/>
                <path d="M83.9807 5.91112C84.4359 5.91112 84.8456 6.32217 84.8456 6.7789V37.015C84.8456 37.4717 84.4359 37.8828 83.9807 37.8828H78.5177C78.0624 37.8828 77.6527 37.4717 77.6527 37.015V6.7789C77.6527 6.32217 78.0624 5.91113 78.5177 5.91112H83.9807Z" fill="white"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M98.6245 5.91112C107.411 5.91112 114.604 13.0819 114.604 21.8512C114.604 30.712 107.411 37.8828 98.6245 37.8828H87.5164C87.0611 37.8828 86.6969 37.4717 86.6969 37.015V6.7789C86.6969 6.32217 87.0611 5.91113 87.5164 5.91112H98.6245ZM93.7988 31.123H98.1692C103.314 31.123 107.047 27.0581 107.047 21.8512C107.047 16.6901 103.314 12.6251 98.1692 12.6251H93.7988V31.123Z" fill="white"/>
              </g>
            </svg>
            <span className="bg-secondary h-14 w-px max-[900px]:h-px max-[900px]:w-14" />
            <Image
              src="/images/services/hintsa-white-logo.svg"
              alt={t("hintsaAlt")}
              width={248}
              height={44}
              unoptimized
              loading="lazy"
              className="h-auto w-[248px] max-w-full"
            />
          </motion.div>
          <motion.p
            className="body-lg m-0 mx-auto max-w-[1004px] text-white/88"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={{ ...smoothTransition, delay: 0.2 }}
          >
            {description || t("descriptionFallback")}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
