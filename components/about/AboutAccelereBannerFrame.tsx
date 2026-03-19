import Image from "next/image";

export default function AboutAccelereBannerFrame() {
  return (
    <section className="relative min-h-[800px] w-full overflow-hidden">
      <Image
        src="/figma-assets/about/accelere-banner.jpg"
        alt="ACCÉLÈRE motorsport initiative"
        fill
        sizes="100vw"
        className="object-cover"
      />
    </section>
  );
}
