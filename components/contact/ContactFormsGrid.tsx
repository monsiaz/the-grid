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

/**
 * Two cards side by side:
 *   - Left  : solid red fill  — "Send a request" message form  → /api/contact
 *   - Right : outlined accent — "Subscribe / access request"   → /api/newsletter
 * On screens narrower than ~900px they stack vertically.
 */
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
  return (
    <div className="mt-8 grid w-full grid-cols-1 items-stretch gap-5 min-[900px]:grid-cols-2 min-[900px]:gap-6">
      <ContactForm
        firstNameLabel={firstNameLabel}
        lastNameLabel={lastNameLabel}
        emailLabel={emailLabel}
        messageLabel={messageLabel}
        sendLabel={sendLabel}
      />
      <NewsletterForm
        firstNameLabel={newsletterFirstNameLabel}
        lastNameLabel={newsletterLastNameLabel}
        emailLabel={newsletterEmailLabel}
        companyLabel={newsletterCompanyLabel}
        jobTitleLabel={newsletterJobTitleLabel}
        subscribeLabel={newsletterSubscribeLabel}
      />
    </div>
  );
}
