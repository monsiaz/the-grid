import Image from "next/image";
import Link from "next/link";

export default function Frame1About() {
  return (
    <section className="relative isolate flex min-h-[413px] w-full items-center" id="about">
      <Image
        src="/figma-assets/frame-1-about.jpg"
        alt="About background"
        fill
        className="pointer-events-none z-0 object-cover"
      />
      <div className="absolute inset-0 z-10 bg-black/40" />
      <div className="relative z-20 mx-auto my-16 flex w-full max-w-[1344px] flex-col items-end justify-center gap-7 px-[clamp(20px,4vw,48px)] max-[900px]:items-start max-[900px]:gap-5">
        <p className="m-0 max-w-[660px] text-right text-xl leading-[1.3] uppercase max-[900px]:max-w-full max-[900px]:text-left max-[900px]:text-[17px]">
          WE ARE A 360° MOTORSPORT AGENCY COMBINING DRIVER MANAGEMENT AND STRATEGIC MARKETING TO BUILD CAREERS AND
          DEVELOP HIGH-IMPACT PARTNERSHIPS ACROSS THE ECOSYSTEM.
        </p>
        <Link
          href="#"
          className="text-secondary border-secondary inline-flex cursor-pointer items-center justify-center rounded-full border-2 bg-black/20 px-9 py-4 text-base leading-[1.2] no-underline uppercase"
        >
          EXPLORE
        </Link>
      </div>
    </section>
  );
}
