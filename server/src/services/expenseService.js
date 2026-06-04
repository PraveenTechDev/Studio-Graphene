const { randomUUID } = require("crypto");
const { EXPENSE_CATEGORIES } = require("../lib/constants");
const { readBudgets, readExpenses, writeBudgets, writeExpenses } = require("../lib/fileStore");
const { getCurrentMonthKey, getMonthWindow } = require("../utils/date");

function sortExpenses(expenses) {
  return [...expenses].sort((left, right) => {
    if (left.date === right.date) {
      return right.id.localeCompare(left.id);
    }

    return right.date.localeCompare(left.date);
  });
}

function applyExpenseFilters(expenses, filters) {
  return expenses.filter((expense) => {
    const matchesCategory = !filters.category || expense.category === filters.category;
    const matchesStartDate = !filters.startDate || expense.date >= filters.startDate;
    const matchesEndDate = !filters.endDate || expense.date <= filters.endDate;

    return matchesCategory && matchesStartDate && matchesEndDate;
  });
}

async function listExpenses(filters = {}) {
  const expenses = await readExpenses();
  return sortExpenses(applyExpenseFilters(expenses, filters));
}

async function createExpense(input) {
  const expenses = await readExpenses();
  const expense = {
    id: randomUUID(),
    ...input,
  };

  expenses.push(expense);
  await writeExpenses(expenses);

  return expense;
}

async function updateExpense(id, input) {
  const expenses = await readExpenses();
  const expenseIndex = expenses.findIndex((expense) => expense.id === id);

  if (expenseIndex === -1) {
    return null;
  }

  expenses[expenseIndex] = {
    ...expenses[expenseIndex],
    ...input,
  };

  await writeExpenses(expenses);
  return expenses[expenseIndex];
}

async function deleteExpense(id) {
  const expenses = await readExpenses();
  const nextExpenses = expenses.filter((expense) => expense.id !== id);

  if (nextExpenses.length === expenses.length) {
    return false;
  }

  await writeExpenses(nextExpenses);
  return true;
}

async function getBudgets() {
  return readBudgets();
}

async function updateBudget(category, amount) {
  const budgets = await readBudgets();
  budgets[category] = amount;
  await writeBudgets(budgets);
  return budgets;
}

async function getSummary(params = {}) {
  const { month, startDate: customStartDate, endDate: customEndDate } = params;
  const expenses = await readExpenses();
  const budgets = await readBudgets();
  
  let startDate, endDate;
  
  if (customStartDate && customEndDate) {
    startDate = customStartDate;
    endDate = customEndDate;
  } else {
    const window = getMonthWindow(month || getCurrentMonthKey());
    startDate = window.startDate;
    endDate = window.endDate;
  }

  const rangeExpenses = applyExpenseFilters(expenses, { startDate, endDate });
  const totalSpent = rangeExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const highestExpense = rangeExpenses.reduce((highest, expense) => {
    if (!highest || expense.amount > highest.amount) {
      return expense;
    }

    return highest;
  }, null);

  const allCategories = new Set(EXPENSE_CATEGORIES);
  rangeExpenses.forEach((expense) => allCategories.add(expense.category));
  Object.keys(budgets).forEach((category) => allCategories.add(category));

  const totalsByCategory = Array.from(allCategories).map((category) => {
    const spent = rangeExpenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
    const budget = budgets[category] ?? 0;

    return {
      category,
      spent,
      budget,
      exceeded: budget > 0 && spent > budget,
    };
  });

  return {
    month: month || "custom",
    startDate,
    endDate,
    totalSpent,
    highestExpense,
    totalsByCategory,
  };
}

module.exports = {
  createExpense,
  deleteExpense,
  getBudgets,
  getSummary,
  listExpenses,
  updateBudget,
  updateExpense,
};
