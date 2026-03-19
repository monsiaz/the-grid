export type NewsCategory = "sporting" | "commercial";

export type NewsCardItem = {
  slug: string;
  title: string;
  image: string;
  category: NewsCategory;
};

export type NewsDetailData = {
  slug: string;
  title: string;
  date: string;
  heroImage: string;
  introParagraphs: string[];
  bodyParagraphs: string[];
  galleryImages: string[];
};

export const newsCards: NewsCardItem[] = [
  {
    slug: "stan-ratajski-joins-the-grid-agency",
    title: "STAN RATAJSKI JOINS THE GRID AGENCY",
    image: "/images/news/list-1.jpg",
    category: "sporting",
  },
  {
    slug: "enzo-steps-into-formula-3-with-van-amersfoort-racing-for-2026",
    title: "ENZO STEPS INTO FORMULA 3 WITH VAN AMERSFOORT RACING FOR 2026",
    image: "/images/news/list-2.jpg",
    category: "sporting",
  },
  {
    slug: "andrea-dupe-steps-up-to-formula-regional-european-championship",
    title: "ANDREA DUPE STEPS UP TO FORMULA REGIONAL EUROPEAN CHAMPIONSHIP WITH VAN AMERSFOORT RACING",
    image: "/images/news/list-3.jpg",
    category: "sporting",
  },
  {
    slug: "alessandro-giusti-steps-into-the-spotlight-with-jaguar-racing-in-miami",
    title: "ALESSANDRO GIUSTI STEPS INTO THE SPOTLIGHT WITH JAGUAR RACING IN MIAMI",
    image: "/images/news/list-4.jpg",
    category: "commercial",
  },
  {
    slug: "isack-hadjar-spotlighted-on-gq-middle-east-hype-cover",
    title: "ISACK HADJAR SPOTLIGHTED ON GQ MIDDLE EAST HYPE COVER AS GQ MOTY HONOREE",
    image: "/images/news/list-5.jpg",
    category: "commercial",
  },
  {
    slug: "gasly-extends-his-contract-with-bwt-alpine-f1-team",
    title: "GASLY EXTENDS HIS CONTRACT WITH BWT ALPINE F1 TEAM",
    image: "/images/news/list-6.jpg",
    category: "sporting",
  },
  {
    slug: "alessandro-truchot-joins-the-grid-agency",
    title: "ALESSANDRO TRUCHOT JOINS THE GRID AGENCY",
    image: "/images/news/list-7.jpg",
    category: "sporting",
  },
  {
    slug: "alpine-reveals-a526-livery-as-gasly-prepares-for-2026",
    title: "ALPINE REVEALS A526 LIVERY AS GASLY PREPARES FOR 2026",
    image: "/images/news/list-8.jpg",
    category: "sporting",
  },
  {
    slug: "isack-hadjar-and-the-2026-red-bull-racing-livery",
    title: "ISACK HADJAR AND THE 2026 RED BULL RACING LIVERY",
    image: "/images/news/list-9.jpg",
    category: "sporting",
  },
  {
    slug: "andrea-dupe-joins-the-grid-agency",
    title: "ANDREA DUPE JOINS THE GRID AGENCY",
    image: "/images/news/list-10.jpg",
    category: "sporting",
  },
  {
    slug: "isack-hadjar-on-the-cover-of-esses-mag-issue-4",
    title: "ISACK HADJAR ON THE COVER OF ESSES MAG - ISSUE 4",
    image: "/images/news/list-11.jpg",
    category: "commercial",
  },
  {
    slug: "drivers-confirmed-for-the-2026-spanish-f4-championship",
    title: "DRIVERS CONFIRMED FOR THE 2026 SPANISH F4 CHAMPIONSHIP",
    image: "/images/news/list-12.jpg",
    category: "sporting",
  },
  {
    slug: "pierre-gasly-abu-dhabi-special-helmet",
    title: "PIERRE GASLY'S ABU DHABI SPECIAL HELMET",
    image: "/images/news/list-13.jpg",
    category: "commercial",
  },
  {
    slug: "abu-dhabi-post-season-test",
    title: "ABU DHABI POST-SEASON TEST",
    image: "/images/news/list-14.jpg",
    category: "sporting",
  },
  {
    slug: "kush-maini-to-drive-for-alpine-f1-test",
    title: "KUSH MAINI TO DRIVE FOR ALPINE F1 TEST",
    image: "/images/news/list-15.jpg",
    category: "sporting",
  },
  {
    slug: "isack-hadjar-to-race-for-red-bull-in-2026",
    title: "ISACK HADJAR TO RACE FOR RED BULL IN 2026",
    image: "/images/news/list-16.jpg",
    category: "sporting",
  },
  {
    slug: "new-talent-joining-the-grid-junior-class",
    title: "NEW TALENT JOINING THE GRID",
    image: "/images/news/list-17.jpg",
    category: "sporting",
  },
  {
    slug: "special-helmet-design-for-pierre-gasly-in-brazil",
    title: "SPECIAL HELMET DESIGN FOR PIERRE GASLY IN BRAZIL",
    image: "/images/news/list-18.jpg",
    category: "commercial",
  },
  {
    slug: "deligny-shines-in-macau",
    title: "DELIGNY SHINES IN MACAU",
    image: "/images/news/list-19.jpg",
    category: "sporting",
  },
  {
    slug: "new-talent-joining-the-grid-karting-program",
    title: "NEW TALENT JOINING THE GRID",
    image: "/images/news/list-20.jpg",
    category: "sporting",
  },
  {
    slug: "p3-in-freca-for-deligny",
    title: "P3 IN FRECA FOR DELIGNY",
    image: "/images/news/list-21.jpg",
    category: "sporting",
  },
  {
    slug: "solid-weekend-for-kanthan-at-valencia",
    title: "SOLID WEEKEND FOR KANTHAN AT VALENCIA",
    image: "/images/news/list-22.jpg",
    category: "sporting",
  },
];

