"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Wish } from "@/lib/types";

const colorMap: Record<Wish["color"], string> = {
  red: "#f04d68",
  blue: "#4f86f7",
  green: "#41b883",
  yellow: "#e3b945",
  purple: "#9361d9"
};

type TanzakuCardProps = {
  wish: Wish;
  top: string;
  left: string;
  rotate: number;
  onSelect: (wish: Wish) => void;
};

export function TanzakuCard({ wish, top, left, rotate, onSelect }: TanzakuCardProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(wish)}
      className="focusable absolute flex w-9 origin-top flex-col items-center"
      style={{ top, left }}
      initial={{ rotate }}
      whileHover={
        reducedMotion
          ? { filter: "drop-shadow(0 0 12px rgba(190,220,255,0.5))" }
          : { rotate: rotate + 3, y: 2, filter: "drop-shadow(0 0 12px rgba(190,220,255,0.5))" }
      }
      transition={{ type: "spring", stiffness: 170, damping: 14 }}
      aria-label={`View wish by ${wish.nickname}`}
    >
      <span className="h-3 w-[1px] bg-white/70" />
      <span
        className="relative block h-24 w-8 rounded-md shadow-[0_10px_18px_rgba(8,12,28,0.45)]"
        style={{ backgroundColor: colorMap[wish.color] }}
      >
        <span className="absolute inset-0 rounded-md bg-[linear-gradient(180deg,rgba(255,255,255,0.12),transparent_24%)]" />
      </span>
    </motion.button>
  );
}
