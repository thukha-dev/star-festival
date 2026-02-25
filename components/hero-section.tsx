"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { NightSkyLayer } from "@/components/night-sky-layer";
import { ParticleLayer } from "@/components/particle-layer";
import { WishInputPanel } from "@/components/wish-input-panel";
import { WishModal } from "@/components/wish-modal";
import { WishRiver } from "@/components/wish-river";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import type { Wish } from "@/lib/types";

type WishesResponse = {
  wishes: Wish[];
  nextCursor: string | null;
};

const introScriptByLocale = {
  en: [
    "Every year on July 7, people celebrate Tanabata, the Star Festival.",
    "The festival spread from an old Chinese legend and became one of Japan's most beloved seasonal traditions.",
    "■ Origin of Tanabata\nLong ago, Orihime, the weaving princess, and Hikoboshi, the cowherd, worked very hard. After they fell in love and married, they became so absorbed in happiness that they stopped working. The Heavenly King became angry and separated them with the Milky Way. Seeing their sorrow, he allowed them to meet only once a year if they returned to their duties.",
    "■ What People Do on Tanabata\nPeople write wishes on colorful vertical papers called Tanzaku and hang them on bamboo branches. The Milky Way in the night sky symbolizes Orihime and Hikoboshi meeting again. In Japan, schools and communities hold Tanabata events, and many people wish for growth, success, and protection."
  ],
  ja: [
    "毎年7月7日は、星祭り「七夕」の日です。",
    "七夕は中国の古い伝説が日本に伝わり、今では日本を代表する季節行事のひとつになっています。",
    "■ 七夕のはじまり\n織姫と彦星はとても働き者でしたが、結婚後に仕事をおろそかにしてしまい、天の川をはさんで離ればなれにされました。悲しむ二人を見た天帝は、まじめに働くことを条件に、年に一度だけ会うことを許しました。",
    "■ 七夕にすること\n人々は短冊に願いごとを書き、笹に飾ります。夜空に見える天の川は、織姫と彦星が再会する象徴です。学校や地域でも七夕行事が行われ、成長や成功、健康を願います。"
  ],
  my: [
    "နှစ်စဥ် ၇လပိုင်း ၇ရက်နေ့ဟာ Tanabata Festival (တနဘတပွဲတော်) ကြယ်ပွဲတော်နေ့ ဖြစ်ပါတယ်။",
    "ကြယ်ပွဲတော်ဆိုတာက ရှေးတရုတ်ဒဏ္ဏာရီကနေ ဂျပန်အထိပျံ့နှံ့လာပြီး လက်ရှိမှာတော့ ဂျပန်ရဲ့ အကျွမ်းတဝင်ရှိတဲ့ ပွဲတော်ထဲကတခု ဖြစ်ပါတယ်။",
    "■Tanabata ဖြစ်ပေါ်လာပုံ\nဟိုးရှေးရှေးတုန်းက မိုးနတ်မင်းကြီးရဲ့ သမီးတော် `အိုရိဟိမဲ` Orihime နဲ့ `ဟိကိုဘိုရှီ` Hikoboshi လို့ခေါ်တဲ့ လူငယ်တယောက် ရှိခဲ့တယ်။ `အိုရိဟိမဲ`က ယက်ကန်းယက်တဲ့ အလုပ်ကိုလုပ်ပြီး၊ `ဟိကိုဘိုရှီ` ကတော့ နွားကျောင်းတဲ့အလုပ်ကို လုပ်တယ်။ နှစ်ယောက်စလုံးဟာ အလုပ်ကြိုးစားကြတယ်။\nသူတို့နှစ်ယောက်ဟာ တစ်ယောက်ကိုတစ်ယောက် ချစ်ခင်နှစ်သက်တာကြောင့် နောက်ဆုံးမှာ လက်ထပ်လိုက်ကြတယ်။ ဒါမဲ့ အရင်တုန်းက အလုပ်အရမ်းကြိုးစားတဲ့ နှစ်ယောက်ဟာ လက်ထပ်လိုက်ပြီးတဲ့အခါမှာ အပျော်လွန်ပြီး အလုပ်တွေကို လုံးဝမလုပ်ကြတော့ပါဘူး။\nအလုပ်မလုပ်တဲ့အတွက် မိုးနတ်မင်းကြီးဟာ အရမ်းစိတ်ဆိုးပြီး သူတိုနှစ်ယောက်ကြားမှာ နဂါးငွေ့တန်း Milky wayကို ဖန်ဆင်းပြီး ခွဲထားလိုက်ပါတော့တယ်။ ချစ်သူနှစ်ယောက် ငိုကြွေးနေကြတာကိုသိတဲ့ မိုးနတ်မင်းကြီးက အလုပ်ကိုကြိုးစားမယ်ဆိုရင် တစ်နှစ်တစ်ကြိမ် တွေ့ခွင့်ပေးမယ်လို့ ကတိပေးလိုက်တယ်။",
    "■Tanabata နေ့မှာ ဘာတွေလုပ်ကြမလဲ\nဂျပန်လို တန်ဇာခု Tanzaku လို့ခေါ်တဲ့ အရောင်မျိုးစုံရှိတဲ့ ဒေါင်လိုက်ရှည်လျားတဲ့ စက္ကူမှာ ဆုတောင်းစာကိုရေးပြီး ဝါးရွက်ပေါ်မှာ အလှဆင်ချိတ်ဆွဲကြတယ်။ ညကောင်းကင်ယံမှာ နဂါးငွေ့တန်းကို ကြည့်ရင်း ဆုတောင်းကြပြီး မိမိလိုချင်တာမှန်သမျှ ဆုတောင်းနိုင်ပါတယ်။"
  ]
} as const;

