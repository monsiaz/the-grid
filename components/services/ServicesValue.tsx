"use client";

import { useTranslations } from "next-intl";
import ServicesCardGrid from "./ServicesCardGrid";

type ServicesValueProps = {
  heading?: string | null;
  headingAccent?: string | null;
  description?: string | null;
  introTitle?: string | null;
  introText?: string | null;
  introImage?: string | null;
  servicesArrowStyle?: "default" | "slim";
  cards: { title: string; image: string; alt: string; description?: string | null }[];
};
export default function ServicesValue({
  heading,
  headingAccent,
  description,
  introTitle,
  introText,
  introImage,
  servicesArrowStyle = "default",
  cards,
}: ServicesValueProps) {
  const t = useTranslations("services");

  return (
    <section className="bg-primary py-20 overflow-x-clip" id="services-value">
      {/*
        `grid-cols-1` (= grid-template-columns: repeat(1, minmax(0,1fr))) is
        essential here: without it, the implicit grid track sizes to
        `min-content`, and the case-study carousel's `flex w-max` inner row
        (~5000px for 6 cards) blows the track out — pushing the card grid
        above it off-screen and leaving the first block visually empty.
        `overflow-x-clip` on the outer section is a second line of defence
        in case a future child tries the same trick.
      */}
      <div className="mx-auto grid w-full max-w-[1728px] grid-cols-1 gap-20 min-w-0">
        <ServicesCardGrid
          heading={
            <>
              {heading || t("value.headingFallback")}
              <br />
              <span className="text-muted">{headingAccent || t("value.headingAccentFallback")}</span>
            </>
          }
          description={description || ""}
          introTitle={introTitle || null}
          introText={introText || ""}
          introImage={introImage || null}
          cards={cards}
          servicesArrowStyle={servicesArrowStyle}
          gridClassName="px-[clamp(16px,3vw,40px)] min-[600px]:grid-cols-2 min-[900px]:grid-cols-3 min-[1200px]:grid-cols-5"
          imageHeightClassName="h-[260px] min-[900px]:h-[300px]"
          bodyPaddingClassName="p-6"
          cardImageSizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, (max-width: 1200px) 34vw, (max-width: 1660px) 21vw, 350px"
        />
      </div>
    </section>
  );
}
