import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary flex min-h-[76px] items-center py-5" id="contact">
      <div className="mx-auto flex w-full max-w-[1344px] items-center justify-between gap-4 px-[clamp(20px,4vw,48px)] max-[900px]:flex-col max-[900px]:items-start">
        <div className="flex items-center gap-4 text-xs leading-none uppercase">
          <Link href="#" aria-label="Instagram" className="text-secondary no-underline">
            IG
          </Link>
          <Link href="#" aria-label="LinkedIn" className="text-secondary no-underline">
            IN
          </Link>
          <Link href="mailto:contact@thegrid.agency" aria-label="Email" className="text-secondary no-underline">
            MAIL
          </Link>
        </div>
        <div className="flex items-center gap-3 text-base leading-[1.2] whitespace-nowrap uppercase max-[900px]:text-xs max-[900px]:whitespace-normal">
          <span>(C) 2026 THE GRID AGENCY, ALL RIGHTS RESERVED</span>
          <span className="bg-secondary block h-4 w-px" />
          <Link href="#" className="text-secondary no-underline">
            PRIVACY POLICY
          </Link>
        </div>
      </div>
    </footer>
  );
}
