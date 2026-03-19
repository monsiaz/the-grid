import Image from "next/image";
import Link from "next/link";

export default function Frame7Drivers() {
  return (
    <section className="relative isolate flex min-h-[800px] w-full items-center justify-center" id="drivers">
      <Image
        src="/figma-assets/frame-7-drivers.png"
        alt="Drivers background"
        fill
        className="pointer-events-none z-0 object-cover"
      />
      <div className="absolute inset-0 z-10 bg-black/40" />
      <div className="relative z-20 mx-auto my-32 grid w-full max-w-[1344px] justify-items-center gap-14 px-[clamp(20px,4vw,48px)] text-center max-[900px]:my-[88px] max-[900px]:gap-[38px]">
        <h2 className="m-0 font-[var(--font-league-spartan)] text-[64px] leading-none font-bold uppercase drop-shadow-[4px_4px_8px_rgba(0,0,0,0.1)] max-[1200px]:text-[clamp(44px,6vw,64px)]">
          FOR DESERVING
          <br />
          DRIVERS
        </h2>
        <Link
          href="#"
          className="text-accent border-accent inline-flex cursor-pointer items-center justify-center rounded-full border-2 bg-black/20 px-9 py-4 text-base leading-[1.2] no-underline uppercase"
        >
          MEET OUR DRIVERS
        </Link>
      </div>
    </section>
  );
}
