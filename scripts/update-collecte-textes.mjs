/**
 * Comprehensive update script: applies all text content from
 * "COLLECTE DES TEXTES THE GRID WEBSITE 2.0" to Payload CMS via REST API.
 *
 * Usage (dev):
 *   node scripts/update-collecte-textes.mjs
 *
 * Usage (prod):
 *   BASE=https://the-grid-sa.vercel.app EMAIL=admin@thegrid.agency PASSWORD=... \
 *   node scripts/update-collecte-textes.mjs
 */

const BASE = process.env.BASE || "http://localhost:3000";
const EMAIL = process.env.EMAIL || "admin@thegrid.agency";
const PASSWORD = process.env.PASSWORD || process.env.PAYLOAD_ADMIN_PASSWORD || "changeme123";

// ─── helpers ──────────────────────────────────────────────────────────────────

async function login() {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) {
    const txt = await res.text();
    console.error("Login failed:", res.status, txt.slice(0, 300));
    process.exit(1);
  }
  const setCookie = res.headers.getSetCookie?.() ?? [];
  const cookies = setCookie.map((c) => c.split(";")[0]).join("; ");
  if (!cookies) {
    // fallback: parse Set-Cookie header manually
    const raw = res.headers.get("set-cookie") || "";
    return raw.split(",").map((c) => c.trim().split(";")[0]).join("; ");
  }
  return cookies;
}

async function getGlobal(cookies, slug, locale = "en") {
  const res = await fetch(`${BASE}/api/globals/${slug}?locale=${locale}&depth=0`, {
    headers: { Cookie: cookies },
  });
  if (!res.ok) {
    console.error(`GET global ${slug} failed:`, res.status);
    return {};
  }
  return res.json();
}

async function postGlobal(cookies, slug, data, locale = "en") {
  const res = await fetch(`${BASE}/api/globals/${slug}?locale=${locale}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookies },
    body: JSON.stringify(data),
  });
  const body = await res.text();
  if (!res.ok) {
    console.error(`FAIL global ${slug}:`, res.status, body.slice(0, 500));
    return false;
  }
  console.log(`✅ global ${slug}`);
  return true;
}

async function findDocs(cookies, collection, where, locale = "en") {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(where)) {
    q.set(`where[${k}][equals]`, String(v));
  }
  q.set("limit", "1");
  q.set("locale", locale);
  q.set("depth", "0");
  const res = await fetch(`${BASE}/api/${collection}?${q}`, {
    headers: { Cookie: cookies },
  });
  if (!res.ok) return null;
  const j = await res.json();
  return j.docs?.[0] || null;
}

async function patchDoc(cookies, collection, id, data, locale = "en") {
  const res = await fetch(`${BASE}/api/${collection}/${id}?locale=${locale}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: cookies },
    body: JSON.stringify(data),
  });
  const body = await res.text();
  if (!res.ok) {
    console.error(`FAIL PATCH ${collection}/${id}:`, res.status, body.slice(0, 500));
    return false;
  }
  return true;
}

// Merges text-only updates into an existing Payload array, preserving non-text fields (images, ids, etc.)
function mergeArray(existing, updates, matchKey = null) {
  if (!existing || existing.length === 0) {
    return updates;
  }
  if (updates.length === 0) return existing;

  return updates.map((update, i) => {
    let existingItem;
    if (matchKey && update[matchKey]) {
      existingItem = existing.find((e) => e[matchKey] === update[matchKey]);
    }
    if (!existingItem) {
      existingItem = existing[i];
    }
    if (!existingItem) return update;
    return { ...existingItem, ...update };
  });
}

// ─── content definitions ───────────────────────────────────────────────────────

const HOMEPAGE_UPDATES = {
  heroTitle: "OPENING THE GATES TO ELITE MOTORSPORT",
  aboutText:
    "We are a 360° motorsport agency combining driver management and strategic marketing to build careers and develop high-impact partnerships across the ecosystem.",
  serviceLabels: [
    { label: "Sport Management" },
    { label: "Image & Media" },
    { label: "Commercial Development" },
  ],
  driversHeading: "FOR DESERVING",
  driversHeadingAccent: "DRIVERS",
};

