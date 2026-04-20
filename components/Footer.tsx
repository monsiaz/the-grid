"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, fadeUp, smoothTransition, viewport } from "./motion";

type FooterProps = {
  className?: string;
  id?: string;
  copyright?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  email?: string;
  privacyPolicyUrl?: string;
};

export default function Footer({
  className,
  id = "contact",
  copyright = "(C) 2026 THE GRID AGENCY, ALL RIGHTS RESERVED",
  instagramUrl = "#",
  linkedinUrl = "#",
  email = "contact@thegrid.agency",
  privacyPolicyUrl = "/privacy-policy",
}: FooterProps) {
  return (
    <motion.footer
      className={`flex min-h-[76px] items-center py-5 ${className ?? "bg-primary"}`}
      id={id}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      transition={smoothTransition}
    >
      <div className="mx-auto flex w-full max-w-[1344px] items-center justify-between gap-4 px-[clamp(20px,4vw,48px)] max-[900px]:flex-col max-[900px]:items-start max-[900px]:gap-5">
        <div className="flex items-center gap-3 text-xs leading-none uppercase">
          <Link
            href={instagramUrl}
            aria-label="Instagram"
            className="inline-flex h-11 w-11 items-center justify-center text-secondary no-underline transition-transform duration-300 hover:scale-110"
          >
            <Image src="/images/instagram.svg" alt="" width={24} height={24} aria-hidden />
          </Link>
          <Link
            href={linkedinUrl}
            aria-label="LinkedIn"
            className="inline-flex h-11 w-11 items-center justify-center text-secondary no-underline transition-transform duration-300 hover:scale-110"
          >
            <Image src="/images/linkedin.svg" alt="" width={24} height={24} aria-hidden />
          </Link>
          <Link
            href={`mailto:${email}`}
            aria-label={`Email ${email}`}
            className="inline-flex h-11 w-11 items-center justify-center text-secondary no-underline transition-transform duration-300 hover:scale-110"
          >
            <Image src="/images/email.svg" alt="" width={24} height={24} aria-hidden />
          </Link>
        </div>
        <div className="flex items-center gap-3 text-base leading-[1.3] whitespace-nowrap uppercase max-[900px]:flex-wrap max-[900px]:text-xs max-[900px]:whitespace-normal">
          <span>{copyright}</span>
          <span className="bg-secondary block h-4 w-px max-[900px]:hidden" />
          <Link href={privacyPolicyUrl} className="text-secondary no-underline transition-colors duration-300 hover:text-accent">
            Privacy policy
          </Link>
        </div>
      </div>
    </motion.footer>
  );
}
