import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ContactFormsGrid from "@/components/contact/ContactFormsGrid";

type ContactHeroProps = {
  backgroundImage: string;
  title: React.ReactNode;
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
  footerProps?: {
    copyright?: string | null;
    instagramUrl?: string | null;
    linkedinUrl?: string | null;
    privacyPolicyUrl?: string | null;
  };
};

/**
 * /contact page layout: left-aligned "GET IN TOUCH" headline above a 2-up
 * grid of forms (message on the left, newsletter / access request on the
 * right). Footer is anchored to the bottom of the hero so the whole page
 * fills one viewport height on desktop — matches the client mockup.
 */
export default function ContactHero({
  backgroundImage,
  title,
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
  footerProps,
}: ContactHeroProps) {
  return (
    <Hero
      backgroundImage={backgroundImage}
      minHeightClassName="min-h-[clamp(720px,100svh,960px)]"
      overlayClassName="bg-[linear-gradient(180deg,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0.45)_60%,rgba(0,0,0,0.65)_100%)]"
      backdropAt={false}
      headerAnchorPrefix="/"
      activeHeaderItem="contact"
      contentClassName="mx-auto flex w-full max-w-[1280px] flex-col items-start justify-start gap-4 pb-10 pt-[120px] text-left min-[900px]:pt-[140px]"
      titleClassName="m-0 font-[var(--font-league-spartan)] text-[clamp(48px,7vw,84px)] leading-[0.95] font-bold uppercase text-secondary [text-shadow:0_4px_24px_rgba(0,0,0,0.55),0_2px_8px_rgba(0,0,0,0.4)]"
      title={title}
      footerSlot={
        <Footer
          className="relative z-20 bg-transparent"
          id="contact-page-footer"
          copyright={footerProps?.copyright || undefined}
          instagramUrl={footerProps?.instagramUrl || undefined}
          linkedinUrl={footerProps?.linkedinUrl || undefined}
          privacyPolicyUrl={footerProps?.privacyPolicyUrl || undefined}
        />
      }
    >
      <ContactFormsGrid
        firstNameLabel={firstNameLabel}
        lastNameLabel={lastNameLabel}
        emailLabel={emailLabel}
        messageLabel={messageLabel}
        sendLabel={sendLabel}
        newsletterFirstNameLabel={newsletterFirstNameLabel}
        newsletterLastNameLabel={newsletterLastNameLabel}
        newsletterEmailLabel={newsletterEmailLabel}
        newsletterCompanyLabel={newsletterCompanyLabel}
        newsletterJobTitleLabel={newsletterJobTitleLabel}
        newsletterSubscribeLabel={newsletterSubscribeLabel}
      />
    </Hero>
  );
}
