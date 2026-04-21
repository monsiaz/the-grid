import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { buildI18nMetadata } from "@/lib/i18nMetadata";
import { buildRouteAlternates } from "@/lib/routeAlternates";
import LocaleAlternatesData from "@/components/LocaleAlternatesData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPayloadClient } from "@/lib/payload";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const alternates = buildRouteAlternates({ currentLocale: locale, pathSegment: "/privacy-policy" });
  return buildI18nMetadata({
    locale,
    pathSegment: "/privacy-policy",
    namespace: "privacy",
    alternatesOverride: alternates.hreflang,
    canonicalOverride: alternates.canonical,
  });
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "privacy" });
  const alternates = buildRouteAlternates({ currentLocale: locale, pathSegment: "/privacy-policy" });

  const payload = await getPayloadClient();
  let siteSettings: { instagramUrl?: string; linkedinUrl?: string; footerCopyright?: string } = {};
  try {
    siteSettings = await payload.findGlobal({ slug: "site-settings", locale });
  } catch {
    // Fallback to defaults if DB is unavailable during build/cold start
    siteSettings = {
      instagramUrl: "https://www.instagram.com/thegrid.agency",
      linkedinUrl: "https://www.linkedin.com/company/the-grid-agency/",
      footerCopyright: "© The Grid Agency",
    };
  }

  return (
    <>
      <LocaleAlternatesData alternates={alternates} />
      <Header activeItem={undefined} />

      <main className="bg-primary min-h-screen pt-28 pb-20">
        <article className="mx-auto w-full max-w-[800px] px-[clamp(20px,4vw,48px)]">
          <h1 className="mb-10 font-[var(--font-league-spartan)] text-[clamp(36px,5vw,64px)] leading-none font-bold uppercase text-secondary">
            {t("title")}
          </h1>

          <div className="grid gap-10 text-secondary/80">
            {/* Section 1 */}
            <section>
              <h2 className="mb-4 text-lg font-semibold uppercase tracking-[0.08em] text-secondary">
                {t("s1.title")}
              </h2>
              <div className="grid gap-3 text-[15px] leading-[1.7]">
                <p><strong className="text-secondary/90">1.1</strong> {t("s1.p1")}</p>
                <p><strong className="text-secondary/90">1.2</strong> {t("s1.p2")}</p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="mb-4 text-lg font-semibold uppercase tracking-[0.08em] text-secondary">
                {t("s2.title")}
              </h2>
              <div className="grid gap-3 text-[15px] leading-[1.7]">
                <p><strong className="text-secondary/90">2.1</strong> {t("s2.p1")}</p>
                <p><strong className="text-secondary/90">2.2</strong> {t("s2.p2")}</p>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="mb-4 text-lg font-semibold uppercase tracking-[0.08em] text-secondary">
                {t("s3.title")}
              </h2>
              <p className="text-[15px] leading-[1.7]">
                <strong className="text-secondary/90">3.1</strong> {t("s3.p1")}
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="mb-4 text-lg font-semibold uppercase tracking-[0.08em] text-secondary">
                {t("s4.title")}
              </h2>
              <p className="text-[15px] leading-[1.7]">
                <strong className="text-secondary/90">4.1</strong> {t("s4.p1")}
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="mb-4 text-lg font-semibold uppercase tracking-[0.08em] text-secondary">
                {t("s5.title")}
              </h2>
              <div className="grid gap-3 text-[15px] leading-[1.7]">
                <p><strong className="text-secondary/90">5.1</strong> {t("s5.p1")}</p>
                <p>
                  <strong className="text-secondary/90">5.2</strong>{" "}
                  {t("s5.p2")}{" "}
                  <a
                    href="mailto:info@thegrid.agency"
                    className="text-accent underline underline-offset-2 hover:no-underline"
                  >
                    info@thegrid.agency
                  </a>
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="mb-4 text-lg font-semibold uppercase tracking-[0.08em] text-secondary">
                {t("s6.title")}
              </h2>
              <p className="text-[15px] leading-[1.7]">
                <strong className="text-secondary/90">6.1</strong> {t("s6.p1")}
              </p>
            </section>

            {/* Consent */}
            <p className="border-t border-secondary/10 pt-8 text-sm leading-[1.7] text-secondary/60 italic">
              {t("consent")}
            </p>
          </div>
        </article>
      </main>

      <Footer
        instagramUrl={siteSettings.instagramUrl}
        linkedinUrl={siteSettings.linkedinUrl}
        copyright={siteSettings.footerCopyright}
        privacyPolicyUrl="/privacy-policy"
      />
    </>
  );
}
