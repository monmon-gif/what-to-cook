import type { Metadata } from "next";
import { CookingHistory } from "@/components/CookingHistory";

export const metadata: Metadata = { title: "調理履歴" };

export default function HistoryPage() {
  return (
    <>
      <h1>調理履歴</h1>
      <p className="intro">このブラウザで「今日作った」と記録した料理</p>
      <CookingHistory />
    </>
  );
}