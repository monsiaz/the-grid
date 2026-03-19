import Image from "next/image";
import Link from "next/link";

type HeaderItemId = "about" | "services" | "drivers" | "news" | "contact";

type HeaderProps = {
  activeItem?: HeaderItemId;
  anchorPrefix?: string;
};

const headerItems: Array<{ id: HeaderItemId; label: string; href: string }> = [
  { id: "about", label: "About", href: "#about" },
  { id: "services", label: "Services", href: "#services" },
  { id: "drivers", label: "Drivers", href: "#drivers" },
  { id: "news", label: "News", href: "#news" },
  { id: "contact", label: "Contact", href: "#contact" },
];

export default function Header({ activeItem, anchorPrefix = "" }: HeaderProps) {
  return (
    <header className="relative z-20 mx-auto flex h-[76px] w-full max-w-[1344px] items-center justify-between px-[clamp(20px,4vw,48px)] py-5 max-[900px]:h-auto max-[900px]:flex-col max-[900px]:items-start max-[900px]:gap-[14px] max-[900px]:py-[18px]">
      <Image
        src="/images/logo.svg"
        alt="The Grid"
        width={122}
        height={44}
        className="h-[44px] w-[122px]"
      />
      <nav className="flex items-center gap-7 text-base leading-[1.2] uppercase max-[900px]:flex-wrap max-[900px]:gap-[14px] max-[900px]:text-sm">
        {headerItems.map((item) => (
          <Link
            href={`${anchorPrefix}${item.href}`}
            key={item.id}
            className={`${activeItem === item.id ? "text-accent" : "text-secondary"} no-underline uppercase hover:text-accent`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
