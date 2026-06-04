const { EXPENSE_CATEGORIES } = require("../lib/constants");
const { isFutureDate, isValidDateString } = require("./date");

function validateExpenseInput(input) {
  const errors = {};
  const amount = Number(input.amount);
  const category = input.category;
  const date = input.date;
  const note = typeof input.note === "string" ? input.note.trim() : "";

  if (!Number.isFinite(amount) || amount <= 0) {
    errors.amount = "Amount must be a positive number.";
  }

  if (typeof category !== "string" || category.trim().length === 0) {
    errors.category = "Category is required.";
  }

  if (!isValidDateString(date)) {
    errors.date = "Date must be in YYYY-MM-DD format.";
  } else if (isFutureDate(date)) {
    errors.date = "Date cannot be in the future.";
  }

  if (note.length > 120) {
    errors.note = "Note must be 120 characters or fewer.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    value: {
      amount,
      category,
      date,
      note,
    },
  };
}

function validateBudgetInput(input) {
  const value = Number(input.amount);

  if (!Number.isFinite(value) || value < 0) {
    return {
      isValid: false,
      error: "Budget must be zero or a positive number.",
    };
  }

  return {
    isValid: true,
    value,
  };
}

module.exports = {
  validateBudgetInput,
  validateExpenseInput,
};
