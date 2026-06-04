function escapeCsv(value) {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  if (stringValue.includes(",") || stringValue.includes("\"") || stringValue.includes("\n")) {
    return `"${stringValue.replace(/"/g, "\"\"")}"`;
  }

  return stringValue;
}

function toExpenseCsv(expenses) {
  const headers = ["id", "amount", "category", "date", "note"];
  const rows = expenses.map((expense) =>
    headers.map((header) => escapeCsv(expense[header])).join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

module.exports = {
  toExpenseCsv,
};
