import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import type { DriverCardData, DriverDetailData } from "../driversData";
import DriverDetailAgencyFrame from "./DriverDetailAgencyFrame";
import DriverDetailCareerFrame from "./DriverDetailCareerFrame";
import DriverDetailTopFrame from "./DriverDetailTopFrame";

type DriverDetailPageProps = {
  driver: DriverCardData;
  detail: DriverDetailData;
};

export default function DriverDetailPage({ driver, detail }: DriverDetailPageProps) {
  return (
    <main className="bg-primary text-secondary w-full overflow-x-hidden">
      <Header activeItem="drivers" />
      <section className="mx-auto w-full max-w-[1344px] px-[clamp(20px,4vw,48px)] pt-10 pb-20">
        <Link
          href="/drivers"
          className="text-accent border-accent mb-16 inline-flex h-[34px] w-[57px] items-center justify-center rounded-full border-2 text-[18px] no-underline transition-all duration-300 hover:bg-accent hover:text-black"
          aria-label="Back to drivers"
        >
          ←
        </Link>
        <div className="grid gap-16">
          <DriverDetailTopFrame driver={driver} detail={detail} />
          <DriverDetailCareerFrame detail={detail} />
          <DriverDetailAgencyFrame detail={detail} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
