import data from "@/data/recipes.json";
import { categories, statuses, tags, type Filters, type Recipe } from "@/types/recipe";

function includes<T extends string>(values: readonly T[], value: string): value is T {
  return (values as readonly string[]).includes(value);
}

export const recipes: Recipe[] = data.map((item) => {
  const { category, status, tags: recipeTags } = item;
  const validatedTags = recipeTags.filter((tag) => includes(tags, tag));
  if (!includes(categories, category) || !includes(statuses, status) || validatedTags.length !== recipeTags.length) {
    throw new Error(`料理データの分類が無効です (${item.id})`);
  }
  return { ...item, category, status, tags: validatedTags };
});

export const initialFilters: Filters = { category: "", status: "", maxTime: null, tags: [] };

export function filterRecipes(items: Recipe[], filters: Filters, query = "") {
  const search = query.trim().normalize("NFKC").toLowerCase();
  return items.filter((recipe) =>
    (!filters.category || recipe.category === filters.category) &&
    (!filters.status || recipe.status === filters.status) &&
    (filters.maxTime === null || recipe.cookingTime <= filters.maxTime) &&
    filters.tags.every((tag) => recipe.tags.includes(tag)) &&
    recipe.name.normalize("NFKC").toLowerCase().includes(search)
  );
}