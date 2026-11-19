import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RecipeForm } from "@/components/RecipeForm";

export const metadata: Metadata = { title: "料理を追加" };

export default function NewRecipePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/recipes" className="back"><ArrowLeft size={18} aria-hidden="true" />料理一覧に戻る</Link>
      <h1>料理を追加</h1>
      <RecipeForm />
    </div>
  );
}
