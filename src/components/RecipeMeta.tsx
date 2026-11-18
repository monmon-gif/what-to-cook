import { Clock3 } from "lucide-react";
import type { Recipe } from "@/types/recipe";

export function RecipeMeta({ recipe }: { recipe: Recipe }) {
  return (
    <>
      <div className="meta">
        <span className="category">{recipe.category}</span>
        <span className="time"><Clock3 size={15} aria-hidden="true" />{recipe.cookingTime}分</span>
        <span>{recipe.status}</span>
      </div>
      {recipe.tags.length > 0 && (
        <ul className="tags" aria-label="タグ">
          {recipe.tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
      )}
    </>
  );
}