function LoadingTanzaku() {
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/35 backdrop-blur-[2px]">
      <motion.div
        className="relative flex w-44 origin-top flex-col items-center"
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <span className="h-5 w-[2px] bg-white/75" />
        <div className="rounded-xl border border-white/30 bg-[#4f86f7] px-3 py-3 text-center shadow-[0_12px_24px_rgba(8,12,28,0.45)]">
          <p className="text-xs font-semibold text-white">Loading wishes...</p>
          <p className="mt-1 text-xs text-white/95">短冊を読み込み中...</p>
          <p className="mt-1 text-xs text-white/95">ဆန္ဒကတ်များ ဖတ်ယူနေသည်...</p>
        </div>
      </motion.div>
    </div>
  );
}

function IntroTanzakuModal({
  open,
  onClose,
  locale
}: {
  open: boolean;
  onClose: () => void;
  locale: Locale;
}) {
  const [introLocale, setIntroLocale] = useState<Locale>(locale);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  useEffect(() => {
    if (open) {
      setIntroLocale(locale);
    }
  }, [locale, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 backdrop-blur-sm" onClick={onClose}>
      <motion.article
        className={`relative w-full max-w-2xl rounded-2xl border border-white/35 bg-[#4f86f7] p-4 text-white shadow-[0_24px_70px_rgba(7,12,28,0.65)] md:p-5 ${introLocale === "my" ? "my-text" : ""}`}
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        onClick={(event) => event.stopPropagation()}
      >
        <span className="absolute left-1/2 top-[-20px] h-7 w-[2px] -translate-x-1/2 bg-white/80" />
        <span className="absolute left-1/2 top-[-10px] h-3 w-3 -translate-x-1/2 rounded-full border border-white/80 bg-white/35" />
        <span className="pointer-events-none absolute right-2 top-2 h-5 w-9 rotate-[20deg] rounded-full bg-gradient-to-r from-green-200/80 to-green-500/10" />
        <span className="pointer-events-none absolute right-6 top-6 h-4 w-7 rotate-[48deg] rounded-full bg-gradient-to-r from-green-200/70 to-green-500/10" />
        <span className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.16),transparent_24%)]" />

        <button
          type="button"
          onClick={onClose}
          className="focusable absolute right-3 top-3 rounded-full border border-white/45 px-2 text-xs text-white/95"
          aria-label="Close intro"
        >
          ×
        </button>

        <h3 className="relative text-sm font-semibold uppercase tracking-wide text-white/95">Tanabata Intro</h3>
        <div className="relative mt-3 flex flex-wrap gap-2">
          {(["my", "ja", "en"] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setIntroLocale(lang)}
              className={`focusable rounded-full border px-3 py-1 text-xs transition ${
                introLocale === lang ? "border-white/80 bg-white/25 text-white" : "border-white/35 bg-white/10 text-white/85"
              }`}
            >
              {lang === "en" ? "English" : lang === "ja" ? "日本語" : "မြန်မာ"}
            </button>
          ))}
        </div>
        <div className="relative mt-3 max-h-[64vh] space-y-3 overflow-y-auto rounded-xl border border-white/25 bg-white/10 p-3 text-left md:max-h-[62vh]">
          {introScriptByLocale[introLocale].map((block) => (
            <p key={block.slice(0, 18)} className="whitespace-pre-line text-sm leading-relaxed text-white/95">
              {block}
            </p>
          ))}
        </div>
      </motion.article>
    </div>
  );
}

