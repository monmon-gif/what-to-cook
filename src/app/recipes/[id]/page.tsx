import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { FavoriteButton } from "@/components/FavoriteButton";
import { RecipeImage } from "@/components/RecipeImage";
import { RecipeMeta } from "@/components/RecipeMeta";
import { recipes } from "@/lib/recipes";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return recipes.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: recipes.find((recipe) => recipe.id === id)?.name ?? "料理が見つかりません" };
}

export default async function RecipePage({ params }: Props) {
  const { id } = await params;
  const recipe = recipes.find((item) => item.id === id);
  if (!recipe) notFound();
  const url = recipe.recipeUrl?.trim();

  return (
    <>
      <Link href="/recipes" className="back"><ArrowLeft size={18} aria-hidden="true" />料理一覧に戻る</Link>
      <article className="panel detail">
        <RecipeImage recipe={recipe} />
        <div className="detail-body">
          <h1>{recipe.name}</h1>
          <RecipeMeta recipe={recipe} />
          <FavoriteButton recipe={recipe} />
          {!!recipe.ingredients?.length && (
            <section><h2>材料</h2><ul className="ingredients">{recipe.ingredients.map((item, index) => <li key={index}>{item}</li>)}</ul></section>
          )}
          {recipe.memo?.trim() && <section><h2>メモ</h2><p className="memo">{recipe.memo}</p></section>}
          {url && /^https?:\/\//i.test(url) && <a className="secondary" href={url}>参考レシピを見る<ExternalLink size={16} aria-hidden="true" /></a>}
        </div>
      </article>
    </>
  );
}