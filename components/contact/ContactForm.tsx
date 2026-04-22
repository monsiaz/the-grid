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
      /*
        Left card — solid red fill. Radius bumped to 16px + subtle shadow
        for a more premium feel than the previous near-square `rounded-[2px]`.
        Padding rhythm tightened so both the red card and the outlined card
        have the exact same inner layout, keeping them visually balanced.
      */
      className="flex h-full w-full flex-col justify-between gap-8 rounded-[32px] bg-accent/92 px-7 py-9 shadow-[0_24px_72px_-28px_rgba(0,0,0,0.72)] backdrop-blur-[4px] min-[900px]:px-9 min-[900px]:py-11"
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
            className="ui-label pointer-events-none absolute left-0 top-0 text-white/95 transition-all duration-200 peer-placeholder-shown:top-[26px] peer-placeholder-shown:text-[14px] peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-white/80 peer-focus:top-0 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-[0.16em] peer-focus:text-white"
          >
            {messageLabel}
          </label>
        </motion.div>
        {state === "success" ? (
          <p className="ui-label m-0 text-white" role="status">
            {t("success")}
          </p>
        ) : null}
        {state === "error" ? (
          <p className="ui-label m-0 text-white" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>
      <motion.button
        type="submit"
        disabled={state === "sending"}
        className="pill-button pill-button-white-outline w-fit self-start disabled:cursor-not-allowed disabled:opacity-60"
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
        className="ui-label pointer-events-none absolute left-0 top-0 text-white/95 transition-all duration-200 peer-placeholder-shown:top-[24px] peer-placeholder-shown:text-[14px] peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-white/80 peer-focus:top-0 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-[0.16em] peer-focus:text-white"
      >
        {label}
      </label>
    </motion.div>
  );
}
