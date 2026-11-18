"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="panel empty">
      <h1>ページを読み込めませんでした</h1>
      <p>時間を置いて、もう一度お試しください。</p>
      <button type="button" className="primary" onClick={reset}>再試行</button>
    </section>
  );
}
