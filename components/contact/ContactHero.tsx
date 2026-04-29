import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ContactFormsGrid from "@/components/contact/ContactFormsGrid";

type ContactHeroProps = {
  backgroundImage: string;
  backgroundImageFocalPoint?: string | null;
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
  backgroundImageFocalPoint,
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
      backgroundObjectPosition={backgroundImageFocalPoint || undefined}
      centerContentVertically={false}
      minHeightClassName="min-h-[clamp(720px,100svh,1040px)]"
      /*
        Deeper bottom-anchored overlay (black at 80% bottom) so the footer
        links + social icons stay comfortably legible against the road asphalt
        photo, and the forms stack above the cleanest section of the image.
      */
      overlayClassName="bg-[linear-gradient(180deg,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.5)_50%,rgba(0,0,0,0.78)_100%)]"
      backdropAt={false}
      headerAnchorPrefix="/"
      activeHeaderItem="contact"
      /*
        Centered composition — title horizontally centered, cards grid below
        using a ~960px container. `items-center` collapses auto-width children
        to content width, but the children wrapper in `Hero` now forces
        `w-full`, so the grid still stretches to this section's max-width.
      */
      contentClassName="mx-auto flex w-full max-w-[1040px] flex-col items-center justify-start gap-10 pb-16 pt-[110px] text-center min-[900px]:gap-12 min-[900px]:pt-[140px] min-[900px]:pb-20"
      titleClassName="display-hero m-0 max-w-[11ch] text-secondary"
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
