"use client";

import Link from "next/link";
import { CalendarDays, History, Shuffle } from "lucide-react";
import { useHistory } from "@/lib/storage";

export function CookingHistory({ recipeIds }: { recipeIds: string[] }) {
  const history = useHistory();
  if (history.length === 0) {
    return (
      <div className="panel empty">
        <History size={36} aria-hidden="true" />
        <h2>調理履歴はまだありません</h2>
        <p>抽選結果から「今日作った」を押すと、ここに記録されます。</p>
        <Link href="/" className="primary"><Shuffle size={18} aria-hidden="true" />ルーレットへ</Link>
      </div>
    );
  }

  return (
    <ul className="panel history-list">
      {[...history].sort((a, b) => b.date.localeCompare(a.date)).map((entry) => (
        <li key={`${entry.recipeId}:${entry.date}`}>
          {recipeIds.includes(entry.recipeId)
            ? <Link href={`/recipes/${entry.recipeId}`}>{entry.name}</Link>
            : <span>{entry.name}</span>}
          <time dateTime={entry.date}><CalendarDays size={16} aria-hidden="true" />{entry.date.replaceAll("-", "/")}</time>
        </li>
      ))}
    </ul>
  );
}