const ABOUT_PAGE_UPDATES = {
  heroTitle: "WHO WE ARE",
  heroDescription:
    "We are a 360° motorsport management and marketing agency operating globally. We build elite careers for deserving drivers and develop strategic partnerships across the ecosystem.",
  coreIntroText:
    "[highlight]Our expertise is structured around [/highlight]three core areas[highlight], designed to [/highlight]support performance[highlight] on track and [/highlight]create value[highlight] beyond it[/highlight]",
  coreAreas: [
    {
      number: "01",
      title: "SPORT MANAGEMENT",
      text: "We guide drivers to the highest level of motorsport. Built on over two decades of experience, our deep understanding of the racing ecosystem allows us to identify talent early and shape tailored career strategies. Each driver is unique — one profile, one strategy.",
      image: "/assets/v2/about/core-sport-management.webp",
    },
    {
      number: "02",
      title: "IMAGE & BRANDING",
      text: "We build influential profiles on and off the track. Through tailored positioning, media strategy and long-term personal branding, we strengthen the visibility, credibility and influence of drivers and rights holders.",
      image: "/assets/v2/about/core-image-branding.webp",
    },
    {
      number: "03",
      title: "COMMERCIAL DEVELOPMENT",
      text: "We create high-impact partnerships across the motorsport ecosystem. By connecting drivers, brands and key stakeholders, we structure collaborations that generate long-term value for all parties involved.",
      image: "/assets/v2/about/core-commercial-development.webp",
    },
  ],
  founderBio:
    "With 20 years of experience in motorsport, Guillaume has worked across multiple roles in the paddock. He served as a simulation & race engineer for ART Grand Prix for six years before co-founding AOTech — a company specialising in simulators, aerodynamics, and composite parts manufacturing — in 2010.\n\nAfter a two-year stint at McLaren in a business development position, Guillaume went on to found Soter Analytics, a tech start-up, and The Grid Agency simultaneously in 2018. Both businesses thrived, and Guillaume chose to focus exclusively on The Grid in 2021.",
  founderName: "Guillaume Le Goff",
  founderRole: "Founder & Partner",
  founderLinkedinUrl: "https://www.linkedin.com/in/glegoff/",
  accelereDescription:
    "ACCÉLÈRE is an initiative by Côme Ensemble, the endowment fund of Côme Maison Financière. Its mission is simple: to empower and structure the next generation of French motorsport talent, regardless of background.\n\nSponsored by Formula 1 driver Pierre Gasly, and developed in partnership with The Grid Agency, ACCÉLÈRE brings together those who understand the system and are committed to making it fairer.",
  accelereQuote:
    "Behind every driver, there is a team, supporters, people who believed in them. This program is my way of giving back what I received, and of proving that talent and hard work can open every door.",
  accelereQuoteAuthor: "Pierre Gasly",
  accelereQuoteRole: "BWT Alpine F1 Team Driver",
  accelereQuoteTitle: "Program Sponsor",
};

