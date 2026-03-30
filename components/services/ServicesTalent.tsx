import ServicesCardGrid from "./ServicesCardGrid";

type ServicesTalentProps = {
  heading?: string | null;
  headingAccent?: string | null;
  description?: string | null;
  introText?: string | null;
  cards: { title: string; image: string; alt: string }[];
};

export default function ServicesTalent({ heading, headingAccent, description, introText, cards }: ServicesTalentProps) {
  return (
    <ServicesCardGrid
      id="services-talent"
      heading={
        <>
          {heading || "TALENT TAKES THE WHEEL"}
          <br />
          <span className="text-muted">{headingAccent || "WE PAVE THE WAY"}</span>
        </>
      }
      description={description || ""}
      introText={introText || ""}
      cards={cards}
      gridClassName="min-[1200px]:grid-cols-[repeat(6,minmax(0,1fr))]"
      imageHeightClassName="h-[280px]"
      bodyPaddingClassName="p-6"
    />
  );
}
