"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import {
  motion,
  fadeUp,
  staggerContainer,
  smoothTransition,
} from "../motion";

type ContactFormProps = {
  firstNameLabel: string;
  lastNameLabel: string;
  emailLabel: string;
  messageLabel: string;
  sendLabel: string;
};

type SubmitState = "idle" | "sending" | "success" | "error";

/**
 * "Get in touch" message form (left card, solid red fill).
 * Fields: firstName, lastName, email, message → POST /api/contact
 * Recipients configured via CONTACT_RECIPIENTS env — defaults to
 * jeremy@thegrid.agency + laura@thegrid.agency.
 */
export default function ContactForm({
  firstNameLabel,
  lastNameLabel,
  emailLabel,
  messageLabel,
  sendLabel,
}: ContactFormProps) {
  const t = useTranslations("contact.form");
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      firstName: String(data.get("first-name") || "").trim(),
      lastName: String(data.get("last-name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      message: String(data.get("message") || "").trim(),
    };
    setState("sending");
    setErrorMessage(null);
    try {
      const response = await fetch("/api/contact", {
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
      className="flex h-full w-full flex-col justify-between gap-8 rounded-[2px] bg-accent/85 px-8 py-10 backdrop-blur-[2px] min-[900px]:px-10 min-[900px]:py-12"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      aria-live="polite"
    >
      <div className="flex flex-col gap-7">
        <FloatingField id="first-name" label={firstNameLabel} autoComplete="given-name" variant="filled" />
        <FloatingField id="last-name" label={lastNameLabel} autoComplete="family-name" variant="filled" />
        <FloatingField id="email" label={emailLabel} type="email" autoComplete="email" variant="filled" />
        <motion.div
          className="relative pt-5"
          variants={fadeUp}
          transition={smoothTransition}
        >
          <textarea
            id="message"
            name="message"
            required
            placeholder=" "
            rows={3}
            className="peer block h-[88px] w-full resize-none border-b border-white/60 bg-transparent pb-3 pt-1 text-[15px] leading-[1.4] text-white placeholder-transparent transition-colors duration-300 focus:border-white focus:outline-none"
          />
          <label
            htmlFor="message"
            className="pointer-events-none absolute left-0 top-0 text-[11px] leading-none uppercase tracking-[0.1em] text-white/95 transition-all duration-200 peer-placeholder-shown:top-[26px] peer-placeholder-shown:text-[14px] peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-white/80 peer-focus:top-0 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-[0.1em] peer-focus:text-white"
          >
            {messageLabel}
          </label>
        </motion.div>
        {state === "success" ? (
          <p className="m-0 text-[13px] font-medium uppercase tracking-[0.08em] text-white" role="status">
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
        disabled={state === "sending"}
        className="inline-flex min-h-[44px] w-fit items-center justify-center self-start rounded-full border border-white/90 px-6 py-2.5 text-[12px] leading-[1.2] uppercase tracking-[0.12em] text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white hover:text-accent active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-60 disabled:cursor-not-allowed"
        variants={fadeUp}
        transition={{ ...smoothTransition, delay: 0.3 }}
        whileHover={state !== "sending" ? { scale: 1.03 } : undefined}
        whileTap={state !== "sending" ? { scale: 0.97 } : undefined}
      >
        {state === "sending" ? t("sending") : sendLabel}
      </motion.button>
    </motion.form>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared floating-label input used by both cards. variant="filled" renders the
// field as it appears inside the solid red left card; variant="outlined"
// renders it slightly lighter for the transparent right card.
// ─────────────────────────────────────────────────────────────────────────────
export function FloatingField({
  id,
  label,
  type = "text",
  autoComplete,
  required = true,
  variant = "filled",
}: {
  id: string;
  label: string;
  type?: "text" | "email";
  autoComplete?: string;
  required?: boolean;
  variant?: "filled" | "outlined";
}) {
  const borderColor = variant === "filled" ? "border-white/60" : "border-white/50";
  const focusBorder = variant === "filled" ? "focus:border-white" : "focus:border-white";
  const textColor = "text-white";
  return (
    <motion.div
      className="relative pt-5"
      variants={fadeUp}
      transition={smoothTransition}
    >
      <input
        id={id}
        type={type}
        name={id}
        required={required}
        autoComplete={autoComplete}
        placeholder=" "
        className={`peer block h-10 w-full border-b ${borderColor} bg-transparent pb-2 pt-1 text-[15px] leading-[1.2] ${textColor} placeholder-transparent transition-colors duration-300 ${focusBorder} focus:outline-none`}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-0 top-0 text-[11px] leading-none uppercase tracking-[0.1em] text-white/95 transition-all duration-200 peer-placeholder-shown:top-[24px] peer-placeholder-shown:text-[14px] peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-white/80 peer-focus:top-0 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-[0.1em] peer-focus:text-white"
      >
        {label}
      </label>
    </motion.div>
  );
}
