import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ContactFormFrame from "@/components/contact/ContactFormFrame";

type ContactHeroFrameProps = {
  backgroundImage: string;
  title: React.ReactNode;
  firstNameLabel: string;
  lastNameLabel: string;
  emailLabel: string;
  messageLabel: string;
  sendLabel: string;
};

export default function ContactHeroFrame({
  backgroundImage,
  title,
  firstNameLabel,
  lastNameLabel,
  emailLabel,
  messageLabel,
  sendLabel,
}: ContactHeroFrameProps) {
  return (
    <Hero
      backgroundImage={backgroundImage}
      minHeightClassName="min-h-[901px]"
      overlayClassName="bg-black/70"
      headerAnchorPrefix="/"
      activeHeaderItem="contact"
      contentClassName="mx-auto flex min-h-[749px] w-full max-w-[1116px] flex-col items-center justify-center gap-6 py-24 text-center"
      titleClassName="m-0 font-[var(--font-league-spartan)] text-[64px] leading-none font-bold uppercase drop-shadow-[4px_4px_8px_rgba(0,0,0,0.1)] max-[1200px]:text-[clamp(44px,6vw,64px)]"
      title={title}
      footerSlot={<Footer className="relative z-20 bg-transparent" id="contact-page-footer" />}
    >
      <ContactFormFrame
        firstNameLabel={firstNameLabel}
        lastNameLabel={lastNameLabel}
        emailLabel={emailLabel}
        messageLabel={messageLabel}
        sendLabel={sendLabel}
      />
    </Hero>
  );
}