const SERVICES_PAGE_UPDATES = {
  heroTitle: "ONE-STOP SHOP",
  heroDescription:
    "On and beyond the track, we operate across the motorsport ecosystem — from elite talent management to high-impact brand strategy and commercial partnerships.",
  talentHeading: "TALENT TAKES THE WHEEL",
  talentHeadingAccent: "WE PAVE THE WAY",
  talentDescription:
    "From karting to the pinnacle of motorsport, the path is filled with challenges. It demands resilience, teamwork, and trust. We stand with deserving drivers every step of the way.",
  talentCards: [
    {
      title: "Performance",
      description:
        "We create the optimal environment for drivers to excel. By aligning their goals with team objectives and fostering collaboration, we empower them to perform at their peak level.",
    },
    {
      title: "Mentorship",
      description:
        "We support successful young drivers at every stage — refining their racecraft, building mental resilience, and developing the discipline needed to succeed on and off the track. We leverage over 20 years of experience working with emerging motorsport talent to share best practices.",
    },
    {
      title: "Commercial",
      description:
        "We unlock each driver's earning potential by securing strategic partnerships and developing tailored opportunities to grow their commercial value beyond the track.",
    },
    {
      title: "Network",
      description:
        "From karting to Formula 1, our presence in the paddock and close relationships with teams and academies give drivers privileged access to the best opportunities and career-defining placements.",
    },
    {
      title: "Contracts",
      description:
        "We provide legal, tax, and financial expertise at every step of a driver's career — ensuring secure contracts, smart decisions, and long-term stability. We rely on a trusted network of professionals and have learned what works, as well as the pitfalls to avoid.",
    },
    {
      title: "Branding",
      description:
        "We shape each driver's image with tailored media strategies and a strong digital presence — boosting visibility, strengthening reputation, and building lasting influence.",
    },
  ],
  partnerDescription:
    "The Grid Agency partners with Hintsa Performance, a global leader in human performance coaching. Built on a shared belief that performance is won off-track, this collaboration strengthens our commitment to preparing drivers for the highest level of the sport.",
  valueHeading: "WHERE PERFORMANCE",
  valueHeadingAccent: "CREATES VALUE",
  valueDescription:
    "Commercial performance sits at the heart of modern motorsport. We combine strategic advisory, deep industry access and structured partnerships to connect drivers, teams, brands, investors and key motorsport rights holders worldwide — unlocking high-impact opportunities.",
  valueCards: [
    {
      title: "Strategy & Positioning",
      description:
        "We advise brands and investors on motorsport strategy, market positioning and long-term value creation.",
    },
    {
      title: "Partnerships & Structuring",
      description:
        "We structure and negotiate strategic partnerships across the motorsport ecosystem.",
    },
    {
      title: "Network & Introductions",
      description: "We connect talent, teams and commercial stakeholders to unlock aligned opportunities.",
    },
    {
      title: "Activation & Content",
      description: "We design and coordinate brand activations and content initiatives.",
    },
    {
      title: "Private Experiences",
      description: "We unlock exclusive access and curate bespoke experiences at the highest level of motorsport.",
    },
  ],
  caseStudies: [
    {
      title: "Scuderia Alpha Tauri x Fantom",
      description:
        "During the 2022 season, The Grid structured the partnership between fintech company Fantom and Scuderia AlphaTauri, positioning Fantom as one of the team's main sponsors. Throughout the year, the brand gained high-profile visibility through Pierre Gasly and Yuki Tsunoda, with logo placement on their helmets and on the AT03's nose and halo.",
    },
    {
      title: "Nyck de Vries x Omnes",
      description:
        "In November 2023, The Grid facilitated a strategic partnership between Formula E World Champion Nyck de Vries and Omnes Capital, a leading European private equity firm focused on energy transition and innovation. The collaboration positioned Nyck as a global ambassador for the brand, reinforcing his profile within the sustainable innovation sector.",
    },
    {
      title: "Pierre Gasly x Givenchy",
      description:
        "After a successful first year in 2025, Givenchy renewed and extended its partnership with Pierre Gasly on a multi-year basis, appointing him as Global Ambassador. A driver's influence extends beyond the race track, and this collaboration further strengthens Pierre's presence within the luxury and fashion world.",
    },
    {
      title: "Sauber x Everdome",
      description:
        "In 2022, The Grid facilitated the partnership between Sauber F1 Team and Everdome, connecting the Swiss Formula 1 team with the metaverse technology company. The collaboration brought together motorsport and emerging digital innovation, generating strong visibility for both organizations.",
    },
    {
      title: "Fabio Quartararo x Lif3",
      description:
        "The Grid facilitated the partnership between MotoGP World Champion Fabio Quartararo and cryptocurrency company Lif3. Through this collaboration, Fabio became a brand ambassador, strengthening his presence within the digital and technology landscape.",
    },
    {
      title: "Pierre Gasly x H. Moser & Cie",
      description:
        "The Grid facilitated the partnership between Pierre Gasly and H. Moser & Cie, which began in 2024. The collaboration marked a historic first for the Swiss watchmaking house, as Pierre became the first individual ambassador in nearly two centuries of the brand's history.",
    },
  ],
};

// Team member updates keyed by name
const TEAM_UPDATES = {
  "Guillaume Le Goff": {
    role: "Founder & Partner",
    bio: "With 20 years of experience in motorsport, Guillaume has worked across multiple roles in the paddock. He served as a simulation & race engineer for ART Grand Prix for six years before co-founding AOTech — a company specialising in simulators, aerodynamics, and composite parts manufacturing — in 2010.\n\nAfter a two-year stint at McLaren in a business development position, Guillaume went on to found Soter Analytics, a tech start-up, and The Grid Agency simultaneously in 2018. Both businesses thrived, and Guillaume chose to focus exclusively on The Grid in 2021.",
    linkedinUrl: "https://www.linkedin.com/in/glegoff/",
  },
  "Jérémy Satis": {
    role: "Driver Agent",
    bio: "A journalist by trade and well-versed in multiple fields, Jérémy has been working in motorsport for seven years. As a sports journalist for multiple publications, he covered junior categories for four years before becoming a Formula 1 reporter for three years, sharpening his network of teams, academies, and drivers.\n\nHe now takes on the role of Driver Agent at The Grid, bringing that experience to work closely with the agency's drivers — from karting to Formula 2 — with the aim of helping them on their journey to Formula 1.",
  },
  "Laura Fredel": {
    role: "Marketing Associate",
    bio: "With a background in business management and art direction, Laura began her career in the fashion and luxury industries before specialising in the automotive and motorsport sectors.\n\nAfter coordinating bespoke collaborations and experiences for Alpine Cars, she joined The Grid, where she now oversees communications and marketing — shaping the agency's brand presence and the positioning of its drivers beyond the track, across media and partnerships.",
  },
};

