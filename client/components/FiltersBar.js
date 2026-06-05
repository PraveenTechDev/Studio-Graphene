"use client";

import { categories, datePresets } from "../lib/constants";

export default function FiltersBar({ filters, onChange, onReset }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-5 items-end">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-zinc-700">Category</span>
          <input
            list="filter-category-options"
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 outline-none transition focus:border-indigo-500 focus:bg-white text-sm"
            onChange={(event) => onChange("category", event.target.value)}
            value={filters.category}
            placeholder="All categories"
            autoComplete="off"
          />
          <datalist id="filter-category-options">
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-zinc-700">Date range</span>
          <select
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 outline-none transition focus:border-indigo-500 focus:bg-white text-sm"
            onChange={(event) => onChange("preset", event.target.value)}
            value={filters.preset}
          >
            {datePresets.map((preset) => (
              <option key={preset.value} value={preset.value}>
                {preset.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-zinc-700">Start date (Custom)</span>
          <input
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 outline-none transition focus:border-indigo-500 focus:bg-white text-sm"
            onChange={(event) => onChange("startDate", event.target.value)}
            type="date"
            value={filters.startDate}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-zinc-700">End date (Custom)</span>
          <input
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 outline-none transition focus:border-indigo-500 focus:bg-white text-sm"
            onChange={(event) => onChange("endDate", event.target.value)}
            type="date"
            value={filters.endDate}
          />
        </label>

        <div className="flex">
          <button
            onClick={onReset}
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 shadow-sm"
            type="button"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
