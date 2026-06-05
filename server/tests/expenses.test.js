const fs = require("fs/promises");
const {
  createExpense,
  getSummary,
  listExpenses,
} = require("../src/services/expenseService");
const { budgetsPath, expensesPath } = require("../src/lib/fileStore");

const seedExpenses = [
  {
    id: "exp_seed_1",
    amount: 250,
    category: "Food",
    date: "2026-06-02",
    note: "Lunch",
  },
  {
    id: "exp_seed_2",
    amount: 800,
    category: "Bills",
    date: "2026-06-01",
    note: "Utilities",
  },
];

const seedBudgets = {
  Food: 300,
  Transport: 500,
  Bills: 1000,
  Entertainment: 400,
  Other: 250,
};

beforeEach(async () => {
  await fs.writeFile(expensesPath, JSON.stringify(seedExpenses, null, 2));
  await fs.writeFile(budgetsPath, JSON.stringify(seedBudgets, null, 2));
});

describe("expense API", () => {
  it("creates an expense", async () => {
    await createExpense({
      amount: 120,
      category: "Transport",
      date: "2026-06-03",
      note: "Cab",
    });
    const expenses = await listExpenses({});
    const createdExpense = expenses.find((expense) => expense.note === "Cab");

    expect(createdExpense.category).toBe("Transport");
    expect(expenses).toHaveLength(3);
  });

  it("returns month summary with budget flags", async () => {
    const summary = await getSummary("2026-06");
    const foodSummary = summary.totalsByCategory.find((entry) => entry.category === "Food");

    expect(summary.totalSpent).toBe(1050);
    expect(foodSummary.exceeded).toBe(false);
  });
});
