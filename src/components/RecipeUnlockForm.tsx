"use client";

import { useActionState } from "react";
import { unlockRecipeAdd } from "@/app/recipes/new/actions";

export function RecipeUnlockForm() {
  const [error, action, pending] = useActionState(unlockRecipeAdd, "");

  return (
    <form action={action} className="panel mt-6 grid gap-3 p-4 sm:p-7">
      <label className="font-semibold">登録コード（必須）
        <input name="code" type="password" required maxLength={256} autoComplete="off"
          className="mt-1 block min-h-11 w-full rounded-lg border border-[#cfdace] bg-[#fafcf8] px-3 py-2 text-base" />
      </label>
      <button className="primary" disabled={pending}>{pending ? "確認中…" : "登録を有効にする"}</button>
      {error && <p role="alert" className="storage-error">{error}</p>}
    </form>
  );
}
