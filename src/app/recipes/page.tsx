import type { Metadata } from "next";
import { RecipeList } from "@/components/RecipeList";

export const metadata: Metadata = { title: "料理一覧" };

export default function RecipesPage() {
  return (
    <>
      <h1>料理一覧</h1>
      <RecipeList />
    </>
  );
}