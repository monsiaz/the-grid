import Header from "./Header";

export default function Frame3Hero() {
  return (
    <section className="relative min-h-[460px] w-full bg-hero">
      <div className="absolute inset-0 z-10 bg-black/40" />
      <Header />
      <div className="relative z-20 mx-auto w-full max-w-[1344px] px-[clamp(20px,4vw,48px)]">
        <h1 className="my-32 max-w-[680px] font-[var(--font-league-spartan)] text-[64px] leading-none font-bold uppercase drop-shadow-[4px_4px_8px_rgba(0,0,0,0.1)] max-[1200px]:text-[clamp(44px,6vw,64px)] max-[900px]:mt-[82px] max-[900px]:mb-[72px] max-[900px]:max-w-full">
          Opening the gates to elite motorsport
        </h1>
      </div>
    </section>
  );
}
