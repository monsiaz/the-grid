import DriversCardsRow from "./DriversCardsRow";

type DriverData = {
  slug: string;
  name: string;
  role: string;
  image: string;
  flags: string[];
  instagramUrl: string;
};

type DriversGridProps = {
  gridRows: DriverData[][];
};

export default function DriversGrid({ gridRows }: DriversGridProps) {
  return (
    <section className="bg-primary w-full py-20" id="drivers-grid">
      <div className="mx-auto grid w-full max-w-[1344px] gap-6 px-[clamp(20px,4vw,48px)]">
        {gridRows.map((row, idx) => (
          <DriversCardsRow key={idx} drivers={row} compact={idx >= 2} />
        ))}
      </div>
    </section>
  );
}
