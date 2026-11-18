import { cache } from "react";
import { connection } from "next/server";
import data from "@/data/recipes.json";
import { validateRecipe } from "./recipes";

function getEnvironmentVariable(name: string) {
  return process.env[name];
}

const projectUrl = getEnvironmentVariable("NEXT_PUBLIC_SUPABASE_URL");
const key = getEnvironmentVariable("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");

type RecipeRow = {
  id: string;
  name: string;
  category: string;
  status: string | null;
  cooking_time: number | null;
  tags: string[];
  image: string | null;
  ingredients: string[] | null;
  memo: string | null;
  recipe_url: string | null;
};

async function fetchRows(query: URLSearchParams) {
  if (!projectUrl || !key) throw new Error("Supabaseの接続設定が不足しています。");
  await connection();
  const url = new URL("/rest/v1/recipes", projectUrl);
  url.search = query.toString();
  const response = await fetch(url, {
    headers: { apikey: key },
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`料理データの取得に失敗しました (HTTP ${response.status})`);
  return await response.json() as RecipeRow[];
}

function toRecipe({ cooking_time, recipe_url, image, ingredients, memo, ...row }: RecipeRow) {
  return validateRecipe({
    ...row,
    cookingTime: cooking_time,
    recipeUrl: recipe_url ?? undefined,
    image: image ?? undefined,
    ingredients: ingredients ?? undefined,
    memo: memo ?? undefined,
  });
}

export async function getRecipes() {
  if (!projectUrl && !key) return data.map(validateRecipe);

  const pageSize = 100;
  const recipes = [];
  const query = new URLSearchParams({ order: "id.asc", limit: String(pageSize) });
  for (let offset = 0; ; offset += pageSize) {
    query.set("offset", String(offset));
    const rows = await fetchRows(query);
    recipes.push(...rows.map(toRecipe));
    if (rows.length < pageSize) return recipes;
  }
}

export const getRecipe = cache(async (id: string) => {
  if (!projectUrl && !key) {
    const item = data.find((recipe) => recipe.id === id);
    return item && validateRecipe(item);
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) return undefined;
  const [row] = await fetchRows(new URLSearchParams({ id: `eq.${id}`, limit: "1" }));
  return row && toRecipe(row);
});
