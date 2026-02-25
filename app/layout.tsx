import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://star-festival.vercel.app";
const multilingualDescription =
  "Tanabata Star Festival website with wishes and bamboo tanzaku. | 七夕の願いごとを短冊に込める、やさしく幻想的な星祭りサイト。 | ဆန္ဒတောင်းစာကို တန်ဇာခုတွင်ရေးပြီး ကြယ်ပွဲတော်အလှကို ခံစားနိုင်သော ဝဘ်ဆိုက်။";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Star Festival | Tanabata Wishes",
    template: "%s | Star Festival"
  },
  description: multilingualDescription,
  applicationName: "Star Festival",
  alternates: {
    canonical: "/"
  },
  keywords: [
    "Tanabata",
    "Star Festival",
    "Tanzaku",
    "七夕",
    "短冊",
    "星祭り",
    "တနဘတ",
    "ကြယ်ပွဲတော်"
  ],
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }]
  },
  openGraph: {
    title: "Star Festival | Tanabata Wishes",
    description: multilingualDescription,
    url: "/",
    siteName: "Star Festival",
    locale: "my_MM",
    alternateLocale: ["ja_JP", "en_US"],
    type: "website",
    images: [
      {
        url: "/screenshots/home-en.png",
        width: 1728,
        height: 1506,
        alt: "Star Festival Tanabata website preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Star Festival | Tanabata Wishes",
    description: multilingualDescription,
    images: ["/screenshots/home-en.png"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="my">
      <body>{children}</body>
    </html>
  );
}
