import Header from "./Header";
import Link from "next/link";

type HeroProps = {
  backgroundImage: string;
  title: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
  minHeightClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  overlayClassName?: string;
  headerAnchorPrefix?: string;
  activeHeaderItem?: "about" | "services" | "drivers" | "news" | "contact";
  footerSlot?: React.ReactNode;
  cta?: {
    href: string;
    label: string;
    className?: string;
  };
};

export default function Hero({
  backgroundImage,
  title,
  description,
  children,
  minHeightClassName = "min-h-[460px]",
  contentClassName = "my-32 max-w-[680px] text-left",
  titleClassName = "font-[var(--font-league-spartan)] text-[64px] leading-none font-bold uppercase drop-shadow-[4px_4px_8px_rgba(0,0,0,0.1)] max-[1200px]:text-[clamp(44px,6vw,64px)]",
  descriptionClassName = "mt-2 text-base leading-[1.4] uppercase",
  overlayClassName = "bg-black/40",
  headerAnchorPrefix,
  activeHeaderItem,
  footerSlot,
  cta,
}: HeroProps) {
  return (
    <section
      className={`relative w-full bg-cover bg-center ${minHeightClassName}`}
      style={{ backgroundImage: `url("${backgroundImage}")` }}
    >
      <div className={`absolute inset-0 z-10 ${overlayClassName}`} />
      <Header activeItem={activeHeaderItem} anchorPrefix={headerAnchorPrefix} />
      <div className="relative z-20 mx-auto w-full max-w-[1344px] px-[clamp(20px,4vw,48px)]">
        <div className={`${contentClassName} max-[900px]:mt-[82px] max-[900px]:mb-[72px] max-[900px]:max-w-full`}>
          <h1 className={titleClassName}>{title}</h1>
          {description ? <p className={descriptionClassName}>{description}</p> : null}
          {cta ? (
            <Link
              href={cta.href}
              className={`mt-8 inline-flex items-center justify-center rounded-full border-2 border-accent px-4 py-3 text-[22px] leading-[1.2] text-accent no-underline transition-all duration-300 hover:bg-accent hover:text-black ${cta.className ?? ""}`}
            >
              {cta.label}
            </Link>
          ) : null}
          {children}
        </div>
      </div>
      {footerSlot}
    </section>
  );
}
