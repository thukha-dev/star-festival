"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { MAX_WISH_LENGTH } from "@/lib/constants";
import { moderateWish } from "@/lib/moderation/moderate";
import type { Messages } from "@/lib/i18n/messages";
import type { WishColor, WishLanguage } from "@/lib/types";

type WishInputPanelProps = {
  isOpen: boolean;
  locale: WishLanguage;
  messages: Messages;
  onClose: () => void;
  onSubmitted: (result: { approved: boolean }) => void;
};

const colors: WishColor[] = ["red", "blue", "green", "yellow", "purple"];

const colorMap: Record<WishColor, string> = {
  red: "#f04d68",
  blue: "#4f86f7",
  green: "#41b883",
  yellow: "#e3b945",
  purple: "#9361d9"
};

export function WishInputPanel({ isOpen, locale, messages, onClose, onSubmitted }: WishInputPanelProps) {
  const [wishText, setWishText] = useState("");
  const [nickname, setNickname] = useState("");
  const [color, setColor] = useState<WishColor>("red");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const count = useMemo(() => wishText.length, [wishText]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async () => {
    if (!wishText.trim()) {
      setError(messages.validation.required);
      return;
    }

    if (wishText.length > MAX_WISH_LENGTH) {
      setError(messages.validation.maxLength);
      return;
    }

    const moderation = moderateWish({
      wishText,
      nickname,
      color,
      language: locale
    });

    if (!moderation.approved) {
      setError(messages.validation.moderation);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wishText, nickname, color, language: locale })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error || messages.validation.submitFailed);
        return;
      }

      const payload = (await response.json()) as { wish: { status: "approved" | "rejected" | "pending" } };
      const approved = payload.wish.status === "approved";
      onSubmitted({ approved });

      setWishText("");
      setNickname("");

      if (!approved) {
        setError(messages.validation.moderation);
        return;
      }

      onClose();
    } catch {
      setError(messages.validation.submitFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 px-4 backdrop-blur-sm" onClick={onClose}>
      <motion.section
        id="wish-panel"
        className="relative w-full max-w-md rounded-2xl border border-white/35 p-5 text-white shadow-[0_24px_70px_rgba(7,12,28,0.6)]"
        style={{ backgroundColor: colorMap[color] }}
        initial={{ opacity: 0, y: 14, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        onClick={(event) => event.stopPropagation()}
      >
        <span className="absolute left-1/2 top-[-20px] h-7 w-[2px] -translate-x-1/2 bg-white/80" />
        <span className="absolute left-1/2 top-[-10px] h-3 w-3 -translate-x-1/2 rounded-full border border-white/80 bg-white/35" />
        <span className="pointer-events-none absolute right-3 top-2 h-5 w-9 rotate-[20deg] rounded-full bg-gradient-to-r from-green-200/80 to-green-500/10" />
        <span className="pointer-events-none absolute right-6 top-6 h-4 w-7 rotate-[48deg] rounded-full bg-gradient-to-r from-green-200/70 to-green-500/10" />
        <span className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.18),transparent_22%)]" />

        <button
          type="button"
          onClick={onClose}
          className="focusable absolute right-3 top-3 rounded-full border border-white/45 px-2 text-xs text-white/90"
          aria-label="Close wish form"
        >
          ×
        </button>

        <h2 className="text-sm uppercase tracking-wide text-white/95">{messages.wishForm.title}</h2>

        <p className="mt-3 text-xs text-white/85">{messages.wishForm.colorLabel}</p>
        <div className="mt-2 flex gap-2" role="radiogroup" aria-label={messages.wishForm.colorLabel}>
          {colors.map((entry) => (
            <button
              key={entry}
              type="button"
              role="radio"
              aria-checked={color === entry}
              aria-label={entry}
              onClick={() => setColor(entry)}
              className={`focusable h-9 w-9 rounded-full border-2 transition ${
                color === entry ? "scale-105 border-white" : "border-transparent"
              }`}
              style={{ backgroundColor: colorMap[entry] }}
            />
          ))}
        </div>

        <label className="mt-4 block text-sm text-white/95" htmlFor="wish-text">
          {messages.wishForm.wishLabel}
        </label>
        <textarea
          id="wish-text"
          maxLength={MAX_WISH_LENGTH}
          value={wishText}
          onChange={(event) => setWishText(event.target.value)}
          className="focusable mt-1 h-28 w-full rounded-xl border border-white/30 bg-white/10 p-3 text-sm text-white placeholder:text-white/70"
          placeholder={messages.wishForm.wishPlaceholder}
          autoFocus
        />
        <div className="mt-1 text-right text-xs text-white/80">
          {count}/{MAX_WISH_LENGTH}
        </div>

        <label className="mt-3 block text-sm text-white/95" htmlFor="nickname">
          {messages.wishForm.nicknameLabel}
        </label>
        <input
          id="nickname"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          className="focusable mt-1 w-full rounded-xl border border-white/30 bg-white/10 p-3 text-sm text-white placeholder:text-white/70"
          placeholder={messages.wishForm.nicknamePlaceholder}
        />

        {error ? <p className="mt-3 text-xs text-rose-100">{error}</p> : null}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="focusable mt-4 w-full rounded-xl bg-white/20 px-4 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-white/28 disabled:cursor-not-allowed disabled:opacity-65"
        >
          {isSubmitting ? `${messages.wishForm.submit}...` : messages.wishForm.submit}
        </button>
      </motion.section>
    </div>
  );
}
