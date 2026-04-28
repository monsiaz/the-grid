import { getPayloadClient } from "@/lib/payload";
import { NextResponse } from "next/server";

export const maxDuration = 300;

export async function POST(request: Request) {
  const expectedSecret = process.env.TRANSLATE_SECRET || process.env.PAYLOAD_SECRET;
  const provided =
    request.headers.get("x-translate-secret") ||
    new URL(request.url).searchParams.get("secret") ||
    "";
  if (process.env.NODE_ENV === "production" && (!expectedSecret || provided !== expectedSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const upsert = url.searchParams.get("upsert") === "1" || url.searchParams.get("upsert") === "true";

  const payload = await getPayloadClient();
  const adminEmail = process.env.PAYLOAD_ADMIN_EMAIL || "admin@thegrid.agency";
  const adminPassword = process.env.PAYLOAD_ADMIN_PASSWORD || "changeme123";

  // Create admin user
  const existingUsers = await payload.find({ collection: "users", limit: 1 });
  if (existingUsers.totalDocs === 0) {
    await payload.create({
      collection: "users",
      data: {
        email: adminEmail,
        password: adminPassword,
      },
    });
  }

  // Seed drivers
  const driversCards = [
    { slug: "pierre-gasly", name: "PIERRE GASLY", role: "BWT ALPINE FORMULA 1 DRIVER", image: "/assets/v2/drivers/icones/driver-01-gasly.webp", flags: ["FR" as const], instagramUrl: "https://www.instagram.com/pierregasly/", order: 1, gridRow: 1 },
    { slug: "isack-hadjar", name: "ISACK HADJAR", role: "ORACLE RED BULL RACING FORMULA 1 DRIVER", image: "/assets/v2/drivers/icones/driver-02-hadjar.webp", flags: ["FR" as const], instagramUrl: "https://www.instagram.com/isackhadjar/", order: 2, gridRow: 1 },
    { slug: "kush-maini", name: "KUSH MAINI", role: "ART GRAND PRIX FORMULA 2 DRIVER BWT ALPINE F1 TEAM & MAHINDRA FE TEAM RESERVE DRIVER", image: "/assets/v2/drivers/icones/driver-03-maini.webp", flags: ["IN" as const], instagramUrl: "https://www.instagram.com/kushmaini/", order: 3, gridRow: 1 },
    { slug: "fred-makowiecki", name: "FRED MAKOWIECKI", role: "ALPINE ENDURANCE TEAM WEC DRIVER", image: "/assets/v2/drivers/icones/driver-04-makowiecki.webp", flags: ["FR" as const], instagramUrl: "https://www.instagram.com/fredmakowiecki/", order: 4, gridRow: 1 },
    { slug: "alessandro-giusti", name: "ALESSANDRO GIUSTI", role: "MP MOTORSPORT FORMULA 3 DRIVER WILLIAMS RACING DRIVER ACADEMY TALENT", image: "/assets/v2/drivers/icones/driver-05-giusti.webp", flags: ["FR" as const], instagramUrl: "https://www.instagram.com/alessandrogiusti_/", order: 5, gridRow: 2 },
    { slug: "enzo-deligny", name: "ENZO DELIGNY", role: "VAN AMERSFOORT RACING FORMULA 3 DRIVER", image: "/assets/v2/drivers/icones/driver-06-deligny.webp", flags: ["FR" as const], instagramUrl: "https://www.instagram.com/enzo.deligny/", order: 6, gridRow: 2 },
    { slug: "andrea-dupe", name: "ANDREA DUPE", role: "VAN AMERSFOORT RACING FREC DRIVER", image: "/assets/v2/drivers/icones/driver-07-dupe.webp", flags: ["FR" as const], instagramUrl: "https://www.instagram.com/andrea.dupe/", order: 7, gridRow: 2 },
    { slug: "nathan-tye", name: "NATHAN TYE", role: "DRIVEX FORMULA 4 DRIVER", image: "/assets/v2/drivers/icones/driver-08-tye.webp", flags: ["GB" as const], instagramUrl: "https://www.instagram.com/nathantye_", order: 8, gridRow: 2 },
    { slug: "vivek-kanthan", name: "VIVEK KANTHAN", role: "CAMPOS RACING FORMULA 4 DRIVER", image: "/assets/v2/drivers/icones/driver-09-kanthan.webp", flags: ["US" as const], instagramUrl: "https://www.instagram.com/vivekkanthan/", order: 9, gridRow: 3 },
    { slug: "jack-iliffe", name: "JACK ILIFFE", role: "FFSA FORMULA 4 DRIVER", image: "/assets/v2/drivers/icones/driver-10-iliffe.webp", flags: ["US" as const], instagramUrl: "https://www.instagram.com/jackiliffe/", order: 10, gridRow: 3 },
    { slug: "louis-cochet", name: "LOUIS COCHET", role: "MP MOTORSPORT FORMULA 4 DRIVER", image: "/assets/v2/drivers/icones/driver-11-cochet.webp", flags: ["FR" as const], instagramUrl: "https://www.instagram.com/louis.cochet/", order: 11, gridRow: 3 },
    { slug: "luka-scelles", name: "LUKA SCELLES", role: "VICTORY LANE OK DRIVER", image: "/assets/v2/drivers/icones/driver-12-scelles.webp", flags: ["FR" as const], instagramUrl: "https://www.instagram.com/lukascelles/", order: 12, gridRow: 3 },
    { slug: "alex-truchot", name: "ALEX TRUCHOT", role: "PREMA RACING OK-J DRIVER", image: "/assets/v2/drivers/icones/driver-13-truchot.webp", flags: ["FR" as const, "US" as const], instagramUrl: "https://www.instagram.com/alextruchot/", order: 13, gridRow: 4 },
    { slug: "stan-ratajski", name: "STAN RATAJSKI", role: "KART REPUBLIC OK-J DRIVER", image: "/assets/v2/drivers/icones/driver-14-ratajski.webp", flags: ["FR" as const, "PL" as const], instagramUrl: "https://www.instagram.com/stanratajski/", order: 14, gridRow: 4 },
  ];

  const gaslyDetail = {
    profileTitle: "Career Overview and Driver Profile",
    profileParagraphs: "Pierre Gasly is a French Formula 1 driver competing in the FIA Formula One World Championship with the BWT Alpine F1 Team. Widely recognised for his resilience, technical feedback, and racecraft, Pierre Gasly's career stands as one of the most compelling comeback stories in modern Formula One.\nBorn on February 7, 1996, in Rouen, France, Pierre Gasly began his racing career at a young age, progressing through the highly competitive European karting scene before transitioning into single-seater racing. His early years showcased a rare blend of speed, discipline, and adaptability, qualities that would later define Pierre Gasly's Formula One career.\nClimbing the junior single-seater ladder, Gasly made his mark in Formula Renault and Formula 3, before achieving international recognition by winning the 2016 GP2 Series championship (now known as FIA Formula 2). That title firmly established him as one of the most promising French drivers of his generation and opened the door to a full-time Formula One career.",
    careerTitle: "Pierre Gasly's Formula One Career",
    careerParagraphs: "Pierre Gasly made his Formula One debut in 2017 as a Red Bull Junior Team driver racing with Scuderia Toro Rosso. From the outset, his raw pace and technical understanding impressed across the paddock, particularly his stunning P4 in Bahrain. His breakthrough moment came during the 2019 season when he secured his first Formula One podium, confirming his ability to compete at the highest level of motorsport.\nIn 2020, Pierre Gasly's career reached a historic milestone. At the Italian Grand Prix in Monza, he delivered a flawless performance to claim victory, becoming the first French driver to win a Formula One race since 1996. That win not only cemented his place in F1 history but also symbolised his resilience and mental strength following earlier career challenges.\nOver multiple seasons with Scuderia AlphaTauri, Gasly became the team's highest points scorer of all time, consistently outperforming expectations and earning a reputation as one of the most dependable and technically astute drivers on the grid. His ability to extract maximum performance from the car, even in difficult conditions, turned him into a clear fan favourite and a respected figure among engineers and team principals alike.",
    transitionTitle: "Transition to Alpine and Ongoing Career Development",
    transitionParagraph: "Pierre Gasly joined the BWT Alpine F1 Team with the ambition of continuing his upward trajectory and contributing to the long-term growth of a French manufacturer in Formula One. Since his move, Pierre Gasly's career has been defined by consistency, leadership, and continued podium finishes, reinforcing his status as a cornerstone driver for the team's future.",
    agencyTitle: "Pierre Gasly and The Grid Agency",
    agencyParagraphs: "Pierre Gasly's relationship with The Grid Agency spans more than a decade and represents a rare, holistic approach to driver management. From the earliest stages of his career to the pinnacle of Formula One, The Grid has been involved across every dimension of his professional development.\nThroughout Pierre Gasly's career, The Grid Agency has supported him as coaches, race engineers, technical advisors, simulator coaches, and today as career and commercial managers. This long-term collaboration has allowed for a deep understanding of Pierre's performance mindset, career objectives, and brand positioning within global motorsport.\nThe partnership is built on trust, continuity, and shared ambition, navigating both the highs of race victories and the challenges inherent to elite competition. Together, Pierre Gasly and The Grid Agency continue to shape a career defined by performance excellence, strategic growth, and long-term vision in Formula One.",
    highestFinish: "01",
    careerPoints: "458",
    grandPrixEntered: "177",
    careerPodiums: "05",
    profileImage: "/images/drivers/detail-profile-gasly.webp",
    careerImage: "/images/drivers/detail-career-image.webp",
    agencyImage: "/images/drivers/detail-agency-image.webp",
    galleryLeft: "/images/drivers/detail-gallery-left.webp",
    galleryCenter: "/images/drivers/detail-gallery-main.webp",
    galleryRight: "/images/drivers/detail-gallery-right.webp",
  };

  const gaslyDetailNews = [
    { title: "PIERRE GASLY'S ABU DHABI SPECIAL HELMET", image: "/images/drivers/detail-news-1.webp" },
    { title: "SPECIAL HELMET DESIGN FOR PIERRE GASLY IN BRAZIL", image: "/images/drivers/detail-news-2.webp" },
    { title: "PIERRE GASLY X H. MOSER & CIE: AN EXCLUSIVE TIMEPIECE", image: "/images/drivers/detail-news-3.webp" },
  ];

  const existingDrivers = await payload.find({ collection: "drivers", limit: 1 });
  if (existingDrivers.totalDocs === 0 || upsert) {
    for (const driver of driversCards) {
      const isGasly = driver.slug === "pierre-gasly";
      const data = {
        ...driver,
        detail: isGasly ? gaslyDetail : {},
        detailNews: isGasly ? gaslyDetailNews : [],
      };
      const existing = await payload.find({
        collection: "drivers",
        where: { slug: { equals: driver.slug } },
        limit: 1,
        locale: "en",
      });
      if (existing.totalDocs === 0) {
        await payload.create({ collection: "drivers", data, locale: "en" });
      } else if (upsert) {
        await payload.update({
          collection: "drivers",
          id: existing.docs[0].id,
          data,
          locale: "en",
        });
      }
    }
  }

  // Seed news
  const newsCards = [
    { slug: "stan-ratajski-joins-the-grid-agency", title: "STAN RATAJSKI JOINS THE GRID AGENCY", listImage: "/images/news/list-1.webp", category: "sporting" as const },
    { slug: "enzo-steps-into-formula-3-with-van-amersfoort-racing-for-2026", title: "ENZO STEPS INTO FORMULA 3 WITH VAN AMERSFOORT RACING FOR 2026", listImage: "/images/news/list-2.webp", category: "sporting" as const },
    { slug: "andrea-dupe-steps-up-to-formula-regional-european-championship", title: "ANDREA DUPE STEPS UP TO FORMULA REGIONAL EUROPEAN CHAMPIONSHIP WITH VAN AMERSFOORT RACING", listImage: "/images/news/list-3.webp", category: "sporting" as const },
    { slug: "alessandro-giusti-steps-into-the-spotlight-with-jaguar-racing-in-miami", title: "ALESSANDRO GIUSTI STEPS INTO THE SPOTLIGHT WITH JAGUAR RACING IN MIAMI", listImage: "/images/news/list-4.webp", category: "commercial" as const },
    { slug: "isack-hadjar-spotlighted-on-gq-middle-east-hype-cover", title: "ISACK HADJAR SPOTLIGHTED ON GQ MIDDLE EAST HYPE COVER AS GQ MOTY HONOREE", listImage: "/images/news/list-5.webp", category: "commercial" as const },
    { slug: "gasly-extends-his-contract-with-bwt-alpine-f1-team", title: "GASLY EXTENDS HIS CONTRACT WITH BWT ALPINE F1 TEAM", listImage: "/images/news/list-6.webp", category: "sporting" as const },
    { slug: "alessandro-truchot-joins-the-grid-agency", title: "ALESSANDRO TRUCHOT JOINS THE GRID AGENCY", listImage: "/images/news/list-7.webp", category: "sporting" as const },
    { slug: "alpine-reveals-a526-livery-as-gasly-prepares-for-2026", title: "ALPINE REVEALS A526 LIVERY AS GASLY PREPARES FOR 2026", listImage: "/images/news/list-8.webp", category: "sporting" as const },
    { slug: "isack-hadjar-and-the-2026-red-bull-racing-livery", title: "ISACK HADJAR AND THE 2026 RED BULL RACING LIVERY", listImage: "/images/news/list-9.webp", category: "sporting" as const },
    { slug: "andrea-dupe-joins-the-grid-agency", title: "ANDREA DUPE JOINS THE GRID AGENCY", listImage: "/images/news/list-10.webp", category: "sporting" as const },
    { slug: "isack-hadjar-on-the-cover-of-esses-mag-issue-4", title: "ISACK HADJAR ON THE COVER OF ESSES MAG - ISSUE 4", listImage: "/images/news/list-11.webp", category: "commercial" as const },
    { slug: "drivers-confirmed-for-the-2026-spanish-f4-championship", title: "DRIVERS CONFIRMED FOR THE 2026 SPANISH F4 CHAMPIONSHIP", listImage: "/images/news/list-12.webp", category: "sporting" as const },
    { slug: "pierre-gasly-abu-dhabi-special-helmet", title: "PIERRE GASLY'S ABU DHABI SPECIAL HELMET", listImage: "/images/news/list-13.webp", category: "commercial" as const },
    { slug: "abu-dhabi-post-season-test", title: "ABU DHABI POST-SEASON TEST", listImage: "/images/news/list-14.webp", category: "sporting" as const },
    { slug: "kush-maini-to-drive-for-alpine-f1-test", title: "KUSH MAINI TO DRIVE FOR ALPINE F1 TEST", listImage: "/images/news/list-15.webp", category: "sporting" as const },
    { slug: "isack-hadjar-to-race-for-red-bull-in-2026", title: "ISACK HADJAR TO RACE FOR RED BULL IN 2026", listImage: "/images/news/list-16.webp", category: "sporting" as const },
    { slug: "new-talent-joining-the-grid-junior-class", title: "NEW TALENT JOINING THE GRID", listImage: "/images/news/list-17.webp", category: "sporting" as const },
    { slug: "special-helmet-design-for-pierre-gasly-in-brazil", title: "SPECIAL HELMET DESIGN FOR PIERRE GASLY IN BRAZIL", listImage: "/images/news/list-18.webp", category: "commercial" as const },
    { slug: "deligny-shines-in-macau", title: "DELIGNY SHINES IN MACAU", listImage: "/images/news/list-19.webp", category: "sporting" as const },
    { slug: "new-talent-joining-the-grid-karting-program", title: "NEW TALENT JOINING THE GRID", listImage: "/images/news/list-20.webp", category: "sporting" as const },
    { slug: "p3-in-freca-for-deligny", title: "P3 IN FRECA FOR DELIGNY", listImage: "/images/news/list-21.webp", category: "sporting" as const },
    { slug: "solid-weekend-for-kanthan-at-valencia", title: "SOLID WEEKEND FOR KANTHAN AT VALENCIA", listImage: "/images/news/list-22.webp", category: "sporting" as const },
  ];

  const stanDetail = {
    date: "FEB 17, 2026",
    heroImage: "/images/news/detail-1.webp",
    introParagraphs: "Stan Ratajski continues his rise through international karting as he joins The Grid Agency, bringing with him a record that already places him among the most competitive drivers of his generation.\nPolish and French, the 12-year-old is currently stepping into the OK-J category, where he is making his debut with Kart Republic in the WSK Super Master Series. This transition marks a significant milestone, placing him in one of the most demanding junior karting environments on the international calendar.\nBefore this move, Stan built an exceptional resume in the Mini category, competing at the highest level across Europe. His results speak with clarity. Champion of the Trofeo Della Industria in 2025, WSK Open in 2024, Coppa Italia, and France NSK in 2022, he has repeatedly demonstrated his ability to win against strong international fields. Alongside these titles, multiple vice-champion finishes in WSK Final Cup, WSK Euro Series, and the Italian Championship underline a level of consistency that is rare at such a young age.",
    bodyParagraphs: "What stands out is not only the number of trophies, but the regularity with which Stan has remained at the front in highly competitive series. Across seasons and championships, he has shown an ability to deliver results under pressure and to remain a constant reference point within his category.\nNow competing in OK-J, Stan enters a new phase of his development, where the margins are tighter and the competition sharper. With a solid foundation already established in international karting, this step represents progression rather than transition.\nAlready a proven winner, Stan Ratajski moves forward with momentum, focus, and a clear trajectory toward the next levels of the sport.",
    galleryImages: [
      { image: "/images/news/detail-2.webp" },
      { image: "/images/news/detail-3.webp" },
      { image: "/images/news/detail-4.webp" },
      { image: "/images/news/detail-5.webp" },
      { image: "/images/news/detail-6.webp" },
    ],
  };

  const existingNews = await payload.find({ collection: "news", limit: 1 });
  if (existingNews.totalDocs === 0 || upsert) {
    for (const article of newsCards) {
      const isStan = article.slug === "stan-ratajski-joins-the-grid-agency";
      const data = {
        ...article,
        ...(isStan ? stanDetail : {}),
      };
      const existing = await payload.find({
        collection: "news",
        where: { slug: { equals: article.slug } },
        limit: 1,
        locale: "en",
      });
      if (existing.totalDocs === 0) {
        await payload.create({ collection: "news", data, locale: "en" });
      } else if (upsert) {
        await payload.update({
          collection: "news",
          id: existing.docs[0].id,
          data,
          locale: "en",
        });
      }
    }
  }

  // Seed / upsert team members (ensures LinkedIn URLs are kept in sync with client feedback).
  const TEAM_LINKEDIN: Record<string, string> = {
    "Jérémy Satis": "https://www.linkedin.com/in/j%C3%A9r%C3%A9my-satis-7a386294/",
    "Laura Fredel": "https://www.linkedin.com/in/laura-fredel-35b27a1b8/",
  };
  const TEAM_DEFAULTS = [
    {
      name: "Guillaume Le Goff",
      role: "Founder & Partner",
      image: "/assets/v2/about/guillaume-le-goff.webp",
      linkedinUrl: "https://www.linkedin.com/in/glegoff/",
      bio: "With 20 years of experience in motorsport, Guillaume has worked across multiple roles in the paddock. He served as a simulation & race engineer for ART Grand Prix for six years before co-founding AOTech — a company specialising in simulators, aerodynamics, and composite parts manufacturing — in 2010. After a two-year stint at McLaren in a business development position, Guillaume went on to found Soter Analytics, a tech start-up, and The Grid Agency simultaneously in 2018. Both businesses thrived, and Guillaume chose to focus exclusively on The Grid in 2021.",
      order: 1,
    },
    {
      name: "Jérémy Satis",
      role: "Driver Agent",
      image: "/assets/v2/about/team-jeremy.webp",
      linkedinUrl: TEAM_LINKEDIN["Jérémy Satis"],
      order: 2,
    },
    {
      name: "Laura Fredel",
      role: "Marketing Associate",
      image: "/assets/v2/about/team-laura.webp",
      linkedinUrl: TEAM_LINKEDIN["Laura Fredel"],
      order: 3,
    },
  ];
  for (const member of TEAM_DEFAULTS) {
    const existing = await payload.find({
      collection: "team-members",
      where: { name: { equals: member.name } },
      limit: 1,
      locale: "en",
    });
    if (existing.totalDocs === 0) {
      await payload.create({ collection: "team-members", data: member, locale: "en" });
    } else if (upsert) {
      await payload.update({
        collection: "team-members",
        id: existing.docs[0].id,
        data: member,
        locale: "en",
      });
    } else {
      const current = existing.docs[0] as unknown as { id: number | string; linkedinUrl?: string | null };
      if (!current.linkedinUrl && member.linkedinUrl) {
        await payload.update({
          collection: "team-members",
          id: current.id,
          data: { linkedinUrl: member.linkedinUrl },
        });
      }
    }
  }

  // Cleanup: remove legacy team-members duplicates that never got a name in the
  // default (EN) locale. These are stray entries left over from an early seed
  // run that preceded localisation and would otherwise render as empty ghost
  // cards on the About page.
  if (upsert) {
    const allTeam = await payload.find({
      collection: "team-members",
      limit: 100,
      locale: "en",
      fallbackLocale: false,
      depth: 0,
    });
    const validNames = new Set(TEAM_DEFAULTS.map((m) => m.name));
    for (const doc of allTeam.docs as Array<{ id: number | string; name?: string | null }>) {
      const hasName = typeof doc.name === "string" && doc.name.trim().length > 0;
      if (!hasName || !validNames.has(doc.name as string)) {
        try {
          await payload.delete({ collection: "team-members", id: doc.id });
        } catch {
          // ignore deletion errors – the frontend filter still hides them
        }
      }
    }
  }

  // Seed Homepage global
  await payload.updateGlobal({
    slug: "homepage",
    data: {
      heroTitle: "Opening the gates to elite motorsport",
      heroBackgroundImage: "/assets/v2/home/hero.webp",
      aboutBackgroundImage: "/images/about.webp",
      aboutText: "We are a 360° motorsport agency combining driver management and strategic marketing to build careers and develop high-impact partnerships across the ecosystem.",
      aboutButtonLabel: "Explore",
      experienceText: "We leverage over [highlight]20 years of experience[/highlight], operating globally [highlight]on and beyond the track[/highlight] - connecting talent, teams, brands and investors [highlight]AT every level[/highlight] of the sport.",
      servicesBackgroundImage: "/images/services.webp",
      serviceLabels: [
        { label: "Sport management" },
        { label: "Image & media" },
        { label: "Commercial development" },
      ],
      driversBackgroundImage: "/images/drivers.webp",
      driversHeading: "For deserving",
      driversHeadingAccent: "drivers",
      homepageNewsItems: [
        { newsSlug: "isack-hadjar-spotlighted-on-gq-middle-east-hype-cover", title: "ISACK HADJAR FEATURING GQ MIDDLE EAST COVER", excerpt: "Isack Hadjar's presence extends beyond the circuit...", image: "/images/news-1.webp" },
        { newsSlug: "drivers-confirmed-for-the-2026-spanish-f4-championship", title: "THE GRID SPANISH FORMULA 4 LINE-UP UNVEILED", excerpt: "The 2026 Spanish F4 Championship will see three...", image: "/images/news-2.webp" },
        { newsSlug: "pierre-gasly-abu-dhabi-special-helmet", title: "PIERRE GASLY SPECIAL HELMET DESIGN X AIX INVESTMENT", excerpt: "For the final race of the 2025 season in Abu Dhabi, Pierre Gasly...", image: "/images/news-3.webp" },
        { newsSlug: "kush-maini-to-drive-for-alpine-f1-test", title: "KUSH MAINI COMPLETES HIS FIRST OFFICIAL F1 SESSION", excerpt: "Kush Maini, Alpine's 2025 Test & Reserve Driver, will complete", image: "/images/news-4.webp" },
        { newsSlug: "isack-hadjar-to-race-for-red-bull-in-2026", title: "ISACK HADJAR TO DRIVE FOR RED BULL RACING IN 2026", excerpt: "The curtain came down on the Formula 1 season with the...", image: "/images/news-5.webp" },
        { newsSlug: "isack-hadjar-spotlighted-on-gq-middle-east-hype-cover", title: "ISACK HADJAR FEATURING GQ MIDDLE EAST COVER", excerpt: "Isack Hadjar's presence extends beyond the circuit...", image: "/images/news-6.webp" },
      ],
    },
  });

  // Seed About page global
  await payload.updateGlobal({
    slug: "about-page",
    data: {
      heroTitle: "Who we are",
      heroDescription: "We are a 360° motorsport management and marketing agency operating globally. We build elite careers for deserving drivers and develop strategic partnerships across the ecosystem.",
      heroBackgroundImage: "/assets/v2/about/hero.webp",
      coreIntroText: "[highlight]Our expertise is structured around [/highlight]three core areas[highlight], designed to [/highlight]support performance[highlight] on track and [/highlight]create value[highlight] beyond it[/highlight]",
      coreAreas: [
        { number: "01", title: "Sport\nManagement", text: "We guide drivers to the highest level of motorsport. Built on over two decades of experience, our deep understanding of the racing ecosystem allows us to identify talent early and shape tailored career strategies. Each driver is unique: one profile, one strategy.", image: "/assets/v2/about/core-sport-management.webp" },
        { number: "02", title: "Image &\nBranding", text: "We build influential profiles on and off the track. Through tailored positioning, media strategy and long-term personal branding, we strengthen the visibility, credibility and influence of drivers and rights holders.", image: "/assets/v2/about/core-image-branding.webp" },
        { number: "03", title: "Commercial\nDevelopment", text: "We create high-impact partnerships across the motorsport ecosystem. By connecting drivers, brands and key stakeholders, we structure collaborations that generate long-term value for all parties involved.", image: "/assets/v2/about/core-commercial-development.webp" },
      ],
      founderBio: "With 20 years of experience in motorsport, Guillaume has worked across multiple roles in the paddock. He served as a simulation and race engineer for ART Grand Prix for six years before co-founding AOTech in 2010. After a two-year stint at McLaren in business development, he founded Soter Analytics and The Grid Agency in 2018, later focusing fully on The Grid in 2021.",
      founderName: "Guillaume Le Goff",
      founderRole: "Founder",
      founderLinkedinUrl: "https://www.linkedin.com/in/glegoff/",
      accelereBannerImage: "/assets/v2/about/accelere.webp",
      accelereDescription: "ACCÉLÈRE is an initiative by Côme Ensemble, the endowment fund of Côme Maison Financière. Its mission is simple: to empower and structure the next generation of French motorsport talent, regardless of background.\n\nSponsored by Formula 1 driver Pierre Gasly, and developed in partnership with The Grid Agency, ACCÉLÈRE brings together those who understand the system and are committed to making it fairer.",
      accelerePortraitImage: "/assets/v2/about/accelere-portrait.webp",
      accelereQuote: "Behind every driver, there is a team, supporters, people who believed in them. This program is my way of giving back what I received, and of proving that talent and hard work can open every door.",
      accelereQuoteAuthor: "Pierre Gasly",
      accelereQuoteRole: "BWT Alpine F1 Team Driver",
      accelereQuoteTitle: "Program Sponsor",
      instagramHandle: "@THEGRID.AGENCY",
      instagramUrl: "https://instagram.com",
      instagramImages: [
        { image: "/assets/v2/about/instagram-1.webp" },
        { image: "/assets/v2/about/instagram-2.webp" },
        { image: "/assets/v2/about/instagram-3.webp" },
        { image: "/assets/v2/about/instagram-4.webp" },
        { image: "/assets/v2/about/instagram-5.webp" },
      ],
    },
  });

  // Seed Services page global
  await payload.updateGlobal({
    slug: "services-page",
    data: {
      heroTitle: "One-stop shop",
      heroDescription: "On and beyond the track, we operate across the motorsport ecosystem - from elite talent management to high-impact brand strategy and commercial partnerships.",
      heroBackgroundImage: "/assets/v2/services/hero.webp",
      talentHeading: "TALENT TAKES THE WHEEL",
      talentHeadingAccent: "WE PAVE THE WAY",
      talentDescription: "From karting to the pinnacle of motorsport, the path is filled with challenges. It demands resilience, teamwork and trust. We stand with deserving drivers every step of the way.",
      talentIntroText: "We create the optimal environment for drivers to excel. By aligning their goals with team objectives and fostering collaboration, we empower them to perform at their peak level.",
      talentCards: [
        { title: "Mentorship", image: "/assets/v2/services/talent-mentorship.webp" },
        { title: "Commercial", image: "/assets/v2/services/talent-commercial.webp" },
        { title: "Network", image: "/assets/v2/services/talent-network.webp" },
        { title: "Contracts", image: "/assets/v2/services/talent-contracts.webp" },
        { title: "Branding", image: "/assets/v2/services/talent-branding.webp" },
      ],
      partnerBackgroundImage: "/assets/v2/services/hintsa.webp",
      partnerDescription: "The Grid Agency partners with Hintsa Performance, a global leader in human performance coaching. Built on a shared belief that performance is won off-track, this collaboration strengthens our commitment to preparing drivers for the highest level of the sport.",
      valueHeading: "WHERE PERFORMANCE",
      valueHeadingAccent: "VALUE",
      valueDescription: "From karting to the pinnacle of motorsport, the path is filled with challenges. It demands resilience, teamwork and trust. We stand with deserving drivers every step of the way.",
      valueIntroText: "We advise brands and investors on motorsport strategy, market positioning and long-term value creation.",
      valueCards: [
        { title: "Partnerships &\nStructuring", image: "/assets/v2/services/value-partnerships.webp" },
        { title: "Network &\nIntroductions", image: "/assets/v2/services/value-network.webp" },
        { title: "Activation &\nContent", image: "/assets/v2/services/value-activation.webp" },
        { title: "Private\nExperiences", image: "/assets/v2/services/value-private.webp" },
      ],
      caseStudies: [
        { title: "", image: "/assets/v2/services/case-left.webp", dimmed: true },
        { title: "Scuderia Alpha Tauri x Fantom", image: "/assets/v2/services/case-center.webp", description: "During the 2022 season, The Grid structured the partnership between fintech company Fantom and Scuderia AlphaTauri, positioning Fantom as one of the team's main sponsors. Throughout the year, the brand gained high-profile visibility through Pierre Gasly and Yuki Tsunoda, with logo placement on their helmets and on the AT03's nose and halo.", dimmed: false },
        { title: "Nyck de Vries x Omnes", image: "/assets/v2/services/case-right.webp", dimmed: true },
      ],
    },
  });

  // Seed Contact page global
  await payload.updateGlobal({
    slug: "contact-page",
    data: {
      heroTitle: "Get in touch",
      heroDescription: "We would love to hear from you",
      heroBackgroundImage: "/assets/v2/contact/backdrop.webp",
    },
  });

  // Seed Drivers page global
  await payload.updateGlobal({
    slug: "drivers-page",
    data: {
      heroTitle: "FOR DESERVING DRIVERS",
      heroDescription: "Learn about them",
      heroBackgroundImage: "/assets/v2/drivers/hero-collage.webp",
    },
  });

  // Seed Site Settings global
  await payload.updateGlobal({
    slug: "site-settings",
    data: {
      footerCopyright: "(C) 2026 THE GRID AGENCY, ALL RIGHTS RESERVED",
      instagramUrl: "#",
      linkedinUrl: "#",
      email: "contact@thegrid.agency",
      privacyPolicyUrl: "/privacy-policy",
    },
  });

  return NextResponse.json({ success: true, message: "Database seeded successfully" });
}
