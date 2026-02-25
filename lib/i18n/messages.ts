import en from "@/lib/i18n/messages/en.json";
import ja from "@/lib/i18n/messages/ja.json";
import my from "@/lib/i18n/messages/my.json";
import type { Locale } from "@/lib/i18n/config";

export type Messages = typeof en;

const messageMap: Record<Locale, Messages> = {
  en,
  ja,
  my
};

export function getMessages(locale: Locale): Messages {
  return messageMap[locale];
}
