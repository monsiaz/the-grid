import ServicesCardGridFrame from "./ServicesCardGridFrame";

const talentCards = [
  {
    title: "Mentorship",
    image: "/figma-assets/services/talent-mentorship.jpg",
    alt: "Mentorship",
  },
  {
    title: "Commercial",
    image: "/figma-assets/services/talent-commercial.jpg",
    alt: "Commercial",
  },
  {
    title: "Network",
    image: "/figma-assets/services/talent-network.jpg",
    alt: "Network",
  },
  {
    title: "Contracts",
    image: "/figma-assets/services/talent-contracts.jpg",
    alt: "Contracts",
  },
  {
    title: "Branding",
    image: "/figma-assets/services/talent-branding.jpg",
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
