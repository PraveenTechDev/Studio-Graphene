const {
  createExpense,
  deleteExpense,
  getSummary,
  listExpenses,
  updateExpense,
} = require("../services/expenseService");
const { toExpenseCsv } = require("../utils/csv");
const { validateExpenseInput } = require("../utils/validation");

async function getExpenses(req, res, next) {
  try {
    const expenses = await listExpenses(req.query);
    res.json({ data: expenses });
  } catch (error) {
    next(error);
  }
}

async function postExpense(req, res, next) {
  try {
    const validation = validateExpenseInput(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        message: "Validation failed.",
        errors: validation.errors,
      });
    }

    const expense = await createExpense(validation.value);
    return res.status(201).json({ data: expense });
  } catch (error) {
    next(error);
  }
}

async function putExpense(req, res, next) {
  try {
    const validation = validateExpenseInput(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        message: "Validation failed.",
        errors: validation.errors,
      });
    }

    const expense = await updateExpense(req.params.id, validation.value);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found." });
    }

    return res.json({ data: expense });
  } catch (error) {
    next(error);
  }
}

async function removeExpense(req, res, next) {
  try {
    const deleted = await deleteExpense(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Expense not found." });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function getExpenseSummary(req, res, next) {
  try {
    const summary = await getSummary(req.query);
    res.json({ data: summary });
  } catch (error) {
    next(error);
  }
}

async function exportExpenses(req, res, next) {
  try {
    const expenses = await listExpenses(req.query);
    const csv = toExpenseCsv(expenses);

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=expenses.csv");
    res.send(csv);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  exportExpenses,
  getExpenseSummary,
  getExpenses,
  postExpense,
  putExpense,
  removeExpense,
};
