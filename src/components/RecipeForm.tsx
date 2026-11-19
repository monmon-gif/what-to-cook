"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { addRecipe } from "@/app/recipes/new/actions";
import { categories, statuses, tags } from "@/types/recipe";

const field = "mt-1 block w-full rounded-lg border border-[#cfdace] bg-[#fafcf8] px-3 py-2 text-base min-h-11";

export function RecipeForm() {
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const submitting = useRef(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const data = new FormData(event.currentTarget);
    submitting.current = true;
    setMessage("");
    startTransition(async () => {
      try {
        setMessage(await addRecipe(data));
      } finally {
        submitting.current = false;
      }
    });
  }

  return (
    <form onSubmit={submit} className="panel mt-6 p-4 sm:p-7">
      <fieldset disabled={pending} className="grid gap-4">
        <label className="font-semibold">料理名（必須）
          <input name="name" className={field} required maxLength={100} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="font-semibold">ジャンル（必須）
            <select name="category" required defaultValue="">
              <option value="" disabled>選んでください</option>
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
          <label className="font-semibold">料理の状態（任意）
            <select name="status" defaultValue="">
              <option value="">未設定</option>
              {statuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
        </div>
        <label className="font-semibold">調理時間（分・任意）
          <input name="cooking_time" type="number" inputMode="numeric" min={0} max={1440} className={field} />
        </label>
        <fieldset>
          <legend className="mb-2 font-semibold">タグ（任意）</legend>
          <div className="choices">
            {tags.map((tag) => (
              <label className="choice" key={tag}><input type="checkbox" name="tags" value={tag} /><span>{tag}</span></label>
            ))}
          </div>
        </fieldset>
        <label className="font-semibold">材料（任意・1行に1つ）
          <textarea name="ingredients" className={field} rows={4} maxLength={5100} />
        </label>
        <label className="font-semibold">メモ（任意）
          <textarea name="memo" className={field} rows={3} maxLength={2000} />
        </label>
        <label className="font-semibold">参考レシピURL（任意）
          <input name="recipe_url" type="url" className={field} maxLength={2000} />
        </label>
        <button className="primary w-full" type="submit">{pending ? "登録中…" : "料理を登録"}</button>
      </fieldset>
      <p className="storage-error empty:hidden mt-3" role="alert">{message}</p>
    </form>
  );
}
