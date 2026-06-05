"use client";

import { useEffect, useState } from "react";
import { categories } from "../lib/constants";
import { getTodayString } from "../lib/date";

const initialForm = {
  amount: "",
  category: "Food",
  date: getTodayString(),
  note: "",
};

export default function ExpenseForm({
  editingExpense,
  onCancel,
  onSubmit,
  submitting,
  serverErrors = {},
}) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingExpense) {
      setForm({
        amount: String(editingExpense.amount),
        category: editingExpense.category,
        date: editingExpense.date,
        note: editingExpense.note || "",
      });
      setErrors({});
      return;
    }

    setForm(initialForm);
    setErrors({});
  }, [editingExpense]);

  // Sync server errors into local errors state
  useEffect(() => {
    if (Object.keys(serverErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...serverErrors }));
    }
  }, [serverErrors]);

  function validate() {
    const nextErrors = {};
    const amount = Number(form.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      nextErrors.amount = "Enter a positive amount.";
    }

    if (!form.category) {
      nextErrors.category = "Choose a category.";
    }

    if (!form.date) {
      nextErrors.date = "Choose a date.";
    } else if (form.date > getTodayString()) {
      nextErrors.date = "Future dates are not allowed.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit({
      amount: Number(form.amount),
      category: form.category,
      date: form.date,
      note: form.note.trim(),
    });

    if (!editingExpense) {
      setForm(initialForm);
    }
  }

  function updateField(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return (
    <div className="space-y-4">
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-zinc-700">Amount</span>
          <input
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 outline-none transition focus:border-indigo-500 focus:bg-white text-sm"
            min="0"
            name="amount"
            onChange={(event) => updateField("amount", event.target.value)}
            placeholder="1200"
            step="0.01"
            type="number"
            value={form.amount}
          />
          {errors.amount ? <p className="mt-1.5 text-xs text-red-600">{errors.amount}</p> : null}
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-zinc-700">Category</span>
          <input
            list="category-options"
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 outline-none transition focus:border-indigo-500 focus:bg-white text-sm"
            name="category"
            onChange={(event) => updateField("category", event.target.value)}
            value={form.category}
            placeholder="e.g. Food, Travel..."
            autoComplete="off"
          />
          <datalist id="category-options">
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
          {errors.category ? (
            <p className="mt-1.5 text-xs text-red-600">{errors.category}</p>
          ) : null}
        </label>

        <label className="block md:col-span-2">
          <span className="mb-1.5 block text-xs font-medium text-zinc-700">Date</span>
          <input
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 outline-none transition focus:border-indigo-500 focus:bg-white text-sm"
            max={getTodayString()}
            name="date"
            onChange={(event) => updateField("date", event.target.value)}
            type="date"
            value={form.date}
          />
          {errors.date ? <p className="mt-1.5 text-xs text-red-600">{errors.date}</p> : null}
        </label>

        <label className="block md:col-span-2">
          <span className="mb-1.5 block text-xs font-medium text-zinc-700">Note</span>
          <input
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 outline-none transition focus:border-indigo-500 focus:bg-white text-sm"
            maxLength="120"
            name="note"
            onChange={(event) => updateField("note", event.target.value)}
            placeholder="Optional note"
            type="text"
            value={form.note}
          />
        </label>

        <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-zinc-100">
          <button
            className="inline-flex items-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 shadow-sm"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
            disabled={submitting}
            type="submit"
          >
            {submitting ? "Saving..." : editingExpense ? "Update expense" : "Add expense"}
          </button>
        </div>
      </form>
    </div>
  );
}
