import DriverDetailPage from "@/components/drivers/detail/DriverDetailPage";
import { getPayloadClient } from "@/lib/payload";
import { notFound } from "next/navigation";

export const revalidate = 60;

type DriverDetailRouteProps = {
  params: Promise<{ name: string }>;
};

export default async function DriverDetailRoutePage({ params }: DriverDetailRouteProps) {
  const { name } = await params;
  const payload = await getPayloadClient();

  const result = await payload.find({
    collection: "drivers",
    where: { slug: { equals: name } },
    limit: 1,
  });

  if (result.docs.length === 0) {
    notFound();
  }

  const driverDoc = result.docs[0];

  const driver = {
    slug: driverDoc.slug,
    name: driverDoc.name,
    role: driverDoc.role,
    image: driverDoc.image,
    flags: driverDoc.flags as ("FR" | "IN" | "GB" | "US" | "PL")[],
    instagramUrl: driverDoc.instagramUrl,
  };

  const detail = {
    slug: driverDoc.slug,
    profileTitle: driverDoc.detail?.profileTitle || "Career Overview and Driver Profile",
    profileParagraphs: driverDoc.detail?.profileParagraphs?.split("\n") || [],
    careerTitle: driverDoc.detail?.careerTitle || `${driverDoc.name}'s Career Snapshot`,
    careerParagraphs: driverDoc.detail?.careerParagraphs?.split("\n") || [],
    transitionTitle: driverDoc.detail?.transitionTitle || "Career Development",
    transitionParagraph: driverDoc.detail?.transitionParagraph || "",
    agencyTitle: driverDoc.detail?.agencyTitle || `${driverDoc.name} and The Grid Agency`,
    agencyParagraphs: driverDoc.detail?.agencyParagraphs?.split("\n") || [],
    highestFinish: driverDoc.detail?.highestFinish || "--",
    careerPoints: driverDoc.detail?.careerPoints || "--",
    grandPrixEntered: driverDoc.detail?.grandPrixEntered || "--",
    careerPodiums: driverDoc.detail?.careerPodiums || "--",
  };

  return <DriverDetailPage driver={driver} detail={detail} />;
}
