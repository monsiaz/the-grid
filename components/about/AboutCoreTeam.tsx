"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  motion,
  fadeUp,
  scaleIn,
  staggerContainer,
  staggerContainerSlow,
  slideInLeft,
  smoothTransition,
  viewport,
} from "../motion";

type CoreArea = {
  number: string;
  title: string;
  text: string;
  image: string;
};

type TeamMember = {
  name: string;
  role: string;
  image: string;
};

type AboutCoreTeamProps = {
  coreIntroText?: string | null;
  coreAreas: CoreArea[];
  founderBio: string;
  teamMembers: TeamMember[];
};

function parseHighlightText(text: string) {
  const parts = text.split(/\[highlight\]|\[\/highlight\]/);
  const elements: React.ReactNode[] = [];
  let isHighlight = false;

  for (let i = 0; i < parts.length; i++) {
    if (parts[i]) {
      if (isHighlight) {
        elements.push(
          <span key={i} className="text-muted">
            {parts[i]}
          </span>
        );
      } else {
        elements.push(
          <span key={i} className="text-secondary">
            {parts[i]}
          </span>
        );
      }
    }
    isHighlight = !isHighlight;
  }

  return elements;
}

function CoreAreaCard({ area }: { area: CoreArea }) {
  return (
    <motion.article
      className="grid gap-6"
      variants={fadeUp}
      transition={smoothTransition}
    >
      <div className="overflow-hidden rounded-sm">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Image
            src={area.image}
            alt={area.title.replace("\n", " ")}
            width={628}
            height={628}
            className="aspect-square w-full object-cover"
          />
        </motion.div>
      </div>
      <div className="grid gap-5">
        <h3 className="m-0 flex items-start gap-3 text-[clamp(28px,2.1vw,36px)] leading-none font-bold uppercase">
          <span className="text-accent">{area.number}</span>
          <span className="whitespace-pre-line">{area.title}</span>
        </h3>
        <motion.div
          className="bg-secondary h-[2px] w-full origin-left"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={viewport}
          transition={{ ...smoothTransition, duration: 0.8, delay: 0.2 }}
        />
        <p className="m-0 text-base leading-[1.4] font-light">{area.text}</p>
      </div>
    </motion.article>
  );
}

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <motion.article
      className="border-secondary overflow-hidden rounded-[32px] border"
      variants={fadeUp}
      transition={smoothTransition}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
    >
      <div className="overflow-hidden">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Image src={member.image} alt={member.name} width={628} height={628} className="aspect-square w-full object-cover" />
        </motion.div>
      </div>
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
          className="text-accent border-accent inline-flex w-fit items-center justify-center rounded-full border-2 px-4 py-1 text-[22px] leading-[1.2] no-underline transition-all duration-300 hover:bg-accent hover:text-black hover:scale-110"
          aria-label={`Learn more about ${member.name}`}
        >
          <ArrowRight className="h-5 w-5 shrink-0" aria-hidden />
        </Link>
      </div>
    </motion.article>
  );
}

export default function AboutCoreTeam({ coreIntroText, coreAreas, founderBio, teamMembers }: AboutCoreTeamProps) {
  return (
    <section className="bg-primary py-20" id="about-core">
      <div className="mx-auto grid w-full max-w-[1344px] gap-20 px-[clamp(20px,4vw,48px)]">
        <div className="grid gap-12">
          <motion.p
            className="text-muted m-0 mx-auto max-w-[888px] text-center text-[clamp(20px,2.2vw,28px)] leading-[1.4] uppercase"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={{ ...smoothTransition, duration: 0.9 }}
          >
            {coreIntroText ? parseHighlightText(coreIntroText) : (
              <>
                <span className="text-secondary">Our expertise is structured around </span>
                three core areas
                <span className="text-secondary">, designed to </span>
                support performance
                <span className="text-secondary"> on track and </span>
                create value
                <span className="text-secondary"> beyond it</span>
              </>
            )}
          </motion.p>
          <motion.div
            className="grid gap-8 min-[1200px]:grid-cols-3"
            variants={staggerContainerSlow}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {coreAreas.map((area, idx) => (
              <CoreAreaCard area={area} key={area.number || idx} />
            ))}
          </motion.div>
        </div>

        <div className="grid items-start gap-8 min-[1200px]:grid-cols-[240px_1fr]">
          <motion.h2
            className="m-0 font-[var(--font-league-spartan)] text-[64px] leading-none font-bold uppercase max-[1200px]:text-[clamp(44px,6vw,64px)]"
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={smoothTransition}
          >
            Meet
            <br />
            the <span className="text-muted">team</span>
          </motion.h2>
          <motion.div
            className="grid gap-7 min-[980px]:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <motion.article
              className="border-secondary rounded-[32px] border p-6"
              variants={fadeUp}
              transition={smoothTransition}
              whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
            >
              <p className="m-0 text-sm leading-[1.4] font-light">{founderBio}</p>
            </motion.article>
            {teamMembers.map((member) => (
              <TeamMemberCard member={member} key={member.name} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
