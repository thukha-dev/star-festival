"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import type { Messages } from "@/lib/i18n/messages";
import type { Wish } from "@/lib/types";

type WishModalProps = {
  wish: Wish | null;
  messages: Messages;
  onClose: () => void;
};

export function WishModal({ wish, messages, onClose }: WishModalProps) {
  useEffect(() => {
    if (!wish) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, wish]);

  if (!wish) {
    return null;
  }

  const year = new Date(wish.createdAt).getFullYear();
  const colorMap: Record<Wish["color"], string> = {
    red: "#f04d68",
    blue: "#4f86f7",
    green: "#41b883",
    yellow: "#e3b945",
    purple: "#9361d9"
  };

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/55 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        className="relative w-[90%] max-w-sm rounded-2xl border border-white/35 p-5 text-white shadow-[0_24px_70px_rgba(7,12,28,0.6)]"
        style={{ backgroundColor: colorMap[wish.color] }}
        initial={{ opacity: 0, scale: 0.94, y: 16, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        onClick={(event) => event.stopPropagation()}
      >
        <span className="absolute left-1/2 top-[-18px] h-7 w-[2px] -translate-x-1/2 bg-white/80" />
        <span className="absolute left-1/2 top-[-8px] h-3 w-3 -translate-x-1/2 rounded-full border border-white/80 bg-white/35" />
        <span className="pointer-events-none absolute right-2 top-2 h-5 w-9 rotate-[20deg] rounded-full bg-gradient-to-r from-green-200/80 to-green-500/10" />
        <span className="pointer-events-none absolute right-5 top-6 h-4 w-7 rotate-[48deg] rounded-full bg-gradient-to-r from-green-200/70 to-green-500/10" />
        <span className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.16),transparent_26%)]" />

        <button
          type="button"
          onClick={onClose}
          className="focusable absolute right-3 top-3 rounded-full border border-white/85 bg-black/25 px-2.5 py-0.5 text-sm font-semibold leading-none text-white shadow-[0_4px_12px_rgba(0,0,0,0.35)] transition hover:bg-black/35"
          aria-label="Close wish card"
        >
          ×
        </button>

        <p className="text-xs text-white/80">{messages.modal.by}</p>
        <h3 className="mt-1 text-lg font-semibold text-white">{wish.nickname}</h3>
        <p className="mt-1 text-xs text-white/85">Wished Year: {year}</p>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-white/95">{wish.wishText}</p>
      </motion.div>
    </div>
  );
}
