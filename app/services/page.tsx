import Footer from "@/components/Footer";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesPartner from "@/components/services/ServicesPartner";
import ServicesTalent from "@/components/services/ServicesTalent";
import ServicesValue from "@/components/services/ServicesValue";

export default function ServicesPage() {
  return (
    <main className="bg-primary text-secondary w-full ">
      <ServicesHero />
      <ServicesTalent />
      <ServicesPartner />
      <ServicesValue />
      <Footer />
    </main>
  );
}
