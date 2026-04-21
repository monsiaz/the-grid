"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import {
  motion,
  fadeUp,
  staggerContainer,
  smoothTransition,
} from "../motion";
import { FloatingField } from "./ContactForm";

type NewsletterFormProps = {
  firstNameLabel: string;
  lastNameLabel: string;
  emailLabel: string;
  companyLabel: string;
  jobTitleLabel: string;
  subscribeLabel: string;
};

type SubmitState = "idle" | "sending" | "success" | "error";

/**
 * "Subscribe to newsletter" / access-request form (right card, outlined red).
 * Fields: firstName, lastName, email, company, jobTitle → POST /api/newsletter
 * Recipients configured via NEWSLETTER_RECIPIENTS env — defaults to
 * laura@thegrid.agency. On success, the whole card is replaced by an
 * "Access request received" confirmation state (per client brief).
 */
export default function NewsletterForm({
  firstNameLabel,
  lastNameLabel,
  emailLabel,
  companyLabel,
  jobTitleLabel,
  subscribeLabel,
}: NewsletterFormProps) {
  const t = useTranslations("contact.newsletter");
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      firstName: String(data.get("nl-first-name") || "").trim(),
      lastName: String(data.get("nl-last-name") || "").trim(),
      email: String(data.get("nl-email") || "").trim(),
      company: String(data.get("nl-company") || "").trim(),
      jobTitle: String(data.get("nl-job-title") || "").trim(),
      source: "contact-page",
    };
    setState("sending");
    setErrorMessage(null);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    <motion.form
      onSubmit={onSubmit}
      noValidate
      className="flex h-full w-full flex-col justify-between gap-8 rounded-[2px] border border-accent/90 bg-accent/10 px-8 py-10 backdrop-blur-[2px] min-[900px]:px-10 min-[900px]:py-12"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      aria-live="polite"
    >
      <div className="flex flex-col gap-5">
        <FloatingField id="nl-first-name" label={firstNameLabel} autoComplete="given-name" variant="outlined" />
        <FloatingField id="nl-last-name" label={lastNameLabel} autoComplete="family-name" variant="outlined" />
        <FloatingField id="nl-email" label={emailLabel} type="email" autoComplete="email" variant="outlined" />
        <FloatingField id="nl-company" label={companyLabel} autoComplete="organization" variant="outlined" required={false} />
        <FloatingField id="nl-job-title" label={jobTitleLabel} autoComplete="organization-title" variant="outlined" required={false} />
        {state === "success" ? (
          <p
            className="m-0 text-[13px] font-medium uppercase tracking-[0.12em] text-white"
            role="status"
          >
            {t("success")}
          </p>
        ) : null}
        {state === "error" ? (
          <p className="m-0 text-[13px] font-medium uppercase tracking-[0.08em] text-white" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>
      <motion.button
        type="submit"
        disabled={state === "sending" || state === "success"}
        className="inline-flex min-h-[44px] w-fit items-center justify-center self-start rounded-full border border-accent/90 bg-transparent px-6 py-2.5 text-[12px] leading-[1.2] uppercase tracking-[0.12em] text-accent transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-accent active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-60 disabled:cursor-not-allowed"
        variants={fadeUp}
        transition={{ ...smoothTransition, delay: 0.3 }}
        whileHover={state === "idle" || state === "error" ? { scale: 1.03 } : undefined}
        whileTap={state === "idle" || state === "error" ? { scale: 0.97 } : undefined}
      >
        {state === "sending" ? t("sending") : state === "success" ? t("success") : subscribeLabel}
      </motion.button>
    </motion.form>
  );
}
