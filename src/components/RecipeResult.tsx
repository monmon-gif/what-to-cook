"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, CalendarCheck, Check, Shuffle } from "lucide-react";
import { useState, type Ref } from "react";
import { recordCooking } from "@/lib/storage";
import type { Recipe } from "@/types/recipe";
import { RecipeImage } from "./RecipeImage";
import { RecipeMeta } from "./RecipeMeta";

export function RecipeResult({ recipe, onRetry, headingRef }: { recipe: Recipe; onRetry: () => void; headingRef: Ref<HTMLHeadingElement> }) {
  const [recordState, setRecordState] = useState<"saved" | "error">();

  return (
    <section className="result" aria-labelledby="result-title">
      <h2 id="result-title" ref={headingRef} tabIndex={-1}>抽選結果 · {recipe.name}</h2>
      <RecipeImage recipe={recipe} />
      <RecipeMeta recipe={recipe} />
      {!!recipe.ingredients?.length && (
        <section>
          <h3 className="font-bold">材料</h3>
          <ul className="ingredients">
            {recipe.ingredients.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </section>
      )}
      {recipe.memo?.trim() && <p className="memo">{recipe.memo}</p>}
      <div className="actions">
        <button className="primary" type="button" disabled={recordState === "saved"}
          onClick={() => setRecordState(recordCooking(recipe.id, recipe.name) ? "saved" : "error")}>
          {recordState === "saved" ? <Check size={18} aria-hidden="true" /> : <CalendarCheck size={18} aria-hidden="true" />}
          {recordState === "saved" ? "記録しました" : "今日作った"}
        </button>
        <button className="secondary" type="button" onClick={onRetry}><Shuffle size={18} aria-hidden="true" />もう一度回す</button>
        <Link href={`/recipes/${recipe.id}`} className="secondary"><ArrowRight size={18} aria-hidden="true" />料理詳細を見る</Link>
        <Link href="/recipes" className="secondary"><BookOpen size={18} aria-hidden="true" />料理一覧を見る</Link>
      </div>
      <span role="status">{recordState === "saved" ? "調理履歴に保存しました。" : ""}</span>
      {recordState === "error" && <p role="alert" className="storage-error">調理履歴を保存できませんでした。</p>}
    </section>
  );
}
