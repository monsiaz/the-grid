"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  motion,
  fadeUp,
  scaleIn,
  smoothTransition,
  viewport,
} from "../motion";

type ServicesPartnerProps = {
  description?: string | null;
};

export default function ServicesPartner({ description }: ServicesPartnerProps) {
  const t = useTranslations("services.partner");
  return (
    <section className="relative min-h-[clamp(520px,80vh,800px)] w-full overflow-hidden">
      <Image
        src="/assets/v2/services/hintsa.webp"
        alt=""
        fill
        loading="lazy"
        sizes="(max-width: 480px) 480px, (max-width: 900px) 900px, (max-width: 1440px) 1440px, 1920px"
        quality={65}
        className="object-cover"
        aria-hidden
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.2)_45%,rgba(0,0,0,0.55)_100%)]" />
      <div className="relative z-10 mx-auto flex min-h-[inherit] w-full max-w-[1344px] items-center justify-center px-[clamp(20px,4vw,48px)] py-20 min-[900px]:py-32">
        <div className="grid w-full max-w-[1002px] gap-7 text-center uppercase [text-shadow:0_2px_16px_rgba(0,0,0,0.55)]">
          <motion.div
            className="mx-auto flex items-center justify-center gap-8 max-[900px]:flex-col"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={{ ...smoothTransition, duration: 0.9 }}
          >
            <Image
              src="/images/logo.svg"
              alt="The Grid"
              width={248}
              height={56}
              unoptimized
              loading="lazy"
              className="h-auto w-[248px] max-w-full"
            />
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
            className="m-0 mx-auto max-w-[1004px] text-[clamp(16px,1.8vw,20px)] leading-[1.4] font-light"
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
