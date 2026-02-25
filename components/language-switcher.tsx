"use client";

import { localeLabels, locales, type Locale } from "@/lib/i18n/config";

type LanguageSwitcherProps = {
  active: Locale;
  onChange: (locale: Locale) => void;
};

export function LanguageSwitcher({ active, onChange }: LanguageSwitcherProps) {
  return (
    <div className="fixed right-4 top-4 z-30 md:right-6 md:top-6">
      <div className="mx-auto flex w-44 flex-col items-center md:w-52">
        <span className="h-5 w-[2px] bg-white/75" />
        <div className="relative w-full rounded-xl border border-white/35 bg-[#f04d68] px-2 py-2 shadow-[0_16px_36px_rgba(8,12,28,0.5)]">
          <span className="absolute left-1/2 top-[-9px] h-3 w-3 -translate-x-1/2 rounded-full border border-white/80 bg-white/35" />
          <span className="pointer-events-none absolute inset-0 rounded-xl bg-[linear-gradient(180deg,rgba(255,255,255,0.15),transparent_24%)]" />
          <div className="relative flex gap-1 md:gap-1.5">
            {locales.map((locale) => (
              <button
                key={locale}
                type="button"
                onClick={() => onChange(locale)}
                className={`focusable min-w-0 flex-1 rounded-md px-2 py-1 text-[11px] font-medium transition md:text-xs ${
                  active === locale ? "bg-white/28 text-white" : "text-white/80 hover:bg-white/12 hover:text-white"
                }`}
                aria-pressed={active === locale}
                aria-label={`Switch language to ${localeLabels[locale]}`}
              >
                {localeLabels[locale]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
