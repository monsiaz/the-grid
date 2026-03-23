"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, fadeDown, smoothTransition } from "./motion";

type HeaderItemId = "about" | "services" | "drivers" | "news" | "contact";

type HeaderProps = {
  activeItem?: HeaderItemId;
  anchorPrefix?: string;
};

const headerItems: Array<{ id: HeaderItemId; label: string; href: string }> = [
  { id: "about", label: "About", href: "/about" },
  { id: "services", label: "Services", href: "/services" },
  { id: "drivers", label: "Drivers", href: "/drivers" },
  { id: "news", label: "News", href: "/news" },
  { id: "contact", label: "Contact", href: "/contact" },
];

export default function Header({ activeItem, anchorPrefix = "" }: HeaderProps) {
  return (
    <motion.header
      className="relative z-20 mx-auto flex h-[76px] w-full max-w-[1344px] items-center justify-between px-[clamp(20px,4vw,48px)] py-5 max-[900px]:h-auto max-[900px]:flex-col max-[900px]:items-start max-[900px]:gap-[14px] max-[900px]:py-[18px]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...smoothTransition, duration: 0.6 }}
    >
      <Link href="/" aria-label="Go to homepage">
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
          <Image
            src="/images/logo.svg"
            alt="The Grid"
            width={122}
            height={44}
            className="h-[44px] w-[122px]"
          />
        </motion.div>
      </Link>
      <nav className="flex items-center gap-7 text-base leading-[1.2] uppercase max-[900px]:flex-wrap max-[900px]:gap-[14px] max-[900px]:text-sm">
        {headerItems.map((item, idx) => (
          <motion.div
            key={item.id}
            variants={fadeDown}
            initial="hidden"
            animate="visible"
            transition={{ ...smoothTransition, delay: 0.1 + idx * 0.06 }}
          >
            <Link
              href={item.href.startsWith("#") ? `${anchorPrefix}${item.href}` : item.href}
              className={`${activeItem === item.id ? "text-accent" : "text-secondary"} no-underline uppercase transition-colors duration-300 hover:text-accent`}
            >
              {item.label}
            </Link>
          </motion.div>
        ))}
      </nav>
    </motion.header>
  );
}
