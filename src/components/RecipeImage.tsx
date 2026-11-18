"use client";

import Image from "next/image";
import { CookingPot, Soup, Utensils } from "lucide-react";
import { useState } from "react";
import type { Recipe } from "@/types/recipe";

const treatments = {
  ごはん系: { icon: CookingPot, color: "rice" },
  麺系: { icon: Soup, color: "noodle" },
  おかず: { icon: Utensils, color: "side" },
  汁物: { icon: Soup, color: "soup" },
  その他: { icon: Utensils, color: "other" },
};

export function RecipeImage({ recipe }: { recipe: Recipe }) {
  const [failedSource, setFailedSource] = useState<string>();
  const { icon: Icon, color } = treatments[recipe.category];
  const source = recipe.image?.trim();
  return (
    <div className={`recipe-image ${color}`}>
      {source?.startsWith("/images/") && failedSource !== source ? (
        <Image src={source} alt={recipe.name} fill sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 560px" onError={() => setFailedSource(source)} />
      ) : <Icon size={54} strokeWidth={1.35} aria-hidden="true" />}
    </div>
  );
}