import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="relative z-20 mx-auto flex h-[76px] w-full max-w-[1344px] items-center justify-between px-[clamp(20px,4vw,48px)] py-5 max-[900px]:h-auto max-[900px]:flex-col max-[900px]:items-start max-[900px]:gap-[14px] max-[900px]:py-[18px]">
      <Image
        src="/figma-assets/logo-color-white.svg"
        alt="The Grid"
        width={122}
        height={44}
        className="h-[44px] w-[122px]"
      />
      <nav className="flex items-center gap-7 text-base leading-[1.2] uppercase max-[900px]:flex-wrap max-[900px]:gap-[14px] max-[900px]:text-sm">
        <Link href="#about" className="text-secondary no-underline">
          ABOUT
        </Link>
        <Link href="#services" className="text-secondary no-underline">
          SERVICES
        </Link>
        <Link href="#drivers" className="text-secondary no-underline">
          DRIVERS
        </Link>
        <Link href="#news" className="text-secondary no-underline">
          NEWS
        </Link>
        <Link href="#contact" className="text-secondary no-underline">
          CONTACT
        </Link>
      </nav>
    </header>
  );
}
