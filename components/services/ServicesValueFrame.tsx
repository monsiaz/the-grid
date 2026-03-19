import Image from "next/image";
import ServicesCardGridFrame from "./ServicesCardGridFrame";

type CaseStudy = {
  title: string;
  image: string;
  alt: string;
  description?: string;
  dimmed?: boolean;
};

const valueCards = [
  {
    title: "Partnerships &\nStructuring",
    image: "/figma-assets/services/value-partnerships.jpg",
    alt: "Partnerships and structuring",
  },
  {
    title: "Network &\nIntroductions",
    image: "/figma-assets/services/value-network.jpg",
    alt: "Network and introductions",
  },
  {
    title: "Activation &\nContent",
    image: "/figma-assets/services/value-activation.jpg",
    alt: "Activation and content",
  },
  {
    title: "Private\nExperiences",
    image: "/figma-assets/services/value-private.jpg",
    alt: "Private experiences",
  },
];

const caseStudies: CaseStudy[] = [
  {
    title: "",
    image: "/figma-assets/services/case-left.jpg",
    alt: "Case study preview",
    dimmed: true,
  },
  {
    title: "Scuderia Alpha Tauri x Fantom",
    image: "/figma-assets/services/case-center.jpg",
    alt: "Scuderia Alpha Tauri x Fantom",
    description:
      "During the 2022 season, The Grid structured the partnership between fintech company Fantom and Scuderia AlphaTauri, positioning Fantom as one of the team's main sponsors. Throughout the year, the brand gained high-profile visibility through Pierre Gasly and Yuki Tsunoda, with logo placement on their helmets and on the AT03's nose and halo.",
  },
  {
    title: "Nyck de Vries x Omnes",
    image: "/figma-assets/services/case-right.jpg",
    alt: "Nyck de Vries x Omnes",
    dimmed: true,
  },
];

function CaseStudyCard({ card }: { card: CaseStudy }) {
  return (
    <article className={`grid w-[786px] shrink-0 gap-4 ${card.dimmed ? "opacity-30" : ""}`}>
      <div className="relative h-[440px] w-full overflow-hidden">
        <Image src={card.image} alt={card.alt} fill sizes="(max-width: 1200px) 100vw, 786px" className="object-cover" />
      </div>
      <h3 className="m-0 text-xl leading-[1.2] font-bold uppercase">{card.title || " "}</h3>
      <div className="bg-accent h-1 w-full" />
      {card.description ? <p className="m-0 text-base leading-[1.4] font-light">{card.description}</p> : null}
    </article>
  );
}

export default function ServicesValueFrame() {
  return (
    <section className="bg-primary py-20" id="services-value">
      <div className="mx-auto grid w-full max-w-[1728px] gap-20">
        <ServicesCardGridFrame
          heading={
            <>
              WHERE PERFORMANCE
              <br />
              CREATES <span className="text-muted">VALUE</span>
            </>
          }
          description="From karting to the pinnacle of motorsport, the path is filled with challenges. It demands resilience, teamwork and trust. We stand with deserving drivers every step of the way."
          introText="We advise brands and investors on motorsport strategy, market positioning and long-term value creation."
          cards={valueCards}
          gridClassName="px-[clamp(20px,4vw,48px)] min-[1200px]:grid-cols-[297.6px_repeat(4,minmax(0,1fr))]"
          imageHeightClassName="h-[280px]"
          bodyPaddingClassName="p-6"
        />

        <div className="w-full overflow-x-auto pb-2">
          <div className="flex w-max gap-7 px-[clamp(20px,4vw,48px)] min-[1200px]:pl-0 min-[1200px]:pr-0 min-[1200px]:ml-[-343px]">
            {caseStudies.map((card) => (
              <CaseStudyCard card={card} key={`${card.title}-${card.image}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
