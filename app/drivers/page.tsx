import Footer from "@/components/Footer";
import DriversGrid from "@/components/drivers/DriversGrid";
import DriversHero from "@/components/drivers/DriversHero";

export default function DriversPage() {
  return (
    <main className="bg-primary text-secondary w-full overflow-x-hidden">
      <DriversHero />
      <DriversGrid />
      <Footer />
    </main>
  );
}