// Driver updates keyed by slug
const DRIVER_UPDATES = {
  "pierre-gasly": {
    role: "BWT ALPINE FORMULA 1 DRIVER",
    detail: {
      profileTitle: "Career Overview and Driver Profile",
      profileParagraphs:
        "Pierre Gasly is a French Formula 1 driver competing in the FIA Formula One World Championship with the BWT Alpine F1 Team. Widely recognised for his resilience, technical feedback, and racecraft, Pierre Gasly's career stands as one of the most compelling comeback stories in modern Formula One.\n\nBorn on February 7, 1996, in Rouen, France, Pierre Gasly began his racing career at a young age, progressing through the highly competitive European karting scene before transitioning into single-seater racing. His early years showcased a rare blend of speed, discipline, and adaptability — qualities that would later define Pierre Gasly's Formula One career.\n\nClimbing the junior single-seater ladder, Gasly made his mark in Formula Renault and Formula 3, before achieving international recognition by winning the 2016 GP2 Series championship (now known as FIA Formula 2). That title firmly established him as one of the most promising French drivers of his generation and opened the door to a full-time Formula One career.",
      careerTitle: "Pierre Gasly's Formula One Career",
      careerParagraphs:
        "Pierre Gasly made his Formula One debut in 2017 as a Red Bull Junior Team driver racing with Scuderia Toro Rosso. From the outset, his raw pace and technical understanding impressed across the paddock, particularly his stunning P4 in Bahrain. His breakthrough moment came during the 2019 season when he secured his first Formula One podium, confirming his ability to compete at the highest level of motorsport.\n\nIn 2020, Pierre Gasly's career reached a historic milestone. At the Italian Grand Prix in Monza, he delivered a flawless performance to claim victory, becoming the first French driver to win a Formula One race since 1996. That win not only cemented his place in F1 history but also symbolised his resilience and mental strength following earlier career challenges.\n\nOver multiple seasons with Scuderia AlphaTauri, Gasly became the team's highest points scorer of all time, consistently outperforming expectations and earning a reputation as one of the most dependable and technically astute drivers on the grid.",
      transitionTitle: "Transition to Alpine and Ongoing Career Development",
      transitionParagraph:
        "Pierre Gasly joined the BWT Alpine F1 Team with the ambition of continuing his upward trajectory and contributing to the long-term growth of a French manufacturer in Formula One. Since his move, Pierre Gasly's career has been defined by consistency, leadership, and continued podium finishes, reinforcing his status as a cornerstone driver for the team's future.",
      agencyTitle: "Pierre Gasly and The Grid Agency",
      agencyParagraphs:
        "Pierre Gasly's relationship with The Grid Agency spans more than a decade and represents a rare, holistic approach to driver management. From the earliest stages of his career to the pinnacle of Formula One, The Grid has been involved across every dimension of his professional development.\n\nThroughout Pierre Gasly's career, The Grid Agency has supported him as coaches, race engineers, technical advisors, simulator coaches, and today as career and commercial managers. This long-term collaboration has allowed for a deep understanding of Pierre's performance mindset, career objectives, and brand positioning within global motorsport.\n\nThe partnership is built on trust, continuity, and shared ambition — navigating both the highs of race victories and the challenges inherent to elite competition. Together, Pierre Gasly and The Grid Agency continue to shape a career defined by performance excellence, strategic growth, and long-term vision in Formula One.",
    },
  },
  "isack-hadjar": {
    role: "ORACLE RED BULL RACING FORMULA 1 DRIVER",
    detail: {
      profileTitle: "Career Overview and Driver Profile",
      profileParagraphs:
        "Isack Hadjar is a French Formula 1 driver competing at the pinnacle of motorsport since 2025. Recognised as one of the most exciting young talents of his generation, Isack Hadjar's career path reflects determination, speed, and a relentless drive for excellence. After an impressive rookie season in Formula One highlighted by a podium finish with Visa Cash App Racing Bulls F1 Team, Hadjar earned a highly anticipated promotion to Red Bull Racing for the 2026 Formula 1 season.",
      careerTitle: "Early Career and Foundations in France",
      careerParagraphs:
        "Born in France and raised around Paris, Isack Hadjar began his motorsport career in karting, competing mostly in his home country where he quickly established himself as a promising young talent.\n\nThe true breakthrough came in the Formula Regional European Championship, where a stunning victory at Monaco caught the eye of the Red Bull Junior Team. Following his Monaco success, Red Bull officially backed Hadjar, integrating him into its driver development structure.\n\nAs part of the Red Bull Junior Team, Isack Hadjar moved to the FIA Formula 3 Championship, where he fought for the title until the final rounds. He then advanced to FIA Formula 2, securing the Vice-Champion title — firmly establishing him as one of the strongest prospects in the Red Bull driver pool.\n\nIn 2025, Isack made his Formula 1 debut with Visa Cash App Racing Bulls F1 Team, securing a remarkable podium finish — a rare achievement for a first-year driver.",
      transitionTitle: "Promotion to Red Bull Racing for 2026",
      transitionParagraph:
        "Following his standout rookie campaign, Red Bull Racing confirmed Isack Hadjar as a race driver for the 2026 Formula 1 season. This promotion marks a major milestone in Isack Hadjar's career and places him within one of the most competitive teams in Formula 1 history.",
      agencyTitle: "Isack Hadjar and The Grid Agency",
      agencyParagraphs:
        "Isack Hadjar's career is closely supported by The Grid Agency across sporting, commercial, and personal branding dimensions. The partnership reflects The Grid's commitment to managing elite Formula 1 talent with long-term vision and strategic expertise.",
    },
  },
  // Seed uses "fred-makowiecki" slug — try both
  "fred-makowiecki": {
    role: "ALPINE ENDURANCE TEAM WEC DRIVER",
    detail: {
      profileTitle: "Career Overview and Driver Profile",
      profileParagraphs:
        "Frédéric Makowiecki is a French professional racing driver competing at the highest level of international endurance racing. Recognised globally for his technical expertise, consistency, and elite racecraft, Frédéric Makowiecki's career is widely regarded as one of the most accomplished and respected paths in modern GT and endurance racing.\n\nBorn on November 22, 1980, in Arras, France, his career transitioned early into GT racing — a decision that would ultimately define his identity as one of the world's leading endurance specialists. His reputation reached a new level when Autosport described him as 'The Best GT Driver in the World'.",
      careerTitle: "Factory Driver Career",
      careerParagraphs:
        "Frédéric Makowiecki has represented Aston Martin in the FIA GT World Championship, Nissan and Honda in the Japanese Super GT Championship, Porsche in both the FIA World Endurance Championship (WEC) and IMSA WeatherTech SportsCar Championship, and more recently Alpine in the same championships.\n\nIn 2026, Frédéric Makowiecki continues his endurance racing journey with Alpine in the FIA World Endurance Championship, marking his second consecutive season with the French manufacturer.",
      agencyTitle: "Frederic Makowiecki and The Grid Agency",
      agencyParagraphs:
        "Frédéric Makowiecki's career is managed and strategically developed by The Grid Agency, providing comprehensive support across sporting, technical, and commercial dimensions. The Grid Agency works closely with Makowiecki to optimise career strategy and manufacturer positioning, contract negotiations and long-term programme alignment, performance structure and technical collaboration, and brand development within international endurance racing.",
    },
  },
  "kush-maini": {
    role: "ART GRAND PRIX FORMULA 2 DRIVER — BWT ALPINE F1 TEAM & MAHINDRA FE TEAM RESERVE DRIVER",
    detail: {
      profileTitle: "Indian Formula 2 Driver & Alpine F1 Reserve",
      profileParagraphs:
        "Kush Maini is an Indian racing driver competing at the highest levels of international motorsport. Currently racing in the FIA Formula 2 Championship with ART Grand Prix, he also serves as Reserve Driver for the BWT Alpine F1 Team and the Mahindra Formula E Team.\n\nKush began in karting, then British F3 where he secured Vice-Champion in 2020. Across his first three Formula 2 seasons, he achieved seven podium finishes, two race victories, and one pole position. Kush Maini joined The Grid Agency in 2024.",
      agencyTitle: "Kush Maini and The Grid Agency",
      agencyParagraphs:
        "As Reserve Driver for the BWT Alpine F1 Team, Kush plays an active role in simulator development, technical feedback, and Formula 1 testing preparation. His dual involvement with Alpine F1 and Mahindra Formula E demonstrates the trust placed in him by major international manufacturers.",
    },
  },
  "alessandro-giusti": {
    role: "MP MOTORSPORT FORMULA 3 DRIVER — WILLIAMS RACING DRIVER ACADEMY TALENT",
    detail: {
      profileTitle: "Career – French FIA Formula 3 Driver & Williams Academy Talent",
      profileParagraphs:
        "Alessandro Giusti is one of the most promising young French racing drivers of his generation. Currently competing in the FIA Formula 3 Championship with MP Motorsport, he previously dominated the French Formula 4 Championship.\n\nIn 2021, he won the Junior title in French F4 at just 14 years old. He returned in 2022 to win the championship title outright. In FRECA, he secured three race victories and two pole positions. Moving to ART Grand Prix, he finished 4th in FRECA.\n\nIn FIA Formula 3, he secured two podium finishes and finished P10 in the championship in his debut season, recording more top-10 race finishes than any other driver. In 2024, he joined the Williams Racing Driver Academy. Alessandro Giusti joined The Grid Agency at the end of the 2024 season.",
      agencyTitle: "Alessandro Giusti and The Grid Agency",
      agencyParagraphs:
        "Alessandro Giusti's career is supported by The Grid Agency with a structured development pathway aimed at Formula 2 and ultimately Formula 1. With Williams Academy backing and proven speed across multiple categories, the focus is on consistent front-running performances at international level.",
    },
  },
  "enzo-deligny": {
    role: "VAN AMERSFOORT RACING FORMULA 3 DRIVER",
    detail: {
      profileTitle: "Career – French Racing Driver Progressing Toward FIA Formula 3",
      profileParagraphs:
        "Enzo Deligny was born to a Chinese mother and a French father, growing up between Shanghai and California. In Spanish Formula 4, he finished fourth overall while claiming the Rookie Champion title.\n\nIn FRECA with R-ace GP, he delivered a standout 2025 season: four race victories, four pole positions, nine podiums, and third overall in the championship. He also delivered a spectacular third-place finish at the Macau Grand Prix.\n\nThe next chapter is FIA Formula 3 with Van Amersfoort Racing.",
      agencyTitle: "Enzo Deligny and The Grid Agency",
      agencyParagraphs:
        "The Grid Agency supports Enzo Deligny's career development with long-term strategic vision as he steps into FIA Formula 3 competition.",
    },
  },
  "andrea-dupe": {
    role: "VAN AMERSFOORT RACING FREC DRIVER",
    detail: {
      profileTitle: "Career – French Driver Stepping Up to Formula Regional",
      profileParagraphs:
        "Andrea Dupe is a young French racing driver who has stepped up to the Formula Regional European Championship (FRECA) with Van Amersfoort Racing. A graduate of Formula 4, Andrea has shown consistent pace and racecraft across multiple junior categories.",
      agencyTitle: "Andrea Dupe and The Grid Agency",
      agencyParagraphs:
        "The Grid Agency supports Andrea Dupe's development with a structured pathway through the junior single-seater ladder toward Formula 2 and beyond.",
    },
  },
  "nathan-tye": {
    role: "DRIVEX FORMULA 4 DRIVER",
    detail: {
      profileTitle: "Career – British Formula 4 Driver",
      profileParagraphs:
        "Nathan Tye is a British racing driver competing in Formula 4 with Drivex. Progressing through the junior karting ranks, Nathan brings strong racecraft and determination to his single-seater career.",
      agencyTitle: "Nathan Tye and The Grid Agency",
      agencyParagraphs:
        "The Grid Agency supports Nathan Tye's career with strategic guidance and commercial development as he builds his profile in international motorsport.",
    },
  },
  "vivek-kanthan": {
    role: "CAMPOS RACING FORMULA 4 DRIVER",
    detail: {
      profileTitle: "Career – American Formula 4 Driver",
      profileParagraphs:
        "Vivek Kanthan is an American racing driver competing in Formula 4 with Campos Racing. After a strong karting background, Vivek has transitioned into single-seater competition, showing consistent development across the season.",
      agencyTitle: "Vivek Kanthan and The Grid Agency",
      agencyParagraphs:
        "The Grid Agency provides Vivek Kanthan with comprehensive support across sporting and commercial dimensions, guiding his progression through the junior motorsport ladder.",
    },
  },
  "jack-iliffe": {
    role: "FFSA FORMULA 4 DRIVER",
    detail: {
      profileTitle: "Career – American Driver in French Formula 4",
      profileParagraphs:
        "Jack Iliffe is an American racing driver competing in the FFSA Formula 4 Championship. Building on a strong karting background, Jack has shown impressive adaptability and pace in his single-seater debut.",
      agencyTitle: "Jack Iliffe and The Grid Agency",
      agencyParagraphs:
        "The Grid Agency supports Jack Iliffe's career with strategic development and commercial guidance as he establishes himself in international junior motorsport.",
    },
  },
  "louis-cochet": {
    role: "MP MOTORSPORT FORMULA 4 DRIVER",
    detail: {
      profileTitle: "Career – French Formula 4 Driver",
      profileParagraphs:
        "Louis Cochet is a young French racing driver competing in Formula 4 with MP Motorsport. A product of the French karting scene, Louis combines natural speed with strong racecraft as he makes his mark in single-seater competition.",
      agencyTitle: "Louis Cochet and The Grid Agency",
      agencyParagraphs:
        "The Grid Agency guides Louis Cochet's career with a long-term vision focused on progression through the junior single-seater ladder toward Formula 3 and beyond.",
    },
  },
  "luka-scelles": {
    role: "VICTORY LANE OK DRIVER",
    detail: {
      profileTitle: "Career – French Karting Talent",
      profileParagraphs:
        "Luka Scelles is a French karting driver competing in the OK category with Victory Lane. Recognised for his natural talent and competitive instincts, Luka is establishing himself as one of the most promising karting prospects of his generation.",
      agencyTitle: "Luka Scelles and The Grid Agency",
      agencyParagraphs:
        "The Grid Agency supports Luka Scelles through his elite karting programme, preparing him for the transition to single-seater competition.",
    },
  },
  "alex-truchot": {
    role: "PREMA RACING OK-J DRIVER",
    detail: {
      profileTitle: "Career – French-American Karting Talent",
      profileParagraphs:
        "Alessandro Truchot is a French-American karting driver competing in the OK-J category with Prema Racing. With dual roots in France and the United States, Alessandro brings an international perspective to his karting career.",
      agencyTitle: "Alessandro Truchot and The Grid Agency",
      agencyParagraphs:
        "The Grid Agency supports Alessandro Truchot's development across sporting and commercial dimensions, building the foundations for a professional motorsport career.",
    },
  },
  "stan-ratajski": {
    role: "KART REPUBLIC OK-J DRIVER",
    detail: {
      profileTitle: "Career – Polish-French Karting Champion",
      profileParagraphs:
        "Stan Ratajski is a Polish-French karting driver competing in the OK-J category with Kart Republic. With championship wins in the Trofeo Della Industria, WSK Open, Coppa Italia, and France NSK, Stan has demonstrated exceptional consistency and winning ability at the highest level of junior karting.",
      agencyTitle: "Stan Ratajski and The Grid Agency",
      agencyParagraphs:
        "The Grid Agency manages Stan Ratajski's sporting and commercial development, providing the structure and support needed for his progression through international karting and into single-seater racing.",
    },
  },
};

