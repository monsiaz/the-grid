"use client";

import { useState, type FormEvent } from "react";
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

type ContactFieldProps = {
  id: string;
  label: string;
  type?: "text" | "email";
  autoComplete?: string;
  required?: boolean;
};

type SubmitState = "idle" | "sending" | "success" | "error";

function ContactField({ id, label, type = "text", autoComplete, required = true }: ContactFieldProps) {
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
        className="peer w-full border-b border-secondary/80 bg-transparent pb-3 pt-1 text-base leading-[1.2] text-secondary placeholder-transparent transition-colors duration-300 focus:border-secondary focus:outline-none"
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-0 top-0 text-[12px] leading-none uppercase text-white/90 transition-all duration-200 peer-placeholder-shown:top-[26px] peer-placeholder-shown:text-[14px] peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/80 peer-focus:top-0 peer-focus:text-[12px] peer-focus:uppercase peer-focus:text-white"
      >
        {label}
      </label>
    </motion.div>
  );
}

export default function ContactForm({
  firstNameLabel,
  lastNameLabel,
  emailLabel,
  messageLabel,
  sendLabel,
}: ContactFormProps) {
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
        throw new Error(body?.error || "Unable to send message.");
      }
      setState("success");
      form.reset();
    } catch (error) {
      setState("error");
      setErrorMessage(error instanceof Error ? error.message : "Unable to send message.");
    }
  };

  return (
    <motion.form
      onSubmit={onSubmit}
      noValidate
      className="bg-accent/90 flex w-full items-end justify-center gap-32 px-16 py-16 max-[1100px]:gap-10 max-[1100px]:px-8 max-[1100px]:py-10 max-[800px]:flex-col max-[800px]:items-stretch max-[800px]:gap-8 max-[800px]:px-6 max-[800px]:py-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      aria-live="polite"
    >
      <div className="flex flex-1 flex-col gap-8">
        <ContactField id="first-name" label={firstNameLabel} autoComplete="given-name" />
        <ContactField id="last-name" label={lastNameLabel} autoComplete="family-name" />
        <ContactField id="email" label={emailLabel} type="email" autoComplete="email" />
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
            className="peer h-[140px] w-full resize-none border-b border-secondary/80 bg-transparent pb-3 pt-1 text-base leading-[1.35] text-secondary placeholder-transparent transition-colors duration-300 focus:border-secondary focus:outline-none"
          />
          <label
            htmlFor="message"
            className="pointer-events-none absolute left-0 top-0 text-[12px] leading-none uppercase text-white/90 transition-all duration-200 peer-placeholder-shown:top-[26px] peer-placeholder-shown:text-[14px] peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/80 peer-focus:top-0 peer-focus:text-[12px] peer-focus:uppercase peer-focus:text-white"
          >
            {messageLabel}
          </label>
        </motion.div>
        {state === "success" ? (
          <p className="m-0 text-sm font-medium uppercase" role="status">
            Thanks, your message has been sent.
          </p>
        ) : null}
        {state === "error" ? (
          <p className="m-0 text-sm font-medium uppercase text-white" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>
      <motion.button
        type="submit"
        disabled={state === "sending"}
        className="border-secondary min-h-[50px] min-w-[101px] rounded-full border-2 px-9 py-3 text-base leading-[1.2] uppercase transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white hover:text-accent active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-60 disabled:cursor-not-allowed max-[800px]:self-end"
        variants={fadeUp}
        transition={{ ...smoothTransition, delay: 0.3 }}
        whileHover={state !== "sending" ? { scale: 1.05 } : undefined}
        whileTap={state !== "sending" ? { scale: 0.97 } : undefined}
      >
        {state === "sending" ? "Sending..." : sendLabel}
      </motion.button>
    </motion.form>
  );
}
