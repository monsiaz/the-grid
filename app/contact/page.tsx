import ContactHero from "@/components/contact/ContactHero";
import { getPayloadClient } from "@/lib/payload";

export const revalidate = 60;

export default async function ContactPage() {
  const payload = await getPayloadClient();
  const contactPage = await payload.findGlobal({ slug: "contact-page" });
  const siteSettings = await payload.findGlobal({ slug: "site-settings" });

  return (
    <main className="bg-primary text-secondary w-full ">
      <ContactHero
        backgroundImage={contactPage.heroBackgroundImage}
        title={
          <>
            Get <span className="text-muted">in touch</span>
          </>
        }
        firstNameLabel="First Name"
        lastNameLabel="Last Name"
        emailLabel="Email"
        messageLabel="Message"
        sendLabel="Send"
        footerProps={{
          copyright: siteSettings.footerCopyright,
          instagramUrl: siteSettings.instagramUrl,
          linkedinUrl: siteSettings.linkedinUrl,
          email: siteSettings.email,
          privacyPolicyUrl: siteSettings.privacyPolicyUrl,
        }}
      />
    </main>
  );
}
