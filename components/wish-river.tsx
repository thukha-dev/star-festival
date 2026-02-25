"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import type { Messages } from "@/lib/i18n/messages";
import type { Wish } from "@/lib/types";

const cardColors: Record<Wish["color"], string> = {
  red: "#f04d68",
  blue: "#4f86f7",
  green: "#41b883",
  yellow: "#e3b945",
  purple: "#9361d9"
};

type WishRiverProps = {
  wishes: Wish[];
  messages: Messages;
  onSelectWish: (wish: Wish) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  totalCount?: number;
};

export function WishRiver({ wishes, messages, onSelectWish, onLoadMore, hasMore, isLoadingMore, totalCount }: WishRiverProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const getRowSpan = (wishText: string) => {
    if (wishText.length > 110) {
      return 3;
    }
    if (wishText.length > 55) {
      return 2;
    }
    return 1;
  };

  const handleHorizontalScroll = () => {
    if (!hasMore || isLoadingMore) {
      return;
    }

    const element = scrollerRef.current;
    if (!element) {
      return;
    }

    const distanceToEnd = element.scrollWidth - (element.scrollLeft + element.clientWidth);
    if (distanceToEnd < 320) {
      onLoadMore();
    }
  };

  return (
    <section id="all-wishes" className="relative z-10 mx-auto mt-8 w-full max-w-[96vw] px-1 md:max-w-[98vw] md:px-3">
      <div className="glass relative overflow-hidden rounded-[28px] border border-emerald-100/20 bg-[linear-gradient(160deg,rgba(18,27,60,0.68),rgba(11,20,46,0.55))] p-4 shadow-[0_30px_80px_rgba(3,8,22,0.5)] md:p-7">
        <span className="pointer-events-none absolute left-4 top-4 h-8 w-14 -rotate-[22deg] rounded-full bg-gradient-to-r from-emerald-200/65 to-emerald-500/5" />
        <span className="pointer-events-none absolute left-8 top-7 h-7 w-12 -rotate-[48deg] rounded-full bg-gradient-to-r from-emerald-200/55 to-emerald-500/5" />
        <span className="pointer-events-none absolute left-10 top-2 h-7 w-12 -rotate-[8deg] rounded-full bg-gradient-to-r from-emerald-200/55 to-emerald-500/5" />
        <span className="pointer-events-none absolute left-2 top-12 h-7 w-12 -rotate-[64deg] rounded-full bg-gradient-to-r from-emerald-200/50 to-emerald-500/5" />
        <span className="pointer-events-none absolute left-14 top-11 h-6 w-10 -rotate-[28deg] rounded-full bg-gradient-to-r from-emerald-200/45 to-emerald-500/5" />
        <span className="pointer-events-none absolute right-5 bottom-6 h-8 w-14 rotate-[20deg] rounded-full bg-gradient-to-l from-emerald-200/65 to-emerald-500/5" />
        <span className="pointer-events-none absolute right-8 bottom-10 h-7 w-12 rotate-[48deg] rounded-full bg-gradient-to-l from-emerald-200/55 to-emerald-500/5" />
        <span className="pointer-events-none absolute right-12 bottom-2 h-7 w-12 rotate-[8deg] rounded-full bg-gradient-to-l from-emerald-200/55 to-emerald-500/5" />
        <span className="pointer-events-none absolute right-3 bottom-14 h-7 w-12 rotate-[64deg] rounded-full bg-gradient-to-l from-emerald-200/50 to-emerald-500/5" />
        <span className="pointer-events-none absolute right-16 bottom-13 h-6 w-10 rotate-[28deg] rounded-full bg-gradient-to-l from-emerald-200/45 to-emerald-500/5" />
        <span className="pointer-events-none absolute left-1/3 top-0 h-6 w-10 -rotate-[20deg] rounded-full bg-gradient-to-r from-emerald-200/35 to-emerald-500/5" />
        <span className="pointer-events-none absolute right-1/4 bottom-0 h-6 w-10 rotate-[20deg] rounded-full bg-gradient-to-l from-emerald-200/35 to-emerald-500/5" />
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/85">{messages.common.allWishes}</h2>
          <span className="rounded-full border border-blue-100/90 bg-[#4f86f7] px-4 py-1.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,134,247,0.5)]">
            {totalCount ?? wishes.length}
          </span>
        </div>

        <div
          ref={scrollerRef}
          onScroll={handleHorizontalScroll}
          className="h-[58vh] overflow-x-auto overflow-y-hidden pb-2 sm:h-[64vh] md:h-[80vh]"
        >
          <div className="grid h-full min-w-max auto-cols-[9rem] grid-flow-col grid-rows-4 gap-3 sm:auto-cols-[10rem] sm:gap-4 md:auto-cols-[12rem] md:grid-rows-6">
            {wishes.map((wish, index) => (
              <motion.button
                key={wish.id}
                type="button"
                onClick={() => onSelectWish(wish)}
                className="focusable group relative flex min-h-[132px] flex-col rounded-lg p-3 text-white transition hover:-translate-y-0.5"
                style={{
                  gridRow: `span ${getRowSpan(wish.wishText)} / span ${getRowSpan(wish.wishText)}`,
                  backgroundColor: cardColors[wish.color],
                  boxShadow: "0 10px 24px rgba(8, 12, 28, 0.4)"
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: Math.min(index * 0.008, 0.3) }}
              >
                <span className="absolute left-1/2 top-[-14px] h-4 w-[1px] -translate-x-1/2 bg-white/80" />
                <span className="absolute left-1/2 top-[-6px] h-2 w-2 -translate-x-1/2 rounded-full border border-white/75 bg-white/30" />
                <span className="absolute right-2 top-2 h-4 w-7 rotate-[18deg] rounded-full bg-gradient-to-r from-green-300/75 to-green-500/10" />
                <span className="absolute right-4 top-4 h-3 w-6 rotate-[44deg] rounded-full bg-gradient-to-r from-green-300/70 to-green-500/10" />
                <span className="pointer-events-none absolute inset-0 rounded-lg bg-[linear-gradient(180deg,rgba(255,255,255,0.16),transparent_24%)]" />

                <p className="mt-3 max-h-24 w-full overflow-hidden text-left text-sm leading-relaxed text-white/95">
                  {wish.wishText}
                </p>
                <p className="mt-auto w-full truncate pt-3 text-left text-xs text-white/90">{wish.nickname}</p>
                <p className="w-full text-left text-[10px] text-white/80">{new Date(wish.createdAt).getFullYear()}</p>
              </motion.button>
            ))}
          </div>
          {isLoadingMore ? <div className="mt-3 pb-2 text-center text-xs text-white/75">Loading more wishes...</div> : null}
        </div>
      </div>
    </section>
  );
}
