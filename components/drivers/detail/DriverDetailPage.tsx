"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import type { DriverCardData, DriverDetailData } from "../driversData";
import DriverDetailAgency from "./DriverDetailAgency";
import DriverDetailCareer from "./DriverDetailCareer";
import DriverDetailHero from "./DriverDetailHero";
import DriverDetailTop from "./DriverDetailTop";
import DriverDetailBlocks from "./DriverDetailBlocks";

type FooterSiteProps = {
  instagramUrl?: string;
  linkedinUrl?: string;
  copyright?: string;
  privacyPolicyUrl?: string;
};

type DriverDetailPageProps = {
  driver: DriverCardData;
  detail: DriverDetailData;
  siteProps?: FooterSiteProps;
};

export default function DriverDetailPage({ driver, detail, siteProps }: DriverDetailPageProps) {
  return (
    <main id="main" className="bg-primary text-secondary w-full">
      <Header activeItem="drivers" />
      <DriverDetailHero driver={driver} />
      <section className="mx-auto w-full max-w-[1344px] px-[clamp(20px,4vw,48px)] pt-10 pb-16">
        {detail.pageBlocks && detail.pageBlocks.length > 0 ? (
          <DriverDetailBlocks blocks={detail.pageBlocks} relatedNews={detail.relatedNews} />
        ) : (
          <div className="grid gap-12">
            <DriverDetailTop driver={driver} detail={detail} />
            <DriverDetailCareer detail={detail} />
            <DriverDetailAgency detail={detail} />
          </div>
        )}
      </section>
      <Footer
        instagramUrl={siteProps?.instagramUrl}
        linkedinUrl={siteProps?.linkedinUrl}
        copyright={siteProps?.copyright}
        privacyPolicyUrl={siteProps?.privacyPolicyUrl}
      />
    </main>
  );
}
