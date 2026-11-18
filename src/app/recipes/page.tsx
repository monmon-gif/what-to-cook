import type { Metadata } from "next";
import { RecipeList } from "@/components/RecipeList";
import { getRecipes } from "@/lib/recipe-data";

export const metadata: Metadata = { title: "料理一覧" };

export default async function RecipesPage() {
  const recipes = await getRecipes();
  return (
    <>
      <h1>料理一覧</h1>
      <RecipeList recipes={recipes} />
    </>
  );
}