function SideBamboo({ mirrored, reducedMotion }: { mirrored?: boolean; reducedMotion: boolean | null }) {
  const papers = [
    { top: "24%", left: "24%", color: "#f04d68", rotate: -6 },
    { top: "38%", left: "30%", color: "#4f86f7", rotate: 4 },
    { top: "50%", left: "20%", color: "#41b883", rotate: -3 },
    { top: "64%", left: "34%", color: "#e3b945", rotate: 5 },
    { top: "30%", left: "52%", color: "#9361d9", rotate: -5 }
  ] as const;

  return (
    <motion.div
      className={`relative mx-auto hidden h-52 w-28 md:block ${mirrored ? "scale-x-[-1]" : ""}`}
      animate={reducedMotion ? { rotate: 0 } : { rotate: [-1, 1, -1] }}
      transition={reducedMotion ? { duration: 0 } : { duration: 6.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
    >
      <span className="absolute bottom-0 left-1/2 h-[88%] w-2 -translate-x-1/2 rounded-full bg-gradient-to-b from-green-300/80 via-green-500/75 to-green-900/85 shadow-[0_0_24px_rgba(82,160,120,0.35)]" />
      <span className="absolute left-[38%] top-[22%] h-2 w-16 -rotate-[24deg] rounded-full bg-gradient-to-r from-green-200/70 to-green-500/10" />
      <span className="absolute left-[28%] top-[34%] h-2 w-16 -rotate-[8deg] rounded-full bg-gradient-to-r from-green-200/70 to-green-500/10" />
      <span className="absolute left-[38%] top-[46%] h-2 w-16 -rotate-[24deg] rounded-full bg-gradient-to-r from-green-200/65 to-green-500/10" />
      <span className="absolute left-[28%] top-[58%] h-2 w-16 -rotate-[10deg] rounded-full bg-gradient-to-r from-green-200/60 to-green-500/10" />
      <span className="absolute left-[38%] top-[70%] h-2 w-16 -rotate-[22deg] rounded-full bg-gradient-to-r from-green-200/55 to-green-500/10" />
      <span className="absolute left-[62%] top-[16%] h-12 w-1 rounded-full bg-green-400/60" />
      <span className="absolute left-[58%] top-[10%] h-3 w-7 -rotate-[26deg] rounded-full bg-gradient-to-r from-green-200/65 to-green-500/10" />
      <span className="absolute left-[60%] top-[23%] h-3 w-7 -rotate-[8deg] rounded-full bg-gradient-to-r from-green-200/60 to-green-500/10" />
      {papers.map((paper, index) => (
        <motion.div
          key={`${paper.top}-${paper.left}-${paper.color}`}
          className="absolute flex w-6 origin-top flex-col items-center"
          style={{ top: paper.top, left: paper.left }}
          initial={{ rotate: paper.rotate }}
          animate={
            reducedMotion
              ? { rotate: paper.rotate }
              : { rotate: [paper.rotate, paper.rotate + (index % 2 === 0 ? 2 : -2), paper.rotate] }
          }
          transition={reducedMotion ? { duration: 0 } : { duration: 3 + index * 0.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <span className="h-2.5 w-px bg-white/75" />
          <span
            className="relative block h-8 w-4 rounded-[4px] shadow-[0_8px_14px_rgba(8,12,28,0.45)]"
            style={{ backgroundColor: paper.color }}
          >
            <span className="absolute inset-0 rounded-[4px] bg-[linear-gradient(180deg,rgba(255,255,255,0.14),transparent_28%)]" />
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function HeroSection() {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);
  const [isWishFormOpen, setIsWishFormOpen] = useState(false);
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [submitToken, setSubmitToken] = useState(0);
  const [sparkleToken, setSparkleToken] = useState(0);
  const reducedMotion = useReducedMotion();

  const messages = useMemo(() => getMessages(locale), [locale]);

  const fetchLatestWishes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/wishes?limit=50", { cache: "no-store" });
      if (!response.ok) {
        setWishes([]);
        setNextCursor(null);
        return;
      }

      const payload = (await response.json()) as WishesResponse;
      setWishes(payload.wishes);
      setNextCursor(payload.nextCursor);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMoreWishes = useCallback(async () => {
    if (!nextCursor || isLoadingMore || isLoading) {
      return;
    }

    setIsLoadingMore(true);
    try {
      const response = await fetch(`/api/wishes?limit=50&before=${encodeURIComponent(nextCursor)}`, {
        cache: "no-store"
      });
      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as WishesResponse;
      setWishes((prev) => [...prev, ...payload.wishes]);
      setNextCursor(payload.nextCursor);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoading, isLoadingMore, nextCursor]);

  useEffect(() => {
    fetchLatestWishes();
  }, [fetchLatestWishes]);

  useEffect(() => {
    const seenKey = "star_festival_intro_seen";
    const hasSeen = window.sessionStorage.getItem(seenKey);
    if (!hasSeen) {
      setIsIntroOpen(true);
      window.sessionStorage.setItem(seenKey, "true");
    }
  }, []);

  const onPrimaryCta = () => {
    setIsWishFormOpen(true);
  };

  const onSecondaryCta = () => {
    setIsIntroOpen(true);
  };

  const onSubmitted = async (result: { approved: boolean }) => {
    if (result.approved && !reducedMotion) {
      setSubmitToken((value) => value + 1);
      setTimeout(() => {
        setSparkleToken((value) => value + 1);
      }, 700);
      setTimeout(() => {
        fetchLatestWishes();
      }, 820);
      return;
    }

    fetchLatestWishes();
  };

  const localeClass = locale === "my" ? "my-text" : "";

  return (
    <main className={`relative min-h-screen overflow-hidden px-4 pb-10 pt-20 md:px-8 md:pb-12 ${localeClass}`}>
      <NightSkyLayer />
      <ParticleLayer trigger={sparkleToken} />
      <LanguageSwitcher active={locale} onChange={setLocale} />

      <section className="relative z-10 mx-auto max-w-6xl">
        <div className="grid items-center gap-4 md:grid-cols-[120px_1fr_120px]">
          <SideBamboo reducedMotion={reducedMotion} />

          <div className="text-center">
            <motion.h1
              className="jp-heading text-4xl text-white drop-shadow-[0_0_20px_rgba(120,175,255,0.18)] md:text-6xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {messages.hero.titleJp}
              <span className="block text-xl font-normal tracking-wide text-white/85 md:text-2xl">
                {messages.hero.titleEn}
              </span>
            </motion.h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
              {messages.hero.subtitle}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={onPrimaryCta}
                className="focusable rounded-full bg-cyan-300/25 px-5 py-2 text-sm font-semibold text-white shadow-glow transition hover:bg-cyan-300/35"
              >
                {messages.hero.primaryCta}
              </button>
              <button
                type="button"
                onClick={onSecondaryCta}
                className="focusable rounded-full border border-white/35 px-5 py-2 text-sm text-white/90 transition hover:bg-white/10"
              >
                {messages.hero.secondaryCta}
              </button>
            </div>
          </div>

          <SideBamboo mirrored reducedMotion={reducedMotion} />
        </div>
      </section>

      {submitToken > 0 && !reducedMotion ? (
        <motion.div
          key={submitToken}
          className="pointer-events-none absolute left-1/2 top-[74%] z-20"
          initial={{ x: -16, y: 40, opacity: 0, rotate: -7 }}
          animate={{ x: -20, y: -230, opacity: [0, 1, 1, 0], rotate: -2 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
        >
          <span className="block h-24 w-8 rounded-md bg-cyan-300/75 shadow-[0_12px_24px_rgba(120,200,255,0.4)]" />
        </motion.div>
      ) : null}

      <WishRiver
        wishes={wishes}
        messages={messages}
        onSelectWish={setSelectedWish}
        onLoadMore={loadMoreWishes}
        hasMore={Boolean(nextCursor)}
        isLoadingMore={isLoadingMore}
      />

      {isLoading ? <LoadingTanzaku /> : null}

      <WishInputPanel
        isOpen={isWishFormOpen}
        locale={locale}
        messages={messages}
        onClose={() => setIsWishFormOpen(false)}
        onSubmitted={onSubmitted}
      />
      <IntroTanzakuModal open={isIntroOpen} onClose={() => setIsIntroOpen(false)} locale={locale} />

      <WishModal wish={selectedWish} messages={messages} onClose={() => setSelectedWish(null)} />
    </main>
  );
}
