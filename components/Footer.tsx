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
        <div className="surface-card-soft px-5 py-5 min-[900px]:px-7">

          {/* ── Mobile layout ── */}
          <div className="flex flex-col gap-4 min-[900px]:hidden">
            {/* Row 1: social icons (left) + locale switcher (right) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t("instagramLabel")}
                  className="pill-button pill-button-outline h-9 min-h-9 w-9 px-0"
                >
                  <svg aria-hidden viewBox="0 0 24 24" style={{width:16,height:16,display:"block",flexShrink:0}} fill="none" stroke="white" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.5" fill="white" stroke="none"/>
                  </svg>
                </Link>
                <Link
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t("linkedinLabel")}
                  className="pill-button pill-button-outline h-9 min-h-9 w-9 px-0"
                >
                  <svg aria-hidden viewBox="0 0 24 24" style={{width:16,height:16,display:"block",flexShrink:0}} fill="white">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </Link>
              </div>
              <LocaleSwitcher />
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-white/8" />

            {/* Row 2: copyright (left) · privacy (right) */}
            <div className="flex items-center justify-between gap-2">
              <span className="ui-label text-[10px] text-secondary/45 leading-tight">{copyrightText}</span>
              <Link
                href={privacyPolicyUrl}
                className="ui-label text-[10px] text-secondary/45 no-underline transition-colors duration-300 hover:text-accent whitespace-nowrap"
              >
                {t("privacyPolicy")}
              </Link>
            </div>
          </div>

          {/* ── Desktop layout ── */}
          <div className="hidden items-center justify-between gap-4 min-[900px]:flex">
            <div className="flex items-center gap-2">
              <Link
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={t("instagramLabel")}
                className="pill-button pill-button-outline h-11 min-h-11 w-11 px-0"
              >
                <svg aria-hidden viewBox="0 0 24 24" style={{width:20,height:20,display:"block",flexShrink:0}} fill="none" stroke="white" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="white" stroke="none"/>
                </svg>
              </Link>
              <Link
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={t("linkedinLabel")}
                className="pill-button pill-button-outline h-11 min-h-11 w-11 px-0"
              >
                <svg aria-hidden viewBox="0 0 24 24" style={{width:20,height:20,display:"block",flexShrink:0}} fill="white">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <span className="ui-label text-secondary/58">{copyrightText}</span>
              <span className="block h-4 w-px bg-white/16" />
              <Link
                href={privacyPolicyUrl}
                className="ui-label text-secondary/58 no-underline transition-colors duration-300 hover:text-accent"
              >
                {t("privacyPolicy")}
              </Link>
            </div>

            <LocaleSwitcher />
          </div>

        </div>
      </div>
    </motion.footer>
  );
}
