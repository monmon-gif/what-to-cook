"use client";

import { Heart, Search } from "lucide-react";
import { useState } from "react";
import { filterRecipes, initialFilters, recipes } from "@/lib/recipes";
import { useFavorites } from "@/lib/storage";
import { RecipeCard } from "./RecipeCard";
import { RecipeFilters } from "./RecipeFilters";

export function RecipeList() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const favorites = useFavorites();
  const filtered = filterRecipes(recipes, filters, query)
    .filter((recipe) => !favoritesOnly || favorites.includes(recipe.id));

  return (
    <>
      <div className="panel list-filters">
        <label>料理名検索
          <span className="search-box"><Search size={18} aria-hidden="true" /><input type="search" placeholder="料理名で検索" value={query} onChange={(event) => setQuery(event.target.value)} /></span>
        </label>
        <RecipeFilters value={filters} onChange={setFilters} />
        <label className="choice favorite-filter">
          <input type="checkbox" checked={favoritesOnly} onChange={(event) => setFavoritesOnly(event.target.checked)} />
          <span><Heart size={17} aria-hidden="true" />お気に入りのみ</span>
        </label>
      </div>
      <p className="count list-count" aria-live="polite">{filtered.length}件</p>
      {filtered.length ? (
        <div className="recipes-grid">{filtered.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}</div>
      ) : <p className="panel empty">条件に合う料理がありません。</p>}
    </>
  );
}