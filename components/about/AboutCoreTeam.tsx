"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Linkedin, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  motion,
  fadeUp,
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
  linkedinUrl?: string | null;
  bio?: string | null;
};

type AboutCoreTeamProps = {
  coreIntroText?: string | null;
  coreAreas: CoreArea[];
  founderBio: string;
  founderName?: string;
  founderRole?: string;
  founderLinkedinUrl?: string;
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
            sizes="(max-width: 700px) 100vw, (max-width: 1200px) 50vw, 400px"
            className="aspect-square w-full object-cover"
          />
        </motion.div>
      </div>
      <div className="grid gap-5">
        <h2 className="m-0 flex items-start gap-3 text-[clamp(28px,2.1vw,36px)] leading-none font-bold uppercase">
          <span className="text-accent">{area.number}</span>
          <span className="whitespace-pre-line">{area.title}</span>
        </h2>
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
  const t = useTranslations("about.team");
  const [flipped, setFlipped] = useState(false);
  const hasBio = Boolean(member.bio && member.bio.trim());
  const hasLinkedIn = Boolean(member.linkedinUrl);

  return (
    <motion.div
      className="h-full [perspective:1400px]"
      variants={fadeUp}
      transition={smoothTransition}
    >
      <div
        className="relative h-full w-full [transform-style:preserve-3d] transition-transform duration-700 ease-[cubic-bezier(0.4,0.2,0.2,1)]"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <article
          className="border-secondary overflow-hidden rounded-[32px] border bg-primary [backface-visibility:hidden]"
          aria-hidden={flipped}
        >
          <div className="overflow-hidden">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Image
                src={member.image}
                alt={member.name}
                width={628}
                height={628}
                sizes="(max-width: 700px) 100vw, (max-width: 980px) 50vw, (max-width: 1200px) 33vw, 300px"
                className="aspect-square w-full object-cover"
              />
            </motion.div>
          </div>
          <div className="bg-primary grid gap-3 p-6">
            <div className="flex items-center justify-between gap-3 uppercase">
              <h3 className="m-0 text-xl leading-[1.2] font-bold">{member.name}</h3>
              {hasLinkedIn ? (
                <Link
                  href={member.linkedinUrl as string}
                  target="_blank"
                  rel="noreferrer me"
                  aria-label={t("linkedinLabel", { name: member.name })}
                  className="text-accent border-accent inline-flex h-11 w-11 items-center justify-center rounded-full border-2 no-underline transition-all duration-300 hover:bg-accent hover:text-black hover:scale-110"
                >
                  <Linkedin className="h-5 w-5 shrink-0" aria-hidden />
                </Link>
              ) : (
                <span aria-hidden className="text-muted text-2xl leading-none">
                  in
                </span>
              )}
            </div>
            <p className="m-0 text-base leading-[1.4] uppercase">{member.role}</p>
            <button
              type="button"
              onClick={() => setFlipped(true)}
              aria-label={t("learnMore", { name: member.name })}
              className="text-accent border-accent inline-flex w-fit cursor-pointer items-center justify-center rounded-full border-2 bg-transparent px-4 py-1 text-[22px] leading-[1.2] no-underline transition-all duration-300 hover:bg-accent hover:text-black hover:scale-110"
            >
              <ArrowRight className="h-5 w-5 shrink-0" aria-hidden />
            </button>
          </div>
        </article>

        <article
          className="border-secondary absolute inset-0 flex h-full flex-col justify-between overflow-hidden rounded-[32px] border bg-primary p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          aria-hidden={!flipped}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="uppercase">
              <h3 className="m-0 text-xl leading-[1.2] font-bold text-accent">{member.name}</h3>
              <p className="m-0 mt-1 text-base leading-[1.4] text-secondary/80">{member.role}</p>
            </div>
            {hasLinkedIn ? (
              <Link
                href={member.linkedinUrl as string}
                target="_blank"
                rel="noreferrer me"
                aria-label={t("linkedinLabel", { name: member.name })}
                className="text-accent border-accent inline-flex h-11 w-11 items-center justify-center rounded-full border-2 no-underline transition-all duration-300 hover:bg-accent hover:text-black hover:scale-110"
              >
                <Linkedin className="h-5 w-5 shrink-0" aria-hidden />
              </Link>
            ) : null}
          </div>
          <p className="m-0 text-[14px] leading-[1.55] font-light text-secondary/90">
            {hasBio ? member.bio : t("bioFallback")}
          </p>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] uppercase tracking-[0.12em] text-muted">{t("flipBack")}</span>
            <button
              type="button"
              onClick={() => setFlipped(false)}
              aria-label={t("hideDetails", { name: member.name })}
              className="text-accent border-accent inline-flex h-11 w-11 items-center justify-center rounded-full border-2 bg-transparent transition-all duration-300 hover:bg-accent hover:text-black hover:scale-110"
            >
              <RotateCcw className="h-5 w-5 shrink-0" aria-hidden />
            </button>
          </div>
        </article>
      </div>
    </motion.div>
  );
}

export default function AboutCoreTeam({
  coreIntroText,
  coreAreas,
  founderBio,
  founderName = "Guillaume Le Goff",
  founderRole = "Founder",
  founderLinkedinUrl = "https://www.linkedin.com/in/glegoff/",
  teamMembers,
}: AboutCoreTeamProps) {
  const t = useTranslations("about.team");
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
                <span className="text-secondary">{t("introFallback.lead")}</span>
                {t("introFallback.highlight1")}
                <span className="text-secondary">{t("introFallback.middle")}</span>
                {t("introFallback.highlight2")}
                <span className="text-secondary">{t("introFallback.middle2")}</span>
                {t("introFallback.highlight3")}
                <span className="text-secondary">{t("introFallback.tail")}</span>
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
            {t("meet")}
            <br />
            {t("meetThe")} <span className="text-muted">{t("meetTeam")}</span>
          </motion.h2>
          <motion.div
            className="grid gap-7 min-[980px]:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <motion.article
              className="border-secondary flex h-full flex-col justify-between gap-4 rounded-[32px] border p-6"
              variants={fadeUp}
              transition={smoothTransition}
              whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
            >
              <div className="flex items-start justify-between gap-3 uppercase">
                <div>
                  <h3 className="m-0 text-xl leading-[1.2] font-bold">{founderName}</h3>
                  <p className="m-0 mt-1 text-[13px] leading-[1.4] text-secondary/80">{founderRole}</p>
                </div>
                <Link
                  href={founderLinkedinUrl}
                  target="_blank"
                  rel="noreferrer me"
                  aria-label={t("linkedinLabel", { name: founderName })}
                  className="text-accent border-accent inline-flex h-11 w-11 items-center justify-center rounded-full border-2 no-underline transition-all duration-300 hover:bg-accent hover:text-black hover:scale-110"
                >
                  <Linkedin className="h-5 w-5 shrink-0" aria-hidden />
                </Link>
              </div>
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
