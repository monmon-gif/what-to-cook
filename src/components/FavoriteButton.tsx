"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { toggleFavorite, useFavorites } from "@/lib/storage";
import type { Recipe } from "@/types/recipe";

export function FavoriteButton({ recipe, iconOnly = false }: { recipe: Recipe; iconOnly?: boolean }) {
  const selected = useFavorites().includes(recipe.id);
  const [failed, setFailed] = useState(false);
  return (
    <>
      <button className={iconOnly ? "favorite-icon" : "secondary favorite"} type="button"
        aria-label={`${recipe.name}をお気に入りにする`} aria-pressed={selected}
        onClick={() => setFailed(!toggleFavorite(recipe.id))}>
        <Heart size={19} fill={selected ? "currentColor" : "none"} aria-hidden="true" />
        {!iconOnly && (selected ? "お気に入り登録済み" : "お気に入りに追加")}
      </button>
      {failed && <p role="alert" className="storage-error">お気に入りを保存できませんでした。</p>}
    </>
  );
}