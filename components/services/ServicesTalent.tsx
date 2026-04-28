"use client";

import { useTranslations } from "next-intl";
import ServicesCardGrid from "./ServicesCardGrid";

type ServicesTalentProps = {
  heading?: string | null;
  headingAccent?: string | null;
  description?: string | null;
  introTitle?: string | null;
  introText?: string | null;
  introImage?: string | null;
  servicesArrowStyle?: "default" | "slim";
  cards: { title: string; image: string; alt: string; description?: string | null }[];
};

export default function ServicesTalent({
  heading,
  headingAccent,
  description,
  introTitle,
  introText,
  introImage,
  servicesArrowStyle = "default",
  cards,
}: ServicesTalentProps) {
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
      introImage={introImage}
      introTitle={introTitle}
      servicesArrowStyle={servicesArrowStyle}
      cards={cards}
      gridClassName="px-[clamp(8px,1.6vw,20px)] min-[600px]:grid-cols-2 min-[900px]:grid-cols-3 min-[1200px]:grid-cols-6"
      imageHeightClassName="h-[260px] min-[900px]:h-[300px]"
      bodyPaddingClassName="p-6"
      cardImageSizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, (max-width: 1200px) 34vw, (max-width: 1660px) 17vw, 280px"
    />
  );
}
