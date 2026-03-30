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
      <div className="mx-auto flex w-full max-w-[1344px] items-center justify-between gap-4 px-[clamp(20px,4vw,48px)] max-[900px]:flex-col max-[900px]:items-start">
        <div className="flex items-center gap-4 text-xs leading-none uppercase">
          <Link href={instagramUrl} aria-label="Instagram" className="text-secondary no-underline transition-transform duration-300 hover:scale-110">
            <Image src="/images/instagram.svg" alt="Instagram" width={24} height={24} />
          </Link>
          <Link href={linkedinUrl} aria-label="LinkedIn" className="text-secondary no-underline transition-transform duration-300 hover:scale-110">
            <Image src="/images/linkedin.svg" alt="LinkedIn" width={24} height={24} />
          </Link>
          <Link href={`mailto:${email}`} aria-label="Email" className="text-secondary no-underline transition-transform duration-300 hover:scale-110">
            <Image src="/images/email.svg" alt="Email" width={24} height={24} />
          </Link>
        </div>
        <div className="flex items-center gap-3 text-base leading-[1.2] whitespace-nowrap uppercase max-[900px]:text-xs max-[900px]:whitespace-normal">
          <span>{copyright}</span>
          <span className="bg-secondary block h-4 w-px" />
          <Link href={privacyPolicyUrl} className="text-secondary no-underline transition-colors duration-300 hover:text-accent">
            PRIVACY POLICY
          </Link>
        </div>
      </div>
    </motion.footer>
  );
}
