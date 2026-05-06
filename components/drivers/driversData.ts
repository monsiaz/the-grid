export type DriverCountryCode = "FR" | "IN" | "GB" | "US" | "PL" | "CN" | "ES";

export type DriverCardData = {
  slug: string;
  name: string;
  role: string;
  image: string;
  imageFocalPoint?: string | null;
  flags: DriverCountryCode[];
  instagramUrl: string;
  teamLogo?: string | null;
};

export type DriverRelatedNews = {
  /** If set, the card becomes a <Link> to /news/<slug>/. */
  slug?: string | null;
  title: string;
  image: string;
  imageFocalPoint?: string | null;
};

export type DriverStatCard = {
  value: string;
  label: string;
};

export type DriverDetailData = {
  slug: string;
  profileTitle: string;
  profileParagraphs: string[];
  careerTitle: string;
  careerParagraphs: string[];
  transitionTitle: string;
  transitionParagraph: string;
  agencyTitle: string;
  agencyParagraphs: string[];
  highestFinish: string;
  careerPoints: string;
  grandPrixEntered: string;
  careerPodiums: string;
  profileImage?: string | null;
  profileImageFocalPoint?: string | null;
  careerImage?: string | null;
  careerImageFocalPoint?: string | null;
  agencyImage?: string | null;
  agencyImageFocalPoint?: string | null;
  galleryLeft?: string | null;
  galleryLeftFocalPoint?: string | null;
  galleryCenter?: string | null;
  galleryCenterFocalPoint?: string | null;
  galleryRight?: string | null;
  galleryRightFocalPoint?: string | null;
  relatedNews?: DriverRelatedNews[];
  statsCards?: DriverStatCard[];
};

export const driversCards: DriverCardData[] = [
  {
    slug: "pierre-gasly",
    name: "PIERRE GASLY",
    role: "BWT ALPINE FORMULA 1 DRIVER",
    image: "/images/drivers/driver-01-gasly.webp",
    flags: ["FR"],
    instagramUrl: "https://www.instagram.com/pierregasly/",
  },
  {
    slug: "isack-hadjar",
    name: "ISACK HADJAR",
    role: "ORACLE RED BULL RACING FORMULA 1 DRIVER",
    image: "/images/drivers/driver-02-hadjar.webp",
    flags: ["FR"],
    instagramUrl: "https://www.instagram.com/isackhadjar/",
  },
  {
    slug: "kush-maini",
    name: "KUSH MAINI",
    role: "ART GRAND PRIX FORMULA 2 DRIVER BWT ALPINE F1 TEAM & MAHINDRA FE TEAM RESERVE DRIVER",
    image: "/images/drivers/driver-03-maini.webp",
    flags: ["IN"],
    instagramUrl: "https://www.instagram.com/kushmaini/",
  },
  {
    slug: "fred-makowiecki",
    name: "FRED MAKOWIECKI",
    role: "ALPINE ENDURANCE TEAM WEC DRIVER",
    image: "/images/drivers/driver-04-makowiecki.webp",
    flags: ["FR"],
    instagramUrl: "https://www.instagram.com/fredmakowiecki/",
  },
  {
    slug: "alessandro-giusti",
    name: "ALESSANDRO GIUSTI",
    role: "MP MOTORSPORT FORMULA 3 DRIVER WILLIAMS RACING DRIVER ACADEMY TALENT",
    image: "/images/drivers/driver-05-giusti.webp",
    flags: ["FR"],
    instagramUrl: "https://www.instagram.com/alessandrogiusti_/",
  },
  {
    slug: "enzo-deligny",
    name: "ENZO DELIGNY",
    role: "VAN AMERSFOORT RACING FORMULA 3 DRIVER",
    image: "/images/drivers/driver-06-deligny.webp",
    flags: ["FR"],
    instagramUrl: "https://www.instagram.com/enzo.deligny/",
  },
  {
    slug: "andrea-dupe",
    name: "ANDREA DUPE",
    role: "VAN AMERSFOORT RACING FREC DRIVER",
    image: "/images/drivers/driver-07-dupe.webp",
    flags: ["FR"],
    instagramUrl: "https://www.instagram.com/andrea.dupe/",
  },
  {
    slug: "nathan-tye",
    name: "NATHAN TYE",
    role: "DRIVEX FORMULA 4 DRIVER",
    image: "/images/drivers/driver-08-tye.webp",
    flags: ["GB"],
    instagramUrl: "https://www.instagram.com/nathantye_",
  },
  {
    slug: "vivek-kanthan",
    name: "VIVEK KANTHAN",
    role: "CAMPOS RACING FORMULA 4 DRIVER",
    image: "/images/drivers/driver-09-kanthan.webp",
    flags: ["US"],
    instagramUrl: "https://www.instagram.com/vivekkanthan/",
  },
  {
    slug: "jack-iliffe",
    name: "JACK ILIFFE",
    role: "FFSA FORMULA 4 DRIVER",
    image: "/images/drivers/driver-10-iliffe.webp",
    flags: ["US"],
    instagramUrl: "https://www.instagram.com/jackiliffe/",
  },
  {
    slug: "louis-cochet",
    name: "LOUIS COCHET",
    role: "MP MOTORSPORT FORMULA 4 DRIVER",
    image: "/images/drivers/driver-11-cochet.webp",
    flags: ["FR"],
    instagramUrl: "https://www.instagram.com/louis.cochet/",
  },
  {
    slug: "luka-scelles",
    name: "LUKA SCELLES",
    role: "VICTORY LANE OK DRIVER",
    image: "/images/drivers/driver-12-scelles.webp",
    flags: ["FR"],
    instagramUrl: "https://www.instagram.com/lukascelles/",
  },
  {
    slug: "alex-truchot",
    name: "ALEX TRUCHOT",
    role: "PREMA RACING OK-J DRIVER",
    image: "/images/drivers/driver-13-truchot.webp",
    flags: ["FR", "US"],
    instagramUrl: "https://www.instagram.com/alextruchot/",
  },
  {
    slug: "stan-ratajski",
    name: "STAN RATAJSKI",
    role: "KART REPUBLIC OK-J DRIVER",
    image: "/images/drivers/driver-14-ratajski.webp",
    flags: ["FR", "PL"],
    instagramUrl: "https://www.instagram.com/stanratajski/",
  },
];

