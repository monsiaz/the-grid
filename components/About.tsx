import Link from "next/link";

export default function About() {
  return (
    <section className="relative flex min-h-[413px] w-full items-center bg-about" id="about">
      <div className="absolute inset-0 z-10 bg-black/40" />
      <div className="relative z-20 mx-auto my-16 flex w-full max-w-[1344px] flex-col items-end justify-center gap-7 px-[clamp(20px,4vw,48px)] max-[900px]:items-start max-[900px]:gap-5">
        <p className="m-0 max-w-[660px] text-right text-xl leading-[1.3] uppercase max-[900px]:max-w-full max-[900px]:text-left max-[900px]:text-[17px]">
          We are a 360° motorsport agency combining driver management and strategic marketing to build careers and
          develop high-impact partnerships across the ecosystem.
        </p>
        <Link
          href="#"
          className="text-secondary border-secondary inline-flex cursor-pointer items-center justify-center rounded-full border-2 bg-black/20 px-9 py-4 text-base leading-[1.2] no-underline uppercase hover:text-black hover:bg-white transition-all duration-300"
        >
          Explore
        </Link>
      </div>
    </section>
  );
}
