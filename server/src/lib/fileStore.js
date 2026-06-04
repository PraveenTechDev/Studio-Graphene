const fs = require("fs/promises");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");
const expensesPath = path.join(dataDir, "expenses.json");
const budgetsPath = path.join(dataDir, "budgets.json");

async function readJson(filePath, fallback) {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    if (error.code === "ENOENT") {
      return fallback;
    }

    throw error;
  }
}

async function writeJson(filePath, value) {
  await fs.writeFile(filePath, JSON.stringify(value, null, 2));
}

async function readExpenses() {
  return readJson(expensesPath, []);
}

async function writeExpenses(expenses) {
  return writeJson(expensesPath, expenses);
}

async function readBudgets() {
  return readJson(budgetsPath, {});
}

async function writeBudgets(budgets) {
  return writeJson(budgetsPath, budgets);
}

module.exports = {
  dataDir,
  expensesPath,
  budgetsPath,
  readExpenses,
  writeExpenses,
  readBudgets,
  writeBudgets,
};
