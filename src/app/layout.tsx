import type { Metadata } from "next";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "今日なにつくる？", template: "%s | 今日なにつくる？" },
  description: "ジャンルや調理時間から、今日の献立をルーレットで決めよう。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <a className="skip" href="#main">本文へ移動</a>
        <Header />
        <main id="main" className="shell content" tabIndex={-1}>{children}</main>
      </body>
    </html>
  );
}