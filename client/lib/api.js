const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let payload = {};

    try {
      payload = await response.json();
    } catch {
      payload = {};
    }

    const error = new Error(payload.message || "Request failed");
    if (payload.errors) {
      error.errors = payload.errors;
    }
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("text/csv")) {
    return response.text();
  }

  return response.json();
}

export async function fetchExpenses(filters) {
  const query = new URLSearchParams();

  if (filters.category) {
    query.set("category", filters.category);
  }

  if (filters.startDate) {
    query.set("startDate", filters.startDate);
  }

  if (filters.endDate) {
    query.set("endDate", filters.endDate);
  }

  const response = await request(`/expenses?${query.toString()}`);
  return response.data;
}

export async function createExpense(payload) {
  const response = await request("/expenses", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateExpense(id, payload) {
  const response = await request(`/expenses/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function deleteExpense(id) {
  return request(`/expenses/${id}`, {
    method: "DELETE",
  });
}

export async function fetchSummary(filters) {
  const query = new URLSearchParams();

  if (typeof filters === "string") {
    query.set("month", filters);
  } else {
    if (filters.month) query.set("month", filters.month);
    if (filters.startDate) query.set("startDate", filters.startDate);
    if (filters.endDate) query.set("endDate", filters.endDate);
  }

  const response = await request(`/summary?${query.toString()}`);
  return response.data;
}

export async function fetchBudgets() {
  const response = await request("/budgets");
  return response.data;
}

export async function updateBudget(category, amount) {
  const response = await request(`/budgets/${category}`, {
    method: "PUT",
    body: JSON.stringify({ amount }),
  });

  return response.data;
}

export async function exportExpenses(filters) {
  const query = new URLSearchParams();

  if (filters.category) {
    query.set("category", filters.category);
  }

  if (filters.startDate) {
    query.set("startDate", filters.startDate);
  }

  if (filters.endDate) {
    query.set("endDate", filters.endDate);
  }

  return request(`/expenses/export?${query.toString()}`, {
    headers: {
      Accept: "text/csv",
    },
  });
}
