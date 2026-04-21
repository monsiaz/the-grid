import { NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payload";

export const runtime = "nodejs";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

// ─────────────────────────────────────────────────────────────────────────────
// EN source of truth for every driver bio, per the client's "COLLECTE DES
// TEXTES" brief. Keep the slug stable — it's the hreflang pivot and MUST NOT
// change. Photos live at /public/assets/v2/drivers/articles/<slug>/<slug>-N.webp
// (converted once from "COLLECTE IMAGES/DRIVERS/ARTICLES/" via
//   node scripts/convert-driver-articles.mjs ).
// ─────────────────────────────────────────────────────────────────────────────

type DriverSeed = {
  slug: string;
  name: string;
  role: string;
  detail: {
    profileTitle: string;
    profileParagraphs: string;
    careerTitle: string;
    careerParagraphs: string;
    transitionTitle?: string;
    transitionParagraph?: string;
    agencyTitle: string;
    agencyParagraphs: string;
    profileImage: string;
    careerImage: string;
    agencyImage: string;
    galleryLeft?: string;
    galleryCenter?: string;
    galleryRight?: string;
  };
};

const img = (slug: string, n: number) => `/assets/v2/drivers/articles/${slug}/${slug}-${n}.webp`;

const DRIVERS: DriverSeed[] = [
  {
    slug: "pierre-gasly",
    name: "Pierre Gasly",
    role: "BWT ALPINE FORMULA 1 DRIVER",
    detail: {
      profileTitle: "Career Overview and Driver Profile",
      profileParagraphs: [
        "Pierre Gasly is a French Formula 1 driver competing in the FIA Formula One World Championship with the BWT Alpine F1 Team. Widely recognised for his resilience, technical feedback, and racecraft, Pierre Gasly's career stands as one of the most compelling comeback stories in modern Formula One.",
        "Born on February 7, 1996, in Rouen, France, Pierre Gasly began his racing career at a young age, progressing through the highly competitive European karting scene before transitioning into single-seater racing. His early years showcased a rare blend of speed, discipline, and adaptability — qualities that would later define Pierre Gasly's Formula One career.",
        "Climbing the junior single-seater ladder, Gasly made his mark in Formula Renault and Formula 3, before achieving international recognition by winning the 2016 GP2 Series championship (now known as FIA Formula 2). That title firmly established him as one of the most promising French drivers of his generation and opened the door to a full-time Formula One career.",
      ].join("\n\n"),
      careerTitle: "Pierre Gasly's Formula One Career",
      careerParagraphs: [
        "Pierre Gasly made his Formula One debut in 2017 as a Red Bull Junior Team driver racing with Scuderia Toro Rosso. From the outset, his raw pace and technical understanding impressed across the paddock, particularly his stunning P4 in Bahrain. His breakthrough moment came during the 2019 season when he secured his first Formula One podium, confirming his ability to compete at the highest level of motorsport.",
        "In 2020, Pierre Gasly's career reached a historic milestone. At the Italian Grand Prix in Monza, he delivered a flawless performance to claim victory, becoming the first French driver to win a Formula One race since 1996. That win not only cemented his place in F1 history but also symbolised his resilience and mental strength following earlier career challenges.",
        "Over multiple seasons with Scuderia AlphaTauri, Gasly became the team's highest points scorer of all time, consistently outperforming expectations and earning a reputation as one of the most dependable and technically astute drivers on the grid. His ability to extract maximum performance from the car, even in difficult conditions, turned him into a clear fan favourite and a respected figure among engineers and team principals alike.",
      ].join("\n\n"),
      transitionTitle: "Transition to Alpine and Ongoing Career Development",
      transitionParagraph:
        "Pierre Gasly joined the BWT Alpine F1 Team with the ambition of continuing his upward trajectory and contributing to the long-term growth of a French manufacturer in Formula One. Since his move, Pierre Gasly's career has been defined by consistency, leadership, and continued podium finishes, reinforcing his status as a cornerstone driver for the team's future.",
      agencyTitle: "Pierre Gasly and The Grid Agency",
      agencyParagraphs: [
        "Pierre Gasly's relationship with The Grid Agency spans more than a decade and represents a rare, holistic approach to driver management. From the earliest stages of his career to the pinnacle of Formula One, The Grid has been involved across every dimension of his professional development.",
        "Throughout Pierre Gasly's career, The Grid Agency has supported him as coaches, race engineers, technical advisors, simulator coaches, and today as career and commercial managers. This long-term collaboration has allowed for a deep understanding of Pierre's performance mindset, career objectives, and brand positioning within global motorsport.",
        "The partnership is built on trust, continuity, and shared ambition — navigating both the highs of race victories and the challenges inherent to elite competition. Together, Pierre Gasly and The Grid Agency continue to shape a career defined by performance excellence, strategic growth, and long-term vision in Formula One.",
      ].join("\n\n"),
      profileImage: img("pierre-gasly", 1),
      careerImage: img("pierre-gasly", 3),
      agencyImage: img("pierre-gasly", 5),
      galleryLeft: img("pierre-gasly", 2),
      galleryCenter: img("pierre-gasly", 4),
      galleryRight: img("pierre-gasly", 6),
    },
  },
  {
    slug: "isack-hadjar",
    name: "Isack Hadjar",
    role: "ORACLE RED BULL RACING FORMULA 1 DRIVER",
    detail: {
      profileTitle: "Career Overview and Driver Profile",
      profileParagraphs: [
        "Isack Hadjar is a French Formula 1 driver competing at the pinnacle of motorsport since 2025. Recognised as one of the most exciting young talents of his generation, Isack Hadjar's career path reflects determination, speed, and a relentless drive for excellence. After an impressive rookie season in Formula One highlighted by a podium finish with Visa Cash App Racing Bulls F1 Team, Hadjar earned a highly anticipated promotion to Red Bull Racing for the 2026 Formula 1 season.",
        "Born in France and raised around Paris, Isack Hadjar began his motorsport career in karting, competing mostly in his home country where he quickly established himself as a promising young talent. His early years were marked by consistent performances, technical understanding, and a natural ability to extract performance in high-pressure situations. These qualities laid the foundation for what would become one of the most closely followed junior careers in recent motorsport history.",
        "Transitioning from karting to single-seaters, Hadjar continued to build his reputation in the highly competitive French and European racing scene. His rapid adaptation to Formula racing machinery confirmed his status as a driver to watch.",
      ].join("\n\n"),
      careerTitle: "From Monaco Breakthrough to Formula 2 Vice-Champion",
      careerParagraphs: [
        "The true breakthrough in Isack Hadjar's career came in the Formula Regional European Championship. Competing against some of the best young drivers in the world, Hadjar demonstrated maturity beyond his years. One defining moment came at the prestigious Monaco circuit, where he delivered a stunning victory that immediately attracted international attention. His performance caught the eye of the Red Bull Junior Team, one of the most competitive and selective development programs in motorsport.",
        "As part of the Red Bull Junior Team, Isack Hadjar moved to the FIA Formula 3 Championship — one of the most competitive feeder series to Formula 1. There, he quickly established himself as a championship contender, displaying race-winning pace, consistency, and strong racecraft. He fought for the title until the final rounds of the season, reinforcing his reputation as one of the most complete drivers on the grid.",
        "Continuing his rapid progression, Hadjar advanced to FIA Formula 2 — the final step before Formula 1 — where he secured the Vice-Champion title. Competing against highly experienced and talented rivals, he delivered multiple victories, podium finishes, and standout performances, showcasing his readiness for Formula 1.",
      ].join("\n\n"),
      transitionTitle: "Formula 1 Debut, Rookie Podium and Red Bull Promotion",
      transitionParagraph:
        "In 2025, Isack Hadjar made his Formula 1 debut with Visa Cash App Racing Bulls F1 Team, securing a remarkable podium finish during his rookie season — a rare achievement for a first-year driver. Throughout the season, he impressed with his qualifying pace, race consistency, and technical feedback. Following his standout rookie campaign, Red Bull Racing confirmed Isack Hadjar as a race driver for the 2026 Formula 1 season, placing him within one of the most competitive teams in Formula 1 history.",
      agencyTitle: "Isack Hadjar and The Grid Agency",
      agencyParagraphs: [
        "Isack Hadjar's career is closely supported by The Grid Agency across sporting, commercial, and personal branding dimensions. The partnership reflects The Grid's commitment to managing elite Formula 1 talent with long-term vision and strategic expertise.",
        "As of the 2026 Formula 1 season, Isack Hadjar stands among the most exciting French drivers on the grid. His rapid rise through Formula Regional, Formula 3, Formula 2, and into Formula 1 highlights a career built on performance and progression — a story of talent meeting opportunity, backed by one of the strongest driver development programs in motorsport.",
      ].join("\n\n"),
      profileImage: img("isack-hadjar", 2),
      careerImage: img("isack-hadjar", 4),
      agencyImage: img("isack-hadjar", 1),
      galleryLeft: img("isack-hadjar", 3),
      galleryCenter: img("isack-hadjar", 5),
      galleryRight: img("isack-hadjar", 6),
    },
  },
  {
    slug: "fred-makowiecki",
    name: "Frédéric Makowiecki",
    role: "ALPINE ENDURANCE TEAM WEC DRIVER",
    detail: {
      profileTitle: "Career Overview and Driver Profile",
      profileParagraphs: [
        "Frédéric Makowiecki is a French professional racing driver competing at the highest level of international endurance racing. Recognised globally for his technical expertise, consistency, and elite racecraft, Frédéric Makowiecki's career is widely regarded as one of the most accomplished and respected paths in modern GT and endurance racing.",
        "Born on November 22, 1980, in Arras, France, Frédéric Makowiecki built his career through a non-traditional route to the top of professional motorsport. Unlike many drivers who follow an extended single-seater development ladder, Makowiecki's career transitioned early into GT racing — a decision that would ultimately define his identity as one of the world's leading endurance specialists.",
        "His reputation reached a new level when Autosport described him as \"The Best GT Driver in the World\" — a recognition reflecting not only race results but also his impact within manufacturer programmes and his technical contribution to car development.",
      ].join("\n\n"),
      careerTitle: "Factory Driver Career",
      careerParagraphs: [
        "Over the past decade, Frédéric Makowiecki's career has been defined by prestigious factory roles with multiple global manufacturers across the world's most demanding championships.",
        "He has represented Aston Martin in the FIA GT World Championship, Nissan and Honda in the Japanese Super GT Championship, Porsche in both the FIA World Endurance Championship (WEC) and IMSA WeatherTech SportsCar Championship, and more recently Alpine in the same championships.",
        "His tenure as a Porsche factory driver further solidified his career at the pinnacle of endurance racing. Competing in WEC and IMSA, Makowiecki became known for his qualifying speed, strategic intelligence in multi-class racing, and ability to deliver under pressure in 6-hour, 12-hour, and 24-hour endurance formats.",
      ].join("\n\n"),
      transitionTitle: "2026 FIA World Endurance Championship with Alpine",
      transitionParagraph:
        "In 2026, Frédéric Makowiecki continues his endurance racing journey with Alpine in the FIA World Endurance Championship, marking his second consecutive season with the French manufacturer. This chapter of his career reflects both national alignment and strategic ambition at the top tier of endurance racing. His experience across multiple factory programmes positions him as one of the most technically complete drivers on the WEC grid.",
      agencyTitle: "Frédéric Makowiecki and The Grid Agency",
      agencyParagraphs: [
        "Frédéric Makowiecki's career is managed and strategically developed by The Grid Agency, providing comprehensive support across sporting, technical, and commercial dimensions. The Grid Agency works closely with Makowiecki to optimise career strategy and manufacturer positioning, contract negotiations and long-term programme alignment, performance structure and technical collaboration, and brand development within international endurance racing.",
        "This partnership ensures that Frédéric Makowiecki's career continues to evolve at the highest level of global motorsport, aligning performance excellence with long-term strategic vision.",
      ].join("\n\n"),
      profileImage: img("fred-makowiecki", 2),
      careerImage: img("fred-makowiecki", 1),
      agencyImage: img("fred-makowiecki", 5),
      galleryLeft: img("fred-makowiecki", 3),
      galleryCenter: img("fred-makowiecki", 4),
    },
  },
  {
    slug: "kush-maini",
    name: "Kush Maini",
    role: "ART GRAND PRIX F2 DRIVER — ALPINE F1 & MAHINDRA FE RESERVE",
    detail: {
      profileTitle: "Indian Formula 2 Driver & Alpine F1 Reserve",
      profileParagraphs: [
        "Kush Maini is an Indian racing driver competing at the highest levels of international motorsport. Currently racing in the FIA Formula 2 Championship with ART Grand Prix, Kush Maini continues to build one of the most impressive careers among Indian drivers.",
        "In parallel with his Formula 2 campaign, he also serves as Reserve Driver for the BWT Alpine F1 Team and the Mahindra Formula E Team, further strengthening his position within top-tier global motorsport. Kush Maini's career is one defined by consistency, progression, and high-performance results across every category he has entered.",
      ].join("\n\n"),
      careerTitle: "From Karting to Formula 2 Podiums",
      careerParagraphs: [
        "Like many successful single-seater drivers, Kush Maini began his racing career in karting, where he quickly established himself as one of India's most promising young talents. Competing both domestically and internationally, Kush gained crucial experience against elite junior drivers from Europe and beyond.",
        "Kush Maini's career reached another significant milestone when he stepped up to the highly competitive BRDC British Formula 3 Championship. Across multiple seasons, he consistently fought at the front of the championship standings, finishing twice in the final top three of the series. In 2020, he secured the Vice-Champion title — one of the standout achievements of his career.",
        "After a year in FIA Formula 3, the move to FIA Formula 2 represented a major step forward, placing him directly on the final rung before Formula 1. Across his first three Formula 2 seasons, he achieved seven podium finishes, two race victories, and one pole position. Now competing with ART Grand Prix — one of the most successful teams in junior single-seater history — Kush continues to strengthen his position.",
      ].join("\n\n"),
      transitionTitle: "Formula 1 & Formula E Involvement",
      transitionParagraph:
        "As Reserve Driver for the BWT Alpine F1 Team, Kush plays an active role in simulator development, technical feedback, and Formula 1 testing preparation. This position places him inside a Formula 1 environment, working closely with engineers and race drivers at the pinnacle of motorsport. In addition, his role as Reserve Driver for Mahindra Formula E Team expands his experience into electric racing and high-performance energy management — further diversifying his career portfolio.",
      agencyTitle: "Kush Maini and The Grid Agency",
      agencyParagraphs:
        "Kush Maini joined The Grid Agency in 2024. This dual involvement with Alpine F1 and Mahindra Formula E demonstrates the trust placed in him by major international manufacturers and reinforces his status as one of India's leading motorsport representatives on the global stage. The partnership with The Grid Agency supports his long-term path toward Formula 1.",
      profileImage: img("kush-maini", 1),
      careerImage: img("kush-maini", 4),
      agencyImage: img("kush-maini", 2),
      galleryLeft: img("kush-maini", 3),
      galleryCenter: img("kush-maini", 5),
      galleryRight: img("kush-maini", 6),
    },
  },
  {
    slug: "alessandro-giusti",
    name: "Alessandro Giusti",
    role: "MP MOTORSPORT F3 DRIVER — WILLIAMS ACADEMY TALENT",
    detail: {
      profileTitle: "Career — French FIA Formula 3 Driver & Williams Academy Talent",
      profileParagraphs: [
        "Alessandro Giusti is one of the most promising young French racing drivers of his generation. Currently competing in the FIA Formula 3 Championship with MP Motorsport, Alessandro Giusti continues to build an impressive single-seater résumé after dominating the French Formula 4 Championship and establishing himself as a front-running driver in the Formula Regional European Championship by Alpine (FRECA).",
        "His career is defined by rapid progression, championship success, and continuous development at every stage of the international single-seater ladder. Alessandro's career began in karting, where he quickly demonstrated natural racecraft, composure under pressure, and technical understanding beyond his years.",
      ].join("\n\n"),
      careerTitle: "From French F4 Double Champion to FIA Formula 3",
      careerParagraphs: [
        "In 2021, during his rookie season in single-seaters, Alessandro won the Junior title in French Formula 4 at just 14 years old. He returned in 2022 to win the French Formula 4 Championship outright, confirming his status as one of the strongest drivers to emerge from the French development system in recent years.",
        "In FRECA with G4 Racing, Alessandro immediately made an impact, securing three race victories and two pole positions — all the more impressive given that the team had scored no points without him the previous season. Moving to ART Grand Prix the following season, he finished the championship in 4th position overall.",
        "In FIA Formula 3, he secured two podium finishes and finished P10 in the championship standings in his debut season, recording more top-10 race finishes than any other driver in the field. Remaining with MP Motorsport for the following season, Alessandro aims to build on his experience and position himself as a title contender.",
      ].join("\n\n"),
      transitionTitle: "Williams Racing Driver Academy Support",
      transitionParagraph:
        "A major endorsement of Alessandro's potential came in 2024 when he joined the Williams Racing Driver Academy. This selection represents a significant milestone in his career, reinforcing his long-term objective: progressing through the final stages of the single-seater ladder toward Formula 2 and ultimately Formula 1.",
      agencyTitle: "Alessandro Giusti and The Grid Agency",
      agencyParagraphs:
        "Alessandro Giusti joined The Grid Agency at the end of the 2024 season. His career is supported by The Grid Agency with a structured development pathway aimed at Formula 2 and ultimately Formula 1. With Williams Academy backing and proven speed across multiple categories, the focus is on consistent front-running performances at international level.",
      profileImage: img("alessandro-giusti", 6),
      careerImage: img("alessandro-giusti", 1),
      agencyImage: img("alessandro-giusti", 5),
      galleryLeft: img("alessandro-giusti", 2),
      galleryCenter: img("alessandro-giusti", 3),
      galleryRight: img("alessandro-giusti", 4),
    },
  },
  {
    slug: "enzo-deligny",
    name: "Enzo Deligny",
    role: "VAN AMERSFOORT RACING FORMULA 3 DRIVER",
    detail: {
      profileTitle: "Career — French Racing Driver Progressing Toward FIA Formula 3",
      profileParagraphs: [
        "Enzo Deligny's career is one of the most internationally shaped development stories in modern junior single-seater racing. Born to a Chinese mother and a French father, Enzo Deligny grew up between Shanghai and California, developing not only a multicultural identity but also a global racing mindset that has defined his progression through the motorsport ladder.",
        "From his earliest days in karting, Enzo Deligny demonstrated front-running speed and an ability to perform under pressure across multiple continents. His adaptability to different racing environments, technical regulations, and competitive fields has become one of the defining strengths of his career.",
      ].join("\n\n"),
      careerTitle: "From Spanish F4 to a Breakthrough FRECA Season",
      careerParagraphs: [
        "Entering the Spanish Formula 4 Championship, Enzo immediately positioned himself among the most competitive drivers on the grid, securing fourth place overall in the championship standings while simultaneously claiming the Rookie Champion title.",
        "In FRECA with R-ace GP, Enzo Deligny delivered a standout 2025 season. Over the course of the championship, he secured four race victories, four pole positions, and nine podium finishes. These results placed him third overall in the championship standings, firmly establishing him as one of the leading drivers of the season.",
        "Beyond the regular championship calendar, Enzo also delivered a spectacular third-place finish at the Macau Grand Prix, one of the most prestigious and technically demanding events in junior single-seater racing.",
      ].join("\n\n"),
      transitionTitle: "Preparing for FIA Formula 3",
      transitionParagraph:
        "With strong momentum from his FRECA campaign, the next chapter in Enzo Deligny's career is FIA Formula 3 with Van Amersfoort Racing. The move to FIA F3 represents a crucial progression toward the final stages of the single-seater ladder, placing him directly on the Formula 1 Grand Prix support bill and in direct competition with the world's most promising junior drivers.",
      agencyTitle: "Enzo Deligny and The Grid Agency",
      agencyParagraphs:
        "The Grid Agency supports Enzo Deligny's career development with long-term strategic vision as he steps into FIA Formula 3 competition. His previous results in Spanish F4 and FRECA demonstrate that he possesses the qualifying speed, racecraft, and championship consistency required to compete at this level.",
      profileImage: img("enzo-deligny", 1),
      careerImage: img("enzo-deligny", 3),
      agencyImage: img("enzo-deligny", 2),
      galleryLeft: img("enzo-deligny", 4),
    },
  },
  {
    slug: "andrea-dupe",
    name: "Andrea Dupe",
    role: "VAN AMERSFOORT RACING FREC DRIVER",
    detail: {
      profileTitle: "Career — From Elite Karting to Formula Regional Single-Seaters",
      profileParagraphs: [
        "Andrea Dupe's career represents an internationally focused progression through elite karting and into high-level European single-seater racing. Born in Paris and based in Milan, Andrea Dupe has developed within some of the most competitive motorsport environments in Europe, combining French roots with deep integration into the Italian racing ecosystem.",
        "From an early stage, Andrea Dupe's career has been shaped by international exposure, technical rigour, and a long-term development vision aimed at mastering the single-seater ladder step by step.",
      ].join("\n\n"),
      careerTitle: "International Karting and Single-Seater Debut",
      careerParagraphs: [
        "Before transitioning to single-seaters, Andrea Dupe built a solid international karting career, rising through the ranks of European karting and progressing with the Sodi factory team. In 2023, he reached a major milestone by becoming Italian Vice-Champion with Kart Republic, before concluding his karting journey with Prema Racing — one of the most prestigious teams in junior motorsport.",
        "In 2025, Andrea made his single-seater debut by competing in both the Italian Formula 4 Championship and the Euro 4 Championship. Despite being his first season in formula cars, he showed clear signs of raw talent, speed, and learning capacity. His 2025 campaign was significantly impacted by injury following a crash at Monza, but across the races he was able to contest, his career continued to show flashes of competitiveness and potential.",
      ].join("\n\n"),
      transitionTitle: "Recovery and Formula Regional Middle East",
      transitionParagraph:
        "Fully recovered and physically prepared, Andrea Dupe entered the next phase of his development with renewed momentum. In 2026, he began his campaign in the Formula Regional Middle East Trophy with G4 Racing, using the series as a structured platform to master Formula Regional machinery ahead of a full season in the Formula Regional European Championship (FRECA) with Van Amersfoort Racing.",
      agencyTitle: "Andrea Dupe and The Grid Agency",
      agencyParagraphs:
        "The Grid Agency supports Andrea Dupe's career with a long-term development plan combining international exposure and a structured technical programme. The transition into FRECA with Van Amersfoort Racing positions him firmly on the single-seater ladder, backed by the agency's expertise in driver management and career strategy.",
      profileImage: img("andrea-dupe", 1),
      careerImage: img("andrea-dupe", 3),
      agencyImage: img("andrea-dupe", 5),
      galleryLeft: img("andrea-dupe", 2),
      galleryCenter: img("andrea-dupe", 4),
      galleryRight: img("andrea-dupe", 6),
    },
  },
  {
    slug: "nathan-tye",
    name: "Nathan Tye",
    role: "DRIVEX FORMULA 4 DRIVER",
    detail: {
      profileTitle: "Career — British Racing Driver Progressing Through Spanish Formula 4",
      profileParagraphs: [
        "Nathan Tye's career represents one of the most promising British development pathways from national karting success to competitive European single-seater racing. Emerging from a highly successful karting background in the United Kingdom, Nathan Tye quickly established himself as a consistent podium contender before transitioning onto the international stage.",
        "As he continues to build experience in Spanish Formula 4, Nathan Tye's career is defined by steady progression, factory recognition, and long-term professional support designed to maximise his development toward higher levels of international motorsport.",
      ].join("\n\n"),
      careerTitle: "From UK Karting Podiums to Sodikart Factory Seat",
      careerParagraphs: [
        "The foundations of Nathan Tye's career were built in the ultra-competitive environment of British karting. Regular podium finishes became a defining feature of his early career, underlining both his racecraft and his ability to deliver under pressure.",
        "In 2021, Nathan was recruited as a Factory Driver by Sodikart, one of the most respected kart manufacturers in the world. The same program helped develop drivers such as Pierre Gasly and Charles Leclerc more than a decade earlier — a powerful validation of the potential seen in Nathan Tye's career.",
      ].join("\n\n"),
      transitionTitle: "Transition to Car Racing",
      transitionParagraph:
        "Nathan Tye's career entered a new phase with the transition to car racing in 2024 with Campos Racing, before joining Rodin Motorsport in 2025, a British team he went on to lead. Now entering his third season in car racing, he competes in the Spanish Formula 4 Championship with Drivex — widely regarded as one of the most competitive Formula 4 series in Europe. The objective is clear: to fight consistently at the front and target the championship.",
      agencyTitle: "Nathan Tye and The Grid Agency",
      agencyParagraphs:
        "The progression shown throughout Nathan Tye's career was recognised early by The Grid Agency, which supports his development with a structured and performance-focused approach. With factory karting experience, multiple podium finishes at national and European level, and increasing maturity in Formula 4, the combination of British racing foundations and international exposure positions him strongly for future advancement within the single-seater pyramid.",
      profileImage: img("nathan-tye", 1),
      careerImage: img("nathan-tye", 2),
      agencyImage: img("nathan-tye", 5),
      galleryLeft: img("nathan-tye", 3),
      galleryCenter: img("nathan-tye", 4),
    },
  },
  {
    slug: "vivek-kanthan",
    name: "Vivek Kanthan",
    role: "CAMPOS RACING FORMULA 4 DRIVER",
    detail: {
      profileTitle: "Career — From American Karting Champion to Spanish F4 Contender",
      profileParagraphs: [
        "Vivek Kanthan's career began in New York and rapidly expanded onto the European stage. Born and raised in the United States, Vivek developed an early passion for motorsport that quickly transformed into competitive success.",
        "Since entering karting in 2019, Vivek Kanthan's career has been defined by rapid progression, championship victories, and consistent results against elite international competition.",
      ].join("\n\n"),
      careerTitle: "International Karting Success",
      careerParagraphs: [
        "Beginning his racing journey in 2019, Vivek established himself as a front-running driver. Within his first two seasons he secured the Rotax National title and finished vice-champion at the SuperNationals, one of the most prestigious karting events in North America.",
        "In 2022, he claimed victory at the ROK World Superfinal, a globally recognised event that attracts top drivers from across continents. That same year, his career gained further momentum with victory in the Italian Trofeo. In 2023, during his rookie season in the highly competitive OK-Junior category, he secured a podium finish in the CIK-FIA European Championship.",
      ].join("\n\n"),
      transitionTitle: "Transition to Single-Seaters with Campos Racing",
      transitionParagraph:
        "Making his debut in formula racing with Campos Racing in 2025, Vivek quickly demonstrated that his karting success could translate to car racing. During the Spanish Winter Championship, he was crowned Rookie Champion, and continuing into the Spanish Formula 4 Championship he collected rookie podium finishes and consistently showed competitive pace. Vivek Kanthan's career now moves into a crucial development phase as he remains with Campos Racing for the 2026 season.",
      agencyTitle: "Vivek Kanthan and The Grid Agency",
      agencyParagraphs:
        "Vivek Kanthan joined The Grid Agency in 2024. As his career continues to evolve, the focus is on converting experience into consistent front-running results and positioning himself for the next step on the European single-seater ladder.",
      profileImage: img("vivek-kanthan", 1),
      careerImage: img("vivek-kanthan", 3),
      agencyImage: img("vivek-kanthan", 4),
      galleryLeft: img("vivek-kanthan", 2),
      galleryCenter: img("vivek-kanthan", 5),
    },
  },
  {
    slug: "jack-iliffe",
    name: "Jack Iliffe",
    role: "FFSA FORMULA 4 DRIVER",
    detail: {
      profileTitle: "Career — From American Karting Champion to European Single-Seater Prospect",
      profileParagraphs: [
        "Born in San Francisco, California, and raised in Austin, Texas, Jack Iliffe's career reflects both performance and long-term vision. With multiple national titles in the United States and a major European victory to his name, Jack Iliffe's career is now entering a decisive new chapter as he transitions to single-seater racing.",
        "Over the course of four consecutive seasons in American karting, he secured four national championships in four years — a rare achievement that highlighted both dominance and discipline. The American phase of his career provided a strong competitive base that would later support his transition to Europe.",
      ].join("\n\n"),
      careerTitle: "European Karting and WSK Euro Series Title",
      careerParagraphs: [
        "During the 2023 and 2024 seasons, Jack Iliffe raced in the OK-Junior category across Europe, consistently demonstrating front-running pace. He secured multiple heat wins and pole positions, showing that he could match and outperform established European talent.",
        "A defining moment in his career came with his victory in the WSK Euro Series Championship, one of the most prestigious titles in international karting. Winning the WSK Euro Series confirmed his ability to compete at the highest junior level and significantly strengthened his profile within the European paddock.",
      ].join("\n\n"),
      transitionTitle: "Transition to Single-Seaters — French F4",
      transitionParagraph:
        "Now transitioning from karting to single-seater racing, Jack Iliffe is set to compete in the French Formula 4 Championship in 2026. French F4 is widely recognised as one of the strongest Formula 4 programmes in Europe — as Pierre Gasly, Stoffel Vandoorne, and Isack Hadjar have done before him.",
      agencyTitle: "Jack Iliffe and The Grid Agency",
      agencyParagraphs:
        "Jack Iliffe joined The Grid Agency during the 2024 season. With a background that includes multiple national championships and a major European karting title, Jack enters this new single-seater phase equipped with strong foundational skills and long-term agency support.",
      profileImage: img("jack-iliffe", 1),
      careerImage: img("jack-iliffe", 2),
      agencyImage: img("jack-iliffe", 4),
      galleryLeft: img("jack-iliffe", 3),
    },
  },
  {
    slug: "louis-cochet",
    name: "Louis Cochet",
    role: "MP MOTORSPORT FORMULA 4 DRIVER",
    detail: {
      profileTitle: "Career — From French NSK Champion to Spanish Formula 4 Prospect",
      profileParagraphs: [
        "Louis Cochet's career is emerging as one of the most promising French development stories in modern junior motorsport. Born and raised in Normandy — the same region that produced Formula 1 race winner Pierre Gasly — Louis Cochet has built his foundations through a structured and competitive karting pathway before progressing toward single-seater racing.",
        "From national title success in France to consistent performances on the international stage, Louis Cochet's career reflects steady growth, resilience, and the technical maturity required to compete at the highest levels of junior motorsport.",
      ].join("\n\n"),
      careerTitle: "From NSK Cadet Title to World Championship OK",
      careerParagraphs: [
        "A defining early milestone came in 2022 when he secured the NSK Cadet title, confirming his status as one of the leading young talents in French karting. Following his French success, Louis moved onto the international stage in the OK-Junior category, competing over two full seasons against factory-supported drivers.",
        "The move to the senior OK category in 2025 marked a key turning point. At the European Championship round in Viterbo, he secured a strong fourth-place finish against one of the most competitive grids of the season. At the World Championship, he ran within the top ten throughout much of the weekend, demonstrating clear front-running pace against the world's best drivers.",
      ].join("\n\n"),
      transitionTitle: "Single-Seater Debut with MP Motorsport",
      transitionParagraph:
        "In 2026, Louis Cochet's career entered a decisive new phase as he made his single-seater debut with MP Motorsport in the Spanish Formula 4 Championship, widely regarded as one of the strongest Formula 4 series in Europe. The structured environment at MP Motorsport provides a professional platform to accelerate his development and translate karting performance into consistent single-seater results.",
      agencyTitle: "Louis Cochet and The Grid Agency",
      agencyParagraphs:
        "Louis Cochet joined The Grid Agency in 2025. His career is supported with a long-term development plan that leverages his karting pedigree and accelerates his progression through the European single-seater ladder.",
      profileImage: img("louis-cochet", 2),
      careerImage: img("louis-cochet", 1),
      agencyImage: img("louis-cochet", 4),
      galleryLeft: img("louis-cochet", 3),
      galleryCenter: img("louis-cochet", 5),
    },
  },
  {
    slug: "luka-scelles",
    name: "Luka Scelles",
    role: "VICTORY LANE OK DRIVER",
    detail: {
      profileTitle: "Career — French Karting Talent Rising on the International Stage",
      profileParagraphs: [
        "Luka Scelles's career is rapidly emerging as one of the most exciting development stories in modern international karting. Recognised as one of the most talented drivers of his generation, Luka Scelles has built a competitive résumé through structured progression, national championship success, and strong performances at European and World Championship level.",
        "From winning the NSK title in France to competing against the best drivers in the world in OK, Luka Scelles's career reflects clear natural speed. As he prepares to fight at the very front in the Senior category, his trajectory points toward continued progression at the highest levels of international motorsport.",
      ].join("\n\n"),
      careerTitle: "From NSK Champion to European and World Top 10",
      careerParagraphs: [
        "A defining milestone came in 2023 when Luka secured the NSK title in France. The 2025 season represented a turning point as he stepped onto the international stage for the first time, immediately impressing with his speed, consistency, and maturity.",
        "He finished P5 in the European Championship, competing against factory-backed drivers and some of the strongest talents in global karting. His competitiveness continued at the World Championship, where he added another important milestone with a top-ten finish.",
      ].join("\n\n"),
      transitionTitle: "Anticipating the Move to OK",
      transitionParagraph:
        "In 2025, Luka anticipated the move to OK machinery by competing in the WSK Final Cup, where he secured a pole position and finished fourth in the final of his first race. Now into his first official OK season, he sets his sights on competing at the very front.",
      agencyTitle: "Luka Scelles and The Grid Agency",
      agencyParagraphs:
        "Luka Scelles joined The Grid Agency in 2025. His career is supported with a long-term development plan focused on the transition from international karting success to professional single-seater racing.",
      profileImage: img("luka-scelles", 1),
      careerImage: img("luka-scelles", 3),
      agencyImage: img("luka-scelles", 5),
      galleryLeft: img("luka-scelles", 2),
      galleryCenter: img("luka-scelles", 4),
      galleryRight: img("luka-scelles", 6),
    },
  },
  {
    // Legacy slug stays "alex-truchot" — DO NOT rename (hreflang pivot).
    // Only the display name changes per the client's brief.
    slug: "alex-truchot",
    name: "Alessandro Truchot",
    role: "PREMA RACING OK-J DRIVER",
    detail: {
      profileTitle: "Rising International Karting Talent",
      profileParagraphs: [
        "Alessandro Truchot's career is the story of a dual American and French racing driver, representing a new generation of elite young talents emerging onto the global motorsport scene. At just 12 years old, he is already competing at the highest levels of international karting, establishing himself as a serious contender in OK-Junior competition.",
        "Currently racing within the prestigious Prema Racing structure, Alessandro Truchot competes against the strongest junior fields in Europe and the United States. His raw speed, race intelligence, and mental maturity have allowed him to consistently challenge at the front of the grid against drivers often older and more experienced — a clear indicator of a future single-seater professional.",
      ].join("\n\n"),
      careerTitle: "Career Highlights",
      careerParagraphs: [
        "Alessandro Truchot's career is already defined by major victories and championship successes across some of the most competitive karting series in the world. Among his standout achievements: back-to-back titles in the SKUSA Winter Series, victory at the prestigious Andrea Margutti Trophy and Trofeo Primavera, multiple Vice-Champion finishes in the WSK Super Master Series, Vice-Champion in the WSK Euro Series, and Vice-Champion in the Italian Karting Championship.",
        "These results position Alessandro as one of the most consistent front-runners of his generation. His ability to perform across different circuits, tyre compounds, weather conditions, and competitive environments speaks to his adaptability — a key indicator of long-term success in professional motorsport.",
      ].join("\n\n"),
      transitionTitle: "International Presence — Europe and the United States",
      transitionParagraph:
        "A defining characteristic of his career is his dual racing identity. Holding both American and French nationality, Alessandro competes on both sides of the Atlantic, gaining invaluable international experience. In the United States, his dominance in the SKUSA Winter Series established him as one of the top junior drivers in North America. In Europe, he consistently battles within the lead group in WSK and Italian Championship events.",
      agencyTitle: "Alessandro Truchot and The Grid Agency",
      agencyParagraphs:
        "He joined The Grid Agency in 2026. Given his early results, championship consistency, and adaptability across international platforms, Alessandro Truchot's career is widely regarded as one to watch closely in the coming years.",
      profileImage: img("alex-truchot", 1),
      careerImage: img("alex-truchot", 2),
      agencyImage: img("alex-truchot", 4),
      galleryLeft: img("alex-truchot", 3),
    },
  },
  {
    slug: "stan-ratajski",
    name: "Stan Ratajski",
    role: "KART REPUBLIC OK-J DRIVER",
    detail: {
      profileTitle: "Career — The Rise of a Franco-Polish International Karting Prospect",
      profileParagraphs: [
        "Stan Ratajski's career is a story of early success and huge promises for the future. A dual Polish and French racing driver, Stan Ratajski represents a new generation of elite European talent progressing through the highest levels of competitive karting. At just 12 years old, he transitioned from Mini Group 3 to OK-Junior on the international stage, skipping the OK-NJ category — a crucial step that places him among the most promising drivers of his age category.",
        "For those following the Stan Ratajski career, his trajectory reflects early maturity, exceptional adaptability, and consistent performance against some of the strongest junior fields in Europe. Now competing with Kart Republic machinery, Stan has established himself as a consistent front-runner capable of delivering results under pressure.",
      ].join("\n\n"),
      careerTitle: "From Mini Gr3 to Continental Titles",
      careerParagraphs: [
        "Stan Ratajski's career began at an unusually young age, first through motorbike racing before transitioning to four wheels. By the age of eight, he had already secured the title of French Vice-Champion. At nine years old, he claimed the French NSK Championship title in 2022, confirming his status as one of the most precocious talents in the French karting scene.",
        "In 2024, Stan captured the title in the WSK Open Series and finished Vice-Champion in the WSK Final Cup. Building on his breakthrough season, 2025 brought victory at the prestigious Coppa Italia di Karting and triumph at the renowned Trofeo delle Industrie. Throughout the 2025 season, Stan also secured overall podium finishes in both the WSK Super Master Series and the WSK Euro Series.",
      ].join("\n\n"),
      transitionTitle: "From Mini Gr3 to OK-Junior",
      transitionParagraph:
        "The move from Mini Gr3 to OK-Junior marks one of the most important transitions in any young driver's development. The OK-Junior category demands a higher level of everything — in this environment, drivers compete on a truly international scale with factory-backed operations and elite engineering support. Stan's Franco-Polish identity adds a valuable multicultural dimension, strengthening his adaptability within international teams.",
      agencyTitle: "Stan Ratajski and The Grid Agency",
      agencyParagraphs:
        "Stan Ratajski joined The Grid Agency in 2026. Given his results and rate of progression, his career is widely regarded as one to follow closely in the coming years.",
      profileImage: img("stan-ratajski", 1),
      careerImage: img("stan-ratajski", 3),
      agencyImage: img("stan-ratajski", 5),
      galleryLeft: img("stan-ratajski", 2),
      galleryCenter: img("stan-ratajski", 4),
      galleryRight: img("stan-ratajski", 6),
    },
  },
];

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

  const onlySlug = new URL(request.url).searchParams.get("slug");
  const payload = await getPayloadClient();
  const results: { slug: string; ok: boolean; error?: string }[] = [];

  for (const d of DRIVERS) {
    if (onlySlug && d.slug !== onlySlug) continue;
    try {
      const existing = await payload.find({
        collection: "drivers",
        where: { slug: { equals: d.slug } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      });
      if (existing.docs.length === 0) {
        results.push({ slug: d.slug, ok: false, error: "driver not found in DB" });
        continue;
      }
      const id = existing.docs[0].id;
      await payload.update({
        collection: "drivers",
        id,
        locale: "en",
        data: {
          name: d.name,
          role: d.role,
          detail: d.detail,
        } as Parameters<typeof payload.update>[0]["data"],
        overrideAccess: true,
      });
      results.push({ slug: d.slug, ok: true });
    } catch (err) {
      results.push({
        slug: d.slug,
        ok: false,
        error: (err as Error).message,
      });
    }
  }

  return NextResponse.json({
    ok: results.every((r) => r.ok),
    updated: results.filter((r) => r.ok).length,
    results,
  });
}
