"use client";

import { AnimatePresence, motion } from "framer-motion";

type ParticleLayerProps = {
  trigger: number;
};

const particles = Array.from({ length: 14 }, (_, index) => {
  const angle = (Math.PI * 2 * index) / 14;
  const distance = 26 + (index % 3) * 10;
  return {
    id: index,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance
  };
});

export function ParticleLayer({ trigger }: ParticleLayerProps) {
  return (
    <AnimatePresence>
      {trigger > 0 ? (
        <div className="pointer-events-none absolute left-1/2 top-[38%] z-30 -translate-x-1/2 -translate-y-1/2">
          {particles.map((particle) => (
            <motion.span
              key={`${trigger}-${particle.id}`}
              className="absolute h-1.5 w-1.5 rounded-full bg-cyan-100/90"
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.6 }}
              animate={{ opacity: [0, 1, 0], x: particle.x, y: particle.y, scale: [0.6, 1, 0.4] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
          ))}
        </div>
      ) : null}
    </AnimatePresence>
  );
}
