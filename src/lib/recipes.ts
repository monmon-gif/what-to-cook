import { categories, statuses, tags, type Filters, type Recipe, type Tag } from "@/types/recipe";

function includes<T extends string>(values: readonly T[], value: string): value is T {
  return (values as readonly string[]).includes(value);
}

export function validateRecipe(item: Omit<Recipe, "category" | "status" | "tags"> & {
  category: string;
  status: string | null;
  tags: readonly string[];
}): Recipe {
  const { category, status } = item;
  const recipeTags: readonly string[] = item.tags;
  const validatedTags = recipeTags.filter((tag): tag is Tag => includes(tags, tag));
  if (!includes(categories, category) || (status !== null && !includes(statuses, status)) || validatedTags.length !== recipeTags.length) {
    throw new Error(`料理データの分類が無効です (${item.id})`);
  }
  return { ...item, category, status, tags: validatedTags };
}

export const initialFilters: Filters = { category: "", status: "", maxTime: null, tags: [] };

export function filterRecipes(items: Recipe[], filters: Filters, query = "") {
  const search = query.trim().normalize("NFKC").toLowerCase();
  return items.filter((recipe) =>
    (!filters.category || recipe.category === filters.category) &&
    (!filters.status || recipe.status === filters.status) &&
    (filters.maxTime === null || (recipe.cookingTime !== null && recipe.cookingTime <= filters.maxTime)) &&
    filters.tags.every((tag) => recipe.tags.includes(tag)) &&
    recipe.name.normalize("NFKC").toLowerCase().includes(search)
  );
}
