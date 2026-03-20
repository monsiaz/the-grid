import * as FlagIcons from "country-flag-icons/react/3x2";
import type { DriverCountryCode } from "./driversData";

const FLAG_BY_CODE: Record<DriverCountryCode, (typeof FlagIcons)["FR"]> = {
  FR: FlagIcons.FR,
  IN: FlagIcons.IN,
  GB: FlagIcons.GB,
  US: FlagIcons.US,
  PL: FlagIcons.PL,
};

type DriverFlagsProps = {
  codes: readonly DriverCountryCode[];
  keyPrefix: string;
  className?: string;
};

export default function DriverFlags({ codes, keyPrefix, className }: DriverFlagsProps) {
  return (
    <>
      {codes.map((code, index) => {
        const Flag = FLAG_BY_CODE[code];
        return (
          <Flag
            key={`${keyPrefix}-${code}-${index}`}
            className={className}
            aria-hidden
            focusable="false"
          />
        );
      })}
    </>
  );
}
