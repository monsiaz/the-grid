import DriverDetailPage from "@/components/drivers/detail/DriverDetailPage";
import { getDriverBySlug, getDriverDetailData } from "@/components/drivers/driversData";
import { notFound } from "next/navigation";

type DriverDetailRouteProps = {
  params: Promise<{ name: string }>;
};

export default async function DriverDetailRoutePage({ params }: DriverDetailRouteProps) {
  const { name } = await params;
  const driver = getDriverBySlug(name);

  if (!driver) {
    notFound();
  }

  const detail = getDriverDetailData(name);

  return <DriverDetailPage driver={driver} detail={detail} />;
}
