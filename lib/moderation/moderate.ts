import type { WishInput } from "@/lib/validation/wish";

export type ModerationResult = {
  approved: boolean;
  reason?: "blocked_word" | "repetitive_spam" | "link_spam";
};

const blockedWords = ["badword", "hateword", "nsfwterm"];

export function moderateWish(input: WishInput): ModerationResult {
  const lower = input.wishText.toLowerCase();

  if (blockedWords.some((word) => lower.includes(word))) {
    return { approved: false, reason: "blocked_word" };
  }

  if (/(.)\1{7,}/.test(input.wishText)) {
    return { approved: false, reason: "repetitive_spam" };
  }

  if (/https?:\/\//i.test(input.wishText) || /www\./i.test(input.wishText)) {
    return { approved: false, reason: "link_spam" };
  }

  return { approved: true };
}
