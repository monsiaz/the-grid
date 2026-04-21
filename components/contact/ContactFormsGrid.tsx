"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Newspaper } from "lucide-react";
import { useTranslations } from "next-intl";
import ContactForm from "./ContactForm";
import NewsletterForm from "./NewsletterForm";

type ContactFormsGridProps = {
  firstNameLabel: string;
  lastNameLabel: string;
  emailLabel: string;
  messageLabel: string;
  sendLabel: string;
  newsletterFirstNameLabel: string;
  newsletterLastNameLabel: string;
  newsletterEmailLabel: string;
  newsletterCompanyLabel: string;
  newsletterJobTitleLabel: string;
  newsletterSubscribeLabel: string;
};

type Tab = "contact" | "newsletter";

const smoothSpring = { type: "spring" as const, stiffness: 380, damping: 36 };
const fadeSlide = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.38, ease: "easeOut" as const } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.22, ease: "easeIn" as const } },
};

export default function ContactFormsGrid({
  firstNameLabel,
  lastNameLabel,
  emailLabel,
  messageLabel,
  sendLabel,
  newsletterFirstNameLabel,
  newsletterLastNameLabel,
  newsletterEmailLabel,
  newsletterCompanyLabel,
  newsletterJobTitleLabel,
  newsletterSubscribeLabel,
}: ContactFormsGridProps) {
  const t = useTranslations("contact");
  const [activeTab, setActiveTab] = useState<Tab>("contact");

  const tabs: { id: Tab; icon: React.ReactNode; labelKey: string }[] = [
    { id: "contact",    icon: <Mail className="h-4 w-4 shrink-0" />,      labelKey: "tabContact" },
    { id: "newsletter", icon: <Newspaper className="h-4 w-4 shrink-0" />, labelKey: "tabNewsletter" },
  ];

  return (
    <>
      {/* ── MOBILE: tab selector + animated form reveal ──────────────────── */}
      <div className="w-full min-[900px]:hidden">
        {/* Tab pills */}
        <div
          className="relative mb-7 flex w-full gap-2 rounded-full border border-white/12 bg-white/5 p-1 backdrop-blur-sm"
          role="tablist"
          aria-label={t("formSelector")}
        >
          {/* Sliding highlight */}
          <motion.span
            className="absolute inset-y-1 rounded-full bg-accent/90"
            layout
            layoutId="tab-highlight"
            transition={smoothSpring}
            style={{
              left: activeTab === "contact" ? "4px" : "calc(50% + 2px)",
              width: "calc(50% - 6px)",
            }}
          />
          {tabs.map(({ id, icon, labelKey }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              aria-controls={`panel-${id}`}
              onClick={() => setActiveTab(id)}
              className={[
                "relative z-10 flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 px-4",
                "text-xs font-bold uppercase tracking-widest transition-colors duration-200",
                activeTab === id ? "text-white" : "text-secondary/55 hover:text-secondary/80",
              ].join(" ")}
            >
              {icon}
              <span>{t(labelKey as "tabContact" | "tabNewsletter")}</span>
            </button>
          ))}
        </div>

        {/* Animated form panel */}
        <AnimatePresence mode="wait" initial={false}>
          {activeTab === "contact" ? (
            <motion.div
              key="contact"
              id="panel-contact"
              role="tabpanel"
              aria-labelledby="tab-contact"
              {...fadeSlide}
            >
              <ContactForm
                firstNameLabel={firstNameLabel}
                lastNameLabel={lastNameLabel}
                emailLabel={emailLabel}
                messageLabel={messageLabel}
                sendLabel={sendLabel}
              />
            </motion.div>
          ) : (
            <motion.div
              key="newsletter"
              id="panel-newsletter"
              role="tabpanel"
              aria-labelledby="tab-newsletter"
              {...fadeSlide}
            >
              <NewsletterForm
                firstNameLabel={newsletterFirstNameLabel}
                lastNameLabel={newsletterLastNameLabel}
                emailLabel={newsletterEmailLabel}
                companyLabel={newsletterCompanyLabel}
                jobTitleLabel={newsletterJobTitleLabel}
                subscribeLabel={newsletterSubscribeLabel}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── DESKTOP: 2-column side-by-side (unchanged layout, refined anims) ─ */}
      <div className="mx-auto hidden w-full max-w-[920px] grid-cols-2 items-stretch gap-6 text-left min-[900px]:grid">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <ContactForm
            firstNameLabel={firstNameLabel}
            lastNameLabel={lastNameLabel}
            emailLabel={emailLabel}
            messageLabel={messageLabel}
            sendLabel={sendLabel}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <NewsletterForm
            firstNameLabel={newsletterFirstNameLabel}
            lastNameLabel={newsletterLastNameLabel}
            emailLabel={newsletterEmailLabel}
            companyLabel={newsletterCompanyLabel}
            jobTitleLabel={newsletterJobTitleLabel}
            subscribeLabel={newsletterSubscribeLabel}
          />
        </motion.div>
      </div>
    </>
  );
}
