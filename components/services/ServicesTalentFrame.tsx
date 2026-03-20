import ServicesCardGridFrame from "./ServicesCardGridFrame";

const talentCards = [
  {
    title: "Mentorship",
    image: "/images/services/talent-mentorship.webp",
    alt: "Mentorship",
  },
  {
    title: "Commercial",
    image: "/images/services/talent-commercial.webp",
    alt: "Commercial",
  },
  {
    title: "Network",
    image: "/images/services/talent-network.webp",
    alt: "Network",
  },
  {
    title: "Contracts",
    image: "/images/services/talent-contracts.webp",
    alt: "Contracts",
  },
  {
    title: "Branding",
    image: "/images/services/talent-branding.webp",
    alt: "Branding",
  },
];

export default function ServicesTalentFrame() {
  return (
    <ServicesCardGridFrame
      id="services-talent"
      heading={
        <>
          TALENT TAKES THE WHEEL
          <br />
          <span className="text-muted">WE PAVE THE WAY</span>
        </>
      }
      description="From karting to the pinnacle of motorsport, the path is filled with challenges. It demands resilience, teamwork and trust. We stand with deserving drivers every step of the way."
      introText="We create the optimal environment for drivers to excel. By aligning their goals with team objectives and fostering collaboration, we empower them to perform at their peak level."
      cards={talentCards}
      gridClassName="min-[1200px]:grid-cols-[repeat(6,minmax(0,1fr))]"
      imageHeightClassName="h-[280px]"
      bodyPaddingClassName="p-6"
    />
  );
}