export const driversGridRows: string[][] = [
  ["pierre-gasly", "isack-hadjar", "kush-maini", "fred-makowiecki"],
  ["alessandro-giusti", "enzo-deligny", "andrea-dupe", "nathan-tye"],
  ["vivek-kanthan", "jack-iliffe", "louis-cochet", "luka-scelles"],
  ["alex-truchot", "stan-ratajski"],
];

export const detailNews = [
  {
    title: "PIERRE GASLY'S ABU DHABI SPECIAL HELMET",
    image: "/images/drivers/detail-news-1.webp",
  },
  {
    title: "SPECIAL HELMET DESIGN FOR PIERRE GASLY IN BRAZIL",
    image: "/images/drivers/detail-news-2.webp",
  },
  {
    title: "PIERRE GASLY X H. MOSER & CIE: AN EXCLUSIVE TIMEPIECE",
    image: "/images/drivers/detail-news-3.webp",
  },
];

export const detailGallery = {
  left: "/images/drivers/detail-gallery-left.webp",
  center: "/images/drivers/detail-gallery-main.webp",
  right: "/images/drivers/detail-gallery-right.webp",
};

export const detailImages = {
  profile: "/images/drivers/detail-profile-gasly.webp",
  career: "/images/drivers/detail-career-image.webp",
  agency: "/images/drivers/detail-agency-image.webp",
};

