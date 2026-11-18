import { categories, statuses, tags, type Category, type Filters, type Status } from "@/types/recipe";

export function RecipeFilters({ value, onChange, advanced = false }: {
  value: Filters;
  onChange: (value: Filters) => void;
  advanced?: boolean;
}) {
  return (
    <div className="filter-fields">
      <label>ジャンル
        <select value={value.category} onChange={(event) => onChange({ ...value, category: event.target.value as Category | "" })}>
          <option value="">すべて</option>
          {categories.map((category) => <option key={category}>{category}</option>)}
        </select>
      </label>
      <label>料理の状態
        <select value={value.status} onChange={(event) => onChange({ ...value, status: event.target.value as Status | "" })}>
          <option value="">すべて</option>
          {statuses.map((status) => <option key={status}>{status}</option>)}
        </select>
      </label>
      {advanced && (
        <>
          <fieldset>
            <legend>調理時間</legend>
            <div className="choices">
              {[null, 15, 30, 60].map((minutes) => (
                <label className="choice" key={minutes ?? "all"}>
                  <input type="radio" name="cooking-time" checked={value.maxTime === minutes} onChange={() => onChange({ ...value, maxTime: minutes })} />
                  <span>{minutes === null ? "指定なし" : `${minutes}分以内`}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>タグ <small>複数選択可</small></legend>
            <div className="choices">
              {tags.map((tag) => (
                <label className="choice" key={tag}>
                  <input type="checkbox" checked={value.tags.includes(tag)} onChange={(event) => onChange({
                    ...value,
                    tags: event.target.checked ? [...value.tags, tag] : value.tags.filter((selected) => selected !== tag),
                  })} />
                  <span>{tag}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </>
      )}
    </div>
  );
}