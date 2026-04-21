"use client";

import { useTranslations } from "next-intl";
import ServicesCardGrid from "./ServicesCardGrid";

type ServicesTalentProps = {
  heading?: string | null;
  headingAccent?: string | null;
  description?: string | null;
  introText?: string | null;
  cards: { title: string; image: string; alt: string; description?: string | null }[];
};

export default function ServicesTalent({ heading, headingAccent, description, introText, cards }: ServicesTalentProps) {
  const t = useTranslations("services.talent");
  return (
    <ServicesCardGrid
      id="services-talent"
      heading={
        <>
          {heading || t("headingFallback")}
          <br />
          <span className="text-muted">{headingAccent || t("headingAccentFallback")}</span>
        </>
      }
      description={description || ""}
      introText={introText || ""}
      cards={cards}
      gridClassName="min-[600px]:grid-cols-2 min-[900px]:grid-cols-3 min-[1200px]:grid-cols-[repeat(6,minmax(0,1fr))]"
      imageHeightClassName="h-[240px] min-[900px]:h-[280px]"
      bodyPaddingClassName="p-6"
    />
  );
}
