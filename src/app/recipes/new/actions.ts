"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { categories, statuses, tags } from "@/types/recipe";
import { getRecipeAddCode, grantRecipeAddAccess, hasRecipeAddAccess, matchesCode } from "@/lib/recipe-add-access";

export async function unlockRecipeAdd(_previous: string, form: FormData): Promise<string> {
  const code = getRecipeAddCode();
  if (!code) return "料理を追加するための設定が未完了です。";
  const input = form.get("code");
  if (typeof input !== "string" || input.length > 256 || !matchesCode(input.trim(), code)) {
    return "登録コードを確認してください。";
  }
  await grantRecipeAddAccess(code);
  redirect("/recipes/new");
}

export async function addRecipe(form: FormData): Promise<string> {
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!projectUrl || !secretKey?.startsWith("sb_secret_") || !getRecipeAddCode()) {
    return "料理を追加するための設定が未完了です。";
  }
  if (!await hasRecipeAddAccess()) return "登録の有効期限が切れました。別のタブで登録を有効にしてから再試行してください。";

  const field = (name: string) => {
    const value = form.get(name);
    return typeof value === "string" ? value.trim() : "";
  };
  const name = field("name");
  const category = field("category");
  const status = field("status");
  if (!name || name.length > 100 || !categories.some((option) => option === category)) {
    return "料理名とジャンルを確認してください。";
  }
  if (status && !statuses.some((option) => option === status)) {
    return "料理の状態を確認してください。";
  }

  const time = field("cooking_time");
  if (time && (!/^\d{1,4}$/.test(time) || Number(time) > 1440)) {
    return "調理時間は0〜1440分の整数で入力してください。";
  }
  const selected = form.getAll("tags");
  const recipeTags = tags.filter((tag) => selected.includes(tag));
  const ingredients = field("ingredients").split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  const memo = field("memo");
  if (ingredients.length > 50 || ingredients.some((item) => item.length > 100) || memo.length > 2000) {
    return "材料は1行100文字までで50件以内、メモは2000文字以内で入力してください。";
  }

  const recipeUrl = field("recipe_url");
  if (recipeUrl) {
    const url = URL.parse(recipeUrl);
    if (!url || !["http:", "https:"].includes(url.protocol) || recipeUrl.length > 2000) {
      return "参考レシピには http または https のURLを入力してください。";
    }
  }

  const id = randomUUID();
  try {
    const response = await fetch(new URL("/rest/v1/recipes", projectUrl), {
      method: "POST",
      headers: { apikey: secretKey, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({
        id, name, category, status: status || null, cooking_time: time ? Number(time) : null,
        tags: recipeTags, ingredients: ingredients.length ? ingredients : null,
        memo: memo || null, recipe_url: recipeUrl || null,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      console.error("Recipe insert failed", response.status);
      return "料理を登録できませんでした。時間を置いてもう一度お試しください。";
    }
  } catch {
    return "保存結果を確認できませんでした。料理一覧を確認してから再試行してください。";
  }

  revalidatePath("/");
  revalidatePath("/recipes");
  redirect(`/recipes/${id}`);
}
