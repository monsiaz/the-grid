"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  motion,
  fadeUp,
  smoothTransition,
  viewport,
} from "./motion";
import LocaleSwitcher from "./LocaleSwitcher";

type FooterProps = {
  className?: string;
  id?: string;
  copyright?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  privacyPolicyUrl?: string;
  /** @deprecated kept for backward compat */
  email?: string;
};

export default function Footer({
  className,
  id = "contact",
  copyright,
  instagramUrl = "https://www.instagram.com/thegrid.agency",
  linkedinUrl = "https://www.linkedin.com/company/the-grid-agency/",
  privacyPolicyUrl = "/privacy-policy",
}: FooterProps) {
  const t = useTranslations("footer");
  const copyrightText = copyright ?? t("copyrightFallback");

  return (
    <motion.footer
      className={`py-8 ${className ?? "bg-primary"}`}
      id={id}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      transition={smoothTransition}
    >
      <div className="mx-auto w-full max-w-[1344px] px-[clamp(20px,4vw,48px)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Social icons — Instagram + LinkedIn */}
          <div className="flex items-center gap-1">
            <Link
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={t("instagramLabel")}
              className="inline-flex h-11 w-11 items-center justify-center text-secondary no-underline transition-transform duration-300 hover:scale-110"
            >
              <Image
                src="/images/instagram.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden
                unoptimized
                loading="lazy"
              />
            </Link>
            <Link
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={t("linkedinLabel")}
              className="inline-flex h-11 w-11 items-center justify-center text-secondary no-underline transition-transform duration-300 hover:scale-110"
            >
              <Image
                src="/images/linkedin.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden
                unoptimized
                loading="lazy"
              />
            </Link>
          </div>

          {/* Copyright + privacy policy */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.1em] text-secondary/60">
            <span>{copyrightText}</span>
            <span className="bg-secondary/30 block h-4 w-px" />
            <Link
              href={privacyPolicyUrl}
              className="text-secondary/60 no-underline transition-colors duration-300 hover:text-accent"
            >
              {t("privacyPolicy")}
            </Link>
          </div>

          {/* Locale switcher */}
          <LocaleSwitcher />
        </div>
      </div>
    </motion.footer>
  );
}
