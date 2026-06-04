const { EXPENSE_CATEGORIES } = require("../lib/constants");
const { getBudgets, updateBudget } = require("../services/expenseService");
const { validateBudgetInput } = require("../utils/validation");

async function listBudgets(req, res, next) {
  try {
    const budgets = await getBudgets();
    const payload = EXPENSE_CATEGORIES.map((category) => ({
      category,
      amount: budgets[category] ?? 0,
    }));

    res.json({ data: payload });
  } catch (error) {
    next(error);
  }
}

async function putBudget(req, res, next) {
  try {
    const { category } = req.params;

    if (!EXPENSE_CATEGORIES.includes(category)) {
      return res.status(404).json({ message: "Category not found." });
    }

    const validation = validateBudgetInput(req.body);

    if (!validation.isValid) {
      return res.status(400).json({ message: validation.error });
    }

    const budgets = await updateBudget(category, validation.value);
    return res.json({ data: budgets });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listBudgets,
  putBudget,
};
