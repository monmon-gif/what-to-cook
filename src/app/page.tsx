import { Roulette } from "@/components/Roulette";

export default function Home() {
  return (
    <>
      <h1>今日、なにつくる？</h1>
      <p className="intro">ジャンルや調理時間を選んで、今日の献立をルーレットで決めよう。</p>
      <Roulette />
    </>
  );
}