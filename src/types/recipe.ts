export const categories = ["ごはん系", "麺系", "おかず", "汁物", "その他", "外食"] as const;
export const statuses = ["作ったことあり", "作ってみたい"] as const;
export const tags = ["簡単", "がっつり", "あっさり", "節約", "定番"] as const;

export type Category = (typeof categories)[number];
export type Status = (typeof statuses)[number];
export type Tag = (typeof tags)[number];

export interface Recipe {
  id: string;
  name: string;
  category: Category;
  status: Status | null;
  cookingTime: number | null;
  tags: Tag[];
  image?: string;
  ingredients?: string[];
  memo?: string;
  recipeUrl?: string;
}

export interface Filters {
  category: Category | "";
  status: Status | "";
  maxTime: number | null;
  tags: Tag[];
}