export const newsDetailBySlug: Record<string, NewsDetailData> = {
  "stan-ratajski-joins-the-grid-agency": {
    slug: "stan-ratajski-joins-the-grid-agency",
    title: "STAN RATAJSKI JOINS THE GRID AGENCY",
    date: "FEB 17, 2026",
    heroImage: "/images/news/detail-1.jpg",
    introParagraphs: [
      "Stan Ratajski continues his rise through international karting as he joins The Grid Agency, bringing with him a record that already places him among the most competitive drivers of his generation.",
      "Polish and French, the 12-year-old is currently stepping into the OK-J category, where he is making his debut with Kart Republic in the WSK Super Master Series. This transition marks a significant milestone, placing him in one of the most demanding junior karting environments on the international calendar.",
      "Before this move, Stan built an exceptional resume in the Mini category, competing at the highest level across Europe. His results speak with clarity. Champion of the Trofeo Della Industria in 2025, WSK Open in 2024, Coppa Italia, and France NSK in 2022, he has repeatedly demonstrated his ability to win against strong international fields. Alongside these titles, multiple vice-champion finishes in WSK Final Cup, WSK Euro Series, and the Italian Championship underline a level of consistency that is rare at such a young age.",
    ],
    bodyParagraphs: [
      "What stands out is not only the number of trophies, but the regularity with which Stan has remained at the front in highly competitive series. Across seasons and championships, he has shown an ability to deliver results under pressure and to remain a constant reference point within his category.",
      "Now competing in OK-J, Stan enters a new phase of his development, where the margins are tighter and the competition sharper. With a solid foundation already established in international karting, this step represents progression rather than transition.",
      "Already a proven winner, Stan Ratajski moves forward with momentum, focus, and a clear trajectory toward the next levels of the sport.",
    ],
    galleryImages: [
      "/images/news/detail-2.jpg",
      "/images/news/detail-3.jpg",
      "/images/news/detail-4.jpg",
      "/images/news/detail-5.jpg",
      "/images/news/detail-6.jpg",
    ],
  },
};

export const defaultNewsSlug = "stan-ratajski-joins-the-grid-agency";

export function getNewsDetailHref(slug: string) {
  const targetSlug = newsDetailBySlug[slug] ? slug : defaultNewsSlug;
  return `/news/${targetSlug}`;
}
