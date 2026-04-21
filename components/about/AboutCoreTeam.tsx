"use client";

import Image from "next/image";
import Link from "next/link";
import { Linkedin, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
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
  bio?: string | null;
  linkedinUrl?: string | null;
};

type AboutCoreTeamProps = {
  coreIntroText?: string | null;
  coreAreas: CoreArea[];
  founderBio?: string | null;
  founderName?: string;
  founderRole?: string;
  founderImage?: string | null;
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

/**
 * CoreAreaCard uses CSS subgrid so that across the 3-column parent grid:
 *   row 1 — image (auto height, same across all cards)
 *   row 2 — title h2 (aligned bottoms even when text wraps differently)
 *   row 3 — white divider line (always at the same vertical position)
 *   row 4 — description text (starts at same baseline)
 *
 * The parent grid must declare [grid-template-rows:subgrid] support via
 * the "min-[1200px]:[grid-row:span_4] min-[1200px]:[grid-template-rows:subgrid]" classes.
 */
function CoreAreaCard({ area }: { area: CoreArea }) {
  return (
    <motion.article
      className="grid gap-y-5
        min-[1200px]:[grid-row:span_4]
        min-[1200px]:[grid-template-rows:subgrid]
        min-[1200px]:gap-y-0"
      variants={fadeUp}
      transition={smoothTransition}
    >
      {/* row 1: image */}
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
            className="aspect-square w-full object-cover object-top"
          />
        </motion.div>
      </div>

      {/* row 2: title — self-end so all align to the bottom of their row */}
      <h2 className="m-0 flex items-start gap-3 text-[clamp(28px,2.1vw,36px)] leading-[1.15] font-bold uppercase min-[1200px]:self-end min-[1200px]:pb-5">
        <span className="text-accent shrink-0">{area.number}</span>
        <span className="whitespace-pre-line">{area.title}</span>
      </h2>

      {/* row 3: white divider */}
      <motion.div
        className="bg-secondary h-[2px] w-full origin-left"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={viewport}
        transition={{ ...smoothTransition, duration: 0.8, delay: 0.2 }}
      />

      {/* row 4: description */}
      <p className="m-0 text-base leading-[1.4] font-light min-[1200px]:pt-5">{area.text}</p>
    </motion.article>
  );
}

/** Simple card — no flip. Arrow links directly to LinkedIn. */
function TeamMemberCard({ member }: { member: TeamMember }) {
  const t = useTranslations("about.team");
  const hasLinkedIn = Boolean(member.linkedinUrl);

  const cardContent = (
    <article className="group border-secondary flex h-full flex-col overflow-hidden rounded-[32px] border bg-primary transition-transform duration-300 hover:-translate-y-1">
      <div className="overflow-hidden">
        <Image
          src={member.image}
          alt={member.name}
          width={628}
          height={628}
          sizes="(max-width: 700px) 100vw, (max-width: 980px) 50vw, (max-width: 1200px) 33vw, 300px"
          className="aspect-square w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between gap-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="m-0 text-xl leading-[1.2] font-bold uppercase">{member.name}</h3>
            <p className="m-0 mt-1 text-[13px] leading-[1.4] uppercase text-secondary/60">
              {member.role}
            </p>
          </div>
          {hasLinkedIn && (
            <span
              className="text-accent border-accent inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2"
              aria-hidden
            >
              <Linkedin className="h-4 w-4" />
            </span>
          )}
        </div>
        {hasLinkedIn && (
          <div className="flex justify-start">
            <span
              className="text-accent border-accent inline-flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 group-hover:bg-accent group-hover:text-black"
              aria-label={t("linkedinLabel", { name: member.name })}
            >
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        )}
      </div>
    </article>
  );

  if (hasLinkedIn) {
    return (
      <Link
        href={member.linkedinUrl as string}
        target="_blank"
        rel="noreferrer me"
        className="block h-full no-underline"
      >
        {cardContent}
      </Link>
    );
  }
  return cardContent;
}

export default function AboutCoreTeam({
  coreIntroText,
  coreAreas,
  founderBio: _founderBio,
  founderName = "Guillaume Le Goff",
  founderRole = "Founder & Partner",
  founderImage,
  founderLinkedinUrl = "https://www.linkedin.com/in/glegoff/",
  teamMembers,
}: AboutCoreTeamProps) {
  const t = useTranslations("about.team");
  // Guillaume is always rendered by the dedicated FounderCard above;
  // exclude him from the regular grid to avoid a duplicate card.
  const visibleMembers = teamMembers.filter(
    (m) =>
      typeof m.name === "string" &&
      m.name.trim().length > 0 &&
      m.name.trim().toLowerCase() !== founderName.trim().toLowerCase(),
  );

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
            className="grid gap-8
              min-[1200px]:grid-cols-3
              min-[1200px]:[grid-template-rows:auto_auto_2px_1fr]
              min-[1200px]:gap-x-8
              min-[1200px]:gap-y-0"
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

        <div className="grid items-start gap-8 min-[1200px]:grid-cols-[auto_1fr]">
          <motion.h2
            className="m-0 font-[var(--font-league-spartan)] text-[clamp(44px,4.5vw,64px)] leading-[1.05] font-bold uppercase min-[1200px]:max-w-[320px]"
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={smoothTransition}
          >
            {t("meet")}
            <br />
            {/* meetThe already contains a trailing space where needed (e.g. "the ").
                No space added in JSX so FR "l'" connects cleanly to "ÉQUIPE". */}
            {t("meetThe")}<span className="text-muted">{t("meetTeam")}</span>
          </motion.h2>
          <motion.div
            className="grid gap-7 min-[980px]:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {/* Guillaume founder card — direct LinkedIn link, no flip */}
            <FounderCard
              name={founderName}
              role={founderRole}
              image={founderImage || "/assets/v2/about/guillaume-le-goff.webp"}
              linkedinUrl={founderLinkedinUrl}
              t={t}
            />
            {visibleMembers.map((member) => (
              <TeamMemberCard member={member} key={member.name} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** Founder card — same layout as TeamMemberCard, no flip. */
function FounderCard({
  name,
  role,
  image,
  linkedinUrl,
  t,
}: {
  name: string;
  role: string;
  image?: string | null;
  linkedinUrl: string;
  t: ReturnType<typeof useTranslations<"about.team">>;
}) {
  const cardContent = (
    <article className="group border-secondary flex h-full flex-col overflow-hidden rounded-[32px] border bg-primary transition-transform duration-300 hover:-translate-y-1">
      {image && (
        <div className="overflow-hidden">
          <Image
            src={image}
            alt={name}
            width={628}
            height={628}
            sizes="(max-width: 700px) 100vw, (max-width: 980px) 50vw, (max-width: 1200px) 33vw, 300px"
            className="aspect-square w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-between gap-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="m-0 text-xl leading-[1.2] font-bold uppercase">{name}</h3>
            <p className="m-0 mt-1 text-[13px] leading-[1.4] uppercase text-secondary/60">{role}</p>
          </div>
          <span
            className="text-accent border-accent inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2"
            aria-hidden
          >
            <Linkedin className="h-4 w-4" />
          </span>
        </div>
        <div className="flex justify-start">
          <span
            className="text-accent border-accent inline-flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 group-hover:bg-accent group-hover:text-black"
            aria-label={t("linkedinLabel", { name })}
          >
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </article>
  );

  return (
    <Link href={linkedinUrl} target="_blank" rel="noreferrer me" className="block h-full no-underline">
      {cardContent}
    </Link>
  );
}
