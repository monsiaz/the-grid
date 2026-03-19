import Footer from "./components/homepage/Footer";
import About from "./components/homepage/About";
import Hero from "./components/homepage/Hero";
import Experience from "./components/homepage/Experience";
import Services from "./components/homepage/Services";
import News from "./components/homepage/News";
import Drivers from "./components/homepage/Drivers";

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
