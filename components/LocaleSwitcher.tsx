"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import {
  useTransition,
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import { createPortal } from "react-dom";
import { locales, localeLabels, type Locale } from "@/i18n/config";
import { LOCALE_ALTERNATES_ELEMENT_ID } from "@/components/LocaleAlternatesData";
import { ChevronDown } from "lucide-react";

type SwitcherEntry = { url: string; translated: boolean };
type AlternatesPayload = {
  canonical: string;
  xDefault: string;
  switcher: Record<Locale, SwitcherEntry>;
};

function readAlternatesFromDom(): AlternatesPayload | null {
  if (typeof document === "undefined") return null;
  const el = document.getElementById(LOCALE_ALTERNATES_ELEMENT_ID);
  if (!el?.textContent) return null;
  try {
    const parsed = JSON.parse(el.textContent) as AlternatesPayload;
    if (parsed && parsed.switcher) return parsed;
    return null;
  } catch {
    return null;
  }
}

const localeCodes: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  es: "ES",
  de: "DE",
  it: "IT",
  nl: "NL",
  zh: "中文",
};

export default function LocaleSwitcher({ dropdownDir = "up" }: { dropdownDir?: "up" | "down" }) {
  const t = useTranslations("footer.language");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuPos, setMenuPos] = useState<{
    top?: number;
    bottom?: number;
    right: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  const updateMenuPosition = useCallback(() => {
    if (!open || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const gap = 8;
    const right = window.innerWidth - rect.right;
    if (dropdownDir === "down") {
      setMenuPos({ top: rect.bottom + gap, right, bottom: undefined });
    } else {
      setMenuPos({
        bottom: window.innerHeight - rect.top + gap,
        right,
        top: undefined,
      });
    }
  }, [open, dropdownDir]);

  useLayoutEffect(() => {
    if (!open) {
      setMenuPos(null);
      return;
    }
    updateMenuPosition();
    const onScrollOrResize = () => updateMenuPosition();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open, updateMenuPosition]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (containerRef.current?.contains(target)) return;
      const el = e.target as HTMLElement;
      if (el.closest?.("[data-locale-switcher-dropdown]")) return;
      close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [open, close]);

  const pick = (next: Locale) => {
    close();
    if (next === locale) return;
    if (typeof document !== "undefined") {
      const oneYear = 60 * 60 * 24 * 365;
      // eslint-disable-next-line react-hooks/immutability -- document.cookie is external browser API
      document.cookie = `NEXT_LOCALE=${next}; Path=/; Max-Age=${oneYear}; SameSite=Lax`;
    }
    const alternates = readAlternatesFromDom();
    const explicit = alternates?.switcher?.[next]?.url;
    startTransition(() => {
      if (explicit) {
        window.location.assign(explicit);
      } else {
        router.replace(pathname, { locale: next });
      }
    });
  };

  const listbox = open && menuPos && (
    <ul
      data-locale-switcher-dropdown=""
      role="listbox"
      aria-label={t("srOnly")}
      className={[
        "fixed z-[10000] min-w-[160px] rounded-2xl border border-white/10 py-1.5",
        "bg-[#111] shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-md",
        "animate-in fade-in slide-in-from-bottom-2 duration-150",
      ].join(" ")}
      style={{
        right: menuPos.right,
        ...(menuPos.top !== undefined ? { top: menuPos.top } : {}),
        ...(menuPos.bottom !== undefined ? { bottom: menuPos.bottom } : {}),
      }}
    >
      {locales.map((l) => {
        const active = l === locale;
        return (
          <li key={l} role="option" aria-selected={active}>
            <button
              type="button"
              onClick={() => pick(l)}
              className={[
                "flex w-full items-center gap-3 px-4 py-2 text-left",
                "text-xs font-medium uppercase tracking-widest transition-colors duration-150",
                active
                  ? "text-accent"
                  : "text-secondary/60 hover:bg-white/5 hover:text-secondary",
              ].join(" ")}
            >
              <span className="font-normal normal-case tracking-normal">{localeLabels[l]}</span>
              {active && (
                <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("srOnly")}
        disabled={isPending}
        onClick={() => setOpen((v) => !v)}
        className={[
          "inline-flex h-8 items-center gap-1.5 rounded-full border px-3",
          "border-white/15 bg-white/5 text-secondary/70 backdrop-blur-sm",
          "transition-all duration-200",
          "hover:border-accent/60 hover:text-secondary",
          open ? "border-accent/60 text-secondary" : "",
          "disabled:cursor-not-allowed disabled:opacity-40",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent",
        ].join(" ")}
      >
        <span
          aria-hidden
          style={{
            fontFamily: "inherit",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: locale === "zh" ? 0 : "0.1em",
            lineHeight: 1,
          }}
        >
          {localeCodes[locale]}
        </span>
        <ChevronDown
          aria-hidden
          className={`h-3 w-3 shrink-0 text-secondary/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {mounted && listbox && createPortal(listbox, document.body)}
    </div>
  );
}
