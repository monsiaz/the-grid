import Image from "next/image";
import { ArrowRight } from "lucide-react";

type ServiceCard = {
  title: string;
  image: string;
  alt: string;
};

type ServicesCardGridFrameProps = {
  id?: string;
  heading: React.ReactNode;
  description: string;
  introText: string;
  cards: ServiceCard[];
  gridClassName: string;
  imageHeightClassName: string;
  bodyPaddingClassName: string;
};

function ServiceIntroCard({ text }: { text: string }) {
  return (
    <article className="border-secondary h-full rounded-[32px] border p-6">
      <p className="m-0 text-sm leading-[1.4] font-light">{text}</p>
    </article>
  );
}

function ServiceImageCard({ card, imageHeightClassName, bodyPaddingClassName }: { card: ServiceCard; imageHeightClassName: string; bodyPaddingClassName: string }) {
  return (
    <article className="border-secondary overflow-hidden rounded-[32px] border">
      <div className={`relative w-full ${imageHeightClassName}`}>
        <Image src={card.image} alt={card.alt} fill sizes="(max-width: 1024px) 100vw, 20vw" className="object-cover" />
      </div>
      <div className={`bg-primary ${bodyPaddingClassName}`}>
        <div className="flex items-center justify-between gap-4">
          <h3 className="m-0 text-base leading-[1.2] font-bold uppercase whitespace-pre-line">{card.title}</h3>
          <span className="text-accent border-accent inline-flex rounded-full border-2 px-3 py-1 text-base leading-[1.2]" aria-hidden>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </span>
        </div>
      </div>
    </article>
  );
}

export default function ServicesCardGridFrame({
  id,
  heading,
  description,
  introText,
  cards,
  gridClassName,
  imageHeightClassName,
  bodyPaddingClassName,
}: ServicesCardGridFrameProps) {
  return (
    <section className="bg-primary py-20" id={id}>
      <div className="mx-auto grid w-full max-w-[1344px] gap-20 px-[clamp(20px,4vw,48px)]">
        <div className="mx-auto grid w-full max-w-[1344px] gap-8 text-center uppercase">
          <h2 className="m-0 font-[var(--font-league-spartan)] text-[64px] leading-none font-bold max-[1200px]:text-[clamp(44px,6vw,64px)]">
            {heading}
          </h2>
          <p className="m-0 mx-auto max-w-[888px] text-[clamp(16px,1.8vw,20px)] leading-[1.4] font-light">{description}</p>
        </div>

        <div className={`grid gap-7 ${gridClassName}`}>
          <ServiceIntroCard text={introText} />
          {cards.map((card) => (
            <ServiceImageCard
              key={card.title}
              card={card}
              imageHeightClassName={imageHeightClassName}
              bodyPaddingClassName={bodyPaddingClassName}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
