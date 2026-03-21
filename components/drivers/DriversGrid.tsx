import DriversCardsRow from "./DriversCardsRow";
import { driversGridRows } from "./driversData";

export default function DriversGrid() {
  return (
    <section className="bg-primary w-full py-20" id="drivers-grid">
      <div className="mx-auto grid w-full max-w-[1344px] gap-6 px-[clamp(20px,4vw,48px)]">
        <DriversCardsRow slugs={driversGridRows[0]} />
        <DriversCardsRow slugs={driversGridRows[1]} />
        <DriversCardsRow slugs={driversGridRows[2]} compact />
        <DriversCardsRow slugs={driversGridRows[3]} compact />
      </div>
    </section>
  );
}
