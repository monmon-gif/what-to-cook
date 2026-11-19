import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { RecipeForm } from "@/components/RecipeForm";
import { hasRecipeAddAccess } from "@/lib/recipe-add-access";

export const metadata: Metadata = { title: "料理を追加" };

export default async function NewRecipePage() {
  if (!await hasRecipeAddAccess()) redirect("/recipes/new/unlock");
  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/recipes" className="back"><ArrowLeft size={18} aria-hidden="true" />料理一覧に戻る</Link>
      <h1>料理を追加</h1>
      <p className="intro">料理IDは保存時に自動で発行されます。</p>
      <RecipeForm />
    </div>
  );
}
