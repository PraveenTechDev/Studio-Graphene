"use client";

import { formatCurrency, formatDate } from "../lib/format";

export default function ExpensesTable({
  expenses,
  loading,
  onDelete,
  onEdit,
  pendingDeleteId,
}) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-zinc-900">Expenses</h2>
        <p className="text-xs text-zinc-500">
          Newest items first, with quick edit and delete actions.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200">
          <thead>
            <tr className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Category</th>
              <th className="py-2 pr-4">Note</th>
              <th className="py-2 pr-4">Amount</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {loading ? (
              <tr>
                <td className="py-6 text-sm text-zinc-500" colSpan="5">
                  Loading expenses...
                </td>
              </tr>
            ) : expenses.length === 0 ? (
              <tr>
                <td className="py-6 text-sm text-zinc-500" colSpan="5">
                  No expenses match the current filters.
                </td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr className="align-top" key={expense.id}>
                  <td className="py-3 pr-4 text-sm text-zinc-700 whitespace-nowrap">{formatDate(expense.date)}</td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
                      {expense.category}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-sm text-zinc-600 truncate max-w-[200px]">{expense.note || "—"}</td>
                  <td className="py-3 pr-4 text-sm font-semibold text-zinc-900 whitespace-nowrap">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="py-3 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50"
                        onClick={() => onEdit(expense)}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={pendingDeleteId === expense.id}
                        onClick={() => onDelete(expense.id)}
                        type="button"
                      >
                        {pendingDeleteId === expense.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
