"use client";

import { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formatCurrency } from "../lib/format";

const COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6", "#ec4899", "#3b82f6", "#14b8a6", "#84cc16"];

export default function SummaryPanel({ summary, budgets, onBudgetChange, savingBudget }) {
  const highestExpenseAmount = summary?.highestExpense?.amount || 0;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const pieData = (summary?.totalsByCategory || []).filter(item => item.spent > 0);

  return (
    <section className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-zinc-900 p-5 text-white shadow-sm">
          <p className="text-xs font-medium text-zinc-400">Total spent this month</p>
          <p className="mt-2 text-2xl font-bold tracking-tight">{formatCurrency(summary?.totalSpent || 0)}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-zinc-500">Highest single expense</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">
            {formatCurrency(highestExpenseAmount)}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {summary?.highestExpense
              ? `${summary.highestExpense.category} on ${summary.highestExpense.date}`
              : "No expenses yet this month"}
          </p>
        </div>
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-5 shadow-sm">
          <p className="text-xs font-medium text-indigo-700">Tracked categories</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-indigo-900">
            {summary?.totalsByCategory?.filter((item) => item.spent > 0).length || 0}
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-zinc-900">Category summary</h2>
            <p className="text-xs text-zinc-500">
              Current month totals with a simple spend breakdown.
            </p>
          </div>
          <div className="flex-1 min-h-[250px] text-xs relative">
            {mounted ? (
              pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={4}
                      dataKey="spent"
                      nameKey="category"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatCurrency(value)} 
                      contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-400">
                  No expenses to display
                </div>
              )
            ) : null}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm h-96 flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-zinc-900">Budgets</h2>
            <p className="text-xs text-zinc-500">
              Update category budgets and watch for overspending.
            </p>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1 pr-1">
            {(summary?.totalsByCategory || []).map((item) => (
              <div
                className="rounded-lg border border-zinc-200 bg-zinc-50 p-3"
                key={item.category}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{item.category}</p>
                    <p className="text-xs text-zinc-500">
                      Spent {formatCurrency(item.spent)}
                    </p>
                  </div>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      item.exceeded
                        ? "bg-red-100 text-red-700"
                        : "bg-indigo-100 text-indigo-700"
                    }`}
                  >
                    {item.exceeded ? "Over" : "On track"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    className="w-full rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    min="0"
                    onChange={(event) => onBudgetChange(item.category, event.target.value)}
                    type="number"
                    value={budgets[item.category] ?? ""}
                  />
                  <div className="min-w-24 text-right text-xs font-medium text-zinc-600">
                    {savingBudget === item.category ? "Saving..." : formatCurrency(item.budget)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
