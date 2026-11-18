import { Roulette } from "@/components/Roulette";
import { getRecipes } from "@/lib/recipe-data";

export default async function Home() {
  const recipes = await getRecipes();
  return (
    <>
      <h1>今日、なにつくる？</h1>
      <p className="intro">ジャンルや調理時間を選んで、今日の献立をルーレットで決めよう。</p>
      <Roulette recipes={recipes} />
    </>
  );
}
