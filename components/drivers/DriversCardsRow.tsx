import DriverCard from "./DriverCard";
import type { DriverCardData } from "./driversData";

type DriversCardsRowProps = {
  drivers: DriverCardData[];
};

export default function DriversCardsRow({ drivers }: DriversCardsRowProps) {
  return (
    <div className="grid grid-cols-2 gap-5 max-[700px]:grid-cols-1">
      {drivers.map((driver) => (
        <DriverCard key={driver.slug} driver={driver} />
      ))}
    </div>
  );
}
