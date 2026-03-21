import DriverCard from "./DriverCard";
import { getDriverBySlug } from "./driversData";

type DriversCardsRowProps = {
  slugs: string[];
  compact?: boolean;
};

export default function DriversCardsRow({ slugs, compact = false }: DriversCardsRowProps) {
  return (
    <div className="grid grid-cols-4 gap-7 max-[1200px]:grid-cols-2 max-[700px]:grid-cols-1">
      {slugs.map((slug) => {
        const driver = getDriverBySlug(slug);

        if (!driver) {
          return null;
        }

        return <DriverCard key={slug} driver={driver} compact={compact} />;
      })}
    </div>
  );
}
