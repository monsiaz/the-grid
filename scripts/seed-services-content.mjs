/**
 * Seed / update the services-page global in Payload CMS with the full
 * approved content from the COLLECTE DES TEXTES document.
 *
 * Run: node scripts/seed-services-content.mjs
 */

import { getPayload } from "payload";
import { importConfig } from "payload/node";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.chdir(path.resolve(__dirname, ".."));

const config = await importConfig(path.resolve(__dirname, "../payload.config.ts"));
const payload = await getPayload({ config });

const EN = "en";
const LOCALES = ["fr", "es", "de", "it", "nl", "zh"];

// ─── English content ──────────────────────────────────────────────────────────

const enData = {
  heroTitle: "One-stop shop",
  heroDescription:
    "On and beyond the track, we operate across the motorsport ecosystem — from elite talent management to high-impact brand strategy and commercial partnerships.",

  // WHERE PERFORMANCE CREATES VALUE (commercial section — shown FIRST)
  valueHeading: "WHERE PERFORMANCE",
  valueHeadingAccent: "CREATES VALUE",
  valueDescription:
    "Commercial performance sits at the heart of modern motorsport. We combine strategic advisory, deep industry access and structured partnerships to connect drivers, teams, brands, investors and key motorsport rights holders worldwide — unlocking high-impact opportunities.",
  valueIntroText:
    "We advise brands and investors on motorsport strategy, market positioning and long-term value creation.",
  valueCards: [
    {
      title: "PARTNERSHIPS\n& STRUCTURING",
      image: "/images/services/value-partnerships.webp",
      description:
        "We structure and negotiate strategic partnerships across the motorsport ecosystem.",
    },
    {
      title: "NETWORK &\nINTRODUCTIONS",
      image: "/images/services/value-network.webp",
      description:
        "We connect talent, teams and commercial stakeholders to unlock aligned opportunities.",
    },
    {
      title: "ACTIVATION\n& CONTENT",
      image: "/images/services/value-activation.webp",
      description:
        "We design and coordinate brand activations and content initiatives.",
    },
    {
      title: "PRIVATE\nEXPERIENCES",
      image: "/images/services/value-private.webp",
      description:
        "We unlock exclusive access and curate bespoke experiences at the highest level of motorsport.",
    },
  ],

  caseStudies: [
    {
      title: "Scuderia Alpha Tauri x Fantom",
      image: "/images/services/case-alphataurifantom.webp",
      description:
        "During the 2022 season, The Grid structured the partnership between fintech company Fantom and Scuderia AlphaTauri, positioning Fantom as one of the team's main sponsors. Throughout the year, the brand gained high-profile visibility through Pierre Gasly and Yuki Tsunoda, with logo placement on their helmets and on the AT03's nose and halo.",
    },
    {
      title: "Nyck de Vries x Omnes",
      image: "/images/services/case-nyck-omnes.webp",
      description:
        "In November 2023, The Grid facilitated a strategic partnership between Formula E World Champion Nyck de Vries and Omnes Capital, a leading European private equity firm focused on energy transition and innovation. The collaboration positioned Nyck as a global ambassador for the brand, reinforcing his profile within the sustainable innovation sector.",
    },
    {
      title: "Pierre Gasly x Givenchy",
      image: "/images/services/case-gasly-givenchy.webp",
      description:
        "After a successful first year in 2025, Givenchy renewed and extended its partnership with Pierre Gasly on a multi-year basis, appointing him as Global Ambassador. A driver's influence extends beyond the race track, and this collaboration further strengthens Pierre's presence within the luxury and fashion world.",
    },
    {
      title: "Sauber x Everdome",
      image: "/images/services/case-sauber-everdome.webp",
      description:
        "In 2022, The Grid facilitated the partnership between Sauber F1 Team and Everdome, connecting the Swiss Formula 1 team with the metaverse technology company. The collaboration brought together motorsport and emerging digital innovation, generating strong visibility for both organizations.",
    },
    {
      title: "Fabio Quartararo x Lif3",
      image: "/images/services/case-quartararo-lif3.webp",
      description:
        "The Grid facilitated the partnership between MotoGP World Champion Fabio Quartararo and cryptocurrency company Lif3. Through this collaboration, Fabio became a brand ambassador, strengthening his presence within the digital and technology landscape.",
    },
    {
      title: "Pierre Gasly x H. Moser & Cie",
      image: "/images/services/case-gasly-moser.webp",
      description:
        "The Grid facilitated the partnership between Pierre Gasly and H. Moser & Cie, which began in 2024. The collaboration marked a historic first for the Swiss watchmaking house, as Pierre became the first individual ambassador in nearly two centuries of the brand's history.",
    },
  ],

  // Hintsa partnership (shown AFTER talent)
  partnerHeading: "THE GRID X HINTSA",
  partnerDescription:
    "The Grid Agency partners with Hintsa Performance, a global leader in human performance coaching. Built on a shared belief that performance is won off-track, this collaboration strengthens our commitment to preparing drivers for the highest level of the sport.",
  partnerBackgroundImage: "/images/services/hintsa-partner-bg.webp",

  // TALENT TAKES THE WHEEL (shown SECOND, above Hintsa)
  talentHeading: "TALENT TAKES THE WHEEL",
  talentHeadingAccent: "WE PAVE THE WAY",
  talentDescription:
    "From karting to the pinnacle of motorsport, the path is filled with challenges. It demands resilience, teamwork, and trust. We stand with deserving drivers every step of the way.",
  talentIntroText:
    "We create the optimal environment for drivers to excel. By aligning their goals with team objectives and fostering collaboration, we empower them to perform at their peak level.",
  talentCards: [
    {
      title: "MENTORSHIP",
      image: "/images/services/talent-mentorship.webp",
      description:
        "We support successful young drivers at every stage — refining their racecraft, building mental resilience, and developing the discipline needed to succeed on and off the track. We leverage over 20 years of experience working with emerging motorsport talent to share best practices.",
    },
    {
      title: "COMMERCIAL",
      image: "/images/services/talent-commercial.webp",
      description:
        "We unlock each driver's earning potential by securing strategic partnerships and developing tailored opportunities to grow their commercial value beyond the track.",
    },
    {
      title: "NETWORK",
      image: "/images/services/talent-network.webp",
      description:
        "From karting to Formula 1, our presence in the paddock and close relationships with teams and academies give drivers privileged access to the best opportunities and career-defining placements.",
    },
    {
      title: "CONTRACTS",
      image: "/images/services/talent-contracts.webp",
      description:
        "We provide legal, tax, and financial expertise at every step of a driver's career — ensuring secure contracts, smart decisions, and long-term stability. We rely on a trusted network of professionals and have learned what works, as well as the pitfalls to avoid.",
    },
    {
      title: "BRANDING",
      image: "/images/services/talent-branding.webp",
      description:
        "We shape each driver's image with tailored media strategies and a strong digital presence — boosting visibility, strengthening reputation, and building lasting influence.",
    },
  ],
};

// ─── Update EN ────────────────────────────────────────────────────────────────

console.log("Updating services-page (EN)…");
await payload.updateGlobal({
  slug: "services-page",
  locale: EN,
  data: enData,
});
console.log("✅ EN done");

// ─── Re-trigger translations for all other locales ────────────────────────────
// We call the /api/translate-payload endpoint if available (best-effort)

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || "http://localhost:3000";
const TRANSLATE_SECRET = process.env.TRANSLATE_SECRET || process.env.PAYLOAD_SECRET;

async function translateGlobalLocale(locale) {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/translate-payload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TRANSLATE_SECRET}`,
      },
      body: JSON.stringify({ global: "services-page", locale }),
    });
    if (!res.ok) {
      const txt = await res.text();
      console.warn(`  ⚠️  ${locale}: ${res.status} ${txt.slice(0, 120)}`);
    } else {
      console.log(`  ✅ ${locale} translated`);
    }
  } catch (err) {
    console.warn(`  ⚠️  ${locale}: ${err.message}`);
  }
}

console.log("\nTriggering translations for other locales…");
await Promise.all(LOCALES.map(translateGlobalLocale));

console.log("\n✅ services-page seed complete");
process.exit(0);
