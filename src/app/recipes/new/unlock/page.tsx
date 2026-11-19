import type { Metadata } from "next";
import Link from "next/link";
import { RecipeUnlockForm } from "@/components/RecipeUnlockForm";

export const metadata: Metadata = { title: "料理の登録を有効にする" };

export default function UnlockRecipePage() {
  return (
    <div className="mx-auto max-w-md">
      <Link href="/recipes" className="back">料理一覧に戻る</Link>
      <h1>料理の登録を有効にする</h1>
      <p className="intro">登録コードを入力すると、このブラウザで30日間料理を追加できます。</p>
      <RecipeUnlockForm />
    </div>
  );
}
