import Footer from "@/components/Footer";
import About from "@/components/About";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Services from "@/components/Services";
import News from "@/components/News";
import Drivers from "@/components/Drivers";

export default function Home() {
  return (
    <main className="bg-primary text-secondary w-full overflow-x-hidden">
      <Hero />
      <About />
      <Experience />
      <Services />
      <News />
      <Drivers />
      <Footer />
    </main>
  );
}
