const express = require("express");
const {
  exportExpenses,
  getExpenseSummary,
  getExpenses,
  postExpense,
  putExpense,
  removeExpense,
} = require("../controllers/expenseController");
const { listBudgets, putBudget } = require("../controllers/budgetController");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ ok: true });
});

router.get("/expenses", getExpenses);
router.get("/expenses/export", exportExpenses);
router.post("/expenses", postExpense);
router.put("/expenses/:id", putExpense);
router.delete("/expenses/:id", removeExpense);
router.get("/summary", getExpenseSummary);
router.get("/budgets", listBudgets);
router.put("/budgets/:category", putBudget);

module.exports = router;
