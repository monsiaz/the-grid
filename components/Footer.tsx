"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
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
  email?: string;
  privacyPolicyUrl?: string;
};

type NewsletterState = "idle" | "sending" | "success" | "error";

function FooterNewsletterForm() {
  const t = useTranslations("footer.newsletter");
  const [state, setState] = useState<NewsletterState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("newsletter-email") || "").trim();
    setState("sending");
    setErrorMessage(null);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.error || t("error"));
      }
      setState("success");
      form.reset();
    } catch (error) {
      setState("error");
      setErrorMessage(error instanceof Error ? error.message : t("error"));
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-live="polite"
      className="flex w-full max-w-[420px] flex-col gap-2"
    >
      <label htmlFor="newsletter-email" className="text-[11px] uppercase tracking-[0.14em] text-secondary/80">
        {t("label")}
      </label>
      <div className="flex items-stretch gap-2 max-[480px]:flex-col">
        <input
          id="newsletter-email"
          name="newsletter-email"
          type="email"
          required
          autoComplete="email"
          placeholder={t("placeholder")}
          className="flex-1 rounded-full border border-secondary/40 bg-transparent px-4 py-2 text-sm leading-[1.2] text-secondary placeholder:text-secondary/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-accent bg-transparent px-5 text-[12px] font-semibold uppercase tracking-[0.1em] text-accent transition-all duration-300 hover:bg-accent hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === "sending" ? t("sending") : t("submit")}
        </button>
      </div>
      <p
        role={state === "error" ? "alert" : "status"}
        className={`m-0 min-h-[1em] text-[11px] uppercase tracking-[0.1em] ${
          state === "success"
            ? "text-accent"
            : state === "error"
              ? "text-red-400"
              : "text-transparent"
        }`}
      >
        {state === "success"
          ? t("success")
          : state === "error"
            ? errorMessage || t("error")
            : "placeholder"}
      </p>
    </form>
  );
}

export default function Footer({
  className,
  id = "contact",
  copyright,
  instagramUrl = "#",
  linkedinUrl = "#",
  email,
  privacyPolicyUrl = "/privacy-policy",
}: FooterProps) {
  const t = useTranslations("footer");
  void email;
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
      <div className="mx-auto grid w-full max-w-[1344px] gap-8 px-[clamp(20px,4vw,48px)] min-[900px]:grid-cols-[auto_1fr_auto] min-[900px]:items-center">
        <div className="flex items-center gap-3 text-xs leading-none uppercase">
          <Link
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={t("instagramLabel")}
            className="inline-flex h-11 w-11 items-center justify-center text-secondary no-underline transition-transform duration-300 hover:scale-110"
          >
            <Image src="/images/instagram.svg" alt="" width={24} height={24} aria-hidden unoptimized loading="lazy" />
          </Link>
          <Link
            href={linkedinUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={t("linkedinLabel")}
            className="inline-flex h-11 w-11 items-center justify-center text-secondary no-underline transition-transform duration-300 hover:scale-110"
          >
            <Image src="/images/linkedin.svg" alt="" width={24} height={24} aria-hidden unoptimized loading="lazy" />
          </Link>
        </div>

        <div className="flex justify-center max-[900px]:justify-start">
          <FooterNewsletterForm />
        </div>

        <div className="flex flex-col items-end gap-3 text-[12px] leading-[1.3] uppercase max-[900px]:items-start">
          <LocaleSwitcher />
          <div className="flex items-center gap-3 whitespace-nowrap max-[900px]:flex-wrap max-[900px]:whitespace-normal">
            <span>{copyrightText}</span>
            <span className="bg-secondary block h-4 w-px max-[900px]:hidden" />
            <Link
              href={privacyPolicyUrl}
              className="text-secondary no-underline transition-colors duration-300 hover:text-accent"
            >
              {t("privacyPolicy")}
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
