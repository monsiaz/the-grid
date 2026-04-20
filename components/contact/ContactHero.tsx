import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ContactForm from "@/components/contact/ContactForm";

type ContactHeroProps = {
  backgroundImage: string;
  title: React.ReactNode;
  firstNameLabel: string;
  lastNameLabel: string;
  emailLabel: string;
  messageLabel: string;
  sendLabel: string;
  footerProps?: {
    copyright?: string | null;
    instagramUrl?: string | null;
    linkedinUrl?: string | null;
    email?: string | null;
    privacyPolicyUrl?: string | null;
  };
};

export default function ContactHero({
  backgroundImage,
  title,
  firstNameLabel,
  lastNameLabel,
  emailLabel,
  messageLabel,
  sendLabel,
  footerProps,
}: ContactHeroProps) {
  return (
    <Hero
      backgroundImage={backgroundImage}
      minHeightClassName="min-h-[clamp(640px,100svh,901px)]"
      overlayClassName="bg-black/70"
      headerAnchorPrefix="/"
      activeHeaderItem="contact"
      contentClassName="mx-auto flex w-full max-w-[1116px] flex-col items-center justify-center gap-6 py-16 text-center min-[900px]:py-24"
      titleClassName="m-0 font-[var(--font-league-spartan)] text-[64px] leading-none font-bold uppercase drop-shadow-[4px_4px_8px_rgba(0,0,0,0.1)] max-[1200px]:text-[clamp(44px,6vw,64px)]"
      title={title}
      footerSlot={
        <Footer
          className="relative z-20 bg-transparent"
          id="contact-page-footer"
          copyright={footerProps?.copyright || undefined}
          instagramUrl={footerProps?.instagramUrl || undefined}
          linkedinUrl={footerProps?.linkedinUrl || undefined}
          email={footerProps?.email || undefined}
          privacyPolicyUrl={footerProps?.privacyPolicyUrl || undefined}
        />
      }
    >
      <ContactForm
        firstNameLabel={firstNameLabel}
        lastNameLabel={lastNameLabel}
        emailLabel={emailLabel}
        messageLabel={messageLabel}
        sendLabel={sendLabel}
      />
    </Hero>
  );
}
