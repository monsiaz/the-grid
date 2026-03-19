import Footer from "@/components/Footer";
import ServicesHeroFrame from "@/components/services/ServicesHeroFrame";
import ServicesTalentFrame from "@/components/services/ServicesTalentFrame";
import ServicesPartnerFrame from "@/components/services/ServicesPartnerFrame";
import ServicesValueFrame from "@/components/services/ServicesValueFrame";

export default function ServicesPage() {
  return (
    <main className="bg-primary text-secondary w-full overflow-x-hidden">
      <ServicesHeroFrame />
      <ServicesTalentFrame />
      <ServicesPartnerFrame />
      <ServicesValueFrame />
      <Footer />
    </main>
  );
}
