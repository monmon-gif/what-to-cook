# 今日なにつくる？

ジャンルや調理時間を指定し、今日の献立を決める日本語の料理ルーレットです。

## ローカル起動

Node.js 20.9 以上と npm が必要です。

```sh
npm ci
npm run dev
```

ブラウザで http://localhost:3000 を開きます。製品ビルドは `npm run build`、ビルド済みアプリの起動は `npm run start` です。

## 料理データを編集する

Supabase 接続後は、アプリの **料理一覧 → 料理を追加** から登録できます。更新・削除はダッシュボードの **Table Editor → recipes** で行います。新規行の `id` は自動で割り当てられます。お気に入りと履歴はこの ID を参照するので、既存行の ID は変更しないでください。外食の `status` と `cooking_time` は空欄（NULL）にできます。分類とタグの候補は `src/types/recipe.ts` に定義されています。接続未設定の環境では `src/data/recipes.json` が使われます。

料理写真を使う場合は `public/images/` に保存し、`image` に `/images/ファイル名.jpg` を指定します。画像の省略時と読み込み失敗時はジャンルに応じたアイコンが表示されます。`ingredients`、`memo`、`recipe_url`（JSON では `recipeUrl`）は空欄にできます。参考レシピURLには http または https のURLを指定してください。

## Supabase を設定する

1. プロジェクトの **SQL Editor → New query** で `supabase/setup.sql` の全文を実行します。料理テーブルと読み取り専用ポリシーを作成し、既存料理を投入します。
2. **Connect** で Project URL と Publishable key を取得し、ローカルの `.env.local` と Vercel の **Settings → Environment Variables** に設定します。

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```

3. この変更を `main` に反映してデプロイします。環境変数を後から設定した場合は再デプロイします。以降は Table Editor の料理変更が次のページ読み込みに反映されます。

### アプリから料理の追加を有効にする

既にテーブルを作成済みなら、SQL Editor で `grant insert on table public.recipes to service_role;` を実行します。Supabase の **Project Settings → API Keys** から `sb_secret_` で始まるキーを取得し、Vercel の本番環境変数に `SUPABASE_SECRET_KEY` として登録します。ローカルで追加を試す場合は `.env.local` にも設定します。

登録用のランダムなコードを生成し、同じ環境で `RECIPE_ADD_CODE` に設定します。Node.js では `node -e "console.log(require('node:crypto').randomBytes(24).toString('base64url'))"` で生成できます。2つの値はサーバー側だけで使用します。登録コードは料理の登録を有効にする画面で入力し、同じブラウザで30日間料理を追加できます。料理フォームの必須項目は料理名とジャンルです。写真を表示する場合は、GitHub に写真を置いた後で Table Editor の `image` にパスを設定します。

複数のタグを選ぶと、選んだタグをすべて含む料理を抽選します。お気に入りと履歴はブラウザごとの localStorage に保存します。「今日作った」はブラウザの現地日付で、同じ料理につき1日1件を記録します。

## Vercel へ公開する

このディレクトリを GitHub のリポジトリに反映します。Vercel で **Add New → Project** を選び、そのリポジトリをインポートします。フレームワークは **Next.js**、Root Directory はこの `package.json` があるディレクトリを指定します。個人の非商用用途では Vercel の Hobby プランを利用できます。

## 確認手順

| Step | 実装 | 確認方法 |
| --- | --- | --- |
| 1 | App Router と共通レイアウト | ホームのヘッダーから一覧と履歴に移動する |
| 2 | 初期レシピ・型定義・一覧 | 一覧に登録済みの料理が出ることを確認し、「そば」で検索する |
| 3 | 条件絞り込み | ホームで「麺系」「作ったことあり」「15分以内」を選び、月見そば1件に絞られることを確認する |
| 4 | ルーレット | 抽選中にボタンと条件欄が無効になり、停止位置と結果が一致することを確認する。「麺系」「15分以内」「節約」の組み合わせで0件の表示を確認する |
| 5 | 結果と料理詳細 | 月見そばを抽選し、結果にジャンル・時間・状態・タグが出ることを確認する。一覧から豚キムチ丼の詳細を開き、材料とメモを確認する |
| 6 | お気に入り・調理履歴 | 一覧でハートを押し、お気に入りだけに絞る。抽選結果の「今日作った」を押し、履歴に料理名と日付が残ることを確認する。再読み込み後も確認する |
| 7 | レスポンシブ対応 | 390px幅と1280px幅でホーム・一覧を開き、条件と操作ボタンが収まることを確認する |
| 8 | ビルドと公開準備 | `npm run build` を実行し、上の手順で Vercel に取り込む |
