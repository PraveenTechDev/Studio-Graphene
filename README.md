# FlowSpend

FlowSpend is a full-stack submission for Studio Graphene's Exercise 2: Mini Expense Tracker. It uses a Next.js frontend and an Express backend to let a single user add, edit, delete, filter, summarize, budget, and export expenses with a responsive dashboard and JSON-file persistence.

## Live Demo Links

- **Frontend:** [https://studio-graphene-1.onrender.com](https://studio-graphene-1.onrender.com)
- **Backend API Base:** [https://studio-graphene-g3fm.onrender.com/api](https://studio-graphene-g3fm.onrender.com/api)

## Tech Stack

- Next.js with React for the frontend, because it gives a clean component model and simple local development.
- Tailwind CSS for fast, consistent styling without mixing large amounts of custom CSS into components.
- Express for the backend, because it keeps the REST layer straightforward and easy to review.
- JSON file storage for persistence, because it satisfies the exercise scope without introducing database setup overhead.
- Recharts for the category summary chart.
- Vitest and Supertest for a small backend test pass around API behavior.

## How to Run Locally

Assumption: only Node.js and npm are installed.

```bash
npm install
npm run install:all
npm run dev
```

Frontend: [http://localhost:3000](http://localhost:3000)  
Backend: [http://localhost:4000/api/health](http://localhost:4000/api/health)

If you want to run the apps separately:

```bash
npm run dev --prefix server
npm run dev --prefix client
```

## API Documentation

### `GET /api/health`

Response:

```json
{ "ok": true }
```

### `GET /api/expenses`

Query params:

- `category` optional string
- `startDate` optional `YYYY-MM-DD`
- `endDate` optional `YYYY-MM-DD`

Response:

```json
{
  "data": [
    {
      "id": "uuid",
      "amount": 245.5,
      "category": "Food",
      "date": "2026-06-02",
      "note": "Team lunch"
    }
  ]
}
```

### `POST /api/expenses`

Request body:

```json
{
  "amount": 450,
  "category": "Bills",
  "date": "2026-06-03",
  "note": "Electricity"
}
```

Response:

```json
{
  "data": {
    "id": "uuid",
    "amount": 450,
    "category": "Bills",
    "date": "2026-06-03",
    "note": "Electricity"
  }
}
```

### `PUT /api/expenses/:id`

Request body: same as `POST /api/expenses`

Response:

```json
{
  "data": {
    "id": "uuid",
    "amount": 500,
    "category": "Bills",
    "date": "2026-06-03",
    "note": "Updated note"
  }
}
```

### `DELETE /api/expenses/:id`

Response: `204 No Content`

### `GET /api/summary`

Query params:

- `month` optional `YYYY-MM`

Response:

```json
{
  "data": {
    "month": "2026-06",
    "totalSpent": 1445.5,
    "highestExpense": {
      "id": "exp_2",
      "amount": 1200,
      "category": "Bills",
      "date": "2026-06-01",
      "note": "Internet bill"
    },
    "totalsByCategory": [
      {
        "category": "Food",
        "spent": 245.5,
        "budget": 5000,
        "exceeded": false
      }
    ]
  }
}
```

### `GET /api/expenses/export`

Query params: same as `GET /api/expenses`

Response: CSV download of the visible expenses

### `GET /api/budgets`

Response:

```json
{
  "data": [
    { "category": "Food", "amount": 5000 },
    { "category": "Transport", "amount": 2500 }
  ]
}
```

### `PUT /api/budgets/:category`

Request body:

```json
{ "amount": 6500 }
```

Response:

```json
{
  "data": {
    "Food": 6500,
    "Transport": 2500,
    "Bills": 12000,
    "Entertainment": 4000,
    "Other": 3000
  }
}
```

## Project Structure

```text
.
├── client
│   ├── app
│   ├── components
│   └── lib
├── server
│   ├── src
│   │   ├── controllers
│   │   ├── data
│   │   ├── lib
│   │   ├── routes
│   │   ├── services
│   │   └── utils
│   └── tests
└── README.md
```

- `client/app`: app router entry files and page shell
- `client/components`: form, filters, summary, and table components
- `client/lib`: API helpers, constants, formatters, and date utilities
- `server/src/controllers`: request handlers
- `server/src/services`: expense and budget business logic
- `server/src/lib`: persistence utilities and shared constants
- `server/src/utils`: validation, date helpers, and CSV generation
- `server/src/data`: seeded JSON storage
- `server/tests`: backend API tests

## Next Steps

- Add debounced budget updates instead of firing on every input change.
- Improve summary handling for custom date ranges so the summary can aggregate across multiple months instead of anchoring to the start month.
- Add a dedicated toast system and stronger field-level backend error mapping in the UI.

## What Works

- Add, edit, delete, filter, summarize, and export expenses
- Monthly category chart and highest-expense summary
- JSON-file persistence between restarts
- Category budgets with overspend indicators
- UI organized via Tabs (Dashboard / Table View), Modals for Expense editing, and Drawers for Export Settings

## What Does Not


- The summary endpoint is month-based, so a custom date range spanning multiple months does not produce a true cross-range summary.
- Budget updates are immediate rather than save-button based, which is functional but not ideal UX.
