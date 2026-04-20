import * as FlagIcons from "country-flag-icons/react/3x2";
import type { DriverCountryCode } from "./driversData";

const FLAG_BY_CODE: Record<DriverCountryCode, (typeof FlagIcons)["FR"]> = {
  FR: FlagIcons.FR,
  IN: FlagIcons.IN,
  GB: FlagIcons.GB,
  US: FlagIcons.US,
  PL: FlagIcons.PL,
};

const COUNTRY_NAME: Record<DriverCountryCode, string> = {
  FR: "France",
  IN: "India",
  GB: "United Kingdom",
  US: "United States",
  PL: "Poland",
};

type DriverFlagsProps = {
  codes: readonly DriverCountryCode[];
  keyPrefix: string;
  className?: string;
  wrapper?: "li" | "span" | "none";
};

export default function DriverFlags({ codes, keyPrefix, className, wrapper = "none" }: DriverFlagsProps) {
  return (
    <>
      {codes.map((code, index) => {
        const Flag = FLAG_BY_CODE[code];
        const key = `${keyPrefix}-${code}-${index}`;
        const label = COUNTRY_NAME[code] ?? code;
        const inner = (
          <Flag
            key={wrapper === "none" ? key : undefined}
            className={className}
            role="img"
            aria-label={label}
            focusable="false"
          />
        );
        if (wrapper === "li") {
          return (
            <li key={key} className="flex items-center">
              {inner}
            </li>
          );
        }
        if (wrapper === "span") {
          return (
            <span key={key} className="inline-flex items-center">
              {inner}
            </span>
          );
        }
        return inner;
      })}
    </>
  );
}
