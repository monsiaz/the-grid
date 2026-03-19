import DriverCardFrame from "./DriverCardFrame";
import { getDriverBySlug } from "./driversData";

type DriversCardsRowFrameProps = {
  slugs: string[];
  compact?: boolean;
};

export default function DriversCardsRowFrame({ slugs, compact = false }: DriversCardsRowFrameProps) {
  return (
    <div className="grid grid-cols-4 gap-7 max-[1200px]:grid-cols-2 max-[700px]:grid-cols-1">
      {slugs.map((slug) => {
        const driver = getDriverBySlug(slug);

        if (!driver) {
          return null;
        }

        return <DriverCardFrame key={slug} driver={driver} compact={compact} />;
      })}
    </div>
  );
}
