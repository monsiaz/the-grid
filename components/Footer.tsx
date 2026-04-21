"use client";

import Link from "next/link";
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
        <div className="surface-card-soft flex flex-wrap items-center justify-between gap-4 px-5 py-4 min-[900px]:px-7">
          {/* Social icons — Instagram + LinkedIn (inlined SVG, no static file dependency) */}
          <div className="flex items-center gap-2">
            <Link
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={t("instagramLabel")}
              className="pill-button pill-button-outline h-11 min-h-11 w-11 px-0 text-secondary"
            >
              {/* Instagram icon */}
              <svg aria-hidden viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
              </svg>
            </Link>
            <Link
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={t("linkedinLabel")}
              className="pill-button pill-button-outline h-11 min-h-11 w-11 px-0 text-secondary"
            >
              {/* LinkedIn icon */}
              <svg aria-hidden viewBox="0 0 24 24" width={20} height={20} fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </Link>
          </div>

          {/* Copyright + privacy policy */}
          <div className="flex flex-wrap items-center gap-3 text-secondary/64">
            <span className="ui-label text-secondary/58">{copyrightText}</span>
            <span className="block h-4 w-px bg-white/16" />
            <Link
              href={privacyPolicyUrl}
              className="ui-label text-secondary/58 no-underline transition-colors duration-300 hover:text-accent"
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
