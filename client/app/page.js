"use client";

import { useEffect, useMemo, useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpensesTable from "../components/ExpensesTable";
import FiltersBar from "../components/FiltersBar";
import SummaryPanel from "../components/SummaryPanel";
import Modal from "../components/Modal";
import Drawer from "../components/Drawer";
import {
  createExpense,
  deleteExpense,
  exportExpenses,
  fetchBudgets,
  fetchExpenses,
  fetchSummary,
  updateBudget,
  updateExpense,
} from "../lib/api";
import { getDateRangeFromPreset, getMonthKey } from "../lib/date";

const defaultRange = getDateRangeFromPreset("this-month");

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const [filters, setFilters] = useState({
    category: "",
    preset: "this-month",
    startDate: defaultRange.startDate,
    endDate: defaultRange.endDate,
  });
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [budgets, setBudgets] = useState({});
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState("");
  const [savingBudget, setSavingBudget] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const summaryMonth = useMemo(() => {
    if (filters.preset === "last-month") {
      return getDateRangeFromPreset("last-month").month;
    }

    if (filters.preset === "custom" && filters.startDate) {
      return filters.startDate.slice(0, 7);
    }

    return getMonthKey();
  }, [filters.preset, filters.startDate]);

  async function loadDashboard(activeFilters = filters, activeSummaryMonth = summaryMonth) {
    setLoading(true);
    setErrorMessage("");

    try {
      const [expenseData, summaryData, budgetData] = await Promise.all([
        fetchExpenses(activeFilters),
        fetchSummary(activeSummaryMonth),
        fetchBudgets(),
      ]);

      setExpenses(expenseData);
      setSummary(summaryData);
      setBudgets(
        budgetData.reduce((accumulator, item) => {
          accumulator[item.category] = item.amount;
          return accumulator;
        }, {})
      );
    } catch (error) {
      setErrorMessage(error.message || "Unable to load data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard(filters, summaryMonth);
  }, [filters, summaryMonth]);

  function handleFilterChange(key, value) {
    setFilters((current) => {
      if (key === "preset" && value !== "custom") {
        const nextRange = getDateRangeFromPreset(value);
        return {
          ...current,
          preset: value,
          startDate: nextRange.startDate,
          endDate: nextRange.endDate,
        };
      }

      if (key === "startDate" || key === "endDate") {
        return {
          ...current,
          preset: "custom",
          [key]: value,
        };
      }

      return {
        ...current,
        [key]: value,
      };
    });
  }

  function handleResetFilters() {
    setFilters({
      category: "",
      preset: "this-month",
      startDate: defaultRange.startDate,
      endDate: defaultRange.endDate,
    });
  }

  async function handleSubmit(payload) {
    setSubmitting(true);
    setErrorMessage("");

    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, payload);
        setEditingExpense(null);
      } else {
        await createExpense(payload);
      }
      setIsExpenseModalOpen(false);
      await loadDashboard(filters, summaryMonth);
    } catch (error) {
      setErrorMessage(error.message || "Unable to save expense.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    setPendingDeleteId(id);
    setErrorMessage("");

    try {
      await deleteExpense(id);
      await loadDashboard(filters, summaryMonth);
    } catch (error) {
      setErrorMessage(error.message || "Unable to delete expense.");
    } finally {
      setPendingDeleteId("");
    }
  }

  async function handleExport() {
    setExporting(true);
    setErrorMessage("");

    try {
      const csv = await exportExpenses(filters);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "expenses.csv";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setErrorMessage(error.message || "Unable to export CSV.");
    } finally {
      setExporting(false);
    }
  }

  async function handleBudgetChange(category, value) {
    setBudgets((current) => ({
      ...current,
      [category]: value,
    }));

    setSavingBudget(category);

    try {
      await updateBudget(category, Number(value || 0));
      const summaryData = await fetchSummary(summaryMonth);
      setSummary(summaryData);
    } catch (error) {
      setErrorMessage(error.message || "Unable to update budget.");
    } finally {
      setSavingBudget("");
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-6 text-sm text-zinc-900 md:px-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="rounded-xl border border-zinc-200 bg-white px-5 py-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              FlowSpend
            </p>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">
              Expense Tracker
            </h1>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 shadow-sm disabled:opacity-60"
              type="button"
            >
              {exporting ? "Exporting..." : "Export CSV"}
            </button>
            <button
              onClick={() => setIsFiltersVisible(!isFiltersVisible)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition shadow-sm ${
                isFiltersVisible 
                  ? "border-zinc-300 bg-zinc-100 text-zinc-900" 
                  : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
              }`}
              type="button"
            >
              {isFiltersVisible ? "Hide Filters" : "Show Filters"}
            </button>
            <button
              onClick={() => {
                setEditingExpense(null);
                setIsExpenseModalOpen(true);
              }}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 shadow-sm"
              type="button"
            >
              Add Expense
            </button>
          </div>
        </header>

        {isFiltersVisible && (
          <FiltersBar
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        )}

        {errorMessage ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="flex gap-2 border-b border-zinc-200 pb-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
              activeTab === "dashboard"
                ? "bg-zinc-900 text-white"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
            type="button"
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("table")}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
              activeTab === "table"
                ? "bg-zinc-900 text-white"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
            type="button"
          >
            Table View
          </button>
        </div>

        {activeTab === "dashboard" && (
          <SummaryPanel
            budgets={budgets}
            onBudgetChange={handleBudgetChange}
            savingBudget={savingBudget}
            summary={summary}
          />
        )}

        {activeTab === "table" && (
          <ExpensesTable
            expenses={expenses}
            loading={loading}
            onDelete={handleDelete}
            onEdit={(expense) => {
              setEditingExpense(expense);
              setIsExpenseModalOpen(true);
            }}
            pendingDeleteId={pendingDeleteId}
          />
        )}
      </div>

      <Modal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setEditingExpense(null);
          setServerErrors({});
        }}
        title={editingExpense ? "Edit Expense" : "Add Expense"}
      >
        <ExpenseForm
          editingExpense={editingExpense}
          onCancel={() => {
            setIsExpenseModalOpen(false);
            setEditingExpense(null);
            setServerErrors({});
          }}
          onSubmit={handleSubmit}
          submitting={submitting}
          serverErrors={serverErrors}
        />
      </Modal>
    </main>
  );
}
