begin;

create table if not exists public.recipes (
  id text primary key default gen_random_uuid()::text check (id ~ '^[a-zA-Z0-9_-]+$'),
  name text not null check (length(btrim(name)) > 0),
  category text not null check (category in ('ごはん系', '麺系', 'おかず', '汁物', 'その他', '外食')),
  status text check (status in ('作ったことあり', '作ってみたい')),
  cooking_time integer check (cooking_time >= 0),
  tags text[] not null default '{}' check (tags <@ array['簡単', 'がっつり', 'あっさり', '節約', '定番']),
  image text,
  ingredients text[],
  memo text,
  recipe_url text
);

alter table public.recipes enable row level security;
revoke all privileges on table public.recipes from public, anon, authenticated;
grant select on table public.recipes to anon, authenticated;
drop policy if exists "Recipes are publicly readable" on public.recipes;
create policy "Recipes are publicly readable"
  on public.recipes for select to anon, authenticated using (true);

insert into public.recipes (id, name, category, status, cooking_time, tags, image, ingredients, memo, recipe_url)
values
  ('recipe-001', '豚キムチ丼', 'ごはん系', '作ったことあり', 15, array['がっつり', '簡単']::text[], null, array['豚肉', 'キムチ', 'ごはん']::text[], '仕上げに温泉卵をのせてもおいしい。', null),
  ('recipe-002', '月見そば', '麺系', '作ったことあり', 10, array['簡単', 'あっさり']::text[], null, array['そば', '卵', 'ネギ']::text[], null, null),
  ('recipe-003', '照り焼きチキン', 'おかず', '作ったことあり', 25, array['がっつり', '定番']::text[], null, array['鶏もも肉', 'しょうゆ', 'みりん', '砂糖']::text[], null, null),
  ('recipe-004', '豆腐とわかめのみそ汁', '汁物', '作ったことあり', 10, array['簡単', '節約', '定番']::text[], null, array['豆腐', 'わかめ', 'だし', 'みそ']::text[], null, null),
  ('recipe-005', 'ツナと大葉のパスタ', '麺系', '作ってみたい', 20, array['簡単', 'あっさり', '節約']::text[], null, array['スパゲッティ', 'ツナ', '大葉', 'しょうゆ']::text[], null, null),
  ('recipe-006', 'キーマカレー', 'ごはん系', '作ってみたい', 35, array['がっつり', '定番']::text[], null, array['合いびき肉', '玉ねぎ', 'トマト缶', 'カレー粉', 'ごはん']::text[], null, null),
  ('recipe-007', 'きのこのホイル焼き', 'おかず', '作ったことあり', 20, array['簡単', 'あっさり']::text[], null, array['しめじ', 'えのき', 'バター', 'ポン酢']::text[], null, null),
  ('recipe-008', 'トマトと卵のスープ', '汁物', '作ってみたい', 15, array['簡単', 'あっさり', '節約']::text[], null, array['トマト', '卵', '鶏ガラスープの素']::text[], null, null),
  ('recipe-009', 'じゃがいものガレット', 'その他', '作ってみたい', 25, array['節約']::text[], null, array['じゃがいも', 'チーズ', 'オリーブオイル']::text[], null, null),
  ('recipe-010', '卵チャーハン', 'ごはん系', '作ったことあり', 10, array['簡単', '節約', '定番']::text[], null, array['ごはん', '卵', 'ネギ']::text[], null, null),
  ('recipe-011', '野菜たっぷり焼きうどん', '麺系', '作ったことあり', 20, array['簡単', 'がっつり']::text[], null, array['うどん', '豚肉', 'キャベツ', 'にんじん']::text[], null, null),
  ('recipe-012', 'サーモンのマリネ', 'その他', '作ってみたい', 45, array['あっさり']::text[], null, array['サーモン', '玉ねぎ', 'レモン', 'オリーブオイル']::text[], null, null),
  ('recipe-013', 'ねばねばそうめん', '麺系', '作ってみたい', 15, array['簡単']::text[], null, array['そうめん', 'めんつゆ', 'おくら', 'きむち', '納豆']::text[], '水気をよくとる', null),
  ('recipe-014', 'オムライス', 'ごはん系', '作ってみたい', 25, array['定番']::text[], null, array['ごはん', '卵', '牛乳', '鶏肉', '玉ねぎ', 'ケチャップ']::text[], '卵に少し牛乳を入れる', null),
  ('recipe-015', 'はま寿司', '外食', null, null, array[]::text[], null, null, null, null)
on conflict (id) do nothing;

commit;
