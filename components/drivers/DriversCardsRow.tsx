"use client";

import DriverCard from "./DriverCard";
import type { DriverCardData } from "./driversData";
import { motion, staggerContainer, viewport } from "../motion";

type DriversCardsRowProps = {
  drivers: DriverCardData[];
  compact?: boolean;
};

export default function DriversCardsRow({ drivers, compact = false }: DriversCardsRowProps) {
  return (
    <motion.div
      className="grid grid-cols-4 gap-7 max-[1200px]:grid-cols-2 max-[700px]:grid-cols-1"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {drivers.map((driver) => (
        <DriverCard key={driver.slug} driver={driver} compact={compact} />
      ))}
    </motion.div>
  );
}
