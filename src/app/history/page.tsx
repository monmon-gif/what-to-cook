import type { Metadata } from "next";
import { unstable_rethrow } from "next/navigation";
import { CookingHistory } from "@/components/CookingHistory";
import { getRecipes } from "@/lib/recipe-data";

export const metadata: Metadata = { title: "調理履歴" };

export default async function HistoryPage() {
  const recipeIds = await getRecipes().then((recipes) => recipes.map(({ id }) => id)).catch((error: unknown) => {
    unstable_rethrow(error);
    return [];
  });
  return (
    <>
      <h1>調理履歴</h1>
      <p className="intro">このブラウザで「今日作った」と記録した料理</p>
      <CookingHistory recipeIds={recipeIds} />
    </>
  );
}
