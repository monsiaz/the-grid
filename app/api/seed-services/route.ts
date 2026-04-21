import { NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payload";

export const maxDuration = 120;

// Images live in /public/assets/v2/services/ → served at /assets/v2/services/
const SERVICES_DATA = {
  heroTitle: "One-stop shop",
  heroDescription:
    "On and beyond the track, we operate across the motorsport ecosystem — from elite talent management to high-impact brand strategy and commercial partnerships.",

  // ── COMMERCIAL SECTION (shown FIRST) ─────────────────────────────────
  // valueIntroText = Strategy & Positioning (text-only intro card)
  // valueCards = 4 image cards
  valueHeading: "WHERE PERFORMANCE",
  valueHeadingAccent: "CREATES VALUE",
  valueDescription:
    "Commercial performance sits at the heart of modern motorsport. We combine strategic advisory, deep industry access and structured partnerships to connect drivers, teams, brands, investors and key motorsport rights holders worldwide — unlocking high-impact opportunities.",
  valueIntroText:
    "We advise brands and investors on motorsport strategy, market positioning and long-term value creation.",

  valueCards: [
    {
      title: "PARTNERSHIPS\n& STRUCTURING",
      image: "/assets/v2/services/value-partnerships.webp",
      description:
        "We structure and negotiate strategic partnerships across the motorsport ecosystem.",
    },
    {
      title: "NETWORK &\nINTRODUCTIONS",
      image: "/assets/v2/services/value-network.webp",
      description:
        "We connect talent, teams and commercial stakeholders to unlock aligned opportunities.",
    },
    {
      title: "ACTIVATION\n& CONTENT",
      image: "/assets/v2/services/value-activation.webp",
      description:
        "We design and coordinate brand activations and content initiatives.",
    },
    {
      title: "PRIVATE\nEXPERIENCES",
      image: "/assets/v2/services/value-private.webp",
      description:
        "We unlock exclusive access and curate bespoke experiences at the highest level of motorsport.",
    },
  ],

  caseStudies: [
    {
      title: "Scuderia Alpha Tauri x Fantom",
      image: "/assets/v2/services/case-alphataurifantom.webp",
      description:
        "During the 2022 season, The Grid structured the partnership between fintech company Fantom and Scuderia AlphaTauri, positioning Fantom as one of the team's main sponsors. Throughout the year, the brand gained high-profile visibility through Pierre Gasly and Yuki Tsunoda, with logo placement on their helmets and on the AT03's nose and halo.",
      dimmed: false,
    },
    {
      title: "Nyck de Vries x Omnes",
      image: "/assets/v2/services/case-nyck-omnes.webp",
      description:
        "In November 2023, The Grid facilitated a strategic partnership between Formula E World Champion Nyck de Vries and Omnes Capital, a leading European private equity firm focused on energy transition and innovation. The collaboration positioned Nyck as a global ambassador for the brand, reinforcing his profile within the sustainable innovation sector.",
      dimmed: false,
    },
    {
      title: "Pierre Gasly x Givenchy",
      image: "/assets/v2/services/case-gasly-givenchy.webp",
      description:
        "After a successful first year in 2025, Givenchy renewed and extended its partnership with Pierre Gasly on a multi-year basis, appointing him as Global Ambassador. A driver's influence extends beyond the race track, and this collaboration further strengthens Pierre's presence within the luxury and fashion world.",
      dimmed: false,
    },
    {
      title: "Sauber x Everdome",
      image: "/assets/v2/services/case-sauber-everdome.webp",
      description:
        "In 2022, The Grid facilitated the partnership between Sauber F1 Team and Everdome, connecting the Swiss Formula 1 team with the metaverse technology company. The collaboration brought together motorsport and emerging digital innovation, generating strong visibility for both organizations.",
      dimmed: false,
    },
    {
      title: "Fabio Quartararo x Lif3",
      image: "/assets/v2/services/case-quartararo-lif3.webp",
      description:
        "The Grid facilitated the partnership between MotoGP World Champion Fabio Quartararo and cryptocurrency company Lif3. Through this collaboration, Fabio became a brand ambassador, strengthening his presence within the digital and technology landscape.",
      dimmed: false,
    },
    {
      title: "Pierre Gasly x H. Moser & Cie",
      image: "/assets/v2/services/case-gasly-moser.webp",
      description:
        "The Grid facilitated the partnership between Pierre Gasly and H. Moser & Cie, which began in 2024. The collaboration marked a historic first for the Swiss watchmaking house, as Pierre became the first individual ambassador in nearly two centuries of the brand's history.",
      dimmed: false,
    },
  ],

  // ── TALENT SECTION (shown SECOND) ────────────────────────────────────
  // talentIntroText = Performance (text-only intro card)
  // talentCards = 5 image cards
  talentHeading: "TALENT TAKES THE WHEEL",
  talentHeadingAccent: "WE PAVE THE WAY",
  talentDescription:
    "From karting to the pinnacle of motorsport, the path is filled with challenges. It demands resilience, teamwork, and trust. We stand with deserving drivers every step of the way.",
  talentIntroTitle: "PERFORMANCE",
  talentIntroText:
    "We create the optimal environment for drivers to excel. By aligning their goals with team objectives and fostering collaboration, we empower them to perform at their peak level.",
  talentIntroImage: "/assets/v2/services/talent-performance.webp",

  talentCards: [
    {
      title: "MENTORSHIP",
      image: "/assets/v2/services/talent-mentorship.webp",
      description:
        "We support successful young drivers at every stage — refining their racecraft, building mental resilience, and developing the discipline needed to succeed on and off the track. We leverage over 20 years of experience working with emerging motorsport talent to share best practices.",
    },
    {
      title: "COMMERCIAL",
      image: "/assets/v2/services/talent-commercial.webp",
      description:
        "We unlock each driver's earning potential by securing strategic partnerships and developing tailored opportunities to grow their commercial value beyond the track.",
    },
    {
      title: "NETWORK",
      image: "/assets/v2/services/talent-network.webp",
      description:
        "From karting to Formula 1, our presence in the paddock and close relationships with teams and academies give drivers privileged access to the best opportunities and career-defining placements.",
    },
    {
      title: "CONTRACTS",
      image: "/assets/v2/services/talent-contracts.webp",
      description:
        "We provide legal, tax, and financial expertise at every step of a driver's career — ensuring secure contracts, smart decisions, and long-term stability. We rely on a trusted network of professionals and have learned what works, as well as the pitfalls to avoid.",
    },
    {
      title: "BRANDING",
      image: "/assets/v2/services/talent-branding.webp",
      description:
        "We shape each driver's image with tailored media strategies and a strong digital presence — boosting visibility, strengthening reputation, and building lasting influence.",
    },
  ],

  // ── HINTSA PARTNERSHIP (shown AFTER talent) ───────────────────────────
  partnerHeading: "THE GRID X HINTSA",
  partnerDescription:
    "The Grid Agency partners with Hintsa Performance, a global leader in human performance coaching. Built on a shared belief that performance is won off-track, this collaboration strengthens our commitment to preparing drivers for the highest level of the sport.",
  partnerBackgroundImage: "/assets/v2/services/hintsa-partner-bg.webp",
};

export async function POST(request: Request) {
  const secret =
    new URL(request.url).searchParams.get("secret") ||
    request.headers.get("x-translate-secret");
  if (
    secret !== process.env.PAYLOAD_SECRET &&
    secret !== process.env.TRANSLATE_SECRET
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await getPayloadClient();

  await payload.updateGlobal({
    slug: "services-page",
    locale: "en",
    data: SERVICES_DATA as Parameters<typeof payload.updateGlobal>[0]["data"],
    overrideAccess: true,
  });

  return NextResponse.json({ ok: true, message: "services-page seeded with correct EN content" });
}