// ─── main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🔐 Logging in to ${BASE}…`);
  const cookies = await login();
  console.log("✅ Logged in\n");

  // ── Homepage ────────────────────────────────────────────────────────────────
  console.log("📄 Updating homepage global…");
  const existingHome = await getGlobal(cookies, "homepage");
  const homeServiceLabels = mergeArray(
    existingHome.serviceLabels || [],
    HOMEPAGE_UPDATES.serviceLabels,
  );
  await postGlobal(cookies, "homepage", {
    heroTitle: HOMEPAGE_UPDATES.heroTitle,
    aboutText: HOMEPAGE_UPDATES.aboutText,
    serviceLabels: homeServiceLabels,
    driversHeading: HOMEPAGE_UPDATES.driversHeading,
    driversHeadingAccent: HOMEPAGE_UPDATES.driversHeadingAccent,
  });

  // ── About Page ──────────────────────────────────────────────────────────────
  console.log("📄 Updating about-page global…");
  const existingAbout = await getGlobal(cookies, "about-page");
  const aboutCoreAreas = mergeArray(
    existingAbout.coreAreas || [],
    ABOUT_PAGE_UPDATES.coreAreas,
    "number",
  );
  await postGlobal(cookies, "about-page", {
    heroTitle: ABOUT_PAGE_UPDATES.heroTitle,
    heroDescription: ABOUT_PAGE_UPDATES.heroDescription,
    coreIntroText: ABOUT_PAGE_UPDATES.coreIntroText,
    coreAreas: aboutCoreAreas,
    founderBio: ABOUT_PAGE_UPDATES.founderBio,
    founderName: ABOUT_PAGE_UPDATES.founderName,
    founderRole: ABOUT_PAGE_UPDATES.founderRole,
    founderLinkedinUrl: ABOUT_PAGE_UPDATES.founderLinkedinUrl,
    accelereDescription: ABOUT_PAGE_UPDATES.accelereDescription,
    accelereQuote: ABOUT_PAGE_UPDATES.accelereQuote,
    accelereQuoteAuthor: ABOUT_PAGE_UPDATES.accelereQuoteAuthor,
    accelereQuoteRole: ABOUT_PAGE_UPDATES.accelereQuoteRole,
    accelereQuoteTitle: ABOUT_PAGE_UPDATES.accelereQuoteTitle,
  });

  // ── Services Page ───────────────────────────────────────────────────────────
  console.log("📄 Updating services-page global…");
  const existingServices = await getGlobal(cookies, "services-page");

  // Talent cards: need to handle the case where Performance card might not exist yet
  // Match by title, falling back to index
  const existingTalentCards = existingServices.talentCards || [];
  const newTalentCards = SERVICES_PAGE_UPDATES.talentCards.map((update) => {
    const existing = existingTalentCards.find(
      (e) => e.title?.toLowerCase() === update.title.toLowerCase(),
    );
    if (existing) {
      return { ...existing, title: update.title, description: update.description };
    }
    // For "Performance" card which might not exist yet: inherit image from first existing card
    const fallbackTalentImage =
      existingTalentCards.find((e) => e.image)?.image || "/assets/v2/services/talent-mentorship.webp";
    return {
      title: update.title,
      description: update.description,
      image: fallbackTalentImage,
    };
  });

  const existingValueCards = existingServices.valueCards || [];
  const newValueCards = SERVICES_PAGE_UPDATES.valueCards.map((update, i) => {
    const existing =
      existingValueCards.find((e) => e.title?.replace(/\n/g, " ") === update.title) ||
      existingValueCards[i];
    if (existing) {
      return { ...existing, title: update.title, description: update.description };
    }
    const fallbackValueImage =
      existingValueCards.find((e) => e.image)?.image || "/assets/v2/services/value-partnerships.webp";
    return { title: update.title, description: update.description, image: fallbackValueImage };
  });

  const existingCaseStudies = existingServices.caseStudies || [];
  // Collect fallback image from any existing case study (required field)
  const fallbackCaseImage =
    existingCaseStudies.find((e) => e.image)?.image || "/assets/v2/services/case-center.webp";
  const newCaseStudies = SERVICES_PAGE_UPDATES.caseStudies.map((update, i) => {
    const existing =
      existingCaseStudies.find((e) => e.title === update.title) || existingCaseStudies[i];
    if (existing) {
      return { ...existing, title: update.title, description: update.description };
    }
    return { title: update.title, description: update.description, image: fallbackCaseImage };
  });

  // Note: avoid spreading full existingServices (depth=1 resolves relationships which causes 500s).
  // Payload's POST global merges at the top level — only send fields we want to change.
  await postGlobal(cookies, "services-page", {
    heroTitle: SERVICES_PAGE_UPDATES.heroTitle,
    heroDescription: SERVICES_PAGE_UPDATES.heroDescription,
    talentHeading: SERVICES_PAGE_UPDATES.talentHeading,
    talentHeadingAccent: SERVICES_PAGE_UPDATES.talentHeadingAccent,
    talentDescription: SERVICES_PAGE_UPDATES.talentDescription,
    talentCards: newTalentCards,
    partnerDescription: SERVICES_PAGE_UPDATES.partnerDescription,
    valueHeading: SERVICES_PAGE_UPDATES.valueHeading,
    valueHeadingAccent: SERVICES_PAGE_UPDATES.valueHeadingAccent,
    valueDescription: SERVICES_PAGE_UPDATES.valueDescription,
    valueCards: newValueCards,
    caseStudies: newCaseStudies,
  });

  // ── Team Members ────────────────────────────────────────────────────────────
  console.log("\n👤 Updating team members…");
  for (const [name, updates] of Object.entries(TEAM_UPDATES)) {
    const doc = await findDocs(cookies, "team-members", { name }, "en");
    if (!doc) {
      console.warn(`  ⚠️  team-member not found: "${name}"`);
      continue;
    }
    const ok = await patchDoc(cookies, "team-members", doc.id, updates, "en");
    console.log(ok ? `  ✅ team-member: ${name}` : `  ❌ team-member: ${name}`);
  }

  // ── Drivers ─────────────────────────────────────────────────────────────────
  console.log("\n🏎️  Updating drivers…");
  for (const [slug, updates] of Object.entries(DRIVER_UPDATES)) {
    const doc = await findDocs(cookies, "drivers", { slug }, "en");
    if (!doc) {
      // Try alternate slug (frederic-makowiecki vs fred-makowiecki)
      if (slug === "fred-makowiecki") {
        const alt = await findDocs(cookies, "drivers", { slug: "frederic-makowiecki" }, "en");
        if (alt) {
          const ok = await patchDoc(cookies, "drivers", alt.id, updates, "en");
          console.log(ok ? `  ✅ driver: frederic-makowiecki` : `  ❌ driver: frederic-makowiecki`);
          continue;
        }
      }
      if (slug === "alex-truchot") {
        const alt = await findDocs(cookies, "drivers", { slug: "alessandro-truchot" }, "en");
        if (alt) {
          const ok = await patchDoc(cookies, "drivers", alt.id, updates, "en");
          console.log(
            ok ? `  ✅ driver: alessandro-truchot` : `  ❌ driver: alessandro-truchot`,
          );
          continue;
        }
      }
      console.warn(`  ⚠️  driver not found: "${slug}"`);
      continue;
    }
    const ok = await patchDoc(cookies, "drivers", doc.id, updates, "en");
    console.log(ok ? `  ✅ driver: ${slug}` : `  ❌ driver: ${slug}`);
  }

  console.log("\n✅ All EN content updates complete.\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
