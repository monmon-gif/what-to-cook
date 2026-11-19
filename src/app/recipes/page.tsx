import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { RecipeList } from "@/components/RecipeList";
import { getRecipes } from "@/lib/recipe-data";

export const metadata: Metadata = { title: "料理一覧" };

export default async function RecipesPage() {
  const recipes = await getRecipes();
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1>料理一覧</h1>
        <Link href="/recipes/new" className="primary"><Plus size={18} aria-hidden="true" />料理を追加</Link>
      </div>
      <RecipeList recipes={recipes} />
    </>
  );
}
