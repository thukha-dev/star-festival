import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Star Festival",
  description: "A modern multilingual Tanabata festival experience."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
