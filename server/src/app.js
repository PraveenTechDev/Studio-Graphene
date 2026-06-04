const express = require("express");
const cors = require("cors");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  })
);
app.use(express.json());

app.use("/api", expenseRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: "Something went wrong." });
});

module.exports = app;
