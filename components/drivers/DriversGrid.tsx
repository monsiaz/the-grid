import DriversCardsRow from "./DriversCardsRow";
import type { DriverCardData } from "./driversData";

type DriversGridProps = {
  gridRows: DriverCardData[][];
};

export default function DriversGrid({ gridRows }: DriversGridProps) {
  return (
    <section className="bg-primary w-full py-20" id="drivers-grid">
      <div className="mx-auto grid w-full max-w-[1344px] gap-5 px-[clamp(20px,4vw,48px)]">
        {gridRows.map((row, idx) => (
          <DriversCardsRow key={idx} drivers={row} />
        ))}
      </div>
    </section>
  );
}
