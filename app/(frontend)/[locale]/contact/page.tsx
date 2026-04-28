import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { buildI18nMetadata } from "@/lib/i18nMetadata";
import { buildRouteAlternates } from "@/lib/routeAlternates";
import LocaleAlternatesData from "@/components/LocaleAlternatesData";
import ContactHero from "@/components/contact/ContactHero";
import { getPayloadClient } from "@/lib/payload";
import { resolveSectionOrder } from "@/lib/sectionOrder";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const alternates = buildRouteAlternates({ currentLocale: locale, pathSegment: "/contact" });
  return buildI18nMetadata({
    locale,
    pathSegment: "/contact",
    namespace: "contact",
    alternatesOverride: alternates.hreflang,
    canonicalOverride: alternates.canonical,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const payload = await getPayloadClient();
  const contactPage = await payload.findGlobal({ slug: "contact-page", locale });
  const siteSettings = await payload.findGlobal({ slug: "site-settings", locale });
  const t = await getTranslations({ locale, namespace: "contact" });
  const alternates = buildRouteAlternates({ currentLocale: locale, pathSegment: "/contact" });
  const orderedSections = resolveSectionOrder(
    contactPage.sectionOrder,
    ["hero"] as const,
  );

  const sections = {
    hero: (
      <ContactHero
        backgroundImage={contactPage.heroBackgroundImage}
        title={
          <>
            {t("hero.title")} <span className="text-muted">{t("hero.titleAccent")}</span>
          </>
        }
        firstNameLabel={t("form.firstName")}
        lastNameLabel={t("form.lastName")}
        emailLabel={t("form.email")}
        messageLabel={t("form.message")}
        sendLabel={t("form.send")}
        newsletterFirstNameLabel={t("newsletter.firstName")}
        newsletterLastNameLabel={t("newsletter.lastName")}
        newsletterEmailLabel={t("newsletter.email")}
        newsletterCompanyLabel={t("newsletter.company")}
        newsletterJobTitleLabel={t("newsletter.jobTitle")}
        newsletterSubscribeLabel={t("newsletter.subscribe")}
        footerProps={{
          copyright: siteSettings.footerCopyright,
          instagramUrl: siteSettings.instagramUrl,
          linkedinUrl: siteSettings.linkedinUrl,
          privacyPolicyUrl: siteSettings.privacyPolicyUrl,
        }}
      />
    ),
  } as const;

  return (
    <main id="main" className="bg-primary text-secondary w-full ">
      <LocaleAlternatesData alternates={alternates} />
      {orderedSections.map((sectionId) => (
        <div key={sectionId}>{sections[sectionId]}</div>
      ))}
    </main>
  );
}