const gaslyDetail: DriverDetailData = {
  slug: "pierre-gasly",
  profileTitle: "Career Overview and Driver Profile",
  profileParagraphs: [
    "Pierre Gasly is a French Formula 1 driver competing in the FIA Formula One World Championship with the BWT Alpine F1 Team. Widely recognised for his resilience, technical feedback, and racecraft, Pierre Gasly's career stands as one of the most compelling comeback stories in modern Formula One.",
    "Born on February 7, 1996, in Rouen, France, Pierre Gasly began his racing career at a young age, progressing through the highly competitive European karting scene before transitioning into single-seater racing. His early years showcased a rare blend of speed, discipline, and adaptability, qualities that would later define Pierre Gasly's Formula One career.",
    "Climbing the junior single-seater ladder, Gasly made his mark in Formula Renault and Formula 3, before achieving international recognition by winning the 2016 GP2 Series championship (now known as FIA Formula 2). That title firmly established him as one of the most promising French drivers of his generation and opened the door to a full-time Formula One career.",
  ],
  careerTitle: "Pierre Gasly's Formula One Career",
  careerParagraphs: [
    "Pierre Gasly made his Formula One debut in 2017 as a Red Bull Junior Team driver racing with Scuderia Toro Rosso. From the outset, his raw pace and technical understanding impressed across the paddock, particularly his stunning P4 in Bahrain. His breakthrough moment came during the 2019 season when he secured his first Formula One podium, confirming his ability to compete at the highest level of motorsport.",
    "In 2020, Pierre Gasly's career reached a historic milestone. At the Italian Grand Prix in Monza, he delivered a flawless performance to claim victory, becoming the first French driver to win a Formula One race since 1996. That win not only cemented his place in F1 history but also symbolised his resilience and mental strength following earlier career challenges.",
    "Over multiple seasons with Scuderia AlphaTauri, Gasly became the team's highest points scorer of all time, consistently outperforming expectations and earning a reputation as one of the most dependable and technically astute drivers on the grid. His ability to extract maximum performance from the car, even in difficult conditions, turned him into a clear fan favourite and a respected figure among engineers and team principals alike.",
  ],
  transitionTitle: "Transition to Alpine and Ongoing Career Development",
  transitionParagraph:
    "Pierre Gasly joined the BWT Alpine F1 Team with the ambition of continuing his upward trajectory and contributing to the long-term growth of a French manufacturer in Formula One. Since his move, Pierre Gasly's career has been defined by consistency, leadership, and continued podium finishes, reinforcing his status as a cornerstone driver for the team's future.",
  agencyTitle: "Pierre Gasly and The Grid Agency",
  agencyParagraphs: [
    "Pierre Gasly's relationship with The Grid Agency spans more than a decade and represents a rare, holistic approach to driver management. From the earliest stages of his career to the pinnacle of Formula One, The Grid has been involved across every dimension of his professional development.",
    "Throughout Pierre Gasly's career, The Grid Agency has supported him as coaches, race engineers, technical advisors, simulator coaches, and today as career and commercial managers. This long-term collaboration has allowed for a deep understanding of Pierre's performance mindset, career objectives, and brand positioning within global motorsport.",
    "The partnership is built on trust, continuity, and shared ambition, navigating both the highs of race victories and the challenges inherent to elite competition. Together, Pierre Gasly and The Grid Agency continue to shape a career defined by performance excellence, strategic growth, and long-term vision in Formula One.",
  ],
  highestFinish: "01",
  careerPoints: "458",
  grandPrixEntered: "177",
  careerPodiums: "05",
  statsCards: [],
};

export function getDriverBySlug(slug: string): DriverCardData | undefined {
  return driversCards.find((driver) => driver.slug === slug);
}

export function getDriverDetailData(slug: string): DriverDetailData {
  if (slug === gaslyDetail.slug) {
    return gaslyDetail;
  }

  const driver = getDriverBySlug(slug);

  if (!driver) {
    return gaslyDetail;
  }

  return {
    ...gaslyDetail,
    slug,
    profileParagraphs: [
      `${driver.name} is represented by The Grid Agency across sporting and commercial strategy. This profile page is being expanded with full career and season-by-season details.`,
      "Our team is currently preparing a complete overview that includes milestones, technical progression, and key partnership highlights.",
      "In the meantime, this page keeps the same visual structure as the primary profile to ensure consistency across the drivers section.",
    ],
    careerTitle: `${driver.name}'s Career Snapshot`,
    transitionParagraph:
      "This section will be updated with team transitions, championship progress, and role evolution as the season advances.",
    agencyTitle: `${driver.name} and The Grid Agency`,
    agencyParagraphs: [
      "The Grid supports each driver with long-term planning, performance coordination, and ecosystem relationships.",
      "This profile is in progress and will include expanded insight on sporting, media, and commercial development.",
      "The same framework is intentionally reused to keep the experience cohesive across all driver detail pages.",
    ],
    statsCards: [],
  };
}
