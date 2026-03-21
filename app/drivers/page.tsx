import Footer from "@/components/Footer";
import DriversGridFrame from "@/components/drivers/DriversGridFrame";
import DriversHeroFrame from "@/components/drivers/DriversHeroFrame";

export default function DriversPage() {
  return (
    <main className="bg-primary text-secondary w-full overflow-x-hidden">
      <DriversHeroFrame />
      <DriversGridFrame />
      <Footer />
    </main>
  );
}
