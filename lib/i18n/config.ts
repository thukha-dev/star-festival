export const locales = ["my", "ja", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "my";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  ja: "日本語",
  my: "မြန်မာ"
};
