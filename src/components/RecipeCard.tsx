import Link from "next/link";
import type { Recipe } from "@/types/recipe";
import { FavoriteButton } from "./FavoriteButton";
import { RecipeImage } from "./RecipeImage";
import { RecipeMeta } from "./RecipeMeta";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <article className="panel recipe-card">
      <Link href={`/recipes/${recipe.id}`} className="card-link">
        <RecipeImage recipe={recipe} />
        <div className="card-body">
          <h2>{recipe.name}</h2>
          <RecipeMeta recipe={recipe} />
        </div>
      </Link>
      <FavoriteButton recipe={recipe} iconOnly />
    </article>
  );
}