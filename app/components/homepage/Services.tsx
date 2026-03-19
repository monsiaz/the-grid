import Image from "next/image";
import Link from "next/link";

export default function Frame5Services() {
  return (
    <section className="relative isolate flex min-h-[575px] w-full items-center" id="services">
      <Image
        src="/figma-assets/frame-5-services.png"
        alt="Services background"
        fill
        className="pointer-events-none z-0 object-cover"
      />
      <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(0,0,0,0.9),rgba(0,0,0,0)_75%)]" />
      <div className="relative z-20 mx-auto my-32 flex w-full max-w-[1344px] flex-col items-start gap-14 px-[clamp(20px,4vw,48px)] max-[900px]:my-[88px] max-[900px]:gap-8">
        <div className="text-soft grid gap-7 text-[40px] leading-[1.3] uppercase max-[1200px]:text-[clamp(32px,4vw,40px)]">
          <p className="m-0">SPORT MANAGEMENT</p>
          <p className="m-0">IMAGE &amp; MEDIA</p>
          <p className="m-0">COMMERCIAL DEVELOPMENT</p>
        </div>
        <Link
          href="#"
          className="text-accent border-accent inline-flex cursor-pointer items-center justify-center rounded-full border-2 bg-black/20 px-9 py-4 text-base leading-[1.2] no-underline uppercase"
        >
          LEARN MORE
        </Link>
      </div>
    </section>
  );
}
