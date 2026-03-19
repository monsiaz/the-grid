import Image from "next/image";
import Link from "next/link";

type CoreArea = {
  id: string;
  number: string;
  title: string;
  text: string;
  image: string;
};

const coreAreas: CoreArea[] = [
  {
    id: "sport-management",
    number: "01",
    title: "Sport\nManagement",
    image: "/images/about/core-sport-management.jpg",
    text: "We guide drivers to the highest level of motorsport. Built on over two decades of experience, our deep understanding of the racing ecosystem allows us to identify talent early and shape tailored career strategies. Each driver is unique: one profile, one strategy.",
  },
  {
    id: "image-branding",
    number: "02",
    title: "Image &\nBranding",
    image: "/images/about/core-image-branding.jpg",
    text: "We build influential profiles on and off the track. Through tailored positioning, media strategy and long-term personal branding, we strengthen the visibility, credibility and influence of drivers and rights holders.",
  },
  {
    id: "commercial-development",
    number: "03",
    title: "Commercial\nDevelopment",
    image: "/images/about/core-commercial-development.jpg",
    text: "We create high-impact partnerships across the motorsport ecosystem. By connecting drivers, brands and key stakeholders, we structure collaborations that generate long-term value for all parties involved.",
  },
];

type TeamMember = {
  name: string;
  role: string;
  image: string;
};

const teamMembers: TeamMember[] = [
  {
    name: "Jérémy Satis",
    role: "Driver Agent",
    image: "/images/about/team-jeremy.jpg",
  },
  {
    name: "Laura Fredel",
    role: "Marketing Associate",
    image: "/images/about/team-laura.jpg",
  },
];

const founderBio =
  "With 20 years of experience in motorsport, Guillaume has worked across multiple roles in the paddock. He served as a simulation and race engineer for ART Grand Prix for six years before co-founding AOTech in 2010. After a two-year stint at McLaren in business development, he founded Soter Analytics and The Grid Agency in 2018, later focusing fully on The Grid in 2021.";

function CoreAreaCard({ area }: { area: CoreArea }) {
  return (
    <article className="grid gap-6">
      <Image
        src={area.image}
        alt={area.title.replace("\n", " ")}
        width={628}
        height={628}
        className="aspect-square w-full object-cover"
      />
      <div className="grid gap-5">
        <h3 className="m-0 flex items-start gap-3 text-[clamp(28px,2.1vw,36px)] leading-none font-bold uppercase">
          <span className="text-accent">{area.number}</span>
          <span className="whitespace-pre-line">{area.title}</span>
        </h3>
        <div className="bg-secondary h-[2px] w-full" />
        <p className="m-0 text-base leading-[1.4] font-light">{area.text}</p>
      </div>
    </article>
  );
}

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <article className="border-secondary overflow-hidden rounded-[32px] border">
      <Image src={member.image} alt={member.name} width={628} height={628} className="aspect-square w-full object-cover" />
      <div className="bg-primary grid gap-3 p-6">
        <div className="flex items-center justify-between gap-3 uppercase">
          <h4 className="m-0 text-xl leading-[1.2] font-bold">{member.name}</h4>
          <span aria-hidden className="text-2xl leading-none">
            in
          </span>
        </div>
        <p className="m-0 text-base leading-[1.4] uppercase">{member.role}</p>
        <Link
          href="#"
          className="text-accent border-accent inline-flex w-fit items-center justify-center rounded-full border-2 px-4 py-1 text-[22px] leading-[1.2] no-underline transition-all duration-300 hover:bg-accent hover:text-black"
          aria-label={`Learn more about ${member.name}`}
        >
          →
        </Link>
      </div>
    </article>
  );
}

export default function AboutCoreTeamFrame() {
  return (
    <section className="bg-primary py-20" id="about-core">
      <div className="mx-auto grid w-full max-w-[1344px] gap-20 px-[clamp(20px,4vw,48px)]">
        <div className="grid gap-12">
          <p className="text-muted m-0 mx-auto max-w-[888px] text-center text-[clamp(20px,2.2vw,28px)] leading-[1.4] uppercase">
            <span className="text-secondary">Our expertise is structured around </span>
            three core areas
            <span className="text-secondary">, designed to </span>
            support performance
            <span className="text-secondary"> on track and </span>
            create value
            <span className="text-secondary"> beyond it</span>
          </p>
          <div className="grid gap-8 min-[1200px]:grid-cols-3">
            {coreAreas.map((area) => (
              <CoreAreaCard area={area} key={area.id} />
            ))}
          </div>
        </div>

        <div className="grid items-start gap-8 min-[1200px]:grid-cols-[240px_1fr]">
          <h2 className="m-0 font-[var(--font-league-spartan)] text-[64px] leading-none font-bold uppercase max-[1200px]:text-[clamp(44px,6vw,64px)]">
            Meet
            <br />
            the <span className="text-muted">team</span>
          </h2>
          <div className="grid gap-7 min-[980px]:grid-cols-3">
            <article className="border-secondary rounded-[32px] border p-6">
              <p className="m-0 text-sm leading-[1.4] font-light">{founderBio}</p>
            </article>
            {teamMembers.map((member) => (
              <TeamMemberCard member={member} key={member.name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
