"use client";

import DriverCard from "./DriverCard";
import { getDriverBySlug } from "./driversData";
import { motion, staggerContainer, viewport } from "../motion";

type DriversCardsRowProps = {
  slugs: string[];
  compact?: boolean;
};

export default function DriversCardsRow({ slugs, compact = false }: DriversCardsRowProps) {
  return (
    <motion.div
      className="grid grid-cols-4 gap-7 max-[1200px]:grid-cols-2 max-[700px]:grid-cols-1"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {slugs.map((slug) => {
        const driver = getDriverBySlug(slug);

        if (!driver) {
          return null;
        }

        return <DriverCard key={slug} driver={driver} compact={compact} />;
      })}
    </motion.div>
  );
}
