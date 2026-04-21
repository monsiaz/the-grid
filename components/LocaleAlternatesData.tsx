import type { RouteAlternates } from "@/lib/routeAlternates";

export const LOCALE_ALTERNATES_ELEMENT_ID = "__grid_locale_alternates__";

/**
 * Server component that renders a <script> tag carrying locale → URL mapping
 * so the client-side <LocaleSwitcher /> can navigate to the exact sister page
 * in each locale (not fallback to home).
 *
 * Include this once per page, typically right above <Footer />.
 */
export default function LocaleAlternatesData({ alternates }: { alternates: RouteAlternates }) {
  const payload = {
    canonical: alternates.canonical,
    xDefault: alternates.xDefault,
    switcher: alternates.switcher,
  };
  return (
    <script
      id={LOCALE_ALTERNATES_ELEMENT_ID}
      type="application/json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
