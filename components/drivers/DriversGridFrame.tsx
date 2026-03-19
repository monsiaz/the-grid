import DriversCardsRowFrame from "./DriversCardsRowFrame";
import { driversFrames } from "./driversData";

export default function DriversGridFrame() {
  return (
    <section className="bg-primary w-full py-20" id="drivers-grid">
      <div className="mx-auto grid w-full max-w-[1344px] gap-6 px-[clamp(20px,4vw,48px)]">
        <DriversCardsRowFrame slugs={driversFrames[0]} />
        <DriversCardsRowFrame slugs={driversFrames[1]} />
        <DriversCardsRowFrame slugs={driversFrames[2]} compact />
        <DriversCardsRowFrame slugs={driversFrames[3]} compact />
      </div>
    </section>
  );
}
