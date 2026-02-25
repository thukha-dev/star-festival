import { z } from "zod";
import { MAX_WISH_LENGTH } from "@/lib/constants";

const languageEnum = z.enum(["en", "ja", "my"]);
const colorEnum = z.enum(["red", "blue", "green", "yellow", "purple"]);

export const wishSchema = z.object({
  wishText: z.string().trim().min(1, "Wish is required").max(MAX_WISH_LENGTH),
  nickname: z.string().trim().max(40).optional().default(""),
  color: colorEnum,
  language: languageEnum
});

export type WishInput = z.infer<typeof wishSchema>;
export type WishLanguageInput = z.infer<typeof languageEnum>;
export type WishColorInput = z.infer<typeof colorEnum>;
