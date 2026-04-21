"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AnimatePresence } from "framer-motion";
import { motion, fadeDown, smoothTransition } from "./motion";

type HeaderItemId = "about" | "services" | "drivers" | "news" | "contact";

type HeaderProps = {
  activeItem?: HeaderItemId;
  anchorPrefix?: string;
};

const headerItems: Array<{ id: HeaderItemId; href: string }> = [
  { id: "about", href: "/about" },
  { id: "services", href: "/services" },
  { id: "drivers", href: "/drivers" },
  { id: "news", href: "/news" },
  { id: "contact", href: "/contact" },
];

export default function Header({ activeItem, anchorPrefix = "" }: HeaderProps) {
  const t = useTranslations("header");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const { body } = document;
    if (isMobileMenuOpen) {
      const previousOverflow = body.style.overflow;
      body.style.overflow = "hidden";
      return () => {
        body.style.overflow = previousOverflow;
      };
    }
  }, [isMobileMenuOpen]);

  return (
    <motion.header
      className="relative z-50 mx-auto flex h-[76px] w-full max-w-[1344px] items-center justify-between px-[clamp(20px,4vw,48px)] py-5 max-[900px]:h-auto max-[900px]:py-[18px]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...smoothTransition, duration: 0.6 }}
    >
      {/* Logo — shrink-0 so it never gets squeezed by the nav */}
      <Link href="/" aria-label={t("homeLink")} className="shrink-0">
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
          <Image
            src="/images/logo.svg"
            alt={t("logoAlt")}
            width={122}
            height={44}
            priority
            fetchPriority="high"
            unoptimized
            className="h-[44px] w-auto"
          />
        </motion.div>
      </Link>

      {/* Mobile burger */}
      <button
        type="button"
        aria-controls="site-navigation"
        aria-expanded={isMobileMenuOpen}
        aria-label={isMobileMenuOpen ? t("closeMenu") : t("openMenu")}
        className="relative z-[60] hidden h-11 w-11 items-center justify-center rounded border border-white/20 text-secondary transition-colors hover:border-accent hover:text-accent max-[900px]:inline-flex"
        onClick={() => setIsMobileMenuOpen((current) => !current)}
      >
        <span className="relative block h-[14px] w-[18px]">
          <span
            className={`absolute left-0 top-0 h-[2px] w-full bg-current transition-transform duration-300 ${isMobileMenuOpen ? "translate-y-[6px] rotate-45" : ""}`}
          />
          <span
            className={`absolute left-0 top-[6px] h-[2px] w-full bg-current transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`}
          />
          <span
            className={`absolute left-0 top-[12px] h-[2px] w-full bg-current transition-transform duration-300 ${isMobileMenuOpen ? "-translate-y-[6px] -rotate-45" : ""}`}
          />
        </span>
      </button>

      <nav
        className="flex shrink-0 items-center gap-[clamp(14px,2vw,28px)] text-[clamp(11px,0.9vw,13px)] leading-[1.2] uppercase max-[900px]:hidden"
        aria-label={t("primary")}
      >
        {headerItems.map((item, idx) => (
          <motion.div
            key={item.id}
            variants={fadeDown}
            initial="hidden"
            animate="visible"
            transition={{ ...smoothTransition, delay: 0.1 + idx * 0.06 }}
          >
            <Link
              href={item.href.startsWith("#") ? `${anchorPrefix}${item.href}` : item.href}
              aria-current={activeItem === item.id ? "page" : undefined}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${activeItem === item.id ? "text-accent" : "text-secondary"} whitespace-nowrap no-underline uppercase tracking-[0.04em] transition-colors duration-300 hover:text-accent`}
            >
              {t(`nav.${item.id}`)}
            </Link>
          </motion.div>
        ))}
      </nav>
      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.div
            className="fixed inset-0 z-30 hidden flex-col items-stretch justify-center bg-primary/95 px-6 pb-[env(safe-area-inset-bottom,0px)] pt-[calc(env(safe-area-inset-top,0px)+96px)] backdrop-blur-md max-[900px]:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.nav
              id="site-navigation"
              aria-label={t("mobile")}
              className="flex w-full flex-1 flex-col items-center justify-center gap-6 text-[28px] leading-[1.1] uppercase"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              {headerItems.map((item, idx) => (
                <motion.div
                  key={`mobile-${item.id}`}
                  variants={fadeDown}
                  initial="hidden"
                  animate="visible"
                  transition={{ ...smoothTransition, duration: 0.35, delay: idx * 0.04 }}
                >
                  <Link
                    href={item.href.startsWith("#") ? `${anchorPrefix}${item.href}` : item.href}
                    aria-current={activeItem === item.id ? "page" : undefined}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`${activeItem === item.id ? "text-accent" : "text-secondary"} block px-4 py-3 no-underline uppercase transition-colors duration-300 hover:text-accent`}
                  >
                    {t(`nav.${item.id}`)}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
