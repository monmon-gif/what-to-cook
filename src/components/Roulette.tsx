"use client";

import { CookingPot, Settings2, Shuffle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { filterRecipes, initialFilters, recipes } from "@/lib/recipes";
import { draw, spinDuration } from "@/lib/roulette";
import type { Filters, Recipe } from "@/types/recipe";
import { RecipeFilters } from "./RecipeFilters";
import { RecipeResult } from "./RecipeResult";

const palette = ["#22604a", "#d4e9bd", "#f9d98f", "#548a6d", "#e7ad83", "#b9d9ca"];

export function Roulette() {
  const [filters, setFilters] = useState(initialFilters);
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Recipe>();
  const timer = useRef<number | null>(null);
  const pending = useRef<Recipe | null>(null);
  const resultRegion = useRef<HTMLHeadingElement>(null);
  const candidates = filterRecipes(recipes, filters);

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    if (result) resultRegion.current?.focus();
  }, [result]);

  function changeFilters(next: Filters) {
    if (timer.current !== null) return;
    setFilters(next);
    setResult(undefined);
    setAngle(0);
  }

  function spin() {
    if (timer.current !== null) return;
    const selection = draw(candidates.length, angle);
    if (!selection) return;
    const winner = candidates[selection.index];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    pending.current = winner;
    setResult(undefined);
    setSpinning(true);
    setAngle(selection.angle);
    timer.current = window.setTimeout(finishSpin, reduced ? 0 : spinDuration + 200);
  }

  function finishSpin() {
    if (timer.current === null || !pending.current) return;
    window.clearTimeout(timer.current);
    timer.current = null;
    setResult(pending.current);
    pending.current = null;
    setSpinning(false);
  }

  return (
    <div className="roulette-grid">
      <section className="panel settings" aria-labelledby="conditions">
        <div className="section-head"><Settings2 size={20} aria-hidden="true" /><h2 id="conditions">抽選条件</h2></div>
        <fieldset disabled={spinning} className="settings-fields" aria-label="抽選条件">
          <RecipeFilters value={filters} onChange={changeFilters} advanced />
        </fieldset>
        <div className="settings-bottom">
          <p className="count" aria-live="polite">抽選対象 <strong>{candidates.length}</strong> 件</p>
          <button className="primary w-full" type="button" onClick={spin} disabled={!candidates.length || spinning}>
            <Shuffle size={20} aria-hidden="true" />{spinning ? "抽選中…" : "ルーレットを回す"}
          </button>
        </div>
      </section>
      <section className="panel stage" aria-label="献立ルーレット">
        {candidates.length ? (
          <>
            <Wheel candidates={candidates} angle={angle} spinning={spinning} onStop={finishSpin} />
            <details className="candidate-list">
              <summary>抽選対象の料理（{candidates.length}件）</summary>
              <ol>{candidates.map((recipe) => <li key={recipe.id}>{recipe.name}</li>)}</ol>
            </details>
          </>
        ) : (
          <div className="empty wheel-empty" role="status"><CookingPot size={40} aria-hidden="true" /><p>条件に合う料理がありません。<br />ジャンルやタグの条件を変更してください。</p></div>
        )}
        {result && <RecipeResult key={result.id} recipe={result} onRetry={spin} headingRef={resultRegion} />}
      </section>
    </div>
  );
}

function Wheel({ candidates, angle, spinning, onStop }: {
  candidates: Recipe[];
  angle: number;
  spinning: boolean;
  onStop: () => void;
}) {
  const step = 360 / candidates.length;
  const gradient = candidates.map((recipe, index) =>
    `${palette[index % palette.length]} ${index * step}deg ${(index + 1) * step}deg`
  ).join(", ");
  const showNames = candidates.length <= 12;
  const showNumbers = candidates.length <= 36;

  return (
    <div className="wheel-frame" aria-hidden="true">
      <div className="pointer" />
      <div className="wheel" onTransitionEnd={(event) => {
        if (event.target === event.currentTarget && event.propertyName === "transform") onStop();
      }} style={{
        background: candidates.length === 1 ? palette[0] : `conic-gradient(${gradient})`,
        transform: `rotate(${angle}deg)`,
        transitionDuration: spinning ? `${spinDuration}ms` : "0ms",
      }}>
        {(showNames || showNumbers) && candidates.map((recipe, index) => {
          const center = (index + 0.5) * step;
          const radians = center * Math.PI / 180;
          const radius = showNames ? 32 : 41;
          return (
            <span key={recipe.id} className={`wheel-label ${index % palette.length === 0 || index % palette.length === 3 ? "light" : ""}`} style={{
              left: `${50 + Math.sin(radians) * radius}%`,
              top: `${50 - Math.cos(radians) * radius}%`,
              rotate: `${center > 180 ? center - 270 : center - 90}deg`,
            }}>{showNames ? recipe.name : index + 1}</span>
          );
        })}
      </div>
      <div className="wheel-hub"><CookingPot size={23} /></div>
    </div>
  );
}
