"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Link } from "@/i18n/navigation";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import type { DriverCardData, DriverDetailData } from "../driversData";
import DriverDetailAgency from "./DriverDetailAgency";
import DriverDetailCareer from "./DriverDetailCareer";
import DriverDetailTop from "./DriverDetailTop";
import { motion, fadeUp, smoothTransition } from "../../motion";

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
  const t = useTranslations("drivers.detail");
  return (
    <main id="main" className="bg-primary text-secondary w-full ">
      <Header activeItem="drivers" />
      <section className="mx-auto w-full max-w-[1344px] px-[clamp(20px,4vw,48px)] pt-6 pb-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={smoothTransition}
        >
          <Link
            href="/drivers"
            className="text-accent border-accent mb-8 inline-flex h-[34px] w-[57px] items-center justify-center rounded-full border-2 no-underline transition-all duration-300 hover:bg-accent hover:text-black hover:scale-110"
            aria-label={t("back")}
          >
            <ChevronLeft className="h-5 w-5 shrink-0" aria-hidden />
          </Link>
        </motion.div>
        <div className="grid gap-16">
          <DriverDetailTop driver={driver} detail={detail} />
          <DriverDetailCareer detail={detail} />
          <DriverDetailAgency detail={detail} />
        </div>
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
