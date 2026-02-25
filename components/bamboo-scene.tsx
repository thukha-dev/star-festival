"use client";

import { motion, useReducedMotion } from "framer-motion";

type BambooSceneProps = {
  introActive: boolean;
};

const decorativeCards = [
  { id: "d1", top: "20%", left: "32%", rotate: -5, color: "#f04d68" },
  { id: "d2", top: "24%", left: "42%", rotate: 3, color: "#4f86f7" },
  { id: "d3", top: "30%", left: "25%", rotate: -2, color: "#41b883" },
  { id: "d4", top: "35%", left: "48%", rotate: 4, color: "#e3b945" },
  { id: "d5", top: "42%", left: "33%", rotate: -4, color: "#9361d9" },
  { id: "d6", top: "46%", left: "22%", rotate: 2, color: "#f04d68" },
  { id: "d7", top: "50%", left: "44%", rotate: -3, color: "#4f86f7" },
  { id: "d8", top: "56%", left: "30%", rotate: 5, color: "#41b883" },
  { id: "d9", top: "60%", left: "39%", rotate: -2, color: "#e3b945" },
  { id: "d10", top: "28%", left: "58%", rotate: 4, color: "#9361d9" },
  { id: "d11", top: "38%", left: "57%", rotate: -4, color: "#f04d68" },
  { id: "d12", top: "48%", left: "56%", rotate: 2, color: "#4f86f7" }
] as const;

export function BambooScene({ introActive }: BambooSceneProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.section
      className="relative mx-auto mt-2 h-[46vh] w-full max-w-4xl md:mt-4 md:h-[52vh]"
      animate={introActive && !reducedMotion ? { scale: [1, 1.04, 1], y: [0, -6, 0] } : { scale: 1, y: 0 }}
      transition={{ duration: 2.2, ease: "easeInOut" }}
    >
      <div className="absolute inset-x-0 bottom-3 mx-auto h-24 w-[80%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(136,197,255,0.14),transparent_65%)]" />
      <div className="absolute left-1/2 top-2 h-[88%] w-3 -translate-x-1/2 rounded-full bg-gradient-to-b from-green-300/70 via-green-500/70 to-green-900/80 shadow-[0_0_30px_rgba(92,170,120,0.35)]" />

      <motion.div
        className="absolute left-1/2 top-0 h-full w-[76%] -translate-x-1/2 origin-bottom"
        animate={reducedMotion ? { rotate: 0 } : { rotate: [-0.7, 0.7, -0.7] }}
        transition={reducedMotion ? { duration: 0 } : { duration: 6.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <span className="absolute left-[38%] top-[18%] h-1 w-24 rounded-full bg-green-300/70" />
        <span className="absolute left-[22%] top-[34%] h-1 w-24 rounded-full bg-green-300/65" />
        <span className="absolute left-[48%] top-[28%] h-1 w-24 rounded-full bg-green-300/65" />
        <span className="absolute left-[20%] top-[48%] h-1 w-28 rounded-full bg-green-300/60" />
        <span className="absolute left-[45%] top-[44%] h-1 w-24 rounded-full bg-green-300/60" />
        <span className="absolute left-[30%] top-[16%] h-4 w-8 -rotate-[18deg] rounded-full bg-gradient-to-r from-green-300/60 to-green-500/15" />
        <span className="absolute left-[50%] top-[24%] h-4 w-8 rotate-[14deg] rounded-full bg-gradient-to-l from-green-300/60 to-green-500/15" />
        <span className="absolute left-[25%] top-[40%] h-4 w-8 -rotate-[16deg] rounded-full bg-gradient-to-r from-green-300/60 to-green-500/15" />
        <span className="absolute left-[52%] top-[38%] h-4 w-8 rotate-[20deg] rounded-full bg-gradient-to-l from-green-300/60 to-green-500/15" />
        <span className="absolute left-[26%] top-[55%] h-4 w-8 -rotate-[10deg] rounded-full bg-gradient-to-r from-green-300/55 to-green-500/15" />
        <span className="absolute left-[49%] top-[54%] h-4 w-8 rotate-[14deg] rounded-full bg-gradient-to-l from-green-300/55 to-green-500/15" />

        {decorativeCards.map((card) => {
          return (
            <motion.div
              key={card.id}
              className="absolute flex w-9 origin-top flex-col items-center"
              style={{ top: card.top, left: card.left }}
              initial={{ rotate: card.rotate }}
              whileHover={
                reducedMotion
                  ? { filter: "drop-shadow(0 0 12px rgba(190,220,255,0.5))" }
                  : { rotate: card.rotate + 3, y: 2, filter: "drop-shadow(0 0 12px rgba(190,220,255,0.5))" }
              }
              transition={{ type: "spring", stiffness: 170, damping: 14 }}
            >
              <span className="h-3 w-[1px] bg-white/70" />
              <span
                className="relative block h-24 w-8 rounded-md shadow-[0_10px_18px_rgba(8,12,28,0.45)]"
                style={{ backgroundColor: card.color }}
              >
                <span className="absolute inset-0 rounded-md bg-[linear-gradient(180deg,rgba(255,255,255,0.12),transparent_24%)]" />
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}
